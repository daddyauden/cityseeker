import React from 'react';
import {Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import EventsConfig from '../config/events';
import {Common} from '../utils/lib';
import I18n from '../locale';
import Style from '../style';

class Events extends React.Component {
    _goEventsInfo = id => {
        this.props.navigation.navigate('EventsInfo', {id: id});
    };

    render() {
        const {data} = this.props;

        return (
            <TouchableWithoutFeedback
                onPress={() => this._goEventsInfo(data.id)}>
                <View
                    style={[
                        Style.row,
                        Style.p_h_3,
                        Style.m_b_4,
                        {
                            height: EventsConfig.topRatedBannerHeight,
                        },
                    ]}>
                    <Image
                        source={{
                            uri: Common.load_image(data.banner),
                        }}
                        style={[
                            Style.border_round_1,
                            Style.overflow_hidden,
                            Style.h_p100,
                            {
                                width: EventsConfig.topRatedBannerWidth,
                            },
                        ]}
                    />
                    <View
                        style={[
                            Style.flex,
                            Style.wrap,
                            Style.column,
                            Style.column_start,
                            Style.row_between,
                            Style.m_l_3,
                        ]}>
                        <View style={[Style.column, Style.row_center]}>
                            <Text
                                numberOfLines={2}
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_weight_600,
                                    Style.f_fa_pf,
                                ]}>
                                {I18n.t('events.category.' + data.category)}
                            </Text>
                            <Text
                                numberOfLines={4}
                                style={[
                                    Style.f_size_15,
                                    Style.f_color_1,
                                    Style.f_weight_600,
                                    Style.f_fa_pf,
                                    Style.m_t_2,
                                ]}>
                                {data.title}
                            </Text>
                        </View>
                        <View
                            style={[
                                Style.column,
                                Style.row_center,
                                Style.column_start,
                            ]}>
                            <View style={[Style.row, Style.column_center]}>
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_1,
                                        Style.f_weight_600,
                                        Style.f_fa_pf,
                                    ]}>
                                    {Common.customNumber(data.going)}
                                </Text>
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_3,
                                        Style.f_weight_500,
                                        Style.f_fa_pf,
                                        Style.m_l_1,
                                    ]}>
                                    {I18n.t('events.going')}
                                </Text>
                            </View>
                            <View style={[Style.row, Style.column_center]}>
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_1,
                                        Style.f_weight_600,
                                        Style.f_fa_pf,
                                    ]}>
                                    {Common.customNumber(data.likes)}
                                </Text>
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_3,
                                        Style.f_weight_500,
                                        Style.f_fa_pf,
                                        Style.m_l_1,
                                    ]}>
                                    {I18n.t('events.likes')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default Events;
