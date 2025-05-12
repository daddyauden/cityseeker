import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import {RectButton} from 'react-native-gesture-handler';

// import {COLOR_TEXT} from '../constants/colors';
// import sharedStyles from '../views/Styles';

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: 56,
//         paddingHorizontal: 15,
//     },
//     disabled: {
//         opacity: 0.3,
//     },
//     textContainer: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     title: {
//         fontSize: 16,
//         ...sharedStyles.textColorNormal,
//         ...sharedStyles.textRegular,
//     },
//     subtitle: {
//         fontSize: 14,
//         ...sharedStyles.textColorNormal,
//         ...sharedStyles.textRegular,
//     },
// });

// const Content = React.memo(({title, subtitle, disabled, testID, right}) => (
//     <View
//         style={[styles.container, disabled && styles.disabled]}
//         testID={testID}>
//         <View style={styles.textContainer}>
//             <Text style={styles.title}>{title}</Text>
//             {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
//         </View>
//         {right ? right() : null}
//     </View>
// ));
//
// const Button = React.memo(({onPress, ...props}) => (
//     <RectButton
//         onPress={onPress}
//         activeOpacity={0.1}
//         underlayColor={COLOR_TEXT}
//         enabled={!props.disabled}>
//         <Content {...props} />
//     </RectButton>
// ));

import Style from '../style';

const Content = React.memo(({title, subtitle, disabled, right}) => (
    <View style={[Style.flex, Style.h_center, Style.p_h_3, Style.p_v_2]}>
        <View style={[Style.flex, Style.row_center]}>
            <Text style={[Style.f_size_15, Style.f_color_3, Style.f_regular]}>
                {title}
            </Text>
            {subtitle ? (
                <Text
                    style={[
                        Style.f_size_13,
                        Style.f_color_5,
                        Style.f_regular,
                        Style.p_v_1,
                    ]}>
                    {subtitle}
                </Text>
            ) : null}
        </View>
        {right ? right() : null}
    </View>
));

const Button = React.memo(({onPress, ...props}) => (
    <RectButton
        onPress={onPress}
        activeOpacity={0.1}
        underlayColor={Style.bg_color_14.color}
        enabled={!props.disabled}>
        <Content {...props} />
    </RectButton>
));

const Item = React.memo(({...props}) => {
    if (props.onPress) {
        return <Button {...props} />;
    }
    return <Content {...props} />;
});

Item.propTypes = {
    onPress: PropTypes.func,
};

Content.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    right: PropTypes.func,
    disabled: PropTypes.bool,
    testID: PropTypes.string,
};

Button.propTypes = {
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
};

Button.defaultProps = {
    disabled: false,
};

export default Item;
