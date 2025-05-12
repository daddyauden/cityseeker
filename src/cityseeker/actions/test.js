import {Alert, ActionSheetIOS, Platform} from 'react-native';
import Parse from 'parse/react-native';
import {version} from '../config/app';

export function testPlainPush() {
    return () => Parse.Cloud.run('test_push');
}

export function testLinkPush() {
    return async () => Parse.Cloud.run('test_push', {url: 'link'});
}

function testSessionPush() {
    return () => Parse.Cloud.run('test_push', {url: 'session'});
}

function testImagePush() {
    return () => Parse.Cloud.run('test_push', {url: 'image'});
}

function testVideoPush() {
    return () => Parse.Cloud.run('test_push', {url: 'video'});
}

function testSurveyPush() {
    return () => Parse.Cloud.run('test_survey');
}

function testResetNuxes() {
    return {
        type: 'RESET_NUXES',
    };
}

function getAppInfo() {
    return (dispatch, getState) => {
        const subject = `App v${version} state`;
        const message = JSON.stringify(getState(), undefined, 2);
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showShareActionSheetWithOptions(
                {
                    subject: subject,
                    message: message,
                },
                () => {},
                () => {},
            );
        } else {
            Alert.alert(subject);
        }
    };
}

function testSetCurrentDate(value) {
    return {
        type: 'SET_TIMED_TESTING',
        value,
    };
}

const TEST_MENU = {
    'Request a push notification': testPlainPush,
    'Push with link': testLinkPush,
    'Push with session': testSessionPush,
    'Push with image': testImagePush,
    'Push with video': testVideoPush,
    'Request a survey': testSurveyPush,
    'Reset NUXes': testResetNuxes,
    'Get app info': getAppInfo,
    'Set current date: Day 1': _ => testSetCurrentDate(1),
    'Set current date: Day 2': _ => testSetCurrentDate(2),
    'Reset current date': _ => testSetCurrentDate(null),
};

// module.exports = {TEST_MENU, testCollection};
