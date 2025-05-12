import React from 'react';
import {
    View,
    Text,
    StatusBar,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';

import {HIDE_STATUS, TRANSLUCENT_STATUS, Common} from '../../utils/lib';

import {info} from '../../actions/business';

import FlatListView from '../../components/FlatListView';
import Divide from '../../components/Divide';
import Avator from '../../components/Avator';

import RouteConfig from '../../config/route';
import LikeCell from '../../cells/like';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {user} = navigation.state.params;

        return {
            headerTitle: (
                <View style={[Style.v_center]}>
                    <Avator user={user} size={30} />
                    {user.intro && (
                        <Text
                            numberOfLines={1}
                            style={[
                                {
                                    marginBottom: 3,
                                },
                                Style.f_size_10,
                                Style.f_color_5,
                                Style.f_regular,
                            ]}>
                            {user.intro}
                        </Text>
                    )}
                </View>
            ),
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
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            user: {},
            tabNow: 0,
            follower: 0,
            following: 0,
            likes: 0,
        };
    }

    componentDidMount() {
        this._loadUser();
    }

    _loadUser() {
        const {user, tabName} = this.props.navigation.state.params;

        info({
            where: ["id = '" + user.id + "'"],
        }).then(response => {
            const {status, message} = response;

            if (parseInt(status) === 1) {
                this.setState({
                    tabNow:
                        tabName === 'following'
                            ? 1
                            : tabName === 'likes'
                            ? 2
                            : 0,
                    user: message,
                    follower: message.follower || 0,
                    following: message.following || 0,
                    likes: message.likes || 0,
                    loading: false,
                });
            } else {
                this.setState({
                    loading: false,
                });
            }
        });
    }

    render() {
        const {loading, user, tabNow, follower, following, likes} = this.state;

        const Tab = ({tab, page, isTabActive, onPressHandler, onTabLayout}) => {
            const {label} = tab;
            const style = {};
            const containerStyle = [
                Style.row,
                Style.column_center,
                Style.row_center,
                Style.p_h_4,
                Style.p_v_3,
                {
                    borderBottomWidth: 2,
                    borderColor: isTabActive
                        ? Style.bg_color_cityseeker.backgroundColor
                        : Style.bg_color_15.backgroundColor,
                },
            ];
            const textStyle = [
                Style.f_size_13,
                Style.f_weight_600,
                isTabActive ? Style.f_color_3 : Style.f_color_9,
            ];

            return (
                <TouchableWithoutFeedback
                    style={style}
                    onPress={onPressHandler}
                    onLayout={onTabLayout}
                    key={page}>
                    <View style={containerStyle}>
                        <Text style={textStyle}>{label}</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        };

        return loading === true ? (
            <ActivityIndicator />
        ) : (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{vertical: 'never'}}>
                <StatusBar
                    hidden={HIDE_STATUS}
                    barStyle="dark-content"
                    translucent={TRANSLUCENT_STATUS}
                />
                <ScrollableTabView
                    scrollWithoutAnimation={true}
                    tabBarPosition="top"
                    initialPage={tabNow}
                    page={tabNow}
                    onChangeTab={tab => {
                        const {i} = tab;

                        this.setState({
                            tabNow: i,
                        });
                    }}
                    renderTabBar={tabBar => (
                        <TabBar
                            tabMargin={0}
                            tabBarTextStyle={{
                                ...Style.f_color_cityseeker,
                                ...Style.f_size_15,
                            }}
                            tabStyles={{
                                tab: {},
                                badgeBubble: {},
                                badgeText: {},
                            }}
                            underlineColor={
                                Style.bg_color_cityseeker.backgroundColor
                            }
                            underlineHeight={0}
                            underlineBottomPosition={0}
                            tabBarStyle={[
                                Style.m_t_0,
                                Style.column_center,
                                Style.b_b,
                            ]}
                            renderTab={(
                                tab,
                                page,
                                isTabActive,
                                onPressHandler,
                                onTabLayout,
                            ) => (
                                <Tab
                                    key={page}
                                    tab={tab}
                                    page={page}
                                    isTabActive={isTabActive}
                                    onPressHandler={onPressHandler}
                                    onTabLayout={onTabLayout}
                                />
                            )}
                        />
                    )}>
                    <View
                        style={[Style.flex]}
                        tabLabel={{
                            label:
                                Common.customNumber(follower) +
                                ' ' +
                                I18n.t('common.follower'),
                        }}>
                        <FlatListView
                            {...this.props}
                            {...this.state}
                            requestHost={RouteConfig.record.list}
                            select={[
                                'id',
                                'business',
                                'content',
                                'type',
                                'add_time',
                            ]}
                            where={[
                                "content ='" + user.id + "'",
                                "action = 'following'",
                                "type = 'business'",
                            ]}
                            order={['add_time DESC nulls last']}
                            cellType="like"
                            renderSeparator={() => {
                                return <Divide />;
                            }}
                        />
                    </View>
                    <View
                        style={[Style.flex]}
                        tabLabel={{
                            label:
                                Common.customNumber(following) +
                                ' ' +
                                I18n.t('common.following'),
                        }}>
                        <FlatListView
                            {...this.props}
                            {...this.state}
                            requestHost={RouteConfig.record.list}
                            select={[
                                'id',
                                'business',
                                'content',
                                'type',
                                'add_time',
                            ]}
                            where={[
                                "business ='" + user.id + "'",
                                "action = 'following'",
                                "type = 'business'",
                            ]}
                            order={['add_time DESC nulls last']}
                            cellType="like"
                            renderItem={({item}) => {
                                return (
                                    <LikeCell
                                        data={{
                                            business: item.content,
                                            add_time: item.add_time,
                                        }}
                                        {...this.props}
                                    />
                                );
                            }}
                            renderSeparator={() => {
                                return <Divide />;
                            }}
                        />
                    </View>
                    <View
                        style={[Style.flex]}
                        tabLabel={{
                            label:
                                Common.customNumber(likes) +
                                ' ' +
                                (parseInt(user.condition) === 1
                                    ? I18n.t('common.checkin')
                                    : I18n.t('common.likes')),
                        }}>
                        <FlatListView
                            {...this.props}
                            {...this.state}
                            requestHost={RouteConfig.record.list}
                            select={['id', 'business', 'add_time']}
                            where={[
                                "content ='" + user.id + "'",
                                "action = 'likes'",
                                "type = 'business'",
                            ]}
                            order={['add_time DESC nulls last']}
                            cellType="like"
                            renderSeparator={() => {
                                return <Divide />;
                            }}
                        />
                    </View>
                </ScrollableTabView>
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
