const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const defaultTypes = [REQUEST, SUCCESS, FAILURE];

function createRequestTypes(base, types = defaultTypes) {
    const res = {};
    types.forEach(type => (res[type] = `${base}_${type}`));
    return res;
}

// Login events
export const LOGIN = createRequestTypes('LOGIN', [
    ...defaultTypes,
    'SET_SERVICES',
    'SET_PREFERENCE',
]);
export const SHARE = createRequestTypes('SHARE', [
    'SELECT_SERVER',
    'SET_USER',
    'SET_SERVER_INFO',
]);
export const USER = createRequestTypes('USER', ['SET']);
export const ROOMS = createRequestTypes('ROOMS', [
    ...defaultTypes,
    'SET_SEARCH',
    'CLOSE_SERVER_DROPDOWN',
    'TOGGLE_SERVER_DROPDOWN',
    'CLOSE_SORT_DROPDOWN',
    'TOGGLE_SORT_DROPDOWN',
    'OPEN_SEARCH_HEADER',
    'CLOSE_SEARCH_HEADER',
]);
export const ROOM = createRequestTypes('ROOM', [
    'LEAVE',
    'ERASE',
    'USER_TYPING',
]);
export const APP = createRequestTypes('APP', ['START', 'READY', 'INIT']);
export const MESSAGES = createRequestTypes('MESSAGES', ['REPLY_BROADCAST']);
export const CREATE_CHANNEL = createRequestTypes('CREATE_CHANNEL', [
    ...defaultTypes,
]);
export const SELECTED_USERS = createRequestTypes('SELECTED_USERS', [
    'ADD_USER',
    'REMOVE_USER',
    'RESET',
    'SET_LOADING',
]);
export const SERVER = createRequestTypes('SERVER', [
    ...defaultTypes,
    'SELECT_SUCCESS',
    'SELECT_REQUEST',
    'SELECT_FAILURE',
    'INIT_ADD',
    'FINISH_ADD',
]);
export const METEOR = createRequestTypes('METEOR_CONNECT', [
    ...defaultTypes,
    'DISCONNECT',
]);
export const LOGOUT = 'LOGOUT'; // logout is always success
export const SNIPPETED_MESSAGES = createRequestTypes('SNIPPETED_MESSAGES', [
    'OPEN',
    'READY',
    'CLOSE',
    'MESSAGES_RECEIVED',
]);
export const DEEP_LINKING = createRequestTypes('DEEP_LINKING', ['OPEN']);
export const SORT_PREFERENCES = createRequestTypes('SORT_PREFERENCES', [
    'SET_ALL',
    'SET',
]);
export const NOTIFICATION = createRequestTypes('NOTIFICATION', [
    'RECEIVED',
    'REMOVE',
]);
export const TOGGLE_MARKDOWN = 'TOGGLE_MARKDOWN';
export const TOGGLE_CRASH_REPORT = 'TOGGLE_CRASH_REPORT';
export const SET_CUSTOM_EMOJIS = 'SET_CUSTOM_EMOJIS';
export const SET_ACTIVE_USERS = 'SET_ACTIVE_USERS';
export const USERS_TYPING = createRequestTypes('USERS_TYPING', [
    'ADD',
    'REMOVE',
    'CLEAR',
]);
