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
import {Common} from '../../utils/lib';
import {send_email_code, email_check} from '../../actions/business';
import StatusBar from '../../components/StatusBar';
import {update} from '../../actions/account';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('Email'),
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

        this.inteval = null;

        this.state = {
            invalidEmail: true,
            email: '',
            saving: false,
            status: false,
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
                invalidEmail: true,
                typeStatus: 'no',
                status: false,
                verify_code_show: false,
            });
        } else {
            this.setState({
                email,
                invalidEmail: false,
                typeStatus: 'ing',
                verify_code_show: false,
            });
        }
    };

    checkEmail = async () => {
        const {email} = this.state;

        const {status} = await email_check(email);

        if (status) {
            this.setState({
                status: true,
                typeStatus: 'yes',
                verify_code_show: true,
            });
        } else {
            this.setState({
                status: false,
                typeStatus: 'yes',
                verify_code_show: false,
            });
        }
    };

    _sendVerifyCode = () => {
        const {email} = this.state;

        this.setState(
            {
                verify_send_title: I18n.t('common.send') + ' ...',
                verify_code: null,
                store_verify_code: null,
            },
            () => {
                send_email_code(email)
                    .then(response => {
                        const {status} = response;

                        if (parseInt(status) === 1) {
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
                            }, 1000);
                        }
                    })
                    .catch(error => {});
            },
        );
    };

    submit = () => {
        const {navigation, account} = this.props;

        const {email} = this.state;

        this.setState({saving: true}, () => {
            this.props.dispatch(
                update(
                    {
                        id: account.id,
                        currentEmail: account.email,
                        email,
                    },
                    'UPDATE_EMAIL',
                    navigation,
                ),
            );
        });
    };

    render() {
        const {account} = this.props;
        const {
            typeStatus,
            status,
            saving,
            verify_edit,
            verify_code_show,
            _sendVerifyCode,
            verify_send_title,
            verify_code,
            store_verify_code,
        } = this.state;

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
                        <Text
                            style={[
                                Style.f_size_15,
                                Style.f_color_3,
                                Style.f_weight_500,
                                Style.l_h_5,
                            ]}>
                            {I18n.t('Set_email_subtitle')}
                        </Text>
                        {account.email !== undefined && account.email && (
                            <View
                                style={[
                                    Style.column,
                                    Style.row_center,
                                    Style.m_t_6,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_5,
                                        Style.f_weight_600,
                                        Style.f_fa_pf,
                                    ]}>
                                    {I18n.t('common.current')}
                                </Text>
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_3,
                                        Style.f_weight_400,
                                        Style.f_fa_pf,
                                        Style.m_t_1,
                                    ]}>
                                    {account.email}
                                </Text>
                            </View>
                        )}
                        <View
                            style={[
                                Style.column,
                                Style.row_center,
                                Style.m_t_5,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_15,
                                    Style.f_color_2,
                                    Style.f_weight_600,
                                    Style.f_fa_pf,
                                    Style.m_b_1,
                                ]}>
                                {I18n.t('common.new')}
                            </Text>
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.row_between,
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
                                    returnKeyLabel={I18n.t('common.save')}
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
                                {status === true ? (
                                    <MaterialCommunityIcons
                                        name={'check-circle-outline'}
                                        style={[
                                            Style.f_size_25,
                                            Style.f_color_green,
                                        ]}
                                    />
                                ) : status === false && typeStatus === 'ing' ? (
                                    <TouchableWithoutFeedback
                                        onPress={this.checkEmail}>
                                        <View
                                            style={[
                                                Style.row,
                                                Style.column_center,
                                                Style.bg_color_14,
                                                Style.p_h_2,
                                                Style.p_v_1,
                                                Style.border_round_1,
                                            ]}>
                                            <Text
                                                style={[
                                                    Style.f_size_15,
                                                    Style.f_color_3,
                                                    Style.f_weight_500,
                                                    Style.f_fa_pf,
                                                ]}>
                                                {I18n.t(
                                                    'common.check_username',
                                                )}
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                ) : status === false && typeStatus === 'yes' ? (
                                    <MaterialCommunityIcons
                                        name={'close-circle-outline'}
                                        style={[
                                            Style.f_size_25,
                                            Style.f_color_cityseeker,
                                        ]}
                                    />
                                ) : null}
                            </View>
                        </View>
                        {verify_code_show && (
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_t_2,
                                ]}>
                                <TextInput
                                    editable={verify_edit}
                                    autoCapitalize="none"
                                    keyboardType="number-pad"
                                    placeholder={I18n.t('common.verify_code')}
                                    onChangeText={code => {
                                        this.setState({
                                            verify_code: code,
                                        });
                                    }}
                                    value={verify_code}
                                    style={[Style.flex, Style.h_p100]}
                                />
                                <TouchableWithoutFeedback
                                    onPress={_sendVerifyCode}>
                                    <View
                                        style={[
                                            Style.column_end,
                                            Style.row_center,
                                            Style.p_2,
                                            Style.bg_color_14,
                                            Style.border_round_1,
                                        ]}>
                                        <Text
                                            style={[
                                                Style.f_size_15,
                                                Style.f_color_3,
                                                Style.f_weight_500,
                                                Style.f_fa_pf,
                                            ]}>
                                            {verify_send_title}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
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
                                {verify_code !== null &&
                                    verify_code !== store_verify_code && (
                                        <MaterialCommunityIcons
                                            name={'close-circle-outline'}
                                            style={[
                                                Style.f_size_25,
                                                Style.f_color_cityseeker,
                                                Style.m_l_2,
                                            ]}
                                        />
                                    )}
                            </View>
                        )}
                        {((status &&
                            verify_code !== null &&
                            verify_code === store_verify_code) ||
                            saving) && (
                            <TouchableWithoutFeedback
                                onPress={
                                    status === true &&
                                    verify_code === store_verify_code
                                        ? this.submit
                                        : () => {}
                                }>
                                <View
                                    style={[
                                        Style.row,
                                        Style.column_center,
                                        Style.p_t_3,
                                        Style.m_t_1,
                                        Style.b_t,
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
                                                !status && !saving
                                                    ? Style.f_color_9
                                                    : Style.f_color_3,
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
                        )}
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
