// import React from 'react';
// import PropTypes from 'prop-types';
// import {View, Text, StyleSheet} from 'react-native';
// import moment from 'moment';
//
// import MessageError from './MessageError';
// import sharedStyles from '../../views/Styles';
// import messageStyles from './styles';
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     username: {
//         fontSize: 16,
//         lineHeight: 22,
//         ...sharedStyles.textColorNormal,
//         ...sharedStyles.textMedium,
//     },
//     titleContainer: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     alias: {
//         fontSize: 14,
//         ...sharedStyles.textColorDescription,
//         ...sharedStyles.textRegular,
//     },
// });
//
// const User = React.memo(
//     ({
//         isHeader,
//         useRealName,
//         author,
//         alias,
//         ts,
//         timeFormat,
//         hasError,
//         ...props
//     }) => {
//         if (isHeader || hasError) {
//             const username = (useRealName && author.name) || author.username;
//             const aliasUsername = alias ? (
//                 <Text style={styles.alias}> @{username}</Text>
//             ) : null;
//             const time = moment(ts).format(timeFormat);
//
//             return (
//                 <View style={styles.container}>
//                     <View style={styles.titleContainer}>
//                         <Text style={styles.username} numberOfLines={1}>
//                             {alias || username}
//                             {aliasUsername}
//                         </Text>
//                     </View>
//                     <Text style={messageStyles.time}>{time}</Text>
//                     {hasError && (
//                         <MessageError hasError={hasError} {...props} />
//                     )}
//                 </View>
//             );
//         }
//         return null;
//     },
// );
//
// User.propTypes = {
//     isHeader: PropTypes.bool,
//     hasError: PropTypes.bool,
//     useRealName: PropTypes.bool,
//     author: PropTypes.object,
//     alias: PropTypes.string,
//     ts: PropTypes.instanceOf(Date),
//     timeFormat: PropTypes.string,
// };
// User.displayName = 'MessageUser';
//
// export default User;

import React from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';

import Style from '../../style';

const User = React.memo(({isHeader, useRealName, author, revered}) => {
    if (isHeader) {
        const username = (useRealName && author.name) || author.username;

        return (
            <View
                style={[
                    Style.row,
                    Style.column_center,
                    revered ? Style.row_end : Style.row_start,
                ]}>
                <Text
                    style={[
                        Style.l_h_4,
                        Style.f_size_15,
                        Style.f_color_3,
                        Style.f_weight_500,
                        Style.f_fa_pf,
                    ]}
                    numberOfLines={1}>
                    {username}
                </Text>
            </View>
        );
    }

    return null;
});

User.propTypes = {
    isHeader: PropTypes.bool,
    useRealName: PropTypes.bool,
    author: PropTypes.object,
};

User.displayName = 'MessageUser';

export default User;
