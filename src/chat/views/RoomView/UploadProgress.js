import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {responsive} from 'react-native-responsive-ui';
import {Q} from '@nozbe/watermelondb';

import database from '../../lib/database';
import RocketChat from '../../lib/rocketchat';
import log from '../../utils/log';
import I18n from '../../i18n';
import {CustomIcon} from '../../lib/Icons';
import {
    COLOR_SEPARATOR,
    COLOR_PRIMARY,
    COLOR_BACKGROUND_CONTAINER,
    COLOR_TEXT_DESCRIPTION,
    COLOR_DANGER,
} from '../../constants/colors';
import sharedStyles from '../Styles';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Style from '../../style';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        width: '100%',
        maxHeight: 246,
    },
    item: {
        backgroundColor: COLOR_BACKGROUND_CONTAINER,
        height: 54,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: COLOR_SEPARATOR,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    descriptionContainer: {
        flexDirection: 'column',
        flex: 1,
        marginLeft: 10,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 20,
        ...sharedStyles.textColorDescription,
        ...sharedStyles.textRegular,
    },
    progress: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: COLOR_PRIMARY,
        height: 3,
    },
    tryAgainButtonText: {
        color: COLOR_PRIMARY,
        fontSize: 16,
        lineHeight: 20,
        ...sharedStyles.textMedium,
    },
});

class UploadProgress extends Component {
    static propTypes = {
        window: PropTypes.object,
        rid: PropTypes.string,
        user: PropTypes.shape({
            id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            token: PropTypes.string.isRequired,
        }),
        baseUrl: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.mounted = false;
        this.ranInitialUploadCheck = false;
        this.state = {
            uploads: [],
        };
        this.init();
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        if (this.uploadsSubscription && this.uploadsSubscription.unsubscribe) {
            this.uploadsSubscription.unsubscribe();
        }
    }

    init = () => {
        const {rid} = this.props;

        const db = database.active;
        this.uploadsObservable = db.collections
            .get('uploads')
            .query(Q.where('rid', rid))
            .observeWithColumns(['progress', 'error']);

        this.uploadsSubscription = this.uploadsObservable.subscribe(uploads => {
            if (this.mounted) {
                this.setState({uploads});
            } else {
                this.state.uploads = uploads;
            }
            if (!this.ranInitialUploadCheck) {
                this.uploadCheck();
            }
        });
    };

    uploadCheck = () => {
        this.ranInitialUploadCheck = true;
        const {uploads} = this.state;
        uploads.forEach(async u => {
            if (!RocketChat.isUploadActive(u.path)) {
                try {
                    const db = database.active;
                    await db.action(async () => {
                        await u.update(() => {
                            u.error = true;
                        });
                    });
                } catch (e) {
                    log(e);
                }
            }
        });
    };

    deleteUpload = async item => {
        try {
            const db = database.active;
            await db.action(async () => {
                await item.destroyPermanently();
            });
        } catch (e) {
            log(e);
        }
    };

    cancelUpload = async item => {
        try {
            await RocketChat.cancelUpload(item);
        } catch (e) {
            log(e);
        }
    };

    tryAgain = async item => {
        const {rid, baseUrl: server, user} = this.props;

        try {
            const db = database.active;
            await db.action(async () => {
                await item.update(() => {
                    item.error = false;
                });
            });
            await RocketChat.sendFileMessage(
                rid,
                item,
                undefined,
                server,
                user,
            );
        } catch (e) {
            log(e);
        }
    };

    renderItemContent = item => {
        const {window} = this.props;

        if (!item.error) {
            return (
                <View
                    style={[
                        Style.top,
                        Style.bg_color_cityseeker,
                        {
                            top: 0,
                            height: 2,
                            width: (window.width * item.progress) / 100,
                        },
                    ]}
                />
            );
        }

        return (
            <View
                style={[
                    Style.row,
                    Style.column_start,
                    Style.p_t_1,
                    Style.p_v_1,
                    Style.p_h_2,
                ]}>
                <MaterialCommunityIcons
                    name="alert-circle-outline"
                    style={[Style.f_size_20, Style.f_color_cityseeker]}
                />
                <View style={[Style.flex, Style.row, Style.m_l_2]}>
                    <TouchableOpacity onPress={() => this.tryAgain(item)}>
                        <Text
                            numberOfLines={1}
                            style={[
                                Style.f_color_5,
                                Style.f_size_14,
                                Style.f_weight_500,
                                Style.f_fa_pf,
                            ]}>
                            {I18n.t('Try_again')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <MaterialCommunityIcons
                    name="close"
                    style={[Style.f_size_20, Style.f_color_5]}
                    onPress={() => this.deleteUpload(item)}
                />
            </View>
        );
    };

    renderItem = (item, index) => (
        <View
            key={item.path}
            style={[
                Style.bg_color_gray,
                Style.row,
                Style.column_center,
                index !== 0 ? Style.m_t_2 : {},
            ]}>
            {this.renderItemContent(item)}
        </View>
    );

    render() {
        const {uploads} = this.state;

        return (
            <ScrollView
                style={[
                    Style.top,
                    Style.w_p100,
                    {
                        maxHeight: 100,
                    },
                ]}>
                {uploads.map((item, i) => this.renderItem(item, i))}
            </ScrollView>
        );
    }
}

export default responsive(UploadProgress);
