// import React from 'react';
// import {View, Text, StyleSheet} from 'react-native';
// import PropTypes from 'prop-types';
// import moment from 'moment';
// import {connect} from 'react-redux';
//
// import Markdown from '../markdown';
// import {CustomIcon} from '../../lib/Icons';
// import sharedStyles from '../../views/Styles';
// import {
//     COLOR_PRIMARY,
//     COLOR_BACKGROUND_CONTAINER,
//     COLOR_TEXT_DESCRIPTION,
//     COLOR_WHITE,
// } from '../../constants/colors';
//
// const styles = StyleSheet.create({
//     container: {
//         flexDirection: 'row',
//         marginTop: 10,
//         backgroundColor: COLOR_WHITE,
//     },
//     messageContainer: {
//         flex: 1,
//         marginHorizontal: 10,
//         backgroundColor: COLOR_BACKGROUND_CONTAINER,
//         paddingHorizontal: 15,
//         paddingVertical: 10,
//         borderRadius: 4,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     username: {
//         color: COLOR_PRIMARY,
//         fontSize: 16,
//         ...sharedStyles.textMedium,
//     },
//     time: {
//         fontSize: 12,
//         lineHeight: 16,
//         marginLeft: 6,
//         ...sharedStyles.textColorDescription,
//         ...sharedStyles.textRegular,
//         fontWeight: '300',
//     },
//     close: {
//         marginRight: 10,
//     },
// });
//
// const ReplyPreview = React.memo(
//     ({
//         message,
//         Message_TimeFormat,
//         baseUrl,
//         username,
//         useMarkdown,
//         replying,
//         getCustomEmoji,
//         close,
//     }) => {
//         if (!replying) {
//             return null;
//         }
//
//         const time = moment(message.ts).format(Message_TimeFormat);
//         return (
//             <View style={styles.container}>
//                 <View style={styles.messageContainer}>
//                     <View style={styles.header}>
//                         <Text style={styles.username}>
//                             {message.u.username}
//                         </Text>
//                         <Text style={styles.time}>{time}</Text>
//                     </View>
//                     <Markdown
//                         msg={message.msg}
//                         baseUrl={baseUrl}
//                         username={username}
//                         getCustomEmoji={getCustomEmoji}
//                         numberOfLines={1}
//                         useMarkdown={useMarkdown}
//                         preview
//                     />
//                 </View>
//                 <CustomIcon
//                     name="cross"
//                     color={COLOR_TEXT_DESCRIPTION}
//                     size={20}
//                     style={styles.close}
//                     onPress={close}
//                 />
//             </View>
//         );
//     },
//     (prevProps, nextProps) => prevProps.replying === nextProps.replying,
// );
//
// ReplyPreview.propTypes = {
//     replying: PropTypes.bool,
//     useMarkdown: PropTypes.bool,
//     message: PropTypes.object.isRequired,
//     Message_TimeFormat: PropTypes.string.isRequired,
//     close: PropTypes.func.isRequired,
//     baseUrl: PropTypes.string.isRequired,
//     username: PropTypes.string.isRequired,
//     getCustomEmoji: PropTypes.func,
// };
//
// const mapStateToProps = state => ({
//     useMarkdown: state.markdown.useMarkdown,
//     Message_TimeFormat: state.settings.Message_TimeFormat,
//     baseUrl: state.settings.Site_Url || state.server ? state.server.server : '',
// });
//
// export default connect(mapStateToProps)(ReplyPreview);

import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import {connect} from 'react-redux';

import Markdown from '../markdown';
import {CustomIcon} from '../../lib/Icons';

import Style from '../../style';

const ReplyPreview = React.memo(
    ({
        message,
        Message_TimeFormat,
        baseUrl,
        username,
        useMarkdown,
        replying,
        getCustomEmoji,
        close,
    }) => {
        if (!replying) {
            return null;
        }
        const time = moment(message.ts).format(Message_TimeFormat);

        return (
            <View
                style={[
                    Style.row,
                    Style.column_center,
                    Style.m_t_2,
                    Style.bg_color_15,
                ]}>
                <View
                    style={[
                        Style.flex,
                        Style.m_h_2,
                        Style.p_2,
                        Style.border_round_1,
                        Style.bg_color_gray,
                    ]}>
                    <View style={[Style.row, Style.column_center]}>
                        <Text
                            style={[
                                Style.f_size_16,
                                Style.f_color_3,
                                Style.f_weight_500,
                                Style.f_fa_pf,
                            ]}>
                            {message.u.name}
                        </Text>
                        <Text
                            style={[
                                Style.f_size_12,
                                Style.f_color_3,
                                Style.f_weight_400,
                                Style.f_fa_pf,
                                Style.m_l_2,
                            ]}>
                            {time}
                        </Text>
                    </View>
                    <Markdown
                        msg={message.msg}
                        baseUrl={baseUrl}
                        username={username}
                        getCustomEmoji={getCustomEmoji}
                        numberOfLines={1}
                        useMarkdown={useMarkdown}
                    />
                </View>
                <CustomIcon
                    name="close"
                    style={[Style.m_r_2, Style.f_size_20, Style.f_color_9]}
                    onPress={this.close}
                />
            </View>
        );
    },
    (prevProps, nextProps) => prevProps.replying === nextProps.replying,
);

ReplyPreview.propTypes = {
    replying: PropTypes.bool,
    useMarkdown: PropTypes.bool,
    message: PropTypes.object.isRequired,
    Message_TimeFormat: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    baseUrl: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    getCustomEmoji: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        useMarkdown: state.markdown.useMarkdown,
        Message_TimeFormat: state.settings.Message_TimeFormat,
        baseUrl:
            state.settings.Site_Url || state.server ? state.server.server : '',
    };
};

export default connect(mapStateToProps)(ReplyPreview);
