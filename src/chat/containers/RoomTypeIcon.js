// import React from 'react';
// import {Image, StyleSheet} from 'react-native';
// import PropTypes from 'prop-types';
// import {CustomIcon} from '../lib/Icons';
// import {COLOR_TEXT_DESCRIPTION} from '../constants/colors';
//
// const styles = StyleSheet.create({
//     style: {
//         marginRight: 7,
//         marginTop: 3,
//     },
//     imageColor: {
//         tintColor: COLOR_TEXT_DESCRIPTION,
//     },
//     iconColor: {
//         color: COLOR_TEXT_DESCRIPTION,
//     },
//     discussion: {
//         marginRight: 6,
//     },
// });
//
// const RoomTypeIcon = React.memo(({type, size, style}) => {
//     if (!type) {
//         return null;
//     }
//
//     if (type === 'discussion') {
//         // FIXME: These are temporary only. We should have all room icons on <Customicon />, but our design team is still working on this.
//         return (
//             <CustomIcon
//                 name="chat"
//                 size={13}
//                 style={[styles.style, styles.iconColor, styles.discussion]}
//             />
//         );
//     }
//
//     if (type === 'c') {
//         return (
//             <Image
//                 source={{uri: 'hashtag'}}
//                 style={[
//                     styles.style,
//                     styles.imageColor,
//                     style,
//                     {width: size, height: size},
//                 ]}
//             />
//         );
//     }
//     if (type === 'd') {
//         return (
//             <CustomIcon
//                 name="at"
//                 size={13}
//                 style={[styles.style, styles.iconColor, styles.discussion]}
//             />
//         );
//     }
//     return (
//         <Image
//             source={{uri: 'lock'}}
//             style={[
//                 styles.style,
//                 styles.imageColor,
//                 style,
//                 {width: size, height: size},
//             ]}
//         />
//     );
// });
//
// RoomTypeIcon.propTypes = {
//     type: PropTypes.string,
//     size: PropTypes.number,
//     style: PropTypes.object,
// };
//
// RoomTypeIcon.defaultProps = {
//     size: 10,
// };
//
// export default RoomTypeIcon;

import React from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Style from '../style';

const RoomTypeIcon = React.memo(({type, style}) => {
    if (!type) {
        return null;
    }

    let icon;
    if (type === 'discussion') {
        icon = 'comment-multiple-outline';
    } else if (type === 'c') {
        icon = 'pound';
    } else if (type === 'd') {
        icon = 'at';
    } else if (type === 'thread') {
        icon = 'comment-multiple';
    } else {
        icon = 'lock';
    }

    return (
        <MaterialCommunityIcons
            name={icon}
            style={[Style.m_r_1, Style.f_color_9, Style.f_size_15, style]}
        />
    );
});

export default RoomTypeIcon;
