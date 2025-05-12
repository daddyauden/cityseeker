import React from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import Moment from 'moment';
import TZ from 'moment-timezone';

import {Icon} from '../../../common/lib/icon';
import {HAS_NOTCH} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    _renderTab = () => {
        const {
            tabStyle,
            showIcon,
            iconStyle,
            showLabel,
            labelStyle,
            routeName,
            navigation,
            direction,
        } = this.props;

        const tabs = [
            {
                routeName: 'Restaurant',
                route: () => navigation.navigate('Restaurant'),
                iconName: 'fork',
                labelName: I18n.t('module.restaurant'),
                iconStyle: [Style.f_size_22],
                labelStyle: [Style.f_size_11, Style.f_bold],
            },
            {
                routeName: 'Retail',
                route: () => navigation.navigate('Retail'),
                iconName: 'shopping-bag',
                labelName: I18n.t('module.retail'),
                iconStyle: [Style.f_size_22],
                labelStyle: [Style.f_size_11, Style.f_bold],
            },
            {
                routeName: 'Discovery',
                route: () => navigation.navigate('Discovery'),
                iconName: 'pawprint',
                labelName: I18n.t('module.discovery'),
                iconStyle: [Style.f_size_22],
                labelStyle: [Style.f_size_11, Style.f_bold],
            },
            {
                routeName: 'Hotel',
                route: () => navigation.navigate('Hotel'),
                iconName: 'hotel-label',
                labelName: I18n.t('module.hotel'),
                iconStyle: [Style.f_size_22],
                labelStyle: [Style.f_size_11, Style.f_bold],
            },
            {
                routeName: 'Chat',
                route: () => navigation.navigate('Chat'),
                iconName: 'chat',
                labelName: I18n.t('module.chat'),
                iconStyle: [Style.f_size_22],
                labelStyle: [Style.f_size_11, Style.f_bold],
            },
        ];

        return tabs.map(tab => {
            return (
                <TouchableWithoutFeedback onPress={tab.route}>
                    <View
                        style={[
                            direction !== undefined &&
                            direction === 'horizontal'
                                ? Style.row
                                : Style.column,
                            Style.column_center,
                            Style.row_center,
                            // Style.border_round_5,
                            // {
                            //     width: 50,
                            //     height: 50
                            // },
                            tabStyle,
                        ]}>
                        {/*{tab.routeName === 'Events' && (*/}
                        {/*    <Text*/}
                        {/*        style={[*/}
                        {/*            routeName !== undefined &&*/}
                        {/*            routeName === tab.routeName*/}
                        {/*                ? Style.f_color_cityseeker*/}
                        {/*                : Style.f_color_6,*/}
                        {/*            Style.position_absolute,*/}
                        {/*            Style.f_size_11,*/}
                        {/*            Style.f_weight_600,*/}
                        {/*            {*/}
                        {/*                top: 8,*/}
                        {/*            },*/}
                        {/*        ]}>*/}
                        {/*        {Moment(new Date())*/}
                        {/*            .tz(system.params.timezone || '')*/}
                        {/*            .format('DD')}*/}
                        {/*    </Text>*/}
                        {/*)}*/}
                        {showIcon !== undefined && showIcon === true && (
                            <Icon
                                name={tab.iconName}
                                style={[
                                    tab.iconStyle,
                                    routeName !== undefined &&
                                    routeName === tab.routeName
                                        ? Style.f_color_cityseeker
                                        : Style.f_color_6,
                                    iconStyle,
                                ]}
                            />
                        )}
                        {showLabel !== undefined && showLabel === false && (
                            <Text
                                style={[
                                    {
                                        marginTop: 3,
                                    },
                                    tab.labelStyle,
                                    routeName !== undefined &&
                                    routeName === tab.routeName
                                        ? Style.f_color_cityseeker
                                        : Style.f_color_6,
                                    labelStyle,
                                ]}>
                                {tab.labelName}
                            </Text>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            );
        });
    };

    render() {
        const {tabBarStyle} = this.props;

        return (
            <View
                style={[
                    Style.bottom_horizontal,
                    Style.z_index_1,
                    Style.row,
                    Style.row_evenly,
                    Style.column_center,
                    Style.shadow,
                    Style.theme_content,
                    Style.p_v_2,
                    HAS_NOTCH && Style.p_b_4,
                    Style.w_100,
                    // Style.w_90,
                    // HAS_NOTCH && Style.offset_5,
                    tabBarStyle,
                ]}>
                {this._renderTab()}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        system: state.system,
    };
};

export default connect(mapStateToProps)(Default);
