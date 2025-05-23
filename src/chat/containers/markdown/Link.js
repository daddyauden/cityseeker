import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'react-native';

import styles from './styles';
import openLink from '../../utils/openLink';

import Style from '../../style';

const Link = React.memo(({children, link, preview}) => {
    const handlePress = () => {
        if (!link) {
            return;
        }
        openLink(link);
    };

    const childLength = React.Children.toArray(children).filter(o => o).length;

    // if you have a [](https://rocket.chat) render https://rocket.chat
    return (
        <Text
            onPress={preview ? undefined : handlePress}
            style={[Style.f_size_16, Style.f_color_2, Style.f_regular]}>
            {childLength !== 0 ? children : link}
        </Text>
    );
});

Link.propTypes = {
    children: PropTypes.node,
    link: PropTypes.string,
    preview: PropTypes.bool,
};

export default Link;
