// import React from 'react';
// import PropTypes from 'prop-types';
// import {View, SafeAreaView, PermissionsAndroid, Text} from 'react-native';
// import {AudioRecorder, AudioUtils} from 'react-native-audio';
// import {BorderlessButton} from 'react-native-gesture-handler';
// import RNFetchBlob from 'rn-fetch-blob';
//
// import styles from './styles';
// import I18n from '../../i18n';
// import {isIOS, isAndroid} from '../../utils/deviceInfo';
// import {CustomIcon} from '../../lib/Icons';
// import {COLOR_SUCCESS, COLOR_DANGER} from '../../constants/colors';
//
// export const _formatTime = function(seconds) {
//     let minutes = Math.floor(seconds / 60);
//     seconds %= 60;
//     if (minutes < 10) {
//         minutes = `0${minutes}`;
//     }
//     if (seconds < 10) {
//         seconds = `0${seconds}`;
//     }
//     return `${minutes}:${seconds}`;
// };
//
// export default class extends React.PureComponent {
//     static async permission() {
//         if (!isAndroid) {
//             return true;
//         }
//
//         const rationale = {
//             title: I18n.t('Microphone_Permission'),
//             message: I18n.t('Microphone_Permission_Message'),
//         };
//
//         const result = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//             rationale,
//         );
//         return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
//     }
//
//     static propTypes = {
//         onFinish: PropTypes.func.isRequired,
//     };
//
//     constructor() {
//         super();
//
//         this.recordingCanceled = false;
//         this.recording = true;
//         this.name = `${Date.now()}.aac`;
//         this.state = {
//             currentTime: '00:00',
//         };
//     }
//
//     componentDidMount() {
//         const audioPath = `${AudioUtils.CachesDirectoryPath}/${this.name}`;
//
//         AudioRecorder.prepareRecordingAtPath(audioPath, {
//             SampleRate: 22050,
//             Channels: 1,
//             AudioQuality: 'Low',
//             AudioEncoding: 'aac',
//         });
//
//         AudioRecorder.onProgress = data => {
//             this.setState({
//                 currentTime: _formatTime(Math.floor(data.currentTime)),
//             });
//         };
//         //
//         AudioRecorder.onFinished = data => {
//             if (!this.recordingCanceled && isIOS) {
//                 this.finishRecording(
//                     data.status === 'OK',
//                     data.audioFileURL,
//                     data.audioFileSize,
//                 );
//             }
//         };
//         AudioRecorder.startRecording();
//     }
//
//     componentWillUnmount() {
//         if (this.recording) {
//             this.cancelAudioMessage();
//         }
//     }
//
//     finishRecording = (didSucceed, filePath, size) => {
//         const {onFinish} = this.props;
//         if (!didSucceed) {
//             return onFinish && onFinish(didSucceed);
//         }
//         if (isAndroid) {
//             filePath = filePath.startsWith('file://')
//                 ? filePath
//                 : `file://${filePath}`;
//         }
//         const fileInfo = {
//             name: this.name,
//             mime: 'audio/aac',
//             type: 'audio/aac',
//             store: 'Uploads',
//             path: filePath,
//             size,
//         };
//         return onFinish && onFinish(fileInfo);
//     };
//
//     finishAudioMessage = async () => {
//         try {
//             this.recording = false;
//             const filePath = await AudioRecorder.stopRecording();
//             if (isAndroid) {
//                 const data = await RNFetchBlob.fs.stat(
//                     decodeURIComponent(filePath),
//                 );
//                 this.finishRecording(true, filePath, data.size);
//             }
//         } catch (err) {
//             this.finishRecording(false);
//         }
//     };
//
//     cancelAudioMessage = async () => {
//         this.recording = false;
//         this.recordingCanceled = true;
//         await AudioRecorder.stopRecording();
//         return this.finishRecording(false);
//     };
//
//     render() {
//         const {currentTime} = this.state;
//
//         return (
//             <SafeAreaView
//                 key="messagebox-recording"
//                 testID="messagebox-recording"
//                 style={styles.textBox}>
//                 <View style={styles.textArea}>
//                     <BorderlessButton
//                         onPress={this.cancelAudioMessage}
//                         accessibilityLabel={I18n.t('Cancel_recording')}
//                         accessibilityTraits="button"
//                         style={styles.actionButton}>
//                         <CustomIcon
//                             size={22}
//                             color={COLOR_DANGER}
//                             name="cross"
//                         />
//                     </BorderlessButton>
//                     <Text key="currentTime" style={styles.textBoxInput}>
//                         {currentTime}
//                     </Text>
//                     <BorderlessButton
//                         onPress={this.finishAudioMessage}
//                         accessibilityLabel={I18n.t('Finish_recording')}
//                         accessibilityTraits="button"
//                         style={styles.actionButton}>
//                         <CustomIcon
//                             size={22}
//                             color={COLOR_SUCCESS}
//                             name="check"
//                         />
//                     </BorderlessButton>
//                 </View>
//             </SafeAreaView>
//         );
//     }
// }

