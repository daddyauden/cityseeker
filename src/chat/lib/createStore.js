// import { createStore, applyMiddleware, compose } from 'redux';
// import createSagaMiddleware from 'redux-saga';
// import applyAppStateListener from 'redux-enhancer-react-native-appstate';
//
// import reducers from '../reducers';
// import sagas from '../sagas';
//
// let sagaMiddleware;
// let enhancers;
//
// if (__DEV__) {
//     const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
//     const Reactotron = require('reactotron-react-native').default;
//     sagaMiddleware = createSagaMiddleware({
//         sagaMonitor: Reactotron.createSagaMonitor()
//     });
//
//     enhancers = compose(
//         applyAppStateListener(),
//         applyMiddleware(reduxImmutableStateInvariant),
//         applyMiddleware(sagaMiddleware),
//         Reactotron.createEnhancer()
//     );
// } else {
//     sagaMiddleware = createSagaMiddleware();
//     enhancers = compose(
//         applyAppStateListener(),
//         applyMiddleware(sagaMiddleware)
//     );
// }
//
// const store = createStore(reducers, enhancers);
// sagaMiddleware.run(sagas);
//
// export default store;

import store from '../../common/lib/createStore';

export default store;
