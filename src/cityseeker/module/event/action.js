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
import {info} from '../../actions/events';
import FlatListView from '../../components/FlatListView';
import CommentModal from '../../components/CommentModal';
import Divide from '../../components/Divide';
import RouteConfig from '../../config/route';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        const title = navigation.getParam('title', '');

        return {
            headerTitle: (
                <View
                    style={[Style.row, Style.row_center, Style.column_center]}>
                    <Text
                        numberOfLines={1}
                        style={[
                            Style.f_size_13,
                            Style.f_color_4,
                            Style.f_weight_500,
                            Style.f_fa_pf,
                        ]}>
                        {title}
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
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            tabNow: 0,
            data: {},
            id: props.navigation.state.params.id,
            comments: 0,
            showCommentModal: false,
            commentsReload: false,
            commentsLatest: false,
            going: 0,
            goingReload: false,
            goingLatest: false,
            likes: 0,
            likesReload: false,
            likesLatest: false,
        };
    }

    componentDidMount() {
        this._requestData();
    }

    _requestData() {
        const {id, tabName} = this.props.navigation.state.params;

        setTimeout(() => {
            info({
                where: ["id = '" + id + "'"],
            }).then(response => {
                const {status, message} = response;

                if (parseInt(status) === 1) {
                    this.props.navigation.setParams({
                        title: message.title || '',
                    });

                    this.setState({
                        tabNow:
                            tabName === 'likes'
                                ? 1
                                : tabName === 'comments'
                                ? 2
                                : 0,
                        data: message,
                        comments: message.comments || 0,
                        going: message.going || 0,
                        likes: message.likes || 0,
                        loading: false,
                    });
                }
            });
        }, 200);
    }

    _showCommentModal = () => {
        this.setState({
            showCommentModal: true,
        });
    };

    _hideCommentModal = status => {
        const {comments} = this.state;

        if (status) {
            this.setState({
                showCommentModal: false,
                commentsLatest: true,
                comments: comments + 1,
            });
        } else {
            this.setState({
                showCommentModal: false,
                commentsLatest: false,
            });
        }
    };

    _latestListView = listViewToken => {
        if (listViewToken === 'comments') {
            this.setState({
                commentsLatest: false,
            });
        } else if (listViewToken === 'likes') {
            this.setState({
                likesLatest: false,
            });
        } else if (listViewToken === 'going') {
            this.setState({
                goingLatest: false,
            });
        }
    };

    _reloadListView = listViewToken => {
        if (listViewToken === 'comments') {
            this.setState({
                commentsReload: false,
            });
        } else if (listViewToken === 'likes') {
            this.setState({
                likesReload: false,
            });
        } else if (listViewToken === 'going') {
            this.setState({
                goingReload: false,
            });
        }
    };

    render() {
        const {
            loading,
            tabNow,
            data,
            id,
            comments,
            going,
            likes,
            showCommentModal,
            commentsLatest,
            goingReload,
            likesReload,
        } = this.state;

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
                                Common.customNumber(going) +
                                ' ' +
                                I18n.t('events.going'),
                        }}>
                        <FlatListView
                            {...this.props}
                            cellType="like"
                            requestHost={RouteConfig.record.list}
                            select={['id', 'business', 'add_time']}
                            where={[
                                "content ='" + id + "'",
                                "action = 'going'",
                                "type = 'events'",
                            ]}
                            order={['add_time DESC nulls last']}
                            renderSeparator={() => {
                                return <Divide />;
                            }}
                            renderEmptyList={() => {
                                return null;
                            }}
                            reloadListView={
                                goingReload ? this._reloadListView : null
                            }
                            listViewToken="going"
                        />
                    </View>
                    <View
                        style={[Style.flex]}
                        tabLabel={{
                            label:
                                Common.customNumber(likes) +
                                ' ' +
                                I18n.t('events.likes'),
                        }}>
                        <FlatListView
                            {...this.props}
                            cellType="like"
                            requestHost={RouteConfig.record.list}
                            select={['id', 'business', 'add_time']}
                            where={[
                                "content ='" + id + "'",
                                "action = 'likes'",
                                "type = 'events'",
                            ]}
                            order={['add_time DESC nulls last']}
                            renderSeparator={() => {
                                return <Divide />;
                            }}
                            renderEmptyList={() => {
                                return null;
                            }}
                            reloadListView={
                                likesReload ? this._reloadListView : null
                            }
                            listViewToken="likes"
                        />
                    </View>
                    <View
                        style={[Style.flex]}
                        tabLabel={{
                            label:
                                Common.customNumber(comments) +
                                ' ' +
                                I18n.t('common.comments'),
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
                            where={["content ='" + id + "'", "type = 'events'"]}
                            order={['add_time DESC nulls last']}
                            renderSeparator={() => {
                                return <Divide />;
                            }}
                            renderEmptyList={() => {
                                return null;
                            }}
                            renderHeader={() => (
                                <TouchableWithoutFeedback
                                    onPress={this._showCommentModal}>
                                    <View
                                        style={[
                                            Style.p_v_2,
                                            Style.p_h_3,
                                            Style.theme_header,
                                        ]}>
                                        <View
                                            style={[
                                                Style.column,
                                                Style.border_round_2,
                                                Style.bg_color_15,
                                                Style.p_v_2,
                                                Style.p_h_3,
                                            ]}>
                                            <Text
                                                style={[
                                                    Style.f_size_11,
                                                    Style.f_color_6,
                                                    Style.f_fa_pf,
                                                    Style.f_weight_500,
                                                ]}>
                                                {I18n.t('common.post') +
                                                    ' ' +
                                                    I18n.t('common.comments')}
                                            </Text>
                                        </View>
                                        <CommentModal
                                            system={this.props.system}
                                            account={this.props.account}
                                            data={data}
                                            commentType="events"
                                            pickerType="album"
                                            mediaType="photo"
                                            visible={showCommentModal}
                                            onDismiss={this._hideCommentModal}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            )}
                            stickyHeaderIndices={[0]}
                            latestListView={
                                commentsLatest ? this._latestListView : null
                            }
                            listViewToken="comments"
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
