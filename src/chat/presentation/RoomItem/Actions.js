// import React from 'react';
// import {Animated, View, Text} from 'react-native';
// import {RectButton} from 'react-native-gesture-handler';
// import PropTypes from 'prop-types';
//
// import I18n from '../../i18n';
// import styles, {ACTION_WIDTH, LONG_SWIPE} from './styles';
// import {CustomIcon} from '../../lib/Icons';
//
// export const LeftActions = React.memo(
//     ({transX, isRead, width, onToggleReadPress}) => {
//         const translateX = transX.interpolate({
//             inputRange: [0, ACTION_WIDTH],
//             outputRange: [-ACTION_WIDTH, 0],
//         });
//         const translateXIcon = transX.interpolate({
//             inputRange: [0, ACTION_WIDTH, LONG_SWIPE - 2, LONG_SWIPE],
//             outputRange: [0, 0, -LONG_SWIPE + ACTION_WIDTH + 2, 0],
//             extrapolate: 'clamp',
//         });
//         return (
//             <View style={styles.actionsContainer} pointerEvents="box-none">
//                 <Animated.View
//                     style={[
//                         styles.actionLeftButtonContainer,
//                         {
//                             right: width - ACTION_WIDTH,
//                             width,
//                             transform: [{translateX}],
//                         },
//                     ]}>
//                     <Animated.View
//                         style={[
//                             styles.actionLeftButtonContainer,
//                             {
//                                 right: 0,
//                                 transform: [{translateX: translateXIcon}],
//                             },
//                         ]}>
//                         <RectButton
//                             style={styles.actionButton}
//                             onPress={onToggleReadPress}>
//                             <>
//                                 <CustomIcon
//                                     size={20}
//                                     name={isRead ? 'flag' : 'check'}
//                                     color="white"
//                                 />
//                                 <Text style={styles.actionText}>
//                                     {I18n.t(isRead ? 'Unread' : 'Read')}
//                                 </Text>
//                             </>
//                         </RectButton>
//                     </Animated.View>
//                 </Animated.View>
//             </View>
//         );
//     },
// );
//
// export const RightActions = React.memo(
//     ({transX, favorite, width, toggleFav, onHidePress}) => {
//         const translateXFav = transX.interpolate({
//             inputRange: [-width / 2, -ACTION_WIDTH * 2, 0],
//             outputRange: [width / 2, width - ACTION_WIDTH * 2, width],
//         });
//         const translateXHide = transX.interpolate({
//             inputRange: [-width, -LONG_SWIPE, -ACTION_WIDTH * 2, 0],
//             outputRange: [0, width - LONG_SWIPE, width - ACTION_WIDTH, width],
//         });
//         return (
//             <View
//                 style={{
//                     position: 'absolute',
//                     left: 0,
//                     right: 0,
//                     height: 75,
//                     flexDirection: 'row',
//                 }}
//                 pointerEvents="box-none">
//                 <Animated.View
//                     style={[
//                         styles.actionRightButtonContainer,
//                         {
//                             width,
//                             transform: [{translateX: translateXFav}],
//                         },
//                     ]}>
//                     <RectButton
//                         style={[
//                             styles.actionButton,
//                             {backgroundColor: '#ffbb00'},
//                         ]}
//                         onPress={toggleFav}>
//                         <>
//                             <CustomIcon
//                                 size={20}
//                                 name={favorite ? 'Star-filled' : 'star'}
//                                 color="white"
//                             />
//                             <Text style={styles.actionText}>
//                                 {I18n.t(favorite ? 'Unfavorite' : 'Favorite')}
//                             </Text>
//                         </>
//                     </RectButton>
//                 </Animated.View>
//                 <Animated.View
//                     style={[
//                         styles.actionRightButtonContainer,
//                         {
//                             width,
//                             transform: [{translateX: translateXHide}],
//                         },
//                     ]}>
//                     <RectButton
//                         style={[
//                             styles.actionButton,
//                             {backgroundColor: '#54585e'},
//                         ]}
//                         onPress={onHidePress}>
//                         <>
//                             <CustomIcon
//                                 size={20}
//                                 name="eye-off"
//                                 color="white"
//                             />
//                             <Text style={styles.actionText}>
//                                 {I18n.t('Hide')}
//                             </Text>
//                         </>
//                     </RectButton>
//                 </Animated.View>
//             </View>
//         );
//     },
// );
//
// LeftActions.propTypes = {
//     transX: PropTypes.object,
//     isRead: PropTypes.bool,
//     width: PropTypes.number,
//     onToggleReadPress: PropTypes.func,
// };
//
// RightActions.propTypes = {
//     transX: PropTypes.object,
//     favorite: PropTypes.bool,
//     width: PropTypes.number,
//     toggleFav: PropTypes.func,
//     onHidePress: PropTypes.func,
// };

import React from 'react';
import {Animated, View, Text} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

import I18n from '../../i18n';
import {ROW_HEIGHT, ACTION_WIDTH, LONG_SWIPE} from './styles';
import {CustomIcon} from '../../lib/Icons';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Style from '../../style';

