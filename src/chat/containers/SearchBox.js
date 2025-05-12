import React from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';

import I18n from '../i18n';
import {isIOS} from '../utils/deviceInfo';
import {CustomIcon} from '../lib/Icons';
import sharedStyles from '../views/Styles';

import Style from '../style';

const styles = StyleSheet.create({
    container: {
        backgroundColor: isIOS ? '#F7F8FA' : '#54585E',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    searchBox: {
        alignItems: 'center',
        backgroundColor: '#E1E5E8',
        borderRadius: 10,
        color: '#8E8E93',
        flexDirection: 'row',
        fontSize: 17,
        height: 36,
        margin: 16,
        marginVertical: 10,
        paddingHorizontal: 10,
        flex: 1,
    },
    input: {
        color: '#8E8E93',
        flex: 1,
        fontSize: 17,
        marginLeft: 8,
        paddingTop: 0,
        paddingBottom: 0,
        ...sharedStyles.textRegular,
    },
    cancel: {
        marginRight: 10,
    },
    cancelText: {
        ...sharedStyles.textRegular,
        ...sharedStyles.textColorHeaderBack,
        fontSize: 17,
    },
});

const CancelButton = onCancelPress => (
    <Touchable onPress={onCancelPress}>
        <View style={[Style.row, Style.p_l_2]}>
            <Text style={[Style.f_size_15, Style.f_color_5, Style.f_bold]}>
                {I18n.t('Cancel')}
            </Text>
        </View>
    </Touchable>
);

const SearchBox = ({
    onChangeText,
    onSubmitEditing,
    testID,
    hasCancel,
    onCancelPress,
    ...props
}) => (
    <View style={[Style.flex, Style.theme_content]}>
        <View
            style={[
                Style.shadow,
                Style.p_h_3,
                Style.row,
                Style.column_center,
                Style.m_b_2,
                Style.bg_color_15,
            ]}>
            <CustomIcon
                name="magnifier"
                style={[Style.f_size_20, Style.f_color_9]}
            />
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit
                clearButtonMode="while-editing"
                placeholder={I18n.t('Search')}
                returnKeyType="search"
                style={[
                    Style.flex,
                    Style.m_l_2,
                    Style.p_v_2,
                    Style.f_color_3,
                    Style.f_size_15,
                    Style.f_bold,
                ]}
                testID={testID}
                underlineColorAndroid="transparent"
                onChangeText={onChangeText}
                onSubmitEditing={onSubmitEditing}
                {...props}
            />
            {hasCancel ? CancelButton(onCancelPress) : null}
        </View>
    </View>
);

SearchBox.propTypes = {
    onChangeText: PropTypes.func.isRequired,
    onSubmitEditing: PropTypes.func,
    hasCancel: PropTypes.bool,
    onCancelPress: PropTypes.func,
    testID: PropTypes.string,
};

export default SearchBox;
