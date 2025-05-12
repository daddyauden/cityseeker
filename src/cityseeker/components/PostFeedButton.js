import React from 'react';
import {View, Text, Modal, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Header} from 'react-navigation-stack';
import Navigation from '../lib/navigation';
import {Common} from '../utils/lib';
import Divide from './Divide';
import I18n from '../locale';
import Style from '../style';

class PostFeedButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
        };
    }

    _showModal = () => {
        this.setState({
            visible: true,
        });
    };

    _hideModal = () => {
        this.setState({
            visible: false,
        });
    };

    _showPost = (feedType, pickerType, mediaType) => {
        const {account} = this.props;

        if (account.isLoggedIn === true) {
            this.setState(
                {
                    visible: false,
                },
                () => {
                    setTimeout(() => {
                        Navigation.navigate('PostFeed', {
                            feedType: feedType,
                            pickerType: pickerType,
                            mediaType: mediaType,
                        });
                    }, 500);
                },
            );
        } else {
            this.setState(
                {
                    visible: false,
                },
                () => {
                    setTimeout(() => {
                        Common.showToast({
                            message: (
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_weight_500,
                                    ]}>
                                    {I18n.t('common.nosignin')}
                                </Text>
                            ),
                            style: {
                                ...Style.bg_color_cityseeker,
                                ...Style.p_3,
                            },
                            op: {
                                onHidden: () => {},
                            },
                            config: {
                                duration: 2000,
                                position: Common.isIphoneX()
                                    ? Header.HEIGHT + 25
                                    : Header.HEIGHT,
                            },
                        });
                    }, 500);
                },
            );
        }
    };

    render() {
        return (
            <View>
                <TouchableWithoutFeedback onPress={this._showModal.bind(this)}>
                    <View
                        style={[
                            this.props.style,
                            Style.row,
                            Style.column_center,
                        ]}>
                        <MaterialCommunityIcons
                            name="plus-circle"
                            style={[Style.f_size_27, Style.f_color_cityseeker]}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <Modal
                    visible={this.state.visible}
                    onDismiss={this._hideModal}
                    onRequestClose={this._hideModal}
                    transparent={true}
                    animationType="fade">
                    <TouchableWithoutFeedback onPress={() => this._hideModal()}>
                        <View style={[Style.flex, Style.bg_color_feed]}>
                            <View
                                style={[
                                    Style.top_right,
                                    {
                                        top:
                                            Common.getStatusBarHeight(true) +
                                            Header.HEIGHT / 3,
                                        right: 8,
                                    },
                                ]}>
                                <MaterialCommunityIcons
                                    name="menu-up"
                                    style={[Style.f_size_30, Style.f_color_4]}
                                />
                            </View>
                            <View
                                style={[
                                    Style.column,
                                    Style.bg_color_4,
                                    Style.b_feed,
                                    Style.border_round_1,
                                    Style.top_right,
                                    {
                                        top:
                                            Common.getStatusBarHeight(true) +
                                            Header.HEIGHT / 3 +
                                            18,
                                        right: 5,
                                    },
                                ]}>
                                <TouchableWithoutFeedback
                                    onPress={this._showPost.bind(
                                        this,
                                        'feed',
                                        'album',
                                        'photo',
                                    )}>
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                            Style.p_v_3,
                                            Style.p_h_5,
                                        ]}>
                                        <MaterialCommunityIcons
                                            name="file-document"
                                            style={[
                                                Style.f_color_feed_feed,
                                                Style.f_size_23,
                                                Style.m_r_3,
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                Style.f_color_15,
                                                Style.f_weight_800,
                                                Style.f_size_12,
                                            ]}>
                                            {I18n.t('feed.type.feed')}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <Divide
                                    style={{
                                        height: 1,
                                        backgroundColor: '#4D4D4D',
                                    }}
                                />
                                <TouchableWithoutFeedback
                                    onPress={this._showPost.bind(
                                        this,
                                        'video',
                                        'album',
                                        'photo',
                                    )}>
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                            Style.p_v_3,
                                            Style.p_h_5,
                                        ]}>
                                        <MaterialCommunityIcons
                                            name="file-video"
                                            style={[
                                                Style.f_color_feed_video,
                                                Style.f_size_23,
                                                Style.m_r_3,
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                Style.f_color_15,
                                                Style.f_weight_800,
                                                Style.f_size_12,
                                            ]}>
                                            {I18n.t('feed.type.video')}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <Divide
                                    style={{
                                        height: 1,
                                        backgroundColor: '#4D4D4D',
                                    }}
                                />
                                <TouchableWithoutFeedback
                                    onPress={this._showPost.bind(
                                        this,
                                        'article',
                                        'album',
                                        'photo',
                                    )}>
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                            Style.p_v_3,
                                            Style.p_h_5,
                                        ]}>
                                        <MaterialCommunityIcons
                                            name="file-document-box"
                                            style={[
                                                Style.f_color_feed_article,
                                                Style.f_size_23,
                                                Style.m_r_3,
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                Style.f_color_15,
                                                Style.f_weight_800,
                                                Style.f_size_12,
                                            ]}>
                                            {I18n.t('feed.type.article')}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <Divide
                                    style={{
                                        height: 1,
                                        backgroundColor: '#4D4D4D',
                                    }}
                                />
                                <TouchableWithoutFeedback
                                    onPress={this._showPost.bind(
                                        this,
                                        'link',
                                        'album',
                                        'photo',
                                    )}>
                                    <View
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                            Style.p_v_3,
                                            Style.p_h_5,
                                        ]}>
                                        <MaterialCommunityIcons
                                            name="link"
                                            style={[
                                                Style.f_color_feed_link,
                                                Style.f_size_23,
                                                Style.m_r_3,
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                Style.f_color_15,
                                                Style.f_weight_800,
                                                Style.f_size_12,
                                            ]}>
                                            {I18n.t('feed.type.link')}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }
}

export default PostFeedButton;
