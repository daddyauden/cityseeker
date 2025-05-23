// import React from 'react';
// import PropTypes from 'prop-types';
// import {View, StyleSheet, Text, Easing, Dimensions} from 'react-native';
// import Video from 'react-native-video';
// import Slider from '@react-native-community/slider';
// import moment from 'moment';
// import equal from 'deep-equal';
// import Touchable from 'react-native-platform-touchable';
//
// import Markdown from '../markdown';
// import {CustomIcon} from '../../lib/Icons';
// import sharedStyles from '../../views/Styles';
// import {
//     COLOR_BACKGROUND_CONTAINER,
//     COLOR_BORDER,
//     COLOR_PRIMARY,
// } from '../../constants/colors';
// import {isAndroid, isIOS} from '../../utils/deviceInfo';
//
// const styles = StyleSheet.create({
//     audioContainer: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         height: 56,
//         backgroundColor: COLOR_BACKGROUND_CONTAINER,
//         borderColor: COLOR_BORDER,
//         borderWidth: 1,
//         borderRadius: 4,
//         marginBottom: 6,
//     },
//     playPauseButton: {
//         marginHorizontal: 10,
//         alignItems: 'center',
//         backgroundColor: 'transparent',
//     },
//     playPauseImage: {
//         color: COLOR_PRIMARY,
//     },
//     slider: {
//         flex: 1,
//     },
//     duration: {
//         marginHorizontal: 12,
//         fontSize: 14,
//         ...sharedStyles.textColorNormal,
//         ...sharedStyles.textRegular,
//     },
// });
//
// const formatTime = seconds => moment.utc(seconds * 1000).format('mm:ss');
// const BUTTON_HIT_SLOP = {
//     top: 12,
//     right: 12,
//     bottom: 12,
//     left: 12,
// };
// const sliderAnimationConfig = {
//     duration: 250,
//     easing: Easing.linear,
//     delay: 0,
// };
//
// const Button = React.memo(({paused, onPress}) => (
//     <Touchable
//         style={styles.playPauseButton}
//         onPress={onPress}
//         hitSlop={BUTTON_HIT_SLOP}
//         background={Touchable.SelectableBackgroundBorderless()}>
//         <CustomIcon
//             name={paused ? 'play' : 'pause'}
//             size={36}
//             style={styles.playPauseImage}
//         />
//     </Touchable>
// ));
//
// Button.propTypes = {
//     paused: PropTypes.bool,
//     onPress: PropTypes.func,
// };
// Button.displayName = 'MessageAudioButton';
//
// export default class Audio extends React.Component {
//     static propTypes = {
//         file: PropTypes.object.isRequired,
//         baseUrl: PropTypes.string.isRequired,
//         user: PropTypes.object.isRequired,
//         useMarkdown: PropTypes.bool,
//         getCustomEmoji: PropTypes.func,
//     };
//
//     constructor(props) {
//         super(props);
//         const {baseUrl, file, user} = props;
//         this.state = {
//             currentTime: 0,
//             duration: 0,
//             paused: true,
//             uri: `${baseUrl}${file.audio_url}?rc_uid=${user.id}&rc_token=${user.token}`,
//         };
//     }
//
//     shouldComponentUpdate(nextProps, nextState) {
//         const {currentTime, duration, paused, uri} = this.state;
//         const {file} = this.props;
//         if (nextState.currentTime !== currentTime) {
//             return true;
//         }
//         if (nextState.duration !== duration) {
//             return true;
//         }
//         if (nextState.paused !== paused) {
//             return true;
//         }
//         if (nextState.uri !== uri) {
//             return true;
//         }
//         if (!equal(nextProps.file, file)) {
//             return true;
//         }
//         return false;
//     }
//
//     onLoad = data => {
//         this.setState({duration: data.duration > 0 ? data.duration : 0});
//     };
//
//     onProgress = data => {
//         const {duration} = this.state;
//         if (data.currentTime <= duration) {
//             this.setState({currentTime: data.currentTime});
//         }
//     };
//
//     onEnd = () => {
//         this.setState({paused: true, currentTime: 0});
//         requestAnimationFrame(() => {
//             this.player.seek(0);
//         });
//     };
//
//     get duration() {
//         const {duration} = this.state;
//         return formatTime(duration);
//     }
//
//     setRef = ref => (this.player = ref);
//
//     togglePlayPause = () => {
//         const {paused} = this.state;
//         this.setState({paused: !paused});
//     };
//
//     onValueChange = value => this.setState({currentTime: value});
//
//     render() {
//         const {uri, paused, currentTime, duration} = this.state;
//         const {user, baseUrl, file, getCustomEmoji, useMarkdown} = this.props;
//         const {description} = file;
//
//         if (!baseUrl) {
//             return null;
//         }
//
//         return (
//             <>
//                 <View style={styles.audioContainer}>
//                     <Video
//                         ref={this.setRef}
//                         source={{uri}}
//                         onLoad={this.onLoad}
//                         onProgress={this.onProgress}
//                         onEnd={this.onEnd}
//                         paused={paused}
//                         repeat={false}
//                     />
//                     <Button paused={paused} onPress={this.togglePlayPause} />
//                     <Slider
//                         style={styles.slider}
//                         value={currentTime}
//                         maximumValue={duration}
//                         minimumValue={0}
//                         animateTransitions
//                         animationConfig={sliderAnimationConfig}
//                         thumbTintColor={isAndroid && COLOR_PRIMARY}
//                         minimumTrackTintColor={COLOR_PRIMARY}
//                         onValueChange={this.onValueChange}
//                         thumbImage={
//                             isIOS && {
//                                 uri: 'audio_thumb',
//                                 scale: Dimensions.get('window').scale,
//                             }
//                         }
//                     />
//                     <Text style={styles.duration}>{this.duration}</Text>
//                 </View>
//                 <Markdown
//                     msg={description}
//                     baseUrl={baseUrl}
//                     username={user.username}
//                     getCustomEmoji={getCustomEmoji}
//                     useMarkdown={useMarkdown}
//                 />
//             </>
//         );
//     }
// }

