import React, {Component} from 'react';
import {Text, View, TextInput, TouchableWithoutFeedback} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import equal from 'deep-equal';
import FlatListView from '../../components/FlatListView';
import StatusBar from '../../components/StatusBar';
import {Icon} from '../../../common/lib/icon';
import CellType from '../../type/cell';
import I18n from '../../locale';
import Style from '../../style';

class Default extends Component {
    static navigationOptions = () => {
        return {
            header: null,
        };
    };

    _searchTextInput = null;

    constructor(props) {
        super(props);

        this.state = {
            submited: false,
            searchQuery: null,
            where: [],
            cellType: props.navigation.getParam('cellType', 'business'),
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {where, submited, searchQuery} = this.state;

        if (!equal(where, nextState.where)) {
            return true;
        } else if (!equal(submited, nextState.submited)) {
            return true;
        } else if (!equal(searchQuery, nextState.searchQuery)) {
            return true;
        }

        return false;
    }

    _onChange = () => {
        const {submited} = this.state;

        submited &&
            this.setState({
                submited: false,
            });
    };

    _onChangeText = searchQuery => {
        this.setState({searchQuery});
    };

    _onEndEditing = this._onSubmitEditing;

    _onKeyPress = event => {
        const {key} = event.nativeEvent;

        if (key === 'Backspace') {
            this.setState({
                submited: false,
            });
        }
    };

    _onSubmitEditing = () => {
        const {navigation} = this.props;
        const {searchQuery, cellType} = this.state;

        const keywordFieldName =
            cellType === CellType.business || cellType === CellType.item
                ? 'name'
                : 'title';

        const whereArr = navigation.getParam('where', []);

        if (searchQuery.trim()) {
            const keywordArr = searchQuery
                .trim()
                .toLowerCase()
                .split(/[\s*|,|，]/);

            const keywords =
                keywordArr.length > 0
                    ? '(' +
                      keywordArr
                          .map(keywordItem => {
                              return keywordItem
                                  ? 'LOWER(' +
                                        keywordFieldName.toLowerCase() +
                                        ") LIKE '%" +
                                        keywordItem.trim() +
                                        "%'"
                                  : null;
                          })
                          .join(' OR ') +
                      ')'
                    : [];

            this.setState({
                where: whereArr.concat([keywords]),
                submited: true,
            });
        }
    };

    render() {
        const {searchQuery, submited, where} = this.state;

        const {navigation} = this.props;

        return (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{
                    bottom: 'never',
                }}>
                <StatusBar light />
                <View
                    style={[
                        Style.shadow,
                        Style.p_h_3,
                        Style.row,
                        Style.column_center,
                        Style.m_b_2,
                        Style.bg_color_15,
                    ]}>
                    <Icon
                        name="magnifier"
                        style={[Style.f_size_20, Style.f_color_9]}
                    />
                    <TextInput
                        ref={_ref => (this._searchTextInput = _ref)}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        autoFocus={true}
                        blurOnSubmit={true}
                        caretHidden={false}
                        clearButtonMode="while-editing"
                        while-editing={true}
                        contextMenuHidden={false}
                        editable={true}
                        enablesReturnKeyAutomatically={true}
                        keyboardAppearance="light"
                        keyboardType="default"
                        onChange={this._onChange}
                        onChangeText={this._onChangeText}
                        onEndEditing={this._onEndEditing}
                        onKeyPress={this._onKeyPress}
                        onSubmitEditing={this._onSubmitEditing}
                        placeholder={I18n.t('common.search')}
                        placeholderTextColor={Style.f_color_9.color}
                        returnKeyLabel={I18n.t('common.search')}
                        returnKeyType="search"
                        selectionColor={Style.f_color_6.color}
                        spellCheck={false}
                        style={[
                            Style.flex,
                            Style.m_l_2,
                            Style.p_v_2,
                            Style.f_color_3,
                            Style.f_size_15,
                            Style.f_weight_500,
                            Style.f_fa_pf,
                        ]}
                        underlineColorAndroid="transparent"
                        value={searchQuery}
                    />
                    <TouchableWithoutFeedback
                        onPress={() => navigation.goBack()}>
                        <View style={[Style.row, Style.p_l_2]}>
                            <Text
                                style={[
                                    Style.f_size_15,
                                    Style.f_color_5,
                                    Style.f_bold,
                                ]}>
                                {I18n.t('common.cancel')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {submited === true && (
                    <FlatListView
                        {...navigation.state.params}
                        where={where}
                        reloadToken={searchQuery}
                    />
                )}
            </SafeAreaView>
        );
    }
}

export default Default;
