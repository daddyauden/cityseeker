import React from 'react';
import {
    Image,
    TouchableWithoutFeedback,
    View,
    Text,
    TextInput,
    findNodeHandle,
    Platform,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import {TextInputMask} from 'react-native-masked-text';
import MultiSelect from 'react-native-multiple-select';
import DatePicker from 'react-native-datepicker';
import {SafeAreaView} from 'react-navigation';
import {Header} from 'react-navigation-stack';
import {connect} from 'react-redux';
import UUID from 'react-native-uuid';
import Moment from 'moment';
import StatusBar from '../../components/StatusBar';
import EventsModel from '../../model/events';
import {add} from '../../actions/events';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

const WIDTH = Dimensions.get('window').width;
const SPACE = 10;
const BANNER_HEIGHT = 240;
const INPUT_HEIGHT = 40;
const TEXTAREA_HEIGHT = 130;

let LOCAL_IMAGE;
let UPLOAD_IMAGE;

class Default extends React.Component {
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
                        {I18n.t('app.tab.events')}
                    </Text>
                </View>
            ),
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

        this.state = {
            loading: true,
            item: {},
            requiredFields: {},
            localImage: null,
            uploadImage: null,
            calendar: {},
        };
    }

    componentDidMount() {
        const {navigation, system} = this.props;

        navigation.addListener('didFocus', () => {
            this._loadTypeConfig();
        });

        navigation.addListener('didBlur', () => {
            LOCAL_IMAGE = null;
            UPLOAD_IMAGE = null;

            this.setState({
                loading: true,
                item: {},
                requiredFields: {},
                localImage: null,
                uploadImage: null,
                calendar: {},
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
        LOCAL_IMAGE = null;
        UPLOAD_IMAGE = null;
    }

    _loadTypeConfig = () => {
        let item = {};
        let requiredFields = {};

        for (let name in EventsModel) {
            const {type, multiple, required} = EventsModel[name];

            const defaultValue =
                type === 'choice' && multiple === true
                    ? []
                    : type === 'number' || type === 'integer'
                    ? '0'
                    : '';

            item[name] = defaultValue;

            if (required === true) {
                requiredFields[name] = true;
            }
        }

        this.setState({
            loading: false,
            item: item,
            requiredFields: requiredFields,
            calendar: {
                ...this._newCalendarItem(),
            },
        });
    };

    _changeLocalImage = () => {
        const cropping = false;
        const cropperCircleOverlay = false;
        const width = 960;
        const height = 640;

        let options =
            Platform.OS === 'ios'
                ? {
                      cropping: true,
                      width: width,
                      height: height,
                      multiple: false,
                      includeBase64: true,
                      avoidEmptySpaceAroundImage: true,
                      cropperCircleOverlay: cropperCircleOverlay,
                      waitAnimationEnd: true,
                      smartAlbums: ['UserLibrary'],
                      compressImageQuality: 0.3,
                      loadingLabelText: '',
                      mediaType: 'photo',
                      showsSelectedCount: false,
                      forceJpg: true,
                  }
                : {
                      cropping: cropping,
                      width: width,
                      height: height,
                      multiple: false,
                      includeBase64: true,
                      avoidEmptySpaceAroundImage: true,
                      cropperCircleOverlay: cropperCircleOverlay,
                      useFrontCamera: true,
                      compressImageQuality: 0.3,
                      mediaType: 'photo',
                      showCropGuidelines: true,
                      showCropFrame: true,
                      hideBottomControls: false,
                      enableRotationGesture: true,
                  };

        ImagePicker.openPicker(options)
            .then(image => {
                LOCAL_IMAGE = image.path;

                UPLOAD_IMAGE = {
                    base64: image.data,
                    mime: image.mime,
                };

                this.setState(
                    {
                        localImage: LOCAL_IMAGE,
                        uploadImage: UPLOAD_IMAGE,
                    },
                    () => this._setNav(),
                );
            })
            .catch(error => {});

        ImagePicker.clean();
    };

    _setNav = () => {
        const {navigation, system} = this.props;

        const {item, localImage, requiredFields, calendar} = this.state;

        let hasError = localImage === null ? true : false;

        for (var itemName in requiredFields) {
            if (!item[itemName]) {
                hasError = true;
                break;
            }
        }

        for (var calendarItemKey in calendar) {
            const {begin} = calendar[calendarItemKey];

            if (begin === undefined || !begin || !begin.isValid()) {
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
        const {item} = this.state;

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
    };

    _postRequest = () => {
        const {item, calendar, uploadImage} = this.state;
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

            if (Object.keys(item).length > 0) {
                Object.keys(item).map(itemName => {
                    if (item[itemName]) {
                        data[itemName] = item[itemName];
                    }
                });
            }

            let calendarList = [];

            Object.keys(calendar).length > 0 &&
                Object.keys(calendar).map(calendarKey => {
                    const {begin, end} = calendar[calendarKey];

                    let calendarObject = {};

                    if (
                        begin !== undefined &&
                        begin !== null &&
                        begin.isValid()
                    ) {
                        calendarObject['id'] = UUID.v4()
                            .toUpperCase()
                            .replace(/-/g, '');
                        calendarObject['type'] = 'events';
                        calendarObject['content'] = data['id'];
                        calendarObject['c_begin'] = begin.valueOf();

                        if (
                            end !== undefined &&
                            end !== null &&
                            end.isValid()
                        ) {
                            calendarObject['c_end'] = end.valueOf();
                        }
                    }

                    calendarList.push(calendarObject);
                });

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

            let media = {};

            if (uploadImage !== null) {
                media = uploadImage;
            }

            data['media'] = media;

            data['medias'] = [];

            data['calendar'] = calendarList;

            add(data)
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
            },
            op: {
                onHidden: () => navigation.goBack(),
            },
        });
    };

    _renderInputsView = () => {
        const {item} = this.state;

        const {params} = this.props.system;

        const inputs =
            Object.keys(EventsModel).length > 0 &&
            Object.keys(EventsModel).map((itemName, key) => {
                let input;

                const {type, label, choices, multiple, format} = EventsModel[
                    itemName
                ];

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
                    const items = Object.keys(choices).map(choiceName => {
                        return {
                            id: choices[choiceName],
                            name: I18n.t(choiceName),
                        };
                    });

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
                    }}
                    showsVerticalScrollIndicator={false}>
                    {this._renderBanner()}
                    <View style={[Style.column, {padding: SPACE}]}>
                        {this._renderDateTime()}
                        {inputs}
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    };

    _scrollToInput = reactNode => {
        this.keyboard.props.scrollToFocusedInput(reactNode);
    };

    _renderBanner = () => {
        const {localImage} = this.state;

        const data = (
            <TouchableWithoutFeedback onPress={() => this._changeLocalImage()}>
                <View style={[Style.column_center, Style.row_center]}>
                    {localImage !== null ? (
                        <Image
                            source={{uri: localImage}}
                            style={{
                                width: WIDTH,
                                height: BANNER_HEIGHT,
                            }}
                        />
                    ) : (
                        <Image
                            source={require('../../../common/assets/images/splash.jpg')}
                            style={{
                                width: WIDTH,
                                height: BANNER_HEIGHT,
                            }}
                        />
                    )}
                    <MaterialCommunityIcons
                        name="camera"
                        style={[
                            Style.position_absolute,
                            Style.f_color_0,
                            Style.f_size_50,
                        ]}
                    />
                </View>
            </TouchableWithoutFeedback>
        );

        return (
            <View style={[Style.column, Style.m_t_2]}>
                <View
                    style={[
                        Style.row,
                        Style.row_center,
                        Style.column_center,
                        Style.bg_color_gray,
                        {
                            paddingVertical: SPACE * 2,
                        },
                    ]}>
                    <Text
                        style={[
                            Style.f_size_15,
                            Style.f_color_1,
                            Style.f_weight_500,
                        ]}>
                        {I18n.t('common.banner')}
                    </Text>
                </View>
                <View style={[Style.row, Style.column_center]}>{data}</View>
            </View>
        );
    };

    _getCalendarItemKey = () => {
        return UUID.v4()
            .toLowerCase()
            .replace(/-/g, '');
    };

    _newCalendarItem = () => {
        const calendarItemKey = this._getCalendarItemKey();

        return {
            [calendarItemKey]: {
                begin: Moment()
                    .add(1, 'day')
                    .startOf('day')
                    .add(12, 'hours'),
                end: Moment()
                    .add(1, 'day')
                    .startOf('day')
                    .add(14, 'hours'),
            },
        };
    };

    _setCalendar = (calendarItemKey, name, value) => {
        const {calendar} = this.state;

        this.setState(
            {
                calendar: {
                    ...calendar,
                    [calendarItemKey]: {
                        ...calendar[calendarItemKey],
                        [name]: value,
                    },
                },
            },
            () => {
                if (name.toLowerCase() === 'begin') {
                    this._setNav();
                }
            },
        );
    };

    _addCalendarItem = () => {
        const {calendar} = this.state;

        const newItem = this._newCalendarItem();

        this.setState(
            {
                calendar: {
                    ...calendar,
                    ...newItem,
                },
            },
            () => this._setNav(),
        );
    };

    _removeCalendarItem = calendarItemKey => {
        const {calendar} = this.state;

        if (calendar.hasOwnProperty(calendarItemKey)) {
            delete calendar[calendarItemKey];
        }

        this.setState(
            {
                calendar: {
                    ...calendar,
                },
            },
            () => this._setNav(),
        );
    };

    _renderDateTime = () => {
        const {params, locale} = this.props.system;

        const {calendar} = this.state;

        const render =
            Object.keys(calendar).length > 0 &&
            Object.keys(calendar).map((calendarItemKey, key) => {
                return (
                    <View
                        key={key}
                        style={[Style.row, Style.column_center, Style.m_t_2]}>
                        <DatePicker
                            date={calendar[calendarItemKey]['begin']}
                            locale={locale}
                            showIcon={false}
                            hideText={false}
                            mode="datetime"
                            placeholder={I18n.t('common.begin')}
                            format={params['datetime_format']}
                            minDate={calendar[calendarItemKey]['begin'].format(
                                params['datetime_format'],
                            )}
                            confirmBtnText={I18n.t('common.confirm')}
                            cancelBtnText={I18n.t('common.cancel')}
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0,
                                },
                                datePickerCon: {
                                    ...Style.theme_header,
                                },
                                datePicker: {
                                    ...Style.bg_color_15,
                                    ...Style.b_t_0,
                                    ...Style.f_fa_pf,
                                    ...Style.f_size_13,
                                    ...Style.f_color_3,
                                    ...Style.f_weight_400,
                                },
                                btnCancel: {
                                    ...Style.bg_color_gray,
                                },
                                btnTextCancel: {
                                    ...Style.f_fa_pf,
                                    ...Style.f_size_15,
                                    ...Style.f_color_3,
                                    ...Style.f_weight_400,
                                },
                                btnTextConfirm: {
                                    ...Style.f_fa_pf,
                                    ...Style.f_size_15,
                                    ...Style.f_color_3,
                                    ...Style.f_weight_400,
                                },
                                dateInput: {
                                    ...Style.noborder,
                                    ...Style.bg_color_15,
                                    ...Style.row,
                                    ...Style.column_center,
                                    ...Style.row_start,
                                    ...Style.p_2,
                                    ...Style.m_r_2,
                                    height: INPUT_HEIGHT,
                                },
                            }}
                            style={[Style.w_p47]}
                            onDateChange={date => {
                                this._setCalendar(
                                    calendarItemKey,
                                    'begin',
                                    Moment(date, params['datetime_format']),
                                );
                            }}
                        />
                        <DatePicker
                            date={calendar[calendarItemKey]['end']}
                            locale={locale}
                            showIcon={false}
                            hideText={false}
                            mode="datetime"
                            placeholder={I18n.t('common.end')}
                            format={params['datetime_format']}
                            minDate={calendar[calendarItemKey]['end'].format(
                                params['datetime_format'],
                            )}
                            confirmBtnText={I18n.t('common.confirm')}
                            cancelBtnText={I18n.t('common.cancel')}
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0,
                                },
                                datePickerCon: {
                                    ...Style.theme_header,
                                },
                                datePicker: {
                                    ...Style.bg_color_15,
                                    ...Style.b_t_0,
                                    ...Style.f_fa_pf,
                                    ...Style.f_size_13,
                                    ...Style.f_color_3,
                                    ...Style.f_weight_400,
                                },
                                btnCancel: {
                                    ...Style.bg_color_gray,
                                },
                                btnTextCancel: {
                                    ...Style.f_fa_pf,
                                    ...Style.f_size_15,
                                    ...Style.f_color_3,
                                    ...Style.f_weight_400,
                                },
                                btnTextConfirm: {
                                    ...Style.f_fa_pf,
                                    ...Style.f_size_15,
                                    ...Style.f_color_3,
                                    ...Style.f_weight_400,
                                },
                                dateInput: {
                                    ...Style.noborder,
                                    ...Style.bg_color_15,
                                    ...Style.row,
                                    ...Style.column_center,
                                    ...Style.row_start,
                                    ...Style.p_2,
                                    ...Style.m_r_2,
                                    height: INPUT_HEIGHT,
                                },
                            }}
                            style={[Style.w_p47]}
                            onDateChange={date => {
                                this._setCalendar(
                                    calendarItemKey,
                                    'end',
                                    Moment(date, params['datetime_format']),
                                );
                            }}
                        />
                        {key > 0 ? (
                            <FontAwesome5
                                solid
                                onPress={() =>
                                    this._removeCalendarItem(calendarItemKey)
                                }
                                name="calendar-minus"
                                style={[Style.f_color_3, Style.f_size_20]}
                            />
                        ) : (
                            <FontAwesome5
                                solid
                                onPress={() => this._addCalendarItem()}
                                name="calendar-plus"
                                style={[Style.f_color_3, Style.f_size_20]}
                            />
                        )}
                    </View>
                );
            });

        return (
            <View
                style={[
                    Style.column,
                    Style.border_round_1,
                    Style.bg_color_gray,
                    Style.p_2,
                ]}>
                <Text style={[Style.f_size_13, Style.f_color_6]}>
                    {I18n.t('common.calendar')}
                </Text>
                {render}
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
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{vertical: 'never'}}>
                <StatusBar light />
                {this._renderInputsView()}
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
