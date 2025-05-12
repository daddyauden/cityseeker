import React from 'react';
import {Text, View, TouchableWithoutFeedback, StatusBar} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import {Header, SafeAreaView} from 'react-navigation';
import RNFetchBlob from 'rn-fetch-blob';

import {info, update_resume} from '../../actions/business';
import {add} from '../../actions/record';

import LoadingIndicator from '../../components/LoadingIndicator';
import WebModal from '../../components/WebModal';
import Modal from '../../components/Modal';

import {HIDE_STATUS, TRANSLUCENT_STATUS, Common} from '../../utils/lib';
import Log from '../../utils/log';
import I18n from '../../locale';
import Style from '../../style';

class Default extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            source: {},
            filePreview: false,
        };
    }

    componentDidMount() {
        this._requestData();
    }

    _requestData() {
        const {id} = this.props.account;

        info({
            select: ['id', 'resume'],
            where: ["id = '" + id + "'"],
        }).then(response => {
            const {status, message} = response;

            if (parseInt(status) === 1) {
                const source =
                    message.resume !== undefined && message.resume
                        ? {
                              name: decodeURIComponent(
                                  message.resume.substring(16),
                              ),
                              uri: Common.load_media(
                                  decodeURIComponent(message.resume),
                              ),
                          }
                        : {};

                this.setState({
                    source,
                    loading: false,
                });
            } else {
                this.setState({
                    loading: false,
                });
            }
        });
    }

    _showPreview = () => {
        this.setState({
            filePreview: true,
        });
    };

    _hidePreview = () => {
        this.setState({
            filePreview: false,
        });
    };

    _canUploadFile = file => {
        const {
            FileUpload_MediaTypeWhiteList,
            FileUpload_MaxFileSize,
        } = this.props;

        const result = Common.canUploadFile(file, {
            FileUpload_MediaTypeWhiteList,
            FileUpload_MaxFileSize,
        });

        if (result.success) {
            return true;
        }

        Alert.alert(I18n.t('Error_uploading'), I18n.t(result.error));

        return false;
    };

    _uploadFile = async file => {
        const {account} = this.props;

        const fileInfo = {
            name: file.name,
            uri:
                file.uri.substring(0, file.uri.lastIndexOf('/')) +
                '/' +
                file.name,
        };

        try {
            const data = [
                {
                    name: 'id',
                    data: account.id,
                },
                {
                    name: 'resume',
                    filename: fileInfo.name,
                    data: RNFetchBlob.wrap(fileInfo.uri.substring(7)),
                },
            ];

            update_resume(data).then(res => {
                const {status, message} = res;

                if (
                    parseInt(status) === 1 &&
                    message !== undefined &&
                    message
                ) {
                    this.setState({
                        source: {
                            name: decodeURIComponent(message.substring(16)),
                            uri: Common.load_media(decodeURIComponent(message)),
                        },
                    });
                }
            });
        } catch (e) {
            Log(e);
        }
    };

    _chooseFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [
                    'com.adobe.pdf',
                    'com.microsoft.word.doc',
                    'org.openxmlformats.wordprocessingml.document',
                    'com.apple.iwork.pages.pages',
                    'com.apple.iwork.numbers.numbers',
                    'com.apple.iwork.keynote.key',
                    'public.text',
                    'AppCoda-PDF.pdf',
                    'AppCoda-Pages.pages',
                    'AppCoda-Word.docx',
                    'AppCoda-Keynote.key',
                    'AppCoda-Text.txt',
                ],
            });

            const file = {
                name: res.name,
                uri: res.uri,
            };
            if (this._canUploadFile(file)) {
                this._uploadFile(file);
            }
        } catch (e) {
            if (!DocumentPicker.isCancel(e)) {
                Log(e);
            }
        }
    };

    _applyJob = () => {
        const {data, recordOp, onDismiss} = this.props;

        recordOp &&
            recordOp('add', {
                type: 'job',
                action: 'delivery',
                content: data.id,
            });

        Common.showToast({
            message: (
                <MaterialCommunityIcons
                    name="check"
                    style={[Style.f_size_30, Style.f_color_15]}
                />
            ),
            style: {
                ...Style.bg_color_green,
            },
            op: {
                onHidden: onDismiss || null,
            },
        });
    };

    render() {
        const {loading} = this.state;

        const {visible, onDismiss} = this.props;

        return loading === true ? (
            <View style={[Style.flex, Style.row_center, Style.column_center]}>
                <LoadingIndicator />
            </View>
        ) : (
            <SafeAreaView style={[Style.flex, Style.theme_content]}>
                <StatusBar
                    hidden={HIDE_STATUS}
                    barStyle="dark-content"
                    translucent={TRANSLUCENT_STATUS}
                />
                <Modal
                    style={{
                        container: {
                            ...Style.flex,
                            ...Style.column,
                            ...Style.row_end,
                            ...Style.bg_color_15_transparent,
                        },
                        header: {
                            ...Style.bg_color_gray,
                            ...Style.shadow_all_3,
                            ...Style.border_round_top_4,
                        },
                        content: {
                            ...Style.p_b_10,
                            ...Style.bg_color_gray,
                        },
                    }}
                    animationType="slide"
                    visible={visible}
                    transparent={false}
                    renderContent={() => {
                        const {source, filePreview} = this.state;

                        const hasResume =
                            source.uri !== undefined && source.uri;

                        const fileFormat =
                            source.name !== undefined &&
                            source.name &&
                            source.name.substring(
                                source.name.lastIndexOf('.') + 1,
                            );

                        return (
                            <View
                                style={[Style.row_center, Style.column_center]}>
                                <Text
                                    style={[
                                        Style.f_size_16,
                                        Style.f_color_3,
                                        Style.f_bold,
                                    ]}>
                                    {hasResume
                                        ? I18n.t('module.job.have_cv')
                                        : I18n.t('module.job.have_not_cv')}
                                </Text>
                                <View
                                    style={[
                                        Style.row,
                                        Style.row_center,
                                        Style.p_3,
                                    ]}>
                                    {hasResume && (
                                        <View
                                            style={[
                                                Style.column_center,
                                                Style.flex,
                                            ]}>
                                            <View
                                                style={[
                                                    Style.row,
                                                    Style.column_center,
                                                ]}>
                                                <MaterialCommunityIcons
                                                    name={
                                                        fileFormat === 'pdf'
                                                            ? 'file-pdf-box'
                                                            : 'file-word-box'
                                                    }
                                                    style={[
                                                        Style.f_size_70,
                                                        Style.f_color_6,
                                                    ]}
                                                />
                                                {fileFormat === 'pdf' && (
                                                    <MaterialCommunityIcons
                                                        onPress={
                                                            this._showPreview
                                                        }
                                                        name={'open-in-new'}
                                                        style={[
                                                            Style.f_size_17,
                                                            Style.f_color_9,
                                                        ]}
                                                    />
                                                )}
                                            </View>
                                            <Text
                                                style={[
                                                    Style.f_size_13,
                                                    Style.f_color_6,
                                                    Style.f_regular,
                                                ]}>
                                                {source.name}
                                            </Text>
                                        </View>
                                    )}
                                    <View style={[Style.row_center]}>
                                        <TouchableWithoutFeedback
                                            onPress={this._chooseFile}>
                                            <View
                                                style={[
                                                    Style.bg_color_14,
                                                    Style.b_14,
                                                    Style.border_round_2,
                                                    Style.p_2,
                                                ]}>
                                                <Text
                                                    style={[
                                                        Style.f_size_13,
                                                        Style.f_color_6,
                                                        Style.f_bold,
                                                    ]}>
                                                    {hasResume
                                                        ? I18n.t(
                                                              'module.job.choose_new_cv',
                                                          )
                                                        : I18n.t(
                                                              'module.job.choose_cv',
                                                          )}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                {hasResume && (
                                    <TouchableWithoutFeedback
                                        onPress={this._applyJob}>
                                        <View
                                            style={[
                                                Style.bg_color_google,
                                                Style.border_round_2,
                                                Style.p_h_6,
                                                Style.p_v_2,
                                            ]}>
                                            <Text
                                                style={[
                                                    Style.f_size_17,
                                                    Style.f_color_15,
                                                    Style.f_bold,
                                                ]}>
                                                {I18n.t('module.job.apply')}
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )}
                                {Object.keys(source).length > 0 && (
                                    <WebModal
                                        visible={filePreview}
                                        onDismiss={this._hidePreview}
                                        url={source.uri}
                                    />
                                )}
                            </View>
                        );
                    }}
                    onDismiss={onDismiss}
                    renderHeader={() => {
                        return (
                            <TouchableWithoutFeedback onPress={onDismiss}>
                                <View
                                    style={[
                                        Style.row,
                                        Style.row_center,
                                        Style.column_center,
                                        Style.p_v_1,
                                    ]}>
                                    <MaterialCommunityIcons
                                        name={'drag-horizontal'}
                                        style={[
                                            Style.f_color_cityseeker,
                                            Style.f_size_20,
                                        ]}
                                    />
                                    <MaterialCommunityIcons
                                        name={'drag-horizontal'}
                                        style={[
                                            Style.f_color_cityseeker,
                                            Style.f_size_20,
                                        ]}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        );
                    }}
                />
            </SafeAreaView>
        );
    }
}

export default Default;
