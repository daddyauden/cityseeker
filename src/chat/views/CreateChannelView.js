import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Switch,
    ScrollView,
    TextInput,
    StyleSheet,
    FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import equal from 'deep-equal';

import Loading from '../containers/Loading';
import {createChannelRequest as createChannelRequestAction} from '../actions/createChannel';
import {removeUser as removeUserAction} from '../actions/selectedUsers';
import sharedStyles from './Styles';
import KeyboardView from '../presentation/KeyboardView';
import scrollPersistTaps from '../utils/scrollPersistTaps';
import I18n from '../i18n';
import UserItem from '../presentation/UserItem';
import {showErrorAlert} from '../utils/info';
import {CustomHeaderButtons, Item} from '../containers/HeaderButton';
import StatusBar from '../containers/StatusBar';
import {
    COLOR_TEXT_DESCRIPTION,
    COLOR_WHITE,
    SWITCH_TRACK_COLOR,
} from '../constants/colors';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Common from '../../common/utils/lib';
import Style from '../style';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f7f8fa',
        flex: 1,
    },
    list: {
        width: '100%',
        backgroundColor: COLOR_WHITE,
    },
    separator: {
        marginLeft: 60,
    },
    formSeparator: {
        marginLeft: 15,
    },
    input: {
        height: 54,
        paddingHorizontal: 18,
        fontSize: 17,
        ...sharedStyles.textRegular,
        ...sharedStyles.textColorNormal,
        backgroundColor: COLOR_WHITE,
    },
    swithContainer: {
        height: 54,
        backgroundColor: COLOR_WHITE,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 18,
    },
    label: {
        fontSize: 17,
        ...sharedStyles.textMedium,
        ...sharedStyles.textColorNormal,
    },
    invitedHeader: {
        marginTop: 18,
        marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    invitedTitle: {
        fontSize: 18,
        ...sharedStyles.textSemibold,
        ...sharedStyles.textColorNormal,
        lineHeight: 41,
    },
    invitedCount: {
        fontSize: 14,
        ...sharedStyles.textRegular,
        ...sharedStyles.textColorDescription,
    },
});

