import {
    take,
    put,
    call,
    takeLatest,
    fork,
    cancel,
    select,
} from 'redux-saga/effects';
import axios from 'axios';

import {SYSTEM} from '../actions/actionsTypes';
import {
    loadAllSuccess,
    changeLocation,
    changeParamsSuccess,
    changeAreaSuccess,
} from '../actions/system';
import RouteConfig from '../config/route';
import Log from '../utils/log';
import I18n from '../locale';

import RocketChat from '../../lingchat/lib/rocketchat';

const handleHttpRequest = (host, data) => axios.post(host, data);

const loadAll = function*({params}) {
    try {
        const result = yield call(
            handleHttpRequest,
            RouteConfig.init.all,
            params,
        );

        return yield put(loadAllSuccess(result.data));
    } catch (e) {
        Log(e);
    }
};

const changeParams = function*({params}) {
    try {
        const result = yield call(
            handleHttpRequest,
            RouteConfig.init.params,
            params,
        );

        return yield put(changeParamsSuccess(result.data));
    } catch (e) {
        Log(e);
    }
};

const changeLocale = function*({data}) {
    const {user} = yield select(state => state.login);
    I18n.locale = data.locale || 'en';

    try {
        if (user !== undefined && user.id && user.language !== data.locale) {
            yield RocketChat.saveUserPreferences({
                language: data.locale || 'en',
            });
        }
    } catch (e) {
        Log(e);
    }
};

const changeArea = function*({params}) {
    try {
        const result = yield call(
            handleHttpRequest,
            RouteConfig.init.area,
            params,
        );

        return yield put(changeAreaSuccess(result.data));
    } catch (e) {
        Log(e);
    }
};

const successAfter = function*({data}) {
    const {lat, lng} = yield select(state => state.system);

    const {params} = data;

    if (
        lat === null &&
        lng === null &&
        params.lat !== undefined &&
        params.lng !== undefined
    ) {
        yield put(
            changeLocation({
                lat: Number(params.lat),
                lng: Number(params.lng),
            }),
        );
    }
};

const root = function* root() {
    yield takeLatest(SYSTEM.LOAD_ALL_REQUEST, loadAll);
    yield takeLatest(SYSTEM.LOAD_ALL_SUCCESS, successAfter);
    yield takeLatest(SYSTEM.CHANGE_PARAMS_REQUEST, changeParams);
    yield takeLatest(SYSTEM.CHANGE_LOCALE, changeLocale);
    yield takeLatest(SYSTEM.CHANGE_AREA_REQUEST, changeArea);

    while (true) {
        const {params} = yield take(SYSTEM.CHANGE_AREA_REQUEST);

        const {area} = yield select(state => state.system);

        if (area.country !== params.country) {
            const changeParamsSuccessTask = yield fork(changeParams, {
                params: {
                    country: params.country,
                },
            });
            yield take(SYSTEM.CHANGE_PARAMS_SUCCESS);
            yield cancel(changeParamsSuccessTask);
        }
    }
};

export default root;
