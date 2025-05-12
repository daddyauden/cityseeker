import React from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Style from '../style';

class Default extends React.Component {
    _openPost = data => {
        this.props.navigation.navigate('PostItem', data);
    };

    render() {
        const {post_type} = this.props;

        return (
            <View>
                <TouchableWithoutFeedback
                    onPress={this._openPost.bind(this, {itemType: post_type})}>
                    <View
                        style={[
                            Style.bottom_right,
                            Style.m_r_2,
                            Style.m_b_2,
                            Style.w_15,
                            Style.h_15,
                            Style.border_round_15,
                            Style.bg_color_15,
                            Style.v_center,
                            Style.shadow,
                        ]}>
                        <MaterialCommunityIcons
                            name="pencil"
                            style={[Style.f_size_25, Style.f_color_cityseeker]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

export default Default;
