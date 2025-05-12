import React from 'react';
import {
    Text,
    View,
    Image,
    Platform,
    TextInput,
    Dimensions,
    ScrollView,
    findNodeHandle,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view/index';
import ImagePicker from 'react-native-image-crop-picker';
import {TextInputMask} from 'react-native-masked-text';
import MultiSelect from 'react-native-multiple-select';
import {Header} from 'react-navigation';
import {connect} from 'react-redux';
import UUID from 'react-native-uuid';
import {Common, HIDE_STATUS, TRANSLUCENT_STATUS} from '../../utils/lib';
import BusinessType from '../../type/business';
import {create} from '../../actions/item';
import ItemModel from '../../model/item';
import I18n from '../../locale';
import Style from '../../style';

const WIDTH = Dimensions.get('window').width;
const SPACE = 10;
const INPUT_HEIGHT = 40;
const TEXTAREA_HEIGHT = 130;

const ALBUM_IMG_WIDTH = (WIDTH - SPACE * 4) / 3;
const ALBUM_IMG_HEIGHT = (WIDTH - SPACE * 4) / 3;

let LOCAL_IMAGES = {};
let UPLOAD_IMAGES = {};

class Post extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('type.' + navigation.getParam('itemType')),
            headerLeft: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <View style={Style.m_l_3}>
                        <Text style={[Style.f_size_15, Style.f_color_3]}>
                            {I18n.t('common.cancel')}
                        </Text>
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

        this.state = {
            loading: true,
            type: null,
            item: {},
            showItems: {},
            requiredFields: {},
            localImages: {},
            uploadImages: {},
            toolboxHeight: 0,
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
                type: null,
                item: {},
                showItems: {},
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
                            {I18n.t('common.save')}
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

    _loadTypeConfig = () => {
        const {navigation, system} = this.props;

        const {country, city} = system.area;

        const {itemType} = navigation.state.params;

        let type = '';

        if (BusinessType.hasOwnProperty(itemType.toLowerCase())) {
            type = itemType.toLowerCase();
        }

        let item = {};
        let showItems = {};
        // marked which field is required true
        let requiredFields = {};
        // item config from file base on item type
        let configs = {};

        if (type !== '' && ItemModel.hasOwnProperty(type)) {
            configs = ItemModel[type];
        }

        for (let name in configs) {
            const {type, multiple, required} = configs[name];

            const defaultValue =
                type === 'choice' && multiple === true
                    ? []
                    : type === 'number' || type === 'integer'
                    ? '0'
                    : '';

            item[name] = defaultValue;

            if (name === 'country') {
                item[name] = country;
            }

            if (name === 'city') {
                item[name] = city;
            }

            showItems[name + '_show'] = true;

            if (required === true) {
                requiredFields[name] = true;
            }
        }

        if (type === BusinessType.autotrade) {
            showItems['mileage_show'] = false;
            showItems['payment_price_show'] = false;
            showItems['payment_frequency_show'] = false;
            showItems['payment_term_show'] = false;
        }

        this.setState({
            loading: false,
            type: type,
            item: item,
            showItems: showItems,
            requiredFields: requiredFields,
        });
    };

    _openCameraPicker = () => {
        const {upload_images} = this.props.system.params;
        const {localImages} = this.state;

        let options =
            Platform.OS === 'ios'
                ? {
                      includeBase64: true,
                      mediaType: 'photo',
                      avoidEmptySpaceAroundImage: true,
                      compressImageQuality: 0.3,
                      loadingLabelText: '',
                      forceJpg: true,
                  }
                : {
                      includeBase64: true,
                      mediaType: 'photo',
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

    _openAlbumPicker = () => {
        const {upload_images} = this.props.system.params;
        const {localImages} = this.state;

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
                              : 9) - Object.keys(localImages).length,
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

        const {item, requiredFields} = this.state;

        let hasError = false;
        for (var itemName in requiredFields) {
            if (!item[itemName]) {
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
                                {I18n.t('common.save')}
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
                                {I18n.t('common.save')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                ),
            });
        }
    };

    _onSubmit = (name, value) => {
        const {type, item, showItems} = this.state;

        if (type === BusinessType.autotrade) {
            if (name === 'condition' && value === 'new') {
                this.setState(
                    {
                        item: {
                            ...item,
                            [name]: value,
                        },
                        showItems: {
                            ...showItems,
                            mileage_show: false,
                            payment_price_show: false,
                            payment_frequency_show: false,
                            payment_term_show: false,
                        },
                    },
                    () => {
                        this._setNav();
                    },
                );
            } else if (name === 'condition' && value === 'used') {
                this.setState(
                    {
                        item: {
                            ...item,
                            [name]: value,
                        },
                        showItems: {
                            ...showItems,
                            mileage_show: true,
                            payment_price_show: false,
                            payment_frequency_show: false,
                            payment_term_show: false,
                        },
                    },
                    () => {
                        this._setNav();
                    },
                );
            } else if (name === 'condition' && value === 'transfer') {
                this.setState(
                    {
                        item: {
                            ...item,
                            [name]: value,
                        },
                        showItems: {
                            ...showItems,
                            mileage_show: true,
                            payment_price_show: true,
                            payment_frequency_show: true,
                            payment_term_show: true,
                        },
                    },
                    () => {
                        this._setNav();
                    },
                );
            }
        } else {
            this.setState(
                {
                    item: {
                        ...item,
                        [name]: value,
                    },
                },
                () => {
                    this._setNav();
                },
            );
        }
    };

    _postRequest = () => {
        const {type, item, uploadImages} = this.state;
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
                            {I18n.t('common.save') + '...'}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            ),
        });

        let medias = [];

        let data = {};

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
            data['id'] = UUID.v4()
                .toUpperCase()
                .replace(/-/g, '');
            data['business'] = account.id;
            data['status'] = account.status;
            data['type'] = type;

            if (Object.keys(item).length > 0) {
                Object.keys(item).map(itemName => {
                    if (item[itemName]) {
                        data[itemName] = item[itemName];
                    }
                });
            }

            if (country) {
                data['country'] = country;
            }

            if (city) {
                data['city'] = city;
            }

            if (lat) {
                data['lat'] = lat;
            }

            if (lng) {
                data['lng'] = lng;
            }

            Object.keys(uploadImages).map((name, key) => {
                if (uploadImages[name]) {
                    medias.push(uploadImages[name]);
                }
            });

            data['media'] = {};

            data['medias'] = medias;

            create(data)
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
                onHidden: () => navigation.goBack(),
            },
        });
    };

    _renderInputsView = () => {
        const {item, showItems, type} = this.state;

        const {params} = this.props.system;

        const itemModel = ItemModel[type];

        const inputs =
            Object.keys(itemModel).length > 0 &&
            Object.keys(itemModel).map((itemName, key) => {
                let input;

                const {
                    type,
                    label,
                    readonly,
                    choices,
                    multiple,
                    format,
                } = itemModel[itemName];

                if (showItems[itemName + '_show'] !== true) {
                    return null;
                }

                if (type === 'text') {
                    input = (
                        <TextInput
                            placeholder={I18n.t(label)}
                            placeholderTextColor={Style.f_color_9.color}
                            editable={true}
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect={false}
                            autoFocus={false}
                            spellCheck={false}
                            keyboardType="default"
                            onChangeText={value => {
                                this._onSubmit(itemName, value);
                            }}
                            onFocus={event => {
                                this._scrollToInput(
                                    findNodeHandle(event.target),
                                );
                            }}
                            style={[
                                Style.flex,
                                Style.p_l_2,
                                Style.p_v_2,
                                {
                                    height: INPUT_HEIGHT,
                                },
                            ]}
                        />
                    );
                } else if (type === 'textarea') {
                    input = (
                        <TextInput
                            textAlignVertical="top"
                            disableFullscreenUI={false}
                            multiline={true}
                            placeholder={I18n.t(label)}
                            placeholderTextColor={Style.f_color_9.color}
                            editable={true}
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect={false}
                            autoFocus={false}
                            spellCheck={false}
                            keyboardType={'default'}
                            onChangeText={value => {
                                this._onSubmit(itemName, value);
                            }}
                            onFocus={event => {
                                this._scrollToInput(
                                    findNodeHandle(event.target),
                                );
                            }}
                            style={[
                                Style.flex,
                                Style.p_l_2,
                                Style.p_v_2,
                                {height: TEXTAREA_HEIGHT},
                            ]}
                        />
                    );
                } else if (type === 'choice') {
                    let items = [];

                    if (itemName === 'city') {
                        const cities =
                            itemModel[itemName]['choices'][
                                item.country.toUpperCase()
                            ];

                        items = Object.keys(cities).map(choiceName => {
                            return {
                                id: cities[choiceName],
                                name: I18n.t(choiceName),
                            };
                        });
                    } else {
                        items = Object.keys(choices).map(choiceName => {
                            return {
                                id: choices[choiceName],
                                name: I18n.t(choiceName),
                            };
                        });
                    }

                    input = (
                        <View style={[Style.flex]}>
                            <MultiSelect
                                uniqueKey="id"
                                displayKey="name"
                                hideTags={true}
                                single={!multiple}
                                hideSubmitButton={false}
                                items={items}
                                fixedHeight={false}
                                textColor={Style.f_color_9.color}
                                fontSize={Style.f_size_13.fontSize}
                                itemFontSize={Style.f_size_13.fontSize}
                                itemTextColor={Style.f_color_6.color}
                                tagBorderColor={Style.f_color_gray.color}
                                tagTextColor={Style.f_color_6.color}
                                tagRemoveIconColor={Style.f_color_3.color}
                                selectedItemTextColor={
                                    Style.f_color_wechat.color
                                }
                                selectedItemIconColor={
                                    Style.f_color_wechat.color
                                }
                                searchInputStyle={{
                                    height: INPUT_HEIGHT,
                                }}
                                searchInputPlaceholderText={I18n.t(label)}
                                submitButtonColor={
                                    Style.bg_color_3.backgroundColor
                                }
                                submitButtonText={I18n.t('common.submit')}
                                selectText={I18n.t(label)}
                                onSelectedItemsChange={selectedItem => {
                                    const value = multiple
                                        ? selectedItem
                                        : selectedItem[0];
                                    this._onSubmit(itemName, value);
                                }}
                                autoFocusInput={false}
                                selectedItems={
                                    multiple ? item[itemName] : [item[itemName]]
                                }
                            />
                        </View>
                    );
                } else if (type === 'date') {
                    input = (
                        <TextInputMask
                            type={'datetime'}
                            options={{
                                format: format,
                            }}
                            placeholder={I18n.t(label)}
                            placeholderTextColor={Style.f_color_9.color}
                            onChangeText={value => {
                                this._onSubmit(itemName, value);
                            }}
                            onFocus={event => {
                                this._scrollToInput(
                                    findNodeHandle(event.target),
                                );
                            }}
                            style={[
                                Style.flex,
                                Style.p_l_2,
                                Style.p_v_2,
                                {
                                    height: INPUT_HEIGHT,
                                },
                            ]}
                        />
                    );
                } else if (type === 'tel') {
                    input = (
                        <TextInputMask
                            type={'cel-phone'}
                            options={{
                                maskType: 'BRL',
                                withDDD: true,
                                dddMask: params['phone_format'],
                            }}
                            placeholder={I18n.t(label)}
                            placeholderTextColor={Style.f_color_9.color}
                            onChangeText={value => {
                                this._onSubmit(itemName, value);
                            }}
                            onFocus={event => {
                                this._scrollToInput(
                                    findNodeHandle(event.target),
                                );
                            }}
                            style={[
                                Style.flex,
                                Style.p_l_2,
                                Style.p_v_2,
                                {
                                    height: INPUT_HEIGHT,
                                },
                            ]}
                        />
                    );
                } else if (type === 'number') {
                    input = (
                        <TextInput
                            placeholder={I18n.t(label)}
                            placeholderTextColor={Style.f_color_9.color}
                            editable={true}
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect={false}
                            autoFocus={false}
                            spellCheck={false}
                            keyboardType="numeric"
                            onChangeText={value => {
                                this._onSubmit(
                                    itemName,
                                    Number(value) === NaN ? 0 : Number(value),
                                );
                            }}
                            onFocus={event => {
                                this._scrollToInput(
                                    findNodeHandle(event.target),
                                );
                            }}
                            style={[
                                Style.flex,
                                Style.p_l_2,
                                Style.p_v_2,
                                {
                                    height: INPUT_HEIGHT,
                                },
                            ]}
                        />
                    );
                } else if (type === 'integer') {
                    input = (
                        <TextInput
                            placeholder={I18n.t(label)}
                            placeholderTextColor={Style.f_color_9.color}
                            editable={true}
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect={false}
                            autoFocus={false}
                            spellCheck={false}
                            keyboardType="number-pad"
                            onChangeText={value => {
                                this._onSubmit(
                                    itemName,
                                    parseInt(value) === NaN
                                        ? 0
                                        : parseInt(value),
                                );
                            }}
                            onFocus={event => {
                                this._scrollToInput(
                                    findNodeHandle(event.target),
                                );
                            }}
                            style={[
                                Style.flex,
                                Style.p_l_2,
                                Style.p_v_2,
                                {
                                    height: INPUT_HEIGHT,
                                },
                            ]}
                        />
                    );
                }

                return (
                    <View
                        key={key}
                        style={[
                            Style.row,
                            Style.p_h_2,
                            Style.m_t_2,
                            Style.f_size_13,
                            Style.border_round_1,
                            Style.bg_color_gray,
                            Style.column_center,
                        ]}>
                        {input}
                    </View>
                );
            });

        return (
            <View style={[Style.column, Style.m_b_6]}>
                <KeyboardAwareScrollView
                    innerRef={ref => {
                        this.keyboard = ref;
                    }}>
                    {this._renderLocalImages()}
                    <View style={[Style.column, {paddingHorizontal: SPACE}]}>
                        {inputs}
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    };

    _renderLocalImages = () => {
        const {localImages} = this.state;

        const {params} = this.props.system;

        let imgs = [];

        for (let fileIdentifier in localImages) {
            imgs.push(
                <View
                    key={fileIdentifier}
                    style={[
                        {
                            width: ALBUM_IMG_WIDTH,
                            height: ALBUM_IMG_HEIGHT,
                            marginRight: SPACE,
                            marginTop: SPACE,
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
                                    height: ALBUM_IMG_HEIGHT,
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
            <View
                style={[
                    Style.row,
                    Style.column_center,
                    Style.wrap,
                    {
                        paddingLeft: SPACE,
                    },
                ]}>
                {Object.keys(localImages).length <
                    (params.upload_images !== undefined
                        ? params.upload_images
                        : 9) && (
                    <TouchableWithoutFeedback
                        onPress={() => this._openAlbumPicker()}>
                        <View
                            style={[
                                {
                                    width: ALBUM_IMG_WIDTH,
                                    height: ALBUM_IMG_HEIGHT,
                                    marginRight: SPACE,
                                    marginTop: SPACE,
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
        );
    };

    _scrollToInput = reactNode => {
        // Add a 'scroll' ref to your ScrollView
        this.keyboard.props.scrollToFocusedInput(reactNode);
    };

    _renderHorizonLocalImages = () => {
        const {localImages} = this.state;

        let imgs = [];

        for (let fileIdentifier in localImages) {
            imgs.push(
                <View
                    key={fileIdentifier}
                    style={[
                        {
                            marginRight: SPACE,
                            paddingVertical: SPACE,
                        },
                    ]}>
                    <Image
                        style={[
                            {
                                width: 50,
                                height: 50,
                            },
                            Style.img_cover,
                        ]}
                        source={{uri: localImages[fileIdentifier]}}
                    />
                    <MaterialCommunityIcons
                        onPress={this._removeAlbumImage.bind(
                            this,
                            fileIdentifier,
                        )}
                        name="close-circle"
                        style={[
                            Style.f_color_cityseeker,
                            Style.f_size_20,
                            Style.top_right,
                            {
                                top: 0,
                                right: -5,
                            },
                        ]}
                    />
                </View>,
            );
        }

        return (
            <ScrollView
                style={[
                    Style.flex,
                    {
                        marginLeft: SPACE,
                    },
                ]}
                horizontal={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                {imgs}
            </ScrollView>
        );
    };

    _renderToolbar = () => {
        const {toolboxHeight, localImages} = this.state;

        const {params} = this.props.system;

        return (
            <View
                style={[
                    Style.horizontal,
                    Style.b_t,
                    Style.b_b,
                    Style.row,
                    Style.column_center,
                    Style.theme_footer,
                    {
                        bottom: toolboxHeight,
                        paddingHorizontal: SPACE * 2,
                    },
                ]}>
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        {
                            paddingVertical: SPACE,
                        },
                    ]}>
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_color_3,
                            Style.f_weight_500,
                        ]}>
                        {I18n.t('common.album') + ': '}
                    </Text>
                    {Object.keys(localImages).length >= 0 &&
                        Object.keys(localImages).length <
                            (params.upload_images !== undefined
                                ? parseInt(params.upload_images)
                                : 9) && (
                            <TouchableWithoutFeedback
                                onPress={() => this._openAlbumPicker()}>
                                <MaterialCommunityIcons
                                    name="plus-circle"
                                    style={[Style.f_color_6, Style.f_size_23]}
                                />
                            </TouchableWithoutFeedback>
                        )}
                </View>
                {this._renderHorizonLocalImages()}
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
            <View style={[Style.flex, Style.theme_content]}>
                <StatusBar
                    hidden={HIDE_STATUS}
                    barStyle="dark-content"
                    translucent={TRANSLUCENT_STATUS}
                />
                {this._renderInputsView()}
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

export default connect(mapStateToProps)(Post);
