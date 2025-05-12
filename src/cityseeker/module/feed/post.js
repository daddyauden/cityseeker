import React from 'react';
import {
    Image,
    View,
    Text,
    TextInput,
    Platform,
    StatusBar,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view/index';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import {Header, SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';
import UUID from 'react-native-uuid';

import NearbyBusinessModal from '../components/NearbyBusinessModal';
import LoadingIndicator from '../components/LoadingIndicator';
import Avator from '../components/Avator';

import {
    HIDE_STATUS,
    TRANSLUCENT_STATUS,
    Common,
    scrollProps,
} from '../utils/lib';

import * as Record from '../actions/record';
import {add} from '../actions/feed';

import FeedConfig from '../config/feed';
import FeedModel from '../model/feed';
import FeedType from '../type/feed';
import I18n from '../locale';
import Style from '../style';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const SPACE = 10;
const IMG_WIDTH = (WIDTH - SPACE * 6) / 3;

let LOCAL_IMAGES = {};
let UPLOAD_IMAGES = {};

class Post extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: (
                <View
                    style={[
                        Style.flex,
                        Style.column,
                        Style.row_center,
                        Style.column_center,
                    ]}>
                    <Text
                        style={[
                            Style.f_size_15,
                            Style.f_color_1,
                            Style.f_weight_600,
                        ]}>
                        {I18n.t('feed.type.' + navigation.getParam('feedType'))}
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
                            style={[Style.f_size_20, Style.f_color_3]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
            headerRight: navigation.getParam('headerRight'),
            headerStyle: {
                elevation: 0,
                borderBottomWidth: 0,
                backgroundColor: Style.theme_header.backgroundColor,
            },
        };
    };

    constructor(props) {
        super(props);

        const {
            feedType,
            pickerType,
            mediaType,
            data,
        } = props.navigation.state.params;

        let type;

        // if have repost data
        let repost = null;

        if (feedType.toLowerCase() === FeedType.image) {
            type = 'image';
        } else if (feedType.toLowerCase() === FeedType.video) {
            type = 'video';
        } else if (feedType.toLowerCase() === FeedType.article) {
            type = 'article';
        } else if (feedType.toLowerCase() === FeedType.link) {
            type = 'link';
        } else if (
            feedType.toLowerCase() === FeedType.repost &&
            data !== undefined &&
            data !== null
        ) {
            type = 'repost';
            repost = data;
        } else {
            type = 'feed';
        }

        this.state = {
            repost: repost,
            toolboxHeight: 0,
            toolboxNotice: '',
            titleLength: FeedConfig.titleLength,
            contentLength: FeedConfig.contentLength,
            pickerType: pickerType || 'album',
            mediaType: mediaType || 'photo',
            loading: true,
            feedType: type,
            feed: {},
            requiredFields: {},
            localImages: {},
            uploadImages: {},
            defaultBusiness: null,
            nearbyBusinessModalVisible: false,
        };
    }

    componentDidMount() {
        const {navigation} = this.props;

        navigation.addListener('didFocus', () => {
            this._loadTypeConfig();
        });

        navigation.addListener('didBlur', () => {
            LOCAL_IMAGES = {};
            UPLOAD_IMAGES = {};

            this.setState({
                loading: true,
                feedType: null,
                feed: {},
                requiredFields: {},
                localImages: {},
                uploadImages: {},
            });
        });

        navigation.setParams({
            headerRight: (
                <TouchableWithoutFeedback>
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
                </TouchableWithoutFeedback>
            ),
        });

        this._loadTypeConfig();
    }

    componentWillUnmount() {
        LOCAL_IMAGES = {};
        UPLOAD_IMAGES = {};
    }

    _loadTypeConfig = () => {
        const {feedType} = this.state;

        const configs = FeedModel.hasOwnProperty(feedType)
            ? FeedModel[feedType]
            : [];

        let feed = {};
        // marked which field is required true
        let requiredFields = {};
        // feed config from file base on feed type

        for (let name in configs) {
            const {required} = configs[name];

            feed[name] = '';

            if (required === true) {
                requiredFields[name] = true;
            }
        }

        this.setState({
            loading: false,
            feedType: feedType,
            feed: feed,
            requiredFields: requiredFields,
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

            ImagePicker.clean();
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
                images.map(image => {
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

    _setNav = () => {
        const {navigation} = this.props;

        const {feed, requiredFields} = this.state;

        let hasError = false;
        for (let fieldName in requiredFields) {
            if (!feed[fieldName]) {
                hasError = true;
                break;
            }
        }

        if (hasError === false) {
            navigation.setParams({
                headerRight: (
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
            navigation.setParams({
                headerRight: (
                    <TouchableWithoutFeedback>
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
                    </TouchableWithoutFeedback>
                ),
            });
        }
    };

    _onSubmit = (name, value) => {
        const {feed} = this.state;

        this.setState(
            {
                feed: {
                    ...feed,
                    [name]: value,
                },
            },
            () => {
                this._setNav();
            },
        );
    };

    _postRequest = () => {
        const {
            feedType,
            feed,
            repost,
            defaultBusiness,
            uploadImages,
        } = this.state;

        const {system, account, navigation} = this.props;

        const {area, lat, lng} = system;

        const {country, city} = area;

        navigation.setParams({
            headerRight: (
                <TouchableWithoutFeedback>
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
                            {I18n.t('common.send') + '...'}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            ),
        });

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
            let feedRequest = {};

            feedRequest['id'] = UUID.v4()
                .toUpperCase()
                .replace(/-/g, '');
            feedRequest['business'] = account.id;
            feedRequest['status'] = account.status;
            feedRequest['type'] = feedType;

            if (feedType === FeedType.repost && repost !== null) {
                feedRequest['content'] = repost.id;
            }

            Object.keys(feed).length > 0 &&
                Object.keys(feed).map(fieldName => {
                    if (feed[fieldName]) {
                        feedRequest[fieldName] = feed[fieldName];
                    }
                });

            if (country) {
                feedRequest['country'] = country;
            }

            if (city) {
                feedRequest['city'] = city;
            }

            if (lat) {
                feedRequest['lat'] = lat;
            }

            if (lng) {
                feedRequest['lng'] = lng;
            }

            if (defaultBusiness !== null && defaultBusiness.id) {
                feedRequest['nearby'] = defaultBusiness.id;
            }

            let medias = [];

            Object.keys(uploadImages).map(name => {
                if (uploadImages[name]) {
                    medias.push(uploadImages[name]);
                }
            });

            feedRequest['medias'] = medias;

            add(feedRequest)
                .then(data => {
                    const {status} = data;

                    if (parseInt(status) === 1) {
                        feedType === FeedType.repost &&
                            this.props.dispatch(
                                Record.add({
                                    type: 'feed',
                                    action: 'reposts',
                                    content: repost.id,
                                }),
                            );

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
                                onHidden: () => navigation.navigate('Feed'),
                            },
                            config: {
                                duration: 2000,
                                position: Common.isIphoneX()
                                    ? Header.HEIGHT + 25
                                    : Header.HEIGHT,
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
            },
            op: {
                onHidden: () => navigation.navigate('Feed'),
            },
            config: {
                duration: 2000,
                position: Common.isIphoneX()
                    ? Header.HEIGHT + 25
                    : Header.HEIGHT,
            },
        });
    };

    _showNearbyBusinessModal = () => {
        this.setState({
            nearbyBusinessModalVisible: true,
        });
    };

    _hideNearbyBusinessModal = () => {
        this.setState({
            nearbyBusinessModalVisible: false,
        });
    };

    _setDefaultBusiness = (business, hideNearbyBusinessModal = false) => {
        this.setState({
            defaultBusiness: business,
            nearbyBusinessModalVisible: !hideNearbyBusinessModal,
        });
    };

    _renderInputsView = () => {
        const {feedType, feed, titleLength, contentLength} = this.state;

        const feedModel = FeedModel[feedType];

        const inputs =
            Object.keys(feed).length > 0 &&
            Object.keys(feed).map((fieldName, key) => {
                let input;
                const {type, label} = feedModel[fieldName];

                const autoFocus = fieldName === 'title' ? true : false;
                const maxLength =
                    fieldName === 'title' ? titleLength : contentLength;

                if (type === 'textarea') {
                    input = (
                        <TextInput
                            textAlignVertical="top"
                            disableFullscreenUI={false}
                            maxLength={maxLength}
                            multiline={true}
                            placeholder={I18n.t(label)}
                            placeholderTextColor={Style.f_color_9.color}
                            style={[
                                Style.f_size_15,
                                Style.l_h_4,
                                Style.w_p100,
                                {
                                    height:
                                        this.state[fieldName + '_height'] !==
                                        undefined
                                            ? this.state[fieldName + '_height']
                                            : 40,
                                },
                            ]}
                            editable={true}
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect={false}
                            autoFocus={autoFocus}
                            spellCheck={false}
                            keyboardType={'default'}
                            onFocus={() => {
                                const value = feed[fieldName];

                                if (fieldName === 'title') {
                                    this.setState({
                                        toolboxNotice:
                                            I18n.t('common.words') +
                                            ' (' +
                                            (titleLength - value.length) +
                                            ')',
                                    });
                                } else if (
                                    fieldName === 'content' &&
                                    (feedType === FeedType.video ||
                                        feedType == FeedType.link)
                                ) {
                                    if (
                                        /(http|https):\/\/(.*)\.[\w]{2,3}\/[\S]+/i.test(
                                            value,
                                        ) === false
                                    ) {
                                        this.setState({
                                            toolboxNotice: I18n.t(
                                                'feed.' + feedType + '.content',
                                            ),
                                        });
                                    } else {
                                        this.setState({
                                            toolboxNotice: '',
                                        });
                                    }
                                }

                                this._setNav();
                            }}
                            onChangeText={value => {
                                value = value.replace(/(^\s*)|(\s*$)/g, '');

                                if (fieldName === 'title') {
                                    this.setState(
                                        {
                                            toolboxNotice:
                                                I18n.t('common.words') +
                                                ' (' +
                                                (titleLength - value.length) +
                                                ')',
                                        },
                                        () => this._onSubmit(fieldName, value),
                                    );
                                } else if (
                                    fieldName === 'content' &&
                                    (feedType === FeedType.video ||
                                        feedType === FeedType.link)
                                ) {
                                    if (
                                        /(http|https):\/\/(.*)\.[\w]{2,3}\/[\S]+/i.test(
                                            value,
                                        ) === false
                                    ) {
                                        this.setState(
                                            {
                                                toolboxNotice: I18n.t(
                                                    'feed.' +
                                                        feedType +
                                                        '.content',
                                                ),
                                            },
                                            () =>
                                                this._onSubmit(fieldName, null),
                                        );
                                    } else {
                                        this.setState(
                                            {
                                                toolboxNotice: '',
                                            },
                                            () =>
                                                this._onSubmit(
                                                    fieldName,
                                                    value,
                                                ),
                                        );
                                    }
                                } else {
                                    this.setState(
                                        {
                                            toolboxNotice: '',
                                        },
                                        () => this._onSubmit(fieldName, value),
                                    );
                                }
                            }}
                            onContentSizeChange={event => {
                                const {height} = event.nativeEvent.contentSize;

                                if (height > 40) {
                                    this.setState({
                                        [fieldName + '_height']: height,
                                    });
                                }
                            }}
                        />
                    );
                }

                return (
                    <View
                        key={key}
                        style={[Style.row, Style.column_center, Style.m_b_2]}>
                        {input}
                    </View>
                );
            });

        return (
            <KeyboardAwareScrollView
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
                }}>
                <View style={[Style.column]}>{inputs}</View>
            </KeyboardAwareScrollView>
        );
    };

    _renderLocalImages = () => {
        const {localImages} = this.state;

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

        return imgs;
    };

    _renderRepostView = () => {
        const {feedType, repost} = this.state;

        let repostView;

        if (feedType === FeedType.repost && repost !== null) {
            const {business, title, content, images} = repost;

            const img =
                images !== undefined && images !== null && images.length > 0 ? (
                    <Image
                        source={{
                            uri: Common.load_image(images[0]),
                        }}
                        style={[Style.w_20, Style.h_20]}
                    />
                ) : (
                    <Avator user={business} size={Style.w_20.width} />
                );

            repostView = (
                <View
                    style={[
                        Style.row,
                        Style.theme_header,
                        Style.m_t_3,
                        {
                            width: WIDTH - SPACE * 4,
                            marginLeft: SPACE * 2,
                        },
                    ]}>
                    {img}
                    <View
                        style={[
                            Style.column,
                            Style.flex,
                            Style.row_around,
                            Style.p_v_1,
                            Style.p_h_2,
                        ]}>
                        {business.name && (
                            <Text
                                numberOfLines={1}
                                style={[
                                    Style.f_weight_500,
                                    Style.f_size_15,
                                    Style.f_color_3,
                                ]}>
                                {business.name}
                            </Text>
                        )}
                        {title && (
                            <Text
                                numberOfLines={1}
                                style={[
                                    Style.f_weight_400,
                                    Style.f_size_14,
                                    Style.f_color_5,
                                ]}>
                                {title}
                            </Text>
                        )}
                        {content && (
                            <Text
                                numberOfLines={1}
                                style={[
                                    Style.f_weight_400,
                                    Style.f_size_13,
                                    Style.f_color_7,
                                ]}>
                                {content}
                            </Text>
                        )}
                    </View>
                </View>
            );
        }

        return repostView;
    };

    _renderNearbyBusinessView = () => {
        const {defaultBusiness} = this.state;

        return (
            defaultBusiness !== null && (
                <TouchableWithoutFeedback
                    onPress={this._showNearbyBusinessModal}>
                    <View style={[Style.row, Style.column_center, Style.m_l_2]}>
                        <Icon
                            name="map-marker-alt"
                            style={[
                                Style.f_color_6,
                                Style.f_size_15,
                                Style.m_r_1,
                            ]}
                        />
                        <Text
                            numberOfLines={1}
                            style={[
                                Style.f_size_13,
                                Style.f_color_6,
                                Style.f_weight_500,
                            ]}>
                            {defaultBusiness.name}
                        </Text>
                        <Icon
                            onPress={() => {
                                this.setState({
                                    defaultBusiness: null,
                                });
                            }}
                            solid
                            name="times-circle"
                            style={[
                                Style.flex,
                                Style.f_color_7,
                                Style.f_size_13,
                                Style.m_l_2,
                            ]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            )
        );
    };

    _renderToolbar = () => {
        const {
            mediaType,
            toolboxHeight,
            toolboxNotice,
            localImages,
            defaultBusiness,
            nearbyBusinessModalVisible,
        } = this.state;

        const {params} = this.props.system;

        return (
            <View
                style={[
                    Style.horizontal,
                    Style.b_t,
                    Style.b_b,
                    Style.row,
                    Style.column_center,
                    Style.row_between,
                    Style.p_v_2,
                    Style.p_h_4,
                    {
                        bottom: toolboxHeight,
                        backgroundColor: Style.theme_footer.backgroundColor,
                    },
                ]}>
                <View style={[Style.row, Style.column_center]}>
                    {Object.keys(localImages).length >= 0 &&
                    Object.keys(localImages).length <
                        (params['upload_images'] !== undefined
                            ? parseInt(params['upload_images'])
                            : 9) ? (
                        <TouchableWithoutFeedback
                            onPress={this._openAlbumPicker.bind(
                                this,
                                mediaType,
                            )}>
                            <MaterialCommunityIcons
                                name="image"
                                style={[
                                    Style.f_color_cityseeker,
                                    Style.f_size_23,
                                    Style.m_r_4,
                                ]}
                            />
                        </TouchableWithoutFeedback>
                    ) : (
                        <MaterialCommunityIcons
                            name="image-off"
                            style={[
                                Style.f_color_6,
                                Style.f_size_23,
                                Style.m_r_4,
                            ]}
                        />
                    )}
                    <NearbyBusinessModal
                        {...this.props}
                        setDefaultBusiness={this._setDefaultBusiness}
                        defaultBusiness={defaultBusiness}
                        visible={nearbyBusinessModalVisible}
                        showNearbyBusinessModal={this._showNearbyBusinessModal}
                        onDismiss={this._hideNearbyBusinessModal}
                    />
                </View>
                <Text style={[Style.f_color_3, Style.m_l_2]}>
                    {toolboxNotice}
                </Text>
            </View>
        );
    };

    render() {
        return this.state.loading === true ? (
            <View style={[Style.flex, Style.row_center, Style.column_center]}>
                <LoadingIndicator />
            </View>
        ) : (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{
                    vertical: 'never',
                }}>
                <StatusBar
                    hidden={HIDE_STATUS}
                    barStyle="dark-content"
                    translucent={TRANSLUCENT_STATUS}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    {...scrollProps}>
                    <View
                        style={{
                            padding: SPACE * 2,
                        }}>
                        {this._renderInputsView()}
                        {this._renderNearbyBusinessView()}
                    </View>
                    <View
                        style={[
                            Style.row,
                            Style.wrap,
                            Style.column_center,
                            {
                                paddingLeft: SPACE * 2,
                            },
                        ]}>
                        {this._renderLocalImages()}
                    </View>
                    {this._renderRepostView()}
                </ScrollView>
                {this._renderToolbar()}
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

export default connect(mapStateToProps)(Post);
