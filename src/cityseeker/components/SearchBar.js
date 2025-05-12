import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import I18n from '../locale';
import Style from '../style';

class Default extends Component {
    render() {
        const {navigation, searchText, style} = this.props;

        return (
            <TouchableWithoutFeedback
                onPress={() => navigation.navigate('Search', {...this.props})}>
                <View
                    style={[
                        Style.shadow,
                        Style.p_h_3,
                        Style.p_v_2,
                        Style.row,
                        Style.column_center,
                        Style.border_round_1,
                        Style.m_b_2,
                        Style.bg_color_15,
                        style,
                    ]}>
                    {this.props.children}
                    <Icon
                        name="ios-search"
                        style={[Style.f_size_20, Style.f_color_9]}
                    />
                    <Text
                        style={[
                            Style.f_color_9,
                            Style.f_size_15,
                            Style.f_bold,
                            Style.m_l_2,
                        ]}>
                        {searchText || I18n.t('common.search')}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default Default;
