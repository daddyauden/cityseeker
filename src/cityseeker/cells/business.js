import React from 'react';
import {Text, View, Image, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Swiper from 'react-native-swiper';
import {Common} from '../utils/lib';
import I18n from '../locale';
import Style from '../style';

const ALBUM_HEIGHT = 200;

class Business extends React.Component {
    _showBusiness = data => {
        if (parseInt(data.condition) === 1) {
            this.props.navigation.navigate({
                routeName: 'BusinessInfo',
                params: {
                    business: data,
                },
                key: data.id,
            });
        } else {
            this.props.navigation.navigate({
                routeName: 'UserInfo',
                params: {
                    user: data,
                },
                key: data.id,
            });
        }
    };

    _renderProfile = name => {
        const {data} = this.props;

        let render;

        if (name === 'album') {
            const album =
                data.images !== undefined && data.images.length > 0 ? (
                    data.images.map((image, index) => {
                        return (
                            <TouchableWithoutFeedback
                                key={index}
                                onPress={() => this._showBusiness(data)}>
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
                            </TouchableWithoutFeedback>
                        );
                    })
                ) : data.cover ? (
                    <TouchableWithoutFeedback
                        onPress={() => this._showBusiness(data)}>
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
                    </TouchableWithoutFeedback>
                ) : (
                    <TouchableWithoutFeedback
                        onPress={() => this._showBusiness(data)}>
                        <Image
                            style={[
                                Style.w_p100,
                                Style.h_p100,
                                Style.img_cover,
                            ]}
                            source={require('../../common/assets/images/placeholder.png')}
                        />
                    </TouchableWithoutFeedback>
                );

            render = (
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.row_center,
                        Style.overflow_hidden,
                        Style.m_b_2,
                    ]}>
                    <Swiper
                        height={ALBUM_HEIGHT}
                        index={0}
                        loop={false}
                        dotColor={Style.f_color_15.color}
                        activeDotColor={Style.f_color_cityseeker.color}
                        scrollEnabled={true}
                        showsHorizontalScrollIndicator={false}>
                        {album}
                    </Swiper>
                </View>
            );
        } else if (name === 'name') {
            render = (
                <View style={[Style.column, Style.m_b_2]}>
                    {data.type && (
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_3,
                                Style.f_weight_500,
                                Style.f_fa_pf,
                            ]}
                            numberOfLines={1}>
                            {I18n.t('type.' + data.type)}
                        </Text>
                    )}
                    {data.name && (
                        <Text
                            style={[
                                Style.f_size_15,
                                Style.f_color_1,
                                Style.f_weight_600,
                                Style.f_fa_pf,
                                Style.m_t_1,
                            ]}
                            numberOfLines={1}>
                            {data.name}
                        </Text>
                    )}
                </View>
            );
        } else if (name === 'tag') {
            const tags = data.tag
                ? data.tag.map((tag, index) => (
                      <Text
                          key={index}
                          style={[
                              Style.f_size_12,
                              Style.f_color_3,
                              Style.f_weight_500,
                              Style.m_r_1,
                          ]}>
                          {tag}
                      </Text>
                  ))
                : [];

            render = tags !== null && tags.length > 0 && (
                <View style={[Style.row, Style.column_center, Style.m_b_2]}>
                    {tags}
                </View>
            );
        } else if (name === 'views') {
            render = (data.views !== undefined ||
                data.ratings !== undefined ||
                data.likes !== undefined) && (
                <View
                    style={[
                        Style.row,
                        Style.row_between,
                        Style.column_center,
                        Style.m_b_2,
                    ]}>
                    {data.ratings !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                            ]}>
                            <MaterialCommunityIcons
                                name="star"
                                style={[Style.f_size_16, Style.f_color_3]}
                            />
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_0,
                                    Style.f_weight_600,
                                ]}>
                                {' ' + Common.customNumber(data.ratings)}
                            </Text>
                        </View>
                    )}
                    {data.follower !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.m_l_3,
                            ]}>
                            <MaterialCommunityIcons
                                name="account-heart"
                                style={[Style.f_size_16, Style.f_color_3]}
                            />
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_0,
                                    Style.f_weight_600,
                                ]}>
                                {' ' + Common.customNumber(data.follower)}
                            </Text>
                        </View>
                    )}
                    {data.likes !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.m_l_3,
                            ]}>
                            <MaterialCommunityIcons
                                name="map-marker-radius"
                                style={[Style.f_size_16, Style.f_color_3]}
                            />
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_0,
                                    Style.f_weight_600,
                                ]}>
                                {' ' + Common.customNumber(data.likes)}
                            </Text>
                        </View>
                    )}
                    {data.views !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.m_l_3,
                            ]}>
                            <MaterialCommunityIcons
                                name="eye-settings"
                                style={[Style.f_size_16, Style.f_color_3]}
                            />
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_0,
                                    Style.f_weight_600,
                                ]}>
                                {' ' + Common.customNumber(data.views)}
                            </Text>
                        </View>
                    )}
                </View>
            );
        }

        return render;
    };

    render() {
        const {data} = this.props;

        return (
            <View style={[Style.column, Style.row_center]}>
                {this._renderProfile('album')}
                <TouchableWithoutFeedback
                    onPress={() => this._showBusiness(data)}>
                    <View
                        style={[
                            Style.p_h_2,
                            Style.column,
                            Style.row_center,
                            Style.column_start,
                        ]}>
                        {this._renderProfile('name')}
                        {this._renderProfile('tag')}
                        {this._renderProfile('views')}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

export default Business;
