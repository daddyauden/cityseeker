import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Style from '../style';

class Default extends React.Component {
    render() {
        const {source, icon, signin, style, navigation} = this.props;

        return (
            <TouchableOpacity
                onPress={() => signin(source.toLowerCase(), navigation)}
                activeOpacity={0.3}>
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.row_center,
                        Style.border_round_3,
                        Style.overflow_hidden,
                        Style.bg_color_15,
                        style,
                    ]}>
                    {icon}
                </View>
            </TouchableOpacity>
        );
    }
}

export default Default;
