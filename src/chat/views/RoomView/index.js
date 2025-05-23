import React from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    InteractionManager,
    TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import {RectButton} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-navigation';
import {HeaderBackButton} from 'react-navigation-stack';
import {sanitizedRaw} from '@nozbe/watermelondb/RawRecord';
import moment from 'moment';
import * as Haptics from 'expo-haptics';
import {Q} from '@nozbe/watermelondb';
import isEqual from 'lodash/isEqual';

import {replyBroadcast as replyBroadcastAction} from '../../actions/messages';
import {List} from './List';
import database from '../../lib/database';
import RocketChat from '../../lib/rocketchat';
import Message from '../../containers/message';
import MessageActions from '../../containers/MessageActions';
import MessageErrorActions from '../../containers/MessageErrorActions';
import MessageBox from '../../containers/MessageBox';
import ReactionPicker from './ReactionPicker';
import UploadProgress from './UploadProgress';
import styles from './styles';
import log from '../../utils/log';
import EventEmitter from '../../utils/events';
import I18n from '../../i18n';
import RoomHeaderView, {RightButtons} from './Header';
import StatusBar from '../../containers/StatusBar';
import Separator from './Separator';
import {COLOR_WHITE, HEADER_BACK} from '../../constants/colors';
import debounce from '../../utils/debounce';
import FileModal from '../../containers/FileModal';
import ReactionsModal from '../../containers/ReactionsModal';
import {LISTENER} from '../../containers/Toast';
import {isReadOnly, isBlocked} from '../../utils/room';
import {isIOS} from '../../utils/deviceInfo';
import {showErrorAlert} from '../../utils/info';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {sendNotification as sendNotificationAction} from '../../../cityseeker/actions/notification';
import {WebModal} from '../../../common/views/components';
import Common from '../../../common/utils/lib';
import Style from '../../style';

const stateAttrsUpdate = [
    'joined',
    'lastOpen',
    'photoModalVisible',
    'reactionsModalVisible',
    'canAutoTranslate',
    'showActions',
    'showErrorActions',
    'loading',
    'editing',
    'replying',
    'reacting',
    'webModalVisible',
];
const roomAttrsUpdate = [
    'f',
    'ro',
    'blocked',
    'blocker',
    'archived',
    'muted',
    'jitsiTimeout',
];

class RoomView extends React.Component {
    static navigationOptions = ({navigation}) => {
        const rid = navigation.getParam('rid');
        const prid = navigation.getParam('prid');
        const title = navigation.getParam('name');
        const t = navigation.getParam('t');
        const tmid = navigation.getParam('tmid');
        const room = navigation.getParam('room');
        const toggleFollowThread = navigation.getParam(
            'toggleFollowThread',
            () => {},
        );
        const unreadsCount = navigation.getParam('unreadsCount', null);
        return {
            headerTitle: (
                <RoomHeaderView
                    rid={rid}
                    prid={prid}
                    tmid={tmid}
                    title={title}
                    type={t}
                    widthOffset={tmid ? 95 : 130}
                />
            ),
            headerRight: (
                <RightButtons
                    rid={rid}
                    tmid={tmid}
                    room={room}
                    t={t}
                    navigation={navigation}
                    toggleFollowThread={toggleFollowThread}
                />
            ),
            headerLeft: (
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <View
                        style={[
                            Style.p_l_3,
                            Style.row,
                            Style.row_center,
                            Style.column_center,
                        ]}>
                        <MaterialCommunityIcons
                            name="arrow-left"
                            style={[
                                Style.f_size_22,
                                Style.f_color_4,
                                Style.m_r_1,
                            ]}
                        />
                        <Text>
                            {unreadsCount > 999 ? '+999' : unreadsCount || ' '}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            ),
        };
    };

    static propTypes = {
        navigation: PropTypes.object,
        user: PropTypes.shape({
            id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            token: PropTypes.string.isRequired,
        }),
        appState: PropTypes.string,
        useRealName: PropTypes.bool,
        isAuthenticated: PropTypes.bool,
        Message_GroupingPeriod: PropTypes.number,
        Message_TimeFormat: PropTypes.string,
        Message_Read_Receipt_Enabled: PropTypes.bool,
        baseUrl: PropTypes.string,
        customEmojis: PropTypes.object,
        useMarkdown: PropTypes.bool,
        replyBroadcast: PropTypes.func,
    };

