import {AppEventsLogger} from 'react-native-fbsdk';

export default class Analytics {
    static logEvent(name, value, opts) {
        AppEventsLogger.logEvent(name, value, opts);
    }
}
