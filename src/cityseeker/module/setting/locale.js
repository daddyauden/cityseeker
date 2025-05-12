import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {changeLocale} from '../../actions/system';
import I18n, {LANGUAGES} from '../../locale';
import Style from '../../style';

const SPACE = 10;
const WIDTH = Dimensions.get('window').width;

class Default extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('title', I18n.t('app.setting.locale')),
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.dismiss();
                        navigation.toggleDrawer();
                    }}>
                    <View
                        style={[
                            Style.p_l_3,
                            Style.row_center,
                            Style.column_center,
                        ]}>
                        <MaterialCommunityIcons
                            name="close"
                            style={[Style.f_size_22, Style.f_color_3]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
        };
    };

    componentDidUpdate(prevProps, prevState) {
        const {locale} = this.props;

        if (prevProps.locale !== locale) {
            this.props.navigation.setParams({
                title: I18n.t('app.setting.locale'),
            });
        }
    }

    _changeLocale = defaultLocale => {
        const {locale, navigation} = this.props;

        if (defaultLocale !== locale) {
            this.props.dispatch(
                changeLocale({
                    locale: defaultLocale,
                }),
            );
        }

        setTimeout(() => navigation.dismiss(), 50);
    };

    render() {
        const datas = Object.keys(LANGUAGES).map((defaultLocale, key) => {
            return (
                <TouchableOpacity
                    key={key}
                    onPress={this._changeLocale.bind(this, defaultLocale)}>
                    <View
                        style={[
                            Style.column,
                            Style.row_center,
                            Style.column_start,
                            Style.bg_color_gray,
                            Style.p_h_3,
                            Style.p_v_2,
                            {
                                marginRight: SPACE,
                                marginBottom: SPACE,
                                width: (WIDTH - SPACE * 3) / 2,
                            },
                        ]}>
                        <Text
                            style={[
                                Style.f_color_3,
                                Style.f_size_13,
                                Style.f_weight_500,
                                Style.f_fa_pf,
                            ]}>
                            {I18n.t(defaultLocale)}
                        </Text>
                        <Text
                            style={[
                                Style.f_color_5,
                                Style.f_size_11,
                                Style.f_weight_400,
                                Style.f_fa_pf,
                                Style.m_t_1,
                            ]}>
                            {I18n.t(defaultLocale + '.title')}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        });

        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={[Style.bg_color_15]}>
                <View
                    style={[
                        Style.row,
                        Style.row_start,
                        Style.wrap,
                        {
                            paddingLeft: SPACE,
                            paddingVertical: SPACE,
                        },
                    ]}>
                    {datas}
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return {
        lastTabName: state.system.lastTabName,
        locale: state.system.locale,
    };
};

export default connect(mapStateToProps)(Default);
