const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const defaultTypes = [REQUEST, SUCCESS, FAILURE];
function createRequestTypes(base, types = defaultTypes) {
    const res = {};
    types.forEach(type => (res[type] = `${base}_${type}`));
    return res;
}

export const ACCOUNT = createRequestTypes('ACCOUNT', [
    'SKIP_SIGNIN',
    'SIGNIN_SUCCESS',
    'SIGNIN_FAILURE',
    'SIGNOUT_REQUEST',
    'SIGNOUT_SUCCESS',
    'SIGNIN_REQUEST',
    'SIGNUP_REQUEST',
    'UPDATE_REQUEST',
    'UPDATE_SUCCESS',
]);

export const CONFIG = createRequestTypes('CONFIG');

export const DEVICE = createRequestTypes('DEVICE', ['INSTALL', 'REMOVE']);

export const MODE = createRequestTypes('MODE', ['RUNNING', 'UPDATE_STATE']);

export const NOTIFICATION = createRequestTypes('NOTIFICATION', [
    'SEND',
    'RECEIVED',
    'REMOVE',
]);

export const RECORD = createRequestTypes('RECORD', ['INIT', 'ADD', 'REMOVE']);

export const SYSTEM = createRequestTypes('SYSTEM', [
    'UPDATE_TAB',
    'LOAD_ALL_REQUEST',
    'LOAD_ALL_SUCCESS',
    'CHANGE_PARAMS_REQUEST',
    'CHANGE_PARAMS_SUCCESS',
    'CHANGE_LOCALE',
    'CHANGE_LOCATION',
    'CHANGE_AREA_REQUEST',
    'CHANGE_AREA_SUCCESS',
    'RESET',
]);

export const DEEP_LINKING = createRequestTypes('DEEP_LINKING', ['OPEN']);
