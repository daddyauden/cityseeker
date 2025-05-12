import {Client} from 'bugsnag-react-native';
import Config from '../config/app';

const bugsnag = new Client(Config.bugsnag_api_key);

export const loggerConfig = bugsnag.config;
export const {leaveBreadcrumb} = bugsnag;

export default e => {
    if (e instanceof Error && !__DEV__) {
        bugsnag.notify(e);
    } else {
        console.log(e);
    }
};
