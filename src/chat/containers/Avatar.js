// import React from 'react';
// import PropTypes from 'prop-types';
// import {View} from 'react-native';
// import FastImage from 'react-native-fast-image';
//
// const formatUrl = (url, baseUrl, uriSize, avatarAuthURLFragment) =>
//     `${baseUrl}${url}?format=png&width=${uriSize}&height=${uriSize}${avatarAuthURLFragment}`;
//
// const Avatar = React.memo(
//     ({
//         text,
//         size,
//         baseUrl,
//         borderRadius,
//         style,
//         avatar,
//         type,
//         children,
//         userId,
//         token,
//     }) => {
//         const avatarStyle = {
//             width: size,
//             height: size,
//             borderRadius,
//         };
//
//         if (!text && !avatar) {
//             return null;
//         }
//
//         const room = type === 'd' ? text : `@${text}`;
//
//         // Avoid requesting several sizes by having only two sizes on cache
//         const uriSize = size === 100 ? 100 : 50;
//
//         let avatarAuthURLFragment = '';
//         if (userId && token) {
//             avatarAuthURLFragment = `&rc_token=${token}&rc_uid=${userId}`;
//         }
//
//         let uri;
//         if (avatar) {
//             uri = avatar.includes('http')
//                 ? avatar
//                 : formatUrl(avatar, baseUrl, uriSize, avatarAuthURLFragment);
//         } else {
//             uri = formatUrl(
//                 `/avatar/${room}`,
//                 baseUrl,
//                 uriSize,
//                 avatarAuthURLFragment,
//             );
//         }
//
//         const image = (
//             <FastImage
//                 style={avatarStyle}
//                 source={{
//                     uri,
//                     priority: FastImage.priority.high,
//                 }}
//             />
//         );
//
//         return (
//             <View style={[avatarStyle, style]}>
//                 {image}
//                 {children}
//             </View>
//         );
//     },
// );
//
// Avatar.propTypes = {
//     baseUrl: PropTypes.string.isRequired,
//     style: PropTypes.any,
//     text: PropTypes.string,
//     avatar: PropTypes.string,
//     size: PropTypes.number,
//     borderRadius: PropTypes.number,
//     type: PropTypes.string,
//     children: PropTypes.object,
//     userId: PropTypes.string,
//     token: PropTypes.string,
// };
//
// Avatar.defaultProps = {
//     text: '',
//     size: 25,
//     type: 'd',
//     borderRadius: 4,
// };
//
// export default Avatar;

import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';

const formatUrl = (url, baseUrl, uriSize, avatarAuthURLFragment) =>
    `${baseUrl}${url}?format=png&width=${uriSize}&height=${uriSize}${avatarAuthURLFragment}`;

import Style from '../style';

const Avatar = React.memo(
    ({
        text,
        size,
        baseUrl,
        borderRadius,
        style,
        avatar,
        type,
        children,
        userId,
        token,
    }) => {
        if (!text && !avatar) {
            return null;
        }

        let avatarStyle = {
            width: size,
            height: size,
            borderRadius: borderRadius || size / 2,
        };

        if (avatar instanceof Array && avatar.length > 0) {
            avatarStyle = {
                width: size / 2 - 1,
                height: size / 2 - 1,
            };
        }

        const room = type === 'd' ? text : `@${text}`;

        const uriSize = size === 100 ? 100 : 50;

        let avatarAuthURLFragment = '';
        if (userId && token) {
            avatarAuthURLFragment = `&rc_token=${token}&rc_uid=${userId}`;
        }

        let uri;
        let image;

        if (avatar instanceof Array && avatar.length > 0) {
            image = avatar.map((uri, index) => {
                return (
                    <FastImage
                        key={index}
                        style={avatarStyle}
                        source={{
                            uri,
                            priority: FastImage.priority.high,
                        }}
                    />
                );
            });
        } else {
            if (avatar) {
                uri = avatar.includes('http')
                    ? avatar
                    : formatUrl(
                          avatar,
                          baseUrl,
                          uriSize,
                          avatarAuthURLFragment,
                      );
            } else {
                uri = formatUrl(
                    `/avatar/${room}`,
                    baseUrl,
                    uriSize,
                    avatarAuthURLFragment,
                );
            }

            image = (
                <FastImage
                    style={avatarStyle}
                    source={{
                        uri,
                        priority: FastImage.priority.high,
                    }}
                />
            );
        }

        return (
            <View
                style={[
                    {
                        width: size,
                        height: size,
                    },
                    Style.row,
                    Style.shadow,
                    Style.wrap,
                    style,
                ]}>
                {image}
                {children}
            </View>
        );
    },
);

Avatar.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    style: PropTypes.any,
    text: PropTypes.string,
    size: PropTypes.number,
    borderRadius: PropTypes.number,
    type: PropTypes.string,
    children: PropTypes.object,
    userId: PropTypes.string,
    token: PropTypes.string,
};

Avatar.defaultProps = {
    text: '',
    size: 60,
    type: 'd',
    borderRadius: 4,
};

export default Avatar;
