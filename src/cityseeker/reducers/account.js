import * as types from '../actions/actionsTypes';

const initialState = {
    isLoggedIn: false,
    hasSkippedSignin: false,
    lastUpdateUsernameTS: null,
};

export default function account(state = initialState, action) {
    switch (action.type) {
        case types.ACCOUNT.SKIP_SIGNIN:
            return {
                ...state,
                hasSkippedSignin: true,
            };

        case types.ACCOUNT.SIGNIN_SUCCESS:
            return {
                ...state,
                ...action.data,
                isLoggedIn: true,
            };

        case types.ACCOUNT.SIGNOUT_SUCCESS:
            return {
                ...initialState,
                hasSkippedSignin: state.hasSkippedSignin,
                lastUpdateUsernameTS: state.lastUpdateUsernameTS,
            };

        case types.ACCOUNT.UPDATE_SUCCESS:
            return {
                ...state,
                ...action.data,
            };

        default:
            return state;
    }
}
