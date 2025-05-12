import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

import {formatLastMessage, formatMessageCount} from './utils';
import styles from './styles';
import {CustomIcon} from '../../lib/Icons';
import {THREAD} from './constants';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Style from '../../style';

// const Thread = React.memo(
//     ({msg, tcount, tlm, customThreadTimeFormat, isThreadRoom}) => {
//         if (!tlm || isThreadRoom || tcount === 0) {
//             return null;
//         }
//
//         const time = formatLastMessage(tlm, customThreadTimeFormat);
//         const buttonText = formatMessageCount(tcount, THREAD);
//         return (
//             <View style={styles.buttonContainer}>
//                 <View
//                     style={[styles.button, styles.smallButton]}
//                     testID={`message-thread-button-${msg}`}>
//                     <CustomIcon
//                         name="thread"
//                         size={20}
//                         style={styles.buttonIcon}
//                     />
//                     <Text style={styles.buttonText}>{buttonText}</Text>
//                 </View>
//                 <Text style={styles.time}>{time}</Text>
//             </View>
//         );
//     },
//     (prevProps, nextProps) => {
//         if (prevProps.tcount !== nextProps.tcount) {
//             return false;
//         }
//         return true;
//     },
// );

const Thread = React.memo(
    ({msg, tcount, tlm, customThreadTimeFormat}) => {
        if (!tlm) {
            return null;
        }

        const time = formatLastMessage(tlm, customThreadTimeFormat);
        const buttonText = formatMessageCount(tcount, THREAD);

        return (
            <View style={[Style.m_t_1, Style.row, Style.column_center]}>
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.p_h_2,
                        Style.p_v_1,
                        Style.bg_color_14,
                        Style.border_round_1,
                    ]}>
                    <MaterialCommunityIcons
                        name="comment-multiple"
                        style={[Style.f_color_3, Style.f_size_20, Style.m_r_2]}
                    />
                    <Text
                        style={[
                            Style.f_color_5,
                            Style.f_size_13,
                            Style.f_weight_500,
                            Style.f_fa_pf,
                        ]}>
                        {buttonText}
                    </Text>
                </View>
                <Text
                    style={[
                        Style.f_size_12,
                        Style.f_color_6,
                        Style.f_weight_300,
                        Style.f_fa_pf,
                        Style.m_l_2,
                    ]}>
                    {time}
                </Text>
            </View>
        );
    },
    (prevProps, nextProps) => {
        if (prevProps.tcount !== nextProps.tcount) {
            return false;
        }
        return true;
    },
);

Thread.propTypes = {
    msg: PropTypes.string,
    tcount: PropTypes.string,
    tlm: PropTypes.string,
    customThreadTimeFormat: PropTypes.string,
    isThreadRoom: PropTypes.bool,
};
Thread.displayName = 'MessageThread';

export default Thread;
