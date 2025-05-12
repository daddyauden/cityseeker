import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
    PixelRatio,
} from 'react-native';
import PropTypes from 'prop-types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import equal from 'deep-equal';
import {responsive} from 'react-native-responsive-ui';
import Touchable from 'react-native-platform-touchable';

import {removeNotification as removeNotificationAction} from '../../actions/notification';
import {HAS_NOTCH, IS_IOS} from '../../utils/lib';

import Avatar from '../../../lingchat/containers/Avatar';
import AppConfig from '../../config/app';

import Style from '../../style';

const AVATAR_SIZE = 36;
const ANIMATION_DURATION = 600;
const NOTIFICATION_DURATION = 3000;
const BUTTON_HIT_SLOP = {
    top: 12,
    right: 12,
    bottom: 12,
    left: 12,
};

const ANIMATION_PROPS = {
    duration: ANIMATION_DURATION,
    easing: Easing.inOut(Easing.quad),
    useNativeDriver: true,
};

const ROW_HEIGHT = 50 * PixelRatio.getFontScale();

class NotificationBadge extends React.Component {
    static propTypes = {
        navigation: PropTypes.object,
        baseUrl: PropTypes.string,
        token: PropTypes.string,
        userId: PropTypes.string,
        notification: PropTypes.object,
        window: PropTypes.object,
        removeNotification: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.animatedValue = new Animated.Value(0);
    }

    shouldComponentUpdate(nextProps) {
        const {notification: nextNotification} = nextProps;

        const {
            notification: {payload},
            window,
        } = this.props;

        if (!equal(nextNotification.payload, payload)) {
            return true;
        }

        if (nextProps.window.width !== window.width) {
            return true;
        }

        return false;
    }

    componentDidUpdate() {
        const {
            notification: {payload},
            navigation,
        } = this.props;

        const navState = this.getNavState(navigation.state);

        if (payload.rid) {
            if (
                navState &&
                navState.routeName === 'RoomView' &&
                navState.params &&
                navState.params.rid === payload.rid
            ) {
                return;
            }

            this.show();
        }
    }

    componentWillUnmount() {
        this.clearTimeout();
    }

    show = () => {
        Animated.timing(this.animatedValue, {
            toValue: 1,
            ...ANIMATION_PROPS,
        }).start(() => {
            this.clearTimeout();
            this.timeout = setTimeout(() => {
                this.hide();
            }, NOTIFICATION_DURATION);
        });
    };

    hide = () => {
        const {removeNotification} = this.props;

        Animated.timing(this.animatedValue, {
            toValue: 0,
            ...ANIMATION_PROPS,
        }).start();

        setTimeout(removeNotification, ANIMATION_DURATION);
    };

    clearTimeout = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    };

    getNavState = routes => {
        if (!routes.routes) {
            return routes;
        }

        return this.getNavState(routes.routes[routes.index]);
    };

    goToRoom = async () => {
        const {
            notification: {payload},
            navigation,
        } = this.props;

        const {rid, type, prid} = payload;

        if (!rid) {
            return;
        }

        const name = type === 'p' ? payload.name : payload.sender.username;

        await navigation.navigate('RoomsListView');

        navigation.navigate('RoomView', {
            rid,
            name,
            t: type,
            prid,
        });

        this.hide();
    };

    render() {
        const {baseUrl, token, userId, notification, window} = this.props;
        const {message, payload} = notification;
        const {type} = payload;
        const username = type === 'd' ? payload.sender.username : payload.name;
        const name = type === 'd' ? payload.sender.name : payload.name;

        let top = 0;
        if (IS_IOS) {
            const portrait = window.height > window.width;
            if (portrait) {
                top = HAS_NOTCH ? 45 : 20;
            } else {
                top = 0;
            }
        }

        const maxWidthMessage = window.width - 110;

        const translateY = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-top - ROW_HEIGHT, top],
        });

        return (
            <Animated.View
                style={[
                    {
                        transform: [{translateY}],
                        height: ROW_HEIGHT,
                        marginLeft: Style.w_10.width / 2,
                    },
                    Style.border_round_2,
                    Style.shadow,
                    Style.flex,
                    Style.w_90,
                    Style.p_h_2,
                    Style.row,
                    Style.column_center,
                    Style.row_between,
                    Style.top_horizontal,
                    Style.z_index_5,
                    Style.bg_color_gray,
                ]}>
                <Touchable
                    style={[Style.flex, Style.row, Style.column_center]}
                    onPress={this.goToRoom}
                    hitSlop={BUTTON_HIT_SLOP}
                    background={Touchable.SelectableBackgroundBorderless()}>
                    <React.Fragment>
                        <Avatar
                            avatar={
                                type === 'd'
                                    ? AppConfig.avatar_host +
                                      '/username/' +
                                      username
                                    : ''
                            }
                            username={username}
                            text={name}
                            size={AVATAR_SIZE}
                            borderRadius={type === 'd' ? AVATAR_SIZE / 2 : 4}
                            type={type}
                            baseUrl={baseUrl}
                            style={[Style.m_r_3, Style.shadow]}
                            userId={userId}
                            token={token}
                        />
                        <View>
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_3,
                                    Style.f_weight_500,
                                    Style.f_fa_pf,
                                ]}>
                                {name}
                            </Text>
                            <Text
                                style={[
                                    Style.f_size_11,
                                    Style.f_color_3,
                                    Style.f_weight_500,
                                    Style.f_fa_pf,
                                    {
                                        maxWidth: maxWidthMessage,
                                    },
                                ]}
                                numberOfLines={1}>
                                {message}
                            </Text>
                        </View>
                    </React.Fragment>
                </Touchable>
                <TouchableOpacity onPress={this.hide}>
                    <MaterialCommunityIcons
                        name="close-circle"
                        style={[Style.f_color_5, Style.m_l_2]}
                        size={23}
                    />
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userId: state.login.user && state.login.user.id,
        baseUrl:
            state.settings.Site_Url || state.server ? state.server.server : '',
        token: state.login.user && state.login.user.token,
        notification: state.notification,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeNotification: () => dispatch(removeNotificationAction()),
    };
}

export default responsive(
    connect(mapStateToProps, mapDispatchToProps)(NotificationBadge),
);
