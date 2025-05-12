import React from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';

import Avatar from '../../containers/Avatar';
import I18n from '../../i18n';
import styles, {ROW_HEIGHT} from './styles';
import UnreadBadge from './UnreadBadge';
import TypeIcon from './TypeIcon';
import LastMessage from './LastMessage';
import {capitalize, formatDate} from '../../utils/room';
import Touchable from './Touchable';

export {ROW_HEIGHT};

const attrs = [
    'name',
    'unread',
    'userMentions',
    'showLastMessage',
    'alert',
    'type',
    'width',
    'isRead',
    'favorite',
    'status',
];

import AppConfig from '../../../common/config/app';
import RocketChat from '../../lib/rocketchat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Style from '../../style';

class RoomItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avatars: [],
        };
    }

    async componentDidMount() {
        const {rid, type} = this.props;

        let users = {};
        let avatars = [];

        if (type === 'p' || type === 'c') {
            const {records} = await RocketChat.getRoomMembers(rid, true, 0, 4);

            if (records !== undefined && records.length > 0) {
                records.map(({username}) => {
                    username !== undefined &&
                        username &&
                        avatars.push(
                            AppConfig.avatar_host + '/username/' + username,
                        );
                });
            }
        }

        this.setState({avatars});
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {_updatedAt: _updatedAtOld} = this.props;
        const {_updatedAt: _updatedAtNew} = nextProps;
        if (
            _updatedAtOld &&
            _updatedAtNew &&
            _updatedAtOld.toISOString() !== _updatedAtNew.toISOString()
        ) {
            return false;
        }

        const {avatars} = this.state;

        if (avatars.length !== nextState.avatars.length) {
            return true;
        }

        return attrs.every(key => this.props[key] === nextProps[key]);
    }

    render() {
        const {
            room,
            onPress,
            width,
            favorite,
            toggleFav,
            isRead,
            rid,
            toggleRead,
            hideChannel,
            testID,
            unread,
            userMentions,
            name,
            _updatedAt,
            alert,
            type,
            avatarSize,
            baseUrl,
            userId,
            username,
            token,
            id,
            prid,
            showLastMessage,
            hideUnreadStatus,
            lastMessage,
            status,
            avatar,
        } = this.props;

        const date = formatDate(_updatedAt);

        let accessibilityLabel = name;
        if (unread === 1) {
            accessibilityLabel += `, ${unread} ${I18n.t('alert')}`;
        } else if (unread > 1) {
            accessibilityLabel += `, ${unread} ${I18n.t('alerts')}`;
        }

        if (userMentions > 0) {
            accessibilityLabel += `, ${I18n.t('you_were_mentioned')}`;
        }

        if (date) {
            accessibilityLabel += `, ${I18n.t('last_message')} ${date}`;
        }

        return (
            <Touchable
                onPress={onPress}
                width={width}
                favorite={favorite}
                toggleFav={toggleFav}
                isRead={isRead}
                rid={rid}
                toggleRead={toggleRead}
                hideChannel={hideChannel}
                testID={testID}
                type={type}>
                <View
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.p_h_3,
                        {
                            height: ROW_HEIGHT,
                        },
                    ]}
                    accessibilityLabel={accessibilityLabel}>
                    {type === 'd' && (
                        <View
                            style={[
                                Style.bottom_left,
                                Style.bg_color_15,
                                Style.h_center,
                                {
                                    zIndex: 2,
                                    left: avatarSize,
                                    bottom: Style.p_h_2.paddingLeft,
                                    width: 14,
                                    height: 14,
                                    borderRadius: 7,
                                },
                            ]}>
                            <TypeIcon
                                type={type}
                                id={id}
                                prid={prid}
                                status={status}
                            />
                        </View>
                    )}
                    <Avatar
                        avatar={
                            type === 'd'
                                ? AppConfig.avatar_host +
                                  '/username/' +
                                  room.name
                                : type === 'p' || type === 'c'
                                ? this.state.avatars
                                : ''
                        }
                        username={username}
                        text={name}
                        size={avatarSize}
                        borderRadius={type === 'd' ? avatarSize / 2 : 4}
                        type={type}
                        baseUrl={baseUrl}
                        style={[Style.m_r_3, Style.shadow]}
                        userId={userId}
                        token={token}
                    />
                    <View
                        style={[
                            Style.flex,
                            Style.column,
                            Style.row_center,
                            Style.p_v_3,
                        ]}>
                        <View style={[Style.row, Style.column_center]}>
                            {type !== 'd' && (
                                <TypeIcon
                                    type={type}
                                    id={id}
                                    prid={prid}
                                    status={status}
                                />
                            )}
                            <Text
                                style={[
                                    Style.flex,
                                    Style.f_size_15,
                                    Style.f_color_3,
                                    Style.f_regular,
                                    alert &&
                                        !hideUnreadStatus &&
                                        Style.f_bolder,
                                ]}
                                ellipsizeMode="tail"
                                numberOfLines={1}>
                                {name}
                            </Text>
                            {_updatedAt ? (
                                <Text
                                    style={[
                                        Style.m_l_1,
                                        Style.f_size_13,
                                        Style.f_color_6,
                                        Style.f_regular,
                                        alert &&
                                            !hideUnreadStatus && [
                                                Style.f_color_3,
                                                Style.f_bolder,
                                            ],
                                    ]}
                                    ellipsizeMode="tail"
                                    numberOfLines={1}>
                                    {capitalize(date)}
                                </Text>
                            ) : null}
                        </View>
                        <View
                            style={[
                                Style.flex,
                                Style.row,
                                Style.column_center,
                            ]}>
                            <LastMessage
                                lastMessage={lastMessage}
                                type={type}
                                showLastMessage={showLastMessage}
                                username={username}
                                alert={alert && !hideUnreadStatus}
                            />
                            <UnreadBadge
                                unread={unread}
                                userMentions={userMentions}
                                type={type}
                            />
                            {type !== 'd' && alert && !hideUnreadStatus && (
                                <View
                                    style={[
                                        Style.bg_color_cityseeker,
                                        Style.row,
                                        Style.row_center,
                                        Style.column_center,
                                        Style.m_l_2,
                                        {
                                            width: 24,
                                            height: 24,
                                            borderRadius: 12,
                                        },
                                    ]}>
                                    <MaterialCommunityIcons
                                        name={'dots-horizontal'}
                                        style={[
                                            Style.f_color_15,
                                            Style.f_size_15,
                                        ]}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </Touchable>
        );
    }
}

