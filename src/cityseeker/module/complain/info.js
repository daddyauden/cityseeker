import React from 'react';
import {
    View,
    Text,
    StatusBar,
    ScrollView,
    TouchableWithoutFeedback,
    TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-navigation';
import UUID from 'react-native-uuid';

import {
    HIDE_STATUS,
    scrollProps,
    TRANSLUCENT_STATUS,
    Common,
} from '../../utils/lib';

import Divide from '../../components/Divide';

import CellType from '../../type/cell';
import FeedCell from '../../cells/feed';
import UserCell from './cell/user';

import BusinessModel from './model/business';
import UserModel from './model/user';
import InfoModel from './model/info';

import {add} from '../../actions/complain';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('module.complain'),
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
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            category: '',
            note: '',
        };
    }

    _submit = () => {
        const {type, data} = this.props.navigation.state.params;
        const {category, note} = this.state;
        const {account, system, navigation} = this.props;

        const {area, lat, lng} = system;

        const {country, city} = area;

        let requestData = {};

        requestData['id'] = UUID.v4()
            .toUpperCase()
            .replace(/-/g, '');

        if (account.isLoggedIn) {
            requestData['business'] = account.id;
        }

        requestData['category'] = category || '';
        requestData['note'] = note || '';

        requestData['type'] = type || '';
        requestData['content'] = data.id || '';

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

        add(requestData).then(response => {
            Common.showToast({
                message: I18n.t('module.complain.success'),
                style: {
                    ...Style.bg_color_green,
                },
                op: {
                    onHidden: () => navigation.goBack(),
                },
            });
        });
    };

    _renderSubmit = () => {
        const {category} = this.state;

        return (
            <View
                style={[
                    Style.row,
                    Style.column_center,
                    Style.row_center,
                    Style.m_v_6,
                ]}>
                <TouchableWithoutFeedback
                    onPress={category ? this._submit : () => {}}>
                    <Text
                        style={[
                            category ? Style.bg_color_green : Style.bg_color_10,
                            Style.f_size_15,
                            Style.f_color_15,
                            Style.f_weight_500,
                            Style.f_fa_pf,
                            Style.p_h_4,
                            Style.p_v_2,
                            Style.border_round_1,
                        ]}>
                        {I18n.t('common.submit')}
                    </Text>
                </TouchableWithoutFeedback>
            </View>
        );
    };

    _updateCategory = category => {
        this.setState({category});
    };

    _renderContent = () => {
        const {type, data} = this.props.navigation.state.params;

        if (type === CellType.feed) {
            return <FeedCell data={data} {...this.props} />;
        } else if (type === CellType.business || type === CellType.user) {
            return <UserCell data={data} {...this.props} />;
        }
    };

    _renderComplain = () => {
        const {category} = this.state;

        const {type} = this.props.navigation.state.params;

        let model = [];

        let render;

        if (type === CellType.feed) {
            for (let category in InfoModel) {
                model.push({
                    category: category,
                    label: I18n.t(InfoModel[category]['label']),
                });
            }
        } else if (type === CellType.business) {
            for (let category in BusinessModel) {
                model.push({
                    category: category,
                    label: I18n.t(BusinessModel[category]['label']),
                });
            }
        } else if (type === CellType.user) {
            for (let category in UserModel) {
                model.push({
                    category: category,
                    label: I18n.t(UserModel[category]['label']),
                });
            }
        }

        render =
            model.length > 0
                ? model.map((data, key) => {
                      return (
                          <TouchableWithoutFeedback
                              key={key}
                              onPress={() =>
                                  this._updateCategory(data.category)
                              }>
                              <View
                                  style={[
                                      Style.p_h_3,
                                      Style.row,
                                      Style.column_center,
                                      Style.row_between,
                                      Style.b_b,
                                      {
                                          height: 60,
                                      },
                                  ]}>
                                  <Text
                                      style={[
                                          Style.flex,
                                          Style.f_size_13,
                                          Style.f_color_3,
                                          Style.m_r_2,
                                      ]}>
                                      {data.label}
                                  </Text>
                                  {category === data.category && (
                                      <MaterialCommunityIcons
                                          name="check"
                                          style={[
                                              Style.f_size_20,
                                              Style.f_color_green,
                                          ]}
                                      />
                                  )}
                              </View>
                          </TouchableWithoutFeedback>
                      );
                  })
                : null;

        return (
            <View>
                {render}
                <TextInput
                    disableFullscreenUI={false}
                    multiline={true}
                    placeholder={I18n.t('common.note')}
                    placeholderTextColor={Style.f_color_9.color}
                    style={[
                        Style.f_size_13,
                        Style.f_color_5,
                        Style.f_weight_400,
                        Style.f_fa_pf,
                        Style.l_h_4,
                        Style.w_p100,
                        Style.p_3,
                        Style.bg_color_gray,
                        {
                            height: 100,
                        },
                    ]}
                    editable={true}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    autoFocus={false}
                    spellCheck={false}
                    keyboardType={'default'}
                    onChangeText={value => {
                        this.setState({
                            note: value,
                        });
                    }}
                />
            </View>
        );
    };

    render() {
        return (
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
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                    <ScrollView
                        automaticallyAdjustContentInsets={true}
                        showsVerticalScrollIndicator={false}
                        {...scrollProps}>
                        <View
                            style={[Style.flex, Style.bg_color_15, Style.p_1]}>
                            {this._renderContent()}
                        </View>
                        <Divide
                            style={{
                                ...Style.p_b_1,
                                ...Style.h_4,
                                ...Style.bg_color_14,
                            }}
                        />
                        {this._renderComplain()}
                        {this._renderSubmit()}
                    </ScrollView>
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
