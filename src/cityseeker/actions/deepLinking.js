import {DEEP_LINKING} from './actionsTypes';

export function deepLinkingOpen(data) {
    return {
        type: DEEP_LINKING.OPEN,
        data,
    };
}