RoomItem.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    baseUrl: PropTypes.string.isRequired,
    showLastMessage: PropTypes.bool,
    _updatedAt: PropTypes.string,
    lastMessage: PropTypes.object,
    alert: PropTypes.bool,
    unread: PropTypes.number,
    userMentions: PropTypes.number,
    id: PropTypes.string,
    prid: PropTypes.string,
    onPress: PropTypes.func,
    userId: PropTypes.string,
    username: PropTypes.string,
    token: PropTypes.string,
    avatarSize: PropTypes.number,
    testID: PropTypes.string,
    width: PropTypes.number,
    favorite: PropTypes.bool,
    isRead: PropTypes.bool,
    rid: PropTypes.string,
    status: PropTypes.string,
    toggleFav: PropTypes.func,
    toggleRead: PropTypes.func,
    hideChannel: PropTypes.func,
    avatar: PropTypes.bool,
    hideUnreadStatus: PropTypes.bool,
};

RoomItem.defaultProps = {
    avatarSize: 48,
    status: 'offline',
};

const mapStateToProps = (state, ownProps) => ({
    status:
        state.meteor.connected && ownProps.type === 'd'
            ? state.activeUsers[ownProps.id]
            : 'offline',
});

export default connect(mapStateToProps)(RoomItem);
