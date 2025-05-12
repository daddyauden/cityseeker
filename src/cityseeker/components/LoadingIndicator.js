import React from 'react';
import {ActivityIndicator} from 'react-native';
import Style from '../style';

class LoadingIndicator extends React.Component {
    render() {
        const {size, color} = this.props;

        return (
            <ActivityIndicator
                size={size !== undefined ? size : 'small'}
                color={color !== undefined ? color : Style.f_color_cityseeker.color}
            />
        );
    }
}

export default LoadingIndicator;