    constructor(props) {
        super(props);
        console.time(`${this.constructor.name} init`);
        console.time(`${this.constructor.name} mount`);
        this.rid = props.navigation.getParam('rid');
        this.t = props.navigation.getParam('t');
        this.tmid = props.navigation.getParam('tmid', null);
        const room = props.navigation.getParam('room');
        const selectedMessage = props.navigation.getParam('message');
        this.state = {
            joined: true,
            room: room || {rid: this.rid, t: this.t},
            roomUpdate: {},
            lastOpen: null,
            photoModalVisible: false,
            reactionsModalVisible: false,
            selectedAttachment: {},
            selectedMessage: selectedMessage || {},
            canAutoTranslate: false,
            loading: true,
            showActions: false,
            showErrorActions: false,
            editing: false,
            replying: !!selectedMessage,
            replyWithMention: false,
            reacting: false,
        };

        if (room && room.observe) {
            this.observeRoom(room);
        } else {
            this.findAndObserveRoom(this.rid);
        }

        this.beginAnimating = false;
        this.didFocusListener = props.navigation.addListener(
            'didFocus',
            () => (this.beginAnimating = true),
        );
        this.messagebox = React.createRef();
        this.list = React.createRef();
        this.willBlurListener = props.navigation.addListener(
            'willBlur',
            () => (this.mounted = false),
        );
        this.mounted = false;
        console.timeEnd(`${this.constructor.name} init`);
    }

    componentDidMount() {
        this.mounted = true;
        this.didMountInteraction = InteractionManager.runAfterInteractions(
            () => {
                const {room} = this.state;
                const {navigation, isAuthenticated} = this.props;
                if (room.id && !this.tmid) {
                    navigation.setParams({
                        name: this.getRoomTitle(room),
                        t: room.t,
                    });
                }
                if (this.tmid) {
                    navigation.setParams({
                        toggleFollowThread: this.toggleFollowThread,
                    });
                }
                if (isAuthenticated) {
                    this.init();
                } else {
                    EventEmitter.addEventListener(
                        'connected',
                        this.handleConnected,
                    );
                }
                if (isIOS) {
                    this.updateUnreadCount();
                }
            },
        );

        console.timeEnd(`${this.constructor.name} mount`);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {state} = this;
        const {roomUpdate} = state;
        const {appState} = this.props;
        if (appState !== nextProps.appState) {
            return true;
        }
        const stateUpdated = stateAttrsUpdate.some(
            key => nextState[key] !== state[key],
        );
        if (stateUpdated) {
            return true;
        }
        return roomAttrsUpdate.some(
            key => !isEqual(nextState.roomUpdate[key], roomUpdate[key]),
        );
    }

    componentDidUpdate(prevProps) {
        const {appState} = this.props;

        if (appState === 'foreground' && appState !== prevProps.appState) {
            this.onForegroundInteraction = InteractionManager.runAfterInteractions(
                () => {
                    this.init();
                },
            );
        }
        if (appState === 'background' && appState !== prevProps.appState) {
            this.unsubscribe();
        }
    }

    async componentWillUnmount() {
        const {editing, room} = this.state;
        const db = database.active;
        this.mounted = false;
        if (!editing && this.messagebox && this.messagebox.current) {
            const {text} = this.messagebox.current;
            let obj;
            if (this.tmid) {
                try {
                    const threadsCollection = db.collections.get('threads');
                    obj = await threadsCollection.find(this.tmid);
                } catch (e) {
                    // Do nothing
                }
            } else {
                obj = room;
            }
            if (obj) {
                try {
                    await db.action(async () => {
                        await obj.update(r => {
                            r.draftMessage = text;
                        });
                    });
                } catch (error) {
                    // Do nothing
                }
            }
        }
        this.unsubscribe();
        if (this.didFocusListener && this.didFocusListener.remove) {
            this.didFocusListener.remove();
        }
        if (this.didMountInteraction && this.didMountInteraction.cancel) {
            this.didMountInteraction.cancel();
        }
        if (
            this.onForegroundInteraction &&
            this.onForegroundInteraction.cancel
        ) {
            this.onForegroundInteraction.cancel();
        }
        if (this.initInteraction && this.initInteraction.cancel) {
            this.initInteraction.cancel();
        }
        if (this.willBlurListener && this.willBlurListener.remove) {
            this.willBlurListener.remove();
        }
        if (this.subSubscription && this.subSubscription.unsubscribe) {
            this.subSubscription.unsubscribe();
        }
        if (this.queryUnreads && this.queryUnreads.unsubscribe) {
            this.queryUnreads.unsubscribe();
        }
        EventEmitter.removeListener('connected', this.handleConnected);
        console.countReset(`${this.constructor.name}.render calls`);
    }

