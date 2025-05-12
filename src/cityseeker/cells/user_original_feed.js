import React from 'react';
import {
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
    ImageBackground,
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

import AlbumModal from '../components/AlbumModal';
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

class User_original_feed extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAlbumModal: false,
            imageIndex: 0,
        };
    }

    componentDidMount() {
        const {data, navigation} = this.props;

        this.setState({
            reposts: data.reposts || 0,
            likes: data.likes || 0,
            comments: data.comments || 0,
        });

        navigation.addListener('didFocus', () => {
            this.forceUpdate();
        });
    }

    get isLiked() {
        return (async () => {
            const {id} = this.props.data;

            const {isLoggedIn} = this.props.account;

            if (isLoggedIn) {
                let isLiked = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'feed'),
                        Q.where('action', 'likes'),
                        Q.where('content', id.toLowerCase()),
                    )
                    .fetchCount();

                return isLiked > 0;
            }

            return false;
        })();
    }

    get isReposted() {
        return (async () => {
            const {id} = this.props.data;

            const {isLoggedIn} = this.props.account;

            if (isLoggedIn) {
                let isReposted = await database.active.collections
                    .get('record')
                    .query(
                        Q.where('type', 'feed'),
                        Q.where('action', 'reposts'),
                        Q.where('content', id.toLowerCase()),
                    )
                    .fetchCount();

                return isReposted > 0;
            }

            return false;
        })();
    }

    _hideAlbumModal = () => {
        this.setState({
            showAlbumModal: false,
        });
    };

    _showAlbumModal = index => {
        this.setState({
            imageIndex: index,
            showAlbumModal: true,
        });
    };

    renderHeader = () => {
        const {data, showWeb} = this.props;

        const {business, type, title, content, add_time} = data;

        const feed_business = business ? (
            <View style={[Style.row, Style.column_center, Style.row_start]}>
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
            <View style={[Style.column]}>
                {feed_business}
                {feed_title}
            </View>
        );
    };

    renderContent = () => {
        const {data, showFeed} = this.props;

        const {type, content} = data;

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
                        onLinkPress={() => showFeed(data)}
                    />
                </View>
            ) : null;
        }

        return feed_content ? (
            <View style={{marginTop: SPACE}}>{feed_content}</View>
        ) : null;
    };

    renderMedia = () => {
        const {imageIndex, showAlbumModal} = this.state;
        const {images} = this.props.data;

        const feed_images =
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

        return feed_images ? (
            <View
                style={[
                    {
                        marginTop: SPACE,
                    },
                    Style.row,
                    Style.wrap,
                ]}>
                {feed_images}
                <AlbumModal
                    index={imageIndex}
                    data={images}
                    visible={showAlbumModal}
                    onCancel={this._hideAlbumModal}
                />
            </View>
        ) : null;
    };

    renderOperation = () => {
        const {
            data,
            account,
            showRecordNum,
            recordOp,
            showRepost,
            showComment,
        } = this.props;

        const {business, views} = data;

        const {reposts, likes, comments} = this.state;

        const showOperation =
            business && business.id === account.id ? false : true;

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
                            : () => showRepost(data, 'repost', 'album', 'photo')
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
                    onPress={() => showComment(data, 'feed', 'album', 'photo')}>
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
                                content: data.id,
                            });

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

        return (
            <TouchableWithoutFeedback onPress={() => showFeed(data)}>
                <View
                    style={[
                        Style.column,
                        {
                            padding: SPACE,
                        },
                    ]}>
                    {this.renderHeader()}
                    {this.renderContent()}
                    {this.renderMedia()}
                    {this.renderOperation()}
                    {this.renderNearbyBusiness()}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default User_original_feed;
