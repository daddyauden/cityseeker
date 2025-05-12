import React from 'react';
import {
    Text,
    View,
    StatusBar,
    TextInput,
    findNodeHandle,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInputMask} from 'react-native-masked-text';
import MultiSelect from 'react-native-multiple-select';
import {Header} from 'react-navigation';
import {connect} from 'react-redux';

import {update} from '../../actions/item';

import {Common, HIDE_STATUS, TRANSLUCENT_STATUS} from '../../utils/lib';
import BusinessType from '../../type/business';
import ItemModel from '../../model/item';
import I18n from '../../locale';
import Style from '../../style';

const INPUT_HEIGHT = 40;
const TEXTAREA_HEIGHT = 130;

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: (
                <View
                    style={[Style.row, Style.row_center, Style.column_center]}>
                    <Text
                        style={[
                            Style.f_size_15,
                            Style.f_color_3,
                            Style.f_bolder,
                        ]}>
                        {I18n.t('common.edit')}
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
            loading: true,
            type: null,
            item: {},
            stableItem: {},
            showItems: {},
            requiredFields: {},
            toolboxHeight: 0,
        };
    }

    componentDidMount() {
        const {navigation} = this.props;

        navigation.addListener('didFocus', () => {
            this._loadTypeConfig();
        });

        navigation.addListener('didBlur', () => {
            this.setState({
                loading: false,
                type: null,
                item: {},
                stableItem: {},
                showItems: {},
                requiredFields: {},
                localImages: {},
                uploadImages: {},
            });
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

        this._loadTypeConfig();
    }

    _loadTypeConfig = () => {
        const {navigation} = this.props;

        const {data} = navigation.state.params;

        let type =
            data.type !== undefined && data.type !== null && data.type
                ? data.type.toLowerCase()
                : '';

        let item = {};
        let showItems = {};
        // marked which field is required true
        let requiredFields = {};
        // item config from file base on item type
        let attrs = {};

        if (type !== '' && ItemModel.hasOwnProperty(type)) {
            attrs = ItemModel[type];
        }

        for (let name in attrs) {
            const {type, required, multiple} = attrs[name];

            const defaultValue =
                type === 'choice' && multiple === true
                    ? []
                    : type === 'number'
                    ? 0
                    : '';

            item[name] = data[name] !== undefined ? data[name] : defaultValue;

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
            item: {
                ...item,
                id: data.id,
                type: type,
            },
            stableItem: {
                ...item,
                id: data.id,
                type: type,
            },
            showItems: showItems,
            requiredFields: requiredFields,
        });
    };

    _onSubmit = (name, value) => {
        const {item, type} = this.state;

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
                        this._setNav(name, value);
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
                        this._setNav(name, value);
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
                        this._setNav(name, value);
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
                    this._setNav(name, value);
                },
            );
        }
    };

    _setNav = (name, value) => {
        const {navigation} = this.props;

        const {item, stableItem, requiredFields} = this.state;

        let hasError = value !== stableItem[name] ? false : true;

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
    };

    _postRequest = () => {
        const {item} = this.state;
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
                    onHidden: () => navigation.navigate('Signin'),
                },
                config: {
                    duration: 2000,
                    position: Common.isIphoneX()
                        ? Header.HEIGHT + 25
                        : Header.HEIGHT,
                },
            });
        } else {
            item['update_time'] = new Date().getTime();
            update(item)
                .then(response => {
                    const {status} = response;

                    if (status === 1) {
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
                                onHidden: () =>
                                    navigation.navigate('AccountTab'),
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
        const {item, type} = this.state;

        const {params} = this.props.system;

        const itemModel = ItemModel[type];

        const inputs =
            Object.keys(item).length > 0 &&
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

                if (type === 'text') {
                    input = (
                        <TextInput
                            value={item[itemName]}
                            multiline={itemName === 'name' ? true : false}
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
                            value={item[itemName]}
                            textAlignVertical="top"
                            disableFullscreenUI={false}
                            multiline={true}
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
                            itemModel[itemName]['choices'][item.country];

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
                            value={item[itemName]}
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
                            value={item[itemName]}
                            options={{
                                maskType: 'BRL',
                                withDDD: true,
                                dddMask: params['phone_format'],
                            }}
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
                            value={'' + item[itemName]}
                            multiline={false}
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
                            type === 'textarea'
                                ? Style.column_start
                                : Style.column_center,
                        ]}>
                        <Text
                            numberOfLines={2}
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.wrap,
                                Style.f_size_13,
                                Style.f_color_9,
                                Style.f_weight_400,
                                Style.w_p30,
                                {
                                    lineHeight: 18,
                                    paddingTop: type === 'textarea' ? 10 : 0,
                                },
                            ]}>
                            {I18n.t(label)}
                        </Text>
                        {input}
                    </View>
                );
            });

        return (
            <View style={[Style.column, Style.p_h_2, Style.m_b_6]}>
                <KeyboardAwareScrollView
                    innerRef={ref => {
                        this.keyboard = ref;
                    }}>
                    {inputs}
                </KeyboardAwareScrollView>
            </View>
        );
    };

    _scrollToInput = reactNode => {
        this.keyboard.props.scrollToFocusedInput(reactNode);
    };

    render() {
        return this.state.loading === true ? (
            <ActivityIndicator
                size="small"
                color={Style.f_color_cityseeker.color}
            />
        ) : (
            <View style={[Style.theme_content]}>
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

export default connect(mapStateToProps)(Default);
