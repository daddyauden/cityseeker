import {MODE} from '../actions/actionsTypes';

export function updateState(appState) {
    return {
        type: MODE.UPDATE_STATE,
        appState,
    };
}
