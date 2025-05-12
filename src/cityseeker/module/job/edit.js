import React, {Component} from 'react';
import {
    View,
    Keyboard,
    TextInput,
    StatusBar,
    TouchableWithoutFeedback,
    Text,
    Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MultiSelect from 'react-native-multiple-select';
import {TextInputMask} from 'react-native-masked-text';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';

import {update} from '../../actions/job';

import {
    Common,
    HIDE_STATUS,
    scrollProps,
    TRANSLUCENT_STATUS,
} from '../../utils/lib';

import LoadingIndicator from '../../components/LoadingIndicator';

import Model from './model';
import Style from '../../style';
import I18n from '../../locale';

const SPACE = 10;
const INPUT_HEIGHT = 40;
const TEXTAREA_HEIGHT = 530;

class Default extends Component {
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
            data: {},
            requiredFields: {},
            receiverFormatError: false,
        };
    }

    componentDidMount() {
        const {navigation} = this.props;

        navigation.addListener('didFocus', () => {
            this._loadTypeConfig();
        });

        navigation.addListener('didBlur', () => {
            this.setState({
                loading: true,
                data: {},
                requiredFields: {},
                receiverFormatError: false,
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

        this._loadTypeConfig();
    }

    _loadTypeConfig = () => {
        const {navigation} = this.props;

        const {data} = navigation.state.params;

        let item = {};

        let requiredFields = {};

        for (let name in Model) {
            const {type, required, multiple} = Model[name];

            const defaultValue =
                type === 'choice' && multiple === true
                    ? []
                    : type === 'number'
                    ? '0.00'
                    : '';

            item[name] = data[name] !== undefined ? data[name] : defaultValue;

            if (required === true) {
                requiredFields[name] = true;
            }
        }

        this.setState({
            data: {
                ...item,
                id: data.id,
            },
            requiredFields: requiredFields,
            loading: false,
        });
    };

    _renderComponent = fieldName => {
        const {data} = this.state;

        let input;

        if (fieldName === 'title') {
            const {required, label, subtitle} = Model[fieldName];

            input = (
                <View style={[Style.row_center, Style.m_b_4]}>
                    {label !== undefined && (
                        <View style={[Style.row, Style.column_center]}>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(label)}
                            </Text>
                            {required !== undefined && required && (
                                <Text
                                    style={[
                                        Style.m_l_1,
                                        Style.f_size_13,
                                        Style.f_color_cityseeker,
                                    ]}>
                                    *
                                </Text>
                            )}
                        </View>
                    )}
                    {subtitle !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_t_1,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_11,
                                    Style.f_color_5,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(subtitle)}
                            </Text>
                        </View>
                    )}
                    <TextInput
                        value={data[fieldName]}
                        editable={true}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        autoFocus={false}
                        spellCheck={false}
                        keyboardType="default"
                        onChangeText={value => {
                            this._onSubmit(fieldName, value);
                        }}
                        style={[
                            Style.flex,
                            Style.f_size_13,
                            Style.f_color_3,
                            Style.f_bold,
                            Style.m_t_1,
                            Style.b,
                            Style.border_round_1,
                            Style.p_2,
                            {
                                height: INPUT_HEIGHT,
                            },
                        ]}
                    />
                </View>
            );
        } else if (fieldName === 'address') {
            const {required, label, subtitle} = Model[fieldName];

            input = (
                <View style={[Style.row_center, Style.m_b_4]}>
                    {label !== undefined && (
                        <View style={[Style.row, Style.column_center]}>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(label)}
                            </Text>
                            {required !== undefined && required && (
                                <Text
                                    style={[
                                        Style.m_l_1,
                                        Style.f_size_13,
                                        Style.f_color_cityseeker,
                                    ]}>
                                    *
                                </Text>
                            )}
                        </View>
                    )}
                    {subtitle !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_t_1,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_11,
                                    Style.f_color_5,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(subtitle)}
                            </Text>
                        </View>
                    )}
                    <TextInput
                        value={data[fieldName]}
                        editable={true}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        autoFocus={false}
                        spellCheck={false}
                        keyboardType="default"
                        onChangeText={value => {
                            this._onSubmit(fieldName, value);
                        }}
                        style={[
                            Style.flex,
                            Style.f_size_13,
                            Style.f_color_3,
                            Style.f_bold,
                            Style.m_t_1,
                            Style.b,
                            Style.border_round_1,
                            Style.p_2,
                            {
                                height: INPUT_HEIGHT,
                            },
                        ]}
                    />
                </View>
            );
        } else if (fieldName === 'type') {
            const {required, label, multiple, choices, subtitle} = Model[
                fieldName
            ];

            const items = Object.keys(choices).map(choiceName => {
                return {
                    id: choices[choiceName],
                    name: I18n.t(choiceName),
                };
            });

            input = (
                <View style={[Style.flex, Style.row_center, Style.m_b_4]}>
                    {label !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_b_1,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(label)}
                            </Text>
                            {required !== undefined && required && (
                                <Text
                                    style={[
                                        Style.m_l_1,
                                        Style.f_size_13,
                                        Style.f_color_cityseeker,
                                    ]}>
                                    *
                                </Text>
                            )}
                        </View>
                    )}
                    {subtitle !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_t_1,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_11,
                                    Style.f_color_5,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(subtitle)}
                            </Text>
                        </View>
                    )}
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
                        selectText={I18n.t('common.select')}
                        searchInputPlaceholderText={I18n.t('common.select')}
                        searchInputStyle={{
                            ...Style.f_size_13,
                            ...Style.f_color_3,
                            ...Style.f_bold,
                            height: INPUT_HEIGHT,
                        }}
                        submitButtonColor={Style.bg_color_3.backgroundColor}
                        submitButtonText={I18n.t('common.submit')}
                        onSelectedItemsChange={selectedItem => {
                            const value = multiple
                                ? selectedItem
                                : selectedItem[0];
                            this._onSubmit(fieldName, value);
                        }}
                        autoFocusInput={false}
                        selectedItems={
                            multiple ? data[fieldName] : [data[fieldName]]
                        }
                    />
                </View>
            );
        } else if (fieldName === 'salary') {
            const {currency} = this.props.system.params;

            const {required, label, subtitle} = Model[fieldName];

            input = (
                <View style={[Style.flex, Style.row_center, Style.m_b_4]}>
                    {label !== undefined && (
                        <View style={[Style.row, Style.column_center]}>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(label)}
                            </Text>
                            {required !== undefined && required && (
                                <Text
                                    style={[
                                        Style.m_l_1,
                                        Style.f_size_13,
                                        Style.f_color_cityseeker,
                                    ]}>
                                    *
                                </Text>
                            )}
                        </View>
                    )}
                    {subtitle !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_t_1,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_11,
                                    Style.f_color_5,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(subtitle)}
                            </Text>
                        </View>
                    )}
                    <View
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.m_t_1,
                            Style.b,
                            Style.border_round_1,
                            {
                                height: INPUT_HEIGHT,
                            },
                        ]}>
                        <View
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                                Style.p_h_1,
                                Style.h_p100,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(currency + '.symbol')}
                            </Text>
                        </View>
                        <TextInputMask
                            value={data[fieldName]}
                            type={'money'}
                            options={{
                                precision: 2,
                                separator: '.',
                                delimiter: ',',
                                unit: '',
                                suffixUnit: '',
                            }}
                            ref={ref => (this[fieldName] = ref)}
                            onChangeText={value => {
                                this._onSubmit(fieldName, value);
                            }}
                            style={[
                                Style.f_size_13,
                                Style.f_color_3,
                                Style.f_bold,
                                Style.b_l_13,
                                Style.b_r_13,
                                Style.p_l_2,
                                Style.h_p100,
                                {
                                    width: Style.w_10.width * 2.7,
                                },
                            ]}
                        />
                        <View
                            style={[
                                Style.row,
                                Style.row_center,
                                Style.column_center,
                            ]}>
                            <MaterialCommunityIcons
                                name={'minus'}
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.p_h_1,
                                ]}
                            />
                        </View>
                        {this._renderComponent('salary_max')}
                        {this._renderComponent('period')}
                    </View>
                </View>
            );
        } else if (fieldName === 'salary_max') {
            const {required, label, subtitle} = Model[fieldName];

            input = (
                <View style={[Style.row_center]}>
                    {label !== undefined && (
                        <View style={[Style.row, Style.column_center]}>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(label)}
                            </Text>
                            {required !== undefined && required && (
                                <Text
                                    style={[
                                        Style.m_l_1,
                                        Style.f_size_13,
                                        Style.f_color_cityseeker,
                                    ]}>
                                    *
                                </Text>
                            )}
                        </View>
                    )}
                    {subtitle !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_t_1,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_11,
                                    Style.f_color_5,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(subtitle)}
                            </Text>
                        </View>
                    )}
                    <TextInputMask
                        value={data[fieldName]}
                        type={'money'}
                        options={{
                            precision: 2,
                            separator: '.',
                            delimiter: ',',
                            unit: '',
                            suffixUnit: '',
                        }}
                        ref={ref => (this[fieldName] = ref)}
                        onChangeText={value => {
                            this._onSubmit(fieldName, value);
                        }}
                        style={[
                            Style.f_size_13,
                            Style.f_color_3,
                            Style.f_bold,
                            Style.b_l_13,
                            Style.b_r_13,
                            Style.p_l_2,
                            Style.h_p100,
                            {
                                width: Style.w_10.width * 2.7,
                            },
                        ]}
                    />
                </View>
            );
        } else if (fieldName === 'period') {
            const {required, label, multiple, choices, subtitle} = Model[
                fieldName
            ];

            const items = Object.keys(choices).map(choiceName => {
                return {
                    id: choices[choiceName],
                    name: I18n.t(choiceName),
                };
            });

            input = (
                <View style={[Style.flex, Style.row_center]}>
                    {label !== undefined && (
                        <View style={[Style.row, Style.column_center]}>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(label)}
                            </Text>
                            {required !== undefined && required && (
                                <Text
                                    style={[
                                        Style.m_l_1,
                                        Style.f_size_13,
                                        Style.f_color_cityseeker,
                                    ]}>
                                    *
                                </Text>
                            )}
                        </View>
                    )}
                    {subtitle !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_t_1,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_11,
                                    Style.f_color_5,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(subtitle)}
                            </Text>
                        </View>
                    )}
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
                        selectText={I18n.t('common.select')}
                        searchInputPlaceholderText={I18n.t('common.select')}
                        searchInputStyle={{
                            ...Style.f_size_13,
                            ...Style.f_color_3,
                            ...Style.f_bold,
                            ...Style.noborder,
                            ...Style.border_round_0,
                            height: INPUT_HEIGHT - 2,
                        }}
                        submitButtonColor={Style.bg_color_3.backgroundColor}
                        submitButtonText={I18n.t('common.submit')}
                        onSelectedItemsChange={selectedItem => {
                            const value = multiple
                                ? selectedItem
                                : selectedItem[0];
                            this._onSubmit(fieldName, value);
                        }}
                        autoFocusInput={false}
                        selectedItems={
                            multiple ? data[fieldName] : [data[fieldName]]
                        }
                    />
                </View>
            );
        } else if (fieldName === 'description') {
            const {required, label, subtitle} = Model[fieldName];

            input = (
                <View style={[Style.row_center, Style.m_b_4]}>
                    {label !== undefined && (
                        <View style={[Style.row, Style.column_center]}>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(label)}
                            </Text>
                            {required !== undefined && required && (
                                <Text
                                    style={[
                                        Style.m_l_1,
                                        Style.f_size_13,
                                        Style.f_color_cityseeker,
                                    ]}>
                                    *
                                </Text>
                            )}
                        </View>
                    )}
                    {subtitle !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_t_1,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_11,
                                    Style.f_color_5,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(subtitle)}
                            </Text>
                        </View>
                    )}
                    <TextInput
                        value={data[fieldName]}
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
                            this._onSubmit(fieldName, value);
                        }}
                        style={[
                            Style.flex,
                            Style.f_size_13,
                            Style.f_color_3,
                            Style.f_bold,
                            Style.m_t_1,
                            Style.b,
                            Style.border_round_1,
                            Style.p_2,
                            {
                                height: TEXTAREA_HEIGHT,
                            },
                        ]}
                    />
                </View>
            );
        } else if (fieldName === 'receiver') {
            const {receiverFormatError} = this.state;

            const {required, label, subtitle} = Model[fieldName];

            input = (
                <View style={[Style.row_center, Style.m_b_4]}>
                    {label !== undefined && (
                        <View style={[Style.row, Style.column_center]}>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(label)}
                            </Text>
                            {required !== undefined && required && (
                                <Text
                                    style={[
                                        Style.m_l_1,
                                        Style.f_size_13,
                                        Style.f_color_cityseeker,
                                    ]}>
                                    *
                                </Text>
                            )}
                        </View>
                    )}
                    {subtitle !== undefined && (
                        <View
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.m_t_1,
                            ]}>
                            <Text
                                style={[
                                    Style.f_size_11,
                                    Style.f_color_5,
                                    Style.f_bold,
                                ]}>
                                {I18n.t(subtitle)}
                            </Text>
                        </View>
                    )}
                    <TextInput
                        value={data[fieldName]}
                        editable={true}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        autoFocus={false}
                        spellCheck={false}
                        keyboardType="email-address"
                        returnKeyType="default"
                        returnKeyLabel={I18n.t('common.save')}
                        onChangeText={value => {
                            this._onSubmit(fieldName, value);
                        }}
                        style={[
                            Style.flex,
                            Style.f_size_13,
                            Style.f_color_3,
                            Style.f_bold,
                            Style.m_t_1,
                            Style.b,
                            Style.border_round_1,
                            Style.p_2,
                            {
                                height: INPUT_HEIGHT,
                            },
                            receiverFormatError && Style.b_cityseeker,
                        ]}
                    />
                </View>
            );
        }

        return input;
    };

    _renderEditor = fieldName => {
        const {selectedTag, selectedStyles, data} = this.state;

        const toolbarButton = [
            Style.f_size_15,
            Style.f_color_5,
            Style.f_weight_500,
            Style.f_fa_pf,
            Style.p_2,
        ];

        return (
            <View style={[Style.flex]}>
                <CNToolbar
                    style={[
                        Style.bg_color_gray,
                        Style.noborder,
                        Style.m_0,
                        Style.p_0,
                        Style.border_round_0,
                        Style.b_b_13,
                        // Style.row,
                        // Style.row_start,
                        // Style.column_center,
                        {
                            // width: 180,
                            // backgroundColor: '#E4E4E4'
                        },
                    ]}
                    iconContainerStyle={[Style.row_start]}
                    selectedBackgroundColor={Style.bg_color_13.backgroundColor}
                    bold={
                        <MaterialCommunityIcons
                            name={'format-bold'}
                            style={toolbarButton}
                        />
                    }
                    italic={
                        <MaterialCommunityIcons
                            name={'format-italic'}
                            style={toolbarButton}
                        />
                    }
                    underline={
                        <MaterialCommunityIcons
                            name={'format-underline'}
                            style={toolbarButton}
                        />
                    }
                    // lineThrough={
                    //     <MaterialCommunityIcons
                    //         name={'format-strikethrough-variant'}
                    //         style={toolbarButton}
                    //     />
                    // }
                    body={
                        <MaterialCommunityIcons
                            name={'format-title'}
                            style={toolbarButton}
                        />
                    }
                    title={
                        <MaterialCommunityIcons
                            name={'format-header-1'}
                            style={toolbarButton}
                        />
                    }
                    heading={
                        <MaterialCommunityIcons
                            name={'format-header-3'}
                            style={toolbarButton}
                        />
                    }
                    ul={
                        <MaterialCommunityIcons
                            name={'format-list-bulleted'}
                            style={toolbarButton}
                        />
                    }
                    // ol={
                    //     <MaterialCommunityIcons
                    //         name={'format-list-numbered'}
                    //         style={toolbarButton}
                    //     />
                    // }
                    selectedTag={selectedTag}
                    selectedStyles={selectedStyles}
                    onStyleKeyPress={toolType => {
                        this.editor.applyToolbar(toolType);
                    }}
                />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[Style.flex, Style.column_stretch]}>
                        <CNRichTextEditor
                            ref={input => (this.editor = input)}
                            onSelectedTagChanged={tag => {
                                this.setState({
                                    selectedTag: tag,
                                });
                            }}
                            onSelectedStyleChanged={styles => {
                                this.setState({
                                    selectedStyles: styles,
                                });
                            }}
                            value={data[fieldName]}
                            style={[
                                Style.bg_color_15,
                                Style.m_0,
                                Style.p_0,
                                {
                                    height: TEXTAREA_HEIGHT,
                                },
                            ]}
                            styleList={defaultStyles}
                            onValueChanged={value => {
                                this._onSubmit(fieldName, value);
                            }}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };

    _setNav = () => {
        const {navigation} = this.props;

        const {data, requiredFields} = this.state;

        let hasError = false;
        for (var fieldName in requiredFields) {
            if (!data[fieldName]) {
                hasError = true;
                break;
            }
        }

        if (hasError === false) {
            navigation.setParams({
                headerRight: (
                    <TouchableWithoutFeedback onPress={this._postRequest}>
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
        const {data} = this.state;

        this.setState(
            {
                data: {
                    ...data,
                    [name]: value,
                },
            },
            () => {
                this._setNav();
            },
        );
    };

    _postRequest = () => {
        const {data} = this.state;
        const {system, account, navigation} = this.props;

        const {area, lat, lng} = system;

        const {country, city} = area;

        if (data['receiver'] !== '' && !Common.isValidEmail(data['receiver'])) {
            this.setState({
                receiverFormatError: true,
            });

            return;
        }

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

        let requestData = {};

        if (!account.isLoggedIn) {
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
                    onHidden: () => {
                        Alert.alert(I18n.t('common.nosignin'), '', [
                            {
                                text: I18n.t('Cancel'),
                                style: 'cancel',
                            },
                            {
                                text: I18n.t('common.signin'),
                                style: 'destructive',
                                onPress: () =>
                                    this.props.navigation.navigate('Signin'),
                            },
                        ]);
                    },
                },
            });
        } else {
            requestData['update_time'] = new Date().getTime();

            if (Object.keys(data).length > 0) {
                Object.keys(data).map(fieldName => {
                    if (fieldName === 'salary' && data[fieldName]) {
                        requestData[fieldName] = this.salary
                            ? this.salary.getRawValue()
                            : 0;
                    } else if (fieldName === 'salary_max' && data[fieldName]) {
                        requestData[fieldName] = this.salary_max
                            ? this.salary_max.getRawValue()
                            : 0;
                    } else if (data[fieldName]) {
                        requestData[fieldName] = data[fieldName];
                    }
                });
            }

            if (country) {
                requestData['country'] = country;
            }

            if (city) {
                requestData['city'] = city;
            }

            if (lat) {
                requestData['lat'] = lat;
            }

            if (lng) {
                requestData['lng'] = lng;
            }

            update(requestData)
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

    render() {
        const {loading} = this.state;

        return loading === true ? (
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
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    {...scrollProps}>
                    <View
                        style={{
                            padding: SPACE * 2,
                        }}>
                        {this._renderComponent('title')}
                        {this._renderComponent('address')}
                        {this._renderComponent('type')}
                        {this._renderComponent('salary')}
                        {this._renderComponent('receiver')}
                        {this._renderComponent('description')}
                    </View>
                </KeyboardAwareScrollView>
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
