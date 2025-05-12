import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback, TextInput} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {send_email_code} from '../../actions/business';
import {signup as signupAction} from '../../actions/account';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

class Default extends Component {
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
                            style={[Style.f_size_22, Style.f_color_4]}
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
            showPassword: false,
            name: '',
            email: '',
            password: '',
            password_show: false,
            verify_code: null,
            store_verify_code: null,
            verify_edit: false,
            verify_send_title: I18n.t('common.send_verify_code'),
            _sendVerifyCode: this._sendVerifyCode,
        };
    }

    componentWillUnmount() {
        this.inteval = null;
    }

    _sendVerifyCode = () => {
        const {email} = this.state;

        this.setState(
            {
                verify_send_title: I18n.t('common.sending'),
            },
            () => {
                send_email_code(email).then(response => {
                    const {status} = response;

                    if (status) {
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
                                    verify_send_title: I18n.t('common.resend'),
                                });
                            }
                        }, 1000);
                    }
                });
            },
        );
    };

    _onSubmit = _ => {
        const {
            name,
            email,
            password,
            verify_code,
            store_verify_code,
        } = this.state;

        const {system, navigation, signup} = this.props;

        const {area, lat, lng} = system;

        const {country, city} = area;

        if (!email || !verify_code || !password || !name) {
            Common.showToast({
                message: (
                    <Text style={[Style.f_size_13, Style.f_bold]}>
                        {I18n.t('common.input.empty')}
                    </Text>
                ),
                style: {
                    ...Style.bg_color_cityseeker,
                },
            });
        } else if (verify_code !== store_verify_code) {
            Common.showToast({
                message: (
                    <Text style={[Style.f_size_13, Style.f_bold]}>
                        {I18n.t('common.verify_code_error')}
                    </Text>
                ),
                style: {
                    ...Style.bg_color_cityseeker,
                },
            });
        } else {
            signup(
                {
                    name: name,
                    email: email,
                    username: Common.c2c(email),
                    password: password,
                    status: 1,
                    condition: 0,
                    source: 'cityseeker',
                    country: country.toLowerCase(),
                    city: city.toLowerCase(),
                    lat: lat || null,
                    lng: lng || null,
                },
                navigation,
            );
        }
    };

    render() {
        const {
            showPassword,
            password,
            name,
            email,
            verify_code,
            store_verify_code,
            verify_edit,
            _sendVerifyCode,
            verify_send_title,
        } = this.state;

        return (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{vertical: 'never'}}>
                <View style={[Style.m_t_10, Style.p_h_6]}>
                    <TextInput
                        editable={true}
                        autoCapitalize="none"
                        spellCheck={false}
                        autoCorrect={false}
                        placeholder={I18n.t('user.name')}
                        keyboardType="default"
                        onChangeText={name => {
                            this.setState({name});
                        }}
                        style={[Style.p_v_2, Style.b_b]}
                    />
                    <TextInput
                        editable={true}
                        autoCapitalize="none"
                        spellCheck={false}
                        autoCorrect={false}
                        placeholder={I18n.t('user.email')}
                        keyboardType="email-address"
                        onChangeText={email => {
                            if (
                                email.indexOf('@') > 0 &&
                                email.indexOf('.') > 0
                            ) {
                                this.setState({email});
                            } else {
                                this.setState({
                                    email: '',
                                });
                            }
                        }}
                        style={[Style.p_v_2, Style.b_b, Style.m_t_4]}
                    />
                    {!!email && (
                        <View
                            style={[
                                Style.row,
                                Style.row_between,
                                Style.column_center,
                                Style.m_t_4,
                                Style.b_b,
                            ]}>
                            <View
                                style={[
                                    Style.flex,
                                    Style.row,
                                    Style.column_center,
                                ]}>
                                <TextInput
                                    editable={verify_edit}
                                    autoCapitalize="none"
                                    keyboardType="number-pad"
                                    placeholder={I18n.t('common.verify_code')}
                                    onChangeText={verify_code => {
                                        this.setState({verify_code});
                                    }}
                                    style={Style.p_v_2}
                                />
                                {store_verify_code !== null &&
                                    verify_code === store_verify_code && (
                                        <MaterialCommunityIcons
                                            name={'check-circle'}
                                            style={[
                                                Style.f_size_20,
                                                Style.f_color_wechat,
                                                Style.m_l_1,
                                            ]}
                                        />
                                    )}
                            </View>
                            <TouchableWithoutFeedback
                                onPress={_sendVerifyCode}
                                style={[
                                    Style.row,
                                    Style.bg_color_14,
                                    Style.border_round_1,
                                    Style.p_2,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_color_5,
                                        Style.f_size_13,
                                        Style.f_bold,
                                    ]}>
                                    {verify_send_title}
                                </Text>
                            </TouchableWithoutFeedback>
                        </View>
                    )}
                    <View
                        style={[
                            Style.row,
                            Style.row_between,
                            Style.column_center,
                            Style.m_t_4,
                            Style.b_b,
                        ]}>
                        <TextInput
                            secureTextEntry={!showPassword}
                            editable={
                                store_verify_code !== null &&
                                verify_code === store_verify_code
                            }
                            autoCapitalize="none"
                            keyboardType="default"
                            placeholder={I18n.t('user.password')}
                            onChangeText={password => {
                                this.setState({password});
                            }}
                            style={Style.p_v_2}
                        />
                        {!!password && (
                            <MaterialCommunityIcons
                                onPress={() =>
                                    this.setState({
                                        showPassword: !showPassword,
                                    })
                                }
                                name={
                                    showPassword
                                        ? 'eye-outline'
                                        : 'eye-off-outline'
                                }
                                style={[Style.f_size_20, Style.f_color_6]}
                            />
                        )}
                    </View>
                    <TouchableWithoutFeedback
                        onPress={
                            !!password && !!name && !!email
                                ? this._onSubmit
                                : () => {}
                        }>
                        <View style={[Style.h_center, Style.m_t_4]}>
                            <View
                                style={[
                                    Style.p_3,
                                    Style.border_round_1,
                                    !!password && !!name && !!email
                                        ? Style.bg_color_cityseeker
                                        : Style.bg_color_12,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_15,
                                        Style.f_bolder,
                                    ]}>
                                    {I18n.t('common.signup')}
                                </Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        system: state.system,
    };
}

const mapDispatchToProps = dispatch => ({
    signup: (profile, navigation) =>
        dispatch(signupAction(profile, navigation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Default);
