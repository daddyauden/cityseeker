import {ACCOUNT} from './actionsTypes';

export function skipSignin() {
    return {
        type: ACCOUNT.SKIP_SIGNIN,
    };
}

export function signinSuccess(data, navigation) {
    return {
        type: ACCOUNT.SIGNIN_SUCCESS,
        data,
        navigation,
    };
}

export function signinFailure(error = {}, navigation) {
    return {
        type: ACCOUNT.SIGNIN_FAILURE,
        error,
        navigation,
    };
}

export function signin(profile, navigation) {
    return {
        type: ACCOUNT.SIGNIN_REQUEST,
        profile,
        navigation,
    };
}

export function signup(profile, navigation) {
    return {
        type: ACCOUNT.SIGNUP_REQUEST,
        profile,
        navigation,
    };
}

export function signout(source) {
    return {
        type: ACCOUNT.SIGNOUT_REQUEST,
        source,
    };
}

export function signoutSuccess() {
    return {
        type: ACCOUNT.SIGNOUT_SUCCESS,
    };
}

export function update(data, action, navigation) {
    return {
        type: ACCOUNT.UPDATE_REQUEST,
        data,
        action,
        navigation,
    };
}

export function updateSuccess(data) {
    return {
        type: ACCOUNT.UPDATE_SUCCESS,
        data,
    };
}
