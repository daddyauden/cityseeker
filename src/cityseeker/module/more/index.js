import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';
import BottomTabBar from '../sidebar/bottom';
import LoadingIndicator from '../../components/LoadingIndicator';
import StatusBar from '../../components/StatusBar';
import {updateTab} from '../../actions/system';
import {signout} from '../../actions/account';
import {info} from '../../actions/business';
import Avator from '../../components/Avator';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

const WIDTH = Style.w_100.width;
const SPACE = 10;
const COLUMN_WIDTH = (WIDTH - SPACE * 5) / 3;

class Default extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.dismiss();
                        navigation.toggleDrawer();
                    }}>
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
            headerStyle: {
                height: 20,
                elevation: 0,
                borderBottomWidth: 0,
                backgroundColor: Style.theme_content.backgroundColor,
            },
            headerTransparent: false,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            user: {},
        };

        props.navigation.addListener('didFocus', () => {
            props.dispatch(updateTab('account'));
        });
    }

    componentDidMount() {
        this._loadUser();
    }

    _loadUser() {
        const {account, dispatch} = this.props;

        if (account.isLoggedIn === true) {
            info({
                where: ["id = '" + account.id + "'"],
            }).then(response => {
                const {status, message} = response;

                if (parseInt(status) === 1) {
                    this.setState({
                        user: message,
                        loading: false,
                    });
                } else {
                    this.setState({
                        loading: false,
                    });
                }
            });
        } else {
            this.setState({
                loading: false,
            });
        }
    }

    _signup = () => {
        const {navigation} = this.props;

        navigation.navigate('Signup');
    };

    _signin = () => {
        const {navigation} = this.props;

        navigation.navigate('Signin');
    };

    _logOut = source => {
        const {navigation, dispatch} = this.props;

        dispatch(signout(source, navigation));
    };

    _dashboard = () => {
        const {account, navigation, config} = this.props;

        const {user} = this.state;

        return account.isLoggedIn === false ? (
            <View style={[Style.column]}>
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.row_center,
                        Style.p_b_4,
                    ]}>
                    <Text style={[Style.f_size_15]}>
                        {I18n.t('app.setting.login')}
                    </Text>
                </View>
                <View style={[Style.row, Style.row_center]}>
                    <View style={[Style.column]}>
                        <TouchableWithoutFeedback onPress={this._signup}>
                            <View
                                style={[
                                    Style.w_p100,
                                    Style.bg_color_cityseeker,
                                    Style.p_3,
                                    Style.column_center,
                                    Style.border_round_1,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_color_15,
                                        Style.f_weight_500,
                                    ]}>
                                    {I18n.t('app.account.signup')}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this._signin}>
                            <View
                                style={[
                                    Style.m_t_3,
                                    Style.bg_color_15,
                                    Style.p_3,
                                    Style.column_center,
                                    Style.border_round_1,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_color_3,
                                        Style.f_weight_500,
                                    ]}>
                                    {I18n.t('common.signin')}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={[
                        Style.column,
                        Style.column_center,
                        Style.row_center,
                    ]}>
                    <View
                        style={[
                            Style.row,
                            Style.row_center,
                            Style.column_center,
                        ]}>
                        {user && <Avator user={user} size={50} />}
                    </View>
                    {user.name && (
                        <Text
                            style={[
                                Style.m_t_1,
                                Style.f_size_17,
                                Style.f_color_3,
                                Style.f_weight_700,
                                Style.f_fa_pf,
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
                                Style.f_weight_500,
                                Style.f_fa_pf,
                            ]}>
                            {I18n.t('type.' + user.type)}
                        </Text>
                    )}
                    <View
                        style={[
                            Style.row,
                            Style.row_between,
                            Style.column_center,
                            {
                                marginTop: SPACE,
                            },
                        ]}>
                        <TouchableWithoutFeedback
                            onPress={() =>
                                parseInt(user.follower) > 0
                                    ? this.props.navigation.navigate({
                                          routeName: 'UserFollow',
                                          params: {
                                              user: user,
                                              tabName: 'follower',
                                          },
                                          key: user.id + 'follower',
                                      })
                                    : {}
                            }>
                            <View
                                style={[
                                    Style.column,
                                    Style.row_center,
                                    Style.column_center,
                                    Style.m_h_2,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_size_17,
                                        Style.f_weight_600,
                                        Style.f_fa_pf,
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
                                        Style.f_weight_400,
                                        Style.f_fa_pf,
                                    ]}>
                                    {I18n.t('common.follower')}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={() =>
                                parseInt(user.following) > 0
                                    ? this.props.navigation.navigate({
                                          routeName: 'UserFollow',
                                          params: {
                                              user: user,
                                              tabName: 'following',
                                          },
                                          key: user.id + 'following',
                                      })
                                    : {}
                            }>
                            <View
                                style={[
                                    Style.column,
                                    Style.row_center,
                                    Style.column_center,
                                    Style.m_h_2,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_size_17,
                                        Style.f_weight_600,
                                        Style.f_fa_pf,
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
                                        Style.f_weight_400,
                                        Style.f_fa_pf,
                                    ]}>
                                    {I18n.t('common.following')}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={() =>
                                parseInt(user.likes) > 0
                                    ? this.props.navigation.navigate({
                                          routeName: 'UserFollow',
                                          params: {
                                              user: user,
                                              tabName: 'likes',
                                          },
                                          key: user.id + 'likes',
                                      })
                                    : {}
                            }>
                            <View
                                style={[
                                    Style.column,
                                    Style.row_center,
                                    Style.column_center,
                                    Style.m_h_2,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_size_17,
                                        Style.f_weight_600,
                                        Style.f_fa_pf,
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
                                        Style.f_weight_400,
                                        Style.f_fa_pf,
                                    ]}>
                                    {parseInt(user.condition) === 1
                                        ? I18n.t('common.checkin')
                                        : I18n.t('common.likes')}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.wrap,
                        Style.bg_color_15,
                        {
                            padding: SPACE * 2,
                            paddingRight: SPACE * 1.5,
                        },
                    ]}>
                    {user.type !== undefined && user.type !== null && (
                        <TouchableWithoutFeedback
                            onPress={() =>
                                navigation.navigate('BusinessItems', {
                                    user: user,
                                })
                            }>
                            <View
                                style={[
                                    Style.column,
                                    Style.row_around,
                                    Style.column_center,
                                    Style.bg_color_gray,
                                    Style.p_2,
                                    {
                                        width: COLUMN_WIDTH,
                                        height: COLUMN_WIDTH,
                                        marginRight: SPACE / 2,
                                        marginBottom: SPACE / 2,
                                    },
                                ]}>
                                <MaterialCommunityIcons
                                    name="access-point"
                                    style={[
                                        Style.m_h_2,
                                        Style.f_size_25,
                                        Style.f_color_6,
                                    ]}
                                />
                                <Text
                                    style={[Style.f_color_3, Style.f_size_13]}>
                                    {I18n.t('app.tab.service')}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    {user.condition !== undefined &&
                        parseInt(user.condition) === 1 && (
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    navigation.navigate('BusinessAlbum', {
                                        business: user,
                                    })
                                }>
                                <View
                                    style={[
                                        Style.column,
                                        Style.row_around,
                                        Style.column_center,
                                        Style.bg_color_gray,
                                        Style.p_2,
                                        {
                                            width: COLUMN_WIDTH,
                                            height: COLUMN_WIDTH,
                                            marginRight: SPACE / 2,
                                            marginBottom: SPACE / 2,
                                        },
                                    ]}>
                                    <MaterialCommunityIcons
                                        name="image"
                                        style={[
                                            Style.m_h_2,
                                            Style.f_size_25,
                                            Style.f_color_6,
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            Style.f_color_3,
                                            Style.f_size_13,
                                        ]}>
                                        {I18n.t('common.album')}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    {user.condition !== undefined &&
                        parseInt(user.condition) === 1 && (
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    navigation.navigate('PostEvents', {
                                        title: I18n.t('app.tab.events'),
                                    })
                                }>
                                <View
                                    style={[
                                        Style.column,
                                        Style.row_around,
                                        Style.column_center,
                                        Style.bg_color_gray,
                                        Style.p_2,
                                        {
                                            width: COLUMN_WIDTH,
                                            height: COLUMN_WIDTH,
                                            marginRight: SPACE / 2,
                                            marginBottom: SPACE / 2,
                                        },
                                    ]}>
                                    <MaterialCommunityIcons
                                        name="calendar-check"
                                        style={[
                                            Style.m_h_2,
                                            Style.f_size_25,
                                            Style.f_color_6,
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            Style.f_color_3,
                                            Style.f_size_13,
                                        ]}>
                                        {I18n.t('app.tab.events')}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    {config.module_job_enable !== undefined &&
                        config.module_job_enable && (
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    navigation.navigate(
                                        parseInt(user.condition) === 1
                                            ? 'AccountJobs'
                                            : 'JobList',
                                    )
                                }>
                                <View
                                    style={[
                                        Style.column,
                                        Style.row_around,
                                        Style.column_center,
                                        Style.bg_color_gray,
                                        Style.p_2,
                                        {
                                            width: COLUMN_WIDTH,
                                            height: COLUMN_WIDTH,
                                            marginRight: SPACE / 2,
                                            marginBottom: SPACE / 2,
                                        },
                                    ]}>
                                    <MaterialCommunityIcons
                                        name="briefcase"
                                        style={[
                                            Style.m_h_2,
                                            Style.f_size_25,
                                            Style.f_color_6,
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            Style.f_color_3,
                                            Style.f_size_13,
                                        ]}>
                                        {I18n.t('module.job')}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    {config.module_delivery_enable !== undefined &&
                        config.module_delivery_enable && (
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    navigation.navigate('DeliveryList')
                                }>
                                <View
                                    style={[
                                        Style.column,
                                        Style.row_around,
                                        Style.column_center,
                                        Style.bg_color_gray,
                                        Style.p_2,
                                        {
                                            width: COLUMN_WIDTH,
                                            height: COLUMN_WIDTH,
                                            marginRight: SPACE / 2,
                                            marginBottom: SPACE / 2,
                                        },
                                    ]}>
                                    <MaterialCommunityIcons
                                        name="google-maps"
                                        style={[
                                            Style.m_h_2,
                                            Style.f_size_25,
                                            Style.f_color_6,
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            Style.f_color_3,
                                            Style.f_size_13,
                                        ]}>
                                        {I18n.t('module.delivery')}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    <TouchableWithoutFeedback
                        onPress={() => navigation.navigate('Profile')}>
                        <View
                            style={[
                                Style.column,
                                Style.row_around,
                                Style.column_center,
                                Style.bg_color_gray,
                                Style.p_2,
                                {
                                    width: COLUMN_WIDTH,
                                    height: COLUMN_WIDTH,
                                    marginRight: SPACE / 2,
                                    marginBottom: SPACE / 2,
                                },
                            ]}>
                            <MaterialCommunityIcons
                                name="account"
                                style={[
                                    Style.m_h_2,
                                    Style.f_size_25,
                                    Style.f_color_6,
                                ]}
                            />
                            <Text style={[Style.f_color_3, Style.f_size_13]}>
                                {I18n.t('app.nav.profile')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() =>
                            navigation.navigate('Account', {user: user})
                        }>
                        <View
                            style={[
                                Style.column,
                                Style.row_around,
                                Style.column_center,
                                Style.bg_color_gray,
                                Style.p_2,
                                {
                                    width: COLUMN_WIDTH,
                                    height: COLUMN_WIDTH,
                                    marginRight: SPACE / 2,
                                    marginBottom: SPACE / 2,
                                },
                            ]}>
                            <MaterialCommunityIcons
                                name="at"
                                style={[
                                    Style.m_h_2,
                                    Style.f_size_25,
                                    Style.f_color_6,
                                ]}
                            />
                            <Text style={[Style.f_color_3, Style.f_size_13]}>
                                {I18n.t('app.nav.account')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => navigation.navigate('Privacy')}>
                        <View
                            style={[
                                Style.column,
                                Style.row_around,
                                Style.column_center,
                                Style.bg_color_gray,
                                Style.p_2,
                                {
                                    width: COLUMN_WIDTH,
                                    height: COLUMN_WIDTH,
                                    marginRight: SPACE / 2,
                                    marginBottom: SPACE / 2,
                                },
                            ]}>
                            <MaterialCommunityIcons
                                name="lock"
                                style={[
                                    Style.m_h_2,
                                    Style.f_size_25,
                                    Style.f_color_6,
                                ]}
                            />
                            <Text style={[Style.f_color_3, Style.f_size_13]}>
                                {I18n.t('app.nav.privacy')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => navigation.navigate('Setting')}>
                        <View
                            style={[
                                Style.column,
                                Style.row_around,
                                Style.column_center,
                                Style.bg_color_gray,
                                Style.p_2,
                                {
                                    width: COLUMN_WIDTH,
                                    height: COLUMN_WIDTH,
                                    marginRight: SPACE / 2,
                                    marginBottom: SPACE / 2,
                                },
                            ]}>
                            <MaterialCommunityIcons
                                name="settings"
                                style={[
                                    Style.m_h_2,
                                    Style.f_size_25,
                                    Style.f_color_6,
                                ]}
                            />
                            <Text style={[Style.f_color_3, Style.f_size_13]}>
                                {I18n.t('common.setting')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => this._logOut(account.source)}>
                        <View
                            style={[
                                Style.column,
                                Style.row_around,
                                Style.column_center,
                                Style.bg_color_gray,
                                Style.p_2,
                                {
                                    width: COLUMN_WIDTH,
                                    height: COLUMN_WIDTH,
                                    marginRight: SPACE / 2,
                                    marginBottom: SPACE / 2,
                                },
                            ]}>
                            <MaterialCommunityIcons
                                style={[
                                    Style.m_h_2,
                                    Style.f_size_25,
                                    Style.f_color_6,
                                ]}
                                name="power"
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </ScrollView>
        );
    };

    render() {
        const {loading} = this.state;

        return loading === true ? (
            <View style={[Style.flex, Style.row_center, Style.column_center]}>
                <LoadingIndicator />
            </View>
        ) : (
            <SafeAreaView style={[Style.flex]} forceInset={{vertical: 'never'}}>
                <StatusBar light />
                <BottomTabBar
                    {...this.props}
                    showIcon={true}
                    showLabel={true}
                    routeName={'More'}
                />
                <View style={[Style.flex]}>{this._dashboard()}</View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        locale: state.system.locale,
        city: state.system.area.city,
        lat: state.system.lat,
        lng: state.system.lng,
        config: state.config,
        account: state.account,
        system: state.system,
    };
};

export default connect(mapStateToProps)(Default);
