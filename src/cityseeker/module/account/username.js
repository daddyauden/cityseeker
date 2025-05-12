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
import RocketChat from '../../../lingchat/lib/rocketchat';
import {username_check} from '../../actions/business';
import StatusBar from '../../components/StatusBar';
import {update} from '../../actions/account';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('Username'),
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
            suggestion: '',
            username: '',
            saving: false,
            status: false,
            typeStatus: 'no',
        };
    }

    async componentDidMount() {
        const {account} = this.props;
        const suggestion = await RocketChat.getUsernameSuggestion();

        if (suggestion.success) {
            this.setState({
                suggestion:
                    account.username !== undefined &&
                    account.username.indexOf('_') !== -1
                        ? suggestion.result.replace(/(\W)/g, '')
                        : suggestion.result.replace(/(\W)/g, '_'),
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {suggestion, username, saving, status, typeStatus} = this.state;

        if (nextState.suggestion !== suggestion) {
            return true;
        }

        if (nextState.username !== username) {
            return true;
        }

        if (nextState.saving !== saving) {
            return true;
        }

        if (nextState.status !== status) {
            return true;
        }

        if (nextState.typeStatus !== typeStatus) {
            return true;
        }

        return false;
    }

    setUserName = value => {
        if (value && value !== '@') {
            let username = value.indexOf('@') === -1 ? '@' + value : value;
            this.setState({
                username: username.toLowerCase(),
                typeStatus: 'ing',
                status: false,
            });
        } else {
            this.setState({username: '', typeStatus: 'no'});
        }
    };

    checkUserName = async () => {
        const {username} = this.state;

        const {status} = await username_check(
            username.toLowerCase().replace(/@*/g, ''),
        );

        if (status) {
            this.setState({
                status: true,
                typeStatus: 'yes',
            });
        } else {
            this.setState({
                status: false,
                typeStatus: 'yes',
            });
        }
    };

    submit = () => {
        const {navigation, account} = this.props;

        const {username} = this.state;

        const filterUsername = username.toLowerCase().replace(/@*/g, '');

        this.setState({saving: true}, () => {
            this.props.dispatch(
                update(
                    {
                        id: account.id,
                        currentUsername: account.username,
                        username: filterUsername,
                    },
                    'UPDATE_USERNAME',
                    navigation,
                ),
            );
        });
    };

    render() {
        const {suggestion, username, typeStatus, status, saving} = this.state;

        const {llt, account} = this.props;

        const deadline = llt + 1000 * 2592000;

        const canUpdate = llt === null || Date.now() > deadline;

        let duration = '';
        let unit = '';

        if (!canUpdate) {
            if (deadline - Date.now() > 86400000) {
                duration = Math.floor((deadline - Date.now()) / 86400000);
                unit = I18n.t('common.date.day');
            } else if (deadline - llt > 3600000) {
                duration = Math.floor((deadline - Date.now()) / 3600000);
                unit = I18n.t('common.time.hour');
            } else if (deadline - Date.now() > 60000) {
                duration = Math.floor((deadline - Date.now()) / 60000);
                unit = I18n.t('common.time.minute');
            } else if (deadline - Date.now() > 1000) {
                duration = Math.floor((deadline - Date.now()) / 1000);
                unit = I18n.t('common.time.second');
            }
        }

        duration = I18n.t('modify_username_notice', {
            duration,
            unit,
            suffix: 's',
        });

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
                            {I18n.t('Set_username_subtitle')}
                        </Text>
                        {account.username !== undefined && account.username && (
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
                                    {'@' + account.username}
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
                                    Style.b_b,
                                    Style.row,
                                    Style.column_center,
                                    Style.row_between,
                                ]}>
                                <TextInput
                                    placeholder={
                                        canUpdate
                                            ? I18n.t('user.username')
                                            : duration
                                    }
                                    placeholderTextColor={Style.f_color_9.color}
                                    autoCapitalize="none"
                                    autoComplete="off"
                                    autoCorrect={false}
                                    autoFocus={false}
                                    spellCheck={false}
                                    editable={canUpdate}
                                    returnKeyType="default"
                                    returnKeyLabel={I18n.t('common.save')}
                                    onChangeText={value =>
                                        this.setUserName(
                                            value.replace(/(\W)*/g, ''),
                                        )
                                    }
                                    value={username}
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
                                        onPress={this.checkUserName}>
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
                                                    Style.f_color_1,
                                                    Style.f_weight_500,
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
                        {canUpdate && (
                            <View
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_t_2,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_color_5,
                                        Style.f_weight_600,
                                        Style.f_fa_pf,
                                    ]}>
                                    {I18n.t('Suggestions')}
                                </Text>
                                <TouchableWithoutFeedback
                                    onPress={() =>
                                        this.setState(
                                            {
                                                username: '@' + suggestion,
                                            },
                                            this.checkUserName,
                                        )
                                    }>
                                    <Text
                                        style={[
                                            Style.f_size_17,
                                            Style.f_color_cityseeker,
                                            Style.f_weight_500,
                                            Style.f_fa_pf,
                                            Style.m_l_1,
                                        ]}>
                                        {'@' + suggestion}
                                    </Text>
                                </TouchableWithoutFeedback>
                            </View>
                        )}
                        {(status || saving) && (
                            <TouchableWithoutFeedback
                                onPress={
                                    status === true ? this.submit : () => {}
                                }>
                                <View
                                    style={[
                                        Style.row,
                                        Style.column_center,
                                        Style.m_t_2,
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
                                                Style.f_weight_500,
                                                Style.f_fa_pf,
                                            ]}>
                                            {saving === true
                                                ? I18n.t('common.save') + '...'
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
        llt: state.account.lastUpdateUsernameTS || null,
    };
};

export default connect(mapStateToProps)(Default);
