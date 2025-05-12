import React from 'react';
import {Modal, ActivityIndicator, Dimensions} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Common} from '../utils/lib';
import Style from '../style';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class Album extends React.Component {
    render() {
        const {
            data,
            index,
            visible,
            onCancel,
            renderHeader,
            renderFooter,
        } = this.props;

        const images = data.map((image, index) => {
            return {
                url: Common.load_image(image),
            };
        });

        return (
            <Modal visible={visible} transparent={true}>
                <ImageViewer
                    index={index}
                    imageUrls={images}
                    cropWidth={WIDTH}
                    cropHeight={HEIGHT}
                    enableImageZoom={true}
                    loadingRender={() => {
                        return (
                            <ActivityIndicator
                                size="small"
                                color={Style.f_color_cityseeker}
                            />
                        );
                    }}
                    renderIndicator={() => {
                        return (
                            <ActivityIndicator
                                size="small"
                                color={Style.f_color_cityseeker}
                            />
                        );
                    }}
                    onCancel={onCancel}
                    onClick={onCancel => {
                        onCancel();
                    }}
                    onDoubleClick={onCancel => {
                        onCancel();
                    }}
                    enableSwipeDown={true}
                    swipeDownThreshold={1}
                    enablePreload={true}
                    saveToLocalByLongPress={false}
                    // renderHeader={
                    //     renderHeader ? () => renderHeader() : () => {}
                    // }
                    // renderFooter={
                    //     renderFooter ? () => renderFooter() : () => {}
                    // }
                    footerContainerStyle={[Style.bg_color_15]}
                    backgroundColor={Style.bg_color_0.backgroundColor}
                />
            </Modal>
        );
    }
}

export default Album;
