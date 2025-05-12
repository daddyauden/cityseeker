import React from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';

// import styles from './styles';

import Style from '../../style';

const UnreadBadge = React.memo(({unread, userMentions, type}) => {
    if (!unread || unread <= 0) {
        return;
    }

    if (unread >= 1000) {
        unread = '999+';
    }

    // const mentioned = userMentions > 0 && type !== 'd';

    return (
        <View
            style={[
                Style.bg_color_cityseeker,
                Style.row,
                Style.row_center,
                Style.column_center,
                Style.m_l_2,
                {
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                },
            ]}>
            <Text
                style={[
                    Style.overflow_hidden,
                    Style.f_color_15,
                    Style.f_size_13,
                    Style.f_weight_700,
                ]}>
                {unread}
            </Text>
        </View>
    );
});

UnreadBadge.propTypes = {
    unread: PropTypes.number,
    // userMentions: PropTypes.number,
    // type: PropTypes.string,
};

export default UnreadBadge;
