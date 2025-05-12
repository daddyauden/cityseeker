import React from 'react';
import {
    View,
    Image,
    Text,
    StatusBar,
    Dimensions,
    TouchableWithoutFeedback,
    ScrollView,
    Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';
import UUID from 'react-native-uuid';

import {Q} from '@nozbe/watermelondb';

import database from '../../lib/database';

import RocketChat from '../../../lingchat/lib/rocketchat';

import {Common, HIDE_STATUS, TRANSLUCENT_STATUS} from '../../utils/lib';
import Log from '../../utils/log';

import LoadingIndicator from '../../components/LoadingIndicator';
import DirectionLink from '../../components/DirectionLink';
import FlatListView from '../../components/FlatListView';
import ComplainLink from '../../components/ComplainLink';
import WebModal from '../../components/WebModal';
import Avator from '../../components/Avator';
import Divide from '../../components/Divide';

import {add, remove} from '../../actions/record';
import {info} from '../../actions/business';

import BusinessModel from '../../model/business';
import RouteConfig from '../../config/route';
import I18n from '../../locale';
import Style from '../../style';

const WIDTH = Dimensions.get('window').width;
const HEADER_HEIGHT = 40;
const COVER_HEIGHT = 240;
const AVATOR_WITH = 80;

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {user} = navigation.state.params;

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
            headerRight: (
                <ComplainLink
                    params={{
                        type:
                            user.condition !== undefined &&
                            parseInt(user.condition) === 1
                                ? 'business'
                                : 'user',
                        data: {...user},
                    }}
                />
            ),
            headerTransparent: true,
            headerStyle: {
                elevation: 0,
                borderBottomWidth: 0,
            },
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            webModalVisible: false,
            webUrl: '',
            user: {},
            likes: 0,
            follower: 0,
            following: 0,
            headerHeight: 0,
            tabs: [],
            tabNow: '',
            data: {},
        };
    }

    componentDidMount() {
        const {navigation} = this.props;

        this._requestData();
    }

    _requestData() {
        const {user} = this.props.navigation.state.params;

        const where =
            user.id !== undefined && user.id
                ? ["id ='" + user.id + "'"]
                : user.uid !== undefined && user.uid
                ? ["uid ='" + user.uid + "'"]
                : user.username !== undefined && user.username
                ? ["username ='" + user.username + "'"]
                : null;

        info({
            where: where,
        }).then(response => {
            const {status, message} = response;

            if (parseInt(status) === 1) {
                let tabs = [];

                const tabNow = 'feed_original';

                const data = {
                    cellType: 'user_original_feed',
                    requestHost: RouteConfig.feed.list,
                    select: [
                        'id',
                        'business',
                        'type',
                        'title',
                        'content',
                        'images',
                        'reposts',
                        'likes',
                        'comments',
                        'views',
                        'add_time',
                        'nearby',
                    ],
                    where: [
                        "business ='" + message.id + "'",
                        "type != 'repost'",
                    ],
                    order: ['add_time DESC nulls last'],
                    renderSeparator: () => {
                        return (
                            <Divide
                                style={{
                                    ...Style.p_b_1,
                                    ...Style.h_0,
                                    ...Style.bg_color_14,
                                }}
                            />
                        );
                    },
                };

                if (
                    message.condition !== undefined &&
                    parseInt(message.condition) === 1
                ) {
                    tabs = [
                        {
                            label: I18n.t('app.tab.feed_original'),
                            tabNow: 'feed_original',
                        },
                        {
                            label: I18n.t('app.tab.feed_nearby'),
                            tabNow: 'feed_nearby',
                        },
                    ];
                }

                if (
                    message.condition !== undefined &&
                    parseInt(message.condition) === 0
                ) {
                    tabs = [
                        {
                            label: I18n.t('app.tab.feed_original'),
                            tabNow: 'feed_original',
                        },
                        {
                            label: I18n.t('app.tab.feed_comment'),
                            tabNow: 'feed_comment',
                        },
                        {
                            label: I18n.t('app.tab.feed_repost'),
                            tabNow: 'feed_repost',
                        },
                        {
                            label: I18n.t('app.tab.feed_like'),
                            tabNow: 'feed_like',
                        },
                    ];
                }

                if (
                    message.type !== undefined &&
                    message.type !== null &&
                    parseInt(message.items) > 0
                ) {
                    tabs.push({
                        label: I18n.t('app.tab.service'),
                        tabNow: 'items',
                    });
                }

                this.setState({
                    tabs,
                    tabNow,
                    data,
                    user: message,
                    likes: message.likes,
                    follower: message.follower,
                    following: message.following,
                    loading: false,
                });
            }
        });
    }

    get isLiked() {
        return (async () => {
            const {user} = this.state;

            const {isLoggedIn} = this.props.account;

            if (isLoggedIn) {
                let isLiked = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'business'),
                        Q.where('action', 'likes'),
                        Q.where('content', user.id.toLowerCase()),
                    )
                    .fetchCount();

                return isLiked > 0;
            }

            return false;
        })();
    }

    get isFollowing() {
        return (async () => {
            const {user} = this.state;

            const {isLoggedIn} = this.props.account;

            if (isLoggedIn) {
                let isLiked = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'business'),
                        Q.where('action', 'following'),
                        Q.where('content', user.id.toLowerCase()),
                    )
                    .fetchCount();

                return isLiked > 0;
            }

            return false;
        })();
    }

    _sendMessage = async () => {
        const {user} = this.state;
        const {navigation} = this.props;

        try {
            const {username} = user;
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

    recordOp = (op, record) => {
        const {account, system} = this.props;
        const {lat, lng, area} = system;

        const {country, city} = area;

        const {likes, comments} = this.state;

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
                    ...record,
                };

                this.props.dispatch(add(data));

                if (
                    record.action.toLowerCase() === 'likes' ||
                    record.action.toLowerCase() === 'comments'
                ) {
                    this.setState({
                        [record.action.toLowerCase()]:
                            (record.action.toLowerCase() === 'likes'
                                ? likes
                                : comments) + 1,
                    });
                }
            } else if (op === 'remove') {
                const data = {
                    business: account.id,
                    ...record,
                };

                this.props.dispatch(remove(data));

                if (
                    record.action.toLowerCase() === 'likes' ||
                    record.action.toLowerCase() === 'comments'
                ) {
                    this.setState({
                        [record.action.toLowerCase()]:
                            record.action.toLowerCase() === 'likes'
                                ? likes - 1
                                : comments - 1,
                    });
                }
            }
        }
    };

    showFeed = data => {
        const {navigation} = this.props;

        navigation.navigate({
            routeName: 'FeedInfo',
            params: {
                data: data,
            },
            key: data.id,
        });
    };

    showRepost = (feed, feedType, pickerType, mediaType) => {
        const {navigation} = this.props;

        if (this.checkLogin() === true) {
            navigation.navigate({
                routeName: 'post_feed',
                params: {
                    data: feed,
                    feedType: feedType,
                    pickerType: pickerType,
                    mediaType: mediaType,
                },
            });
        }
    };

    showComment = (feed, commentType, pickerType, mediaType) => {
        const {navigation} = this.props;

        if (this.checkLogin() === true) {
            navigation.navigate({
                routeName: 'post_comment',
                params: {
                    data: feed,
                    commentType: commentType,
                    pickerType: pickerType,
                    mediaType: mediaType,
                },
            });
        }
    };

    _renderProfile = name => {
        const {user, follower, likes} = this.state;

        const {account, system} = this.props;

        const {params} = system;

        let render;

        if (name === 'cover') {
            render =
                user.cover !== undefined && user.cover !== null ? (
                    <View
                        style={[
                            {
                                width: WIDTH,
                                height: COVER_HEIGHT,
                            },
                        ]}>
                        <Image
                            source={{uri: Common.load_image(user.cover)}}
                            style={[Style.w_p100, Style.h_p100]}
                        />
                    </View>
                ) : (
                    <View
                        style={[
                            {
                                width: WIDTH,
                                height: COVER_HEIGHT,
                            },
                        ]}>
                        <Image
                            source={require('../../../common/assets/images/splash.jpg')}
                            style={[Style.w_p100, Style.h_p100]}
                        />
                    </View>
                );
        } else if (name === 'avator') {
            render = (
                <View
                    style={[
                        Style.row,
                        Style.row_center,
                        Style.column_center,
                        Style.bg_color_15,
                        {
                            padding: 1,
                        },
                        Style.border_round_8,
                        Style.b_15,
                    ]}>
                    <Avator user={user} size={AVATOR_WITH} />
                </View>
            );
        } else if (name === 'social') {
            let socialArr = [];

            Object.keys(BusinessModel.social).map(name => {
                user[name] !== undefined && socialArr.push(name);
            });

            render =
                socialArr.length > 0 &&
                socialArr.map((socialName, key) => {
                    const {link, icon} = BusinessModel.social[socialName];
                    const {name, size, color} = icon;
                    return (
                        <TouchableWithoutFeedback
                            key={key}
                            onPress={this._showWebModal.bind(
                                this,
                                link + user[socialName],
                            )}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.p_h_1,
                                    Style.p_v_1,
                                ]}>
                                <Icon
                                    name={name}
                                    style={{
                                        fontSize: size,
                                        color: color,
                                    }}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    );
                });

            render = (
                <View style={[Style.row, Style.column_center, Style.wrap]}>
                    {render}
                </View>
            );
        } else if (name === 'name') {
            render = (user.name || user.username) && (
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.row_between,
                        Style.m_t_5,
                    ]}>
                    <View style={[Style.column, Style.column_start]}>
                        <View
                            style={[
                                Style.row,
                                Style.wrap,
                                Style.row_start,
                                Style.column_center,
                            ]}>
                            {user.name && (
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_3,
                                        Style.f_weight_500,
                                    ]}
                                    numberOfLines={1}>
                                    {user.name}
                                </Text>
                            )}
                            {user.type && (
                                <Text
                                    style={[
                                        Style.f_size_11,
                                        Style.f_color_5,
                                        Style.f_weight_400,
                                        Style.m_l_2,
                                    ]}
                                    numberOfLines={1}>
                                    {I18n.t('type.' + user.type)}
                                </Text>
                            )}
                        </View>
                        <View
                            style={[
                                Style.row,
                                Style.wrap,
                                Style.row_start,
                                Style.column_center,
                                Style.m_t_1,
                            ]}>
                            {user.username && (
                                <Text
                                    style={[
                                        Style.f_size_14,
                                        Style.f_color_5,
                                        Style.f_weight_500,
                                        Style.m_r_2,
                                    ]}
                                    numberOfLines={1}>
                                    {'@' + user.username}
                                </Text>
                            )}
                            {user.gender !== undefined &&
                                user.gender !== null && (
                                    <Icon
                                        name={
                                            parseInt(user.gender) === 1
                                                ? 'mars'
                                                : 'venus'
                                        }
                                        style={[
                                            Style.f_size_13,
                                            Style.f_color_5,
                                            Style.m_r_2,
                                        ]}
                                    />
                                )}
                            {user.emotion !== undefined &&
                                user.emotion !== null && (
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                        ]}>
                                        <Icon
                                            name={
                                                parseInt(user.emotion) === 2
                                                    ? 'heartbeat'
                                                    : 'heart'
                                            }
                                            solid={true}
                                            style={[
                                                Style.m_r_1,
                                                Style.f_size_10,
                                                {
                                                    color:
                                                        parseInt(user.emotion) >
                                                        1
                                                            ? Style
                                                                  .f_color_cityseeker
                                                                  .color
                                                            : Style.f_color_5
                                                                  .color,
                                                },
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                Style.f_size_10,
                                                Style.f_color_5,
                                                Style.f_weight_400,
                                            ]}>
                                            {I18n.t(
                                                'user.emotion.' + user.emotion,
                                            )}
                                        </Text>
                                    </View>
                                )}
                        </View>
                    </View>
                    {this._renderProfile('social')}
                </View>
            );
        } else if (name === 'intro') {
            render = user.intro && (
                <View style={[Style.row, Style.column_center, Style.m_t_1]}>
                    <View style={[Style.row, Style.column_center, Style.wrap]}>
                        <Text
                            numberOfLines={2}
                            style={[
                                {
                                    lineHeight: 17,
                                },
                                Style.f_size_13,
                                Style.f_color_3,
                                Style.f_weight_400,
                            ]}>
                            {I18n.t('user.intro') + ': ' + user.intro}
                        </Text>
                    </View>
                </View>
            );
        } else if (name === 'message') {
            let messageArr = [];
            Object.keys(BusinessModel.message).map(name => {
                user[name] !== undefined && messageArr.push(name);
            });

            render =
                messageArr.length > 0 &&
                messageArr.map((messageName, key) => {
                    const {name, size, color} = BusinessModel.message[
                        messageName
                    ]['icon'];
                    return (
                        <View
                            key={key}
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_r_2,
                                Style.m_b_1,
                            ]}>
                            <Icon
                                name={name}
                                style={{
                                    fontSize: size,
                                    color: color,
                                }}
                            />
                            <Text
                                style={[
                                    Style.f_size_12,
                                    Style.f_color_5,
                                    Style.m_l_1,
                                ]}>
                                {user[messageName]}
                            </Text>
                        </View>
                    );
                });

            render = messageArr.length > 0 && (
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.wrap,
                        Style.m_t_2,
                    ]}>
                    {render}
                </View>
            );
        } else if (name === 'basic') {
            render = (user.tel ||
                user.phone ||
                user.location ||
                user.hometown ||
                user.birthday) && (
                <View
                    style={[
                        Style.wrap,
                        Style.row,
                        Style.column_center,
                        Style.m_t_2,
                    ]}>
                    {user.phone && (
                        <TouchableWithoutFeedback
                            onPress={() => Common.tel(user.phone, true)}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_r_2,
                                    Style.m_b_1,
                                ]}>
                                <Icon
                                    name="mobile-alt"
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_5,
                                        Style.m_r_1,
                                    ]}
                                />
                                <Text
                                    style={[Style.f_size_12, Style.f_color_5]}>
                                    {user.phone}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    {user.tel && (
                        <TouchableWithoutFeedback
                            onPress={() => Common.tel(user.tel, true)}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_r_2,
                                    Style.m_b_1,
                                ]}>
                                <Icon
                                    name="phone"
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_5,
                                        Style.m_r_1,
                                    ]}
                                />
                                <Text
                                    style={[Style.f_size_12, Style.f_color_5]}>
                                    {user.tel}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    {user.location && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_r_2,
                                Style.m_b_1,
                            ]}>
                            <Icon
                                name="map-marker-alt"
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_5,
                                    Style.m_r_1,
                                ]}
                            />
                            <Text style={[Style.f_size_12, Style.f_color_5]}>
                                {I18n.t('user.location') + ': ' + user.location}
                            </Text>
                        </View>
                    )}
                    {user.hometown && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_r_2,
                                Style.m_b_1,
                            ]}>
                            <Icon
                                name="map-marker-alt"
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_5,
                                    Style.m_r_1,
                                ]}
                            />
                            <Text style={[Style.f_size_12, Style.f_color_5]}>
                                {I18n.t('user.hometown') + ': ' + user.hometown}
                            </Text>
                        </View>
                    )}
                    {user.birthday && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_r_2,
                                Style.m_b_1,
                            ]}>
                            <Icon
                                name="birthday-cake"
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_5,
                                    Style.m_r_1,
                                ]}
                            />
                            <Text style={[Style.f_size_12, Style.f_color_5]}>
                                {Common.datetime(user.birthday, 'YYYY-MM-DD')}
                            </Text>
                        </View>
                    )}
                </View>
            );
        } else if (name === 'joinDate') {
            render = (user.homepage || user.add_time) && (
                <View
                    style={[
                        Style.wrap,
                        Style.row,
                        Style.column_center,
                        Style.m_t_2,
                    ]}>
                    {user.homepage && (
                        <TouchableWithoutFeedback
                            onPress={this._showWebModal.bind(
                                this,
                                user.homepage,
                            )}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_r_2,
                                    Style.m_b_1,
                                ]}>
                                <Icon
                                    name="home"
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_5,
                                        Style.m_r_1,
                                    ]}
                                />
                                <Text
                                    style={[Style.f_size_12, Style.f_color_5]}>
                                    {user.homepage}
                                </Text>
                                <Icon
                                    name="external-link-square-alt"
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_facebook,
                                        Style.m_l_1,
                                    ]}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    {user.add_time && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_r_2,
                                Style.m_b_1,
                            ]}>
                            <Icon
                                name="calendar-alt"
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_5,
                                    Style.m_r_1,
                                ]}
                            />
                            <Text style={[Style.f_size_12, Style.f_color_5]}>
                                {Common.datetime(
                                    user.add_time,
                                    params['date_format'],
                                ) +
                                    ' ' +
                                    I18n.t('common.join')}
                            </Text>
                        </View>
                    )}
                </View>
            );
        } else if (name === 'address') {
            render = parseInt(user.condition) === 1 && user.address && (
                <DirectionLink address={user.address} {...this.props}>
                    <View style={[Style.row, Style.column_center, Style.m_t_1]}>
                        <Icon
                            name="map-marker-alt"
                            style={[
                                Style.f_size_13,
                                Style.f_color_5,
                                Style.m_r_1,
                            ]}
                        />
                        <Text
                            style={[
                                Style.flex,
                                Style.f_size_12,
                                Style.f_color_5,
                            ]}>
                            {user.address}
                            {', '}
                            {Common.capitalize(user.city)} {user.zip}
                            {'  '}
                            <Icon
                                name="external-link-square-alt"
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_facebook,
                                ]}
                            />
                        </Text>
                    </View>
                </DirectionLink>
            );
        } else if (name === 'description') {
            render = user.description && (
                <View style={[Style.row, Style.column_center, Style.m_t_1]}>
                    <Text
                        numberOfLines={3}
                        style={[
                            {
                                lineHeight: 18,
                            },
                            Style.f_fa_pf,
                            Style.f_size_11,
                            Style.f_color_5,
                        ]}>
                        {user.description}
                    </Text>
                </View>
            );
        } else if (name === 'like') {
            let isLiked = this.isLiked;

            render =
                account.id === user.id ? null : (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (isLiked) {
                                this.recordOp('remove', {
                                    type: 'business',
                                    action: 'likes',
                                    content: user.id,
                                });
                            } else {
                                this.recordOp('add', {
                                    type: 'business',
                                    action: 'likes',
                                    content: user.id,
                                });
                            }

                            account.isLoggedIn &&
                                setTimeout(() => this.forceUpdate(), 500);
                        }}>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.p_h_3,
                            ]}>
                            <MaterialCommunityIcons
                                name={'map-marker-radius'}
                                style={[
                                    Style.f_size_21,
                                    Style.m_r_1,
                                    isLiked
                                        ? Style.f_color_cityseeker
                                        : Style.f_color_3,
                                ]}
                            />
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_fa_pf,
                                    Style.f_weight_400,
                                    isLiked
                                        ? Style.f_color_cityseeker
                                        : Style.f_color_3,
                                ]}>
                                {I18n.t('common.checkin')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                );
        } else if (name === 'follow') {
            let isFollowing = this.isFollowing;

            render = user.id !== account.id && (
                <View style={[Style.flex, Style.row, Style.column_center]}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (isFollowing) {
                                this.recordOp('remove', {
                                    type: 'business',
                                    action: 'following',
                                    content: user.id,
                                });

                                account.isLoggedIn &&
                                    setTimeout(() => {
                                        this.setState({
                                            follower: follower - 1,
                                        });
                                    }, 500);
                            } else {
                                this.recordOp('add', {
                                    type: 'business',
                                    action: 'following',
                                    content: user.id,
                                });

                                account.isLoggedIn &&
                                    setTimeout(() => {
                                        this.setState({
                                            follower: follower + 1,
                                        });
                                    }, 500);
                            }
                        }}>
                        <View
                            style={[
                                isFollowing ? null : Style.flex,
                                isFollowing ? Style.p_h_1 : Style.p_h_2,
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.border_round_3,
                                Style.p_v_1,
                                Style.b_half,
                            ]}>
                            <MaterialCommunityIcons
                                name={isFollowing ? 'check' : 'plus'}
                                style={[
                                    Style.f_size_16,
                                    isFollowing
                                        ? Style.f_color_cityseeker
                                        : Style.f_color_3,
                                ]}
                            />
                            {!isFollowing && (
                                <Text
                                    style={[
                                        Style.m_l_1,
                                        Style.f_size_13,
                                        Style.f_color_3,
                                        Style.f_weight_400,
                                        Style.f_fa_pf,
                                    ]}>
                                    {I18n.t('common.follow')}
                                </Text>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                    {isFollowing && user.username && (
                        <TouchableWithoutFeedback
                            onPress={() => this._sendMessage()}>
                            <View
                                style={[
                                    Style.flex,
                                    Style.row,
                                    Style.row_center,
                                    Style.column_center,
                                    Style.border_round_3,
                                    Style.m_l_2,
                                    Style.p_v_1,
                                    Style.p_h_2,
                                    Style.bg_color_gray,
                                ]}>
                                <Text
                                    style={[
                                        Style.m_l_1,
                                        Style.f_size_15,
                                        Style.f_fa_pf,
                                        Style.f_weight_500,
                                        Style.f_color_3,
                                    ]}>
                                    {I18n.t('send_message')}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </View>
            );
        } else if (name === 'tag') {
            render = user.tag && (
                <View style={[Style.row, Style.column_center, Style.m_t_2]}>
                    <Text
                        style={[
                            {
                                lineHeight: 17,
                            },
                            Style.f_size_12,
                            Style.f_color_1,
                            Style.f_weight_400,
                        ]}>
                        {I18n.t('user.tag') + ': '}
                    </Text>
                    {user.tag.map((tag, index) => (
                        <View
                            key={index}
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.bg_color_14,
                                Style.m_r_1,
                                Style.p_v_1,
                                Style.p_h_2,
                                Style.border_round_1,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_10,
                                    Style.f_color_0,
                                    Style.f_weight_400,
                                    Style.m_r_1,
                                ]}>
                                {tag}
                            </Text>
                        </View>
                    ))}
                </View>
            );
        } else if (name === 'features') {
            const business_features =
                user.features && user.features.length > 0
                    ? user.features.map((feature, index) => {
                          return (
                              <View
                                  key={index}
                                  style={[
                                      Style.w_p50,
                                      Style.p_b_2,
                                      Style.row,
                                      Style.row_start,
                                      Style.column_center,
                                  ]}>
                                  <MaterialCommunityIcons
                                      name="check-circle"
                                      style={[
                                          Style.f_size_20,
                                          Style.f_color_check,
                                          Style.m_r_1,
                                      ]}
                                  />
                                  <Text
                                      style={[
                                          Style.f_size_13,
                                          Style.f_color_2,
                                          Style.m_l_1,
                                      ]}>
                                      {I18n.t('features.' + feature)}
                                  </Text>
                              </View>
                          );
                      })
                    : null;

            render = business_features !== null && (
                <View style={[Style.column, Style.m_t_3]}>
                    <View
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.p_v_2,
                            Style.p_l_1,
                            Style.m_b_2,
                            Style.bg_color_gray,
                        ]}>
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_1,
                                Style.f_weight_400,
                            ]}>
                            {I18n.t('app.intro.more')}
                        </Text>
                    </View>
                    <View style={[Style.row, Style.wrap]}>
                        {business_features}
                    </View>
                </View>
            );
        }

        return render;
    };

    _renderHeader = () => {
        const {headerHeight, user, follower, following, likes} = this.state;

        return (
            <View
                onLayout={event => {
                    const {height} = event.nativeEvent.layout;

                    if (headerHeight === height) {
                        return;
                    }

                    this.setState({
                        headerHeight: height,
                    });
                }}
                style={[Style.theme_content]}>
                {this._renderProfile('cover')}
                <View style={[Style.column, Style.p_2]}>
                    <View
                        style={[
                            Style.row,
                            Style.column_start,
                            Style.row_between,
                        ]}>
                        {this._renderProfile('avator')}
                        <View
                            style={[
                                Style.flex,
                                Style.m_l_3,
                                Style.column,
                                Style.row_center,
                            ]}>
                            <View
                                style={[
                                    Style.row,
                                    Style.row_between,
                                    Style.column_center,
                                ]}>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        parseInt(follower) > 0
                                            ? this.props.navigation.navigate({
                                                  routeName: 'UserFollow',
                                                  params: {
                                                      user: {
                                                          ...user,
                                                          likes: likes,
                                                          follower: follower,
                                                      },
                                                      tabName: 'follower',
                                                  },
                                                  key: user.id + 'follower',
                                              })
                                            : {};
                                    }}>
                                    <View
                                        style={[
                                            Style.column,
                                            Style.row_center,
                                            Style.column_center,
                                            Style.m_r_3,
                                        ]}>
                                        <Text
                                            style={[
                                                Style.f_size_17,
                                                Style.f_weight_600,
                                                Style.f_fa_pf,
                                                parseInt(follower) > 0
                                                    ? Style.f_color_3
                                                    : Style.f_color_9,
                                            ]}>
                                            {Common.customNumber(follower)}
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
                                        parseInt(following) > 0
                                            ? this.props.navigation.navigate({
                                                  routeName: 'UserFollow',
                                                  params: {
                                                      user: {
                                                          ...user,
                                                          likes: likes,
                                                          follower: follower,
                                                      },
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
                                            Style.m_r_3,
                                        ]}>
                                        <Text
                                            style={[
                                                Style.f_size_17,
                                                Style.f_weight_600,
                                                Style.f_fa_pf,
                                                parseInt(following) > 0
                                                    ? Style.f_color_3
                                                    : Style.f_color_9,
                                            ]}>
                                            {Common.customNumber(following)}
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
                                        parseInt(likes) > 0
                                            ? this.props.navigation.navigate({
                                                  routeName: 'UserFollow',
                                                  params: {
                                                      user: {
                                                          ...user,
                                                          likes: likes,
                                                          follower: follower,
                                                      },
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
                                            Style.m_r_3,
                                        ]}>
                                        <Text
                                            style={[
                                                Style.f_size_17,
                                                Style.f_weight_600,
                                                Style.f_fa_pf,
                                                parseInt(likes) > 0
                                                    ? Style.f_color_3
                                                    : Style.f_color_9,
                                            ]}>
                                            {Common.customNumber(likes)}
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
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.row_between,
                                    Style.m_t_2,
                                ]}>
                                {this._renderProfile('follow')}
                                {this._renderProfile('like')}
                            </View>
                        </View>
                    </View>
                    {user.condition !== undefined &&
                        parseInt(user.condition) === 0 && (
                            <View>
                                {this._renderProfile('name')}
                                {this._renderProfile('intro')}
                                {this._renderProfile('tag')}
                                {this._renderProfile('message')}
                                {this._renderProfile('basic')}
                                {this._renderProfile('joinDate')}
                            </View>
                        )}
                    {user.condition !== undefined &&
                        parseInt(user.condition) === 1 && (
                            <View>
                                {this._renderProfile('name')}
                                {this._renderProfile('intro')}
                                {this._renderProfile('tag')}
                            </View>
                        )}
                </View>
                <Divide
                    style={{
                        ...Style.p_b_2,
                        ...Style.h_0,
                        ...Style.bg_color_14,
                    }}
                />
                {this._renderTabBar()}
            </View>
        );
    };

    _changeTab = tab => {
        const {user} = this.state;

        let data;

        if (tab.tabNow === 'feed_nearby') {
            data = {
                cellType: 'feed',
                requestHost: RouteConfig.feed.list,
                select: [
                    'id',
                    'business',
                    'type',
                    'title',
                    'content',
                    'images',
                    'reposts',
                    'likes',
                    'comments',
                    'views',
                    'add_time',
                    'nearby',
                ],
                where: [
                    "nearby ='" + user.id + "'",
                    "business != '" + user.id + "'",
                ],
                order: ['add_time DESC nulls last'],
                renderSeparator: () => {
                    return (
                        <Divide
                            style={{
                                ...Style.p_b_1,
                                ...Style.h_0,
                                ...Style.bg_color_14,
                            }}
                        />
                    );
                },
            };
        } else if (tab.tabNow === 'feed_original') {
            data = {
                cellType: 'user_original_feed',
                requestHost: RouteConfig.feed.list,
                select: [
                    'id',
                    'business',
                    'type',
                    'title',
                    'content',
                    'images',
                    'reposts',
                    'likes',
                    'comments',
                    'views',
                    'add_time',
                    'nearby',
                ],
                where: ["business ='" + user.id + "'", "type != 'repost'"],
                order: ['add_time DESC nulls last'],
                renderSeparator: () => {
                    return (
                        <Divide
                            style={{
                                ...Style.p_b_1,
                                ...Style.h_0,
                                ...Style.bg_color_14,
                            }}
                        />
                    );
                },
            };
        } else if (tab.tabNow === 'feed_comment') {
            data = {
                cellType: 'user_comment_feed',
                requestHost: RouteConfig.comment.feed,
                select: [
                    'id',
                    'business',
                    'content',
                    'type',
                    'title',
                    'images',
                    'add_time',
                ],
                where: ["business ='" + user.id + "'", "type = 'feed'"],
                order: ['add_time DESC nulls last'],
                renderSeparator: () => {
                    return (
                        <Divide
                            style={{
                                ...Style.p_b_1,
                                ...Style.h_0,
                                ...Style.bg_color_14,
                            }}
                        />
                    );
                },
            };
        } else if (tab.tabNow === 'feed_repost') {
            data = {
                cellType: 'feed',
                requestHost: RouteConfig.feed.list,
                select: [
                    'id',
                    'business',
                    'type',
                    'title',
                    'content',
                    'images',
                    'reposts',
                    'likes',
                    'comments',
                    'views',
                    'add_time',
                    'nearby',
                ],
                where: ["business ='" + user.id + "'", "type = 'repost'"],
                order: ['add_time DESC nulls last'],
                renderSeparator: () => {
                    return (
                        <Divide
                            style={{
                                ...Style.p_b_1,
                                ...Style.h_0,
                                ...Style.bg_color_14,
                            }}
                        />
                    );
                },
            };
        } else if (tab.tabNow === 'feed_like') {
            data = {
                cellType: 'user_like_feed',
                requestHost: RouteConfig.record.list,
                select: ['id', 'business', 'content', 'type', 'add_time'],
                where: [
                    "business ='" + user.id + "'",
                    "action = 'likes'",
                    "type = 'feed'",
                ],
                order: ['add_time DESC nulls last'],
                renderSeparator: () => {
                    return (
                        <Divide
                            style={{
                                ...Style.p_b_1,
                                ...Style.h_0,
                                ...Style.bg_color_14,
                            }}
                        />
                    );
                },
            };
        } else if (tab.tabNow === 'items') {
            data = {
                cellType: 'item',
                requestHost: RouteConfig.item.list,
                where: ["business ='" + user.id + "'", 'status = 1'],
                order: ['add_time DESC nulls last'],
            };
        }

        this.setState({
            tabNow: tab.tabNow,
            data: data,
        });
    };

    _renderTab = tab => {
        const {tabNow} = this.state;

        const isActive = tab.tabNow === tabNow;

        return (
            <TouchableWithoutFeedback
                onPress={() => this._changeTab(tab)}
                key={tab.tabNow}>
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.row_center,
                        Style.p_h_3,
                        {
                            height: HEADER_HEIGHT - 1,
                            borderBottomWidth: 2,
                            borderColor: isActive
                                ? Style.bg_color_cityseeker.backgroundColor
                                : Style.bg_color_15.backgroundColor,
                        },
                    ]}>
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_weight_600,
                            isActive ? Style.f_color_3 : Style.f_color_9,
                        ]}>
                        {tab.label}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    _renderTabBar = () => {
        const {tabs} = this.state;

        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                scrollEventThrottle={1}>
                {tabs.map(tab => this._renderTab(tab))}
            </ScrollView>
        );
    };

    render() {
        const {
            webUrl,
            webModalVisible,
            loading,
            tabNow,
            user,
            data,
            follower,
            likes,
        } = this.state;

        return loading === true ? (
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
                    hidden={HIDE_STATUS}
                    barStyle="dark-content"
                    translucent={TRANSLUCENT_STATUS}
                />
                <FlatListView
                    {...this.props}
                    {...data}
                    user={user}
                    extraData={[follower, likes]}
                    reloadToken={tabNow}
                    showRecordNum={true}
                    recordOp={this.recordOp}
                    showFeed={this.showFeed}
                    showRepost={this.showRepost}
                    showWeb={this._showWebModal}
                    showComment={this.showComment}
                    renderHeader={this._renderHeader}
                    // refreshControl={<RefreshControl progressViewOffset={200} />}
                    // bounces={false}
                    // automaticallyAdjustContentInsets={false}
                />
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
