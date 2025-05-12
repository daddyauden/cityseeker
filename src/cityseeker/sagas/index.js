import {all} from 'redux-saga/effects';
import account from './account';
import deepLinking from './deepLinking';
import mode from './mode';
import notification from './notification';
import record from './record';
import system from './system';

const root = function* root() {
    yield all([
        account(),
        deepLinking(),
        mode(),
        notification(),
        record(),
        system(),
    ]);
};

export default root;
