import React, {Component} from 'react';
import {Text, TouchableWithoutFeedback, View, ScrollView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {SafeAreaView} from 'react-navigation';
import {signout as signoutAction} from '../../actions/account';
import {updateTab as updateTabAction} from '../../actions/system';
import Sign from '../../module/account/sign';
import Settings from '../../module/setting';
import Avator from '../../components/Avator';
import {info} from '../../actions/business';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

const WIDTH = Style.w_75.width;
const SPACE = 10;

class Default extends Component {
    constructor(props) {
        super(props);

        const display_mode = props.config.draw_dashboard_display_mode || 'V';

        this.column_with =
            display_mode === 'H' ? (WIDTH - SPACE * 4) / 3 : WIDTH;
        this.column_height =
            display_mode === 'H' ? (WIDTH - SPACE * 4) / 3 : SPACE * 4;

        this.state = {
            currentDrawerItem: 'TabBarStack',
            user: {},
        };

        props.navigation.addListener('didFocus', () => {
            props.updateTab('Drawer');
        });
    }

    componentDidMount() {
        this._loadUser();
    }

    componentDidUpdate(prevProps, prevState) {
        const {account} = this.props;

        if (prevProps.account.isLoggedIn !== account.isLoggedIn) {
            this._loadUser();
        }
    }

    _loadUser() {
        const {account} = this.props;

        if (account.isLoggedIn === true) {
            info({
                select: [
                    'id, source, type, condition, follower, following, likes, avator',
                ],
                where: ["id = '" + account.id + "'"],
            }).then(response => {
                const {status, message} = response;

                if (status) {
                    this.setState({
                        user: message,
                    });
                }
            });
        }
    }

    _setCurrentDrawerItem = (currentDrawerItem, callback) => {
        this.setState({currentDrawerItem}, () => callback());
    };

    _renderDrawerItem = (item, style) => {
        const {currentDrawerItem} = this.state;

        const {navigation, config} = this.props;

        const display_mode = config.draw_dashboard_display_mode || 'V';

        const {routeName, routeParams, iconName, labelName} = item;

        const isActiveItem =
            currentDrawerItem.toLowerCase() === routeName.toLowerCase();

        return (
            <TouchableWithoutFeedback
                onPress={this._setCurrentDrawerItem.bind(this, routeName, () =>
                    navigation.navigate(routeName, routeParams || null),
                )}>
                <View
                    style={[
                        display_mode === 'H'
                            ? Style.v_center
                            : [Style.row, Style.column_center],
                        display_mode === 'H' && Style.bg_color_gray,
                        {
                            width: this.column_with,
                            height: this.column_height,
                            marginRight: SPACE,
                            marginBottom: SPACE,
                        },
                        style,
                    ]}>
                    <MaterialCommunityIcons
                        style={[
                            Style.f_size_22,
                            isActiveItem
                                ? Style.f_color_cityseeker
                                : Style.f_color_6,
                        ]}
                        name={iconName}
                    />
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_regular,
                            display_mode !== 'H' && Style.m_l_3,
                            isActiveItem
                                ? Style.f_color_cityseeker
                                : Style.f_color_6,
                        ]}>
                        {I18n.t(labelName)}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    _renderUser = () => {
        const {user} = this.state;
        const {config, signout} = this.props;

        const display_mode = config.draw_dashboard_display_mode || 'V';

        const logoutItem = (
            <TouchableWithoutFeedback onPress={() => signout(user.source)}>
                <View
                    style={[
                        display_mode === 'H'
                            ? Style.v_center
                            : [Style.row, Style.column_center],
                        display_mode === 'H' && Style.bg_color_gray,
                        {
                            width: this.column_with,
                            height: this.column_height,
                            marginRight: SPACE,
                            marginBottom: SPACE,
                        },
                    ]}>
                    <MaterialCommunityIcons
                        style={[Style.f_size_22, Style.f_color_6]}
                        name="power"
                    />
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_color_6,
                            Style.f_regular,
                            display_mode !== 'H' && Style.m_l_3,
                        ]}>
                        {I18n.t('common.logout')}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );

        return (
            <View
                style={[
                    display_mode === 'H' && [Style.row, Style.wrap],
                    display_mode !== 'H' && [Style.p_h_3],
                ]}>
                {this._renderDrawerItem({
                    routeName: 'Profile',
                    iconName: 'account',
                    labelName: 'app.nav.profile',
                })}
                {this._renderDrawerItem({
                    routeName: 'Account',
                    routeParams: {user},
                    iconName: 'at',
                    labelName: 'app.nav.account',
                })}
                {this._renderDrawerItem({
                    routeName: 'Block',
                    iconName: 'lock',
                    labelName: 'app.nav.privacy',
                })}
                {logoutItem}
            </View>
        );
    };

    _renderBusiness = () => {
        const {user} = this.state;
        const {config} = this.props;

        const display_mode = config.draw_dashboard_display_mode || 'V';

        return (
            <View
                style={[
                    display_mode === 'H' && [Style.row, Style.wrap],
                    display_mode !== 'H' && [Style.p_h_3],
                ]}>
                {this._renderDrawerItem({
                    routeName: 'BusinessItems',
                    routeParams: {user},
                    iconName: 'access-point',
                    labelName: 'app.tab.service',
                })}
                {this._renderDrawerItem({
                    routeName: 'BusinessAlbum',
                    routeParams: {user},
                    iconName: 'image-filter',
                    labelName: 'common.album',
                })}
                {this._renderDrawerItem({
                    routeName: 'PostEvents',
                    iconName: 'calendar-check',
                    labelName: 'app.tab.events',
                })}
                {this._renderDrawerItem({
                    routeName: 'BusinessJobs',
                    iconName: 'briefcase',
                    labelName: 'module.job',
                })}
            </View>
        );
    };

    _renderDashborad = () => {
        const {user} = this.state;

        return (
            <ScrollView>
                <View style={[Style.m_t_0]}>{this._renderUser()}</View>
                {user.condition !== undefined &&
                    parseInt(user.condition) === 1 && (
                        <View style={[Style.m_t_2]}>
                            <Text
                                style={[
                                    Style.f_color_5,
                                    Style.f_size_15,
                                    Style.f_bold,
                                    Style.m_b_2,
                                ]}>
                                {I18n.t('app.nav.business')}
                            </Text>
                            {this._renderBusiness()}
                        </View>
                    )}
            </ScrollView>
        );
    };

    _renderAccountBasicInfo = () => {
        const {navigation} = this.props;

        const {user} = this.state;

        return (
            <View style={[Style.v_center]}>
                {user && <Avator user={user} size={50} />}
                {user.name && (
                    <Text
                        style={[
                            Style.m_t_1,
                            Style.f_size_17,
                            Style.f_color_3,
                            Style.f_bold,
                        ]}>
                        {user.name}
                    </Text>
                )}
                {user.type !== undefined && user.type !== null && (
                    <Text
                        style={[
                            Style.m_t_1,
                            Style.f_size_15,
                            Style.f_color_5,
                            Style.f_bold,
                        ]}>
                        {I18n.t('type.' + user.type)}
                    </Text>
                )}
                <View
                    style={[
                        Style.h_center,
                        Style.w_p100,
                        Style.row_evenly,
                        Style.m_t_2,
                    ]}>
                    <TouchableWithoutFeedback
                        onPress={() =>
                            parseInt(user.follower) > 0
                                ? navigation.navigate({
                                      routeName: 'UserFollow',
                                      params: {
                                          user: user,
                                          tabName: 'follower',
                                      },
                                      key: user.id + 'follower',
                                  })
                                : {}
                        }>
                        <View style={[Style.v_center]}>
                            <Text
                                style={[
                                    Style.f_size_17,
                                    Style.f_bold,
                                    parseInt(user.follower) > 0
                                        ? Style.f_color_3
                                        : Style.f_color_9,
                                ]}>
                                {Common.customNumber(user.follower)}
                            </Text>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_9,
                                    Style.f_regular,
                                ]}>
                                {I18n.t('common.follower')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() =>
                            parseInt(user.following) > 0
                                ? navigation.navigate({
                                      routeName: 'UserFollow',
                                      params: {
                                          user: user,
                                          tabName: 'following',
                                      },
                                      key: user.id + 'following',
                                  })
                                : {}
                        }>
                        <View style={[Style.v_center]}>
                            <Text
                                style={[
                                    Style.f_size_17,
                                    Style.f_bold,
                                    parseInt(user.following) > 0
                                        ? Style.f_color_3
                                        : Style.f_color_9,
                                ]}>
                                {Common.customNumber(user.following)}
                            </Text>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_9,
                                    Style.f_regular,
                                ]}>
                                {I18n.t('common.following')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() =>
                            parseInt(user.likes) > 0
                                ? navigation.navigate({
                                      routeName: 'UserFollow',
                                      params: {
                                          user: user,
                                          tabName: 'likes',
                                      },
                                      key: user.id + 'likes',
                                  })
                                : {}
                        }>
                        <View style={[Style.v_center]}>
                            <Text
                                style={[
                                    Style.f_size_17,
                                    Style.f_bold,
                                    parseInt(user.likes) > 0
                                        ? Style.f_color_3
                                        : Style.f_color_9,
                                ]}>
                                {Common.customNumber(user.likes)}
                            </Text>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_9,
                                    Style.f_regular,
                                ]}>
                                {parseInt(user.condition) === 1
                                    ? I18n.t('common.checkin')
                                    : I18n.t('common.likes')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    };

    render() {
        const {account} = this.props;

        return (
            <SafeAreaView
                forceInset={{
                    bottom: 'never',
                }}
                style={[Style.flex, Style.column, Style.row_between]}>
                {account.isLoggedIn && this._renderAccountBasicInfo()}
                <View
                    style={[
                        Style.flex,
                        Style.m_v_2,
                        Style.b_t,
                        {
                            paddingLeft: SPACE,
                            paddingTop: SPACE,
                        },
                        Style.bg_color_15,
                    ]}>
                    {account.isLoggedIn ? (
                        this._renderDashborad()
                    ) : (
                        <Sign {...this.props} />
                    )}
                </View>
                <Settings {...this.props} />
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account,
    system: state.system,
    config: state.config,
    user: {
        id: state.login.user && state.login.user.id,
        language: state.login.user && state.login.user.language,
        status: state.login.user && state.login.user.status,
        username: state.login.user && state.login.user.username,
        token: state.login.user && state.login.user.token,
        roles: state.login.user && state.login.user.roles,
    },
});

const mapDispatchToProps = dispatch => ({
    updateTab: tabName => dispatch(updateTabAction(tabName)),
    signout: source => dispatch(signoutAction(source)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Default);
