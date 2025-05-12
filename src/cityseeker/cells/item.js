import React from 'react';
import {
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AutoImageHeight from '../components/AutoImageHeight';
import {Common} from '../utils/lib';
import BusinessType from '../type/business';
import I18n from '../locale';
import Style from '../style';

const SPACE = 10;
const WIDTH = Dimensions.get('window').width;
const S_BANNER_WIDTH = 80;
const S_BANNER_HEIGHT = 80;
const B_BANNER_HEIGHT = WIDTH / 2.5;

class Cell extends React.Component {
    _showItem = data => {
        this.props.navigation.navigate({
            routeName: 'item',
            params: {
                item: data,
            },
            key: data.id,
        });
    };

    render() {
        const {data, system} = this.props;
        const {trans, params} = system;

        const type = data.type.toLowerCase();

        return (
            <TouchableWithoutFeedback onPress={this._showItem.bind(this, data)}>
                <View
                    style={[
                        Style.w_100,
                        Style.column,
                        Style.row_center,
                        Style.bg_color_15,
                        {
                            padding: SPACE,
                        },
                    ]}>
                    {type === BusinessType.bakery ||
                    type === BusinessType.bar ||
                    type === BusinessType.beauty ||
                    type === BusinessType.beverage ||
                    type === BusinessType.brunch ||
                    type === BusinessType.carnie ||
                    type === BusinessType.cinema ||
                    type === BusinessType.coffee ||
                    type === BusinessType.education ||
                    type === BusinessType.entertainment ||
                    type === BusinessType.finance ||
                    type === BusinessType.gallery ||
                    type === BusinessType.gym ||
                    type === BusinessType.health ||
                    type === BusinessType.hotel ||
                    type === BusinessType.household ||
                    type === BusinessType.immigration ||
                    type === BusinessType.living ||
                    type === BusinessType.mall ||
                    type === BusinessType.market ||
                    type === BusinessType.media ||
                    type === BusinessType.museum ||
                    type === BusinessType.pastry ||
                    type === BusinessType.restaurant ||
                    type === BusinessType.spa ||
                    type === BusinessType.stadium ||
                    type === BusinessType.retail ||
                    type === BusinessType.studio ||
                    type === BusinessType.hotel ||
                    type === BusinessType.tax ||
                    type === BusinessType.theater ||
                    type === BusinessType.tourism ||
                    type === BusinessType.training ||
                    type === BusinessType.views ? (
                        <View style={[Style.column]}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.row_between,
                                    Style.m_b_1,
                                ]}>
                                <Text
                                    numberOfLines={2}
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_3,
                                        Style.f_weight_600,
                                        Style.f_fa_pf,
                                    ]}>
                                    {data.name}
                                </Text>
                                {(type === BusinessType.bakery ||
                                    type === BusinessType.bar ||
                                    type === BusinessType.beauty ||
                                    type === BusinessType.beverage ||
                                    type === BusinessType.brunch ||
                                    type === BusinessType.carnie ||
                                    type === BusinessType.coffee ||
                                    type === BusinessType.pastry ||
                                    type === BusinessType.restaurant) &&
                                    data.avarage !== undefined &&
                                    data.avarage !== null && (
                                        <View
                                            style={[
                                                Style.row,
                                                Style.column_center,
                                                Style.m_l_2,
                                                Style.bg_color_gray,
                                                Style.p_h_2,
                                                Style.p_v_1,
                                                Style.border_round_1,
                                                Style.overflow_hidden,
                                            ]}>
                                            <Text
                                                style={[
                                                    Style.f_size_11,
                                                    Style.f_color_5,
                                                    Style.f_weight_400,
                                                ]}>
                                                {I18n.t('common.avarage')}
                                            </Text>
                                            <Text
                                                style={[
                                                    Style.f_size_11,
                                                    Style.f_color_5,
                                                    Style.f_weight_400,
                                                    Style.m_l_1,
                                                ]}>
                                                {
                                                    trans[
                                                        'common.avarage.' +
                                                            data.avarage
                                                    ]
                                                }
                                            </Text>
                                        </View>
                                    )}
                                {(type === BusinessType.cinema ||
                                    type === BusinessType.education ||
                                    type === BusinessType.entertainment ||
                                    type === BusinessType.estate ||
                                    type === BusinessType.finance ||
                                    type === BusinessType.gallery ||
                                    type === BusinessType.gym ||
                                    type === BusinessType.health ||
                                    type === BusinessType.hotel ||
                                    type === BusinessType.household ||
                                    type === BusinessType.immigration ||
                                    type === BusinessType.living ||
                                    type === BusinessType.mall ||
                                    type === BusinessType.market ||
                                    type === BusinessType.media ||
                                    type === BusinessType.museum ||
                                    type === BusinessType.retail ||
                                    type === BusinessType.spa ||
                                    type === BusinessType.stadium ||
                                    type === BusinessType.studio ||
                                    type === BusinessType.tax ||
                                    type === BusinessType.theater ||
                                    type === BusinessType.tourism ||
                                    type === BusinessType.training ||
                                    type === BusinessType.views) &&
                                    data.price !== undefined &&
                                    data.price !== null &&
                                    parseInt(data.price) > 0 && (
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_color_3,
                                                Style.f_weight_400,
                                                Style.bg_color_gray,
                                                Style.p_h_2,
                                                Style.p_v_1,
                                                Style.border_round_1,
                                                Style.overflow_hidden,
                                            ]}>
                                            {Common.price(
                                                data.price,
                                                trans[params.currency],
                                            )}
                                        </Text>
                                    )}
                            </View>
                            <View style={[Style.column]}>
                                <View
                                    style={[
                                        Style.row,
                                        Style.row_center,
                                        Style.column_center,
                                        Style.border_round_1,
                                        Style.overflow_hidden,
                                        {
                                            width: WIDTH - SPACE * 2,
                                            height: B_BANNER_HEIGHT,
                                        },
                                    ]}>
                                    {data.banner ? (
                                        <AutoImageHeight
                                            uri={Common.load_image(data.banner)}
                                            p_height={B_BANNER_HEIGHT}
                                            p_style={{
                                                ...Style.w_p100,
                                                ...Style.row_center,
                                                ...Style.column_center,
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            style={[
                                                Style.w_p100,
                                                Style.img_cover,
                                                {
                                                    height: B_BANNER_HEIGHT,
                                                },
                                            ]}
                                            source={require('../../common/assets/images/placeholder.png')}
                                        />
                                    )}
                                </View>
                                {type === BusinessType.training && (
                                    <View
                                        style={[
                                            Style.bg_color_green,
                                            Style.p_1,
                                            Style.row,
                                            Style.row_between,
                                        ]}>
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                Style.f_size_12,
                                                Style.f_color_15,
                                                Style.f_weight_400,
                                            ]}>
                                            {data.category &&
                                                trans[
                                                    'training.category.' +
                                                        data.category
                                                ]}
                                            {data.sub_category &&
                                                ' / ' +
                                                    trans[
                                                        'training.sub_category.' +
                                                            data.category +
                                                            '.' +
                                                            data.sub_category
                                                    ]}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={Style.f_size_12}>
                                            {data.duration != 0 &&
                                                data.begin_date &&
                                                I18n.t('training.begin_date') +
                                                    ' : ' +
                                                    Common.datetime(
                                                        data.begin_date,
                                                    )}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ) : (
                        <View style={[Style.row]}>
                            <View
                                style={[
                                    Style.row,
                                    Style.row_center,
                                    Style.column_center,
                                    Style.border_round_1,
                                    Style.overflow_hidden,
                                    {
                                        width: S_BANNER_WIDTH,
                                        height: S_BANNER_HEIGHT,
                                    },
                                ]}>
                                {data.banner ? (
                                    <AutoImageHeight
                                        uri={Common.load_image(data.banner)}
                                        p_height={S_BANNER_HEIGHT}
                                        p_style={{
                                            width: S_BANNER_WIDTH,
                                        }}
                                    />
                                ) : (
                                    <Image
                                        style={[
                                            Style.img_cover,
                                            {
                                                width: S_BANNER_WIDTH,
                                                height: S_BANNER_HEIGHT,
                                            },
                                        ]}
                                        source={require('../../common/assets/images/placeholder.png')}
                                    />
                                )}
                            </View>
                            <View
                                style={[
                                    Style.flex,
                                    Style.column,
                                    Style.row_between,
                                    Style.p_l_2,
                                ]}>
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        Style.f_fa_pf,
                                        Style.f_size_13,
                                        Style.f_color_3,
                                        Style.f_weight_600,
                                    ]}>
                                    {type === BusinessType.autotrade &&
                                    data.condition.toLowerCase() === 'new'
                                        ? trans[
                                              'autotrade.make.' +
                                                  data.make.toLowerCase()
                                          ] +
                                          (data.model ? ' - ' + data.model : '')
                                        : data.name}
                                </Text>
                                {type === BusinessType.autotrade && (
                                    <View style={[Style.column]}>
                                        <View
                                            style={[
                                                Style.row,
                                                Style.column_center,
                                                Style.m_t_1,
                                            ]}>
                                            <Text
                                                numberOfLines={1}
                                                style={[
                                                    Style.f_size_12,
                                                    Style.f_color_3,
                                                    Style.f_weight_400,
                                                ]}>
                                                {
                                                    trans[
                                                        'autotrade.engine.' +
                                                            data.engine
                                                    ]
                                                }
                                                {' - '}
                                                {
                                                    trans[
                                                        'autotrade.drivetrain.' +
                                                            data.drivetrain
                                                    ]
                                                }
                                                {' - '}
                                                {
                                                    trans[
                                                        '' +
                                                            'autotrade.fuel_type.' +
                                                            data.fuel_type
                                                    ]
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                {(type === BusinessType.estate ||
                                    type === BusinessType.rental) && (
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                        ]}>
                                        {(type === BusinessType.estate ||
                                            type === BusinessType.rental) &&
                                            data.property_type && (
                                                <Text
                                                    style={[
                                                        Style.f_size_12,
                                                        Style.f_color_3,
                                                        Style.f_weight_400,
                                                        Style.m_r_3,
                                                    ]}>
                                                    {type ===
                                                        BusinessType.estate &&
                                                        trans[
                                                            'estate.property_type.' +
                                                                data.property_type
                                                        ]}
                                                    {type ===
                                                        BusinessType.rental &&
                                                        trans[
                                                            'rental.property_type.' +
                                                                data.property_type
                                                        ]}
                                                </Text>
                                            )}
                                        <FontAwesome5
                                            name="bed"
                                            style={[
                                                Style.f_size_15,
                                                Style.f_color_5,
                                                Style.m_r_1,
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                Style.f_size_12,
                                                Style.f_color_cityseeker,
                                                Style.f_weight_400,
                                                Style.m_r_2,
                                            ]}>
                                            {data.bedrooms}
                                        </Text>
                                        <FontAwesome5
                                            name="shower"
                                            style={[
                                                Style.f_size_15,
                                                Style.f_color_5,
                                                Style.m_r_1,
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                Style.f_size_12,
                                                Style.f_color_cityseeker,
                                                Style.f_weight_400,
                                            ]}>
                                            {data.bathrooms}
                                        </Text>
                                    </View>
                                )}
                                <View style={[Style.row, Style.column_center]}>
                                    {(type === BusinessType.estate ||
                                        type === BusinessType.rental) && (
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_color_3,
                                                Style.f_weight_400,
                                                Style.bg_color_14,
                                                Style.p_h_2,
                                                Style.p_v_1,
                                                Style.border_round_1,
                                                Style.overflow_hidden,
                                            ]}>
                                            {Common.price(
                                                data.price,
                                                trans[params.currency],
                                            )}
                                        </Text>
                                    )}
                                    {type === BusinessType.autotrade &&
                                        (data.condition.toLowerCase() ===
                                            'new' ||
                                            data.condition.toLowerCase() ===
                                                'used') && (
                                            <Text
                                                style={[
                                                    Style.f_size_13,
                                                    Style.f_color_3,
                                                    Style.f_weight_400,
                                                    Style.bg_color_14,
                                                    Style.p_h_2,
                                                    Style.p_v_1,
                                                    Style.border_round_1,
                                                    Style.overflow_hidden,
                                                ]}>
                                                {Common.price(
                                                    data.total_price,
                                                    trans[params.currency],
                                                )}
                                            </Text>
                                        )}
                                    {type === BusinessType.autotrade &&
                                        data.condition.toLowerCase() ===
                                            'transfer' && (
                                            <Text
                                                style={[
                                                    Style.f_size_13,
                                                    Style.f_color_3,
                                                    Style.f_weight_400,
                                                    Style.bg_color_14,
                                                    Style.p_h_2,
                                                    Style.p_v_1,
                                                    Style.border_round_1,
                                                    Style.overflow_hidden,
                                                ]}>
                                                {Common.price(
                                                    data.payment_price,
                                                    trans[params.currency],
                                                )}
                                            </Text>
                                        )}
                                    {type === BusinessType.autotrade &&
                                        data.condition.toLowerCase() ===
                                            'transfer' && (
                                            <Text
                                                style={[
                                                    Style.f_size_11,
                                                    Style.f_color_5,
                                                    Style.f_weight_400,
                                                    Style.m_l_2,
                                                ]}>
                                                {
                                                    trans[
                                                        'autotrade.payment_frequency.' +
                                                            data.payment_frequency
                                                    ]
                                                }
                                            </Text>
                                        )}
                                    {type === BusinessType.autotrade &&
                                        data.condition.toLowerCase() !==
                                            'new' && (
                                            <View
                                                style={[
                                                    Style.row,
                                                    Style.column_center,
                                                    Style.m_l_2,
                                                ]}>
                                                <Text
                                                    style={[
                                                        Style.f_size_12,
                                                        Style.f_color_3,
                                                        Style.f_weight_400,
                                                    ]}>
                                                    {Common.year(data.year)}
                                                </Text>
                                                {data.mileage && (
                                                    <Text
                                                        style={[
                                                            Style.f_size_12,
                                                            Style.f_color_3,
                                                            Style.f_weight_400,
                                                        ]}>
                                                        {' - '}
                                                        {Common.mileage(
                                                            data.mileage,
                                                        )}{' '}
                                                        {
                                                            trans[
                                                                'app.unit.' +
                                                                    params.mileage
                                                            ]
                                                        }
                                                    </Text>
                                                )}
                                            </View>
                                        )}
                                    {type === BusinessType.rental &&
                                        (data.rent_type.toLowerCase() ===
                                            'rental' ||
                                            data.rent_type.toLowerCase() ===
                                                'transfer') &&
                                        data.date_available && (
                                            <View
                                                style={[
                                                    Style.row,
                                                    Style.column_center,
                                                    Style.m_l_2,
                                                ]}>
                                                <Text
                                                    style={[
                                                        Style.f_size_11,
                                                        Style.f_color_5,
                                                        Style.f_weight_400,
                                                    ]}>
                                                    {I18n.t('app.intro.from')}
                                                </Text>
                                                <Text
                                                    style={[
                                                        Style.f_size_11,
                                                        Style.f_color_5,
                                                        Style.f_weight_400,
                                                        Style.m_l_1,
                                                    ]}>
                                                    {Common.datetime(
                                                        data.date_available,
                                                        params['date_format'],
                                                    )}
                                                </Text>
                                            </View>
                                        )}
                                    {type === BusinessType.estate &&
                                        data.floor_size && (
                                            <View
                                                style={[
                                                    Style.row,
                                                    Style.column_center,
                                                    Style.m_l_2,
                                                ]}>
                                                <Text
                                                    style={[
                                                        Style.f_size_11,
                                                        Style.f_color_5,
                                                        Style.f_weight_400,
                                                    ]}>
                                                    {data.floor_size}
                                                </Text>
                                                <Text
                                                    style={[
                                                        Style.f_size_11,
                                                        Style.f_color_5,
                                                        Style.f_weight_400,
                                                    ]}>
                                                    {' ' +
                                                        trans[
                                                            'app.unit.' +
                                                                params.real_estate_unit
                                                        ]}
                                                </Text>
                                            </View>
                                        )}
                                </View>
                            </View>
                        </View>
                    )}
                    {data.distance != undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_between,
                                Style.m_t_2,
                            ]}>
                            <View style={[Style.p_r_2, Style.wrap]}>
                                <Text
                                    style={[Style.f_size_13, Style.f_color_6]}>
                                    {data.address}
                                </Text>
                            </View>
                            <View style={[Style.row, Style.column_center]}>
                                <MaterialCommunityIcons
                                    name="map-marker"
                                    style={[
                                        Style.f_color_cityseeker,
                                        Style.f_size_15,
                                    ]}
                                />
                                <Text
                                    style={[Style.f_size_13, Style.f_color_6]}>
                                    {Common.distance(data.distance)}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default Cell;
