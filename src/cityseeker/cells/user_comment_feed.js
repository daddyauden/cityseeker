import React from 'react';
import {
    Text,
    View,
    Image,
    Dimensions,
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

import AlbumModal from '../components/AlbumModal';
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
const COMMENT_M_IMAGE_WIDTH = (WIDTH - SPACE * 2 - AVATOR_WIDTH - 10) / 3;

class User_comment_feed extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showFeedAlbumModal: false,
            feedImageIndex: 0,
            showCommentAlbumModal: false,
            commentImageIndex: 0,
        };
    }

    componentDidMount() {
        const {data, navigation} = this.props;

        this.setState({
            reposts:
                data.content !== undefined && data.content.reposts !== undefined
                    ? data.content.reposts
                    : 0,
            likes:
                data.content !== undefined && data.content.likes !== undefined
                    ? data.content.likes
                    : 0,
            comments:
                data.content !== undefined &&
                data.content.comments !== undefined
                    ? data.content.comments
                    : 0,
        });

        navigation.addListener('didFocus', () => {
            this.forceUpdate();
        });
    }

    get isLiked() {
        return (async () => {
            const data = this.props.data;

            const {isLoggedIn} = this.props.account;

            if (
                isLoggedIn &&
                data.content !== undefined &&
                data.content.id !== undefined
            ) {
                let isLiked = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'feed'),
                        Q.where('action', 'likes'),
                        Q.where('content', data.content.id.toLowerCase()),
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

            if (
                isLoggedIn &&
                data.content !== undefined &&
                data.content.id !== undefined
            ) {
                let isReposted = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'feed'),
                        Q.where('action', 'reposts'),
                        Q.where('content', data.content.id.toLowerCase()),
                    )
                    .fetchCount();

                return isReposted > 0;
            }

            return false;
        })();
    }

    _hideFeedAlbumModal = () => {
        this.setState({
            showFeedAlbumModal: false,
        });
    };

    _showFeedAlbumModal = index => {
        this.setState({
            showFeedAlbumModal: true,
            feedImageIndex: index,
        });
    };

    _hideCommentAlbumModal = () => {
        this.setState({
            showCommentAlbumModal: false,
        });
    };

    _showCommentAlbumModal = index => {
        this.setState({
            showCommentAlbumModal: true,
            commentImageIndex: index,
        });
    };

    renderHeader = () => {
        const {data, showWeb} = this.props;

        const {business, type, title, content, add_time} =
            data.content !== undefined
                ? data.content
                : {
                      business: null,
                      type: null,
                      title: null,
                      content: null,
                      add_time: null,
                  };

        const feed_business = business ? (
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
                        <Text
                            style={[
                                {
                                    marginTop: SPACE / 3,
                                },
                                Style.f_size_10,
                                Style.f_color_10,
                            ]}>
                            {Common.datetime(add_time)}
                        </Text>
                    )}
                </View>
            </View>
        ) : null;

        const feed_link =
            type === FeedType.link && content ? (
                <Icon
                    onPress={() => showWeb(content)}
                    name="external-link-square-alt"
                    style={[
                        Style.f_size_13,
                        Style.f_color_facebook,
                        Style.m_l_1,
                    ]}
                />
            ) : null;

        const feed_title = title ? (
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

        return (
            <View>
                {feed_business}
                {feed_title}
            </View>
        );
    };

    renderContent = () => {
        const {data, showFeed} = this.props;

        const {type, content} =
            data.content !== undefined
                ? data.content
                : {
                      type: null,
                      content: null,
                  };

        let feed_content = null;

        if (type === FeedType.video) {
            feed_content =
                content &&
                content.substr(content.lastIndexOf('.') + 1, 3) === 'mp4' ? (
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
                                lineHeight: Style.l_h_4.lineHeight,
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
                        onLinkPress={() => showFeed(data.content)}
                    />
                </View>
            ) : null;
        }

        return feed_content ? (
            <View style={{marginTop: SPACE}}>{feed_content}</View>
        ) : null;
    };

    renderMedia = () => {
        const {data} = this.props;

        const {images} =
            data.content !== undefined
                ? data.content
                : {
                      images: null,
                  };

        const feed_media =
            images && images.length > 1 ? (
                images.map((image, index) => {
                    return (
                        <TouchableWithoutFeedback
                            key={index}
                            onPress={() => this._showFeedAlbumModal(index)}>
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
                    onPress={() => this._showFeedAlbumModal(0)}>
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
                    index={this.state.feedImageIndex}
                    data={images}
                    visible={this.state.showFeedAlbumModal}
                    onCancel={this._hideFeedAlbumModal}
                />
            </View>
        ) : null;
    };

    renderOperation = () => {
        const {reposts, likes, comments} = this.state;

        const {
            data,
            account,
            showRecordNum,
            recordOp,
            showRepost,
            showComment,
        } = this.props;

        const {business, views} =
            data.content !== undefined
                ? data.content
                : {
                      business: undefined,
                      views: 0,
                  };

        let showOperation =
            business !== undefined && business.id === account.id ? false : true;

        let isLiked = this.isLiked;

        let isReposted = this.isReposted;

        return showOperation === true ? (
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
                                          ...Style.p_3,
                                      },
                                      op: {
                                          onHidden: () => {},
                                      },
                                      config: {
                                          duration: 2000,
                                          position: Common.isIphoneX()
                                              ? Header.HEIGHT + 25
                                              : Header.HEIGHT,
                                      },
                                  });
                              }
                            : () =>
                                  showRepost(
                                      data.content,
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
                                ? reposts
                                : I18n.t('common.reposts')}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() =>
                        data.content !== undefined
                            ? showComment(
                                  data.content,
                                  'feed',
                                  'album',
                                  'photo',
                              )
                            : {}
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
                                ? comments
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
                                content: data.content,
                            });

                            isLoggedIn &&
                                this.setState({
                                    likes: likes - 1,
                                });
                        } else {
                            recordOp('add', {
                                type: 'feed',
                                action: 'likes',
                                content: data.content,
                            });

                            isLoggedIn &&
                                this.setState({
                                    likes: likes + 1,
                                });
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
                                ? likes
                                : I18n.t('common.likes')}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <View
                    style={[Style.row, Style.row_center, Style.column_center]}>
                    <MaterialCommunityIcons
                        name="eye-settings"
                        style={[Style.f_size_16, Style.f_color_6]}
                    />
                    <Text
                        style={[Style.f_size_13, Style.f_color_6, Style.m_l_1]}>
                        {views > 0 ? views : I18n.t('common.views')}
                    </Text>
                </View>
            </View>
        ) : null;
    };

    renderIntro = () => {
        const {data, user} = this.props;

        const {commentImageIndex, showCommentAlbumModal} = this.state;

        const {add_time} =
            data !== undefined
                ? data
                : {
                      add_time: null,
                  };

        const c_business = user.name ? (
            <Text
                numberOfLines={1}
                style={[Style.f_size_13, Style.f_color_3, Style.f_weight_500]}>
                {user.name}
            </Text>
        ) : null;

        const c_intro = user.intro && (
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
                {user.intro}
            </Text>
        );

        const c_title = data.title && (
            <Text
                style={[
                    Style.f_size_13,
                    Style.f_color_3,
                    Style.f_weight_400,
                    Style.m_t_1,
                ]}>
                {data.title}
            </Text>
        );

        const c_images =
            data.images && data.images.length > 1 ? (
                data.images.map((image, index) => {
                    return (
                        <TouchableWithoutFeedback
                            key={index}
                            onPress={() => this._showCommentAlbumModal(index)}>
                            <View
                                style={[
                                    {
                                        width: COMMENT_M_IMAGE_WIDTH,
                                        height: COMMENT_M_IMAGE_WIDTH,
                                        padding: SPACE / 4,
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
            ) : data.images && data.images.length === 1 ? (
                <TouchableWithoutFeedback
                    onPress={() => this._showCommentAlbumModal(0)}>
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
                                uri: Common.load_image(data.images[0]),
                            }}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ) : null;

        const c_add_time = add_time ? (
            <TimeAgo
                date={add_time}
                live={false}
                containerStyle={{
                    marginTop: SPACE / 2,
                }}
                textStyle={[Style.f_size_10, Style.f_color_10]}
                system={this.props.system}
            />
        ) : null;

        return c_title || c_images ? (
            <View
                style={[
                    Style.row,
                    Style.row_start,
                    Style.column_start,
                    Style.theme_footer,
                    {
                        paddingLeft: SPACE,
                        paddingTop: SPACE,
                        marginTop: SPACE,
                    },
                ]}>
                <Avator user={user} size={AVATOR_WIDTH - 10} />
                <View
                    style={[
                        Style.flex,
                        Style.column,
                        Style.column_start,
                        Style.b_b,
                        {
                            marginLeft: SPACE,
                            paddingBottom: SPACE,
                        },
                    ]}>
                    {c_business}
                    {c_intro}
                    {c_title}
                    {c_images && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.wrap,
                                {
                                    marginTop: SPACE / 2,
                                },
                            ]}>
                            {c_images}
                            <AlbumModal
                                index={commentImageIndex}
                                data={data.images}
                                visible={showCommentAlbumModal}
                                onCancel={this._hideCommentAlbumModal}
                            />
                        </View>
                    )}
                    {c_add_time}
                </View>
            </View>
        ) : null;
    };

    render() {
        const {data, showFeed} = this.props;

        return (
            <TouchableWithoutFeedback
                onPress={
                    data.content !== undefined
                        ? () => showFeed(data.content)
                        : () => {}
                }>
                <View
                    style={[
                        Style.column,
                        Style.theme_content,
                        {
                            padding: SPACE,
                        },
                    ]}>
                    {this.renderHeader()}
                    {this.renderContent()}
                    {this.renderMedia()}
                    {this.renderIntro()}
                    {this.renderOperation()}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default User_comment_feed;