export const LeftActions = React.memo(
    ({transX, isRead, width, onToggleReadPress}) => {
        const translateX = transX.interpolate({
            inputRange: [0, ACTION_WIDTH],
            outputRange: [-ACTION_WIDTH, 0],
        });

        const translateXIcon = transX.interpolate({
            inputRange: [0, ACTION_WIDTH, LONG_SWIPE - 2, LONG_SWIPE],
            outputRange: [0, 0, -LONG_SWIPE + ACTION_WIDTH + 2, 0],
            extrapolate: 'clamp',
        });

        return (
            <View
                style={[
                    Style.horizontal,
                    {
                        height: ROW_HEIGHT,
                    },
                ]}
                pointerEvents="box-none">
                <Animated.View
                    style={[
                        Style.top,
                        Style.bg_color_cityseeker,
                        Style.row_center,
                        {
                            right: width - ACTION_WIDTH,
                            width,
                            height: ROW_HEIGHT,
                            transform: [{translateX}],
                        },
                    ]}>
                    <Animated.View
                        style={[
                            Style.top,
                            Style.bg_color_cityseeker,
                            Style.row_center,
                            {
                                right: 0,
                                height: ROW_HEIGHT,
                                transform: [{translateX: translateXIcon}],
                            },
                        ]}>
                        <RectButton
                            style={[
                                Style.h_p100,
                                Style.row_center,
                                Style.column_center,
                                {
                                    width: ACTION_WIDTH,
                                },
                            ]}
                            onPress={onToggleReadPress}>
                            <React.Fragment>
                                <MaterialCommunityIcons
                                    name={isRead ? 'flag' : 'check'}
                                    style={[
                                        Style.f_size_20,
                                        Style.f_color_15,
                                        Style.bg_color_cityseeker,
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.f_color_15,
                                        Style.f_size_15,
                                        Style.f_weight_500,
                                        Style.f_fa_pf,
                                        Style.row_center,
                                        Style.m_t_1,
                                    ]}>
                                    {I18n.t(isRead ? 'unread' : 'readed')}
                                </Text>
                            </React.Fragment>
                        </RectButton>
                    </Animated.View>
                </Animated.View>
            </View>
        );
    },
);

export const RightActions = React.memo(
    ({transX, favorite, width, toggleFav, onHidePress}) => {
        const translateXFav = transX.interpolate({
            inputRange: [-width / 2, -ACTION_WIDTH * 2, 0],
            outputRange: [width / 2, width - ACTION_WIDTH * 2, width],
        });
        const translateXHide = transX.interpolate({
            inputRange: [-width, -LONG_SWIPE, -ACTION_WIDTH * 2, 0],
            outputRange: [0, width - LONG_SWIPE, width - ACTION_WIDTH, width],
        });
        return (
            <View
                style={[Style.horizontal, Style.row, {height: 75}]}
                pointerEvents="box-none">
                <Animated.View
                    style={[
                        Style.top,
                        Style.bg_color_cityseeker,
                        Style.row_center,
                        {
                            width,
                            height: ROW_HEIGHT,
                            transform: [{translateX: translateXFav}],
                        },
                    ]}>
                    <RectButton
                        style={[
                            Style.h_p100,
                            Style.row_center,
                            Style.column_center,
                            {
                                width: ACTION_WIDTH,
                            },
                        ]}
                        onPress={toggleFav}>
                        <React.Fragment>
                            <MaterialCommunityIcons
                                name={favorite ? 'star' : 'star-outline'}
                                style={[Style.f_size_20, Style.f_color_15]}
                            />
                            <Text
                                style={[
                                    Style.f_color_15,
                                    Style.f_size_15,
                                    Style.f_weight_500,
                                    Style.f_fa_pf,
                                    Style.row_center,
                                    Style.m_t_1,
                                ]}>
                                {I18n.t(favorite ? 'Unfavorite' : 'Favorite')}
                            </Text>
                        </React.Fragment>
                    </RectButton>
                </Animated.View>
                <Animated.View
                    style={[
                        Style.top,
                        Style.bg_color_cityseeker,
                        Style.row_center,
                        {
                            width,
                            height: ROW_HEIGHT,
                            transform: [{translateX: translateXHide}],
                        },
                    ]}>
                    <RectButton
                        style={[
                            Style.h_p100,
                            Style.row_center,
                            Style.column_center,
                            {
                                width: ACTION_WIDTH,
                            },
                        ]}
                        onPress={onHidePress}>
                        <React.Fragment>
                            <MaterialCommunityIcons
                                name="delete-circle"
                                style={[Style.f_size_20, Style.f_color_15]}
                            />
                            <Text
                                style={[
                                    Style.f_color_15,
                                    Style.f_size_15,
                                    Style.f_weight_500,
                                    Style.f_fa_pf,
                                    Style.row_center,
                                    Style.m_t_1,
                                ]}>
                                {I18n.t('Delete')}
                            </Text>
                        </React.Fragment>
                    </RectButton>
                </Animated.View>
            </View>
        );
    },
);

LeftActions.propTypes = {
    transX: PropTypes.object,
    isRead: PropTypes.bool,
    width: PropTypes.number,
    onToggleReadPress: PropTypes.func,
};

RightActions.propTypes = {
    transX: PropTypes.object,
    favorite: PropTypes.bool,
    width: PropTypes.number,
    toggleFav: PropTypes.func,
    onHidePress: PropTypes.func,
};
