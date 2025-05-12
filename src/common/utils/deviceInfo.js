import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const NOTCH_DEVICES = ['iPhone X', 'iPhone XS', 'iPhone XS Max', 'iPhone XR'];

export const isNotch = NOTCH_DEVICES.includes(DeviceInfo.getModel());
export const IS_NOTCH = isNotch;
export const isIOS = Platform.OS === 'ios';
export const IS_IOS = isIOS;
export const isAndroid = !isIOS;
export const IS_ANDROID = isAndroid;
export const getReadableVersion = DeviceInfo.getReadableVersion();
export const getBundleId = DeviceInfo.getBundleId();
export const getDeviceModel = DeviceInfo.getModel();
