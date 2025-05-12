import React from 'react';
import {
    Image,
    View,
    Text,
    TextInput,
    Platform,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view/index';
import ImagePicker from 'react-native-image-crop-picker';
import {Header, SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';
import UUID from 'react-native-uuid';
import {HIDE_STATUS, TRANSLUCENT_STATUS} from '../../utils/lib';
import StatusBar from '../../components/StatusBar';
import CommentConfig from '../../config/comment';
import CommentType from '../../type/comment';
import Avator from '../../components/Avator';
import {add} from '../../actions/comment';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

let LOCAL_IMAGES = {};
let UPLOAD_IMAGES = {};
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const SPACE = 10;
const IMG_WIDTH = (WIDTH - SPACE * 6) / 3;

class Post extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
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
            data,
            commentType,
            pickerType,
            mediaType,
        } = props.navigation.state.params;

        let type;

        if (commentType.toLowerCase() === CommentType.feed) {
            type = 'feed';
        } else if (commentType.toLowerCase() === CommentType.business) {
            type = 'business';
        } else if (commentType.toLowerCase() === CommentType.item) {
            type = 'item';
        } else if (commentType.toLowerCase() === CommentType.comment) {
            type = 'comment';
        }

        this.state = {
            data: data,
            toolboxHeight: 0,
            title: null,
            titleHeight: 40,
            titleLength: CommentConfig.titleLength,
            type: type,
            pickerType: pickerType || 'album',
            mediaType: mediaType || 'photo',
            localImages: {},
            uploadImages: {},
        };
    }

    componentDidMount() {
        const {navigation, system} = this.props;

        navigation.addListener('didBlur', () => {
            LOCAL_IMAGES = {};
            UPLOAD_IMAGES = {};

            this.setState({
                type: null,
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
    }

    componentWillUnmount() {
        LOCAL_IMAGES = {};
        UPLOAD_IMAGES = {};
    }

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
                Object.keys(localImages).length -
                5 >
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
                              : 9) -
                          Object.keys(localImages).length -
                          6,
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
        const {navigation} = this.props;

        let hasError = false;

        if (!title) {
            hasError = true;
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

    _postRequest = () => {
        const {type, data, uploadImages, title} = this.state;
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

            Object.keys(uploadImages).map((name, key) => {
                if (uploadImages[name]) {
                    medias.push(uploadImages[name]);
                }
            });

            comment['medias'] = medias;

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
                                onHidden: () => navigation.goBack(),
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
        const {params} = this.props.system;

        const {
            data,
            mediaType,
            toolboxHeight,
            titleHeight,
            titleLength,
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

        const contentView = (
            <View style={[Style.row]}>
                <Avator user={data.business} size={Style.w_10.width} />
                <View style={[Style.column, Style.flex, Style.m_l_3]}>
                    <Text
                        numberOfLines={1}
                        style={[
                            Style.f_weight_500,
                            Style.f_size_15,
                            Style.f_color_3,
                        ]}>
                        {data.business.name}
                    </Text>
                    {data.title && (
                        <Text
                            style={[
                                Style.m_t_1,
                                Style.f_weight_400,
                                Style.f_size_14,
                                Style.f_color_3,
                            ]}>
                            {data.title}
                        </Text>
                    )}
                </View>
            </View>
        );

        return (
            <SafeAreaView style={[Style.flex, Style.row_between]}>
                <StatusBar light />
                <ScrollView>
                    <View
                        style={{
                            paddingHorizontal: SPACE * 2,
                            paddingVertical: SPACE * 2,
                        }}>
                        {contentView}
                        <KeyboardAwareScrollView
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
                            <TextInput
                                textAlignVertical="top"
                                disableFullscreenUI={true}
                                maxLength={titleLength}
                                multiline={true}
                                placeholder={
                                    I18n.t('common.post') +
                                    ' ' +
                                    I18n.t('common.comments')
                                }
                                placeholderTextColor={Style.f_color_8.color}
                                style={[
                                    Style.m_t_2,
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
                                    this._onSubmit();
                                }}
                                onChangeText={value => {
                                    value = value.replace(/(^\s*)|(\s*$)/g, '');

                                    this.setState(
                                        {
                                            title: value,
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
                        </KeyboardAwareScrollView>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_t_2,
                            ]}>
                            {imgs}
                        </View>
                    </View>
                </ScrollView>
                <View
                    style={[
                        Style.horizontal,
                        Style.b_t,
                        Style.b_b,
                        {
                            bottom: toolboxHeight,
                            backgroundColor: Style.theme_footer.backgroundColor,
                        },
                        Style.row,
                        Style.column_center,
                        Style.p_v_2,
                        Style.p_h_4,
                    ]}>
                    <View style={[Style.row, Style.column_center]}>
                        {Object.keys(localImages).length >= 0 &&
                        Object.keys(localImages).length <
                            (params.upload_images !== undefined
                                ? parseInt(params.upload_images)
                                : 9) -
                                6 ? (
                            <TouchableWithoutFeedback
                                onPress={this._openAlbumPicker.bind(
                                    this,
                                    mediaType,
                                )}>
                                <MaterialCommunityIcons
                                    name="image-plus"
                                    style={[
                                        Style.f_color_cityseeker,
                                        Style.f_size_23,
                                    ]}
                                />
                            </TouchableWithoutFeedback>
                        ) : (
                            <MaterialCommunityIcons
                                name="image-off"
                                style={[Style.f_color_6, Style.f_size_23]}
                            />
                        )}
                    </View>
                </View>
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
