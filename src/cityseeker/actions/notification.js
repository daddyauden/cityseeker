import {NOTIFICATION} from './actionsTypes';

export function sendNotification(params) {
    return {
        type: NOTIFICATION.SEND,
        params,
    };
}

export function notificationReceived(params) {
    return {
        type: NOTIFICATION.RECEIVED,
        payload: {
            message: params.text,
            payload: params.payload,
        },
    };
}

export function removeNotification() {
    return {
        type: NOTIFICATION.REMOVE,
    };
}