    // eslint-disable-next-line react/sort-comp
    init = () => {
        try {
            this.setState({loading: true});
            this.initInteraction = InteractionManager.runAfterInteractions(
                async () => {
                    const {room, joined} = this.state;
                    if (this.tmid) {
                        await this.getThreadMessages();
                    } else {
                        const newLastOpen = new Date();
                        await this.getMessages(room);

                        // if room is joined
                        if (joined) {
                            if (
                                room.alert ||
                                room.unread ||
                                room.userMentions
                            ) {
                                this.setLastOpen(room.ls);
                            } else {
                                this.setLastOpen(null);
                            }
                            RocketChat.readMessages(
                                room.rid,
                                newLastOpen,
                            ).catch(e => console.log(e));
                            this.unsubscribe();
                            this.sub = await RocketChat.subscribeRoom(room);
                        }
                    }

                    // We run `canAutoTranslate` again in order to refetch auto translate permission
                    // in case of a missing connection or poor connection on room open
                    const canAutoTranslate = await RocketChat.canAutoTranslate();
                    this.setState({canAutoTranslate, loading: false});
                },
            );
        } catch (e) {
            this.setState({loading: false});
            log(e);
        }
    };

    findAndObserveRoom = async rid => {
        try {
            const db = database.active;
            const {navigation} = this.props;
            const subCollection = await db.collections.get('subscriptions');
            const room = await subCollection.find(rid);
            this.setState({room});
            navigation.setParams({room});
            this.observeRoom(room);
        } catch (error) {
            if (this.t !== 'd') {
                console.log('Room not found');
                this.internalSetState({joined: false});
            } else {
                // We navigate to RoomView before the DM is inserted to the local db
                // So we retry just to make sure we have the right content
                this.retryFindCount = this.retryFindCount + 1 || 1;
                if (this.retryFindCount <= 3) {
                    this.retryFindTimeout = setTimeout(() => {
                        this.findAndObserveRoom(rid);
                        this.init();
                    }, 300);
                }
            }
        }
    };

    unsubscribe = () => {
        if (this.sub && this.sub.stop) {
            this.sub.stop();
        }
    };

    observeRoom = room => {
        const observable = room.observe();
        this.subSubscription = observable.subscribe(changes => {
            const roomUpdate = roomAttrsUpdate.reduce((ret, attr) => {
                ret[attr] = changes[attr];
                return ret;
            }, {});
            if (this.mounted) {
                this.internalSetState({room: changes, roomUpdate});
            } else {
                this.state.room = changes;
                this.state.roomUpdate = roomUpdate;
            }
        });
    };

    errorActionsShow = message => {
        this.setState({selectedMessage: message, showErrorActions: true});
    };

    onActionsHide = () => {
        const {editing, replying, reacting} = this.state;
        if (editing || replying || reacting) {
            return;
        }
        this.setState({selectedMessage: {}, showActions: false});
    };

    onErrorActionsHide = () => {
        this.setState({selectedMessage: {}, showErrorActions: false});
    };

    onEditInit = message => {
        this.setState({
            selectedMessage: message,
            editing: true,
            showActions: false,
        });
    };

    onEditCancel = () => {
        this.setState({selectedMessage: {}, editing: false});
    };

    onEditRequest = async message => {
        this.setState({selectedMessage: {}, editing: false});
        try {
            await RocketChat.editMessage(message);
        } catch (e) {
            log(e);
        }
    };

    onReplyInit = (message, mention) => {
        this.setState({
            selectedMessage: message,
            replying: true,
            showActions: false,
            replyWithMention: mention,
        });
    };

