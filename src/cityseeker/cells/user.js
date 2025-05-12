import React from 'react';
import {
    Text,
    View,
    ImageBackground,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import WebModal from '../components/WebModal';
import BusinessModel from '../model/business';
import Avator from '../components/Avator';
import {Common} from '../utils/lib';
import I18n from '../locale';
import Style from '../style';

const AVATOR_WITH = 40;
const COVER_HEIGHT = 180;

class Business extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            webVisible: false,
            webUrl: '',
        };
    }

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

    _showWeb = url => {
        this.setState({
            webUrl: url,
            webVisible: true,
        });
    };

    _hideWeb = () => {
        this.setState({
            webVisible: false,
        });
    };

    _renderProfile = name => {
        const {data} = this.props;

        let render;

        if (name === 'avator') {
            render = (
                <View
                    style={[
                        Style.row,
                        Style.row_center,
                        Style.column_center,
                        Style.bg_color_15,
                        {
                            borderRadius: AVATOR_WITH / 2,
                        },
                    ]}>
                    <Avator
                        user={data}
                        isLink={
                            data.condition !== undefined &&
                            data.condition !== null &&
                            parseInt(data.condition) === 1
                                ? false
                                : null
                        }
                        size={AVATOR_WITH}
                    />
                </View>
            );
        } else if (name === 'name') {
            render = data.name && (
                <View
                    style={[
                        Style.column,
                        Style.column_center,
                        Style.row_center,
                    ]}>
                    {data.type && (
                        <Text
                            style={[
                                Style.f_size_15,
                                Style.f_color_2,
                                Style.f_weight_700,
                                Style.m_t_1,
                            ]}
                            numberOfLines={1}>
                            {I18n.t('type.' + data.type)}
                        </Text>
                    )}
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_color_3,
                            Style.f_weight_500,
                            Style.m_t_1,
                        ]}
                        numberOfLines={1}>
                        {data.name}
                    </Text>
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
                        <Icon
                            key={key}
                            name={name}
                            style={{
                                fontSize: size,
                                color: color,
                                ...Style.m_r_2,
                                ...Style.m_t_1,
                            }}
                            onPress={this._showWeb.bind(
                                this,
                                link + data[socialName],
                            )}
                        />
                    );
                });

            render = (
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.row_center,
                        Style.wrap,
                    ]}>
                    {render}
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
                                Style.m_r_1,
                                Style.m_t_1,
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
                        Style.row_center,
                        Style.wrap,
                    ]}>
                    {render}
                </View>
            );
        } else if (name === 'basic') {
            render = (data.tel || data.phone) && (
                <View style={[Style.row, Style.column_center, Style.wrap]}>
                    {data.phone && (
                        <TouchableWithoutFeedback
                            onPress={() => Common.tel(data.phone, true)}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_r_1,
                                    Style.m_t_1,
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
                                    Style.m_r_1,
                                    Style.m_t_1,
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
                                    {data.tel}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </View>
            );
        } else if (name === 'intro') {
            render = data.intro && (
                <View style={[Style.row, Style.column_center, Style.m_t_1]}>
                    <Text
                        numberOfLines={1}
                        style={[
                            {
                                lineHeight: 17,
                            },
                            Style.f_size_12,
                            Style.f_color_3,
                            Style.f_weight_400,
                        ]}>
                        {I18n.t('user.intro') + ': ' + data.intro}
                    </Text>
                </View>
            );
        } else if (name === 'description') {
            render = data.description && (
                <View style={[Style.row, Style.column_center, Style.m_t_1]}>
                    <Text
                        numberOfLines={3}
                        style={[
                            {
                                lineHeight: 18,
                            },
                            Style.f_fa_pf,
                            Style.f_size_13,
                            Style.f_color_3,
                            Style.f_weight_400,
                        ]}>
                        {data.description}
                    </Text>
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
                        Style.m_t_2,
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
                                style={[Style.f_size_16, Style.f_color_0]}
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
                    {data.likes !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.m_l_1,
                            ]}>
                            <MaterialCommunityIcons
                                name="thumb-up-outline"
                                style={[Style.f_size_16, Style.f_color_0]}
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
                                Style.m_l_1,
                            ]}>
                            <MaterialCommunityIcons
                                name="eye-settings"
                                style={[Style.f_size_16, Style.f_color_0]}
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
        } else if (name === 'tag') {
            render = data.tag && (
                <View style={[Style.row, Style.column_center, Style.m_t_1]}>
                    {data.tag.map((tag, index) => (
                        <Text
                            numberOfLines={2}
                            key={index}
                            style={[
                                Style.f_size_13,
                                Style.f_color_2,
                                Style.f_weight_500,
                                Style.m_r_1,
                            ]}>
                            {tag}
                        </Text>
                    ))}
                </View>
            );
        }

        return render;
    };

    render() {
        const {data} = this.props;

        const cover =
            data.cover !== undefined && data.cover !== null
                ? {uri: Common.load_image(data.cover)}
                : require('../../common/assets/images/splash.jpg');

        return (
            <TouchableWithoutFeedback
                onPress={this._showBusiness.bind(this, data)}>
                <ImageBackground
                    style={[
                        Style.w_100,
                        Style.column,
                        Style.column_start,
                        Style.row_center,
                        {
                            height: COVER_HEIGHT,
                        },
                    ]}
                    source={cover}>
                    <TouchableWithoutFeedback
                        onPress={this._showBusiness.bind(this, data)}>
                        <View
                            style={[
                                Style.column,
                                Style.column_center,
                                Style.row_center,
                                Style.p_2,
                                Style.bg_color_15_transparent_7,
                                Style.w_p55,
                                Style.h_p100,
                            ]}>
                            {this._renderProfile('avator')}
                            {this._renderProfile('name')}
                            {/*{this._renderProfile("intro")}*/}
                            {this._renderProfile('tag')}
                            {this._renderProfile('social')}
                            {/*{this._renderProfile("views")}*/}
                            {/*{this._renderProfile("description")}*/}
                        </View>
                    </TouchableWithoutFeedback>
                    {/*<TouchableWithoutFeedback*/}
                    {/*    onPress={this._showBusiness.bind(this, data)}*/}
                    {/*>*/}
                    {/*    <View*/}
                    {/*        style={[*/}
                    {/*            // Style.flex,*/}
                    {/*            Style.column,*/}
                    {/*            Style.column_center,*/}
                    {/*            Style.row_center,*/}
                    {/*            Style.p_2,*/}
                    {/*            Style.bg_color_15_transparent_7,*/}
                    {/*            Style.w_p55*/}
                    {/*        ]}*/}
                    {/*    >*/}
                    {/*        {this._renderProfile("views")}*/}
                    {/*    </View>*/}
                    {/*</TouchableWithoutFeedback>*/}

                    <WebModal
                        url={this.state.webUrl}
                        visible={this.state.webVisible}
                        onDismiss={this._hideWeb}
                    />
                </ImageBackground>
            </TouchableWithoutFeedback>
        );
    }
}

export default Business;
