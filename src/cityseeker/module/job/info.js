import React from 'react';
import {
    View,
    Alert,
    Text,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {SafeAreaView} from 'react-navigation';
import UUID from 'react-native-uuid';
import {connect} from 'react-redux';
import {Q} from '@nozbe/watermelondb';

import RocketChat from '../../../lingchat/lib/rocketchat';

import LoadingIndicator from '../../components/LoadingIndicator';
import DirectionLink from '../../components/DirectionLink';
import StatusBar from '../../components/StatusBar';
import Avator from '../../components/Avator';
import {add, remove} from '../../actions/record';
import database from '../../lib/database';
import {info} from '../../actions/job';
import SendCVModal from './SendCVModal';
import {Common} from '../../utils/lib';
import Log from '../../utils/log';
import Style from '../../style';
import I18n from '../../locale';

const AVATOR_WITH = 50;

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: (
                <View
                    style={[Style.row, Style.row_center, Style.column_center]}>
                    <Text
                        style={[
                            Style.f_size_15,
                            Style.f_color_3,
                            Style.f_bolder,
                        ]}>
                        {I18n.t('common.detail')}
                    </Text>
                </View>
            ),
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
                            style={[Style.f_size_22, Style.f_color_4]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            isApplied: false,
            data: {},
            showSendCVModal: false,
        };
    }

    componentDidMount() {
        this.props.navigation.addListener('didFocus', () => {
            this._requestData();
        });

        this.props.navigation.addListener('didBlur', () => {
            this.setState({
                loading: true,
                data: {},
            });
        });

        this._requestData();
    }

    _requestData = () => {
        const {id, isApplied} = this.props.navigation.state.params;

        setTimeout(() => {
            info({
                where: ["id = '" + id + "'"],
            }).then(response => {
                const {status, message} = response;

                if (parseInt(status) === 1) {
                    this.setState({
                        isApplied: isApplied,
                        data: message,
                        loading: false,
                    });
                }
            });
        }, 50);
    };

    get isFollowing() {
        return (async () => {
            const {data} = this.state;

            const {isLoggedIn} = this.props.account;

            if (
                isLoggedIn &&
                data.business !== undefined &&
                data.business.id !== undefined
            ) {
                let isFollowing = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'business'),
                        Q.where('action', 'following'),
                        Q.where('content', data.business.id.toLowerCase()),
                    )
                    .fetchCount();

                return isFollowing > 0;
            }

            return false;
        })();
    }

    _showSendCVModal = () => {
        this.setState({
            showSendCVModal: true,
        });
    };

    _hideSendCVModal = () => {
        this.setState({
            showSendCVModal: false,
        });
    };

    _sendMessage = async () => {
        const {data} = this.state;
        const {navigation} = this.props;

        try {
            const {username} = data.business;
            const {success, room} = await RocketChat.createDirectMessage(
                username,
            );

            if (success) {
                navigation.navigate('RoomView', {
                    rid: room._id,
                    name: username,
                    t: 'd',
                });
            }
        } catch (e) {
            Log(e);
        }
    };

    checkLogin = () => {
        const {account, navigation} = this.props;

        if (account.isLoggedIn === false) {
            Common.showToast({
                message: (
                    <Text style={[Style.f_size_13, Style.f_weight_500]}>
                        {I18n.t('common.nosignin')}
                    </Text>
                ),
                style: {
                    ...Style.bg_color_cityseeker,
                },
                op: {
                    onHidden: () => {
                        Alert.alert(I18n.t('common.nosignin'), '', [
                            {
                                text: I18n.t('Cancel'),
                                style: 'cancel',
                            },
                            {
                                text: I18n.t('common.signin'),
                                style: 'destructive',
                                onPress: () => navigation.navigate('Signin'),
                            },
                        ]);
                    },
                },
            });

            return false;
        } else {
            return true;
        }
    };

    recordOp = (op, record) => {
        const {account, system} = this.props;
        const {lat, lng, area} = system;

        const {country, city} = area;

        if (this.checkLogin() === true) {
            if (op === 'add') {
                let data = {
                    id: UUID.v4()
                        .toUpperCase()
                        .replace(/-/g, ''),
                    business: account.id,
                    lat: lat,
                    lng: lng,
                    country: country,
                    city: city,
                    ...record,
                };

                this.props.dispatch(add(data));
            } else if (op === 'remove') {
                const data = {
                    business: account.id,
                    ...record,
                };

                this.props.dispatch(remove(data));
            }

            setTimeout(() => this.forceUpdate(), 500);
        }
    };

    _renderProfile = name => {
        const {data, isApplied} = this.state;

        const {business} = data;

        let render;

        if (name === 'chat') {
            let isFollowing = this.isFollowing;

            render = (
                <View style={[Style.row, Style.column_center]}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (!isFollowing) {
                                this.recordOp('add', {
                                    type: 'business',
                                    action: 'following',
                                    content: business.id,
                                });
                            }
                        }}>
                        <View
                            style={[
                                !isFollowing ? Style.flex : null,
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.border_round_3,
                                Style.b_half,
                                !isFollowing ? Style.p_2 : null,
                            ]}>
                            {!isFollowing && (
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_3,
                                        Style.f_regular,
                                    ]}>
                                    {I18n.t('common.follow') +
                                        ' ' +
                                        business.name}
                                </Text>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                    {isFollowing && business.username && (
                        <TouchableWithoutFeedback
                            onPress={() => this._sendMessage()}>
                            <View
                                style={[
                                    Style.flex,
                                    Style.bg_color_gray,
                                    Style.row,
                                    Style.row_center,
                                    Style.column_center,
                                    Style.m_l_2,
                                    Style.border_round_3,
                                    Style.p_2,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_3,
                                        Style.f_bold,
                                    ]}>
                                    {I18n.t('module.job.message_to_employer')}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </View>
            );
        } else if (name === 'apply') {
            render = !isApplied ? (
                <TouchableWithoutFeedback onPress={this._showSendCVModal}>
                    <View
                        style={[
                            Style.flex,
                            Style.bg_color_google,
                            Style.row,
                            Style.row_center,
                            Style.column_center,
                            Style.border_round_3,
                            Style.b_half,
                            Style.p_2,
                        ]}>
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_15,
                                Style.f_bold,
                            ]}>
                            {I18n.t('module.job.apply')}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            ) : (
                <View
                    style={[
                        Style.flex,
                        Style.row,
                        Style.row_center,
                        Style.column_center,
                        Style.p_2,
                    ]}>
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_color_google,
                            Style.f_bold,
                        ]}>
                        {I18n.t('module.job.applied')}
                    </Text>
                </View>
            );
        }

        return render;
    };

    _renderToolbar = () => {
        const {data} = this.state;

        const {account} = this.props;

        return data.business !== undefined &&
            data.business.id !== undefined &&
            account.id &&
            data.business.id !== account.id ? (
            <View
                style={[
                    Style.bottom_horizontal,
                    Style.bg_color_15,
                    Style.row,
                    Style.column_center,
                    Style.row_around,
                    Style.p_t_4,
                    Style.p_b_6,
                    Style.shadow,
                ]}>
                <View style={[Style.w_60]}>{this._renderProfile('chat')}</View>
                <View style={[Style.w_30]}>{this._renderProfile('apply')}</View>
            </View>
        ) : null;
    };

    render() {
        const {navigation, system} = this.props;

        const {currency} = system.params;

        const {data, loading, showSendCVModal, isApplied} = this.state;

        return loading === true ? (
            <View style={[Style.flex, Style.row_center, Style.column_center]}>
                <LoadingIndicator />
            </View>
        ) : (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{
                    top: 'never',
                    bottom: 'always',
                }}>
                <StatusBar light />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[Style.p_2]}>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_between,
                            ]}>
                            <View style={[Style.flex]}>
                                {data.title && (
                                    <Text
                                        style={[
                                            Style.f_size_17,
                                            Style.f_color_3,
                                            Style.f_bolder,
                                        ]}>
                                        {data.title}
                                    </Text>
                                )}
                                {data.business !== undefined && data.business && (
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                            Style.m_t_1,
                                        ]}>
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                Style.f_size_11,
                                                Style.f_color_3,
                                                Style.f_regular,
                                            ]}>
                                            {data.business.name}
                                        </Text>
                                        {data.business.type !== undefined &&
                                            data.business.type !== null && (
                                                <Text
                                                    style={[
                                                        Style.f_size_13,
                                                        Style.f_color_3,
                                                        Style.f_regular,
                                                    ]}>
                                                    {' - ' +
                                                        I18n.t(
                                                            'type.' +
                                                                data.business
                                                                    .type,
                                                        )}
                                                </Text>
                                            )}
                                    </View>
                                )}
                            </View>
                            {data.business !== undefined && data.business && (
                                <View>
                                    <TouchableWithoutFeedback
                                        onPress={() =>
                                            navigation.navigate('BusinessInfo')
                                        }>
                                        <Avator
                                            user={data.business}
                                            isLink={true}
                                            size={AVATOR_WITH}
                                        />
                                    </TouchableWithoutFeedback>
                                </View>
                            )}
                        </View>
                        {data.salary !== undefined && data.salary && (
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_t_2,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_3,
                                        Style.f_regular,
                                    ]}>
                                    {Common.price(
                                        data.salary,
                                        I18n.t(currency + '.symbol'),
                                    )}
                                </Text>
                                {data.salary_max !== undefined &&
                                    data.salary_max && (
                                        <Text
                                            style={[
                                                Style.f_size_15,
                                                Style.f_color_3,
                                                Style.f_regular,
                                            ]}>
                                            {' '}
                                            -{' '}
                                            {Common.price(
                                                data.salary_max,
                                                I18n.t(currency + '.symbol'),
                                            )}
                                        </Text>
                                    )}
                                {data.period !== undefined && data.period && (
                                    <Text
                                        style={[
                                            Style.f_size_15,
                                            Style.f_color_3,
                                            Style.f_regular,
                                        ]}>
                                        {' ' +
                                            I18n.t(
                                                'module.job.period.' +
                                                    data.period,
                                            )}
                                    </Text>
                                )}
                            </View>
                        )}
                        {data.type !== undefined && data.type.length > 0 && (
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_t_2,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_3,
                                        Style.f_regular,
                                    ]}>
                                    /
                                </Text>
                                {data.type.map((type, index) => (
                                    <Text
                                        key={index}
                                        style={[
                                            Style.f_size_15,
                                            Style.f_color_3,
                                            Style.f_regular,
                                        ]}>
                                        {' ' +
                                            I18n.t('module.job.type.' + type) +
                                            ' /'}
                                    </Text>
                                ))}
                            </View>
                        )}
                        {data.address !== undefined && data.address && (
                            <DirectionLink
                                address={data.address}
                                {...this.props}>
                                <View
                                    style={[
                                        Style.row,
                                        Style.column_start,
                                        Style.m_t_2,
                                    ]}>
                                    <FontAwesome5
                                        name="map-marker-alt"
                                        style={[
                                            Style.f_size_16,
                                            Style.f_color_cityseeker,
                                            Style.m_r_1,
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            Style.flex,
                                            Style.f_size_12,
                                            Style.f_color_5,
                                            Style.wrap,
                                        ]}>
                                        {I18n.t('module.job.address')}
                                        {': '}
                                        {data.address}
                                        {', '}
                                        {Common.capitalize(data.city)}{' '}
                                        {data.zip}
                                        {'  '}
                                        <FontAwesome5
                                            name="external-link-square-alt"
                                            style={[
                                                Style.f_size_13,
                                                Style.f_color_facebook,
                                                Style.m_l_1,
                                            ]}
                                        />
                                    </Text>
                                </View>
                            </DirectionLink>
                        )}
                        {data.description && (
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_t_3,
                                    Style.p_t_3,
                                    Style.p_b_10,
                                    Style.b_t,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_3,
                                        Style.f_regular,
                                    ]}>
                                    {data.description}
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
                {this._renderToolbar()}
                {showSendCVModal && !isApplied && (
                    <SendCVModal
                        visible={showSendCVModal}
                        {...this.props}
                        data={this.state.data}
                        recordOp={this.recordOp}
                        onDismiss={this._hideSendCVModal}
                    />
                )}
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        account: state.account,
        system: state.system,
        baseUrl:
            state.settings.Site_Url || state.server ? state.server.server : '',
        user: {
            id: state.login.user && state.login.user.id,
            username: state.login.user && state.login.user.username,
            token: state.login.user && state.login.user.token,
        },
        FileUpload_MediaTypeWhiteList:
            state.settings.FileUpload_MediaTypeWhiteList,
        FileUpload_MaxFileSize: state.settings.FileUpload_MaxFileSize,
    };
}

export default connect(mapStateToProps)(Default);
