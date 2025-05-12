import React from 'react';
import {View, Text, TextInput, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Header} from 'react-navigation-stack';
import {SafeAreaView} from 'react-navigation';
import RocketChat from '../../../lingchat/lib/rocketchat';
import {update, email_check, send_email_code} from '../../actions/business';
import StatusBar from '../../components/StatusBar';
import {Common} from '../../utils/lib';
import Log from '../../utils/log';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <View
                        style={[
                            Style.p_l_3,
                            Style.row_center,
                            Style.column_center,
                        ]}>
                        <MaterialCommunityIcons
                            name="arrow-left"
                            style={[Style.f_size_20, Style.f_color_3]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
        };
    };

    constructor(props) {
        super(props);

        this.inteval = null;

        this.state = {
            user: null,
            lingchatUser: null,
            saving: false,
            email: '',
            showPassword: false,
            newPassword: '',
            confirmPassword: '',
            typeStatus: 'no',
            verify_code: null,
            store_verify_code: null,
            verify_code_show: false,
            verify_edit: false,
            verify_send_title:
                I18n.t('common.send') + ' ' + I18n.t('common.verify_code'),
            _sendVerifyCode: this._sendVerifyCode,
        };
    }

    componentWillUnmount() {
        this.inteval = null;
    }

    setEmail = email => {
        if (!Common.isValidEmail(email)) {
            this.setState({
                typeStatus: 'no',
                verify_code_show: false,
            });
        } else {
            this.setState({
                email,
                typeStatus: 'ing',
                verify_code_show: true,
            });
        }
    };

    setNewPassword = newPassword => {
        this.setState({newPassword}, () => {
            if (newPassword === '') {
                this.setState({confirmPassword: ''});
            }
        });
    };

    setConfirmPassword = confirmPassword => {
        this.setState({confirmPassword});
    };

    _sendVerifyCode = async () => {
        const {email} = this.state;

        const notExist = await email_check(email);

        if (parseInt(notExist.status) === 1) {
            this._postError({
                message: I18n.t('unregister_account'),
                op: () => {},
            });

            return;
        }

        if (parseInt(notExist.status) === 0 && notExist.message === '') {
            this._postError({
                message: I18n.t('error_network'),
                op: () => {},
            });

            return;
        }

        if (
            parseInt(notExist.status) === 0 &&
            notExist.message !== undefined &&
            notExist.message !== null &&
            notExist.message
        ) {
            this.setState({
                user: notExist.message,
            });
        }

        this.setState(
            {
                verify_send_title: I18n.t('common.send') + '...',
                verify_code: null,
                store_verify_code: null,
                verify_edit: false,
                newPassword: '',
                confirmPassword: '',
            },
            () => {
                send_email_code(email)
                    .then(response => {
                        const {status} = response;

                        if (status === 1) {
                            this.setState({
                                verify_edit: true,
                                store_verify_code: response.verify_code,
                                _sendVerifyCode: () => {},
                            });

                            let times = 30;
                            this.inteval = setInterval(() => {
                                times--;
                                this.setState({
                                    verify_send_title:
                                        I18n.t('common.resend') +
                                        ' ' +
                                        times +
                                        ' s',
                                });

                                if (times == 0) {
                                    clearInterval(this.inteval);
                                    this.setState({
                                        _sendVerifyCode: this._sendVerifyCode,
                                        verify_send_title: I18n.t(
                                            'common.resend',
                                        ),
                                    });
                                }
                            }, 500);
                        }
                    })
                    .catch(e => {
                        Log(e);
                    });
            },
        );
    };

    submit = () => {
        const {navigation} = this.props;

        const {newPassword, user} = this.state;

        if (newPassword === '') {
            this._postError({
                message: I18n.t('New_Password_empty'),
                op: () => {},
            });

            return;
        }

        if (user.username === undefined || user.email === undefined) {
            this._postError({
                message: I18n.t('error_network'),
                op: () => {},
            });

            return;
        }

        this.setState({saving: true}, async () => {
            // async reset password for lingchat
            const {success} = await RocketChat.resetPassword({
                email: user.email,
                username: user.username,
                newPassword: newPassword,
            });

            if (success) {
                const {status} = await update({
                    id: user.id, // for backend
                    uid: user.uid, // for sso
                    password: newPassword,
                });

                if (status === 1) {
                    Common.showToast({
                        message: (
                            <MaterialCommunityIcons
                                name="check"
                                style={[Style.f_size_30, Style.f_color_15]}
                            />
                        ),
                        style: {
                            ...Style.bg_color_green,
                        },
                        op: {
                            onHidden: () => navigation.goBack(),
                        },
                    });
                } else {
                    this._postError({
                        message: I18n.t('error_network'),
                        op: () => {},
                    });
                }
            } else {
                this._postError({
                    message: I18n.t('error_network'),
                    op: () => {},
                });
            }
        });
    };

    _postError = error => {
        const {navigation} = this.props;

        Common.showToast({
            message:
                error && error.message ? (
                    error.message
                ) : (
                    <MaterialCommunityIcons
                        name="close"
                        style={[Style.f_size_30, Style.f_color_15]}
                    />
                ),
            style: {
                ...Style.bg_color_cityseeker,
                ...Style.p_3,
            },
            op: {
                onHidden: () => (error.op ? error.op : navigation.goBack()),
            },
            config: {
                duration: 2000,
                position: Common.isIphoneX()
                    ? Header.HEIGHT + 25
                    : Header.HEIGHT,
            },
        });
    };

    render() {
        const {
            saving,
            showPassword,
            newPassword,
            confirmPassword,
            verify_edit,
            verify_code_show,
            _sendVerifyCode,
            verify_send_title,
            verify_code,
            store_verify_code,
        } = this.state;

        const isVerified =
            verify_code !== null && verify_code === store_verify_code;

        const confirmIsRight =
            newPassword !== '' && newPassword === confirmPassword;

        return (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{vertical: 'never'}}>
                <StatusBar light />
                <View style={[Style.m_t_3, Style.p_h_3]}>
                    <Text
                        style={[
                            Style.f_size_15,
                            Style.f_color_5,
                            Style.f_weight_500,
                            Style.l_h_5,
                        ]}>
                        {I18n.t('Set_forget_password_subtitle')}
                    </Text>
                    <View
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.row_between,
                            Style.m_t_2,
                        ]}>
                        <TextInput
                            placeholder={I18n.t('user.email')}
                            placeholderTextColor={Style.f_color_9.color}
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect={false}
                            autoFocus={false}
                            spellCheck={false}
                            editable={true}
                            keyboardType="email-address"
                            returnKeyType="default"
                            onChangeText={value => this.setEmail(value)}
                            style={[
                                Style.flex,
                                Style.p_v_1,
                                Style.f_size_15,
                                Style.f_color_2,
                                Style.f_weight_400,
                                Style.f_fa_pf,
                            ]}
                        />
                        {verify_code_show == true && (
                            <TouchableWithoutFeedback onPress={_sendVerifyCode}>
                                <View
                                    style={[
                                        Style.column_end,
                                        Style.row_center,
                                        Style.p_v_1,
                                        Style.p_h_2,
                                        Style.bg_color_14,
                                        Style.border_round_1,
                                    ]}>
                                    <Text
                                        style={[
                                            Style.f_size_15,
                                            Style.f_color_5,
                                            Style.f_regular,
                                        ]}>
                                        {verify_send_title}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    </View>
                    {verify_edit && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_t_3,
                            ]}>
                            <TextInput
                                autoCapitalize="none"
                                keyboardType="number-pad"
                                placeholder={I18n.t('common.verify_code')}
                                placeholderTextColor={Style.f_color_9.color}
                                onChangeText={code => {
                                    this.setState({
                                        verify_code: code,
                                    });
                                }}
                                value={verify_code}
                                style={[
                                    Style.flex,
                                    Style.p_v_1,
                                    Style.f_size_15,
                                    Style.f_color_2,
                                    Style.f_weight_400,
                                    Style.f_fa_pf,
                                ]}
                            />
                            {verify_code !== null &&
                                verify_code === store_verify_code && (
                                    <MaterialCommunityIcons
                                        name={'check-circle-outline'}
                                        style={[
                                            Style.f_size_25,
                                            Style.f_color_green,
                                            Style.m_l_2,
                                        ]}
                                    />
                                )}
                        </View>
                    )}
                    {isVerified && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_between,
                                Style.m_t_3,
                                Style.p_h_2,
                                Style.bg_color_gray,
                                Style.border_round_1,
                            ]}>
                            <TextInput
                                placeholder={I18n.t('New_Password')}
                                secureTextEntry={!showPassword}
                                selectionColor={Style.f_color_3.color}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect={false}
                                autoFocus={false}
                                spellCheck={false}
                                editable={true}
                                returnKeyType="default"
                                value={newPassword}
                                onChangeText={value =>
                                    this.setNewPassword(value)
                                }
                                style={[
                                    Style.flex,
                                    Style.p_v_2,
                                    Style.f_size_15,
                                    Style.f_color_2,
                                    Style.f_weight_400,
                                    Style.f_fa_pf,
                                ]}
                            />
                            {newPassword !== '' && (
                                <MaterialCommunityIcons
                                    onPress={() =>
                                        this.setState({
                                            showPassword: !showPassword,
                                        })
                                    }
                                    name={
                                        !showPassword
                                            ? 'eye-outline'
                                            : 'eye-off-outline'
                                    }
                                    style={[Style.f_size_20, Style.f_color_6]}
                                />
                            )}
                        </View>
                    )}
                    {isVerified && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_between,
                                Style.m_t_3,
                                Style.p_h_2,
                                Style.bg_color_gray,
                                Style.border_round_1,
                            ]}>
                            <TextInput
                                placeholder={I18n.t('Confirm_Password')}
                                secureTextEntry={!showPassword}
                                selectionColor={Style.f_color_3.color}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect={false}
                                autoFocus={false}
                                spellCheck={false}
                                editable={true}
                                returnKeyType="default"
                                value={confirmPassword}
                                onChangeText={value =>
                                    this.setConfirmPassword(value)
                                }
                                style={[
                                    Style.flex,
                                    Style.p_v_2,
                                    Style.f_size_13,
                                    Style.f_color_5,
                                    Style.f_regular,
                                ]}
                            />
                            {newPassword !== '' &&
                                newPassword === confirmPassword && (
                                    <MaterialCommunityIcons
                                        name={'check-circle-outline'}
                                        style={[
                                            Style.f_size_25,
                                            Style.f_color_green,
                                        ]}
                                    />
                                )}
                        </View>
                    )}
                    <TouchableWithoutFeedback
                        onPress={confirmIsRight ? this.submit : () => {}}>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_between,
                                Style.m_t_3,
                            ]}>
                            <View
                                style={[
                                    Style.p_v_2,
                                    Style.p_h_4,
                                    Style.border_round_1,
                                    Style.bg_color_14,
                                ]}>
                                <Text
                                    style={[
                                        confirmIsRight
                                            ? Style.f_color_3
                                            : Style.f_color_9,
                                        Style.f_size_15,
                                        Style.f_weight_500,
                                        Style.f_fa_pf,
                                    ]}>
                                    {saving === true
                                        ? I18n.t('common.save') + ' ...'
                                        : I18n.t('common.save')}
                                </Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </SafeAreaView>
        );
    }
}

export default Default;
