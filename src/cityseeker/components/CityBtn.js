import React from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import I18n from '../locale';
import Style from '../style';

class Default extends React.Component {
    render() {
        const {city, navigation} = this.props;

        return (
            <TouchableWithoutFeedback onPress={() => navigation.toggleDrawer()}>
                <View style={[Style.h_center]}>
                    <MaterialCommunityIcons
                        style={[Style.f_color_google, Style.f_size_20]}
                        name="map-marker"
                    />
                    <Text
                        style={[Style.f_size_13, Style.f_color_2, Style.m_l_1]}>
                        {I18n.t(city)}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default Default;
