import React from 'react';
// import {View} from 'react-native';
import PropTypes from 'prop-types';
// import FastImage from 'react-native-fast-image';
import equal from 'deep-equal';
import Touchable from 'react-native-platform-touchable';

// import Markdown from '../markdown';
// import styles from './styles';
import {formatAttachmentUrl} from '../../lib/utils';

import {AutoImageWidth} from '../../../common/views/components';
import Style from '../../style';

const Button = React.memo(({children, onPress}) => (
    <Touchable
        onPress={onPress}
        style={[Style.column, Style.border_round_1]}
        background={Touchable.Ripple('#FFF')}>
        {children}
    </Touchable>
));

const Image = React.memo(({img}) => (
    <AutoImageWidth
        p_width={Style.w_60.width}
        uri={encodeURI(img)}
        p_style={{
            ...Style.bg_color_gray,
            ...Style.border_round_2,
            ...Style.overflow_hidden,
        }}
    />
));

const ImageContainer = React.memo(
    ({file, baseUrl, user, useMarkdown, onOpenFileModal, getCustomEmoji}) => {
        const img = formatAttachmentUrl(
            file.image_url,
            user.id,
            user.token,
            baseUrl,
        );
        if (!img) {
            return null;
        }

        const onPress = () => onOpenFileModal(file);

        // if (file.description) {
        //     return (
        //         <Button onPress={onPress}>
        //             <View>
        //                 <Image img={img} />
        //                 <Markdown
        //                     msg={file.description}
        //                     baseUrl={baseUrl}
        //                     username={user.username}
        //                     getCustomEmoji={getCustomEmoji}
        //                     useMarkdown={useMarkdown}
        //                 />
        //             </View>
        //         </Button>
        //     );
        // }

        return (
            <Button onPress={onPress}>
                <Image img={img} />
            </Button>
        );
    },
    (prevProps, nextProps) => equal(prevProps.file, nextProps.file),
);

ImageContainer.propTypes = {
    file: PropTypes.object,
    baseUrl: PropTypes.string,
    user: PropTypes.object,
    useMarkdown: PropTypes.bool,
    onOpenFileModal: PropTypes.func,
    getCustomEmoji: PropTypes.func,
};
ImageContainer.displayName = 'MessageImageContainer';

Image.propTypes = {
    img: PropTypes.string,
};
ImageContainer.displayName = 'MessageImage';

Button.propTypes = {
    children: PropTypes.node,
    onPress: PropTypes.func,
};
ImageContainer.displayName = 'MessageButton';

export default ImageContainer;
