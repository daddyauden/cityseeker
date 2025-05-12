import {SYSTEM} from './actionsTypes';

export function updateTab(data) {
    return {
        type: SYSTEM.UPDATE_TAB,
        data,
    };
}

export function loadAllRequest(params) {
    return {
        type: SYSTEM.LOAD_ALL_REQUEST,
        params,
    };
}

export function loadAllSuccess(data) {
    return {
        type: SYSTEM.LOAD_ALL_SUCCESS,
        data,
    };
}

export function changeParamsRequest(params) {
    return {
        type: SYSTEM.CHANGE_PARAMS_REQUEST,
        params,
    };
}

export function changeParamsSuccess(data) {
    return {
        type: SYSTEM.CHANGE_PARAMS_SUCCESS,
        data,
    };
}

export function changeLocale(data) {
    return {
        type: SYSTEM.CHANGE_LOCALE,
        data,
    };
}

export function changeLocation(data) {
    return {
        type: SYSTEM.CHANGE_LOCATION,
        data,
    };
}

export function changeAreaRequest(params) {
    return {
        type: SYSTEM.CHANGE_AREA_REQUEST,
        params,
    };
}

export function changeAreaSuccess(data) {
    return {
        type: SYSTEM.CHANGE_AREA_SUCCESS,
        data,
    };
}

export function resetSystem() {
    return {
        type: SYSTEM.RESET,
    };
}
