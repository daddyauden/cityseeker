import {RECORD} from '../actions/actionsTypes';

export function init(params) {
    return {
        type: RECORD.INIT,
        params,
    };
}

export function add(params) {
    return {
        type: RECORD.ADD,
        params,
    };
}

export function remove(params) {
    return {
        type: RECORD.REMOVE,
        params,
    };
}
