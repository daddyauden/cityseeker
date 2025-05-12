import {FOREGROUND, BACKGROUND} from 'redux-enhancer-react-native-appstate';
import NotificationsIOS from 'react-native-notifications';

import store from '../../../store';

class PushNotification {
    constructor() {
        this.onRegister = null;
        this.onNotification = null;
        this.deviceToken = null;

        NotificationsIOS.addEventListener(
            'remoteNotificationsRegistered',
            this.onPushRegistered.bind(this),
        );
        // NotificationsIOS.addEventListener(
        //     'remoteNotificationsRegistrationFailed',
        //     this.onPushRegistrationFailed.bind(this),
        // );
        // NotificationsIOS.addEventListener(
        //     'notificationReceivedForeground',
        //     this.onNotificationReceivedForeground.bind(this),
        // );
        NotificationsIOS.addEventListener(
            'notificationOpened',
            this.onNotificationOpened.bind(this),
        );
        NotificationsIOS.requestPermissions();
    }

    componentWillUnmount() {
        NotificationsIOS.removeEventListener(
            'remoteNotificationsRegistered',
            this.onPushRegistered.bind(this),
        );
        // NotificationsIOS.removeEventListener(
        //     'remoteNotificationsRegistrationFailed',
        //     this.onPushRegistrationFailed.bind(this),
        // );
        // NotificationsIOS.removeEventListener(
        //     'notificationReceivedForeground',
        //     this.onNotificationReceivedForeground.bind(this),
        // );
        NotificationsIOS.removeEventListener(
            'notificationOpened',
            this.onNotificationOpened.bind(this),
        );
    }

    onPushRegistered(deviceToken) {
        console.info('deviceToken', deviceToken);
        this.deviceToken = deviceToken;
    }

    // onPushRegistrationFailed(error) {
    //     console.error(error);
    // }

    // onNotificationReceivedForeground(notification, completion) {
    //     const {appState} = store.getState().mode;
    //
    //     completion({alert: true, sound: false, badge: false});
    //
    //     if (appState === FOREGROUND) {
    //         this.onNotification(notification);
    //     }
    //
    //     console.log('Notification Received - Foreground', notification);
    // }

    onNotificationOpened(notification, completion) {
        const {appState} = store.getState().mode;

        if (appState === BACKGROUND) {
            this.onNotification(notification);
        }

        completion();
    }

    getDeviceToken() {
        return this.deviceToken;
    }

    setBadgeCount = (count = 0) => {
        NotificationsIOS.setBadgesCount(count);
    };

    async configure(params) {
        this.onRegister = params.onRegister;
        this.onNotification = params.onNotification;

        const initial = await NotificationsIOS.getInitialNotification();
        // NotificationsIOS.consumeBackgroundQueue();
        return Promise.resolve(initial);
    }
}

export default new PushNotification();
