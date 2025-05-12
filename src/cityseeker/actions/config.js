import {CONFIG} from './actionsTypes';

export function loadConfig(data) {
    return {
        type: CONFIG.SUCCESS,
        data,
    };
}
