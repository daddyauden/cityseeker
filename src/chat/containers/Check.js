// import React from 'react';
// import {StyleSheet} from 'react-native';
//
// import {CustomIcon} from '../lib/Icons';
// import sharedStyles from '../views/Styles';
//
// const styles = StyleSheet.create({
//     icon: {
//         width: 22,
//         height: 22,
//         marginHorizontal: 15,
//         ...sharedStyles.textColorDescription,
//     },
// });
//
// const Check = React.memo(() => (
//     <CustomIcon style={styles.icon} size={22} name="check" />
// ));
//
// export default Check;

import React from 'react';

import {CustomIcon} from '../lib/Icons';

import Style from '../style';

const Check = React.memo(() => (
    <CustomIcon
        style={[Style.f_size_15, Style.f_color_green, Style.m_h_3]}
        name="check"
    />
));

export default Check;
