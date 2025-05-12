import React from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-navigation';
import Swipeout from 'react-native-swipeout';
import {connect} from 'react-redux';
import FlatListView from '../../components/FlatListView';
import StatusBar from '../../components/StatusBar';
import RouteConfig from '../../config/route';
import Divide from '../../components/Divide';
import {update} from '../../actions/job';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: (
                <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('JobAdd')}>
                    <View
                        style={[
                            Style.column,
                            Style.row_center,
                            Style.column_center,
                        ]}>
                        <MaterialCommunityIcons
                            name="plus"
                            style={[Style.f_size_20, Style.f_color_3]}
                        />
                        <Text
                            style={[
                                Style.f_color_6,
                                Style.f_size_10,
                                Style.f_weight_400,
                            ]}>
                            {I18n.t('module.job.add_new')}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            ),
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
                            name="arrow-left"
                            style={[Style.f_size_22, Style.f_color_4]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
            headerRight: (
                <View
                    style={[
                        Style.p_r_3,
                        Style.row_center,
                        Style.column_center,
                    ]}>
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_color_3,
                            Style.f_weight_500,
                        ]}>
                        {I18n.t('common.swipe') + ' ' + I18n.t('common.edit')}
                    </Text>
                </View>
            ),
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            scrollEnabled: true,
        };
    }

    _updateStatus = data => {
        const {navigation} = this.props;

        update(data).then(response => {
            const {status} = response;

            if (status === 1) {
                Common.showToast({
                    message: (
                        <MaterialCommunityIcons
                            name="check"
                            style={[Style.f_size_30, Style.f_color_15]}
                        />
                    ),
                    style: {
                        ...Style.bg_color_green,
                    },
                    op: {
                        onHidden: () => navigation.navigate('AccountTab'),
                    },
                });
            } else {
                Common.showToast({
                    message: (
                        <MaterialCommunityIcons
                            name="close"
                            style={[Style.f_size_30, Style.f_color_15]}
                        />
                    ),
                    style: {
                        ...Style.bg_color_green,
                    },
                    op: {
                        onHidden: () => navigation.navigate('AccountTab'),
                    },
                });
            }
        });
    };

    _renderItem = ({item}) => {
        const {navigation} = this.props;

        const status =
            item.status !== undefined && parseInt(item.status) > 0 ? 1 : 0;

        return (
            <Swipeout
                autoClose={true}
                backgroundColor={Style.bg_color_15.backgroundColor}
                onOpen={() => {
                    this.setState({scrollEnabled: false});
                }}
                onClose={() => {
                    this.setState({scrollEnabled: true});
                }}
                left={[
                    {
                        backgroundColor: Style.bg_color_gray.backgroundColor,
                        component: (
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    this._updateStatus({
                                        id: item.id,
                                        status: status === 0 ? 1 : 0,
                                        update_time: new Date().getTime(),
                                    })
                                }>
                                <View
                                    style={[
                                        Style.flex,
                                        Style.column,
                                        Style.row_center,
                                        Style.column_center,
                                    ]}>
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            status === 0
                                                ? Style.f_color_wechat
                                                : Style.f_color_google,
                                            Style.f_bold,
                                        ]}>
                                        {status === 0
                                            ? I18n.t('common.online')
                                            : I18n.t('common.offline')}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        ),
                    },
                ]}
                right={[
                    {
                        backgroundColor: Style.bg_color_gray.backgroundColor,
                        component: (
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    navigation.navigate('JobEdit', {
                                        data: item,
                                    })
                                }>
                                <View
                                    style={[
                                        Style.flex,
                                        Style.column,
                                        Style.row_center,
                                        Style.column_center,
                                    ]}>
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_color_5,
                                            Style.f_bold,
                                        ]}>
                                        {I18n.t('common.edit')}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        ),
                    },
                ]}
                sensitivity={2}>
                <View style={[Style.row_center, Style.p_h_3, Style.p_v_4]}>
                    <Text
                        numberOfLines={2}
                        style={[
                            Style.f_size_15,
                            Style.f_color_3,
                            Style.f_bold,
                        ]}>
                        {item.title}
                    </Text>
                </View>
            </Swipeout>
        );
    };

    render() {
        const {scrollEnabled} = this.state;
        const {account} = this.props;

        return (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{vertical: 'never'}}>
                <StatusBar light />
                <FlatListView
                    {...this.props}
                    requestHost={RouteConfig.job.list}
                    where={["business = '" + account.id + "'"]}
                    order={['update_time DESC nulls last']}
                    renderItem={this._renderItem}
                    renderSeparator={() => {
                        return (
                            <Divide
                                style={{
                                    ...Style.h_1,
                                    ...Style.bg_color_14,
                                }}
                            />
                        );
                    }}
                    scrollEnabled={scrollEnabled}
                />
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        account: state.account,
        system: state.system,
    };
}

export default connect(mapStateToProps)(Default);
