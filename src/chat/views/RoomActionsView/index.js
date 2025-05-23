import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    SectionList,
    Text,
    Alert,
    Share,
    TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import {SafeAreaView} from 'react-navigation';

import {leaveRoom as leaveRoomAction} from '../../actions/room';
import styles from './styles';
import sharedStyles from '../Styles';
import Avatar from '../../containers/Avatar';
import Status from '../../containers/Status';
import Touch from '../../utils/touch';
import RocketChat from '../../lib/rocketchat';
import log from '../../utils/log';
import RoomTypeIcon from '../../containers/RoomTypeIcon';
import I18n from '../../i18n';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import {CustomIcon} from '../../lib/Icons';
import DisclosureIndicator from '../../containers/DisclosureIndicator';
import StatusBar from '../../containers/StatusBar';
import {COLOR_WHITE} from '../../constants/colors';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppConfig from '../../../common/config/app';
import Style from '../../style';

const renderSeparator = () => <View style={[Style.h_1, Style.bg_color_gray]} />;

const SHOW_USERS_COUNT = 100;

class RoomActionsView extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('detail'),
            headerLeft: (
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <View
                        style={[
                            Style.p_l_3,
                            Style.row_center,
                            Style.column_center,
                        ]}>
                        <MaterialCommunityIcons
                            name="arrow-left"
                            style={[Style.f_size_22, Style.f_color_4]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
        };
    };

    static propTypes = {
        baseUrl: PropTypes.string,
        navigation: PropTypes.object,
        user: PropTypes.shape({
            id: PropTypes.string,
            token: PropTypes.string,
        }),
        leaveRoom: PropTypes.func,
        jitsiEnabled: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.mounted = false;
        const room = props.navigation.getParam('room');
        this.rid = props.navigation.getParam('rid');
        this.t = props.navigation.getParam('t');
        this.state = {
            room: room || {rid: this.rid, t: this.t},
            membersCount: 0,
            member: {},
            joined: !!room,
            canViewMembers: false,
            canAutoTranslate: false,
            canAddUser: false,
        };
        if (room && room.observe) {
            this.roomObservable = room.observe();
            this.subscription = this.roomObservable.subscribe(changes => {
                if (this.mounted) {
                    this.setState({room: changes});
                } else {
                    this.state.room = changes;
                }
            });
        }
    }

    async componentDidMount() {
        this.mounted = true;
        const {room} = this.state;
        if (!room.id) {
            try {
                const result = await RocketChat.getChannelInfo(room.rid);
                if (result.success) {
                    this.setState({
                        room: {...result.channel, rid: result.channel._id},
                    });
                }
            } catch (e) {
                log(e);
            }
        }

        if (room && room.t !== 'd' && this.canViewMembers()) {
            try {
                const counters = await RocketChat.getRoomCounters(
                    room.rid,
                    room.t,
                );
                if (counters.success) {
                    this.setState({
                        membersCount: counters.members,
                        joined: counters.joined,
                    });
                }
            } catch (e) {
                log(e);
            }
        } else if (room.t === 'd') {
            this.updateRoomMember();
        }

        const canAutoTranslate = await RocketChat.canAutoTranslate();
        this.setState({canAutoTranslate});

        this.canAddUser();
    }

    componentWillUnmount() {
        if (this.subscription && this.subscription.unsubscribe) {
            this.subscription.unsubscribe();
        }
    }

    onPressTouchable = item => {
        if (item.route) {
            const {navigation} = this.props;
            navigation.navigate(item.route, item.params);
        }
        if (item.event) {
            return item.event();
        }
    };

    // TODO: move to componentDidMount
    // eslint-disable-next-line react/sort-comp
    canAddUser = async () => {
        const {room, joined} = this.state;
        const {rid, t} = room;
        let canAdd = false;

        const userInRoom = joined;
        const permissions = await RocketChat.hasPermission(
            [
                'add-user-to-joined-room',
                'add-user-to-any-c-room',
                'add-user-to-any-p-room',
            ],
            rid,
        );

        if (permissions) {
            if (userInRoom && permissions['add-user-to-joined-room']) {
                canAdd = true;
            }
            if (t === 'c' && permissions['add-user-to-any-c-room']) {
                canAdd = true;
            }
            if (t === 'p' && permissions['add-user-to-any-p-room']) {
                canAdd = true;
            }
        }
        this.setState({canAddUser: canAdd});
    };

    // TODO: move to componentDidMount
    // eslint-disable-next-line react/sort-comp
    canViewMembers = async () => {
        const {room} = this.state;
        const {rid, t, broadcast} = room;
        if (broadcast) {
            const viewBroadcastMemberListPermission =
                'view-broadcast-member-list';
            const permissions = await RocketChat.hasPermission(
                [viewBroadcastMemberListPermission],
                rid,
            );
            if (!permissions[viewBroadcastMemberListPermission]) {
                return false;
            }
        }

        // This method is executed only in componentDidMount and returns a value
        // We save the state to read in render
        const result = t === 'c' || t === 'p';
        this.setState({canViewMembers: result});
        return result;
    };

    get sections() {
        const {
            room,
            membersCount,
            canViewMembers,
            canAddUser,
            joined,
            canAutoTranslate,
        } = this.state;
        const {jitsiEnabled} = this.props;
        const {rid, t, blocker} = room;

        const notificationsAction = {
            icon: 'bell',
            name: I18n.t('Notifications'),
            route: 'NotificationPrefView',
            params: {rid, room},
            testID: 'room-actions-notifications',
        };

        const jitsiActions = jitsiEnabled
            ? [
                  {
                      icon: 'microphone-fill',
                      name: I18n.t('Voice_call'),
                      event: () => RocketChat.callJitsi(rid, true),
                      testID: 'room-actions-voice',
                  },
                  {
                      icon: 'video-camera',
                      name: I18n.t('Video_call'),
                      event: () => RocketChat.callJitsi(rid),
                      testID: 'room-actions-video',
                  },
              ]
            : [];

        const sections = [
            {
                data: [
                    {
                        icon: 'star',
                        name: I18n.t('Room_Info'),
                        // route: 'RoomInfoView',
                        // forward room only if room isn't joined
                        params: {rid, t, room},
                        testID: 'room-actions-info',
                    },
                ],
                renderItem: this.renderRoomInfo,
            },
            {
                data: jitsiActions,
                renderItem: this.renderItem,
            },
            // {
            //     data: [
            //         {
            //             icon: 'file-generic',
            //             name: I18n.t('Files'),
            //             route: 'MessagesView',
            //             params: {rid, t, name: 'Files'},
            //             testID: 'room-actions-files',
            //         },
            //         {
            //             icon: 'at',
            //             name: I18n.t('Mentions'),
            //             route: 'MessagesView',
            //             params: {rid, t, name: 'Mentions'},
            //             testID: 'room-actions-mentioned',
            //         },
            //         {
            //             icon: 'star',
            //             name: I18n.t('Starred'),
            //             route: 'MessagesView',
            //             params: {rid, t, name: 'Starred'},
            //             testID: 'room-actions-starred',
            //         },
            //         {
            //             icon: 'magnifier',
            //             name: I18n.t('Search'),
            //             route: 'SearchMessagesView',
            //             params: {rid},
            //             testID: 'room-actions-search',
            //         },
            //         {
            //             icon: 'share',
            //             name: I18n.t('Share'),
            //             event: this.handleShare,
            //             testID: 'room-actions-share',
            //         },
            //         {
            //             icon: 'pin',
            //             name: I18n.t('Pinned'),
            //             route: 'MessagesView',
            //             params: {rid, t, name: 'Pinned'},
            //             testID: 'room-actions-pinned',
            //         },
            //     ],
            //     renderItem: this.renderItem,
            // },
        ];

        if (canAutoTranslate) {
            sections[2].data.push({
                icon: 'language',
                name: I18n.t('Auto_Translate'),
                route: 'AutoTranslateView',
                params: {rid, room},
                testID: 'room-actions-auto-translate',
            });
        }

        if (t === 'd') {
            sections.push({
                data: [
                    {
                        icon: 'ban',
                        name: I18n.t(`${blocker ? 'Unblock' : 'Block'}_user`),
                        type: 'danger',
                        event: this.toggleBlockUser,
                        testID: 'room-actions-block-user',
                    },
                ],
                renderItem: this.renderItem,
            });
            sections[2].data.push(notificationsAction);
        } else if (t === 'c' || t === 'p') {
            const actions = [];

            if (canViewMembers) {
                actions.push({
                    icon: 'team',
                    name: I18n.t('Members'),
                    description:
                        membersCount > 0
                            ? `${membersCount} ${I18n.t('members')}`
                            : null,
                    route: 'RoomMembersView',
                    params: {rid, room},
                    testID: 'room-actions-members',
                });
            }

            if (canAddUser) {
                actions.push({
                    icon: 'user-plus',
                    name: I18n.t('Add_user'),
                    route: 'SelectedUsersView',
                    params: {
                        nextActionID: 'ADD_USER',
                        rid,
                        title: I18n.t('Add_user'),
                    },
                    testID: 'room-actions-add-user',
                });
            }
            sections[2].data = [...actions, ...sections[2].data];

            if (joined) {
                sections[2].data.push(notificationsAction);
                sections.push({
                    data: [
                        {
                            icon: 'sign-out',
                            name: I18n.t('Leave_channel'),
                            type: 'danger',
                            event: this.leaveChannel,
                            testID: 'room-actions-leave-channel',
                        },
                    ],
                    renderItem: this.renderItem,
                });
            }
        }
        return sections;
    }

    updateRoomMember = async () => {
        const {room} = this.state;
        const {rid} = room;
        const {user} = this.props;

        try {
            const roomUserId = RocketChat.getRoomMemberId(rid, user.id);
            const result = await RocketChat.getUserInfo(roomUserId);
            if (result.success) {
                this.setState({member: result.user});
            }
        } catch (e) {
            log(e);
            this.setState({member: {}});
        }
    };

    toggleBlockUser = () => {
        const {room} = this.state;
        const {rid, blocker} = room;
        const {member} = this.state;
        try {
            RocketChat.toggleBlockUser(rid, member._id, !blocker);
        } catch (e) {
            log(e);
        }
    };

    handleShare = () => {
        const {room} = this.state;
        const permalink = RocketChat.getPermalinkChannel(room);
        Share.share({
            message: permalink,
        });
    };

    leaveChannel = () => {
        const {room} = this.state;
        const {leaveRoom} = this.props;

        Alert.alert(
            I18n.t('Are_you_sure_question_mark'),
            I18n.t('Are_you_sure_you_want_to_leave_the_room', {
                room: room.t === 'd' ? room.fname : room.name,
            }),
            [
                {
                    text: I18n.t('Cancel'),
                    style: 'cancel',
                },
                {
                    text: I18n.t('Yes_action_it', {action: I18n.t('leave')}),
                    style: 'destructive',
                    onPress: () => leaveRoom(room.rid, room.t),
                },
            ],
        );
    };

    renderRoomInfo = ({item}) => {
        const {room, member} = this.state;
        const {name, t, topic} = room;
        const {baseUrl, user} = this.props;

        return this.renderTouchableItem(
            [
                <Avatar
                    key="avatar"
                    avatar={AppConfig.avatar_host + '/username/' + name}
                    text={name}
                    size={60}
                    borderRadius={30}
                    style={[Style.m_h_3, Style.shadow]}
                    type={t}
                    baseUrl={baseUrl}
                    userId={user.id}
                    token={user.token}>
                    {t === 'd' && member._id ? (
                        <Status
                            style={[
                                Style.position_absolute,
                                {
                                    bottom: -3,
                                    right: -3,
                                    borderWidth: 2,
                                    borderColor: '#FFFFFF',
                                },
                            ]}
                            id={member._id}
                        />
                    ) : null}
                </Avatar>,
                <View key="name" style={styles.roomTitleContainer}>
                    {room.t === 'd' ? (
                        <Text style={styles.roomTitle}>{room.fname}</Text>
                    ) : (
                        <View style={styles.roomTitleRow}>
                            <RoomTypeIcon
                                type={room.prid ? 'discussion' : room.t}
                            />
                            <Text style={styles.roomTitle}>
                                {room.prid ? room.fname : room.name}
                            </Text>
                        </View>
                    )}
                    <Text
                        style={styles.roomDescription}
                        ellipsizeMode="tail"
                        numberOfLines={1}>
                        {t === 'd' ? `@${name}` : topic}
                    </Text>
                </View>,
                <DisclosureIndicator key="disclosure-indicator" />,
            ],
            item,
        );
    };

    renderTouchableItem = (subview, item) => (
        <Touch
            onPress={() => this.onPressTouchable(item)}
            underlayColor={COLOR_WHITE}
            activeOpacity={0.5}
            accessibilityLabel={item.name}
            accessibilityTraits="button"
            testID={item.testID}>
            <View
                style={[
                    styles.sectionItem,
                    item.disabled && styles.sectionItemDisabled,
                ]}>
                {subview}
            </View>
        </Touch>
    );

    renderMembers = () => {
        const {baseUrl, user, navigation} = this.props;
        const {members, membersCount, room} = this.state;
        const {rid} = room;

        const render =
            members.length > 0
                ? members.map((item, index) => (
                      <TouchableWithoutFeedback
                          key={index}
                          onPress={() =>
                              navigation.navigate('UserInfo', {
                                  user: {username: item.username},
                              })
                          }>
                          <View
                              style={[
                                  Style.v_center,
                                  Style.w_p20,
                                  Style.m_t_2,
                                  Style.p_1,
                              ]}>
                              <Avatar
                                  avatar={
                                      AppConfig.avatar_host +
                                      '/username/' +
                                      item.username
                                  }
                                  text={item.username}
                                  size={40}
                                  borderRadius={20}
                                  type="d"
                                  style={[Style.shadow]}
                                  baseUrl={baseUrl}
                                  userId={user.id}
                                  token={user.token}
                              />
                              <Text
                                  style={[
                                      Style.f_size_13,
                                      Style.f_color_3,
                                      Style.f_bold,
                                      Style.m_t_1,
                                  ]}
                                  ellipsizeMode="tail"
                                  numberOfLines={1}>
                                  {item.name}
                              </Text>
                          </View>
                      </TouchableWithoutFeedback>
                  ))
                : null;

        return (
            <View style={[Style.flex]}>
                <View style={[Style.row, Style.wrap]}>{render}</View>
                {membersCount > SHOW_USERS_COUNT && (
                    <TouchableWithoutFeedback
                        onPress={() =>
                            navigation.navigate('RoomMembersView', {rid})
                        }>
                        <View
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.m_t_2,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_15,
                                    Style.f_color_3,
                                    Style.f_weight_500,
                                    Style.f_fa_pf,
                                ]}>
                                {I18n.t('all_members')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </View>
        );
    };

    renderItem = ({item}) => {
        const subview =
            item.key !== undefined && item.key && item.key === 'renderMembers'
                ? this.renderMembers()
                : item.type === 'danger'
                ? [
                      <CustomIcon
                          key="icon"
                          name={item.icon}
                          size={24}
                          style={[
                              styles.sectionItemIcon,
                              styles.textColorDanger,
                          ]}
                      />,
                      <Text
                          key="name"
                          style={[
                              styles.sectionItemName,
                              styles.textColorDanger,
                          ]}>
                          {item.name}
                      </Text>,
                  ]
                : [
                      <CustomIcon
                          key="left-icon"
                          name={item.icon}
                          size={24}
                          style={styles.sectionItemIcon}
                      />,
                      <Text key="name" style={styles.sectionItemName}>
                          {item.name}
                      </Text>,
                      item.description ? (
                          <Text
                              key="description"
                              style={styles.sectionItemDescription}>
                              {item.description}
                          </Text>
                      ) : null,
                      <DisclosureIndicator key="disclosure-indicator" />,
                  ];
        return this.renderTouchableItem(subview, item);
    };

    renderSectionSeparator = data => {
        if (data.trailingItem) {
            return (
                <View
                    style={[
                        styles.sectionSeparator,
                        data.leadingSection && styles.sectionSeparatorBorder,
                    ]}
                />
            );
        }
        if (!data.trailingSection) {
            return <View style={styles.sectionSeparatorBorder} />;
        }
        return null;
    };

    render() {
        return (
            <SafeAreaView
                style={[Style.flex, Style.bg_color_15, Style.p_b_4]}
                testID="room-actions-view"
                forceInset={{vertical: 'never'}}>
                <StatusBar />
                <SectionList
                    contentContainerStyle={[Style.bg_color_gray]}
                    style={[Style.flex, Style.bg_color_15]}
                    stickySectionHeadersEnabled={false}
                    sections={this.sections}
                    // SectionSeparatorComponent={this.renderSectionSeparator}
                    ItemSeparatorComponent={renderSeparator}
                    keyExtractor={item => item.name}
                    testID="room-actions-list"
                    {...scrollPersistTaps}
                />
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => ({
    user: {
        id: state.login.user && state.login.user.id,
        token: state.login.user && state.login.user.token,
    },
    baseUrl: state.settings.Site_Url || state.server ? state.server.server : '',
    jitsiEnabled: state.settings.Jitsi_Enabled || false,
});

const mapDispatchToProps = dispatch => ({
    leaveRoom: (rid, t) => dispatch(leaveRoomAction(rid, t)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomActionsView);
