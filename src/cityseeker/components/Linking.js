import ReactNative from 'react-native';

import Log from '../utils/log';

const WHITELISTED_URL_SCHEMES = [
    'https:',
    'http:',
    'mailto:',
    'comgooglemaps-x-callback:',
];

const ERR_NOT_LISTED = 'Linking: URL does not match whitelisted schemes';

function allowed(source) {
    return !!WHITELISTED_URL_SCHEMES.find(p => source.indexOf(p) === 0);
}

export default class Linking {
    static async openURL(source) {
        if (!allowed(source)) {
            Log(ERR_NOT_LISTED);
        }

        return ReactNative.Linking.openURL(source);
    }

    static async canOpenURL(source) {
        if (!allowed(source)) {
            return false;
        }

        return ReactNative.Linking.canOpenURL(source);
    }
}
