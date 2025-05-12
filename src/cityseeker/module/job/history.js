import React from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';

import {Common} from '../../utils/lib';

import FlatListView from '../../components/FlatListView';
import StatusBar from '../../components/StatusBar';
import Divide from '../../components/Divide';

import RouteConfig from '../../config/route';
import JobCell from '../../cells/job';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: (
                <View
                    style={[
                        Style.flex,
                        Style.column,
                        Style.row_center,
                        Style.column_center,
                    ]}>
                    <Text
                        style={[
                            Style.f_size_15,
                            Style.f_color_1,
                            Style.f_weight_600,
                        ]}>
                        {I18n.t('module.job.apply_history')}
                    </Text>
                </View>
            ),
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <View
                        style={[
                            Style.row,
                            Style.row_center,
                            Style.column_center,
                            Style.m_l_3,
                            Style.bg_color_15,
                            {
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                            },
                        ]}>
                        <MaterialCommunityIcons
                            name="arrow-left"
                            style={[Style.f_size_18, Style.f_color_0]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
        };
    };

    _renderItem = ({item}) => {
        const {params} = this.props;

        return (
            <View style={[Style.column_end, Style.p_v_1]}>
                <JobCell data={item.content} {...this.props} />
                {item.add_time !== undefined && item.add_time && (
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_color_9,
                            Style.f_regular,
                            Style.p_h_3,
                        ]}>
                        {Common.datetime(item.add_time, params.datetime_format)}
                    </Text>
                )}
            </View>
        );
    };

    render() {
        const {city, account} = this.props;

        return (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{bottom: 'never'}}>
                <StatusBar light />
                <FlatListView
                    {...this.props}
                    requestHost={RouteConfig.record.list}
                    select={[
                        'id',
                        'business',
                        'content',
                        'add_time',
                        'type',
                        'status',
                    ]}
                    where={[
                        "action = 'delivery'",
                        "type = 'job'",
                        "business ='" + account.id + "'",
                        "city = '" + city + "'",
                    ]}
                    order={['add_time DESC nulls last']}
                    renderItem={this._renderItem}
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
        params: state.system.params,
        city: state.system.area.city,
    };
}

export default connect(mapStateToProps)(Default);
