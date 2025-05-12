import {AppRegistry} from 'react-native';
import joypixels from 'emoji-toolkit';
import {name as AppName} from './app';

joypixels.ascii = true;

if (__DEV__) {
    require('./ReactotronConfig');
} else {
    console.log = () => {};
    console.time = () => {};
    console.timeLog = () => {};
    console.timeEnd = () => {};
    console.warn = () => {};
    console.count = () => {};
    console.countReset = () => {};
    console.error = () => {};
    console.info = () => {};
}

AppRegistry.registerComponent(AppName, () => require('./cityseeker/index').default);
