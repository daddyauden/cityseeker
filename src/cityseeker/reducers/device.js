import {DEVICE} from '../actions/actionsTypes';

const initialState = {
    info: {},
    installed: false,
};

export default function device(state = initialState, action) {
    switch (action.type) {
        case action.type === DEVICE.INSTALL:
            return {
                info: {...action.data},
                installed: true,
            };

        case action.type === DEVICE.REMOVE:
            return initialState;

        default:
            return state;
    }
}
