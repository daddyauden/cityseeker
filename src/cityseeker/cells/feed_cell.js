import React from 'react';
import {
    Text,
    View,
    Image,
    Dimensions,
    ImageBackground,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {WebView} from 'react-native-webview';
import HTMLView from 'react-native-htmlview';
import {Header} from 'react-navigation';
import Video from 'react-native-video';

import {Q} from '@nozbe/watermelondb';

import database from '../lib/database';

import Navigation from '../lib/navigation';

import ActionSheet from '../components/ActionSheet';
import AlbumModal from '../components/AlbumModal';
import WebModal from '../components/WebModal';
import TimeAgo from '../components/TimeAgo';
import Avator from '../components/Avator';

import {Common} from '../utils/lib';
import FeedType from '../type/feed';
import I18n from '../locale';
import Style from '../style';

const WIDTH = Dimensions.get('window').width;
const SPACE = 10;
const M_IMG_WIDTH = (WIDTH - SPACE * 2) / 3;
const S_IMG_HEIGHT = WIDTH / 2;
const VIDEO_WIDTH = WIDTH - SPACE * 2;
const VIDEO_HEIGHT = S_IMG_HEIGHT + 10;
const AVATOR_WIDTH = 50;
const CONTENT_SHOW_MAX = 200;

class Default extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            webVisible: false,
            webUrl: '',
            albumModalVisible: false,
            imageIndex: 0,
            likes: props.data.likes || 0,
        };
    }

    _showWeb = url => {
        this.setState({
            webUrl: url,
            webVisible: true,
        });
    };

    _hideWeb = () => {
        this.setState({
            webVisible: false,
        });
    };

    _hideAlbumModal = () => {
        this.setState({
            albumModalVisible: false,
        });
    };

    _showAlbumModal = index => {
        this.setState({
            imageIndex: index,
            albumModalVisible: true,
        });
    };

    get isLiked() {
        return (async () => {
            const data = this.props.data;

            const {isLoggedIn} = this.props.account;

            if (isLoggedIn && data.id !== undefined) {
                let isLiked = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'feed'),
                        Q.where('action', 'likes'),
                        Q.where('content', data.id.toLowerCase()),
                    )
                    .fetchCount();

                return isLiked > 0;
            }

            return false;
        })();
    }

    get isReposted() {
        return (async () => {
            const data = this.props.data;

            const {isLoggedIn} = this.props.account;

            if (isLoggedIn && data.id !== undefined) {
                let isReposted = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'feed'),
                        Q.where('action', 'reposts'),
                        Q.where('content', data.id.toLowerCase()),
                    )
                    .fetchCount();

                return isReposted > 0;
            }

            return false;
        })();
    }

    get isFollowing() {
        return (async () => {
            const data = this.props.data;

            const {isLoggedIn} = this.props.account;

            if (
                isLoggedIn &&
                data.business !== undefined &&
                data.business.id !== undefined
            ) {
                let isFollowing = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'business'),
                        Q.where('action', 'following'),
                        Q.where('content', data.business.id.toLowerCase()),
                    )
                    .fetchCount();

                return isFollowing > 0;
            }

            return false;
        })();
    }

    get isBlock() {
        return (async () => {
            const data = this.props.data;

            const {isLoggedIn} = this.props.account;

            if (
                isLoggedIn &&
                data.business !== undefined &&
                data.business.id !== undefined
            ) {
                let isBlock = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'business'),
                        Q.where('action', 'block'),
                        Q.where('content', data.business.id.toLowerCase()),
                    )
                    .fetchCount();

                return isBlock > 0;
            }

            return false;
        })();
    }

    renderHeader = () => {
        const {
            isRepost,
            data,
            account,
            system,
            recordOp,
            showFeed,
        } = this.props;

        const {business, type, title, content, add_time} = data;

        let isFollowing = this.isFollowing;

        let isBlock = this.isBlock;

        const isLoggedIn = account.isLoggedIn;

        const feed_business =
            business && isRepost !== true ? (
                <View style={[Style.row, Style.column_start, Style.row_start]}>
                    <Avator user={business} size={AVATOR_WIDTH} />
                    <View style={[Style.flex, Style.column, Style.m_l_2]}>
                        {business.name && (
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_weight_500,
                                ]}
                                numberOfLines={1}>
                                {business.name}
                            </Text>
                        )}
                        {business.intro && (
                            <Text
                                numberOfLines={1}
                                style={[
                                    {
                                        marginTop: SPACE / 2,
                                    },
                                    Style.f_size_10,
                                    Style.f_color_5,
                                    Style.f_weight_400,
                                ]}>
                                {business.intro}
                            </Text>
                        )}
                        {add_time && (
                            <TimeAgo
                                date={add_time}
                                live={false}
                                containerStyle={{
                                    marginTop: SPACE / 2,
                                }}
                                textStyle={[Style.f_size_10, Style.f_color_10]}
                                system={system}
                            />
                        )}
                    </View>
                    <ActionSheet
                        options={[
                            business.id !== account.id && (
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_3,
                                        Style.f_fa_pf,
                                        Style.f_weight_400,
                                    ]}>
                                    {isFollowing
                                        ? I18n.t('common.unfollow')
                                        : I18n.t('common.follow')}
                                    {business.name && ' ' + business.name}
                                </Text>
                            ),
                            business.id !== account.id && (
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_3,
                                        Style.f_fa_pf,
                                        Style.f_weight_400,
                                    ]}>
                                    {isBlock
                                        ? I18n.t('common.unblock')
                                        : I18n.t('common.block')}
                                    {business.name && ' ' + business.name}
                                </Text>
                            ),
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_fa_pf,
                                    Style.f_weight_400,
                                ]}>
                                {I18n.t('module.complain')}
                            </Text>,
                        ]}
                        actions={index => {
                            const {data} = this.props;

                            if (index === 1 && business.id !== account.id) {
                                if (isFollowing) {
                                    recordOp('remove', {
                                        type: 'business',
                                        action: 'following',
                                        content: business.id,
                                    });
                                } else {
                                    recordOp('add', {
                                        type: 'business',
                                        action: 'following',
                                        content: business.id,
                                    });
                                }

                                isLoggedIn &&
                                    Common.showToast({
                                        message: (
                                            <MaterialCommunityIcons
                                                name="check"
                                                style={[
                                                    Style.f_size_30,
                                                    Style.f_color_15,
                                                ]}
                                            />
                                        ),
                                        style: {
                                            ...Style.bg_color_green,
                                        },
                                        op: {
                                            onHidden: () => this.forceUpdate(),
                                        },
                                    });
                            } else if (
                                index === 2 &&
                                business.id !== account.id
                            ) {
                                if (isBlock) {
                                    recordOp('remove', {
                                        type: 'business',
                                        action: 'block',
                                        content: business.id,
                                    });
                                } else {
                                    recordOp('add', {
                                        type: 'business',
                                        action: 'block',
                                        content: business.id,
                                    });
                                }

                                isLoggedIn &&
                                    Common.showToast({
                                        message: (
                                            <MaterialCommunityIcons
                                                name="check"
                                                style={[
                                                    Style.f_size_30,
                                                    Style.f_color_15,
                                                ]}
                                            />
                                        ),
                                        style: {
                                            ...Style.bg_color_green,
                                        },
                                        op: {
                                            onHidden: () => this.forceUpdate(),
                                        },
                                    });
                            } else if (index === 3) {
                                Navigation.navigate('ComplainInfo', {
                                    type: 'feed',
                                    data: data,
                                });
                            }
                        }}>
                        <View style={[Style.p_r_1]}>
                            <MaterialCommunityIcons
                                name={'chevron-down'}
                                style={[Style.f_size_20, Style.f_color_3]}
                            />
                        </View>
                    </ActionSheet>
                </View>
            ) : null;

        const feed_link =
            type === FeedType.link && content ? (
                <Icon
                    onPress={() => this._showWeb(content)}
                    name="external-link-square-alt"
                    style={[
                        Style.f_size_13,
                        Style.f_color_facebook,
                        Style.m_l_1,
                    ]}
                />
            ) : null;

        const feed_title =
            title && isRepost !== true ? (
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        {
                            marginTop: SPACE,
                        },
                    ]}>
                    <Text
                        style={[
                            Style.f_fa_pf,
                            Style.f_size_13,
                            Style.f_color_3,
                            Style.f_weight_400,
                        ]}>
                        {title}
                        {'  '}
                        {feed_link}
                    </Text>
                </View>
            ) : null;

        const feed_header = isRepost ? (
            <View style={[Style.column]}>
                <View style={[Style.row, Style.column_start, Style.row_start]}>
                    <Avator user={business} size={AVATOR_WIDTH - 10} />
                    <View style={[Style.flex, Style.column, Style.m_l_2]}>
                        {business.name && (
                            <Text
                                style={[
                                    Style.f_fa_pf,
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_weight_500,
                                ]}
                                numberOfLines={1}>
                                {business.name}
                            </Text>
                        )}
                        {business.intro && (
                            <Text
                                numberOfLines={1}
                                style={[
                                    {
                                        marginTop: SPACE / 2,
                                    },
                                    Style.f_fa_pf,
                                    Style.f_size_10,
                                    Style.f_color_5,
                                    Style.f_weight_400,
                                ]}>
                                {business.intro}
                            </Text>
                        )}
                        {add_time && (
                            <TimeAgo
                                date={add_time}
                                live={false}
                                containerStyle={{
                                    marginTop: SPACE / 2,
                                }}
                                textStyle={[Style.f_size_10, Style.f_color_10]}
                                system={system}
                            />
                        )}
                    </View>
                </View>
                {title && (
                    <Text
                        style={[
                            Style.f_fa_pf,
                            Style.f_color_3,
                            Style.f_size_13,
                            Style.f_weight_400,
                            Style.m_t_1,
                        ]}>
                        {title} {feed_link}
                    </Text>
                )}
            </View>
        ) : (
            <View style={[Style.column]}>
                {feed_business}
                {feed_title}
            </View>
        );

        return (
            <TouchableWithoutFeedback
                onPress={() =>
                    type !== FeedType.video ? showFeed(data) : null
                }>
                {feed_header}
            </TouchableWithoutFeedback>
        );
    };

    renderContent = () => {
        const {data, showFeed} = this.props;

        const {type, content} = data;

        let feed_content = null;

        if (type === FeedType.video) {
            feed_content =
                content && content.indexOf('.mp4') !== -1 ? (
                    <Video
                        style={{
                            width: VIDEO_WIDTH,
                            height: VIDEO_HEIGHT,
                        }}
                        source={{uri: content}}
                        controls={true}
                        muted={false}
                        paused={true}
                        pictureInPicture={false}
                        playInBackground={false}
                        playWhenInactive={false}
                        allowsExternalPlayback={false}
                        fullscreenAutorotate={true}
                        fullscreenOrientation="all"
                        hideShutterView={true}
                        posterResizeMode="cover"
                        repeat={false}
                        resizeMode="cover"
                    />
                ) : content ? (
                    <WebView
                        style={{
                            width: VIDEO_WIDTH,
                            height: VIDEO_HEIGHT,
                        }}
                        source={{uri: content}}
                        injectedJavaScript={`
                          let video = document.getElementsByTagName("video")[0];
                          if(video) {
                            video.removeAttribute("autoplay");
                            video.setAttribute("controls", "controls");
                            video.setAttribute("preload", "auto");
                            video.pause();
                          }
                          true;
                        `}
                        javaScriptEnabled={true}
                        originWhitelist={['*']}
                        useWebKit={true}
                        bounces={true}
                        scrollEnabled={false}
                        pagingEnabled={false}
                        automaticallyAdjustContentInsets={true}
                        dataDetectorTypes="all"
                        allowsInlineMediaPlayback={true}
                        hideKeyboardAccessoryView={true}
                        allowsLinkPreview={true}
                        mediaPlaybackRequiresUserAction={true}
                    />
                ) : null;
        } else if (type === FeedType.article) {
            feed_content = content ? (
                <View style={[Style.row, Style.column_center]}>
                    <HTMLView
                        stylesheet={{
                            a: {
                                fontWeight: Style.f_weight_400.fontWeight,
                                color: Style.f_color_cityseeker.color,
                            },
                            span: {
                                fontWeight: Style.f_weight_400.fontWeight,
                                color: Style.f_color_cityseeker.color,
                            },
                            p: {
                                lineHeight: Style.l_h_4.lineHeight,
                                fontWeight: Style.f_weight_400.fontWeight,
                            },
                            div: {
                                lineHeight: Style.l_h_5.lineHeight,
                                fontSize: Style.f_size_14.fontSize,
                                fontWeight: Style.f_weight_400.fontWeight,
                            },
                        }}
                        addLineBreaks={false}
                        value={
                            '<div>' +
                            (content.length > CONTENT_SHOW_MAX
                                ? content.substr(0, CONTENT_SHOW_MAX) +
                                  '... <a>' +
                                  I18n.t('common.more') +
                                  '</a>'
                                : content) +
                            '</div>'
                        }
                        onLinkPress={() => showFeed(data)}
                    />
                </View>
            ) : null;
        }

        return <View style={{marginTop: SPACE}}>{feed_content}</View>;
    };

    renderMedia = () => {
        const {images} = this.props.data;

        const feed_media =
            images && images.length > 1 ? (
                images.map((image, index) => {
                    return (
                        <TouchableWithoutFeedback
                            key={index}
                            onPress={() => this._showAlbumModal(index)}>
                            <View
                                style={[
                                    {
                                        width: M_IMG_WIDTH,
                                        height: M_IMG_WIDTH,
                                        padding: SPACE / 10,
                                    },
                                ]}>
                                <Image
                                    style={[
                                        Style.w_p100,
                                        Style.h_p100,
                                        Style.img_cover,
                                    ]}
                                    source={{
                                        uri: Common.load_image(image),
                                    }}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })
            ) : images && images.length === 1 ? (
                <TouchableWithoutFeedback
                    onPress={() => this._showAlbumModal(0)}>
                    <View
                        style={{
                            width: Style.w_p70.width,
                            height: S_IMG_HEIGHT,
                            padding: SPACE / 10,
                        }}>
                        <Image
                            style={[
                                Style.w_p100,
                                Style.h_p100,
                                Style.img_cover,
                            ]}
                            source={{
                                uri: Common.load_image(images[0]),
                            }}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ) : null;

        return feed_media ? (
            <View
                style={[
                    {
                        marginTop: SPACE,
                    },
                    Style.row,
                    Style.wrap,
                ]}>
                {feed_media}
                <AlbumModal
                    index={this.state.imageIndex}
                    data={images}
                    visible={this.state.albumModalVisible}
                    onCancel={this._hideAlbumModal}
                />
            </View>
        ) : null;
    };

    renderOperation = () => {
        const {
            account,
            data,
            showRecordNum,
            recordOp,
            showRepost,
            showComment,
        } = this.props;

        const {business, type, views, reposts, comments} = data;

        const {likes} = this.state;

        let isLiked = this.isLiked;

        let isReposted = this.isReposted;

        const isLoggedIn = account.isLoggedIn;

        let showOperation = !(
            (business && business.id === account.id) ||
            type === FeedType.repost
        );

        const feed_operation =
            showOperation === true ? (
                <View
                    style={[
                        Style.row,
                        Style.row_between,
                        Style.column_center,
                        {
                            marginTop: SPACE,
                        },
                    ]}>
                    <TouchableWithoutFeedback
                        onPress={
                            isReposted
                                ? () => {
                                      Common.showToast({
                                          message: (
                                              <Text
                                                  style={[
                                                      Style.f_size_13,
                                                      Style.f_weight_500,
                                                  ]}>
                                                  {I18n.t('common.repeat') +
                                                      ' ' +
                                                      I18n.t('common.reposts')}
                                              </Text>
                                          ),
                                          style: {
                                              ...Style.bg_color_cityseeker,
                                          },
                                          config: {
                                              position: Common.isIphoneX()
                                                  ? Header.HEIGHT + 24
                                                  : Header.HEIGHT,
                                          },
                                      });
                                  }
                                : () =>
                                      showRepost(
                                          data,
                                          'repost',
                                          'album',
                                          'photo',
                                      )
                        }>
                        <View
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                            ]}>
                            <MaterialCommunityIcons
                                name="repeat"
                                style={[
                                    Style.f_size_16,
                                    isReposted
                                        ? Style.f_color_cityseeker
                                        : Style.f_color_6,
                                ]}
                            />
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_6,
                                    Style.m_l_1,
                                ]}>
                                {reposts > 0 && showRecordNum === true
                                    ? Common.customNumber(reposts)
                                    : I18n.t('common.reposts')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() =>
                            showComment(data, 'feed', 'album', 'photo')
                        }>
                        <View
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                            ]}>
                            <MaterialCommunityIcons
                                name="comment-outline"
                                style={[Style.f_size_16, Style.f_color_6]}
                            />
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_6,
                                    Style.m_l_1,
                                ]}>
                                {comments > 0 && showRecordNum === true
                                    ? Common.customNumber(comments)
                                    : I18n.t('common.comments')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (isLiked) {
                                recordOp('remove', {
                                    type: 'feed',
                                    action: 'likes',
                                    content: data.id,
                                });

                                isLoggedIn &&
                                    setTimeout(() => {
                                        this.setState({
                                            likes: likes - 1,
                                        });
                                    }, 500);
                            } else {
                                recordOp('add', {
                                    type: 'feed',
                                    action: 'likes',
                                    content: data.id,
                                });

                                isLoggedIn &&
                                    setTimeout(() => {
                                        this.setState({
                                            likes: likes + 1,
                                        });
                                    }, 500);
                            }
                        }}>
                        <View
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                            ]}>
                            <MaterialCommunityIcons
                                name={isLiked ? 'thumb-up' : 'thumb-up-outline'}
                                style={[
                                    Style.f_size_16,
                                    isLiked
                                        ? Style.f_color_cityseeker
                                        : Style.f_color_6,
                                ]}
                            />
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_6,
                                    Style.m_l_1,
                                ]}>
                                {likes > 0 && showRecordNum === true
                                    ? Common.customNumber(likes)
                                    : I18n.t('common.likes')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View
                        style={[
                            Style.row,
                            Style.row_center,
                            Style.column_center,
                        ]}>
                        <MaterialCommunityIcons
                            name="eye-settings"
                            style={[Style.f_size_16, Style.f_color_6]}
                        />
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_6,
                                Style.m_l_1,
                            ]}>
                            {views > 0
                                ? Common.customNumber(views)
                                : I18n.t('common.views')}
                        </Text>
                    </View>
                </View>
            ) : null;

        return feed_operation;
    };

    renderNearbyBusiness = () => {
        const {type, nearby} = this.props.data;

        const feed_nearbyBusiness = nearby !== undefined &&
            nearby &&
            Object.keys(nearby).length > 0 && (
                <TouchableWithoutFeedback
                    onPress={() =>
                        Navigation.navigate(
                            'BusinessInfo',
                            {business: nearby},
                            nearby.id,
                        )
                    }>
                    <View
                        style={[
                            Style.row,
                            Style.column_center,
                            {
                                marginTop: SPACE,
                            },
                        ]}>
                        <ImageBackground
                            source={require('../../common/assets/images/map-icon.jpg')}
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.overflow_hidden,
                                Style.border_round_left_1,
                                {
                                    width: 30,
                                    height: '100%',
                                },
                            ]}>
                            <Icon
                                name="map-marker-alt"
                                style={[Style.f_color_cityseeker, Style.f_size_17]}
                            />
                        </ImageBackground>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.bg_color_gray,
                                Style.overflow_hidden,
                                Style.border_round_right_1,
                                Style.p_r_2,
                            ]}>
                            <View
                                style={[
                                    Style.column,
                                    Style.column_start,
                                    Style.p_l_2,
                                    {
                                        paddingVertical: 2,
                                    },
                                ]}>
                                <View style={[Style.row, Style.column_center]}>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            Style.f_color_0,
                                            Style.f_size_13,
                                            Style.f_weight_400,
                                        ]}>
                                        {nearby.name}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            Style.f_color_3,
                                            Style.f_size_10,
                                            Style.f_weight_400,
                                            Style.m_l_2,
                                        ]}>
                                        {I18n.t('type.' + nearby.type)}
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        Style.row,
                                        Style.column_center,
                                        {
                                            marginTop: 2,
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            Style.f_color_5,
                                            Style.f_size_10,
                                            Style.f_weight_400,
                                        ]}>
                                        {I18n.t(nearby.city)}
                                    </Text>
                                    <Text
                                        style={[
                                            Style.f_color_5,
                                            Style.f_size_10,
                                            Style.f_weight_400,
                                        ]}>
                                        {' ⋅ ' +
                                            I18n.t(
                                                nearby.country.toUpperCase(),
                                            )}
                                    </Text>
                                </View>
                            </View>
                            <Icon
                                name="caret-right"
                                style={[
                                    Style.f_color_5,
                                    Style.f_size_13,
                                    Style.m_l_3,
                                ]}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );

        return type !== FeedType.repost ? feed_nearbyBusiness : null;
    };

    render() {
        const {data, showFeed} = this.props;

        const {type} = data;

        return (
            <TouchableWithoutFeedback
                onPress={() =>
                    type !== FeedType.video ? showFeed(data) : null
                }>
                <View style={{padding: SPACE}}>
                    {this.renderHeader()}
                    {this.renderContent()}
                    {this.renderMedia()}
                    {this.renderOperation()}
                    {this.renderNearbyBusiness()}
                    {this.state.webVisible && (
                        <WebModal
                            url={this.state.webUrl}
                            visible={this.state.webVisible}
                            onDismiss={this._hideWeb}
                        />
                    )}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default Default;
