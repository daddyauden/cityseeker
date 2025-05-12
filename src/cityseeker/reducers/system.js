import * as types from '../actions/actionsTypes';

const initialState = {
    lastUpdateLocationTime: 0,
    lastTabName: '',
    loaded: false,
    area: {
        city: 'montreal',
        country: 'ca',
        list: {
            ca: {
                montreal: 'montreal',
            },
        },
    },
    lat: null,
    lng: null,
    locale: '',
    params: {
        timezone: 'America/Montreal',
    },
};

export default function system(state = initialState, action) {
    switch (action.type) {
        case types.SYSTEM.UPDATE_TAB:
            return {
                ...state,
                lastTabName: action.data,
            };

        case types.SYSTEM.LOAD_ALL_SUCCESS:
            return {
                ...state,
                ...action.data,
                loaded: true,
            };

        case types.SYSTEM.CHANGE_PARAMS_SUCCESS:
            return {
                ...state,
                ...action.data,
            };

        case types.SYSTEM.CHANGE_LOCALE:
            return {
                ...state,
                ...action.data,
            };

        case types.SYSTEM.CHANGE_LOCATION:
            return {
                ...state,
                ...action.data,
                lastUpdateLocationTime: Date.now(),
            };

        case types.SYSTEM.CHANGE_AREA_SUCCESS:
            return {
                ...state,
                ...action.data,
            };

        case types.SYSTEM.RESET:
            return initialState;

        default:
            return state;
    }
}
