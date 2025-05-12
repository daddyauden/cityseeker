import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-navigation';

import {changeAreaRequest} from '../actions/system';

import I18n from '../locale';
import Modal from './Modal';
import Style from '../style';

class Default extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
        };
    }

    _showModal = () => {
        this.setState({
            visible: true,
        });
    };

    _hideModal = () => {
        this.setState({
            visible: false,
        });
    };

    _changeCity = (countryCode, cityCode) => {
        const {city} = this.props.system.area;

        if (cityCode.toLowerCase() !== city.toLowerCase()) {
            this.props.dispatch(
                changeAreaRequest({
                    country: countryCode.toLowerCase(),
                    city: cityCode.toLowerCase(),
                }),
            );
        } else {
            this._hideModal();
        }
    };

    _renderArea = () => {
        const {area} = this.props.system;

        const countryArr = Object.keys(area.list);

        const render =
            countryArr.length > 0 &&
            countryArr.map((countryCode, key) => {
                let cityList = area.list[countryCode];

                const cityArr = Object.keys(cityList).map((cityCode, key) => {
                    return (
                        <TouchableOpacity
                            key={key}
                            onPress={this._changeCity.bind(
                                this,
                                countryCode,
                                cityCode,
                            )}>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.p_v_3,
                                    Style.p_h_6,
                                    Style.b_t,
                                    Style.bg_color_15,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_color_5,
                                        Style.f_size_13,
                                        Style.f_weight_500,
                                        Style.f_fa_pf,
                                    ]}>
                                    {I18n.t(cityCode.toLowerCase())}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                });

                return (
                    <View key={key} style={[Style.column, Style.row_center]}>
                        <TouchableWithoutFeedback>
                            <View
                                style={[
                                    Style.row,
                                    Style.bg_color_14,
                                    Style.p_v_3,
                                    Style.p_h_3,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_color_3,
                                        Style.f_size_15,
                                        Style.f_weight_600,
                                        Style.f_fa_pf,
                                    ]}>
                                    {I18n.t(countryCode.toUpperCase())}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={[Style.column, Style.row_center]}>
                            {cityArr}
                        </View>
                    </View>
                );
            });

        return render;
    };

    render() {
        const {visible} = this.state;

        const {city} = this.props.system.area;

        return (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{vertical: 'never'}}>
                <TouchableWithoutFeedback onPress={this._showModal.bind(this)}>
                    <View
                        style={[
                            this.props.style,
                            Style.row,
                            Style.column_center,
                        ]}>
                        <MaterialCommunityIcons
                            style={[Style.f_color_google, Style.f_size_20]}
                            name="map-marker"
                        />
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_2,
                                Style.m_l_1,
                            ]}>
                            {I18n.t(city)}
                        </Text>
                        <MaterialCommunityIcons
                            style={[Style.f_color_3, Style.f_size_20]}
                            name={visible === false ? 'menu-down' : 'menu-up'}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <Modal
                    style={{
                        container: {
                            ...Style.flex,
                            ...Style.h_fill,
                        },
                        content: {
                            ...Style.shadow_all,
                            ...Style.border_round_bottom_2,
                            ...Style.bg_color_15,
                            ...Style.p_b_2,
                        },
                    }}
                    transparent={false}
                    animationType="fade"
                    visible={visible}
                    onDismiss={this._hideModal}
                    renderContent={() => {
                        return (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {this._renderArea()}
                            </ScrollView>
                        );
                    }}
                />
            </SafeAreaView>
        );
    }
}

export default Default;
