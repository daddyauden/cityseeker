import React from 'react';
import {View, Text, Alert, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {SafeAreaView} from 'react-navigation';
import TabBar from 'react-native-underline-tabbar';
import Animated from 'react-native-reanimated';
import UUID from 'react-native-uuid';

import LoadingIndicator from '../../components/LoadingIndicator';
import ComplainLink from '../../components/ComplainLink';
import FlatListView from '../../components/FlatListView';
import StatusBar from '../../components/StatusBar';
import {add, remove} from '../../actions/record';
import Divide from '../../components/Divide';
import RouteConfig from '../../config/route';
import FeedCell from '../../cells/feed_cell';
import {info} from '../../actions/feed';
import FeedType from '../../type/feed';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

const HEADER_HEIGHT = 40;
const SPACE = 10;

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {data} = navigation.state.params;

        return {
            title: I18n.t('detail'),
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <View
                        style={[
                            Style.p_l_3,
                            Style.row_center,
                            Style.column_center,
                        ]}>
                        <MaterialCommunityIcons
                            name="arrow-left"
                            style={[Style.f_size_20, Style.f_color_3]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
            headerRight: (
                <ComplainLink
                    params={{
                        type: 'feed',
                        data: {...data},
                    }}
                />
            ),
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            data: [],
            comments: 0,
            commentsReload: false,
            commentsLatest: false,
            likes: 0,
            likesReload: false,
            likesLatest: false,
            reposts: 0,
            repostsReload: false,
            repostsLatest: false,
            headerHeight: 0,
            tabNow: 0,
        };
    }

    componentDidMount() {
        this._requestData();
    }

    _requestData = () => {
        const {data} = this.props.navigation.state.params;

        setTimeout(() => {
            info({
                where: ["id = '" + data.id + "'"],
            }).then(response => {
                const {status, message} = response;

                if (parseInt(status) === 1) {
                    this.setState({
                        loading: false,
                        data: message,
                        likes: message.likes,
                        comments: message.comments,
                        reposts: message.reposts,
                    });
                }
            });
        }, 500);
    };

    checkLogin = () => {
        const {account} = this.props;

        if (account.isLoggedIn === false) {
            Common.showToast({
                message: (
                    <Text style={[Style.f_size_13, Style.f_weight_500]}>
                        {I18n.t('common.nosignin')}
                    </Text>
                ),
                style: {
                    ...Style.bg_color_cityseeker,
                },
                op: {
                    onHidden: () => {
                        Alert.alert(I18n.t('common.nosignin'), '', [
                            {
                                text: I18n.t('Cancel'),
                                style: 'cancel',
                            },
                            {
                                text: I18n.t('common.signin'),
                                style: 'destructive',
                                onPress: () =>
                                    this.props.navigation.navigate('Signin'),
                            },
                        ]);
                    },
                },
            });

            return false;
        } else {
            return true;
        }
    };

    recordOp = (op, feed) => {
        const {account, system} = this.props;
        const {lat, lng, area} = system;

        const {country, city} = area;

        const {likes, comments, reposts} = this.state;

        if (this.checkLogin() === true) {
            if (op === 'add') {
                let data = {
                    id: UUID.v4()
                        .toUpperCase()
                        .replace(/-/g, ''),
                    business: account.id,
                    lat: lat,
                    lng: lng,
                    country: country,
                    city: city,
                    type: feed.type,
                    action: feed.action,
                    content: feed.content,
                };

                this.props.dispatch(add(data));
                this.setState({
                    [feed.action.toLowerCase()]:
                        (feed.action.toLowerCase() === 'likes'
                            ? likes
                            : feed.action.toLowerCase() === 'comments'
                            ? comments
                            : reposts) + 1,
                });
            } else if (op === 'remove') {
                const data = {
                    business: account.id,
                    type: feed.type,
                    action: feed.action,
                    content: feed.content,
                };

                this.props.dispatch(remove(data));
                this.setState({
                    [feed.action.toLowerCase()]:
                        (feed.action.toLowerCase() === 'likes'
                            ? likes
                            : feed.action.toLowerCase() === 'comments'
                            ? comments
                            : reposts) - 1,
                });
            }

            if (feed.action.toLowerCase() === 'comments') {
                this.setState({
                    tabNow: 0,
                    commentsLatest: true,
                });
            } else if (feed.action.toLowerCase() === 'reposts') {
                this.setState({
                    tabNow: 1,
                    repostsLatest: true,
                });
            } else if (feed.action.toLowerCase() === 'likes') {
                this.setState({
                    tabNow: 2,
                    likesReload: true,
                });
            }
        }
    };

    latestListView = listViewToken => {
        if (listViewToken === 'comments') {
            this.setState({
                commentsLatest: false,
            });
        } else if (listViewToken === 'reposts') {
            this.setState({
                repostsLatest: false,
            });
        } else if (listViewToken === 'likes') {
            this.setState({
                likesLatest: false,
            });
        }
    };

    reloadListView = listViewToken => {
        if (listViewToken === 'comments') {
            this.setState({
                commentsReload: false,
            });
        } else if (listViewToken === 'reposts') {
            this.setState({
                repostsReload: false,
            });
        } else if (listViewToken === 'likes') {
            this.setState({
                likesReload: false,
            });
        }
    };

    showFeed = data => {
        const {navigation} = this.props;

        navigation.navigate({
            routeName: 'FeedInfo',
            params: {
                data: data,
            },
            key: data.id,
        });
    };

    showRepost = (feed, feedType, pickerType, mediaType) => {
        const {navigation} = this.props;

        if (this.checkLogin(feed) === true) {
            navigation.navigate({
                routeName: 'post_feed',
                params: {
                    data: feed,
                    feedType: feedType,
                    pickerType: pickerType,
                    mediaType: mediaType,
                },
            });
        }
    };

    showComment = (feed, commentType, pickerType, mediaType) => {
        const {navigation} = this.props;

        if (this.checkLogin(feed) === true) {
            navigation.navigate({
                routeName: 'post_comment',
                params: {
                    data: feed,
                    commentType: commentType,
                    pickerType: pickerType,
                    mediaType: mediaType,
                },
            });
        }
    };

    _renderHeader = () => {
        const {data, headerHeight} = this.state;
        const {account, system} = this.props;

        return (
            <View
                onLayout={event => {
                    const {height} = event.nativeEvent.layout;

                    if (headerHeight === height) {
                        return;
                    }

                    this.setState({
                        headerHeight: height,
                    });
                }}
                style={[Style.theme_content]}>
                <View style={[Style.column]}>
                    {data.type === FeedType.repost && data.content ? (
                        <View style={[Style.column]}>
                            <FeedCell
                                data={data}
                                account={account}
                                system={system}
                                showRecordNum={true}
                                recordOp={this.recordOp}
                                showFeed={this.showFeed}
                                showRepost={this.showRepost}
                                showComment={this.showComment}
                            />
                            {!data.title && !data.images && (
                                <View
                                    style={[
                                        Style.row,
                                        {
                                            paddingHorizontal: SPACE,
                                            paddingBottom: SPACE,
                                        },
                                    ]}>
                                    <Text>
                                        {I18n.t('common.reposts.comment')}
                                    </Text>
                                </View>
                            )}
                            <View style={[Style.theme_footer]}>
                                <FeedCell
                                    data={data.content}
                                    account={account}
                                    system={system}
                                    isRepost={true}
                                    showRecordNum={true}
                                    recordOp={this.recordOp}
                                    showFeed={this.showFeed}
                                    showRepost={this.showRepost}
                                    showComment={this.showComment}
                                />
                            </View>
                        </View>
                    ) : (
                        <View>
                            <FeedCell
                                {...this.props}
                                showRecordNum={true}
                                data={data}
                                recordOp={this.recordOp}
                                showFeed={this.showFeed}
                                showRepost={this.showRepost}
                                showComment={this.showComment}
                            />
                        </View>
                    )}
                </View>
                <Divide
                    style={{
                        ...Style.p_b_2,
                        ...Style.h_0,
                        ...Style.bg_color_14,
                    }}
                />
            </View>
        );
    };

    render() {
        const {data, loading, commentsLatest, repostsLatest} = this.state;

        const feed = data.type === FeedType.repost ? data.content : data;

        const Tab = ({tab, page, isTabActive, onPressHandler, onTabLayout}) => {
            const {label} = tab;
            const style = {};
            const containerStyle = [
                Style.row,
                Style.column_center,
                Style.row_center,
                Style.p_h_3,
                {
                    height: HEADER_HEIGHT - 1,
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
            <View style={[Style.flex, Style.row_center, Style.column_center]}>
                <LoadingIndicator />
            </View>
        ) : (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{
                    bottom: 'never',
                }}>
                <StatusBar light />
                <Animated.ScrollView
                    automaticallyAdjustContentInsets={true}
                    showsVerticalScrollIndicator={false}>
                    {this._renderHeader()}
                    <ScrollableTabView
                        tabBarPosition="top"
                        initialPage={0}
                        page={this.state.tabNow}
                        onChangeTab={tab => {
                            const {i} = tab;

                            this.setState({
                                tabNow: i,
                            });
                        }}
                        renderTabBar={tabBar => {
                            return (
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
                                        Style.row_center,
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
                            );
                        }}>
                        <View
                            style={[Style.flex]}
                            tabLabel={{
                                label: I18n.t('common.comments'),
                            }}>
                            <FlatListView
                                {...this.props}
                                cellType="comment"
                                requestHost={RouteConfig.comment.list}
                                select={[
                                    'id',
                                    'business',
                                    'title',
                                    'type',
                                    'images',
                                    'add_time',
                                ]}
                                where={[
                                    "content ='" + feed.id + "'",
                                    "type = 'feed'",
                                ]}
                                order={['add_time DESC nulls last']}
                                renderSeparator={() => {
                                    return <Divide />;
                                }}
                                renderEmptyList={() => {
                                    return null;
                                }}
                                latestListView={
                                    commentsLatest ? this.latestListView : null
                                }
                                listViewToken="comments"
                            />
                        </View>
                        <View
                            style={[Style.flex]}
                            tabLabel={{
                                label: I18n.t('common.reposts'),
                            }}>
                            <FlatListView
                                {...this.props}
                                cellType="repost"
                                requestHost={RouteConfig.feed.list}
                                select={[
                                    'id',
                                    'business',
                                    'title',
                                    'images',
                                    'add_time',
                                ]}
                                where={[
                                    "content ='" + feed.id + "'",
                                    "type = 'repost'",
                                ]}
                                order={['add_time DESC nulls last']}
                                renderSeparator={() => {
                                    return <Divide />;
                                }}
                                renderEmptyList={() => {
                                    return null;
                                }}
                                latestListView={
                                    repostsLatest ? this.latestListView : null
                                }
                                listViewToken="reposts"
                            />
                        </View>
                        <View
                            style={[Style.flex]}
                            tabLabel={{
                                label: I18n.t('common.likes'),
                            }}>
                            <FlatListView
                                {...this.props}
                                cellType="like"
                                requestHost={RouteConfig.record.list}
                                select={['id', 'business', 'add_time']}
                                where={[
                                    "content ='" + feed.id + "'",
                                    "action = 'likes'",
                                    "type = 'feed'",
                                ]}
                                order={['add_time DESC nulls last']}
                                renderSeparator={() => {
                                    return <Divide />;
                                }}
                                renderEmptyList={() => {
                                    return null;
                                }}
                                reloadListView={
                                    this.state.likesReload
                                        ? this.reloadListView
                                        : null
                                }
                                listViewToken="likes"
                            />
                        </View>
                    </ScrollableTabView>
                </Animated.ScrollView>
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
