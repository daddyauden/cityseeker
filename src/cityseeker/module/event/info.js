import React from 'react';
import {
    View,
    Text,
    Image,
    StatusBar,
    Dimensions,
    ScrollView,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-navigation';
import UUID from 'react-native-uuid';
import {connect} from 'react-redux';
import Moment from 'moment';
import _ from 'lodash';

import {Q} from '@nozbe/watermelondb';

import database from '../../lib/database';

import {
    HIDE_STATUS,
    TRANSLUCENT_STATUS,
    Common,
    scrollProps,
} from '../../utils/lib';

import LoadingIndicator from '../../components/LoadingIndicator';
import DirectionLink from '../../components/DirectionLink';
import WebModal from '../../components/WebModal';
import TimeAgo from '../../components/TimeAgo';

import {add, remove} from '../../actions/record';
import {info} from '../../actions/events';

import EventsConfig from '../../config/events';

import I18n from '../../locale';
import Style from '../../style';

const WIDTH = Dimensions.get('window').width;

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <View
                        style={[
                            Style.row,
                            Style.row_center,
                            Style.column_center,
                            Style.m_l_3,
                            Style.bg_color_15,
                            {
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                            },
                        ]}>
                        <MaterialCommunityIcons
                            name="arrow-left"
                            style={[Style.f_size_18, Style.f_color_0]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
            headerTransparent: true,
            headerStyle: {
                elevation: 0,
                borderBottomWidth: 0,
                backgroundColor: Style.bg_transparent.backgroundColor,
            },
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            data: {},
            webModalVisible: false,
            webUrl: '',
            comments: 0,
            going: 0,
            likes: 0,
        };
    }

    componentDidMount() {
        this._requestData();
    }

    get isLiked() {
        return (async () => {
            const {id} = this.props.navigation.state.params;

            const {isLoggedIn} = this.props.account;

            if (isLoggedIn) {
                let isLiked = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'events'),
                        Q.where('action', 'likes'),
                        Q.where('content', id.toLowerCase()),
                    )
                    .fetchCount();

                return isLiked > 0;
            }

            return false;
        })();
    }

    get isGoing() {
        return (async () => {
            const {id} = this.props.navigation.state.params;

            const {isLoggedIn} = this.props.account;

            if (isLoggedIn) {
                let isGoing = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'events'),
                        Q.where('action', 'going'),
                        Q.where('content', id.toLowerCase()),
                    )
                    .fetchCount();

                return isGoing > 0;
            }

            return false;
        })();
    }

    _requestData = () => {
        const {id} = this.props.navigation.state.params;

        setTimeout(() => {
            info({
                where: ["id = '" + id + "'"],
            }).then(response => {
                const {status, message} = response;

                if (parseInt(status) === 1) {
                    this.setState({
                        data: message,
                        loading: false,
                        comments: message.comments,
                        going: message.going,
                        likes: message.likes,
                    });
                }
            });
        }, 200);
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

    checkLogin = () => {
        const {account} = this.props;

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
                                onPress: () =>
                                    this.props.navigation.navigate('Signin'),
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

    recordOp = (op, events) => {
        const {comments, likes, going} = this.state;
        const {account, system} = this.props;
        const {lat, lng, area} = system;

        const {country, city} = area;

        if (this.checkLogin() === true) {
            if (op === 'add') {
                const data = {
                    id: UUID.v4()
                        .toUpperCase()
                        .replace(/-/g, ''),
                    business: account.id,
                    lat: lat,
                    lng: lng,
                    country: country,
                    city: city,
                    type: events.type,
                    action: events.action,
                    content: events.data.id,
                };

                this.props.dispatch(add(data));

                setTimeout(() => {
                    this.setState({
                        [events.action.toLowerCase()]:
                            (events.action.toLowerCase() === 'likes'
                                ? likes
                                : events.action.toLowerCase() === 'comments'
                                ? comments
                                : going) + 1,
                    });
                }, 500);
            } else if (op === 'remove') {
                const data = {
                    business: account.id,
                    type: events.type,
                    action: events.action,
                    content: events.data.id,
                };

                this.props.dispatch(remove(data));

                setTimeout(() => {
                    this.setState({
                        [events.action.toLowerCase()]:
                            (events.action.toLowerCase() === 'likes'
                                ? likes
                                : events.action.toLowerCase() === 'comments'
                                ? comments
                                : going) - 1,
                    });
                }, 300);
            }
        }
    };

    _renderInfo = name => {
        const {data, comments, likes, going} = this.state;

        const {navigation, system} = this.props;

        const {params, locale} = system;

        let render;

        if (name === 'banner') {
            render = (
                <Image
                    source={{
                        uri: Common.load_image(data.banner),
                    }}
                    style={[
                        {
                            width: WIDTH,
                            height: EventsConfig.topRatedBannerHeight + 40,
                        },
                    ]}
                />
            );
        } else if (name === 'actions') {
            const isLiked = this.isLiked;

            const isGoing = this.isGoing;

            render = (
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.row_around,
                        Style.p_t_3,
                    ]}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (isLiked) {
                                this.recordOp('remove', {
                                    type: 'events',
                                    action: 'likes',
                                    data: data,
                                });
                            } else {
                                this.recordOp('add', {
                                    type: 'events',
                                    action: 'likes',
                                    data: data,
                                });
                            }
                        }}>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.b_half,
                                Style.border_round_1,
                                Style.p_h_4,
                                Style.p_v_2,
                            ]}>
                            <MaterialCommunityIcons
                                name={
                                    isLiked
                                        ? 'star-circle'
                                        : 'star-circle-outline'
                                }
                                style={[
                                    Style.f_size_25,
                                    isLiked
                                        ? Style.f_color_cityseeker
                                        : Style.f_color_3,
                                ]}
                            />
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_weight_500,
                                    Style.f_fa_pf,
                                    Style.m_l_2,
                                    isLiked
                                        ? Style.f_color_cityseeker
                                        : Style.f_color_3,
                                ]}>
                                {I18n.t('events.likes')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (isGoing) {
                                this.recordOp('remove', {
                                    type: 'events',
                                    action: 'going',
                                    data: data,
                                });
                            } else {
                                this.recordOp('add', {
                                    type: 'events',
                                    action: 'going',
                                    data: data,
                                });
                            }
                        }}>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.b_half,
                                Style.border_round_1,
                                Style.p_h_4,
                                Style.p_v_2,
                            ]}>
                            <MaterialCommunityIcons
                                name={
                                    isGoing
                                        ? 'check-circle'
                                        : 'check-circle-outline'
                                }
                                style={[
                                    Style.f_size_25,
                                    isGoing
                                        ? Style.f_color_wechat
                                        : Style.f_color_3,
                                ]}
                            />
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_weight_500,
                                    Style.f_fa_pf,
                                    Style.m_l_2,
                                    isGoing
                                        ? Style.f_color_wechat
                                        : Style.f_color_3,
                                ]}>
                                {I18n.t('events.going')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            );
        } else if (name === 'title') {
            render = (
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.p_h_3,
                        Style.p_t_3,
                    ]}>
                    {data.category !== undefined && (
                        <TouchableWithoutFeedback
                            onPress={() =>
                                navigation.navigate({
                                    routeName: 'EventsCategory',
                                    params: {
                                        categoryName: data.category,
                                    },
                                    key: 'key_' + data.category,
                                })
                            }>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_weight_600,
                                    Style.f_fa_pf,
                                    Style.p_2,
                                    Style.m_r_2,
                                    Style.border_round_1,
                                    Style.overflow_hidden,
                                    Style.bg_color_gray,
                                ]}>
                                {I18n.t('events.category.' + data.category)}
                            </Text>
                        </TouchableWithoutFeedback>
                    )}
                    {data.title !== undefined && (
                        <Text
                            style={[
                                Style.flex,
                                Style.f_size_15,
                                Style.f_color_1,
                                Style.f_weight_600,
                                Style.f_fa_pf,
                            ]}>
                            {data.title}
                        </Text>
                    )}
                </View>
            );
        } else if (name === 'content') {
            const calendar =
                data.calendar !== undefined &&
                data.calendar.length > 0 &&
                _.sortBy(data.calendar, ['c_begin', 'c_end']).map(
                    (calendarItem, key) => {
                        return (
                            <View
                                key={key}
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_b_2,
                                ]}>
                                {calendarItem.c_begin !== undefined &&
                                    Moment(calendarItem.c_begin).isValid() && (
                                        <View
                                            style={[
                                                Style.row,
                                                Style.column_center,
                                            ]}>
                                            <Text
                                                style={[
                                                    Style.f_size_13,
                                                    Style.f_color_4,
                                                    Style.f_weight_500,
                                                    Style.f_fa_pf,
                                                ]}>
                                                {Common.dayOfWeek(
                                                    calendarItem.c_begin,
                                                    locale,
                                                )}
                                            </Text>
                                            {Common.getDate('year') !==
                                            Common.getDate(
                                                'year',
                                                calendarItem.c_begin,
                                            ) ? (
                                                <Text
                                                    style={[
                                                        Style.f_size_13,
                                                        Style.f_color_4,
                                                        Style.f_weight_500,
                                                        Style.f_fa_pf,
                                                    ]}>
                                                    {', ' +
                                                        Common.dayAndMonthAndYear(
                                                            calendarItem.c_begin,
                                                            locale,
                                                        )}
                                                </Text>
                                            ) : (
                                                <Text
                                                    style={[
                                                        Style.f_size_13,
                                                        Style.f_color_4,
                                                        Style.f_weight_500,
                                                        Style.f_fa_pf,
                                                    ]}>
                                                    {', ' +
                                                        Common.dayAndMonth(
                                                            calendarItem.c_begin,
                                                            locale,
                                                        )}
                                                </Text>
                                            )}
                                            {(Common.getDate(
                                                'hour',
                                                calendarItem.c_begin,
                                            ) > 0 ||
                                                Common.getDate(
                                                    'minute',
                                                    calendarItem.c_begin,
                                                ) > 0) && (
                                                <Text
                                                    style={[
                                                        Style.f_size_13,
                                                        Style.f_color_4,
                                                        Style.f_weight_500,
                                                        Style.f_fa_pf,
                                                    ]}>
                                                    {' ' +
                                                        Common.minuteAndHour(
                                                            calendarItem.c_begin,
                                                            locale,
                                                        )}
                                                </Text>
                                            )}

                                            {calendarItem.c_end !== undefined &&
                                                Moment(
                                                    calendarItem.c_end,
                                                ).isValid() && (
                                                    <View
                                                        style={[
                                                            Style.row,
                                                            Style.column_center,
                                                        ]}>
                                                        <MaterialCommunityIcons
                                                            name="minus"
                                                            style={[
                                                                Style.m_l_1,
                                                                Style.f_color_6,
                                                                Style.f_size_17,
                                                            ]}
                                                        />
                                                        {Common.getDate(
                                                            'year',
                                                            calendarItem.c_end,
                                                        ) !==
                                                        Common.getDate(
                                                            'year',
                                                            calendarItem.c_begin,
                                                        ) ? (
                                                            <View
                                                                style={[
                                                                    Style.row,
                                                                    Style.column_center,
                                                                ]}>
                                                                <Text
                                                                    style={[
                                                                        Style.f_size_13,
                                                                        Style.f_color_4,
                                                                        Style.f_weight_500,
                                                                        Style.f_fa_pf,
                                                                    ]}>
                                                                    {' ' +
                                                                        Common.dayOfWeek(
                                                                            calendarItem.c_end,
                                                                            locale,
                                                                        )}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        Style.f_size_13,
                                                                        Style.f_color_4,
                                                                        Style.f_weight_500,
                                                                        Style.f_fa_pf,
                                                                    ]}>
                                                                    {', ' +
                                                                        Common.dayAndMonthAndYear(
                                                                            calendarItem.c_end,
                                                                            locale,
                                                                        )}
                                                                </Text>
                                                            </View>
                                                        ) : Common.getDate(
                                                              'month',
                                                              calendarItem.c_end,
                                                          ) !==
                                                              Common.getDate(
                                                                  'month',
                                                                  calendarItem.c_begin,
                                                              ) ||
                                                          Common.getDate(
                                                              'dayOfMonth',
                                                              calendarItem.c_end,
                                                          ) !==
                                                              Common.getDate(
                                                                  'dayOfMonth',
                                                                  calendarItem.c_begin,
                                                              ) ? (
                                                            <View
                                                                style={[
                                                                    Style.row,
                                                                    Style.column_center,
                                                                ]}>
                                                                <Text
                                                                    style={[
                                                                        Style.f_size_13,
                                                                        Style.f_color_4,
                                                                        Style.f_weight_500,
                                                                        Style.f_fa_pf,
                                                                    ]}>
                                                                    {' ' +
                                                                        Common.dayOfWeek(
                                                                            calendarItem.c_end,
                                                                            locale,
                                                                        )}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        Style.f_size_13,
                                                                        Style.f_color_4,
                                                                        Style.f_weight_500,
                                                                        Style.f_fa_pf,
                                                                    ]}>
                                                                    {', ' +
                                                                        Common.dayAndMonth(
                                                                            calendarItem.c_end,
                                                                            locale,
                                                                        )}
                                                                </Text>
                                                            </View>
                                                        ) : null}
                                                        {(Common.getDate(
                                                            'hour',
                                                            calendarItem.c_end,
                                                        ) > 0 ||
                                                            Common.getDate(
                                                                'minute',
                                                                calendarItem.c_end,
                                                            ) > 0) && (
                                                            <Text
                                                                style={[
                                                                    Style.f_size_13,
                                                                    Style.f_color_4,
                                                                    Style.f_weight_500,
                                                                    Style.f_fa_pf,
                                                                ]}>
                                                                {' ' +
                                                                    Common.minuteAndHour(
                                                                        calendarItem.c_end,
                                                                        locale,
                                                                    )}
                                                            </Text>
                                                        )}
                                                    </View>
                                                )}
                                            <TimeAgo
                                                date={calendarItem.c_begin}
                                                live={false}
                                                containerStyle={[Style.m_l_1]}
                                                textStyle={[
                                                    Style.f_size_11,
                                                    Style.f_color_cityseeker,
                                                    Style.f_weight_500,
                                                ]}
                                                {...this.props}
                                            />
                                        </View>
                                    )}
                            </View>
                        );
                    },
                );

            const actions = [];

            if (parseInt(going) > 0) {
                actions.push(
                    <TouchableWithoutFeedback
                        onPress={() =>
                            navigation.navigate({
                                routeName: 'EventsActions',
                                params: {
                                    id: data.id,
                                    tabName: 'going',
                                },
                                key: data.id + 'going',
                            })
                        }>
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_4,
                                Style.f_weight_500,
                                Style.f_fa_pf,
                                Style.m_r_2,
                            ]}>
                            {Common.customNumber(going) +
                                ' ' +
                                I18n.t('events.going')}
                        </Text>
                    </TouchableWithoutFeedback>,
                );
            }

            if (parseInt(likes) > 0) {
                actions.push(
                    <TouchableWithoutFeedback
                        onPress={() =>
                            navigation.navigate({
                                routeName: 'EventsActions',
                                params: {
                                    id: data.id,
                                    tabName: 'likes',
                                },
                                key: data.id + 'likes',
                            })
                        }>
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_4,
                                Style.f_weight_500,
                                Style.f_fa_pf,
                                Style.m_r_2,
                            ]}>
                            {Common.customNumber(likes) +
                                ' ' +
                                I18n.t('events.likes')}
                        </Text>
                    </TouchableWithoutFeedback>,
                );
            }

            if (parseInt(comments) > 0) {
                actions.push(
                    <TouchableWithoutFeedback
                        onPress={() =>
                            navigation.navigate({
                                routeName: 'EventsActions',
                                params: {
                                    id: data.id,
                                    tabName: 'comments',
                                },
                                key: data.id + 'comments',
                            })
                        }>
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_4,
                                Style.f_weight_500,
                                Style.f_fa_pf,
                            ]}>
                            {Common.customNumber(comments) +
                                ' ' +
                                I18n.t('common.comments')}
                        </Text>
                    </TouchableWithoutFeedback>,
                );
            }

            render = (
                <View>
                    {(parseInt(comments) > 0 ||
                        parseInt(going) > 0 ||
                        parseInt(likes) > 0) && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.p_h_2,
                                Style.p_t_3,
                            ]}>
                            <MaterialCommunityIcons
                                name={'account-multiple'}
                                style={[
                                    Style.f_size_21,
                                    Style.f_color_6,
                                    Style.m_r_2,
                                ]}
                            />
                            <View style={[Style.row, Style.column_center]}>
                                {actions}
                            </View>
                        </View>
                    )}
                    {data.address !== undefined && (
                        <DirectionLink address={data.address} {...this.props}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_start,
                                    Style.p_h_2,
                                    Style.p_t_3,
                                ]}>
                                <MaterialCommunityIcons
                                    name={'map-marker'}
                                    style={[
                                        Style.f_size_21,
                                        Style.f_color_6,
                                        Style.m_r_2,
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_4,
                                        Style.f_weight_500,
                                        Style.f_fa_pf,
                                        Style.wrap,
                                    ]}>
                                    {data.address}
                                </Text>
                            </View>
                        </DirectionLink>
                    )}
                    {(data.ticket !== undefined ||
                        data.price !== undefined) && (
                        <TouchableWithoutFeedback
                            onPress={
                                data.ticket !== undefined && data.ticket
                                    ? this._showWebModal.bind(this, data.ticket)
                                    : () => {}
                            }>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.p_h_2,
                                    Style.p_t_3,
                                ]}>
                                <MaterialCommunityIcons
                                    name={'ticket'}
                                    style={[
                                        Style.f_size_21,
                                        Style.f_color_6,
                                        Style.m_r_2,
                                    ]}
                                />
                                {data.price !== undefined && (
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_color_4,
                                            Style.f_weight_500,
                                            Style.f_fa_pf,
                                        ]}>
                                        {parseInt(data.price) === 0
                                            ? I18n.t('common.free')
                                            : Common.price(
                                                  data.price,
                                                  I18n.t(params.currency),
                                              )}
                                    </Text>
                                )}
                                {data.ticket !== undefined && (
                                    <MaterialCommunityIcons
                                        name={'arrow-right'}
                                        style={[
                                            Style.f_size_15,
                                            Style.f_color_6,
                                            Style.m_l_2,
                                        ]}
                                    />
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    {calendar !== null && calendar.length > 0 && (
                        <View
                            style={[
                                Style.row,
                                Style.column_start,
                                Style.p_h_2,
                                Style.p_t_3,
                            ]}>
                            <MaterialCommunityIcons
                                name={'clock'}
                                style={[
                                    Style.f_size_21,
                                    Style.f_color_6,
                                    Style.m_r_2,
                                ]}
                            />
                            <View style={[Style.column, Style.row_center]}>
                                {calendar}
                            </View>
                        </View>
                    )}
                    {data.detail && (
                        <View style={[Style.b_t, Style.p_h_3, Style.p_b_5]}>
                            <Text
                                style={[
                                    Style.f_size_17,
                                    Style.f_color_3,
                                    Style.f_weight_600,
                                    Style.f_fa_pf,
                                    Style.p_v_3,
                                ]}>
                                {I18n.t('common.detail')}
                            </Text>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_4,
                                    Style.f_weight_500,
                                    Style.f_fa_pf,
                                ]}>
                                {data.detail}
                            </Text>
                        </View>
                    )}
                </View>
            );
        }

        return render;
    };

    render() {
        const {data, webUrl, webModalVisible, loading} = this.state;

        return loading === true || Object.keys(data).length === 0 ? (
            <View style={[Style.flex, Style.row_center, Style.column_center]}>
                <LoadingIndicator />
            </View>
        ) : (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{
                    vertical: 'never',
                }}>
                <StatusBar
                    hidden={!HIDE_STATUS}
                    barStyle="dark-content"
                    translucent={!TRANSLUCENT_STATUS}
                />
                <ScrollView
                    automaticallyAdjustContentInsets={true}
                    showsVerticalScrollIndicator={false}
                    {...scrollProps}>
                    <View style={[Style.theme_content]}>
                        {this._renderInfo('banner')}
                        {this._renderInfo('actions')}
                        {this._renderInfo('title')}
                        {this._renderInfo('content')}
                    </View>
                </ScrollView>
                <WebModal
                    url={webUrl}
                    visible={webModalVisible}
                    onDismiss={this._hideWebModal}
                />
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        account: state.account,
        system: state.system,
    };
}

export default connect(mapStateToProps)(Default);
