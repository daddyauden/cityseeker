import React, {Component} from 'react';
import {View, Text, TextInput, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {SafeAreaView} from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {signin as signinAction} from '../../actions/account';
import StatusBar from '../../components/StatusBar';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

class Default extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.dismiss();
                        navigation.toggleDrawer();
                    }}>
                    <View style={[Style.p_l_3, Style.h_center]}>
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

        this.state = {
            email: null,
            password: null,
            showPassword: false,
        };
    }

    _onSubmit = _ => {
        const {email, password} = this.state;

        const {navigation, signin} = this.props;

        if (!email || !password) {
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
        } else {
            signin({email, password, source: 'cityseeker'}, navigation);
        }
    };

    render() {
        const {email, password, showPassword} = this.state;

        const {navigation} = this.props;

        return (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{vertical: 'never'}}>
                <StatusBar light />
                <View style={[Style.m_t_10, Style.p_h_6]}>
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
                        style={[Style.p_v_2, Style.b_b]}
                    />
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
                            editable={!!email}
                            autoCapitalize="none"
                            placeholder={I18n.t('user.password')}
                            keyboardType="default"
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
                                    !showPassword
                                        ? 'eye-outline'
                                        : 'eye-off-outline'
                                }
                                style={[Style.f_size_20, Style.f_color_6]}
                            />
                        )}
                    </View>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            navigation.navigate('ResetPassword');
                        }}>
                        <Text
                            style={[
                                Style.f_size_12,
                                Style.f_color_6,
                                Style.f_regular,
                                Style.m_t_2,
                            ]}>
                            {I18n.t('Forgot_my_password')}
                        </Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={
                            !!email && !!password ? this._onSubmit : () => {}
                        }>
                        <View style={[Style.h_center, Style.m_t_4]}>
                            <View
                                style={[
                                    Style.p_3,
                                    Style.border_round_1,
                                    !!email && !!password
                                        ? Style.bg_color_cityseeker
                                        : Style.bg_color_12,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_15,
                                        Style.f_bolder,
                                    ]}>
                                    {I18n.t('common.signin')}
                                </Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </SafeAreaView>
        );
    }
}

// const mapStateToProps = state => {
//     return {
//
//     };
// };

const mapDispatchToProps = dispatch => ({
    signin: (profile, navigation) =>
        dispatch(signinAction(profile, navigation)),
});

export default connect(null, mapDispatchToProps)(Default);
