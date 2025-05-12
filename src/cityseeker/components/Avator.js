import React from 'react';
import {Image, TouchableWithoutFeedback} from 'react-native';
import Navigation from '../lib/navigation';
import {Common} from '../utils/lib';

class Default extends React.Component {
    _showProfilePage = () => {
        const {user} = this.props;

        Navigation.navigate('UserInfo', {user: user}, user.id);
    };

    render() {
        const {user, size, isLink} = this.props;

        let avator = Common.avator(user);

        return (
            <TouchableWithoutFeedback
                onPress={
                    isLink !== undefined && isLink === false
                        ? () => {}
                        : this._showProfilePage
                }>
                <Image
                    source={avator}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: 1,
                        borderColor: '#EEE',
                    }}
                />
            </TouchableWithoutFeedback>
        );
    }
}

Default.defaultProps = {
    size: 50,
};

export default Default;
