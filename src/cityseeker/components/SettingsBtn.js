import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {withNavigation} from 'react-navigation';
import Style from '../style';

class SettingsBtn extends Component {
    render() {
        const {navigation, system} = this.props;
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('setting', {...system})}>
                <MaterialCommunityIcons
                    style={[
                        Style.column_start,
                        Style.f_color_8,
                        Style.f_size_20,
                    ]}
                    name="settings"
                />
            </TouchableOpacity>
        );
    }
}

export default withNavigation(SettingsBtn);
