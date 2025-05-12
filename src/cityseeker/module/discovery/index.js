import React from 'react';
import {ScrollView, Text, TouchableWithoutFeedback, View} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';
import equal from 'deep-equal';

import BottomTabBar from '../sidebar/bottom';

import FlatListView from '../../components/FlatListView';
import StatusBar from '../../components/StatusBar';
import SearchBtn from '../../components/SearchBtn';
import CityBtn from '../../components/CityBtn';
import Divide from '../../components/Divide';
import {updateTab} from '../../actions/system';
import RouteConfig from '../../config/route';
import Types from '../../type/discovery';
import Style from '../../style';
import I18n from '../../locale';

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

        props.navigation.addListener('didFocus', () => {
            props.dispatch(updateTab('Discovery'));
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {locale, city, lat} = this.props;

        if (!equal(nextProps.locale, locale)) {
            return true;
        }

        if (!equal(nextProps.city, city)) {
            return true;
        }

        if (!equal(nextProps.lat, lat)) {
            return true;
        }

        if (!equal(nextState.typeName, this.state.typeName)) {
            return true;
        }

        return false;
    }

    _renderTypeBar = () => {
        const {typeName} = this.state;

        const allType = Object.keys(Types);

        const render =
            Types !== undefined &&
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
                                {I18n.t('type.' + type.toLowerCase())}
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

    _renderHeaderBar = () => {
        const {city, lat, lng} = this.props;

        const {typeName} = this.state;

        return (
            <View
                style={[
                    Style.h_center,
                    Style.row_between,
                    Style.p_h_3,
                    Style.p_b_1,
                ]}>
                <CityBtn {...this.props} />
                <SearchBtn
                    {...this.props}
                    requestHost={RouteConfig.search.business}
                    cellType="business"
                    select={[
                        'id',
                        'uid',
                        'condition',
                        'name',
                        'cover',
                        'type',
                        'tag',
                        'views',
                        'ratings',
                        'likes',
                        'follower',
                        'avator',
                    ]}
                    where={
                        typeName === 'all' || typeName === null
                            ? [
                                  'condition = 1',
                                  "city = '" + city + "'",
                                  'status = 1',
                                  '(' +
                                      Object.keys(Types)
                                          .map(typeName => {
                                              return (
                                                  "type = '" + typeName + "'"
                                              );
                                          })
                                          .join(' OR ') +
                                      ')',
                              ]
                            : [
                                  'condition = 1',
                                  "city = '" + city + "'",
                                  "type = '" + typeName + "'",
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
                    style={[
                        Style.bg_color_gray,
                        {
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                        },
                    ]}
                />
            </View>
        );
    };

    render() {
        const {city, lat, lng} = this.props;

        const {typeName} = this.state;

        return (
            <SafeAreaView
                forceInset={{bottom: 'always'}}
                style={[Style.flex, Style.theme_content, Style.p_b_10]}>
                <StatusBar light />
                <BottomTabBar
                    {...this.props}
                    showIcon={true}
                    showLabel={true}
                    routeName={'Discovery'}
                />
                {this._renderHeaderBar()}
                {this._renderTypeBar()}
                <FlatListView
                    {...this.props}
                    reloadToken={[typeName, city, lat]}
                    requestHost={RouteConfig.business.list}
                    cellType="business"
                    select={[
                        'id',
                        'uid',
                        'condition',
                        'name',
                        'cover',
                        'type',
                        'tag',
                        'views',
                        'ratings',
                        'likes',
                        'follower',
                        'avator',
                    ]}
                    where={
                        typeName === 'all' || typeName === null
                            ? [
                                  'condition = 1',
                                  "city = '" + city + "'",
                                  'status = 1',
                                  '(' +
                                      Object.keys(Types)
                                          .map(typeName => {
                                              return (
                                                  "type = '" + typeName + "'"
                                              );
                                          })
                                          .join(' OR ') +
                                      ')',
                              ]
                            : [
                                  'condition = 1',
                                  "city = '" + city + "'",
                                  "type = '" + typeName + "'",
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
                    renderSeparator={() => {
                        return (
                            <Divide
                                style={{
                                    ...Style.h_4,
                                    ...Style.bg_color_15,
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
        locale: state.system.locale,
        city: state.system.area.city,
        lat: state.system.lat,
        lng: state.system.lng,
    };
}

export default connect(mapStateToProps)(Default);
