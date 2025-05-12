import React from 'react';
import {
    Text,
    View,
    Platform,
    TextInput,
    ScrollView,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Alert,
    Image,
    Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import {TextInputMask} from 'react-native-masked-text';
import MultiSelect from 'react-native-multiple-select';
import {connect} from 'react-redux';
import AutoImageWidth from '../../components/AutoImageWidth';
import Divide from '../../components/Divide';
import {
    update_business,
    update_avator,
    update_cover,
} from '../../actions/business';
import {updateSuccess} from '../../actions/account';
import StatusBar from '../../components/StatusBar';
import BusinessModel from '../../model/business';
import BusinessType from '../../type/business';
import {info} from '../../actions/business';
import {Common} from '../../utils/lib';
import I18n from '../../locale';
import Style from '../../style';

const WIDTH = Dimensions.get('window').width;
const AVATOR_WITH = 50;
const COVER_HEIGHT = 240;

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('app.nav.profile'),
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

        this.state = {
            tagText: '',
            avator: null,
            cover: null,
            user: {},
            stableUser: {},
            loading: true,
        };
    }

    componentDidMount() {
        const {account, navigation} = this.props;

        info({
            where: ["id ='" + account.id + "'"],
        }).then(response => {
            const {status, message} = response;

            const data = message;

            if (parseInt(status) === 1) {
                let user = {};
                Object.keys(BusinessModel.profile).map(name => {
                    const {type, multiple} = BusinessModel.profile[name];
                    const defaultValue =
                        type === 'choice' && multiple === true ? [] : '';
                    user[name] =
                        data[name] !== undefined ? data[name] : defaultValue;
                });

                if (parseInt(data.condition) === 1) {
                    Object.keys(BusinessModel.business).map(name => {
                        if (
                            data.type !== undefined &&
                            name === 'menu' &&
                            data.type !== BusinessType.restaurant &&
                            data.type !== BusinessType.bakery &&
                            data.type !== BusinessType.beverage &&
                            data.type !== BusinessType.brunch &&
                            data.type !== BusinessType.pastry &&
                            data.type !== BusinessType.bar
                        ) {
                            return;
                        }

                        const {type, multiple} = BusinessModel.business[name];
                        const defaultValue =
                            type === 'choice' && multiple === true ? [] : '';
                        user[name] =
                            data[name] !== undefined
                                ? data[name]
                                : defaultValue;
                    });
                } else {
                    Object.keys(BusinessModel.person).map(name => {
                        const {type, multiple} = BusinessModel.person[name];
                        const defaultValue =
                            type === 'choice' && multiple === true ? [] : '';
                        user[name] =
                            data[name] !== undefined
                                ? data[name]
                                : defaultValue;
                    });
                }

                Object.keys(BusinessModel.social).map(name => {
                    const {type, multiple} = BusinessModel.social[name];
                    const defaultValue =
                        type === 'choice' && multiple === true ? [] : '';
                    user[name] =
                        data[name] !== undefined ? data[name] : defaultValue;
                });

                Object.keys(BusinessModel.message).map(name => {
                    const {type, multiple} = BusinessModel.message[name];
                    const defaultValue =
                        type === 'choice' && multiple === true ? [] : '';
                    user[name] =
                        data[name] !== undefined ? data[name] : defaultValue;
                });

                this.setState({
                    avator: data.avator || null,
                    cover: data.cover || null,
                    user: {
                        ...user,
                        id: data.id,
                        uid: data.uid,
                        condition: data.condition,
                    },
                    stableUser: {
                        ...user,
                        id: data.id,
                        uid: data.uid,
                        condition: data.condition,
                    },
                    loading: false,
                });
            } else {
                this.setState({
                    loading: false,
                });
            }
        });

        navigation.setParams({
            headerRight: (
                <View style={[Style.p_r_3, Style.column, Style.column_center]}>
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
            ),
        });
    }

    render() {
        const {loading, user, avator, cover, tagText} = this.state;

        const {params} = this.props.system;

        const profile = Object.keys(BusinessModel.profile).map((name, key) => {
            let input;

            const {
                type,
                label,
                placeholder,
                readonly,
                choices,
                multiple,
            } = BusinessModel.profile[name];

            if (name === 'tag') {
                let tags = [];

                tags = user['tag'] ? [...user['tag']] : [];

                input = (
                    <View style={[Style.column]}>
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.wrap,
                                Style.m_b_2,
                            ]}>
                            {tags.map((tag, index) => (
                                <TouchableWithoutFeedback
                                    key={index}
                                    onPress={() => {
                                        tags.splice(index, 1);
                                        this._onSubmit(name, tags);
                                    }}>
                                    <View
                                        key={index}
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                            Style.bg_color_14,
                                            Style.m_b_1,
                                            Style.m_r_1,
                                            Style.p_1,
                                            Style.border_round_1,
                                        ]}>
                                        <Text
                                            style={[
                                                Style.f_size_10,
                                                Style.f_color_0,
                                                Style.f_weight_400,
                                                Style.m_r_1,
                                            ]}>
                                            {tag}
                                        </Text>
                                        <MaterialCommunityIcons
                                            name="close"
                                            style={[
                                                Style.f_size_13,
                                                Style.f_color_2,
                                            ]}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            ))}
                        </View>
                        <View style={[Style.row, Style.column_center]}>
                            <TextInput
                                value={this.state.tagText}
                                placeholderTextColor={Style.f_color_9.color}
                                disableFullscreenUI={false}
                                multiline={true}
                                style={[
                                    readonly === true
                                        ? Style.f_color_9
                                        : Style.f_color_3,
                                    Style.f_size_13,
                                    Style.w_p100,
                                    Style.input_h,
                                    Style.p_h_2,
                                    Style.border_round_1,
                                    Style.b_half,
                                ]}
                                editable={!readonly}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect={false}
                                autoFocus={false}
                                spellCheck={false}
                                keyboardType="default"
                                onFocus={() => {}}
                                onKeyPress={event => {
                                    const {key} = event.nativeEvent;

                                    const hasSeparator =
                                        key === ',' || key === '，';

                                    if (hasSeparator && tagText !== '') {
                                        this._onSubmit(name, [
                                            ...user[name],
                                            tagText,
                                        ]);
                                    }
                                }}
                                onChange={event => {
                                    const {text} = event.nativeEvent;

                                    const lastString = text.substr(-1);

                                    const hasSeparator =
                                        lastString === ',' ||
                                        lastString === '，';

                                    this.setState({
                                        tagText: hasSeparator ? '' : text,
                                    });
                                }}
                            />
                        </View>
                    </View>
                );
            } else if (type === 'text') {
                input = (
                    <TextInput
                        value={user[name]}
                        placeholder={
                            placeholder !== undefined ? I18n.t(placeholder) : ''
                        }
                        placeholderTextColor={Style.f_color_9.color}
                        disableFullscreenUI={false}
                        multiline={false}
                        style={[
                            readonly === true
                                ? Style.f_color_9
                                : Style.f_color_3,
                            Style.f_size_13,
                            Style.w_p100,
                            Style.input_h,
                            Style.p_h_2,
                            Style.border_round_1,
                            Style.b_half,
                        ]}
                        editable={!readonly}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        autoFocus={false}
                        spellCheck={false}
                        keyboardType="default"
                        onFocus={() => {}}
                        onChangeText={value => {
                            this._onSubmit(name, value);
                        }}
                    />
                );
            } else if (type === 'textarea') {
                input = (
                    <TextInput
                        value={user[name]}
                        textAlignVertical="top"
                        placeholderTextColor={Style.f_color_9.color}
                        disableFullscreenUI={false}
                        multiline={true}
                        style={[
                            readonly === true
                                ? Style.f_color_9
                                : Style.f_color_3,
                            Style.f_size_13,
                            Style.w_p100,
                            Style.textarea_h,
                            Style.p_h_2,
                            Style.border_round_1,
                            Style.b_half,
                        ]}
                        editable={!readonly}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        autoFocus={false}
                        spellCheck={false}
                        keyboardType="default"
                        onFocus={() => {}}
                        onChangeText={value => {
                            this._onSubmit(name, value);
                        }}
                    />
                );
            }

            return (
                <View
                    key={key}
                    style={[
                        type === 'choice' || type === 'textarea'
                            ? Style.column_start
                            : Style.column_center,
                        Style.row,
                        Style.p_h_2,
                        Style.p_v_1,
                    ]}>
                    <View style={[Style.w_p25]}>
                        <Text numberOfLines={1}>{I18n.t(label)}</Text>
                    </View>
                    <View style={[Style.flex]}>{input}</View>
                </View>
            );
        });

        const p_b =
            parseInt(user.condition) === 1
                ? BusinessModel.business
                : BusinessModel.person;

        const person = Object.keys(p_b).map((name, key) => {
            let input;

            const {
                type,
                placeholder,
                label,
                format,
                readonly,
                choices,
                multiple,
            } = p_b[name];

            if (type === 'text') {
                input = (
                    <TextInput
                        value={
                            name === 'type'
                                ? I18n.t('type.' + user[name])
                                : user[name]
                        }
                        placeholder={
                            placeholder !== undefined ? I18n.t(placeholder) : ''
                        }
                        placeholderTextColor={Style.f_color_9.color}
                        disableFullscreenUI={false}
                        multiline={false}
                        style={[
                            readonly === true
                                ? Style.f_color_9
                                : Style.f_color_3,
                            Style.f_size_13,
                            Style.w_p100,
                            Style.input_h,
                            Style.p_h_2,
                            Style.border_round_1,
                            readonly === true ? Style.noborder : Style.b_half,
                        ]}
                        editable={!readonly}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        autoFocus={false}
                        spellCheck={false}
                        keyboardType="default"
                        onFocus={() => {}}
                        onChangeText={value => {
                            this._onSubmit(name, value);
                        }}
                    />
                );
            } else if (type === 'textarea') {
                input = (
                    <TextInput
                        value={user[name]}
                        textAlignVertical="top"
                        placeholderTextColor={Style.f_color_9.color}
                        disableFullscreenUI={false}
                        multiline={true}
                        style={[
                            readonly === true
                                ? Style.f_color_9
                                : Style.f_color_3,
                            Style.f_size_13,
                            Style.w_p100,
                            Style.textarea_h,
                            Style.p_h_2,
                            Style.border_round_1,
                            Style.b_half,
                        ]}
                        editable={!readonly}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        autoFocus={false}
                        spellCheck={false}
                        keyboardType="default"
                        onFocus={() => {}}
                        onChangeText={value => {
                            this._onSubmit(name, value);
                        }}
                    />
                );
            } else if (type === 'choice') {
                let items = [];

                if (name === 'city') {
                    items = Object.keys(
                        BusinessModel.business.city.choices[
                            user.country.toUpperCase()
                        ],
                    ).map(choiceName => {
                        return {
                            id:
                                p_b['city']['choices'][
                                    user.country.toUpperCase()
                                ][choiceName],
                            name: I18n.t(choiceName),
                        };
                    });
                } else {
                    items = Object.keys(choices).map(choiceName => {
                        return {
                            id: choices[choiceName],
                            name: I18n.t(
                                name === 'country'
                                    ? choiceName.toUpperCase()
                                    : choiceName,
                            ),
                        };
                    });
                }

                input = (
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
                        selectedItemTextColor={Style.f_color_wechat.color}
                        selectedItemIconColor={Style.f_color_wechat.color}
                        searchInputPlaceholderText={I18n.t(label)}
                        searchInputStyle={{
                            ...Style.input_h,
                            ...Style.f_size_13,
                            ...Style.border_round_1,
                            ...Style.bg_color_gray,
                            ...Style.w_100,
                            ...Style.p_0,
                            color:
                                readonly === true
                                    ? Style.f_color_9.color
                                    : Style.f_color_3.color,
                        }}
                        submitButtonColor={Style.bg_color_3.backgroundColor}
                        submitButtonText={I18n.t('common.submit')}
                        selectText={I18n.t(label)}
                        onSelectedItemsChange={selectedItem => {
                            const value = multiple
                                ? selectedItem
                                : selectedItem[0];
                            this._onSubmit(name, value);
                        }}
                        selectedItems={multiple ? user[name] : [user[name]]}
                        autoFocusInput={false}
                    />
                );
            } else if (type === 'datetime') {
                input = (
                    <TextInputMask
                        type={'datetime'}
                        options={{
                            format: format,
                        }}
                        placeholder={format}
                        placeholderTextColor={Style.f_color_9.color}
                        value={user[name]}
                        onChangeText={value => {
                            this._onSubmit(name, value);
                        }}
                        style={[
                            readonly === true
                                ? Style.f_color_9
                                : Style.f_color_3,
                            Style.f_size_13,
                            Style.w_p100,
                            Style.input_h,
                            Style.p_h_2,
                            Style.border_round_1,
                            Style.b_half,
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
                        value={user[name]}
                        onChangeText={value => {
                            this._onSubmit(name, value);
                        }}
                        style={[
                            readonly === true
                                ? Style.f_color_9
                                : Style.f_color_3,
                            Style.f_size_13,
                            Style.w_p100,
                            Style.input_h,
                            Style.p_h_2,
                            Style.border_round_1,
                            Style.b_half,
                        ]}
                    />
                );
            }

            return (
                <View
                    key={key}
                    style={[
                        type === 'choice' || type === 'textarea'
                            ? Style.column_start
                            : Style.column_center,
                        Style.row,
                        Style.p_h_2,
                        Style.p_v_1,
                    ]}>
                    <View style={[Style.w_p25]}>
                        <Text numberOfLines={1}>{I18n.t(label)}</Text>
                    </View>
                    <View style={[Style.w_p75]}>{input}</View>
                </View>
            );
        });

        const social = Object.keys(BusinessModel.social).map((name, key) => {
            let input;

            const {
                type,
                placeholder,
                label,
                readonly,
                choices,
                multiple,
            } = BusinessModel.social[name];

            if (type === 'text') {
                input = (
                    <TextInput
                        value={user[name]}
                        placeholder={
                            placeholder !== undefined ? I18n.t(placeholder) : ''
                        }
                        placeholderTextColor={Style.f_color_9.color}
                        disableFullscreenUI={false}
                        multiline={false}
                        style={[
                            Style.f_size_13,
                            Style.f_color_3,
                            Style.w_p100,
                            Style.input_h,
                            Style.p_h_2,
                            Style.border_round_1,
                            Style.b_half,
                        ]}
                        editable={!readonly}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        autoFocus={false}
                        spellCheck={false}
                        keyboardType="default"
                        onFocus={() => {}}
                        onChangeText={value => {
                            this._onSubmit(name, value);
                        }}
                    />
                );
            }

            return (
                <View
                    key={key}
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.p_h_2,
                        Style.p_v_1,
                    ]}>
                    <View style={[Style.w_p25]}>
                        <Text numberOfLines={1}>{I18n.t(label)}</Text>
                    </View>
                    <View style={[Style.w_p75]}>{input}</View>
                </View>
            );
        });

        const message = Object.keys(BusinessModel.message).map((name, key) => {
            let input;

            const {
                type,
                placeholder,
                label,
                readonly,
                choices,
                multiple,
            } = BusinessModel.message[name];

            if (type === 'text') {
                input = (
                    <TextInput
                        value={user[name]}
                        placeholder={
                            placeholder !== undefined ? I18n.t(placeholder) : ''
                        }
                        placeholderTextColor={Style.f_color_9.color}
                        disableFullscreenUI={false}
                        multiline={false}
                        style={[
                            Style.f_size_13,
                            Style.f_color_3,
                            Style.w_p100,
                            Style.input_h,
                            Style.p_h_2,
                            Style.border_round_1,
                            Style.b,
                        ]}
                        editable={!readonly}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        autoFocus={false}
                        spellCheck={false}
                        keyboardType="default"
                        onFocus={() => {}}
                        onChangeText={value => {
                            this._onSubmit(name, value);
                        }}
                    />
                );
            }

            return (
                <View
                    key={key}
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.p_h_2,
                        Style.p_v_1,
                    ]}>
                    <View style={[Style.w_p25]}>
                        <Text numberOfLines={1}>{I18n.t(label)}</Text>
                    </View>
                    <View style={[Style.w_p75]}>{input}</View>
                </View>
            );
        });

        return loading === true ? (
            <ActivityIndicator
                size="small"
                color={Style.f_color_cityseeker.color}
            />
        ) : (
            <View style={[Style.theme_content]}>
                <StatusBar light />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableWithoutFeedback
                        onPress={() => this._openAlbumPicker('cover')}>
                        <View style={[Style.column_center, Style.row_center]}>
                            {cover !== null ? (
                                <AutoImageWidth
                                    uri={Common.load_image(cover)}
                                    p_width={WIDTH}
                                    p_style={{
                                        width: WIDTH,
                                        height: COVER_HEIGHT,
                                    }}
                                />
                            ) : (
                                <Image
                                    source={require('../../../common/assets/images/splash.jpg')}
                                    style={{
                                        width: WIDTH,
                                        height: COVER_HEIGHT,
                                    }}
                                />
                            )}
                            <MaterialCommunityIcons
                                name="camera"
                                style={[
                                    Style.position_absolute,
                                    Style.f_color_0,
                                    Style.f_size_30,
                                ]}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => this._openAlbumPicker('avator')}>
                        <View
                            style={[
                                Style.position_absolute,
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.bg_color_15,
                                Style.border_round_6,
                                Style.b_15,
                                Style.m_l_2,
                                {
                                    zIndex: 2,
                                    width: AVATOR_WITH + 8,
                                    height: AVATOR_WITH + 8,
                                    padding: 4,
                                    top: COVER_HEIGHT - AVATOR_WITH / 2,
                                },
                            ]}>
                            <Image
                                source={Common.avator(
                                    avator !== null ? avator : user,
                                )}
                                style={{
                                    width: AVATOR_WITH,
                                    height: AVATOR_WITH,
                                    borderRadius: AVATOR_WITH / 2,
                                }}
                            />
                            <MaterialCommunityIcons
                                name="camera"
                                style={[
                                    Style.position_absolute,
                                    Style.f_color_0,
                                    Style.f_size_25,
                                ]}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <KeyboardAwareScrollView extraHeight={COVER_HEIGHT}>
                        <View
                            style={[
                                Style.column,
                                Style.theme_content,
                                Style.p_b_8,
                                {
                                    marginTop: AVATOR_WITH,
                                },
                            ]}>
                            {profile && profile.length > 0 && (
                                <View style={[Style.column, Style.p_b_1]}>
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                            {
                                                borderLeftWidth: 3,
                                                borderLeftColor: 'red',
                                            },
                                        ]}>
                                        <Text
                                            style={[
                                                Style.p_2,
                                                Style.f_size_15,
                                                Style.f_color_3,
                                            ]}>
                                            {I18n.t('app.nav.profile')}
                                        </Text>
                                    </View>
                                    {profile}
                                </View>
                            )}
                            {person && person.length > 0 && (
                                <View style={[Style.column, Style.p_b_1]}>
                                    <Divide
                                        style={{
                                            ...Style.p_b_3,
                                            ...Style.h_0,
                                            ...Style.bg_color_14,
                                        }}
                                    />
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                            {
                                                borderLeftWidth: 3,
                                                borderLeftColor: 'red',
                                            },
                                        ]}>
                                        <Text
                                            style={[
                                                Style.p_2,
                                                Style.f_size_15,
                                                Style.f_color_3,
                                            ]}>
                                            {parseInt(user.condition) === 1
                                                ? I18n.t('app.nav.business')
                                                : I18n.t('app.nav.person')}
                                        </Text>
                                    </View>
                                    {person}
                                </View>
                            )}
                            {social && social.length > 0 && (
                                <View style={[Style.column, Style.p_b_1]}>
                                    <Divide
                                        style={{
                                            ...Style.p_b_3,
                                            ...Style.h_0,
                                            ...Style.bg_color_14,
                                        }}
                                    />
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                            {
                                                borderLeftWidth: 3,
                                                borderLeftColor: 'red',
                                            },
                                        ]}>
                                        <Text
                                            style={[
                                                Style.p_2,
                                                Style.f_size_15,
                                                Style.f_color_3,
                                            ]}>
                                            {I18n.t('app.nav.social')}
                                        </Text>
                                    </View>
                                    {social}
                                </View>
                            )}
                            {message && message.length > 0 && (
                                <View style={[Style.column, Style.p_b_1]}>
                                    <Divide
                                        style={{
                                            ...Style.p_b_3,
                                            ...Style.h_0,
                                            ...Style.bg_color_14,
                                        }}
                                    />
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                            {
                                                borderLeftWidth: 3,
                                                borderLeftColor: 'red',
                                            },
                                        ]}>
                                        <Text
                                            style={[
                                                Style.p_2,
                                                Style.f_size_15,
                                                Style.f_color_3,
                                            ]}>
                                            {I18n.t('app.nav.message')}
                                        </Text>
                                    </View>
                                    {message}
                                </View>
                            )}
                        </View>
                    </KeyboardAwareScrollView>
                </ScrollView>
            </View>
        );
    }

    _onSubmit = (name, value) => {
        const {user, stableUser} = this.state;
        const {navigation} = this.props;

        this.setState(
            {
                user: {
                    ...user,
                    [name]: value,
                },
            },
            () => {
                if (value !== stableUser[name]) {
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
                        ),
                    });
                }
            },
        );
    };

    _postRequest = () => {
        const {user} = this.state;
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
                            {I18n.t('common.save') + '...'}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            ),
        });

        if (!account.isLoggedIn) {
            Alert.alert(I18n.t('common.nosignin'), '', [
                {text: I18n.t('common.cancel')},
                {
                    text: I18n.t('account.signin'),
                    onPress: () => navigation.navigate('Signin'),
                },
            ]);
        } else {
            if (user.hasOwnProperty('password')) {
                delete user.password;
            }

            update_business(user).then(response => {
                const {status, message} = response;

                if (status) {
                    this.props.dispatch(updateSuccess(message));

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
                                navigation.dismiss();
                                navigation.toggleDrawer();
                            },
                        },
                    });
                } else {
                    this._postError();
                }
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
                onHidden: () => {
                    navigation.dismiss();
                    navigation.toggleDrawer();
                },
            },
        });
    };

    _openAlbumPicker = name => {
        const {user} = this.state;

        const cropping = name === 'avator' ? true : false;
        const cropperCircleOverlay = name === 'avator' ? true : false;
        const width = name === 'avator' ? 400 : 960;
        const height = name === 'avator' ? 400 : 640;

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
                let data = {
                    id: user.id,
                    media: {
                        mime: image.mime,
                        base64: image.data,
                    },
                };

                if (name === 'avator') {
                    update_avator(data).then(response => {
                        const {status, message} = response;

                        if (status) {
                            this.props.dispatch(
                                updateSuccess({avator: message}),
                            );
                            this.setState({
                                avator: message,
                            });
                        }
                    });
                } else if (name === 'cover') {
                    update_cover(data).then(response => {
                        const {status, message} = response;

                        if (status) {
                            this.props.dispatch(
                                updateSuccess({cover: message}),
                            );
                            this.setState({
                                cover: message,
                            });
                        }
                    });
                }
            })
            .catch(error => {});

        ImagePicker.clean();
    };
}

function mapStateToProps(state) {
    return {
        account: state.account,
        system: state.system,
    };
}

export default connect(mapStateToProps)(Default);
