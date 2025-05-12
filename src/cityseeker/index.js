import React from 'react';
import {AppState} from 'react-native';
import {
    FOREGROUND,
    BACKGROUND,
    INACTIVE,
} from 'redux-enhancer-react-native-appstate';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';

import {onNavigationStateChange} from '../common/utils/navigation';
import {updateState} from './actions/mode';
import Navigation from './lib/navigation';
import {IS_IOS} from './utils/lib';
import Router from './router';
import store from '../store';

if (IS_IOS) {
    const RNScreens = require('react-native-screens');
    RNScreens.useScreens();
}

class Default extends React.Component {
    currentState = '';

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
        this.handleAppStateChange('active');
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange = nextAppState => {
        if (this.currentState !== nextAppState) {
            let type;
            if (nextAppState === 'active') {
                type = FOREGROUND;
            } else if (nextAppState === 'background') {
                type = BACKGROUND;
            } else if (nextAppState === 'inactive') {
                type = INACTIVE;
            }

            store.dispatch(updateState(type));
        }

        this.currentState = nextAppState;
    };

    render() {
        return (
            <Provider store={store}>
                <PersistGate persistor={store.__persistor}>
                    <Router
                        ref={navigatorRef => {
                            Navigation.setTopLevelNavigator(navigatorRef);
                        }}
                        onNavigationStateChange={onNavigationStateChange}
                    />
                </PersistGate>
            </Provider>
        );
    }
}

export default Default;
