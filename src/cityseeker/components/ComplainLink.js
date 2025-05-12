import React from 'react';
import {Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Navigation from '../lib/navigation';

import ActionSheet from './ActionSheet';
import Style from '../style';
import I18n from '../locale';

class Default extends React.Component {
    _actionSheetOnPress = buttonIndex => {
        const data = this.props.params || {};

        if (buttonIndex === 1) {
            Navigation.navigate('ComplainInfo', data);
        }
    };

    render() {
        return (
            <ActionSheet
                options={[
                    <Text style={[Style.f_color_3, Style.text_center]}>
                        {I18n.t('module.complain')}
                    </Text>,
                ]}
                actions={this._actionSheetOnPress}>
                <MaterialCommunityIcons
                    name="dots-horizontal"
                    style={[Style.m_r_3, Style.f_size_20, Style.f_color_cityseeker]}
                />
            </ActionSheet>
        );
    }
}

export default Default;
