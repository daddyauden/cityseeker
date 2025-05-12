import React from 'react';
import {View, Image, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import Style from '../style';

class AutoImageHeight extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            loading: true,
        };
    }

    componentDidMount() {
        const {uri, p_height} = this.props;

        Image.getSize(
            uri,
            (width, height) => {
                const ratio = p_height / height;

                this.setState({
                    width: ratio * width,
                    height: p_height,
                    loading: false,
                });
            },
            error => {
                this.setState({loading: false});
            },
        );
    }

    render() {
        const {uri, p_style, style} = this.props;

        return (
            <View
                style={[
                    Style.row,
                    Style.row_center,
                    Style.column_center,
                    Style.bg_color_15,
                    {
                        width: this.state.width,
                        height: this.state.height,
                        ...p_style,
                    },
                ]}>
                {this.state.loading ? (
                    <ActivityIndicator
                        size="small"
                        color={Style.f_color_cityseeker.color}
                    />
                ) : (
                    <FastImage
                        source={{
                            uri: uri,
                            priority: FastImage.priority.normal,
                        }}
                        style={{
                            width: '100%',
                            height: '100%',
                            ...style,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                )}
            </View>
        );
    }
}

export default AutoImageHeight;
