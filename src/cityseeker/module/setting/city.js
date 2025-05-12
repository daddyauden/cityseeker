import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {changeAreaRequest} from '../../actions/system';
import I18n from '../../locale';
import Style from '../../style';

const SPACE = 10;
const WIDTH = Style.w_100.width;

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('app.setting.city'),
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

    _changeCity = (countryCode, cityCode) => {
        const {system, navigation} = this.props;

        const {area} = system;

        const {city} = area;

        if (cityCode.toLowerCase() !== city.toLowerCase()) {
            this.props.dispatch(
                changeAreaRequest({
                    country: countryCode.toLowerCase(),
                    city: cityCode.toLowerCase(),
                }),
            );
        }

        setTimeout(() => navigation.dismiss(), 50);
    };

    _renderArea = () => {
        const {area} = this.props.system;

        const countryArr = Object.keys(area.list).sort();

        const images = {
            toronto: require('../../../common/assets/images/toronto.png'),
            montreal: require('../../../common/assets/images/montreal.png'),
            vancouver: require('../../../common/assets/images/vancouver.png'),
            sydney: require('../../../common/assets/images/sydney.png'),
            melbourne: require('../../../common/assets/images/melbourne.png'),
            paris: require('../../../common/assets/images/paris.png'),
            rome: require('../../../common/assets/images/rome.png'),
        };

        const render =
            countryArr.length > 0 &&
            countryArr.map((countryCode, key) => {
                let cityList =
                    area.list[countryCode] !== undefined
                        ? Object.keys(area.list[countryCode]).sort()
                        : [];

                const cityArr = cityList.map((cityCode, key) => {
                    return (
                        <TouchableOpacity
                            key={key}
                            onPress={this._changeCity.bind(
                                this,
                                countryCode,
                                cityCode,
                            )}>
                            <View
                                style={[
                                    Style.v_center,
                                    Style.p_h_3,
                                    Style.p_v_2,
                                    {
                                        marginRight: SPACE,
                                        marginBottom: SPACE,
                                        width: (WIDTH - SPACE * 5) / 3,
                                        height: (WIDTH - SPACE * 5) / 3,
                                    },
                                ]}>
                                <Image
                                    style={[Style.w_p90, Style.h_p90]}
                                    source={images[cityCode.toLowerCase()]}
                                />
                                <Text
                                    style={[
                                        Style.f_color_5,
                                        Style.f_size_12,
                                        Style.f_bold,
                                    ]}>
                                    {I18n.t(cityCode.toLowerCase())}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                });

                return (
                    <View key={key} style={[Style.column, Style.row_center]}>
                        <View style={[Style.p_h_3]}>
                            <Text
                                style={[
                                    Style.f_color_3,
                                    Style.f_size_13,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(countryCode.toUpperCase())}
                            </Text>
                        </View>
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
                            {cityArr}
                        </View>
                    </View>
                );
            });

        return render;
    };

    render() {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={[Style.bg_color_15]}>
                <View style={[Style.column, Style.row_center]}>
                    {this._renderArea()}
                </View>
            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    return {
        system: state.system,
    };
}

export default connect(mapStateToProps)(Default);
