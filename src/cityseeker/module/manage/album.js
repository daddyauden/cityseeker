import React from 'react';
import {
    Text,
    View,
    Alert,
    Image,
    Platform,
    StatusBar,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import {connect} from 'react-redux';
import {Common, HIDE_STATUS, TRANSLUCENT_STATUS} from '../../utils/lib';
import {list, remove, addBusinessAlbum} from '../../actions/image';
import I18n from '../../locale';
import Style from '../../style';

const WIDTH = Dimensions.get('window').width;
const SPACE = 10;
const ALBUM_IMG_WIDTH = (WIDTH - SPACE * 4) / 3;
const ALBUM_IMG_HEIGHT = (WIDTH - SPACE * 4) / 3;

let LOCAL_IMAGES = {};
let UPLOAD_IMAGES = {};

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('common.image'),
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.dismiss();
                        navigation.toggleDrawer();
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
            headerRight: navigation.getParam('headerRight'),
            headerTransparent: false,
            headerStyle: {
                elevation: 0,
                borderBottomWidth: 0,
                backgroundColor: Style.theme_content.backgroundColor,
            },
        };
    };

    constructor(props) {
        super(props);

        const {business} = this.props.navigation.state.params;

        this.state = {
            loading: true,
            business: business,
            album: {},
            localImages: {},
            uploadImages: {},
        };
    }

    componentDidMount() {
        const {navigation} = this.props;

        navigation.addListener('didFocus', () => {
            this._requestData();
        });

        navigation.addListener('didBlur', () => {
            LOCAL_IMAGES = {};
            UPLOAD_IMAGES = {};

            this.setState({
                loading: true,
                business: {},
                album: {},
                localImages: {},
                uploadImages: {},
                uploadButton: null,
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
                            {I18n.t('common.upload')}
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

    _requestData = () => {
        const {business} = this.state;

        setTimeout(() => {
            list({
                where: ["business = '" + business.id + "'"],
                order: ['queue desc'],
                size: 100,
            })
                .then(response => {
                    const {status, message} = response;

                    if (parseInt(status) === 1) {
                        const {count, list} = message;

                        let images = {};

                        if (parseInt(count) > 0) {
                            list.map(image => {
                                images[image.id] = image;
                            });
                        }

                        this.setState({
                            album: images,
                            loading: false,
                        });
                    } else {
                        this.setState({
                            loading: false,
                        });
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                });
        }, 500);
    };

    _changeAlbumImage = () => {
        const {upload_images} = this.props.system.params;
        const {localImages, album} = this.state;

        let options =
            Platform.OS === 'ios'
                ? {
                      smartAlbums: ['UserLibrary'],
                      includeBase64: true,
                      mediaType: 'photo',
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
                          Object.keys(album).length,
                      showsSelectedCount: true,
                      forceJpg: true,
                  }
                : {
                      includeBase64: true,
                      mediaType: 'photo',
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

                this.setState(
                    {
                        localImages: LOCAL_IMAGES,
                        uploadImages: UPLOAD_IMAGES,
                    },
                    () => this._setNav(),
                );
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

    _removeRemoteImage = image => {
        const {album} = this.state;

        remove({
            id: image.id,
        }).then(response => {
            const {status} = response;

            if (parseInt(status) === 1) {
                delete album[image.id];
                this.setState(
                    {
                        album: {
                            ...album,
                        },
                    },
                    () => {
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
                        });
                    },
                );
            } else {
                this._postError();
            }
        });
    };

    _setNav = () => {
        const {navigation} = this.props;

        const {uploadImages} = this.state;

        if (Object.keys(uploadImages).length > 0) {
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
                                {I18n.t('common.upload')}
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
                                {I18n.t('common.upload')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                ),
            });
        }
    };

    _postRequest = () => {
        const {business, album, uploadImages} = this.state;

        const {account, navigation} = this.props;

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
                            {I18n.t('common.upload') + '...'}
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
                },
                op: {
                    onHidden: () => navigation.navigate('Signin'),
                },
            });
        } else {
            let data = {};

            let medias = [];

            data['business'] = business.id;

            Object.keys(uploadImages).map(name => {
                if (uploadImages[name]) {
                    medias.push(uploadImages[name]);
                }
            });

            data['medias'] = medias;

            addBusinessAlbum(data)
                .then(response => {
                    const {status, message} = response;

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
                                    let newImages = {};
                                    message !== undefined &&
                                        message.length > 0 &&
                                        message.map(image => {
                                            newImages[image.id] = image;
                                        });

                                    UPLOAD_IMAGES = {};
                                    LOCAL_IMAGES = {};

                                    this.setState(
                                        {
                                            album: {
                                                ...newImages,
                                                ...album,
                                            },
                                            uploadImages: {},
                                            localImages: {},
                                        },
                                        () => this._setNav(),
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
            },
        });
    };

    _renderLocalImages = () => {
        const {localImages, album} = this.state;

        const {params} = this.props.system;

        let imgs = [];

        for (let fileIdentifier in localImages) {
            imgs.push(
                <View
                    key={fileIdentifier}
                    style={[
                        {
                            width: ALBUM_IMG_WIDTH,
                            height: ALBUM_IMG_WIDTH,
                            marginLeft: SPACE,
                            marginBottom: SPACE,
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
                                    width: ALBUM_IMG_WIDTH,
                                    height: ALBUM_IMG_WIDTH,
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

        Object.keys(album).length > 0 &&
            Object.keys(album).map((remoteImageId, key) => {
                imgs.push(
                    <View
                        key={key}
                        style={[
                            {
                                width: ALBUM_IMG_WIDTH,
                                height: ALBUM_IMG_WIDTH,
                                marginLeft: SPACE,
                                marginBottom: SPACE,
                            },
                            Style.row,
                            Style.row_center,
                            Style.column_center,
                        ]}>
                        <Image
                            style={[
                                Style.w_p100,
                                Style.h_p100,
                                Style.img_cover,
                            ]}
                            source={{
                                uri: Common.load_image(album[remoteImageId]),
                            }}
                        />
                        <TouchableWithoutFeedback
                            onPress={() => {
                                Alert.alert(
                                    I18n.t('common.delete.message'),
                                    '',
                                    [
                                        {text: I18n.t('common.no')},
                                        {
                                            text: I18n.t('common.yes'),
                                            onPress: () =>
                                                this._removeRemoteImage(
                                                    album[remoteImageId],
                                                ),
                                        },
                                    ],
                                );
                            }}>
                            <View style={[Style.top_right, Style.bg_color_15]}>
                                <MaterialCommunityIcons
                                    name="close"
                                    style={[
                                        Style.f_color_cityseeker,
                                        Style.f_size_20,
                                    ]}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>,
                );
            });

        return (
            <View style={[Style.column, Style.m_t_4]}>
                <View
                    style={[
                        Style.row,
                        Style.row_center,
                        Style.column_center,
                        Style.bg_color_gray,
                        {
                            paddingVertical: SPACE * 2,
                            marginBottom: SPACE * 2,
                        },
                    ]}>
                    <Text
                        style={[
                            Style.f_size_15,
                            Style.f_color_1,
                            Style.f_weight_500,
                        ]}>
                        {I18n.t('common.album')}
                    </Text>
                </View>
                <View style={[Style.row, Style.column_center, Style.wrap]}>
                    {Object.keys(album).length +
                        Object.keys(localImages).length <
                        (params.upload_images !== undefined
                            ? parseInt(params.upload_images)
                            : 9) && (
                        <TouchableWithoutFeedback
                            onPress={() => this._changeAlbumImage()}>
                            <View
                                style={[
                                    {
                                        width: ALBUM_IMG_WIDTH,
                                        height: ALBUM_IMG_HEIGHT,
                                        marginLeft: SPACE,
                                        marginBottom: SPACE,
                                    },
                                    Style.row,
                                    Style.row_center,
                                    Style.column_center,
                                    Style.b_img,
                                ]}>
                                <MaterialCommunityIcons
                                    name="plus"
                                    style={[Style.f_color_10, Style.f_size_50]}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    {imgs}
                </View>
            </View>
        );
    };

    render() {
        return this.state.loading === true ? (
            <ActivityIndicator
                size="small"
                color={Style.f_color_cityseeker.color}
            />
        ) : (
            <View style={[Style.flex, Style.theme_content, Style.p_b_6]}>
                <StatusBar
                    hidden={HIDE_STATUS}
                    barStyle="dark-content"
                    translucent={TRANSLUCENT_STATUS}
                />
                <ScrollView>{this._renderLocalImages()}</ScrollView>
            </View>
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
