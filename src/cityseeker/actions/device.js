import {DEVICE} from './actionsTypes';

export function deviceInstall(data) {
    return {
        type: DEVICE.INSTALL,
        data,
    };
}

export function deviceRemove() {
    return {
        type: DEVICE.REMOVE,
    };
}
