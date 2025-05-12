import React from 'react';
import {
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
    Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UUID from 'react-native-uuid';

import {Q} from '@nozbe/watermelondb';

import database from '../lib/database';

import {add, remove} from '../actions/record';

import AlbumModal from '../components/AlbumModal';
import TimeAgo from '../components/TimeAgo';
import Avator from '../components/Avator';
import {Common} from '../utils/lib';
import Style from '../style/index';
import I18n from '../locale';

const AVATOR_WIDTH = 50;
const SPACE = 10;
const WIDTH = Dimensions.get('window').width;
const M_IMG_WIDTH = (WIDTH - SPACE * 3 - AVATOR_WIDTH) / 3;
const S_IMG_WIDTH = WIDTH - SPACE * 3 - AVATOR_WIDTH;
const S_IMG_HEIGHT = WIDTH / 2;

class Repost extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAlbumModal: false,
            imageIndex: 0,
        };
    }

    get isFollowing() {
        return (async () => {
            const {business} = this.props.data;

            const {isLoggedIn} = this.props.account;

            if (isLoggedIn) {
                let isFollowing = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'business'),
                        Q.where('action', 'following'),
                        Q.where('content', business.id.toLowerCase()),
                    )
                    .fetchCount();

                return isFollowing > 0;
            }

            return false;
        })();
    }

    _hideAlbumModal = () => {
        this.setState({
            showAlbumModal: false,
        });
    };

    _showAlbumModal = index => {
        this.setState({
            imageIndex: index,
            showAlbumModal: true,
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
                this.forceUpdate();
            } else if (op === 'remove') {
                const data = {
                    business: account.id,
                    ...record,
                };

                this.props.dispatch(remove(data));
                this.forceUpdate();
            }
        }
    };

    render() {
        const {data, account} = this.props;
        const {business, title, images, add_time} = data;

        const isFollowing = this.isFollowing;

        const c_business = business.name ? (
            <Text
                numberOfLines={1}
                style={[
                    Style.f_size_13,
                    Style.f_color_3,
                    Style.f_fa_pf,
                    Style.f_weight_500,
                ]}>
                {business.name}
            </Text>
        ) : null;

        const c_intro = business.intro && (
            <Text
                numberOfLines={1}
                style={[
                    {
                        marginTop: SPACE / 2,
                    },
                    Style.f_size_11,
                    Style.f_color_5,
                    Style.f_fa_pf,
                    Style.f_weight_400,
                ]}>
                {business.intro}
            </Text>
        );

        const c_title = (
            <Text
                style={[
                    Style.f_size_13,
                    Style.f_color_3,
                    Style.f_weight_400,
                    Style.m_t_1,
                ]}>
                {title ? title : I18n.t('common.reposts')}
            </Text>
        );

        const c_images =
            images && images.length > 1 ? (
                images.map((image, index) => {
                    return (
                        <TouchableWithoutFeedback
                            key={index}
                            onPress={() => this._showAlbumModal(index)}>
                            <View
                                style={[
                                    {
                                        width: M_IMG_WIDTH,
                                        height: M_IMG_WIDTH,
                                        padding: SPACE / 4,
                                    },
                                ]}>
                                <Image
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
                        </TouchableWithoutFeedback>
                    );
                })
            ) : images && images.length === 1 ? (
                <TouchableWithoutFeedback
                    onPress={() => this._showAlbumModal(0)}>
                    <View
                        style={{
                            width: S_IMG_WIDTH,
                            height: S_IMG_HEIGHT,
                            padding: SPACE / 10,
                        }}>
                        <Image
                            style={[
                                Style.w_p100,
                                Style.h_p100,
                                Style.img_cover,
                            ]}
                            source={{
                                uri: Common.load_image(images[0]),
                            }}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ) : null;

        const c_add_time = add_time ? (
            <TimeAgo
                date={add_time}
                live={false}
                containerStyle={{
                    marginTop: SPACE / 2,
                }}
                textStyle={[Style.f_size_10, Style.f_color_10]}
                system={this.props.system}
            />
        ) : null;

        return (
            <View
                style={[
                    Style.row,
                    Style.row_start,
                    Style.column_start,
                    {
                        paddingHorizontal: SPACE,
                        paddingVertical: SPACE,
                    },
                ]}>
                <Avator user={business} size={AVATOR_WIDTH} />
                <View
                    style={[
                        Style.flex,
                        Style.column,
                        Style.column_start,
                        {
                            marginLeft: SPACE,
                        },
                    ]}>
                    <View
                        style={[
                            Style.row,
                            Style.column_start,
                            Style.row_start,
                        ]}>
                        <View style={[Style.flex, Style.column]}>
                            {c_business}
                            {c_intro}
                            {c_title}
                        </View>
                        {business.id !== account.id && (
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    if (isFollowing) {
                                        this.recordOp('remove', {
                                            type: 'business',
                                            action: 'following',
                                            content: business.id,
                                        });
                                    } else {
                                        this.recordOp('add', {
                                            type: 'business',
                                            action: 'following',
                                            content: business.id,
                                        });
                                    }
                                }}>
                                <View
                                    style={[
                                        Style.row,
                                        Style.row_center,
                                        Style.column_center,
                                        Style.border_round_3,
                                        Style.m_l_1,
                                        Style.p_v_1,
                                        Style.p_h_2,
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
                                    <Text
                                        style={[
                                            Style.m_l_1,
                                            Style.f_size_13,
                                            Style.f_fa_pf,
                                            Style.f_weight_400,
                                            isFollowing
                                                ? Style.f_color_cityseeker
                                                : Style.f_color_3,
                                        ]}>
                                        {isFollowing
                                            ? I18n.t('common.following')
                                            : I18n.t('common.follow')}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    </View>
                    {c_images && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.wrap,
                                {
                                    marginTop: SPACE / 2,
                                },
                            ]}>
                            {c_images}
                            <AlbumModal
                                index={this.state.imageIndex}
                                data={images}
                                visible={this.state.showAlbumModal}
                                onCancel={this._hideAlbumModal}
                            />
                        </View>
                    )}
                    {c_add_time}
                </View>
            </View>
        );
    }
}

export default Repost;
