import React from 'react';
import {connect} from 'react-redux';

class Default extends React.Component {
    componentDidMount() {
        const {account, navigation} = this.props;

        setTimeout(() => {
            if (account.isLoggedIn || account.hasSkippedSignin) {
                navigation.navigate('RunningStack');
            } else {
                navigation.navigate('LaunchStack');
            }
        }, 50);
    }

    render() {
        return null;
    }
}

const mapStateToProps = state => ({
    account: state.account,
});

export default connect(mapStateToProps)(Default);
