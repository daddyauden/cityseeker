import {Client} from 'bugsnag-react-native';
// import firebase from 'react-native-firebase';
const firebase = {
    obj: {
        setAnalyticsCollectionEnabled: function(enable) {
            this.enable = enable;
        },
        setCurrentScreen: function(currentScreen) {
            this.currentScreen = currentScreen;
        },
        logEvent: function(eventName) {
            this.eventName = eventName;
        },
    },
    analytics: function() {
        return obj;
    },
};

import AppConfig from '../../common/config/app';

const bugsnag = new Client(AppConfig.bugsnag_api_key);

export const {analytics} = firebase;
export const loggerConfig = bugsnag.config;
export const {leaveBreadcrumb} = bugsnag;

export default e => {
    if (e instanceof Error && !__DEV__) {
        bugsnag.notify(e);
    } else {
        console.log(e);
    }
};
