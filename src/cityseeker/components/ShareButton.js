import React from 'react';
import {View, Image, Text, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ShareDialog} from 'react-native-fbsdk';
import * as WeChat from 'react-native-wechat';
import {Common, IS_IOS} from '../utils/lib';
import SourceType from '../type/source';
import Modal from './Modal';
import Style from '../style';
import I18n from '../locale';

class ShareButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasWechat: false,
            collected: false,
            visible: false,
        };
    }

    componentDidMount() {
        WeChat.isWXAppInstalled().then(status => {
            this.setState({
                hasWechat: status ? true : false,
            });
        });
    }

    _tel = phone => {
        Common.tel(phone, true);
    };

    _sms = phone => {
        const {system, data} = this.props;
        const {area} = system;

        const {country} = area;

        const body = I18n.t('share_sms_template');

        const item_type = I18n.t('item.type.' + data.type);
        const item_link = Common.admin_host(country) + '/item/' + data.id;
        Common.sms(
            phone,
            body
                .replace('%item_type%', item_type)
                .replace('%item_link%', item_link),
        );
    };

    _browser = data => {
        const {area} = this.props.system;

        const {country} = area;

        Common.browser(Common.admin_host(country) + '/item/' + data.id);
    };

    _share = async (source, type) => {
        const {system, data} = this.props;
        const {area} = system;

        const {country} = area;

        if (source.toLowerCase() === SourceType.wechat) {
            if (type === 'timeline') {
                WeChat.isWXAppInstalled().then(isInstalled => {
                    if (isInstalled) {
                        WeChat.shareToTimeline({
                            type: 'news',
                            title: 'cityseeker: ' + data.name,
                            description: data.description
                                ? 'cityseeker: ' + data.description
                                : 'cityseeker: ' + data.name,
                            thumbImage: Common.load_image(data.banner),
                            webpageUrl:
                                Common.admin_host(country) + '/item/' + data.id,
                        })
                            .then(_ => {
                                Common.showToast({
                                    message: (
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_weight_500,
                                            ]}>
                                            {I18n.t('common.share') +
                                                ' ' +
                                                I18n.t('common.success')}
                                        </Text>
                                    ),
                                    style: {
                                        ...Style.bg_color_green,
                                    },
                                });
                            })
                            .catch(error => {
                                Common.showToast({
                                    message: (
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_weight_500,
                                            ]}>
                                            {I18n.t('common.share') +
                                                ' ' +
                                                I18n.t('common.fail')}
                                        </Text>
                                    ),
                                    style: {
                                        ...Style.bg_color_cityseeker,
                                    },
                                });
                            });
                    } else {
                        Common.showToast({
                            message: (
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_weight_500,
                                    ]}>
                                    Please install Wechat
                                </Text>
                            ),
                            style: {
                                ...Style.bg_color_cityseeker,
                                ...Style.p_3,
                            },
                            op: {
                                onHidden: () => {},
                            },
                        });
                    }
                });
            } else if (type === 'session') {
                WeChat.isWXAppInstalled().then(isInstalled => {
                    if (isInstalled) {
                        WeChat.shareToSession({
                            type: 'news',
                            title: 'cityseeker: ' + data.name,
                            description: data.description
                                ? 'cityseeker: ' + data.description
                                : 'cityseeker: ' + data.name,
                            thumbImage: Common.load_image(data.banner),
                            webpageUrl:
                                Common.admin_host(country) + '/item/' + data.id,
                        })
                            .then(_ => {
                                Common.showToast({
                                    message: (
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_weight_500,
                                            ]}>
                                            {I18n.t('common.share') +
                                                ' ' +
                                                I18n.t('common.success')}
                                        </Text>
                                    ),
                                    style: {
                                        ...Style.bg_color_green,
                                    },
                                });
                            })
                            .catch(error => {
                                Common.showToast({
                                    message: (
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_weight_500,
                                            ]}>
                                            {I18n.t('common.share') +
                                                ' ' +
                                                I18n.t('common.fail')}
                                        </Text>
                                    ),
                                    style: {
                                        ...Style.bg_color_cityseeker,
                                        ...Style.p_3,
                                    },
                                    op: {
                                        onHidden: () => {},
                                    },
                                });
                            });
                    } else {
                        Common.showToast({
                            message: (
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_weight_500,
                                    ]}>
                                    Please install Wechat
                                </Text>
                            ),
                            style: {
                                ...Style.bg_color_cityseeker,
                                ...Style.p_3,
                            },
                            op: {
                                onHidden: () => {},
                            },
                        });
                    }
                });
            } else if (type === 'favorite') {
                WeChat.isWXAppInstalled().then(isInstalled => {
                    if (isInstalled) {
                        WeChat.shareToFavorite({
                            type: 'news',
                            title: 'cityseeker: ' + data.name,
                            description: data.description
                                ? 'cityseeker: ' + data.description
                                : 'cityseeker: ' + data.name,
                            thumbImage: Common.load_image(data.banner),
                            webpageUrl:
                                Common.admin_host(country) + '/item/' + data.id,
                        })
                            .then(_ => {
                                Common.showToast({
                                    message: (
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_weight_500,
                                            ]}>
                                            {I18n.t('common.save') +
                                                ' ' +
                                                I18n.t('common.success')}
                                        </Text>
                                    ),
                                    style: {
                                        ...Style.bg_color_green,
                                    },
                                });
                            })
                            .catch(error => {
                                Common.showToast({
                                    message: (
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_weight_500,
                                            ]}>
                                            {I18n.t('common.save') +
                                                ' ' +
                                                I18n.t('common.fail')}
                                        </Text>
                                    ),
                                    style: {
                                        ...Style.bg_color_cityseeker,
                                        ...Style.p_3,
                                    },
                                    op: {
                                        onHidden: () => {},
                                    },
                                });
                            });
                    } else {
                        Common.showToast({
                            message: (
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_weight_500,
                                    ]}>
                                    Please install Wechat
                                </Text>
                            ),
                            style: {
                                ...Style.bg_color_cityseeker,
                                ...Style.p_3,
                            },
                            op: {
                                onHidden: () => {},
                            },
                        });
                    }
                });
            }
        }

        if (source.toLowerCase() === SourceType.facebook) {
            const shareContent = {
                contentType: 'link',
                contentUrl: Common.admin_host(country) + '/item/' + data.id,
                imageUrl: Common.load_image(data.banner),
                contentTitle: data.name,
                contentDescription: data.name,
                quote: 'cityseeker: ',
            };

            ShareDialog.canShow(shareContent)
                .then(function(canShow) {
                    if (canShow) {
                        return ShareDialog.show(shareContent);
                    }
                })
                .then(
                    function(result) {
                        if (result.isCancelled) {
                            Common.showToast({
                                message: (
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_weight_500,
                                        ]}>
                                        {I18n.t('common.share') +
                                            ' ' +
                                            I18n.t('common.cancel')}
                                    </Text>
                                ),
                                style: {
                                    ...Style.bg_color_cityseeker,
                                    ...Style.p_3,
                                },
                                op: {
                                    onHidden: () => {},
                                },
                            });
                        } else {
                            Common.showToast({
                                message: (
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_weight_500,
                                        ]}>
                                        {I18n.t('common.share') +
                                            ' ' +
                                            I18n.t('common.success')}
                                    </Text>
                                ),
                                style: {
                                    ...Style.bg_color_green,
                                },
                            });
                        }
                    },
                    function(error) {
                        Common.showToast({
                            message: (
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_weight_500,
                                    ]}>
                                    {I18n.t('common.share') +
                                        ' ' +
                                        I18n.t('common.fail')}
                                </Text>
                            ),
                            style: {
                                ...Style.bg_color_cityseeker,
                                ...Style.p_3,
                            },
                            op: {
                                onHidden: () => {},
                            },
                        });
                    },
                );
        }
    };

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

    render() {
        const {data, position} = this.props;

        let tel =
            data.tel !== undefined
                ? data.tel
                : data.business !== undefined && data.business.tel !== undefined
                ? data.business.tel
                : data.user !== undefined && data.user.phone !== undefined
                ? data.user.phone
                : null;

        return (
            <View>
                <TouchableWithoutFeedback onPress={this._showModal.bind(this)}>
                    <View
                        style={[
                            position === 'bottom_left'
                                ? Style.bottom_left
                                : Style.bottom_right,
                            position === 'bottom_left'
                                ? Style.m_l_1
                                : Style.m_r_2,
                            Style.m_b_2,
                            Style.w_15,
                            Style.h_15,
                            Style.border_round_15,
                            Style.bg_color_15,
                            Style.column,
                            Style.column_center,
                            Style.row_center,
                            Style.shadow,
                        ]}>
                        <MaterialCommunityIcons
                            name="share-variant"
                            style={[Style.f_size_22, Style.f_color_3]}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <Modal
                    style={{
                        container: {
                            ...Style.flex,
                            ...Style.row_end,
                            ...Style.column_center,
                            ...Style.bg_transparent,
                        },
                        content: {
                            ...Style.bg_color_15,
                            ...Style.border_round_1,
                        },
                        footer: {
                            ...Style.bottom_horizontal,
                            ...Style.text_center,
                        },
                    }}
                    visible={this.state.visible}
                    onDismiss={this._hideModal}
                    renderContent={() => {
                        return (
                            <View
                                style={[
                                    Style.column,
                                    Style.theme_footer,
                                    Style.w_100,
                                ]}>
                                <View
                                    style={[
                                        Style.bg_color_14,
                                        Style.b_b,
                                        Style.p_4,
                                        Style.row,
                                        Style.row_center,
                                        Style.column_center,
                                    ]}>
                                    {tel !== undefined && tel !== null && (
                                        <View
                                            style={[
                                                Style.m_h_2,
                                                Style.column,
                                                Style.column_center,
                                                Style.row_center,
                                            ]}>
                                            <View
                                                style={[
                                                    Style.w_10,
                                                    Style.h_10,
                                                    Style.border_round_1,
                                                    Style.row,
                                                    Style.column_center,
                                                    Style.row_center,
                                                    IS_IOS === true
                                                        ? Style.bg_color_sms_ios
                                                        : Style.bg_color_sms_android,
                                                ]}>
                                                <MaterialCommunityIcons
                                                    onPress={this._tel.bind(
                                                        this,
                                                        tel,
                                                    )}
                                                    name="phone"
                                                    style={[
                                                        Style.f_size_25,
                                                        Style.f_color_15,
                                                    ]}
                                                />
                                            </View>
                                            <Text
                                                style={[
                                                    Style.m_t_2,
                                                    Style.f_color_6,
                                                    Style.f_size_11,
                                                ]}>
                                                {I18n.t('common.phone')}
                                            </Text>
                                        </View>
                                    )}
                                    {tel !== undefined && tel !== null && (
                                        <View
                                            style={[
                                                Style.m_h_2,
                                                Style.column,
                                                Style.column_center,
                                                Style.row_center,
                                            ]}>
                                            <View
                                                style={[
                                                    Style.w_10,
                                                    Style.h_10,
                                                    Style.border_round_1,
                                                    Style.row,
                                                    Style.column_center,
                                                    Style.row_center,
                                                    IS_IOS === true
                                                        ? Style.bg_color_sms_ios
                                                        : Style.bg_color_sms_android,
                                                ]}>
                                                <FontAwesome5
                                                    onPress={this._sms.bind(
                                                        this,
                                                        tel,
                                                    )}
                                                    name={
                                                        IS_IOS === true
                                                            ? 'comment'
                                                            : 'comment-alt'
                                                    }
                                                    solid
                                                    style={[
                                                        Style.f_size_25,
                                                        Style.f_color_15,
                                                    ]}
                                                />
                                            </View>
                                            <Text
                                                style={[
                                                    Style.m_t_2,
                                                    Style.f_color_6,
                                                    Style.f_size_11,
                                                ]}>
                                                {I18n.t('common.sms')}
                                            </Text>
                                        </View>
                                    )}
                                    <View
                                        style={[
                                            Style.m_h_2,
                                            Style.column,
                                            Style.column_center,
                                            Style.row_center,
                                        ]}>
                                        <View
                                            style={[
                                                Style.w_10,
                                                Style.h_10,
                                                Style.row,
                                                Style.p_0,
                                                Style.column_center,
                                                Style.row_center,
                                            ]}>
                                            <TouchableWithoutFeedback
                                                onPress={this._browser.bind(
                                                    this,
                                                    data,
                                                )}>
                                                <Image
                                                    source={
                                                        IS_IOS === true
                                                            ? require('../../common/assets/images/safari.png')
                                                            : require('../../common/assets/images/chrome.png')
                                                    }
                                                    style={[
                                                        Style.w_p100,
                                                        Style.h_p100,
                                                    ]}
                                                />
                                            </TouchableWithoutFeedback>
                                        </View>
                                        <Text
                                            style={[
                                                Style.m_t_2,
                                                Style.f_color_6,
                                                Style.f_size_11,
                                            ]}>
                                            {I18n.t('common.link')}
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={[
                                        Style.bg_color_14,
                                        Style.b_t,
                                        Style.p_4,
                                        Style.row,
                                        Style.wrap,
                                        Style.column_center,
                                        Style.row_center,
                                    ]}>
                                    {this.state.hasWechat === true && (
                                        <View
                                            style={[
                                                Style.row,
                                                Style.row_center,
                                                Style.column_center,
                                            ]}>
                                            <View
                                                style={[
                                                    Style.m_h_2,
                                                    Style.column,
                                                    Style.column_center,
                                                    Style.row_center,
                                                ]}>
                                                <View
                                                    style={[
                                                        Style.w_10,
                                                        Style.h_10,
                                                        Style.row,
                                                        Style.column_center,
                                                        Style.row_center,
                                                    ]}>
                                                    <TouchableWithoutFeedback
                                                        onPress={this._share.bind(
                                                            this,
                                                            'wechat',
                                                            'timeline',
                                                        )}>
                                                        <Image
                                                            source={require('../../common/assets/images/wechat_moments.png')}
                                                            style={[
                                                                Style.w_p100,
                                                                Style.h_p100,
                                                            ]}
                                                        />
                                                    </TouchableWithoutFeedback>
                                                </View>
                                                <Text
                                                    style={[
                                                        Style.m_t_2,
                                                        Style.f_color_6,
                                                        Style.f_size_11,
                                                    ]}>
                                                    {I18n.t('common.moments')}
                                                </Text>
                                            </View>
                                            <View
                                                style={[
                                                    Style.m_h_2,
                                                    Style.column,
                                                    Style.column_center,
                                                    Style.row_center,
                                                ]}>
                                                <View
                                                    style={[
                                                        Style.w_10,
                                                        Style.h_10,
                                                        Style.border_round_1,
                                                        Style.bg_color_wechat,
                                                        Style.row,
                                                        Style.column_center,
                                                        Style.row_center,
                                                    ]}>
                                                    <MaterialCommunityIcons
                                                        onPress={this._share.bind(
                                                            this,
                                                            'wechat',
                                                            'session',
                                                        )}
                                                        name="wechat"
                                                        style={[
                                                            Style.f_size_25,
                                                            Style.f_color_15,
                                                        ]}
                                                    />
                                                </View>
                                                <Text
                                                    style={[
                                                        Style.m_t_2,
                                                        Style.f_color_6,
                                                        Style.f_size_11,
                                                    ]}>
                                                    {I18n.t('common.friends')}
                                                </Text>
                                            </View>
                                            <View
                                                style={[
                                                    Style.m_h_2,
                                                    Style.column,
                                                    Style.column_center,
                                                    Style.row_center,
                                                ]}>
                                                <View
                                                    style={[
                                                        Style.w_10,
                                                        Style.h_10,
                                                        Style.row,
                                                        Style.column_center,
                                                        Style.row_center,
                                                    ]}>
                                                    <TouchableWithoutFeedback
                                                        onPress={this._share.bind(
                                                            this,
                                                            'wechat',
                                                            'favorite',
                                                        )}>
                                                        <Image
                                                            source={require('../../common/assets/images/wechat_collect.png')}
                                                            style={[
                                                                Style.w_p100,
                                                                Style.h_p100,
                                                            ]}
                                                        />
                                                    </TouchableWithoutFeedback>
                                                </View>
                                                <Text
                                                    style={[
                                                        Style.m_t_2,
                                                        Style.f_color_6,
                                                        Style.f_size_11,
                                                    ]}>
                                                    {I18n.t('common.collect')}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                    <View
                                        style={[
                                            Style.m_h_2,
                                            Style.column,
                                            Style.column_center,
                                            Style.row_center,
                                        ]}>
                                        <View
                                            style={[
                                                Style.w_10,
                                                Style.h_10,
                                                Style.border_round_1,
                                                Style.bg_color_facebook,
                                                Style.row,
                                                Style.column_center,
                                                Style.row_center,
                                            ]}>
                                            <MaterialCommunityIcons
                                                onPress={this._share.bind(
                                                    this,
                                                    'facebook',
                                                )}
                                                name="facebook"
                                                style={[
                                                    Style.f_size_25,
                                                    Style.f_color_15,
                                                ]}
                                            />
                                        </View>
                                        <Text
                                            style={[
                                                Style.m_t_2,
                                                Style.f_color_6,
                                                Style.f_size_11,
                                            ]}>
                                            {I18n.t('common.facebook')}
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={[
                                        Style.row,
                                        Style.row_center,
                                        Style.column_center,
                                        Style.bg_color_15,
                                    ]}>
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            this.setState({
                                                visible: false,
                                            });
                                        }}>
                                        <View
                                            style={[Style.p_b_8, Style.p_t_4]}>
                                            <Text
                                                style={[
                                                    Style.f_color_3,
                                                    Style.f_size_20,
                                                ]}>
                                                {I18n.t('common.cancel')}
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        );
                    }}
                />
            </View>
        );
    }
}

export default ShareButton;
