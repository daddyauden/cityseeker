import {METEOR} from '../actions/actionsTypes';

const initialState = {
    connecting: false,
    connected: false,
};

export default function connect(state = initialState, action) {
    switch (action.type) {
        case METEOR.REQUEST:
            return {
                ...state,
                connecting: true,
                connected: false,
            };
        case METEOR.SUCCESS:
            return {
                ...state,
                connecting: false,
                connected: true,
            };
        case METEOR.DISCONNECT:
            return initialState;
        default:
            return state;
    }
}