import React from 'react';
import PropTypes from 'prop-types';
import {View, PermissionsAndroid, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {BorderlessButton} from 'react-native-gesture-handler';

import {isIOS, isAndroid} from '../../utils/deviceInfo';
import {CustomIcon} from '../../lib/Icons';
import AppConfig from '../../../common/config/app';
import I18n from '../../i18n';

import Style from '../../style';

export const _formatTime = function(seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
};

export default class extends React.PureComponent {
    static async permission() {
        if (!isAndroid) {
            return true;
        }

        const rationale = {
            title: I18n.t('Microphone_Permission'),
            message: I18n.t('Microphone_Permission_Message'),
        };

        const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            rationale,
        );

        return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
    }

    static propTypes = {
        onFinish: PropTypes.func.isRequired,
    };

    constructor() {
        super();

        this.recordingCanceled = false;
        this.recording = true;
        this.state = {
            totalTime: 60,
            currentTime: '00:00',
        };
    }

    componentDidMount() {
        const audioPath = `${AudioUtils.CachesDirectoryPath}/${Date.now()}.${
            AppConfig.speech_format
        }`;

        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: 'Low',
            AudioEncoding: AppConfig.speech_encoding,
        });

        AudioRecorder.onProgress = data => {
            this.setState({
                currentTime: _formatTime(Math.floor(data.currentTime)),
            });

            if (Math.floor(data.currentTime) == this.state.totalTime) {
                this.finishAudioMessage();
            }
        };

        AudioRecorder.onFinished = data => {
            if (!this.recordingCanceled && isIOS) {
                this.finishRecording(data.status === 'OK', data.audioFileURL);
            }
        };

        AudioRecorder.startRecording();
    }

    componentWillUnmount() {
        if (this.recording) {
            this.cancelAudioMessage();
        }
    }

    finishRecording = (didSucceed, filePath) => {
        const {onFinish} = this.props;

        if (!didSucceed) {
            return onFinish && onFinish(didSucceed);
        }

        const path = filePath.startsWith('file://')
            ? filePath.split('file://')[1]
            : filePath;

        const fileInfo = {
            type: 'audio/' + AppConfig.speech_format,
            store: 'Uploads',
            path,
        };

        return onFinish && onFinish(fileInfo);
    };

    finishAudioMessage = async () => {
        try {
            this.recording = false;
            const filePath = await AudioRecorder.stopRecording();
            if (isAndroid) {
                this.finishRecording(true, filePath);
            }
        } catch (err) {
            this.finishRecording(false);
        }
    };

    cancelAudioMessage = async () => {
        this.recording = false;
        this.recordingCanceled = true;
        await AudioRecorder.stopRecording();
        return this.finishRecording(false);
    };

    render() {
        const {currentTime} = this.state;

        return (
            <View
                style={[
                    Style.row,
                    Style.row_center,
                    Style.column_center,
                    {
                        paddingTop: 3,
                        paddingBottom: 2,
                    },
                ]}>
                <BorderlessButton
                    onPress={this.cancelAudioMessage}
                    accessibilityLabel={I18n.t('Cancel_recording')}
                    accessibilityTraits="button"
                    style={[
                        Style.row,
                        Style.row_center,
                        Style.column_center,
                        Style.p_l_4,
                        Style.p_r_4,
                    ]}>
                    <MaterialCommunityIcons
                        name="close"
                        style={[Style.f_size_23, Style.f_color_cityseeker]}
                    />
                </BorderlessButton>
                <Text
                    style={[
                        Style.w_15,
                        Style.text_center,
                        Style.row,
                        Style.row_center,
                        Style.column_center,
                        Style.f_size_13,
                        Style.f_color_2,
                        Style.f_weight_500,
                        Style.f_fa_pf,
                    ]}>
                    {currentTime}
                </Text>
                <BorderlessButton
                    onPress={this.finishAudioMessage}
                    accessibilityLabel={I18n.t('Finish_recording')}
                    accessibilityTraits="button"
                    style={[
                        Style.row,
                        Style.row_center,
                        Style.column_center,
                        Style.p_l_4,
                        Style.p_r_4,
                    ]}>
                    <MaterialCommunityIcons
                        name="send"
                        style={[Style.f_size_23, Style.f_color_green]}
                    />
                </BorderlessButton>
            </View>
        );
    }
}
