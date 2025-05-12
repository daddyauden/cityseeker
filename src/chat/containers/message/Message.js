// import React from 'react';
// import PropTypes from 'prop-types';
// import {View} from 'react-native';
// import Touchable from 'react-native-platform-touchable';
//
// import User from './User';
// import styles from './styles';
// import sharedStyles from '../../views/Styles';
// import RepliedThread from './RepliedThread';
// import MessageAvatar from './MessageAvatar';
// import Attachments from './Attachments';
// import Urls from './Urls';
// import Thread from './Thread';
// import Reactions from './Reactions';
// import Broadcast from './Broadcast';
// import Discussion from './Discussion';
// import Content from './Content';
// import ReadReceipt from './ReadReceipt';
// import CallButton from './CallButton';
//
// const MessageInner = React.memo(props => {
//     if (props.type === 'discussion-created') {
//         return (
//             <>
//                 <User {...props} />
//                 <Discussion {...props} />
//             </>
//         );
//     }
//     if (props.type === 'jitsi_call_started') {
//         return (
//             <>
//                 <User {...props} />
//                 <Content {...props} isInfo />
//                 <CallButton {...props} />
//             </>
//         );
//     }
//     return (
//         <>
//             <User {...props} />
//             <Content {...props} />
//             <Attachments {...props} />
//             <Urls {...props} />
//             <Thread {...props} />
//             <Reactions {...props} />
//             <Broadcast {...props} />
//         </>
//     );
// });
// MessageInner.displayName = 'MessageInner';
//
// const Message = React.memo(props => {
//     if (props.isThreadReply || props.isThreadSequential || props.isInfo) {
//         const thread = props.isThreadReply ? (
//             <RepliedThread {...props} />
//         ) : null;
//         return (
//             <View style={[styles.container, props.style]}>
//                 {thread}
//                 <View style={[styles.flex, sharedStyles.alignItemsCenter]}>
//                     <MessageAvatar small {...props} />
//                     <View
//                         style={[
//                             styles.messageContent,
//                             props.isHeader && styles.messageContentWithHeader,
//                         ]}>
//                         <Content {...props} />
//                     </View>
//                 </View>
//             </View>
//         );
//     }
//     return (
//         <View style={[styles.container, props.style]}>
//             <View style={styles.flex}>
//                 <MessageAvatar {...props} />
//                 <View
//                     style={[
//                         styles.messageContent,
//                         props.isHeader && styles.messageContentWithHeader,
//                     ]}>
//                     <MessageInner {...props} />
//                 </View>
//                 <ReadReceipt
//                     isReadReceiptEnabled={props.isReadReceiptEnabled}
//                     unread={props.unread}
//                 />
//             </View>
//         </View>
//     );
// });
// Message.displayName = 'Message';
//
// const MessageTouchable = React.memo(props => {
//     if (props.hasError) {
//         return (
//             <View>
//                 <Message {...props} />
//             </View>
//         );
//     }
//     return (
//         <Touchable
//             onLongPress={props.onLongPress}
//             onPress={props.onPress}
//             disabled={props.isInfo || props.archived || props.isTemp}>
//             <View>
//                 <Message {...props} />
//             </View>
//         </Touchable>
//     );
// });
// MessageTouchable.displayName = 'MessageTouchable';
//
// MessageTouchable.propTypes = {
//     hasError: PropTypes.bool,
//     isInfo: PropTypes.bool,
//     isTemp: PropTypes.bool,
//     archived: PropTypes.bool,
//     onLongPress: PropTypes.func,
//     onPress: PropTypes.func,
// };
//
// Message.propTypes = {
//     isThreadReply: PropTypes.bool,
//     isThreadSequential: PropTypes.bool,
//     isInfo: PropTypes.bool,
//     isTemp: PropTypes.bool,
//     isHeader: PropTypes.bool,
//     hasError: PropTypes.bool,
//     style: PropTypes.any,
//     onLongPress: PropTypes.func,
//     onPress: PropTypes.func,
//     isReadReceiptEnabled: PropTypes.bool,
//     unread: PropTypes.bool,
// };
//
// MessageInner.propTypes = {
//     type: PropTypes.string,
// };
//
// export default MessageTouchable;

import React from 'react';
import PropTypes from 'prop-types';
import {Text, View} from 'react-native';
import moment from 'moment';

