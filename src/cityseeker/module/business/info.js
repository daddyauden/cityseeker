import React from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {SafeAreaView} from 'react-navigation';
import Swiper from 'react-native-swiper';
import UUID from 'react-native-uuid';
import {connect} from 'react-redux';

import {Q} from '@nozbe/watermelondb';

import database from '../../lib/database';

import RocketChat from '../../../lingchat/lib/rocketchat';

import {Common, scrollProps} from '../../utils/lib';
import Log from '../../utils/log';

import LoadingIndicator from '../../components/LoadingIndicator';
import DirectionLink from '../../components/DirectionLink';
import ComplainLink from '../../components/ComplainLink';
import AlbumModal from '../../components/AlbumModal';
import StatusBar from '../../components/StatusBar';
import WebModal from '../../components/WebModal';
import Avator from '../../components/Avator';

import {add, remove} from '../../actions/record';
import {info} from '../../actions/business';

import BusinessModel from '../../model/business';

import I18n from '../../locale';
import Style from '../../style';

const AVATOR_WITH = 80;
const ALBUM_HEIGHT = Style.h_100.height - 300;

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {business} = navigation.state.params;

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
                        type: 'business',
                        data: {...business},
                    }}
                />
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
            albumModalVisible: false,
            imageIndex: 0,
            webModalVisible: false,
            webUrl: '',
            comments: 0,
            likes: 0,
            follower: 0,
            following: 0,
            items: 0,
        };
    }

    componentDidMount() {
        this._requestData();
    }

    get isLiked() {
        return (async () => {
            const {data} = this.state;

            const {isLoggedIn} = this.props.account;

            if (isLoggedIn) {
                let isLiked = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'business'),
                        Q.where('action', 'likes'),
                        Q.where('content', data.id.toLowerCase()),
                    )
                    .fetchCount();

                return isLiked > 0;
            }

            return false;
        })();
    }

    get isFollowing() {
        return (async () => {
            const {data} = this.state;

            const {isLoggedIn} = this.props.account;

            if (isLoggedIn) {
                let isFollowing = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'business'),
                        Q.where('action', 'following'),
                        Q.where('content', data.id.toLowerCase()),
                    )
                    .fetchCount();

                return isFollowing > 0;
            }

            return false;
        })();
    }

    _requestData = () => {
        const {business} = this.props.navigation.state.params;

        setTimeout(() => {
            info({
                where: ["id = '" + business.id + "'", 'condition = 1'],
            }).then(response => {
                const {status, message} = response;

                if (parseInt(status) === 1) {
                    this.setState({
                        data: message,
                        loading: false,
                        items: message.items || 0,
                        comments: message.comments || 0,
                        likes: message.likes || 0,
                        follower: message.follower || 0,
                        following: message.following || 0,
                    });
                } else {
                    this.setState({
                        loading: false,
                    });
                }
            });
        }, 200);
    };

    _sendMessage = async () => {
        const {data} = this.state;
        const {navigation} = this.props;

        try {
            const {username} = data;
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

    _hideAlbumModal = () => {
        this.setState({
            albumModalVisible: false,
        });
    };

    _showAlbumModal = index => {
        this.setState({
            imageIndex: index,
            albumModalVisible: true,
        });
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

        const {likes, comments} = this.state;

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

    _renderProfile = name => {
        const {
            data,
            comments,
            likes,
            items,
            follower,
            following,
            albumModalVisible,
            imageIndex,
        } = this.state;

        const {account, navigation} = this.props;

        let render;

        if (name === 'cover') {
            const album =
                data.images !== undefined && data.images.length > 0 ? (
                    data.images.map((image, index) => {
                        return (
                            <View key={index}>
                                <Image
                                    key={index}
                                    style={[
                                        Style.w_p100,
                                        Style.h_p100,
                                        Style.img_cover,
                                    ]}
                                    source={{
                                        uri: Common.load_image(image),
                                    }}
                                />
                            </View>
                        );
                    })
                ) : data.cover ? (
                    <View>
                        <Image
                            style={[
                                Style.w_p100,
                                Style.h_p100,
                                Style.img_cover,
                            ]}
                            source={{
                                uri: Common.load_image(data.cover),
                            }}
                        />
                    </View>
                ) : (
                    <Image
                        style={[Style.w_p100, Style.h_p100, Style.img_cover]}
                        source={require('../../../common/assets/images/placeholder.png')}
                    />
                );

            render = (
                <View
                    style={[Style.row, Style.column_center, Style.row_center]}>
                    <Swiper
                        height={ALBUM_HEIGHT}
                        index={0}
                        loop={false}
                        dotColor={Style.f_color_15.color}
                        activeDotColor={Style.f_color_cityseeker.color}
                        scrollEnabled={true}
                        showsPagination={true}
                        showsHorizontalScrollIndicator={false}>
                        {album}
                    </Swiper>
                    <AlbumModal
                        index={imageIndex}
                        data={data.images || [data.cover] || []}
                        visible={albumModalVisible}
                        onCancel={this._hideAlbumModal}
                    />
                </View>
            );
        } else if (name === 'avator') {
            render = (
                <View
                    style={[Style.row, Style.row_center, Style.column_center]}>
                    <Avator user={data} size={AVATOR_WITH} />
                </View>
            );
        } else if (name === 'social') {
            let socialArr = [];

            Object.keys(BusinessModel.social).map(name => {
                data[name] !== undefined && socialArr.push(name);
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
                                link + data[socialName],
                            )}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_r_2,
                                ]}>
                                <FontAwesome5
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
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.wrap,
                        Style.m_t_2,
                    ]}>
                    {render}
                    {this._renderProfile('reservation')}
                </View>
            );
        } else if (name === 'reservation') {
            render = (
                <View style={[Style.row, Style.column_center]}>
                    {data.reservation && (
                        <TouchableWithoutFeedback
                            onPress={this._showWebModal.bind(
                                this,
                                data.reservation,
                            )}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_r_2,
                                ]}>
                                <MaterialCommunityIcons
                                    name={'calendar-heart'}
                                    style={[
                                        Style.f_color_google,
                                        Style.f_size_25,
                                        Style.m_r_1,
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_3,
                                        Style.f_weight_500,
                                        Style.f_fa_pf,
                                    ]}>
                                    {I18n.t('user.reservation')}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    {data.menu && (
                        <TouchableWithoutFeedback
                            onPress={this._showWebModal.bind(this, data.menu)}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_r_2,
                                ]}>
                                <MaterialCommunityIcons
                                    name={'book-open-page-variant'}
                                    style={[
                                        Style.f_color_google,
                                        Style.f_size_23,
                                        Style.m_r_1,
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_3,
                                        Style.f_weight_500,
                                        Style.f_fa_pf,
                                    ]}>
                                    {I18n.t('user.menu')}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </View>
            );
        } else if (name === 'name') {
            render = (data.name || data.username) && (
                <View style={[Style.row, Style.column_center, Style.wrap]}>
                    {data.name && (
                        <Text
                            style={[
                                Style.f_size_15,
                                Style.f_color_3,
                                Style.f_weight_500,
                            ]}>
                            {data.name}
                        </Text>
                    )}
                    {data.type && (
                        <View
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.m_l_2,
                                Style.p_h_3,
                                Style.p_v_2,
                                Style.border_round_2,
                                Style.bg_color_14,
                                Style.wrap,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_1,
                                    Style.f_bold,
                                ]}>
                                {I18n.t('type.' + data.type)}
                            </Text>
                        </View>
                    )}
                </View>
            );
        } else if (name === 'intro') {
            render = data.intro && (
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.wrap,
                        Style.m_t_2,
                    ]}>
                    <Text
                        style={[
                            {
                                lineHeight: 17,
                            },
                            Style.f_size_13,
                            Style.f_color_3,
                            Style.f_weight_400,
                        ]}>
                        {I18n.t('user.intro') + ': ' + data.intro}
                    </Text>
                </View>
            );
        } else if (name === 'message') {
            let messageArr = [];
            Object.keys(BusinessModel.message).map(name => {
                data[name] !== undefined && messageArr.push(name);
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
                                Style.m_r_4,
                            ]}>
                            <FontAwesome5
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
                                {data[messageName]}
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
                        Style.m_t_4,
                    ]}>
                    {render}
                </View>
            );
        } else if (name === 'actions') {
            render = (
                <View style={[Style.row, Style.column_center, Style.m_t_2]}>
                    <MaterialCommunityIcons
                        name={'account-multiple'}
                        style={[Style.f_size_21, Style.f_color_6, Style.m_r_2]}
                    />
                    <View style={[Style.row, Style.column_center]}>
                        <TouchableWithoutFeedback
                            onPress={() =>
                                navigation.navigate({
                                    routeName: 'LifeActions',
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
                                    Style.m_r_2,
                                ]}>
                                {Common.customNumber(comments) +
                                    ' ' +
                                    I18n.t('common.comments')}
                            </Text>
                        </TouchableWithoutFeedback>
                        {parseInt(likes) > 0 && (
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    navigation.navigate({
                                        routeName: 'LifeActions',
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
                                        I18n.t('common.checkin')}
                                </Text>
                            </TouchableWithoutFeedback>
                        )}
                        {parseInt(items) > 0 && (
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    navigation.navigate({
                                        routeName: 'LifeActions',
                                        params: {
                                            id: data.id,
                                            tabName: 'items',
                                        },
                                        key: data.id + 'items',
                                    })
                                }>
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_4,
                                        Style.f_weight_500,
                                        Style.f_fa_pf,
                                    ]}>
                                    {Common.customNumber(items) +
                                        ' ' +
                                        I18n.t('app.tab.service')}
                                </Text>
                            </TouchableWithoutFeedback>
                        )}
                    </View>
                </View>
            );
        } else if (name === 'basic') {
            render = (data.tel || data.phone) && (
                <View style={[Style.row, Style.column_center]}>
                    {data.phone && (
                        <TouchableWithoutFeedback
                            onPress={() => Common.tel(data.phone, true)}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_t_2,
                                ]}>
                                <FontAwesome5
                                    name="mobile-alt"
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_6,
                                        Style.m_r_2,
                                    ]}
                                />
                                <Text
                                    style={[Style.f_size_12, Style.f_color_5]}>
                                    {data.phone}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    {data.tel && (
                        <TouchableWithoutFeedback
                            onPress={() => Common.tel(data.tel, true)}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_t_2,
                                ]}>
                                <FontAwesome5
                                    name="phone"
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_6,
                                        Style.m_r_2,
                                    ]}
                                />
                                <Text
                                    style={[Style.f_size_12, Style.f_color_5]}>
                                    {data.tel}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </View>
            );
        } else if (name === 'homepage') {
            render = data.homepage && (
                <TouchableWithoutFeedback
                    onPress={this._showWebModal.bind(this, data.homepage)}>
                    <View style={[Style.row, Style.column_center, Style.m_t_2]}>
                        <FontAwesome5
                            name="home"
                            style={[
                                Style.f_size_15,
                                Style.f_color_6,
                                Style.m_r_2,
                            ]}
                        />
                        <Text style={[Style.f_size_13, Style.f_color_5]}>
                            {data.homepage}
                        </Text>
                        <FontAwesome5
                            name="external-link-square-alt"
                            style={[
                                Style.f_size_13,
                                Style.f_color_facebook,
                                Style.m_l_1,
                            ]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            );
        } else if (name === 'address') {
            render = parseInt(data.condition) === 1 && data.address && (
                <DirectionLink address={data.address} {...this.props}>
                    <View style={[Style.row, Style.column_start, Style.m_t_2]}>
                        <FontAwesome5
                            name="map-marker-alt"
                            style={[
                                Style.f_size_16,
                                Style.f_color_6,
                                Style.m_r_2,
                            ]}
                        />
                        <Text
                            style={[
                                Style.flex,
                                Style.f_size_12,
                                Style.f_color_5,
                                Style.wrap,
                            ]}>
                            {data.address}
                            {', '}
                            {Common.capitalize(data.city)} {data.zip}
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
            );
        } else if (name === 'description') {
            render = data.description && (
                <View
                    style={[Style.b_t, Style.m_t_3, Style.p_h_1, Style.p_b_5]}>
                    <Text
                        style={[
                            Style.f_size_17,
                            Style.f_color_3,
                            Style.f_weight_600,
                            Style.f_fa_pf,
                            Style.p_v_3,
                        ]}>
                        {I18n.t('common.description')}
                    </Text>
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_color_4,
                            Style.f_weight_500,
                            Style.f_fa_pf,
                        ]}>
                        {data.description}
                    </Text>
                </View>
            );
        } else if (name === 'checkin') {
            let isLiked = this.isLiked;

            render = (
                <TouchableWithoutFeedback
                    onPress={() => {
                        if (isLiked) {
                            this.recordOp('remove', {
                                type: 'business',
                                action: 'likes',
                                content: data.id,
                            });
                        } else {
                            this.recordOp('add', {
                                type: 'business',
                                action: 'likes',
                                content: data.id,
                            });
                        }

                        account.isLoggedIn &&
                            setTimeout(() => this.forceUpdate(), 500);
                    }}>
                    <View style={[Style.row, Style.column_center, Style.p_h_8]}>
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
        } else if (name === 'chat') {
            let isFollowing = this.isFollowing;

            render = data.id !== account.id && (
                <View style={[Style.flex, Style.row, Style.column_center]}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (isFollowing) {
                                this.recordOp('remove', {
                                    type: 'business',
                                    action: 'following',
                                    content: data.id,
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
                                    content: data.id,
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
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.border_round_3,
                                Style.p_v_1,
                                Style.b_half,
                                isFollowing ? null : Style.flex,
                                isFollowing ? Style.p_h_1 : Style.p_h_2,
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
                    {isFollowing && data.username && (
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
            render = data.tag && (
                <View style={[Style.row, Style.column_center, Style.m_t_1]}>
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
                    {data.tag.map((tag, index) => (
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
                data.features && data.features.length > 0
                    ? data.features.map((feature, index) => {
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
        } else if (name === 'follow') {
            render = (
                <View style={[Style.row, Style.column_center, Style.m_t_1]}>
                    <TouchableWithoutFeedback
                        onPress={() =>
                            parseInt(follower) > 0
                                ? navigation.navigate('UserFollow', {
                                      user: {
                                          ...data,
                                          likes: likes,
                                          follower: follower,
                                      },
                                      tabName: 'follower',
                                  })
                                : {}
                        }>
                        <View
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.m_r_5,
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
                                    Style.m_l_2,
                                ]}>
                                {I18n.t('common.follower')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() =>
                            parseInt(following) > 0
                                ? navigation.navigate('UserFollow', {
                                      user: {
                                          ...data,
                                          likes: likes,
                                          follower: follower,
                                      },
                                      tabName: 'following',
                                  })
                                : {}
                        }>
                        <View
                            style={[
                                Style.row,
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
                                    Style.m_l_2,
                                ]}>
                                {I18n.t('common.following')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            );
        }

        return render;
    };

    render() {
        const {webUrl, webModalVisible, loading} = this.state;

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
                <StatusBar light />
                <ScrollView
                    automaticallyAdjustContentInsets={true}
                    showsVerticalScrollIndicator={false}
                    {...scrollProps}>
                    {this._renderProfile('cover')}
                    <View style={[Style.row, Style.p_2]}>
                        {/*{this._renderProfile('avator')}*/}
                        <View style={[Style.row_center, Style.m_l_3]}>
                            {this._renderProfile('name')}
                            {this._renderProfile('follow')}
                        </View>
                    </View>
                    <View style={[Style.p_h_2]}>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_between,
                                Style.m_v_1,
                            ]}>
                            {this._renderProfile('chat')}
                            {this._renderProfile('checkin')}
                        </View>
                        {this._renderProfile('intro')}
                        {this._renderProfile('social')}
                        {this._renderProfile('actions')}
                        {this._renderProfile('message')}
                        {this._renderProfile('basic')}
                        {this._renderProfile('homepage')}
                        {this._renderProfile('address')}
                        {this._renderProfile('features')}
                        {this._renderProfile('description')}
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
