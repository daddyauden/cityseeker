import React from 'react';
import {
    View,
    Text,
    Image,
    Platform,
    TextInput,
    Dimensions,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import {AirbnbRating} from 'react-native-ratings';
import UUID from 'react-native-uuid';
import CommentConfig from '../config/comment';
import CommentType from '../type/comment';
import {Common, scrollProps} from '../utils/lib';
import {add} from '../actions/comment';
import Avator from './Avator';
import Style from '../style';
import I18n from '../locale';
import Modal from './Modal';

let LOCAL_IMAGES = {};
let UPLOAD_IMAGES = {};
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const SPACE = 10;
const IMG_WIDTH = (WIDTH - SPACE * 6) / 3;
const AVATOR_SIZE = 30;

class CommentModal extends React.Component {
    constructor(props) {
        super(props);

        const {data, commentType, pickerType, mediaType} = props;

        let type;

        if (commentType.toLowerCase() === CommentType.feed) {
            type = 'feed';
        } else if (commentType.toLowerCase() === CommentType.business) {
            type = 'business';
        } else if (commentType.toLowerCase() === CommentType.item) {
            type = 'item';
        } else if (commentType.toLowerCase() === CommentType.comment) {
            type = 'comment';
        } else if (commentType.toLowerCase() === CommentType.events) {
            type = 'events';
        }

        this.state = {
            toolboxHeight: 0,
            toolboxNotice: '',
            titleHeight: 45,
            titleLength: CommentConfig.titleLength,
            pickerType: pickerType || 'album',
            mediaType: mediaType || 'photo',
            data: data,
            title: '',
            type: type,
            localImages: {},
            uploadImages: {},
            rightBtn: null,
            rating: 2,
        };
    }

    componentDidMount() {
        this.setState({
            rightBtn: (
                <View style={[Style.p_r_3, Style.column, Style.column_center]}>
                    <Text
                        style={[
                            Style.f_color_10,
                            Style.b,
                            Style.p_h_2,
                            Style.p_v_1,
                            Style.border_round_1,
                        ]}>
                        {I18n.t('common.send')}
                    </Text>
                </View>
            ),
        });
    }

    componentWillUnmount() {
        LOCAL_IMAGES = {};
        UPLOAD_IMAGES = {};
    }

    _openAlbumPicker = mediaType => {
        const {upload_images} = this.props.system.params;
        const {localImages} = this.state;

        let options =
            Platform.OS === 'ios'
                ? {
                      smartAlbums:
                          mediaType === 'photo'
                              ? ['UserLibrary']
                              : ['Videos', 'SlomoVideos'],
                      includeBase64: true,
                      mediaType: mediaType,
                      multiple: true,
                      waitAnimationEnd: true,
                      avoidEmptySpaceAroundImage: true,
                      compressImageQuality: 0.3,
                      loadingLabelText: '',
                      maxFiles:
                          (upload_images !== undefined
                              ? parseInt(upload_images)
                              : 9) -
                          Object.keys(localImages).length -
                          3,
                      showsSelectedCount: true,
                      forceJpg: true,
                  }
                : {
                      includeBase64: true,
                      mediaType: mediaType,
                      multiple: true,
                      avoidEmptySpaceAroundImage: true,
                      compressImageQuality: 0.3,
                      hideBottomControls: false,
                      enableRotationGesture: true,
                      showCropFrame: true,
                      showCropGuidelines: true,
                  };

        ImagePicker.openPicker(options)
            .then(images => {
                images.map((image, key) => {
                    let identifier = image.modificationDate + image.size;

                    LOCAL_IMAGES[identifier] = image.path;

                    UPLOAD_IMAGES[identifier] = {
                        base64: image.data,
                        mime: image.mime,
                    };
                });

                this.setState({
                    localImages: LOCAL_IMAGES,
                    uploadImages: UPLOAD_IMAGES,
                });
            })
            .catch(error => {});

        ImagePicker.clean();
    };

    _removeAlbumImage = fileIdentifier => {
        delete LOCAL_IMAGES[fileIdentifier];
        delete UPLOAD_IMAGES[fileIdentifier];

        this.setState({
            localImages: LOCAL_IMAGES,
            uploadImages: UPLOAD_IMAGES,
        });
    };

    _onSubmit = () => {
        const {title} = this.state;

        let hasError = false;

        if (!title) {
            hasError = true;
        }

        if (hasError === false) {
            this.setState({
                rightBtn: (
                    <TouchableWithoutFeedback
                        onPress={this._postRequest.bind(this)}>
                        <View
                            style={[
                                Style.p_r_3,
                                Style.column,
                                Style.column_center,
                            ]}>
                            <Text
                                style={[
                                    Style.b_cityseeker,
                                    Style.border_round_1,
                                    Style.p_h_2,
                                    Style.p_v_1,
                                    Style.bg_color_cityseeker,
                                    Style.f_color_15,
                                    Style.overflow_hidden,
                                ]}>
                                {I18n.t('common.send')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                ),
            });
        } else {
            this.setState({
                rightBtn: (
                    <View
                        style={[
                            Style.p_r_3,
                            Style.column,
                            Style.column_center,
                        ]}>
                        <Text
                            style={[
                                Style.f_color_10,
                                Style.b,
                                Style.p_h_2,
                                Style.p_v_1,
                                Style.border_round_1,
                            ]}>
                            {I18n.t('common.send')}
                        </Text>
                    </View>
                ),
            });
        }
    };

    _postRequest = () => {
        const {type, data, title, uploadImages, rating} = this.state;
        const {system, account, onDismiss} = this.props;
        const {area, lat, lng} = system;

        const {country, city} = area;

        this.setState({
            rightBtn: (
                <View style={[Style.p_r_3, Style.column, Style.column_center]}>
                    <Text
                        style={[
                            Style.f_color_10,
                            Style.b,
                            Style.p_h_2,
                            Style.p_v_1,
                            Style.border_round_1,
                        ]}>
                        {I18n.t('common.send') + '...'}
                    </Text>
                </View>
            ),
        });

        let medias = [];

        let comment = {};

        if (account.isLoggedIn === false) {
            Common.showToast({
                message: (
                    <Text style={[Style.f_size_13, Style.f_weight_500]}>
                        {I18n.t('common.nosignin')}
                    </Text>
                ),
                style: {
                    ...Style.bg_color_cityseeker,
                    ...Style.p_3,
                },
                op: {
                    onHidden: () => onDismiss,
                },
            });
        } else {
            comment['id'] = UUID.v4()
                .toUpperCase()
                .replace(/-/g, '');
            comment['business'] = account.id;
            comment['type'] = type;
            comment['title'] = title;
            comment['content'] = data.id;

            if (country) {
                comment['country'] = country;
            }

            if (city) {
                comment['city'] = city;
            }

            if (lat) {
                comment['lat'] = lat;
            }

            if (lng) {
                comment['lng'] = lng;
            }

            Object.keys(uploadImages).map(name => {
                if (uploadImages[name]) {
                    medias.push(uploadImages[name]);
                }
            });

            comment['medias'] = medias;

            if (rating !== null) {
                comment['score'] = rating;
            }

            add(comment)
                .then(response => {
                    const {status} = response;

                    if (parseInt(status) === 1) {
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
                                onHidden: () => {
                                    UPLOAD_IMAGES = {};
                                    LOCAL_IMAGES = {};
                                    this.setState(
                                        {
                                            localImages: {},
                                            uploadImages: {},
                                        },
                                        () => onDismiss(true),
                                    );
                                },
                            },
                        });
                    } else {
                        this._postError();
                    }
                })
                .catch(error => {
                    this._postError();
                });
        }
    };

    _postError = () => {
        Common.showToast({
            message: (
                <MaterialCommunityIcons
                    name="close"
                    style={[Style.f_size_30, Style.f_color_15]}
                />
            ),
            style: {
                ...Style.bg_color_cityseeker,
                ...Style.p_3,
            },
            op: {
                onHidden: onDismiss,
            },
        });
    };

    _renderHeader = () => {
        const {onDismiss} = this.props;

        const {rightBtn, data} = this.state;

        return (
            <View
                style={[
                    Style.row,
                    Style.row_between,
                    Style.column_center,
                    Style.theme_content,
                    Style.border_round_top_2,
                    Style.shadow_all,
                    Style.b_b,
                    {
                        height: SPACE * 5,
                    },
                ]}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        onDismiss();
                    }}>
                    <View style={Style.m_l_3}>
                        <Text style={[Style.f_size_15, Style.f_color_3]}>
                            {I18n.t('common.cancel')}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <Avator user={data} size={AVATOR_SIZE} />
                {rightBtn}
            </View>
        );
    };

    _renderRating = () => {
        const {rating} = this.state;

        const reviews = [
            I18n.t('rating.bad'),
            I18n.t('rating.ok'),
            I18n.t('rating.good'),
            I18n.t('rating.amazing'),
            I18n.t('rating.unbelievable'),
        ];

        render = (
            <View
                style={[
                    Style.row,
                    Style.row_start,
                    Style.column_center,
                    Style.p_b_2,
                ]}>
                <AirbnbRating
                    count={5}
                    reviews={reviews}
                    defaultRating={rating}
                    size={23}
                    onFinishRating={rating => this.setState({rating})}
                    selectedColor={Style.f_color_cityseeker.color}
                    isDisabled={false}
                />
            </View>
        );

        return render;
    };

    _renderContent = () => {
        const {showRating} = this.props;
        const {title, titleHeight, titleLength, localImages} = this.state;

        let imgs = [];

        for (let fileIdentifier in localImages) {
            imgs.push(
                <View
                    key={fileIdentifier}
                    style={[
                        {
                            width: IMG_WIDTH,
                            height: IMG_WIDTH,
                            marginRight: SPACE,
                        },
                        Style.row,
                        Style.row_center,
                        Style.column_center,
                        Style.border_round_1,
                        Style.overflow_hidden,
                    ]}>
                    <Image
                        style={[Style.w_p100, Style.h_p100, Style.img_cover]}
                        source={{uri: localImages[fileIdentifier]}}
                    />
                    <TouchableWithoutFeedback
                        onPress={this._removeAlbumImage.bind(
                            this,
                            fileIdentifier,
                        )}>
                        <View
                            style={[
                                Style.row_center,
                                Style.column_center,
                                Style.top_left,
                                Style.bg_color_15_transparent_3,
                                {
                                    width: IMG_WIDTH,
                                    height: IMG_WIDTH,
                                },
                            ]}>
                            <MaterialCommunityIcons
                                name="minus"
                                style={[Style.f_color_cityseeker, Style.f_size_40]}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>,
            );
        }

        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'always'}
                keyboardDismissMode={'interactive'}
                innerRef={ref => {
                    this.keyboard = ref;
                }}
                onKeyboardWillShow={frames => {
                    const {screenY} = frames.endCoordinates;
                    this.setState({
                        toolboxHeight: HEIGHT - screenY,
                    });
                }}
                onKeyboardWillHide={frames => {
                    const {screenY} = frames.endCoordinates;
                    this.setState({
                        toolboxHeight: HEIGHT - screenY,
                    });
                }}
                style={{
                    paddingHorizontal: SPACE * 2,
                    paddingVertical: SPACE,
                }}>
                {showRating === true && this._renderRating()}
                <TextInput
                    textAlignVertical="top"
                    disableFullscreenUI={true}
                    blurOnSubmit={false}
                    maxLength={titleLength}
                    multiline={true}
                    placeholder={I18n.t('common.comments')}
                    placeholderTextColor={Style.f_color_8.color}
                    style={[
                        Style.f_size_13,
                        Style.l_h_4,
                        Style.w_p100,
                        {
                            height: titleHeight,
                        },
                    ]}
                    editable={true}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    autoFocus={true}
                    spellCheck={false}
                    keyboardType={'default'}
                    onFocus={() => {
                        this.setState(
                            {
                                toolboxNotice:
                                    I18n.t('common.words') +
                                    ' (' +
                                    (titleLength - title.length) +
                                    ')',
                            },
                            () => this._onSubmit(),
                        );
                    }}
                    onChangeText={value => {
                        value = value.replace(/(^\s*)|(\s*$)/g, '');

                        this.setState(
                            {
                                title: value,
                                toolboxNotice:
                                    I18n.t('common.words') +
                                    ' (' +
                                    (titleLength - value.length) +
                                    ')',
                            },
                            () => this._onSubmit(),
                        );
                    }}
                    onContentSizeChange={event => {
                        const {height} = event.nativeEvent.contentSize;

                        if (height > titleHeight) {
                            this.setState({
                                titleHeight: height,
                            });
                        }
                    }}
                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    contentContainerStyle={[
                        Style.row,
                        Style.column_center,
                        Style.m_t_2,
                        Style.m_b_1,
                    ]}>
                    {imgs}
                </ScrollView>
            </KeyboardAwareScrollView>
        );
    };

    _renderFooter = () => {
        const {params} = this.props.system;

        const {mediaType, toolboxNotice, localImages} = this.state;

        return (
            <View
                style={[
                    Style.row,
                    Style.column_center,
                    Style.row_between,
                    Style.b_t,
                    Style.b_b,
                    Style.p_v_2,
                    Style.p_h_4,
                    Style.theme_footer,
                ]}>
                {Object.keys(localImages).length >= 0 &&
                Object.keys(localImages).length <
                    (params.upload_images !== undefined
                        ? parseInt(params.upload_images)
                        : 9) -
                        3 ? (
                    <TouchableWithoutFeedback
                        onPress={this._openAlbumPicker.bind(this, mediaType)}>
                        <MaterialCommunityIcons
                            name="image-plus"
                            style={[Style.f_color_cityseeker, Style.f_size_23]}
                        />
                    </TouchableWithoutFeedback>
                ) : (
                    <MaterialCommunityIcons
                        name="image-off"
                        style={[Style.f_color_6, Style.f_size_23]}
                    />
                )}
                <Text style={[Style.f_color_3, Style.m_l_2]}>
                    {toolboxNotice}
                </Text>
            </View>
        );
    };

    render() {
        return (
            <Modal
                style={{
                    container: {
                        ...Style.column,
                        ...Style.row_end,
                        ...Style.w_100,
                        ...Style.bg_color_0_transparent_5,
                        height: HEIGHT - this.state.toolboxHeight,
                    },
                    content: {
                        ...Style.bg_color_15,
                    },
                }}
                onDismiss={() => {
                    this.props.onDismiss && this.props.onDismiss();
                }}
                transparent={false}
                animationType="fade"
                visible={this.props.visible}
                renderHeader={() => this._renderHeader()}
                renderContent={() => this._renderContent()}
                renderFooter={() => this._renderFooter()}
            />
        );
    }
}

export default CommentModal;