import User from './User';
import MessageAvatar from './MessageAvatar';
import Attachments from './Attachments';
import Urls from './Urls';
import Thread from './Thread';
import Reactions from './Reactions';
import Broadcast from './Broadcast';
import Discussion from './Discussion';
import Content from './Content';
import ReadReceipt from './ReadReceipt';

import Style from '../../style';

export const SPACE = 10;
export const AVATAR_SIZE = 40;

const Time = React.memo(props => {
    const time = moment(props.ts).format(props.timeFormat);

    return (
        <View style={[Style.row, Style.column_center]}>
            <Text
                style={[
                    Style.f_size_11,
                    Style.f_color_3,
                    Style.f_weight_300,
                    Style.f_fa_pf,
                ]}>
                {time}
            </Text>
        </View>
    );
});

const MessageInner = React.memo(props => {
    if (props.type === 'discussion-created') {
        return (
            <React.Fragment>
                <User {...props} />
                <Discussion {...props} />
            </React.Fragment>
        );
    }

    const isUrl = props.urls && props.urls.length > 0;
    const isAttachment = props.attachments && props.attachments.length > 0;
    const isThread = props.tlm;

    return (
        <View style={[Style.column, Style.row_center]}>
            {props.room.t !== undefined && props.room.t !== 'd' && (
                <User {...props} revered={props.revered} />
            )}
            <View
                style={[
                    Style.column,
                    Style.row_center,
                    props.revered ? Style.column_end : Style.column_start,
                    Style.border_round_3,
                    (!isAttachment || !isUrl) && Style.bg_color_gray,
                    !isAttachment &&
                        !isUrl && {
                            paddingHorizontal: SPACE,
                            paddingVertical: SPACE,
                        },
                ]}>
                {props.urls && props.urls.length === 0 && (
                    <Content {...props} />
                )}
                <Attachments {...props} />
                {props.urls && props.urls.length > 0 && <Urls {...props} />}
                {isThread && <Thread {...props} />}
                <Broadcast {...props} />
            </View>
            <Reactions {...props} />
        </View>
    );
});
MessageInner.displayName = 'MessageInner';

const Message = React.memo(props => {
    const revered = props.author._id === props.user.id;

    return (
        <View
            style={[
                revered ? Style.row_reverse : Style.row,
                Style.column_start,
                {
                    paddingHorizontal: SPACE,
                    paddingVertical: SPACE,
                },
            ]}>
            <MessageAvatar {...props} size={AVATAR_SIZE} />
            <View
                style={[
                    Style.column,
                    revered ? {marginRight: SPACE} : {marginLeft: SPACE},
                    {
                        width: Style.w_100.width - SPACE * 3 - AVATAR_SIZE,
                    },
                ]}>
                <View style={[revered ? Style.row_reverse : Style.row]}>
                    <MessageInner {...props} revered={revered} />
                </View>
                <View
                    style={[
                        revered ? Style.row_reverse : Style.row,
                        Style.column_center,
                        Style.m_t_1,
                    ]}>
                    <Time {...props} />
                    <View style={[revered ? Style.m_r_1 : Style.m_l_1]}>
                        <ReadReceipt
                            isReadReceiptEnabled={props.isReadReceiptEnabled}
                            unread={props.unread}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
});

Message.displayName = 'Message';

const MessageTouchable = React.memo(props => {
    if (props.hasError) {
        return (
            <View style={[Style.row]}>
                <MessageError {...props} />
                <Message {...props} />
            </View>
        );
    }

    return (
        <View
            onLongPress={props.onLongPress}
            onPress={props.onPress}
            disabled={props.isInfo || props.archived || props.isTemp}>
            <View>
                <Message {...props} />
            </View>
        </View>
    );
});

MessageTouchable.displayName = 'MessageTouchable';

MessageTouchable.propTypes = {
    hasError: PropTypes.bool,
    isInfo: PropTypes.bool,
    isTemp: PropTypes.bool,
    archived: PropTypes.bool,
    onLongPress: PropTypes.func,
    onPress: PropTypes.func,
};

Message.propTypes = {
    isThreadReply: PropTypes.bool,
    isThreadSequential: PropTypes.bool,
    isInfo: PropTypes.bool,
    isTemp: PropTypes.bool,
    isHeader: PropTypes.bool,
    hasError: PropTypes.bool,
    style: PropTypes.any,
    onLongPress: PropTypes.func,
    onPress: PropTypes.func,
    isReadReceiptEnabled: PropTypes.bool,
    unread: PropTypes.bool,
};

MessageInner.propTypes = {
    type: PropTypes.string,
};

export default MessageTouchable;
