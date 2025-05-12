import React from 'react';
import {View, Text, ScrollView, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';
import FlatListView from '../../components/FlatListView';
import SearchBar from '../../components/SearchBar';
import StatusBar from '../../components/StatusBar';
import Divide from '../../components/Divide';
import RouteConfig from '../../config/route';
import JobType from '../../type/job';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = () => {
        return {
            header: null,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            typeName: 'all',
        };
    }

    _renderTypeBar = () => {
        const {typeName} = this.state;

        const allType = Object.keys(JobType);

        const render =
            JobType !== undefined &&
            allType.length > 0 &&
            allType.map((type, index) => {
                return (
                    <TouchableWithoutFeedback
                        key={index}
                        onPress={() => this.setState({typeName: type})}>
                        <View
                            style={[
                                Style.column,
                                Style.row_center,
                                Style.column_center,
                                Style.p_h_3,
                                Style.p_v_2,
                                Style.m_r_2,
                                Style.b_half,
                                Style.border_round_1,
                                type === typeName
                                    ? Style.bg_color_14
                                    : Style.bg_color_15,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_weight_600,
                                    Style.f_fa_pf,
                                ]}>
                                {I18n.t(
                                    'module.job.type.' + type.toLowerCase(),
                                )}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                );
            });

        const all = (
            <TouchableWithoutFeedback
                key={render.length}
                onPress={() => this.setState({typeName: 'all'})}>
                <View
                    style={[
                        Style.column,
                        Style.row_center,
                        Style.column_center,
                        Style.p_h_3,
                        Style.p_v_2,
                        Style.m_r_2,
                        Style.b_half,
                        Style.border_round_1,
                        typeName === 'all'
                            ? Style.bg_color_14
                            : Style.bg_color_15,
                    ]}>
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_color_3,
                            Style.f_weight_600,
                            Style.f_fa_pf,
                        ]}>
                        {I18n.t('common.all')}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );

        // render.unshift(all);

        return (
            <View
                style={[
                    Style.w_p100,
                    Style.m_t_1,
                    Style.m_b_3,
                    Style.p_l_3,
                    Style.p_r_1,
                    Style.row,
                    Style.column_center,
                ]}>
                {all}
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {render}
                </ScrollView>
            </View>
        );
    };

    render() {
        const {city, lat, lng, navigation} = this.props;

        const {typeName} = this.state;

        return (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{bottom: 'never'}}>
                <StatusBar light />
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.p_h_3,
                        Style.m_b_2,
                    ]}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            navigation.dismiss();
                        }}>
                        <MaterialCommunityIcons
                            name="home"
                            style={[Style.f_size_25, Style.f_color_1]}
                        />
                    </TouchableWithoutFeedback>
                    <SearchBar
                        {...this.props}
                        requestHost={RouteConfig.search.job}
                        cellType="job"
                        select={[
                            'id',
                            'title',
                            'business',
                            'views',
                            'delivery',
                            'status',
                        ]}
                        where={
                            typeName === 'all' || typeName === null
                                ? ["city = '" + city + "'", 'status = 1']
                                : [
                                      "city = '" + city + "'",
                                      "'" + typeName + "' = ANY(type)",
                                      'status = 1',
                                  ]
                        }
                        order={
                            lat
                                ? ['distance asc', 'views desc', 'add_time asc']
                                : ['views desc', 'add_time asc']
                        }
                        lat={lat}
                        lng={lng}
                        style={[Style.flex, Style.m_b_0, Style.m_h_2]}
                    />
                    <TouchableWithoutFeedback
                        onPress={() => {
                            navigation.navigate('JobHistory');
                        }}>
                        <MaterialCommunityIcons
                            name="history"
                            style={[Style.f_size_25, Style.f_color_6]}
                        />
                    </TouchableWithoutFeedback>
                </View>
                {this._renderTypeBar()}
                <FlatListView
                    {...this.props}
                    reloadToken={[typeName, city, lat]}
                    requestHost={RouteConfig.job.list}
                    cellType="job"
                    select={[
                        'id',
                        'title',
                        'business',
                        'views',
                        'delivery',
                        'status',
                    ]}
                    where={
                        typeName === 'all' || typeName === null
                            ? ["city = '" + city + "'", 'status = 1']
                            : [
                                  "city = '" + city + "'",
                                  "'" + typeName + "' = ANY(type)",
                                  'status = 1',
                              ]
                    }
                    order={
                        lat
                            ? ['distance asc', 'views desc', 'add_time desc']
                            : ['views desc', 'add_time desc']
                    }
                    lat={lat}
                    lng={lng}
                    renderSeparator={() => {
                        return (
                            <Divide
                                style={{
                                    ...Style.h_2,
                                    ...Style.bg_color_gray,
                                }}
                            />
                        );
                    }}
                />
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        account: state.account,
        locale: state.system.locale,
        city: state.system.area.city,
        lat: state.system.lat,
        lng: state.system.lng,
    };
}

export default connect(mapStateToProps)(Default);
