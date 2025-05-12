import React, {Component} from 'react';
import {View} from 'react-native';
import Style from '../style';

class Divide extends Component {
    render() {
        const {style} = this.props;

        return <View style={[Style.theme_header, {height: 3}, {...style}]} />;
    }
}

export default Divide;
