import React from 'react';
import {Platform, TouchableOpacity, Text} from 'react-native';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import Linking from './Linking';
import Style from '../style';
import I18n from '../locale';

class Default extends React.Component {
    static defaultProps = {
        address: '',
    };

    render() {
        return (
            <TouchableOpacity onPress={this._openActionSheet}>
                {this.props.children}
                <ActionSheet
                    ref={actionsheet => {
                        this.ActionSheet = actionsheet;
                    }}
                    options={[
                        <Text style={[Style.f_color_0, Style.text_center]}>
                            {I18n.t('common.cancel')}
                        </Text>,
                        <Text style={[Style.f_color_3, Style.text_center]}>
                            {I18n.t('open_apple_map')}
                        </Text>,
                        <Text style={[Style.f_color_3, Style.text_center]}>
                            {I18n.t('open_google_map')}
                        </Text>,
                    ]}
                    cancelButtonIndex={0}
                    onPress={this._actionSheetOnPress.bind(this)}
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
                            height: 40,
                            backgroundColor: Style.theme_footer.backgroundColor,
                        },
                        buttonText: {
                            fontSize: Style.f_size_13.fontSize,
                            color: Style.f_color_3.color,
                        },
                        buttonBox: {
                            height: 60,
                            backgroundColor: Style.theme_footer.backgroundColor,
                        },
                        cancelButtonBox: {
                            height: 60,
                            backgroundColor: Style.theme_footer.backgroundColor,
                        },
                    }}
                />
            </TouchableOpacity>
        );
    }

    _openActionSheet = () => {
        const address = encodeURIComponent(this.props.address);

        if (Platform.OS === 'ios') {
            this.ActionSheet.show();
        } else if (Platform.OS === 'android') {
            const nativeGoogleUrl =
                'comgooglemaps-x-callback://?q=' +
                address +
                '&x-success=cityseeker://&x-source=cityseeker';

            Linking.canOpenURL(nativeGoogleUrl).then(supported => {
                const url = supported
                    ? nativeGoogleUrl
                    : 'https://maps.google.com/?q=' + address;
                Linking.openURL(url);
            });
        } else {
            Linking.openURL('https://maps.google.com/maps?&q=' + address);
        }
    };

    _actionSheetOnPress = buttonIndex => {
        const address = encodeURIComponent(this.props.address);

        if (buttonIndex === 1) {
            Linking.openURL('https://maps.apple.com/?q=' + address);
        }

        if (buttonIndex === 2) {
            const nativeGoogleUrl =
                'comgooglemaps-x-callback://?q=' +
                address +
                '&x-success=cityseeker://&x-source=cityseeker';

            const res = Linking.canOpenURL(nativeGoogleUrl);

            if (res !== false) {
                res.then(() => {
                    Linking.openURL(nativeGoogleUrl);
                }).catch(() => {
                    Linking.openURL('https://maps.google.com/?q=' + address);
                });
            }
        }
    };
}

export default Default;