    onReplyCancel = () => {
        this.setState({selectedMessage: {}, replying: false});
    };

    onReactionInit = message => {
        this.setState({
            selectedMessage: message,
            reacting: true,
            showActions: false,
        });
    };

    onReactionClose = () => {
        this.setState({selectedMessage: {}, reacting: false});
    };

    onMessageLongPress = message => {
        this.setState({selectedMessage: message, showActions: true});
    };

    onOpenFileModal = attachment => {
        this.setState({
            selectedAttachment: attachment,
            photoModalVisible: true,
        });
    };

    onCloseFileModal = () => {
        this.setState({selectedAttachment: {}, photoModalVisible: false});
    };

    onReactionPress = async (shortname, messageId) => {
        try {
            await RocketChat.setReaction(shortname, messageId);
            this.onReactionClose();
        } catch (e) {
            log(e);
        }
    };

    onReactionLongPress = message => {
        this.setState({selectedMessage: message, reactionsModalVisible: true});
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    onCloseReactionsModal = () => {
        this.setState({selectedMessage: {}, reactionsModalVisible: false});
    };

    onDiscussionPress = debounce(
        item => {
            const {navigation} = this.props;
            navigation.push('RoomView', {
                rid: item.drid,
                prid: item.rid,
                name: item.msg,
                t: 'p',
            });
        },
        1000,
        true,
    );

    // eslint-disable-next-line react/sort-comp
    updateUnreadCount = async () => {
        const db = database.active;
        const observable = await db.collections
            .get('subscriptions')
            .query(
                Q.where('archived', false),
                Q.where('open', true),
                Q.where('rid', Q.notEq(this.rid)),
            )
            .observeWithColumns(['unread']);

        this.queryUnreads = observable.subscribe(data => {
            const {navigation} = this.props;
            const unreadsCount = data
                .filter(s => s.unread > 0)
                .reduce((a, b) => a + (b.unread || 0), 0);
            if (unreadsCount !== navigation.getParam('unreadsCount')) {
                navigation.setParams({
                    unreadsCount,
                });
            }
        });
    };

    onThreadPress = debounce(
        async item => {
            const {navigation} = this.props;
            if (item.tmid) {
                if (!item.tmsg) {
                    await this.fetchThreadName(item.tmid, item.id);
                }
                navigation.push('RoomView', {
                    rid: item.subscription.id,
                    tmid: item.tmid,
                    name: item.tmsg,
                    t: 'thread',
                });
            } else if (item.tlm) {
                navigation.push('RoomView', {
                    rid: item.subscription.id,
                    tmid: item.id,
                    name: item.msg,
                    t: 'thread',
                });
            }
        },
        1000,
        true,
    );

    replyBroadcast = message => {
        const {replyBroadcast} = this.props;
        replyBroadcast(message);
    };

    handleConnected = () => {
        this.init();
        EventEmitter.removeListener('connected', this.handleConnected);
    };

    internalSetState = (...args) => {
        if (!this.mounted) {
            return;
        }
        this.setState(...args);
    };

    sendMessage = (message, tmid) => {
        const {user, locale, sendNotification} = this.props;
        RocketChat.sendMessage(this.rid, message, this.tmid || tmid, user).then(
            async () => {
                if (this.list && this.list.current) {
                    this.list.current.update();
                }
                this.setLastOpen(null);

                const acceptUserId = RocketChat.getRoomMemberId(
                    this.rid,
                    user.id,
                );

                const {room} = this.state;

                if (
                    room.disableNotifications !== undefined &&
                    room.disableNotifications === false
                ) {
                    const userInfo = await RocketChat.getUserInfo(acceptUserId);

                    if (
                        userInfo.success !== undefined &&
                        userInfo.success === true &&
                        userInfo.user !== undefined &&
                        userInfo.user.customFields !== undefined &&
                        userInfo.user.customFields.uuid !== undefined &&
                        userInfo.user.customFields.uuid
                    ) {
                        sendNotification({
                            content: {
                                [locale]: I18n.t('new_notification'),
                            },
                            data: {
                                category: 'room',
                                params: {
                                    rid: room.rid,
                                    type: room.t,
                                    name: room.name,
                                    sender: {
                                        ...user,
                                    },
                                },
                            },
                            include_player_ids: null,
                            include_external_user_ids: [
                                userInfo.user.customFields.uuid,
                            ],
                        });
                    }
                }
            },
        );
    };

    getRoomTitle = room => {
        const {useRealName} = this.props;
        return ((room.prid || useRealName) && room.fname) || room.name;
    };

    getMessages = async () => {
        const {room} = this.state;
        try {
            if (room.lastOpen) {
                await RocketChat.loadMissedMessages(room);
            } else {
                await RocketChat.loadMessagesForRoom(room);
            }
            return Promise.resolve();
        } catch (e) {
            log(e);
        }
    };

    getThreadMessages = () => {
        try {
            return RocketChat.loadThreadMessages({
                tmid: this.tmid,
                rid: this.rid,
            });
        } catch (e) {
            log(e);
        }
    };

    getCustomEmoji = name => {
        const {customEmojis} = this.props;
        const emoji = customEmojis[name];
        if (emoji) {
            return emoji;
        }
        return null;
    };

    setLastOpen = lastOpen => this.setState({lastOpen});

    joinRoom = async () => {
        try {
            await RocketChat.joinRoom(this.rid, this.t);
            this.internalSetState({
                joined: true,
            });
        } catch (e) {
            log(e);
        }
    };

    // eslint-disable-next-line react/sort-comp
    fetchThreadName = async (tmid, messageId) => {
        try {
            const {room} = this.state;
            const db = database.active;
            const threadCollection = db.collections.get('threads');
            const messageCollection = db.collections.get('messages');
            const messageRecord = await messageCollection.find(messageId);
            let threadRecord;
            try {
                threadRecord = await threadCollection.find(tmid);
            } catch (error) {
                console.log('Thread not found. We have to search for it.');
            }
            if (threadRecord) {
                await db.action(async () => {
                    await messageRecord.update(m => {
                        m.tmsg =
                            threadRecord.msg ||
                            (threadRecord.attachments &&
                                threadRecord.attachments.length &&
                                threadRecord.attachments[0].title);
                    });
                });
            } else {
                const thread = await RocketChat.getSingleMessage(tmid);
                await db.action(async () => {
                    await db.batch(
                        threadCollection.prepareCreate(t => {
                            t._raw = sanitizedRaw(
                                {id: thread._id},
                                threadCollection.schema,
                            );
                            t.subscription.set(room);
                            Object.assign(t, thread);
                        }),
                        messageRecord.prepareUpdate(m => {
                            m.tmsg =
                                thread.msg ||
                                (thread.attachments &&
                                    thread.attachments.length &&
                                    thread.attachments[0].title);
                        }),
                    );
                });
            }
        } catch (e) {
            log(e);
        }
    };

    toggleFollowThread = async isFollowingThread => {
        try {
            await RocketChat.toggleFollowMessage(this.tmid, !isFollowingThread);
            // EventEmitter.emit(LISTENER, { message: isFollowingThread ? 'Unfollowed thread' : 'Following thread' });

            Common.showToast({
                message: (
                    <Text style={[Style.f_size_13, Style.f_weight_500]}>
                        {isFollowingThread
                            ? I18n.t('Unfollowed_thread')
                            : I18n.t('Following_thread')}
                    </Text>
                ),
                style: {
                    ...Style.bg_color_cityseeker,
                    ...Style.p_3,
                },
                config: {
                    duration: 2000,
                },
            });
        } catch (e) {
            log(e);
        }
    };

    navToRoomInfo = navParam => {
        const {navigation, user} = this.props;
        if (navParam.rid === user.id) {
            return;
        }
        navigation.navigate('RoomInfoView', navParam);
    };

    callJitsi = () => {
        const {room} = this.state;
        const {jitsiTimeout} = room;
        if (jitsiTimeout < Date.now()) {
            showErrorAlert(I18n.t('Call_already_ended'));
        } else {
            RocketChat.callJitsi(this.rid);
        }
    };

    get isReadOnly() {
        const {room} = this.state;
        const {user} = this.props;
        return isReadOnly(room, user);
    }

    renderItem = (item, previousItem) => {
        const {room, lastOpen, canAutoTranslate} = this.state;
        const {
            user,
            Message_GroupingPeriod,
            Message_TimeFormat,
            useRealName,
            baseUrl,
            useMarkdown,
            Message_Read_Receipt_Enabled,
            locale,
        } = this.props;
        let dateSeparator = null;
        let showUnreadSeparator = false;

        if (!previousItem) {
            dateSeparator = item.ts;
            showUnreadSeparator = moment(item.ts).isAfter(lastOpen);
        } else {
            showUnreadSeparator =
                lastOpen &&
                moment(item.ts).isAfter(lastOpen) &&
                moment(previousItem.ts).isBefore(lastOpen);
            if (!moment(item.ts).isSame(previousItem.ts, 'day')) {
                dateSeparator = item.ts;
            }
        }

        const message = (
            <Message
                item={item}
                user={user}
                archived={room.archived}
                broadcast={room.broadcast}
                status={item.status}
                isThreadRoom={!!this.tmid}
                previousItem={previousItem}
                fetchThreadName={this.fetchThreadName}
                onReactionPress={this.onReactionPress}
                onReactionLongPress={this.onReactionLongPress}
                onLongPress={this.onMessageLongPress}
                onDiscussionPress={this.onDiscussionPress}
                onThreadPress={this.onThreadPress}
                onOpenFileModal={this.onOpenFileModal}
                reactionInit={this.onReactionInit}
                replyBroadcast={this.replyBroadcast}
                errorActionsShow={this.errorActionsShow}
                baseUrl={baseUrl}
                Message_GroupingPeriod={Message_GroupingPeriod}
                timeFormat={Message_TimeFormat}
                useRealName={useRealName}
                useMarkdown={useMarkdown}
                isReadReceiptEnabled={Message_Read_Receipt_Enabled}
                autoTranslateRoom={canAutoTranslate && room.autoTranslate}
                autoTranslateLanguage={room.autoTranslateLanguage}
                navToRoomInfo={this.navToRoomInfo}
                getCustomEmoji={this.getCustomEmoji}
                callJitsi={this.callJitsi}
                key={item._id}
                room={room}
                onOpenWebModal={this._showWebModal}
            />
        );

        if (showUnreadSeparator || dateSeparator) {
            return (
                <>
                    {message}
                    <Separator
                        ts={dateSeparator}
                        unread={showUnreadSeparator}
                        locale={locale}
                    />
                </>
            );
        }

        return message;
    };

    renderFooter = () => {
        const {
            joined,
            room,
            selectedMessage,
            editing,
            replying,
            replyWithMention,
        } = this.state;
        const {navigation} = this.props;

        if (!joined && !this.tmid) {
            return (
                <View
                    style={[Style.row_end, Style.column_center, Style.m_v_1]}
                    key="room-view-join"
                    testID="room-view-join">
                    {/*<Text style={styles.previewMode}>*/}
                    {/*    {I18n.t('You_are_in_preview_mode')}*/}
                    {/*</Text>*/}
                    <RectButton
                        onPress={this.joinRoom}
                        style={[
                            Style.p_h_8,
                            Style.p_v_2,
                            Style.h_center,
                            Style.bg_color_gray,
                            Style.border_round_1,
                        ]}
                        // activeOpacity={0.5}
                        underlayColor={COLOR_WHITE}>
                        <Text
                            style={[
                                Style.f_color_4,
                                Style.f_size_13,
                                Style.f_bold,
                            ]}
                            testID="room-view-join-button">
                            {I18n.t('begin_to_chat')}
                        </Text>
                    </RectButton>
                </View>
            );
        }
        if (this.isReadOnly) {
            return (
                <View style={[Style.row_end, Style.column_center, Style.m_v_1]}>
                    <Text
                        style={[
                            Style.f_color_4,
                            Style.f_size_13,
                            Style.f_bold,
                        ]}>
                        {I18n.t('This_room_is_read_only')}
                    </Text>
                </View>
            );
        }
        if (isBlocked(room)) {
            return (
                <View style={[Style.row_end, Style.column_center, Style.m_v_1]}>
                    <Text
                        style={[
                            Style.f_color_4,
                            Style.f_size_13,
                            Style.f_bold,
                        ]}>
                        {I18n.t('This_room_is_blocked')}
                    </Text>
                </View>
            );
        }
        return (
            <MessageBox
                ref={this.messagebox}
                onSubmit={this.sendMessage}
                rid={this.rid}
                tmid={this.tmid}
                roomType={room.t}
                isFocused={navigation.isFocused}
                message={selectedMessage}
                editing={editing}
                editRequest={this.onEditRequest}
                editCancel={this.onEditCancel}
                replying={replying}
                replyWithMention={replyWithMention}
                replyCancel={this.onReplyCancel}
                getCustomEmoji={this.getCustomEmoji}
            />
        );
    };

    renderActions = () => {
        const {
            room,
            selectedMessage,
            showActions,
            showErrorActions,
            joined,
        } = this.state;
        const {user, navigation} = this.props;
        if (!navigation.isFocused()) {
            return null;
        }
        return (
            <>
                {joined && showActions ? (
                    <MessageActions
                        tmid={this.tmid}
                        room={room}
                        user={user}
                        message={selectedMessage}
                        actionsHide={this.onActionsHide}
                        editInit={this.onEditInit}
                        replyInit={this.onReplyInit}
                        reactionInit={this.onReactionInit}
                        isReadOnly={this.isReadOnly}
                    />
                ) : null}
                {showErrorActions ? (
                    <MessageErrorActions
                        tmid={this.tmid}
                        message={selectedMessage}
                        actionsHide={this.onErrorActionsHide}
                    />
                ) : null}
            </>
        );
    };

    _showWebModal = url => {
        this.setState({
            webUrl: url,
            webModalVisible: true,
        });
    };

    _hideWebModal = () => {
        this.setState({
            webModalVisible: false,
        });
    };

    render() {
        console.count(`${this.constructor.name}.render calls`);
        const {
            room,
            photoModalVisible,
            reactionsModalVisible,
            selectedAttachment,
            selectedMessage,
            loading,
            reacting,
            webModalVisible,
            webUrl,
        } = this.state;
        const {user, baseUrl} = this.props;
        const {rid, t} = room;

        return (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                testID="room-view"
                forceInset={{bottom: 'never'}}>
                <StatusBar />
                <List
                    ref={this.list}
                    rid={rid}
                    t={t}
                    tmid={this.tmid}
                    room={room}
                    renderRow={this.renderItem}
                    loading={loading}
                    animated={this.beginAnimating}
                />
                {this.renderFooter()}
                {this.renderActions()}
                <ReactionPicker
                    show={reacting}
                    message={selectedMessage}
                    onEmojiSelected={this.onReactionPress}
                    reactionClose={this.onReactionClose}
                />
                <UploadProgress rid={this.rid} user={user} baseUrl={baseUrl} />
                <FileModal
                    attachment={selectedAttachment}
                    isVisible={photoModalVisible}
                    onClose={this.onCloseFileModal}
                    user={user}
                    baseUrl={baseUrl}
                />
                <View style={[Style.top_horizontal]}>
                    <WebModal
                        url={webUrl}
                        visible={webModalVisible}
                        onDismiss={this._hideWebModal}
                    />
                </View>
                <ReactionsModal
                    message={selectedMessage}
                    isVisible={reactionsModalVisible}
                    user={user}
                    baseUrl={baseUrl}
                    onClose={this.onCloseReactionsModal}
                    getCustomEmoji={this.getCustomEmoji}
                />
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => ({
    user: {
        id: state.login.user && state.login.user.id,
        username: state.login.user && state.login.user.username,
        token: state.login.user && state.login.user.token,
    },
    appState:
        state.app.ready && state.app.foreground ? 'foreground' : 'background',
    useRealName: state.settings.UI_Use_Real_Name,
    isAuthenticated: state.login.isAuthenticated,
    Message_GroupingPeriod: state.settings.Message_GroupingPeriod,
    Message_TimeFormat: state.settings.Message_TimeFormat,
    useMarkdown: state.markdown.useMarkdown,
    customEmojis: state.customEmojis,
    baseUrl: state.settings.baseUrl || state.server ? state.server.server : '',
    Message_Read_Receipt_Enabled: state.settings.Message_Read_Receipt_Enabled,
    locale: state.system.locale,
});

const mapDispatchToProps = dispatch => ({
    replyBroadcast: message => dispatch(replyBroadcastAction(message)),
    sendNotification: params => dispatch(sendNotificationAction(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomView);
