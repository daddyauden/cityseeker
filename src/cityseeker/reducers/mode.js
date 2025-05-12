import {MODE} from '../actions/actionsTypes';

const initialState = {
    appState: '',
};

export default function mode(state = initialState, action) {
    switch (action.type) {
        case MODE.UPDATE_STATE:
            return {
                appState: action.appState,
            };

        default:
            return state;
    }
}
