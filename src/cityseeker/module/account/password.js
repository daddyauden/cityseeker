import React from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';
import StatusBar from '../../components/StatusBar';
import {user_exist} from '../../actions/business';
import {update} from '../../actions/account';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('Password'),
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <View style={[Style.p_l_3, Style.h_center]}>
                        <MaterialCommunityIcons
                            name="arrow-left"
                            style={[Style.f_size_22, Style.f_color_4]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
            headerTransparent: false,
            headerStyle: {
                elevation: 0,
                backgroundColor: Style.theme_content.backgroundColor,
            },
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            saving: false,
            showPassword: false,
            currentPassword: '',
            password: '',
            confirmPassword: '',
        };
    }

    setCurrentPassword = currentPassword => {
        this.setState({currentPassword});
    };

    setPassword = password => {
        this.setState({password}, () => {
            if (password === '') {
                this.setState({confirmPassword: ''});
            }
        });
    };

    setConfirmPassword = confirmPassword => {
        this.setState({confirmPassword});
    };

    submit = () => {
        const {navigation, account} = this.props;

        const {currentPassword, password} = this.state;

        if (currentPassword === '') {
            this._postError({
                message: I18n.t(
                    'For_your_security_you_must_enter_your_current_password_to_continue',
                ),
            });

            return;
        }

        if (password === '') {
            this._postError({
                message: I18n.t('New_Password_empty'),
            });

            return;
        }

        if (password === currentPassword) {
            this._postError({
                message: I18n.t('New_Password_same'),
                op: () => {},
            });

            return;
        }

        this.setState({saving: true}, async () => {
            const {status} = await user_exist({
                email: account.email,
                username: account.username,
                password: currentPassword,
            });

            if (status) {
                this.props.dispatch(
                    update(
                        {
                            id: account.id,
                            password,
                            currentPassword,
                        },
                        'UPDATE_PASSWORD',
                        navigation,
                    ),
                );
            } else {
                this._postError({
                    message: I18n.t('error-invalid-password'),
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
        });
    };

    render() {
        const {
            saving,
            showPassword,
            currentPassword,
            password,
            confirmPassword,
        } = this.state;

        const confirmIsRight =
            currentPassword !== '' &&
            password !== '' &&
            password === confirmPassword;

        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'always'}
                keyboardDismissMode={'interactive'}
                alwaysBounceVertical={false}
                behavior="position"
                contentContainerStyle={[Style.bg_color_15, Style.flex]}>
                <StatusBar light />
                <ScrollView
                    keyboardShouldPersistTaps={'always'}
                    keyboardDismissMode={'interactive'}
                    contentContainerStyle={[Style.p_3]}>
                    <SafeAreaView
                        style={[Style.bg_color_15, Style.flex]}
                        forceInset={{vertical: 'never'}}>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_between,
                                Style.m_t_1,
                                Style.p_h_2,
                                Style.bg_color_gray,
                                Style.border_round_2,
                            ]}>
                            <TextInput
                                placeholder={I18n.t('common.current')}
                                secureTextEntry={!showPassword}
                                selectionColor={Style.f_color_3.color}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect={false}
                                autoFocus={false}
                                spellCheck={false}
                                editable={true}
                                returnKeyType="default"
                                value={currentPassword}
                                onChangeText={value =>
                                    this.setCurrentPassword(value)
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
                            {currentPassword !== '' && (
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
                                    style={[Style.f_size_25, Style.f_color_6]}
                                />
                            )}
                        </View>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_between,
                                Style.m_t_3,
                                Style.p_h_2,
                                Style.bg_color_gray,
                                Style.border_round_2,
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
                                editable={currentPassword !== ''}
                                returnKeyType="default"
                                value={password}
                                onChangeText={value => this.setPassword(value)}
                                style={[
                                    Style.flex,
                                    Style.p_v_2,
                                    Style.f_size_15,
                                    Style.f_color_2,
                                    Style.f_regular,
                                ]}
                            />
                        </View>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_between,
                                Style.m_t_3,
                                Style.p_h_2,
                                Style.bg_color_gray,
                                Style.border_round_2,
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
                                editable={password !== ''}
                                returnKeyType="default"
                                value={confirmPassword}
                                onChangeText={value =>
                                    this.setConfirmPassword(value)
                                }
                                style={[
                                    Style.flex,
                                    Style.p_v_2,
                                    Style.f_size_15,
                                    Style.f_color_2,
                                    Style.f_regular,
                                ]}
                            />
                            {password !== '' &&
                                password === confirmPassword && (
                                    <MaterialCommunityIcons
                                        name={'check-circle-outline'}
                                        style={[
                                            Style.f_size_25,
                                            Style.f_color_green,
                                        ]}
                                    />
                                )}
                        </View>
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
                                        Style.border_round_2,
                                        Style.bg_color_14,
                                    ]}>
                                    <Text
                                        style={[
                                            confirmIsRight
                                                ? Style.f_color_3
                                                : Style.f_color_9,
                                            Style.f_size_15,
                                            Style.f_bold,
                                        ]}>
                                        {saving === true
                                            ? I18n.t('common.save') + ' ...'
                                            : I18n.t('common.save')}
                                    </Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
                </ScrollView>
            </KeyboardAwareScrollView>
        );
    }
}

const mapStateToProps = state => {
    return {
        account: state.account,
    };
};

export default connect(mapStateToProps)(Default);
