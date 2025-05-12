import {takeLatest} from 'redux-saga/effects';
import RNUserDefaults from 'rn-user-defaults';

import {DEEP_LINKING} from '../actions/actionsTypes';
import {group_name} from '../config/app';
import {IS_IOS} from '../utils/lib';

const handleOpen = function*() {
    if (IS_IOS) {
        yield RNUserDefaults.setName(group_name);
    }
};

const root = function* root() {
    yield takeLatest(DEEP_LINKING.OPEN, handleOpen);
};

export default root;
