import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StatusBar from '../../components/StatusBar';
import I18n from '../../locale';
import Style from '../../style';

class Default extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('app.nav.privacy'),
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

    render() {
        const {navigation} = this.props;

        return (
            <View style={[Style.theme_content]}>
                <StatusBar light />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <TouchableWithoutFeedback
                            onPress={() => navigation.navigate('PrivacyBlock')}>
                            <View
                                style={[
                                    Style.bg_color_15,
                                    Style.p_3,
                                    Style.row,
                                    Style.row_between,
                                    Style.column_center,
                                ]}>
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_3,
                                        Style.f_bold,
                                    ]}>
                                    {I18n.t('app.nav.blocked_list')}
                                </Text>
                                <MaterialCommunityIcons
                                    style={[Style.f_size_20, Style.f_color_6]}
                                    name="chevron-right"
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default Default;
