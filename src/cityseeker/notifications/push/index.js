import EJSON from 'ejson';

import {deepLinkingOpen} from '../../actions/deepLinking';
import PushNotification from './push';
import store from '../../../store';

export const onNotification = notification => {
    if (notification) {
        const data = notification.getData();
        console.info('notification data', data);
        if (data) {
            try {
                const {rid, name, sender, type, host} = EJSON.parse(data.ejson);

                const types = {
                    c: 'channel',
                    d: 'direct',
                    p: 'group',
                };

                const roomName = type === 'd' ? sender.username : name;

                const params = {
                    host,
                    rid,
                    path: `${types[type]}/${roomName}`,
                };

                store.dispatch(deepLinkingOpen(params));
            } catch (e) {
                console.log(e);
            }
        }
    }
};

export const getDeviceToken = () => PushNotification.getDeviceToken();
export const setBadgeCount = count => PushNotification.setBadgeCount(count);
export const initializePushNotifications = () => {
    setBadgeCount();
    return PushNotification.configure({
        onNotification,
    });
};