class CreateChannelView extends React.Component {
    static navigationOptions = ({navigation}) => {
        const submit = navigation.getParam('submit', () => {});
        const showSubmit = navigation.getParam('showSubmit');
        return {
            title: I18n.t('new_group'),
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <View
                        style={[
                            Style.p_l_3,
                            Style.row_center,
                            Style.column_center,
                        ]}>
                        <MaterialCommunityIcons
                            name="arrow-left"
                            style={[Style.f_size_20, Style.f_color_3]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
            headerRight: showSubmit ? (
                <View style={[Style.p_r_3, Style.column, Style.column_center]}>
                    <TouchableWithoutFeedback onPress={submit}>
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_3,
                                Style.f_weight_500,
                                Style.f_fa_pf,
                            ]}>
                            {I18n.t('Create')}
                        </Text>
                    </TouchableWithoutFeedback>
                </View>
            ) : null,
            headerStyle: {
                ...Style.b_b_0,
                ...Style.theme_content,
            },
        };
    };

    static propTypes = {
        navigation: PropTypes.object,
        baseUrl: PropTypes.string,
        create: PropTypes.func.isRequired,
        removeUser: PropTypes.func.isRequired,
        error: PropTypes.object,
        failure: PropTypes.bool,
        isFetching: PropTypes.bool,
        result: PropTypes.object,
        users: PropTypes.array.isRequired,
        user: PropTypes.shape({
            id: PropTypes.string,
            token: PropTypes.string,
        }),
    };

    state = {
        channelName: '',
        type: true,
        readOnly: false,
        broadcast: false,
    };

    componentDidMount() {
        const {navigation} = this.props;
        navigation.setParams({submit: this.submit});
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {channelName, type, readOnly, broadcast} = this.state;
        const {
            error,
            failure,
            isFetching,
            result,
            users,
            isLoggedIn,
        } = this.props;
        if (nextState.channelName !== channelName) {
            return true;
        }
        if (nextState.type !== type) {
            return true;
        }
        if (nextState.readOnly !== readOnly) {
            return true;
        }
        if (nextState.broadcast !== broadcast) {
            return true;
        }
        if (nextProps.failure !== failure) {
            return true;
        }
        if (nextProps.isFetching !== isFetching) {
            return true;
        }
        if (!equal(nextProps.error, error)) {
            return true;
        }
        if (!equal(nextProps.result, result)) {
            return true;
        }
        if (!equal(nextProps.users, users)) {
            return true;
        }
        if (!equal(nextProps.isLoggedIn, isLoggedIn)) {
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProps) {
        const {isFetching, failure, error, result, navigation} = this.props;

        if (!isFetching && isFetching !== prevProps.isFetching) {
            setTimeout(() => {
                if (failure) {
                    const msg =
                        error.reason ||
                        I18n.t('There_was_an_error_while_action', {
                            action: I18n.t('create_group'),
                        });

                    Common.showToast({
                        message: (
                            <Text style={[Style.f_size_13, Style.f_weight_500]}>
                                {msg}
                            </Text>
                        ),
                        style: {
                            ...Style.bg_color_cityseeker,
                            ...Style.p_3,
                        },
                        config: {
                            duration: 1000,
                        },
                    });
                } else {
                    const {type} = this.state;
                    const {rid, name} = result;
                    Common.showToast({
                        message: (
                            <MaterialCommunityIcons
                                name="check"
                                style={[Style.f_size_30, Style.f_color_15]}
                            />
                        ),
                        style: {
                            ...Style.bg_color_green,
                        },
                        op: {
                            onHidden: () =>
                                navigation.navigate('RoomView', {
                                    rid,
                                    name,
                                    t: type ? 'p' : 'c',
                                    headerLeft: () =>
                                        navigation.navigate('RoomsListView'),
                                }),
                        },
                    });
                }
            }, 300);
        }
    }

    onChangeText = channelName => {
        const {navigation, isLoggedIn} = this.props;
        navigation.setParams({
            showSubmit: channelName.trim().length > 0 && isLoggedIn,
        });
        this.setState({channelName});
    };

    submit = () => {
        const {channelName, type, readOnly, broadcast} = this.state;
        const {users: usersProps, isFetching, create, isLoggedIn} = this.props;

        if (!channelName.trim() || isFetching || !isLoggedIn) {
            return;
        }

        // transform users object into array of usernames
        const users = usersProps.map(user => user.name);

        // create channel
        create({
            name: channelName,
            users,
            type,
            readOnly,
            broadcast,
        });
    };

    removeUser = user => {
        const {users, removeUser} = this.props;
        if (users.length === 1) {
            return;
        }
        removeUser(user);
    };

    renderSwitch = ({id, value, label, onValueChange, disabled = false}) => (
        <View style={[Style.row, Style.column_start, Style.p_v_1]}>
            {id === 'public' ? (
                <MaterialCommunityIcons
                    name="pound"
                    style={[Style.f_color_9, Style.f_size_17]}
                />
            ) : id === 'private' ? (
                <MaterialCommunityIcons
                    name="lock"
                    style={[Style.f_color_9, Style.f_size_17]}
                />
            ) : id === 'nolimited_mode' ? (
                <MaterialCommunityIcons
                    name="pencil"
                    style={[Style.f_color_9, Style.f_size_17]}
                />
            ) : id === 'limited_mode' ? (
                <MaterialCommunityIcons
                    name="pencil-off"
                    style={[Style.f_color_9, Style.f_size_17]}
                />
            ) : id === 'reply_mode' ? (
                <MaterialCommunityIcons
                    name="comment-multiple-outline"
                    style={[Style.f_color_9, Style.f_size_17]}
                />
            ) : null}
            <View style={[Style.flex, Style.m_h_2]}>
                <View
                    style={[Style.row, Style.column_start, Style.row_between]}>
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_color_5,
                            Style.f_weight_500,
                            Style.f_fa_pf,
                        ]}>
                        {I18n.t(label)}
                    </Text>
                </View>
                <Text
                    style={[
                        Style.f_size_11,
                        Style.f_color_9,
                        Style.f_weight_400,
                        Style.f_fa_pf,
                        Style.m_t_1,
                    ]}>
                    {id === 'public'
                        ? I18n.t('public_group_subtitle')
                        : id === 'private'
                        ? I18n.t('private_group_subtitle')
                        : id === 'nolimited_mode'
                        ? I18n.t('nolimited_mode_subtitle')
                        : id === 'limited_mode'
                        ? I18n.t('limited_mode_subtitle')
                        : id === 'reply_mode'
                        ? I18n.t('reply_mode_subtitle')
                        : ''}
                </Text>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={Style.bg_color_gray.backgroundColor}
                tintColor={isAndroid ? Style.f_color_cityseeker.color : null}
                disabled={disabled}
            />
        </View>
    );

    renderType() {
        const {type} = this.state;
        const {condition} = this.props.account;

        return this.renderSwitch({
            id: type ? 'private' : 'public',
            value: type,
            label: type ? 'private_group' : 'public_group',
            onValueChange: value => this.setState({type: value}),
            disabled: parseInt(condition) === 0 ? true : false,
        });
    }

    renderReadOnly() {
        const {readOnly, broadcast} = this.state;

        return this.renderSwitch({
            id: readOnly ? 'limited_mode' : 'nolimited_mode',
            value: readOnly,
            label: readOnly ? 'limited_mode' : 'nolimited_mode',
            onValueChange: value => this.setState({readOnly: value}),
            disabled: broadcast,
        });
    }

    renderBroadcast() {
        const {readOnly, broadcast} = this.state;

        return this.renderSwitch({
            id: 'reply_mode',
            value: broadcast,
            label: 'reply_mode',
            onValueChange: value => {
                this.setState({
                    broadcast: value,
                    readOnly: value ? true : readOnly,
                });
            },
        });
    }

    renderSeparator = () => <View style={[Style.h_1, Style.bg_color_gray]} />;

    renderFormSeparator = () => (
        <View style={[Style.h_1, Style.bg_color_gray]} />
    );

    renderItem = ({item}) => {
        const {baseUrl, user} = this.props;

        return (
            <UserItem
                direction={'v'}
                name={item.fname}
                username={item.name}
                onPress={() => {}}
                testID={`create-channel-view-item-${item.name}`}
                baseUrl={baseUrl}
                style={[Style.p_2, Style.column_center, Style.w_20]}
                user={user}
            />
        );
    };

    renderInvitedList = () => {
        const {users} = this.props;

        return (
            <FlatList
                numColumns={5}
                data={users}
                extraData={users}
                keyExtractor={item => item._id}
                style={[Style.bg_color_15]}
                renderItem={this.renderItem}
                ItemSeparatorComponent={this.renderSeparator}
                enableEmptySections
                keyboardShouldPersistTaps="always"
            />
        );
    };

    render() {
        const {channelName} = this.state;
        const {users, isFetching} = this.props;
        const userCount = users.length;

        return (
            <KeyboardView
                contentContainerStyle={[Style.flex, Style.bg_color_gray]}
                keyboardVerticalOffset={128}>
                <StatusBar />
                <SafeAreaView
                    testID="create-channel-view"
                    style={[Style.flex, Style.bg_color_15]}
                    forceInset={{vertical: 'never'}}>
                    <ScrollView>
                        <View style={[Style.p_h_3, Style.b_b]}>
                            <TextInput
                                ref={ref => (this.channelNameRef = ref)}
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_weight_400,
                                    Style.p_v_2,
                                    Style.b_b,
                                ]}
                                label={I18n.t('group_name')}
                                value={channelName}
                                onChangeText={this.onChangeText}
                                placeholder={I18n.t('group_name')}
                                placeholderTextColor={Style.f_color_9.color}
                                returnKeyType="done"
                                testID="create-channel-name"
                                autoCorrect={false}
                                autoCapitalize="none"
                                underlineColorAndroid="transparent"
                            />
                            <View
                                style={[
                                    Style.column,
                                    Style.row_center,
                                    Style.m_t_3,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_3,
                                        Style.f_weight_500,
                                        Style.f_fa_pf,
                                    ]}>
                                    {I18n.t('Settings')}
                                </Text>
                                {this.renderType()}
                                {this.renderFormSeparator()}
                                {this.renderReadOnly()}
                                {this.renderFormSeparator()}
                                {this.renderBroadcast()}
                            </View>
                        </View>
                        <View
                            style={[
                                Style.m_t_3,
                                Style.p_h_3,
                                Style.row,
                                Style.column_center,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_15,
                                    Style.f_color_3,
                                    Style.f_weight_500,
                                    Style.f_fa_pf,
                                ]}>
                                {I18n.t('Members')}
                            </Text>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_5,
                                    Style.f_weight_400,
                                    Style.f_fa_pf,
                                ]}>
                                {' (' + userCount + ')'}
                            </Text>
                        </View>
                        {this.renderInvitedList()}
                        <Loading visible={isFetching} />
                    </ScrollView>
                </SafeAreaView>
            </KeyboardView>
        );
    }
}

const mapStateToProps = state => ({
    baseUrl: state.settings.Site_Url || state.server ? state.server.server : '',
    error: state.createChannel.error,
    failure: state.createChannel.failure,
    isFetching: state.createChannel.isFetching,
    result: state.createChannel.result,
    users: state.selectedUsers.users,
    user: {
        id: state.login.user && state.login.user.id,
        token: state.login.user && state.login.user.token,
    },
    account: state.account,
    isLoggedIn: state.account.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
    create: data => dispatch(createChannelRequestAction(data)),
    removeUser: user => dispatch(removeUserAction(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateChannelView);
