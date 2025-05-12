import React from 'react';
import {View, InteractionManager} from 'react-native';
import {connect} from 'react-redux';

import {roomsRequest as roomsRequestAction} from '../../lingchat/actions/rooms';
import {appStart as appStartAction} from '../../lingchat/actions';

import database, {safeAddListener} from '../../lingchat/lib/realm';
import debounce from '../../lingchat/utils/debounce';

import Style from '../style';

class Default extends React.Component {
    constructor(props) {
        super(props);

        this.data = [];
        this.state = {
            unread: [],
            loading: true,
        };
    }

    componentDidMount() {
        this.getSubscriptions();
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {appState} = this.props;

        const {loading} = this.state;

        if (nextProps.appState !== appState) {
            return true;
        }

        if (nextState.loading !== loading) {
            return true;
        }

        return false;
    }

    componentDidUpdate(prevProps) {
        const {appState, roomsRequest, isAuthenticated} = this.props;

        if (
            appState === 'foreground' &&
            appState !== prevProps.appState &&
            isAuthenticated
        ) {
            roomsRequest();
        }
    }

    componentWillUnmount() {
        if (this.data && this.data.removeAllListeners) {
            this.data.removeAllListeners();
        }

        if (this.getSubscriptions && this.getSubscriptions.stop) {
            this.getSubscriptions.stop();
        }

        if (this.updateStateInteraction && this.updateStateInteraction.cancel) {
            this.updateStateInteraction.cancel();
        }
    }

    getSubscriptions = debounce(() => {
        if (this.data && this.data.removeAllListeners) {
            this.data.removeAllListeners();
        }

        if (database && database.databases && database.databases.activeDB) {
            this.data = database
                .objects('subscriptions')
                .filtered(
                    'archived != true && open == true && t != $0 && (unread > 0 || alert == true)',
                    'l',
                );

            safeAddListener(this.data, this.updateState);
        }
    }, 300);

    updateState = debounce(() => {
        this.updateStateInteraction = InteractionManager.runAfterInteractions(
            () => {
                this.internalSetState({
                    unread: this.data ? this.data.slice() : [],
                    loading: false,
                });

                this.forceUpdate();
            },
        );
    }, 300);

    internalSetState = (...args) => {
        this.setState(...args);
    };

    render() {
        const {unread, loading} = this.state;

        return !loading && unread.length > 0 ? (
            <View
                style={[
                    Style.bg_color_cityseeker,
                    Style.row,
                    Style.row_center,
                    Style.column_center,
                    {
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                    },
                ]}></View>
        ) : null;
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.login.isAuthenticated,
        appState:
            state.app.ready && state.app.foreground
                ? 'foreground'
                : 'background',
    };
};

const mapDispatchToProps = dispatch => {
    return {
        appStart: () => dispatch(appStartAction()),
        roomsRequest: () => dispatch(roomsRequestAction()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Default);
