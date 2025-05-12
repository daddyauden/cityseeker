// import React from 'react';
// import PropTypes from 'prop-types';
// import {StyleSheet} from 'react-native';
// import Touchable from 'react-native-platform-touchable';
// import isEqual from 'deep-equal';
//
// import Markdown from '../markdown';
// import openLink from '../../utils/openLink';
// import {isIOS} from '../../utils/deviceInfo';
// import {CustomIcon} from '../../lib/Icons';
// import {formatAttachmentUrl} from '../../lib/utils';
//
// const SUPPORTED_TYPES = [
//     'video/quicktime',
//     'video/mp4',
//     ...(isIOS ? [] : ['video/3gp', 'video/mkv']),
// ];
// const isTypeSupported = type => SUPPORTED_TYPES.indexOf(type) !== -1;
//
// const styles = StyleSheet.create({
//     button: {
//         flex: 1,
//         borderRadius: 4,
//         height: 150,
//         backgroundColor: '#1f2329',
//         marginBottom: 6,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     modal: {
//         margin: 0,
//         backgroundColor: '#000',
//     },
//     image: {
//         color: 'white',
//     },
// });
//
// const Video = React.memo(
//     ({file, baseUrl, user, useMarkdown, onOpenFileModal, getCustomEmoji}) => {
//         if (!baseUrl) {
//             return null;
//         }
//
//         const onPress = () => {
//             if (isTypeSupported(file.video_type)) {
//                 return onOpenFileModal(file);
//             }
//             const uri = formatAttachmentUrl(
//                 file.video_url,
//                 user.id,
//                 user.token,
//                 baseUrl,
//             );
//             openLink(uri);
//         };
//
//         return (
//             <>
//                 <Touchable
//                     onPress={onPress}
//                     style={styles.button}
//                     background={Touchable.Ripple('#fff')}>
//                     <CustomIcon name="play" size={54} style={styles.image} />
//                 </Touchable>
//                 <Markdown
//                     msg={file.description}
//                     baseUrl={baseUrl}
//                     username={user.username}
//                     getCustomEmoji={getCustomEmoji}
//                     useMarkdown={useMarkdown}
//                 />
//             </>
//         );
//     },
//     (prevProps, nextProps) => isEqual(prevProps.file, nextProps.file),
// );
//
// Video.propTypes = {
//     file: PropTypes.object,
//     baseUrl: PropTypes.string,
//     user: PropTypes.object,
//     useMarkdown: PropTypes.bool,
//     onOpenFileModal: PropTypes.func,
//     getCustomEmoji: PropTypes.func,
// };
//
// export default Video;

import React from 'react';
import PropTypes from 'prop-types';
import VideoComponent from 'react-native-video';
import isEqual from 'deep-equal';

import {formatAttachmentUrl} from '../../lib/utils';
import Style from '../../style';

const Video = React.memo(
    ({file, baseUrl, user, useMarkdown, onOpenFileModal, getCustomEmoji}) => {
        if (!baseUrl) {
            return null;
        }

        const uri = formatAttachmentUrl(
            file.video_url,
            user.id,
            user.token,
            baseUrl,
        );

        return (
            <React.Fragment>
                <VideoComponent
                    style={[
                        Style.border_round_1,
                        {
                            width: Style.w_75.width,
                            height: 200,
                        },
                    ]}
                    showPoster={true}
                    source={{uri}}
                    controls={true}
                    muted={false}
                    paused={true}
                    pictureInPicture={false}
                    playInBackground={false}
                    playWhenInactive={false}
                    allowsExternalPlayback={false}
                    fullscreenAutorotate={true}
                    fullscreenOrientation="all"
                    hideShutterView={false}
                    posterResizeMode="cover"
                    repeat={false}
                    resizeMode="cover"
                />
            </React.Fragment>
        );
    },
    (prevProps, nextProps) => isEqual(prevProps.file, nextProps.file),
);

Video.propTypes = {
    file: PropTypes.object,
    baseUrl: PropTypes.string,
    user: PropTypes.object,
    useMarkdown: PropTypes.bool,
    onOpenFileModal: PropTypes.func,
    getCustomEmoji: PropTypes.func,
};

export default Video;
