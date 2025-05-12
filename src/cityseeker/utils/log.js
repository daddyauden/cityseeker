import {Client} from 'bugsnag-react-native';
import {bugsnag_api_key} from '../config/app';

const bugsnag = new Client(bugsnag_api_key);

export const loggerConfig = bugsnag.config;
export const {leaveBreadcrumb} = bugsnag;

export default e => {
    if (e instanceof Error) {
        console.log(e);
        // bugsnag.notify(e);
    } else {
        // bugsnag.notify(e);
        console.log(e);
    }
};
