import React from 'react';
import {StatusBar} from 'react-native';

import Style from '../style';

class Default extends React.Component {
    render() {
        const {light} = this.props;

        if (light) {
            return (
                <StatusBar
                    backgroundColor={Style.bg_color_15.backgroundColor}
                    barStyle="dark-content"
                    animated
                />
            );
        }

        return (
            <StatusBar
                backgroundColor={Style.bg_color_0.backgroundColor}
                barStyle={'light-content'}
                animated
            />
        );
    }
}

export default Default;
