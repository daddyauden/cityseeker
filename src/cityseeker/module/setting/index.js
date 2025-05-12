import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Navigation from '../../lib/navigation';
import {HAS_NOTCH} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

class Default extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('common.setting'),
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.dismiss();
                        navigation.toggleDrawer();
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

    render() {
        const {locale, area} = this.props.system;

        const {city} = area;

        return (
            <View style={[Style.row, Style.p_h_2, HAS_NOTCH && Style.p_b_4]}>
                <TouchableWithoutFeedback
                    onPress={() => Navigation.navigate('LocaleSetting')}>
                    <View
                        style={[
                            Style.flex,
                            Style.v_center,
                            Style.m_r_1,
                            Style.bg_color_gray,
                            Style.p_1,
                        ]}>
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_5,
                                Style.f_bold,
                            ]}>
                            {I18n.t('common.language')}
                        </Text>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_t_1,
                            ]}>
                            <MaterialCommunityIcons
                                style={[Style.f_color_cityseeker, Style.f_size_20]}
                                name="translate"
                            />
                            <Text style={[Style.f_size_12, Style.f_color_2]}>
                                {I18n.t(locale)}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => Navigation.navigate('CitySetting')}>
                    <View
                        style={[
                            Style.flex,
                            Style.v_center,
                            Style.m_l_1,
                            Style.bg_color_gray,
                            Style.p_1,
                        ]}>
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_5,
                                Style.f_bold,
                            ]}>
                            {I18n.t('common.city')}
                        </Text>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_t_1,
                            ]}>
                            <MaterialCommunityIcons
                                style={[Style.f_color_cityseeker, Style.f_size_20]}
                                name="map-marker"
                            />
                            <Text style={[Style.f_size_12, Style.f_color_2]}>
                                {I18n.t(city)}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        system: state.system,
    };
}

export default connect(mapStateToProps)(Default);
