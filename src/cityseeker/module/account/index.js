import React from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';

import StatusBar from '../../components/StatusBar';
import BusinessModel from '../../model/business';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('app.nav.account'),
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.dismiss();
                        navigation.toggleDrawer();
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

    _renderAccount = () => {
        const {account, navigation} = this.props;
        const {username, email, password} = BusinessModel.account;

        let accountModel = {username, email, password};

        if (
            account.source !== undefined &&
            account.source &&
            account.source.toLowerCase() !== 'cityseeker'
        ) {
            accountModel = {username};
        }

        const render =
            Object.keys(accountModel).length > 0 &&
            Object.keys(accountModel).map((fieldName, key) => {
                return (
                    <TouchableWithoutFeedback
                        key={key}
                        onPress={() =>
                            navigation.navigate(
                                'Account' +
                                    Common.capitalize(fieldName.toLowerCase()),
                            )
                        }>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_between,
                                Style.p_v_3,
                                Style.p_r_2,
                                Style.b_b,
                                Style.bg_color_15,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_bold,
                                ]}>
                                {I18n.t([accountModel[fieldName]['label']])}
                            </Text>
                            {fieldName !== 'password' && (
                                <View
                                    style={[
                                        Style.flex,
                                        Style.row,
                                        Style.column_center,
                                        Style.row_end,
                                        Style.p_r_2,
                                    ]}>
                                    <Text
                                        style={[
                                            Style.f_color_6,
                                            Style.f_size_13,
                                            Style.f_regular,
                                        ]}>
                                        {account[fieldName] &&
                                            fieldName.toLowerCase() ===
                                                'username' &&
                                            '@' + account.username}
                                        {account[fieldName] &&
                                            fieldName.toLowerCase() ===
                                                'email' &&
                                            account.email}
                                    </Text>
                                </View>
                            )}
                            <MaterialCommunityIcons
                                name="chevron-right"
                                style={[Style.f_size_20, Style.f_color_6]}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                );
            });

        return (
            <View style={[Style.column, Style.row_center, Style.p_l_4]}>
                {render}
            </View>
        );
    };

    render() {
        return (
            <View style={[Style.theme_content]}>
                <StatusBar light />
                {this._renderAccount()}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        account: state.account,
    };
};

export default connect(mapStateToProps)(Default);
