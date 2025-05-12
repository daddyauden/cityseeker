import React, {Component} from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';

import {Icon} from '../../common/lib/icon';
import Style from '../style';

class Default extends Component {
    render() {
        const {navigation, style} = this.props;

        return (
            <TouchableWithoutFeedback
                onPress={() => navigation.navigate('Search', {...this.props})}>
                <View style={[Style.h_center, style]}>
                    <Icon
                        name="magnifier"
                        style={[Style.f_size_20, Style.f_color_9]}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default Default;
