import React from 'react';
import PropTypes from 'prop-types';
import {View, Image, Text, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Orientation from 'react-native-orientation-locker';
import {isWXAppInstalled} from 'react-native-wechat';
import {connect} from 'react-redux';
import SigninButton from '../../components/SigninButton';
import {
    signin as signinAction,
    skipSignin as skipSigninAction,
} from '../../actions/account';
import {HAS_NOTCH} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = () => ({
        header: null,
    });

    constructor(props) {
        super(props);
        Orientation.lockToPortrait();

        this.state = {
            hasWechat: false,
        };
    }

    componentDidMount() {
        isWXAppInstalled().then(status => {
            this.setState({
                hasWechat: status ? true : false,
            });
        });
    }

    render() {
        const {hasWechat} = this.state;

        const {
            config,
            navigation,
            showSkipButton,
            skipSignin,
            signin,
        } = this.props;

        return (
            <View style={[Style.bg_transparent]}>
                <View
                    style={[
                        Style.p_t_4,
                        Style.p_h_7,
                        Style.p_b_2,
                        Style.bg_color_15,
                        Style.border_round_top_1,
                    ]}>
                    {showSkipButton === true && (
                        <View
                            style={[
                                Style.top_right,
                                {
                                    right: 5,
                                    top: 3,
                                },
                            ]}>
                            <TouchableWithoutFeedback onPress={skipSignin}>
                                <MaterialCommunityIcons
                                    name={'close'}
                                    style={[Style.f_size_20, Style.f_color_3]}
                                />
                            </TouchableWithoutFeedback>
                        </View>
                    )}
                    <View style={[Style.h_center, Style.p_v_2]}>
                        <TouchableWithoutFeedback
                            onPress={() => navigation.navigate('Signup')}>
                            <View
                                style={[
                                    Style.flex,
                                    Style.bg_color_cityseeker,
                                    Style.border_round_1,
                                    Style.p_v_2,
                                ]}>
                                <Text
                                    style={[
                                        Style.text_center,
                                        Style.f_size_15,
                                        Style.f_color_15,
                                        Style.f_bolder,
                                    ]}>
                                    {I18n.t('signup_with_email')}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={[Style.column_center, Style.m_b_3, Style.b_b]}>
                        <Text
                            style={[
                                Style.bg_color_15,
                                Style.position_relative,
                                {
                                    bottom: -10,
                                },
                                Style.f_size_13,
                                Style.f_color_6,
                                Style.f_bold,
                                Style.p_h_3,
                            ]}>
                            OR
                        </Text>
                    </View>
                    <View style={[Style.h_center, Style.p_b_3]}>
                        {config.facebook_login && (
                            <SigninButton
                                source="facebook"
                                icon={
                                    <Image
                                        source={require('../../../common/assets/images/facebook.png')}
                                        style={{
                                            width: 34,
                                            height: 34,
                                        }}
                                    />
                                }
                                signin={signin}
                                navigation={navigation}
                                style={[
                                    Style.bg_color_facebook,
                                    Style.border_round_4,
                                    Style.m_h_2,
                                ]}
                            />
                        )}
                        {config.google_login && (
                            <SigninButton
                                source="google"
                                icon={
                                    <Image
                                        source={require('../../../common/assets/images/google.png')}
                                        style={{
                                            width: 30,
                                            height: 30,
                                        }}
                                    />
                                }
                                signin={signin}
                                navigation={navigation}
                                style={[Style.border_round_3, Style.m_h_2]}
                            />
                        )}
                        {hasWechat === true && config.wechat_login && (
                            <SigninButton
                                source="wechat"
                                icon={
                                    <Image
                                        source={require('../../../common/assets/images/wechat.png')}
                                        style={{
                                            width: 36,
                                            height: 36,
                                        }}
                                    />
                                }
                                signin={signin}
                                navigation={navigation}
                                style={[Style.m_h_2]}
                            />
                        )}
                    </View>
                    <View style={[Style.h_center]}>
                        <Text
                            style={[
                                Style.f_size_12,
                                Style.f_color_6,
                                Style.text_center,
                                {
                                    lineHeight: 17,
                                },
                            ]}>
                            {I18n.t('eula_1')}
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    navigation.navigate('TermsOfUse')
                                }>
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_cityseeker,
                                        Style.f_bold,
                                    ]}>
                                    {I18n.t('terms_of_use')}
                                </Text>
                            </TouchableWithoutFeedback>
                            {I18n.t('eula_2')}
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    navigation.navigate('PrivacyPolicy')
                                }>
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_cityseeker,
                                        Style.f_bold,
                                    ]}>
                                    {I18n.t('privacy_policy')}
                                </Text>
                            </TouchableWithoutFeedback>
                        </Text>
                    </View>
                </View>
                <View
                    style={[
                        Style.bg_color_gray,
                        Style.b_t,
                        Style.p_v_3,
                        Style.h_center,
                        HAS_NOTCH && Style.p_b_6,
                    ]}>
                    <Text
                        style={[
                            Style.f_regular,
                            Style.f_color_5,
                            Style.f_size_14,
                        ]}>
                        {I18n.t('already_have_an_account')}
                    </Text>
                    <TouchableWithoutFeedback
                        onPress={() => navigation.navigate('Signin')}>
                        <Text
                            style={[
                                Style.f_size_15,
                                Style.f_color_3,
                                Style.f_bold,
                                Style.m_l_1,
                            ]}>
                            {I18n.t('common.signin')}
                        </Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

Default.propTypes = {
    displayAsModal: PropTypes.bool.isRequired,
    showSkipButton: PropTypes.bool.isRequired,
    config: PropTypes.object.isRequired,
};

Default.defaultProps = {
    displayAsModal: false,
    showSkipButton: false,
    config: {
        facebook_login: false,
        google_login: false,
        wechat_login: false,
    },
};

const mapStateToProps = state => ({
    config: state.config,
});

const mapDispatchToProps = dispatch => ({
    signin: (source, navigation) =>
        dispatch(signinAction({source}, navigation)),
    skipSignin: () => dispatch(skipSigninAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Default);