import React from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Text,
    Easing,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';

import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import equal from 'deep-equal';
import Touchable from 'react-native-platform-touchable';

import {isAndroid, isIOS} from '../../utils/deviceInfo';
import {CustomIcon} from '../../lib/Icons';
import Style from '../../style';

const formatTime = seconds => moment.utc(seconds * 1000).format('mm:ss');

const BUTTON_HIT_SLOP = {
    top: 12,
    right: 12,
    bottom: 12,
    left: 12,
};

const sliderAnimationConfig = {
    duration: 250,
    easing: Easing.linear,
    delay: 0,
};

const Button = React.memo(({paused, onPress, revered}) => (
    <Touchable
        style={[Style.bg_transparent]}
        onPress={onPress}
        hitSlop={BUTTON_HIT_SLOP}
        background={Touchable.SelectableBackgroundBorderless()}>
        <CustomIcon
            name={paused ? 'play' : 'pause'}
            style={[Style.f_size_30, Style.f_color_cityseeker]}
        />
    </Touchable>
));

Button.propTypes = {
    paused: PropTypes.bool,
    onPress: PropTypes.func,
    revered: PropTypes.bool,
};

Button.defaultProps = {
    revered: false,
};

Button.displayName = 'MessageAudioButton';

export default class Audio extends React.Component {
    static propTypes = {
        file: PropTypes.object.isRequired,
        baseUrl: PropTypes.string.isRequired,
        user: PropTypes.object.isRequired,
        useMarkdown: PropTypes.bool,
        getCustomEmoji: PropTypes.func,
        revered: PropTypes.bool,
    };

    static defaultProps = {
        revered: false,
    };

    constructor(props) {
        super(props);
        const {baseUrl, file, user} = props;
        this.state = {
            currentTime: 0,
            duration: 0,
            paused: true,
            uri: `${baseUrl}${file.audio_url}?rc_uid=${user.id}&rc_token=${user.token}`,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {currentTime, duration, paused, uri} = this.state;
        const {file} = this.props;
        if (nextState.currentTime !== currentTime) {
            return true;
        }
        if (nextState.duration !== duration) {
            return true;
        }
        if (nextState.paused !== paused) {
            return true;
        }
        if (nextState.uri !== uri) {
            return true;
        }
        if (!equal(nextProps.file, file)) {
            return true;
        }
        return false;
    }

    onLoad = data => {
        this.setState({duration: data.duration > 0 ? data.duration : 0});
    };

    onProgress = data => {
        const {duration} = this.state;
        if (data.currentTime <= duration) {
            this.setState({currentTime: data.currentTime});
        }
    };

    onEnd = () => {
        this.setState({paused: true, currentTime: 0});
        requestAnimationFrame(() => {
            this.player.seek(0);
        });
    };

    get duration() {
        const {duration} = this.state;
        return formatTime(duration);
    }

    setRef = ref => (this.player = ref);

    togglePlayPause = () => {
        const {paused} = this.state;
        this.setState({paused: !paused});
    };

    onValueChange = value => this.setState({currentTime: value});

    render() {
        const {uri, paused, currentTime, duration} = this.state;
        const {baseUrl} = this.props;

        if (!baseUrl) {
            return null;
        }

        return (
            <React.Fragment>
                <TouchableWithoutFeedback onPress={this.togglePlayPause}>
                    <View
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.bg_color_gray,
                            Style.p_v_1,
                            Style.p_l_1,
                            Style.p_r_3,
                            Style.border_round_4,
                        ]}>
                        <Video
                            ref={this.setRef}
                            source={{uri}}
                            onLoad={this.onLoad}
                            onProgress={this.onProgress}
                            onEnd={this.onEnd}
                            paused={paused}
                            repeat={false}
                        />
                        <Button
                            paused={paused}
                            onPress={this.togglePlayPause}
                        />
                        {/*<Slider*/}
                        {/*    style={Style.flex}*/}
                        {/*    value={currentTime}*/}
                        {/*    maximumValue={duration}*/}
                        {/*    minimumValue={0}*/}
                        {/*    animateTransitions*/}
                        {/*    animationConfig={sliderAnimationConfig}*/}
                        {/*    thumbTintColor={*/}
                        {/*        isAndroid && Style.f_color_cityseeker.color*/}
                        {/*    }*/}
                        {/*    minimumTrackTintColor={Style.f_color_cityseeker.color}*/}
                        {/*    onValueChange={this.onValueChange}*/}
                        {/*    thumbImage={*/}
                        {/*        isIOS && {*/}
                        {/*            // uri: 'audio_thumb',*/}
                        {/*            scale: Dimensions.get('window').scale,*/}
                        {/*        }*/}
                        {/*    }*/}
                        {/*/>*/}
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_3,
                                Style.f_weight_400,
                                Style.m_l_2,
                            ]}>
                            {this.duration}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </React.Fragment>
        );
    }
}
