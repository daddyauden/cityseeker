import React from 'react';
import {View, Text, StatusBar, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import {AirbnbRating} from 'react-native-ratings';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';

import {HIDE_STATUS, TRANSLUCENT_STATUS, Common} from '../../utils/lib';

import {info} from '../../actions/business';

import LoadingIndicator from '../../components/LoadingIndicator';
import FlatListView from '../../components/FlatListView';
import CommentModal from '../../components/CommentModal';
import Divide from '../../components/Divide';
import Avator from '../../components/Avator';

import RouteConfig from '../../config/route';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        const user = navigation.getParam('user', null);

        return {
            headerTitle: user ? (
                <View
                    style={[
                        Style.column,
                        Style.row_center,
                        Style.column_center,
                    ]}>
                    <Avator user={user} size={30} />
                    {user.name && (
                        <Text
                            numberOfLines={1}
                            style={[
                                {
                                    marginBottom: 3,
                                },
                                Style.f_size_10,
                                Style.f_color_5,
                                Style.f_weight_400,
                            ]}>
                            {user.name}
                        </Text>
                    )}
                </View>
            ) : null,
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
            id: props.navigation.state.params.id,
            data: {},
            comments: 0,
            showCommentModal: false,
            commentsReload: false,
            commentsLatest: false,
            likes: 0,
            likesReload: false,
            likesLatest: false,
            items: 0,
            tabNow: 0,
        };
    }

    componentDidMount() {
        this._requestData();
    }

    _requestData() {
        const {id, tabName} = this.props.navigation.state.params;

        setTimeout(() => {
            info({
                where: ["id = '" + id + "'", 'condition = 1'],
            }).then(response => {
                const {status, message} = response;

                this.props.navigation.setParams({
                    user: message || {},
                });

                if (parseInt(status) === 1) {
                    this.setState({
                        tabNow:
                            tabName === 'likes'
                                ? 1
                                : tabName === 'items'
                                ? 2
                                : 0,
                        data: message,
                        loading: false,
                        items: message.items || 0,
                        comments: message.comments || 0,
                        likes: message.likes || 0,
                    });
                } else {
                    this.setState({
                        loading: false,
                    });
                }
            });
        }, 200);
    }

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

    _showCommentModal = () => {
        this.setState({
            showCommentModal: true,
        });
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
        }
    };

    _renderCommentInput = () => {
        const {system, account} = this.props;
        const {data, showCommentModal} = this.state;

        const reviews = [
            I18n.t('rating.bad'),
            I18n.t('rating.ok'),
            I18n.t('rating.good'),
            I18n.t('rating.amazing'),
            I18n.t('rating.unbelievable'),
        ];

        return (
            <TouchableWithoutFeedback onPress={this._showCommentModal}>
                <View style={[Style.p_v_2, Style.p_h_3, Style.theme_footer]}>
                    <View
                        style={[
                            Style.column,
                            Style.border_round_2,
                            Style.bg_color_15,
                            Style.p_v_2,
                            Style.p_h_3,
                        ]}>
                        <View
                            style={[
                                Style.row,
                                Style.row_start,
                                Style.column_center,
                                Style.m_b_1,
                            ]}>
                            <AirbnbRating
                                count={5}
                                reviews={reviews}
                                defaultRating={2}
                                size={13}
                                selectedColor={Style.f_color_google.color}
                                isDisabled={true}
                            />
                        </View>
                        <Text
                            style={[
                                Style.f_size_11,
                                Style.f_color_6,
                                Style.f_fa_pf,
                                Style.f_weight_500,
                            ]}>
                            {I18n.t('common.comments')}
                        </Text>
                    </View>
                    <CommentModal
                        system={system}
                        account={account}
                        data={data}
                        commentType="business"
                        pickerType="album"
                        mediaType="photo"
                        visible={showCommentModal}
                        showRating={true}
                        onDismiss={this._hideCommentModal}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    };

    _renderToolbar = () => {
        return (
            <View
                style={[
                    Style.bottom_horizontal,
                    Style.shadow,
                    Style.theme_footer,
                    {
                        paddingBottom: Common.getBottomSpace(),
                    },
                ]}>
                {this._renderCommentInput()}
            </View>
        );
    };

    render() {
        const {
            loading,
            tabNow,
            id,
            items,
            comments,
            likes,
            commentsLatest,
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
            <View style={[Style.flex, Style.row_center, Style.column_center]}>
                <LoadingIndicator />
            </View>
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
                                'type',
                                'title',
                                'images',
                                'add_time',
                                'score',
                            ]}
                            where={[
                                "content ='" + id + "'",
                                "type = 'business'",
                            ]}
                            order={['add_time DESC nulls last']}
                            latestListView={
                                commentsLatest ? this._latestListView : null
                            }
                            listViewToken="comments"
                            renderSeparator={() => {
                                return (
                                    <Divide
                                        style={{
                                            ...Style.p_b_2,
                                            ...Style.h_0,
                                            ...Style.bg_color_14,
                                        }}
                                    />
                                );
                            }}
                        />
                    </View>
                    {parseInt(likes) > 0 && (
                        <View
                            style={[Style.flex]}
                            tabLabel={{
                                label:
                                    Common.customNumber(likes) +
                                    ' ' +
                                    I18n.t('common.checkin'),
                            }}>
                            <FlatListView
                                {...this.props}
                                cellType="like"
                                requestHost={RouteConfig.record.list}
                                select={[
                                    'id',
                                    'business',
                                    'content',
                                    'type',
                                    'add_time',
                                ]}
                                where={[
                                    "content ='" + id + "'",
                                    "action = 'likes'",
                                    "type = 'business'",
                                ]}
                                order={['add_time DESC nulls last']}
                                renderEmptyList={() => {
                                    return null;
                                }}
                                reloadListView={
                                    likesReload ? this._reloadListView : null
                                }
                                listViewToken="likes"
                                renderSeparator={() => {
                                    return (
                                        <Divide
                                            style={{
                                                ...Style.h_1,
                                            }}
                                        />
                                    );
                                }}
                            />
                        </View>
                    )}
                    {parseInt(items) > 0 && (
                        <View
                            style={[Style.flex]}
                            tabLabel={{
                                label:
                                    Common.customNumber(items) +
                                    ' ' +
                                    I18n.t('app.tab.service'),
                            }}>
                            <FlatListView
                                {...this.props}
                                navigation={this.props.navigation}
                                cellType="item"
                                requestHost={RouteConfig.item.list}
                                where={["business ='" + id + "'", 'status = 1']}
                                order={['add_time DESC nulls last']}
                                renderEmptyList={() => {
                                    return null;
                                }}
                                renderSeparator={() => {
                                    return (
                                        <Divide
                                            style={{
                                                ...Style.p_b_2,
                                                ...Style.h_0,
                                                ...Style.bg_color_14,
                                            }}
                                        />
                                    );
                                }}
                            />
                        </View>
                    )}
                </ScrollableTabView>
                {tabNow === 0 && this._renderToolbar()}
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
