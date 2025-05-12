import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {SafeAreaView} from 'react-navigation';
import {filter} from 'lodash';
import {nearbyBusiness} from '../actions/business';
import {changeLocation} from '../actions/system';
import BusinessConfig from '../config/business';
import Avator from '../components/Avator';
import {Common} from '../utils/lib';
import Modal from './Modal';
import Style from '../style';
import I18n from '../locale';

class NearbyBusinessModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: true,
        };
    }

    componentDidMount() {
        this._getCurrentLocationBusiness();
    }

    _getCurrentLocationBusiness = async () => {
        const {coords} = await Common.getCurrentPosition();

        const {system, setDefaultBusiness} = this.props;

        const {city} = system.area;

        let request = {
            select: [
                'id',
                'uid',
                'name',
                'type',
                'address',
                'condition',
                'avator',
            ],
            where: ['condition = 1', 'status = 1', "city = '" + city + "'"],
            lat: system.lat,
            lng: system.lng,
            size: BusinessConfig.nearbyLimit,
        };

        if (coords !== undefined) {
            request.lat = coords.latitude;
            request.lng = coords.longitude;

            this.props.dispatch &&
                this.props.dispatch(
                    changeLocation({
                        lat: coords.latitude,
                        lng: coords.longitude,
                    }),
                );
        }

        if (request.lat) {
            request['order'] = ['distance asc'];
        } else {
            request['order'] = ['views asc'];
        }

        nearbyBusiness(request).then(response => {
            const {status, message} = response;

            if (parseInt(status) === 1) {
                const {list} = message;

                this.setState(
                    {
                        data: list,
                        loading: false,
                    },
                    () => {
                        setDefaultBusiness(
                            list.length === 0 ? null : list[0],
                            true,
                        );
                    },
                );
            } else {
                this.setState(
                    {
                        loading: false,
                    },
                    () => {
                        setDefaultBusiness(null, true);
                    },
                );
            }
        });
    };

    _listBusiness = businesses => {
        const {defaultBusiness, setDefaultBusiness} = this.props;

        return (
            businesses.length > 0 &&
            businesses.map((business, key) => {
                return (
                    <TouchableWithoutFeedback
                        key={key}
                        onPress={() => {
                            setDefaultBusiness(business, true);
                        }}>
                        <View style={[Style.column, Style.b_b, Style.p_2]}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.row_between,
                                ]}>
                                <Avator user={business} size={45} />
                                <View
                                    style={[
                                        Style.flex,
                                        Style.column,
                                        Style.m_l_2,
                                        Style.wrap,
                                    ]}>
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                        ]}>
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                Style.f_color_2,
                                                Style.f_size_15,
                                                Style.f_weight_500,
                                                Style.f_fa_pf,
                                            ]}>
                                            {business.name}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                Style.f_color_4,
                                                Style.f_size_13,
                                                Style.f_weight_400,
                                                Style.f_fa_pf,
                                                Style.p_l_2,
                                            ]}>
                                            {I18n.t('type.' + business.type)}
                                        </Text>
                                    </View>
                                    {business.address && (
                                        <View
                                            style={[
                                                Style.flex,
                                                Style.row,
                                                Style.column_center,
                                                Style.m_t_1,
                                            ]}>
                                            <Text
                                                numberOfLines={1}
                                                style={[
                                                    Style.f_color_6,
                                                    Style.f_size_11,
                                                    Style.f_weight_400,
                                                    Style.p_r_2,
                                                ]}>
                                                {business.address}
                                            </Text>
                                            {business.distance && (
                                                <Text
                                                    numberOfLines={1}
                                                    style={[
                                                        Style.f_color_6,
                                                        Style.f_size_11,
                                                        Style.f_weight_400,
                                                    ]}>
                                                    {Common.distance(
                                                        business.distance,
                                                    )}
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                </View>
                                {defaultBusiness !== undefined &&
                                    defaultBusiness !== null &&
                                    defaultBusiness.id === business.id && (
                                        <View
                                            style={[
                                                Style.row,
                                                Style.column_center,
                                            ]}>
                                            <MaterialCommunityIcons
                                                name="check-circle"
                                                style={[
                                                    Style.f_color_check,
                                                    Style.f_size_25,
                                                ]}
                                            />
                                        </View>
                                    )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
            })
        );
    };

    render() {
        const {loading, data} = this.state;

        const {
            defaultBusiness,
            setDefaultBusiness,
            showNearbyBusinessModal,
            visible,
            onDismiss,
        } = this.props;

        return loading === true ? (
            <View
                style={[
                    Style.row,
                    Style.row_center,
                    Style.column_center,
                    Style.theme_header,
                ]}>
                <Icon
                    name="map-marker-alt"
                    style={[
                        Style.f_color_facebook,
                        Style.f_size_19,
                        Style.m_r_1,
                    ]}
                />
                <ActivityIndicator
                    color={Style.f_color_cityseeker.color}
                    size="small"
                />
            </View>
        ) : (
            <SafeAreaView
                style={[Style.theme_content]}
                forceInset={{vertical: 'never'}}>
                <View
                    style={[
                        Style.row,
                        Style.row_center,
                        Style.column_center,
                        Style.theme_header,
                    ]}>
                    <Icon
                        onPress={() => showNearbyBusinessModal()}
                        name="map-marker-alt"
                        style={[Style.f_color_facebook, Style.f_size_19]}
                    />
                </View>
                <Modal
                    style={{
                        container: {
                            ...Style.w_100,
                            ...Style.bg_color_15,
                        },
                        header: {
                            ...Style.row,
                            ...Style.column_end,
                            ...Style.p_h_2,
                            ...Style.theme_header,
                            height: '10%',
                        },
                        content: {
                            height: '90%',
                        },
                    }}
                    animationType="slide"
                    visible={visible}
                    renderContent={() => {
                        let businesses;
                        if (defaultBusiness !== null && data.length > 0) {
                            businesses = filter(data, function(business) {
                                return business.id !== defaultBusiness.id;
                            });
                        } else {
                            businesses = data;
                        }

                        return (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {defaultBusiness !== null &&
                                    this._listBusiness([defaultBusiness])}
                                {this._listBusiness(businesses)}
                            </ScrollView>
                        );
                    }}
                    renderHeader={() => {
                        return (
                            <View
                                style={[
                                    Style.flex,
                                    Style.row,
                                    Style.row_between,
                                    Style.column_center,
                                    Style.p_2,
                                ]}>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        setDefaultBusiness(null, true);
                                    }}>
                                    <Text
                                        style={[
                                            Style.f_size_15,
                                            Style.f_color_3,
                                        ]}>
                                        {I18n.t('common.remove')}
                                    </Text>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={onDismiss}>
                                    <Text
                                        style={[
                                            Style.f_size_15,
                                            Style.f_color_3,
                                        ]}>
                                        {I18n.t('common.confirm')}
                                    </Text>
                                </TouchableWithoutFeedback>
                            </View>
                        );
                    }}
                />
            </SafeAreaView>
        );
    }
}

export default NearbyBusinessModal;
