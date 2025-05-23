import React from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';

import Avatar from '../../containers/Avatar';
import Touch from '../../utils/touch';
import RoomTypeIcon from '../../containers/RoomTypeIcon';
import styles, {ROW_HEIGHT} from './styles';

export {ROW_HEIGHT};

const DirectoryItemLabel = React.memo(({text}) => {
    if (!text) {
        return null;
    }
    return <Text style={styles.directoryItemLabel}>{text}</Text>;
});

const DirectoryItem = ({
    title,
    description,
    avatar,
    onPress,
    testID,
    style,
    baseUrl,
    user,
    rightLabel,
    type,
}) => (
    <Touch onPress={onPress} style={styles.directoryItemButton} testID={testID}>
        <View style={[styles.directoryItemContainer, style]}>
            <Avatar
                text={avatar}
                size={30}
                type={type}
                style={styles.directoryItemAvatar}
                baseUrl={baseUrl}
                userId={user.id}
                token={user.token}
            />
            <View style={styles.directoryItemTextContainer}>
                <View style={styles.directoryItemTextTitle}>
                    <RoomTypeIcon type={type} />
                    <Text style={styles.directoryItemName} numberOfLines={1}>
                        {title}
                    </Text>
                </View>
                {description ? (
                    <Text
                        style={styles.directoryItemUsername}
                        numberOfLines={1}>
                        {description}
                    </Text>
                ) : null}
            </View>
            <DirectoryItemLabel text={rightLabel} />
        </View>
    </Touch>
);

DirectoryItem.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    avatar: PropTypes.string,
    type: PropTypes.string,
    user: PropTypes.shape({
        id: PropTypes.string,
        token: PropTypes.string,
    }),
    baseUrl: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    testID: PropTypes.string.isRequired,
    style: PropTypes.any,
    rightLabel: PropTypes.string,
};

DirectoryItemLabel.propTypes = {
    text: PropTypes.string,
};

export default DirectoryItem;
