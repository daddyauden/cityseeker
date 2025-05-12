import createSagaMiddleware from 'redux-saga';
import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, persistCombineReducers} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import applyAppStateListener from 'redux-enhancer-react-native-appstate';

import cityseeker from './cityseeker/reducers';
import LingChat from './lingchat/reducers';

import cityseekerSagas from './cityseeker/sagas';
import lingchatSagas from './lingchat/sagas';

let sagaMiddleware;
let enhancers;

if (__DEV__) {
    const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
    const Reactotron = require('reactotron-react-native').default;
    sagaMiddleware = createSagaMiddleware({
        sagaMonitor: Reactotron.createSagaMonitor(),
    });

    enhancers = compose(
        applyAppStateListener(),
        applyMiddleware(reduxImmutableStateInvariant),
        applyMiddleware(sagaMiddleware),
        Reactotron.createEnhancer(),
    );
} else {
    sagaMiddleware = createSagaMiddleware();

    enhancers = compose(
        applyAppStateListener(),
        applyMiddleware(sagaMiddleware),
    );
}

const reducers = persistCombineReducers(
    {
        key: 'app',
        storage: AsyncStorage,
    },
    {
        ...cityseeker,
        ...LingChat,
    },
);

const store = createStore(reducers, enhancers);

store.__persistor = persistStore(store);

sagaMiddleware.run(cityseekerSagas);
sagaMiddleware.run(lingchatSagas);

export default store;
