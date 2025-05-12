import {call, takeLatest, takeEvery} from 'redux-saga/effects';
import {Q} from '@nozbe/watermelondb';
import axios from 'axios';

import {RECORD} from '../actions/actionsTypes';
import RouteConfig from '../config/route';
import database from '../lib/database';
import Log from '../utils/log';

const handlePostRequest = (host, data) => axios.post(host, data);

const handleDeleteRequest = (host, data) => axios.delete(host, {data});

const remove = function*({params}) {
    try {
        const {data} = yield call(
            handleDeleteRequest,
            RouteConfig.record.index,
            params,
        );

        const {status} = data;

        if (parseInt(status) > 0) {
            let res = yield database.active.collections
                .get('record')
                .query(
                    Q.where('business', params.business.toLowerCase()),
                    Q.where('type', params.type.toLowerCase()),
                    Q.where('action', params.action.toLowerCase()),
                    Q.where('content', params.content.toLowerCase()),
                ).fetch;

            if (res) {
                yield database.active.action(async () => {
                    await res.markAsDeleted();
                    await res.destroyPermanently();
                });
            }
        }
    } catch (e) {
        Log(e);
    }
};

const add = function*({params}) {
    try {
        const {data} = yield call(
            handlePostRequest,
            RouteConfig.record.index,
            params,
        );

        const {status} = data;

        if (parseInt(status) === 1) {
            let res = yield database.active.collections
                .get('record')
                .query(
                    Q.where('business', params.business.toLowerCase()),
                    Q.where('type', params.type.toLowerCase()),
                    Q.where('action', params.action.toLowerCase()),
                    Q.where('content', params.content.toLowerCase()),
                ).fetch;

            if (!res) {
                yield database.active.action(async () => {
                    await database.active.collections
                        .get('record')
                        .create(record => {
                            record.id = params.id.toLowerCase() || '';
                            record.business =
                                params.business.toLowerCase() || '';
                            record.type = params.type.toLowerCase() || '';
                            record.action = params.action.toLowerCase() || '';
                            record.content = params.content.toLowerCase() || '';
                        });
                });
            }
        }
    } catch (e) {
        Log(e);
    }
};

const init = function*({params}) {
    try {
        const res = yield call(
            handlePostRequest,
            RouteConfig.business.record,
            params,
        );

        const {status, message} = res.data;

        if (parseInt(status) === 1) {
            yield database.active.collections
                .get('record')
                .query()
                .destroyAllPermanently();

            message.map(async record => {
                await database.active.collections
                    .get('record')
                    .create(newRecord => {
                        newRecord.id = record.id || '';
                        newRecord.business =
                            record.business.toLowerCase() || '';
                        newRecord.type = record.type.toLowerCase() || '';
                        newRecord.action = record.action.toLowerCase() || '';
                        newRecord.content = record.content.toLowerCase() || '';
                    });
            });
        }
    } catch (e) {
        Log(e);
    }
};

const root = function*() {
    yield takeLatest(RECORD.INIT, init);
    yield takeEvery(RECORD.ADD, add);
    yield takeEvery(RECORD.REMOVE, remove);
};

export default root;
