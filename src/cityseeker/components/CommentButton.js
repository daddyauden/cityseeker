import React from 'react';
import {
    View,
    TouchableWithoutFeedback,
    Text,
    ScrollView,
    Dimensions,
    Platform,
    Image,
    TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import {Header} from 'react-navigation';
import UUID from 'react-native-uuid';
import CommentConfig from '../config/comment';
import {Common} from '../utils/lib';
import {add} from '../actions/comment';
import Style from '../style';
import I18n from '../locale';
import Modal from './Modal';

let LOCAL_IMAGES = {};
let UPLOAD_IMAGES = {};

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const SPACE = 10;
const IMG_WIDTH = (WIDTH - SPACE * 6) / 3;

class CommentButton extends React.Component {
    constructor(props) {
        super(props);

        const {data, commentType} = props;

        this.state = {
            data: data,
            visible: false,
            commentType: commentType,
            modalHeight: 0,
            toolboxNotice: '',
            titleLength: CommentConfig.titleLength,
            title: null,
            titleHeight: 130,
            submitButton: null,
            pickerType: 'album',
            mediaType: 'photo',
            localImages: {},
            uploadImages: {},
        };
    }

    componentDidMount() {
        const {navigation} = this.props;

        navigation.addListener('didBlur', () => {
            LOCAL_IMAGES = {};
            UPLOAD_IMAGES = {};

            this.setState({
                data: {},
                localImages: {},
                uploadImages: {},
            });
        });
    }

    componentWillUnmount() {
        LOCAL_IMAGES = {};
        UPLOAD_IMAGES = {};
    }

    _showModal = () => {
        this.setState({
            visible: true,
        });
    };

    _hideModal = () => {
        this.setState({
            visible: false,
        });
    };

    _openCameraPicker = mediaType => {
        const {upload_images} = this.props.system.params;
        const {localImages} = this.state;

        let options =
            Platform.OS === 'ios'
                ? {
                      includeBase64: true,
                      mediaType: mediaType,
                      avoidEmptySpaceAroundImage: true,
                      compressImageQuality: 0.3,
                      loadingLabelText: '',
                      forceJpg: true,
                  }
                : {
                      includeBase64: true,
                      mediaType: mediaType,
                      avoidEmptySpaceAroundImage: true,
                      compressImageQuality: 0.3,
                      hideBottomControls: true,
                      enableRotationGesture: true,
                  };

        if (
            (upload_images !== undefined ? parseInt(upload_images) : 9) -
                Object.keys(localImages).length >
            0
        ) {
            ImagePicker.openCamera(options)
                .then((image, key) => {
                    let identifier = image.modificationDate + image.size;

                    LOCAL_IMAGES[
                        identifier
                    ] = `data:${image.mime};base64,${image.data}`;

                    UPLOAD_IMAGES[identifier] = {
                        base64: image.data,
                        mime: image.mime,
                    };

                    this.setState({
                        localImages: LOCAL_IMAGES,
                        uploadImages: UPLOAD_IMAGES,
                    });
                })
                .catch(error => {});
        }
    };

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
                              : 9) - Object.keys(localImages).length,
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
        const {navigation, system} = this.props;
        const {trans} = system;
        const {title} = this.state;

        let hasError = false;

        if (!title) {
            hasError = true;
        }

        if (hasError === false) {
            this.setState({
                submitButton: (
                    <TouchableWithoutFeedback
                        onPress={this._postRequest.bind(this)}>
                        <View
                            style={[
                                Style.p_r_3,
                                Style.p_h_2,
                                Style.p_v_1,
                                Style.bg_color_cityseeker,
                                Style.column,
                                Style.column_center,
                            ]}>
                            <Text style={[Style.f_color_15]}>
                                {I18n.t('common.send')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                ),
            });
        } else {
            this.setState({
                submitButton: (
                    <TouchableWithoutFeedback>
                        <View
                            style={[
                                Style.p_r_3,
                                Style.p_h_2,
                                Style.p_v_1,
                                Style.column,
                                Style.column_center,
                            ]}>
                            <Text style={[Style.f_color_10]}>
                                {I18n.t('common.send')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                ),
            });
        }
    };

    _postRequest = () => {
        const {account, system} = this.props;

        const {area, lat, lng} = system;

        const {country, city} = area;

        const {commentType, data} = this.state;

        let media = [];

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
                    onHidden: () => {},
                },
                config: {
                    duration: 2000,
                    position: Common.isIphoneX()
                        ? Header.HEIGHT + 25
                        : Header.HEIGHT,
                },
            });
        } else {
            comment['id'] = UUID.v4()
                .toUpperCase()
                .replace(/-/g, '');
            comment['business'] = account.id;
            comment['type'] = commentType;
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

            Object.keys(this.state.uploadImages).map((name, key) => {
                if (this.state.uploadImages[name]) {
                    media.push(this.state.uploadImages[name]);
                }
            });

            comment['media'] = media;

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
                                onHidden: () => this._hideModal(),
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
        const {navigation} = this.props;

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
                onHidden: () => navigation.navigate('home'),
            },
        });
    };

    render() {
        const {children, system} = this.props;

        const {trans, params} = system;

        const {
            data,
            title,
            modalHeight,
            toolboxNotice,
            submitButton,
            titleLength,
            titleHeight,
            pickerType,
            mediaType,
            localImages,
        } = this.state;

        let imgs = [];

        for (let fileIdentifier in localImages) {
            imgs.push(
                <View
                    key={fileIdentifier}
                    style={[
                        {
                            width: IMG_WIDTH,
                            height: IMG_WIDTH,
                            marginTop: SPACE,
                            marginRight: SPACE,
                        },
                        Style.row,
                        Style.row_center,
                        Style.column_center,
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
            <View>
                <TouchableWithoutFeedback onPress={this._showModal.bind(this)}>
                    <View
                        style={[
                            Style.row,
                            Style.row_center,
                            Style.column_center,
                        ]}>
                        {children}
                    </View>
                </TouchableWithoutFeedback>
                <Modal
                    visible={this.state.visible}
                    dismiss={this._hideModal}
                    renderContent={() => {
                        return (
                            <ScrollView>
                                <View
                                    style={[
                                        Style.horizontal,
                                        {
                                            bottom: modalHeight,
                                            backgroundColor:
                                                Style.theme_footer
                                                    .backgroundColor,
                                            paddingHorizontal: SPACE * 2,
                                            paddingVertical: SPACE,
                                        },
                                        Style.column,
                                        Style.column_center,
                                    ]}>
                                    <KeyboardAwareScrollView
                                        onKeyboardWillShow={frames => {
                                            const {
                                                screenY,
                                            } = frames.endCoordinates;
                                            this.setState({
                                                modalHeight: HEIGHT - screenY,
                                            });
                                        }}
                                        onKeyboardWillHide={frames => {
                                            const {
                                                screenY,
                                            } = frames.endCoordinates;
                                            this.setState({
                                                modalHeight: HEIGHT - screenY,
                                            });
                                        }}>
                                        <View
                                            style={[
                                                Style.row,
                                                Style.column_center,
                                                Style.m_b_1,
                                            ]}>
                                            <TextInput
                                                textAlignVertical="top"
                                                disableFullscreenUI={true}
                                                maxLength={titleLength}
                                                multiline={true}
                                                placeholder={I18n.t(
                                                    'feed.feed.title',
                                                )}
                                                placeholderTextColor={
                                                    Style.f_color_9.color
                                                }
                                                style={[
                                                    Style.f_size_15,
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
                                                    if (title === null) {
                                                        this._onSubmit();
                                                        return;
                                                    }

                                                    this.setState({
                                                        toolboxNotice:
                                                            trans[
                                                                'common.words'
                                                            ] +
                                                            ' (' +
                                                            titleLength -
                                                            title.length +
                                                            ')',
                                                    });
                                                    this._onSubmit();
                                                }}
                                                onChangeText={value => {
                                                    value = value.replace(
                                                        /(^\s*)|(\s*$)/g,
                                                        '',
                                                    );

                                                    this.setState(
                                                        {
                                                            title: value,
                                                            toolboxNotice:
                                                                trans[
                                                                    'common.words'
                                                                ] +
                                                                ' (' +
                                                                titleLength -
                                                                value.length +
                                                                ')',
                                                        },
                                                        () => this._onSubmit(),
                                                    );
                                                }}
                                                onContentSizeChange={event => {
                                                    const {
                                                        height,
                                                    } = event.nativeEvent.contentSize;

                                                    if (height > titleHeight) {
                                                        this.setState({
                                                            titleHeight: height,
                                                        });
                                                    }
                                                }}
                                            />
                                        </View>
                                    </KeyboardAwareScrollView>
                                    <View
                                        style={[
                                            Style.row,
                                            Style.wrap,
                                            Style.column_center,
                                            {
                                                paddingVertical: SPACE,
                                            },
                                        ]}>
                                        {imgs}
                                        {Object.keys(localImages).length >= 0 &&
                                            Object.keys(localImages).length <
                                                (params.upload_images !==
                                                undefined
                                                    ? parseInt(
                                                          params.upload_images,
                                                      )
                                                    : 9) && (
                                                <TouchableWithoutFeedback
                                                    onPress={this._openAlbumPicker.bind(
                                                        this,
                                                        mediaType,
                                                    )}>
                                                    <View
                                                        style={[
                                                            {
                                                                width: IMG_WIDTH,
                                                                height: IMG_WIDTH,
                                                                marginTop: SPACE,
                                                                marginRight: SPACE,
                                                            },
                                                            Style.row,
                                                            Style.row_center,
                                                            Style.column_center,
                                                            Style.b_img,
                                                        ]}>
                                                        <MaterialCommunityIcons
                                                            name="plus"
                                                            style={[
                                                                Style.f_color_10,
                                                                Style.f_size_50,
                                                            ]}
                                                        />
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            )}
                                    </View>
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                            Style.row_between,
                                            Style.p_1,
                                        ]}>
                                        {submitButton}
                                        <Text style={[Style.f_color_3]}>
                                            {toolboxNotice}
                                        </Text>
                                    </View>
                                </View>
                            </ScrollView>
                        );
                    }}
                />
            </View>
        );
    }
}

export default CommentButton;
