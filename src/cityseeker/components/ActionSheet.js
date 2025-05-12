import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';

import Style from '../style';
import I18n from '../locale';

class Default extends React.Component {
    render() {
        const {openActionSheet, options, actions} = this.props;

        return (
            <TouchableOpacity
                onPress={() =>
                    openActionSheet !== undefined
                        ? openActionSheet()
                        : this.ActionSheet.show()
                }>
                {this.props.children}
                <ActionSheet
                    ref={actionsheet => {
                        this.ActionSheet = actionsheet;
                    }}
                    options={[
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_3,
                                Style.f_fa_pf,
                                Style.f_weight_400,
                            ]}>
                            {I18n.t('common.cancel')}
                        </Text>,
                        ...options,
                    ]}
                    cancelButtonIndex={0}
                    onPress={actions}
                    styles={{
                        titleText: {
                            fontSize: Style.f_size_13.fontSize,
                            color: Style.f_color_3.color,
                        },
                        titleBox: {
                            height: 50,
                            backgroundColor: Style.theme_footer.backgroundColor,
                        },
                        messageText: {
                            fontSize: Style.f_size_13.fontSize,
                            color: Style.f_color_3.color,
                        },
                        messageBox: {
                            height: 50,
                            backgroundColor: Style.theme_footer.backgroundColor,
                        },
                        buttonText: {
                            fontSize: Style.f_size_13.fontSize,
                            color: Style.f_color_3.color,
                        },
                        buttonBox: {
                            height: 50,
                            backgroundColor: Style.theme_footer.backgroundColor,
                        },
                        cancelButtonBox: {
                            height: 50,
                            backgroundColor: Style.theme_footer.backgroundColor,
                        },
                    }}
                />
            </TouchableOpacity>
        );
    }
}

export default Default;
