import {call, takeLatest} from 'redux-saga/effects';

import {NOTIFICATION} from '../actions/actionsTypes';

const handlePostRequest = params => {};

const send = function*({params}) {
    yield call(handlePostRequest, params);
};

const root = function*() {
    yield takeLatest(NOTIFICATION.SEND, send);
};

export default root;
