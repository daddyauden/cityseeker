import {Linking, NativeModules, Platform} from 'react-native';
import {FOREGROUND, BACKGROUND} from 'redux-enhancer-react-native-appstate';
import AsyncStorage from '@react-native-community/async-storage';
import {put, takeLatest, select, fork} from 'redux-saga/effects';
import Geolocation from 'react-native-geolocation-service';
import NotificationsIOS from 'react-native-notifications';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import Parse from 'parse/react-native';

import {changeLocation, changeLocale, loadAllRequest} from '../actions/system';
import {updateInstallation} from '../actions/installation';
import {deepLinkingOpen} from '../actions/deepLinking';
import {deviceInstall} from '../actions/device';
import {loadConfig} from '../actions/config';
import {MODE} from '../actions/actionsTypes';

import {parseDeepLinking} from '../../common/utils/parseRequest';

import {Google, GoogleUtils} from '../lib/google';
import {Wechat, WechatUtils} from '../lib/wechat';
import Facebook from '../lib/facebook';

import {
    appID,
    masterKey,
    javaScriptKey,
    fb_api_version,
    parse_host,
    version,
    wxappid,
} from '../config/app';
import {
    initializePushNotifications,
    onNotification,
} from '../notifications/push';
import {Common, IS_ANDROID} from '../utils/lib';
import {LANGUAGES} from '../locale';
import store from '../../store';
import Log from '../utils/log';

import {appInit} from '../../lingchat/actions';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(appID, javaScriptKey, masterKey);
Parse.serverURL = parse_host + '/parse';

Facebook.init();
Parse.FacebookUtils.init({
    appId: appID,
    xfbml: true,
    version: fb_api_version,
});

Google.init();
GoogleUtils.init({
    scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ],
    webClientId:
        '109068183615-7ur1v4sd795b4gfc9j7br1lf0q0ll83m.apps.googleusercontent.com',
});

Wechat.init();
WechatUtils.init(wxappid);

const loadParams = function*() {
    const {loaded, area} = yield select(state => state.system);

    if (!loaded) {
        const {country, city} = area;

        yield put(
            loadAllRequest({
                country: country,
                city: city,
            }),
        );
    }
};

const loadParseServer = function*() {
    const {attributes} = yield Parse.Config.get();

    yield put(loadConfig(attributes));
};

const installDevice = function*() {
    const {installed} = yield select(state => state.device);

    if (!installed) {
        let AndroidId = IS_ANDROID ? yield DeviceInfo.getAndroidId() : '';
        let ApiLevel = IS_ANDROID ? yield DeviceInfo.getApiLevel() : 0;
        let ApplicationName = DeviceInfo.getApplicationName();
        let AvailableLocationProviders = yield DeviceInfo.getAvailableLocationProviders();
        let BaseOs = IS_ANDROID ? yield DeviceInfo.getBaseOs() : '';
        let BuildId = yield DeviceInfo.getBuildId();
        let BatteryLevel = yield DeviceInfo.getBatteryLevel();
        let Bootloader = IS_ANDROID ? yield DeviceInfo.getBootloader() : '';
        let Brand = DeviceInfo.getBrand();
        let BuildNumber = DeviceInfo.getBuildNumber();
        let BundleId = DeviceInfo.getBundleId();
        let isCameraPresent = IS_ANDROID
            ? yield DeviceInfo.isCameraPresent()
            : false;
        let Carrier = yield DeviceInfo.getCarrier();
        let Codename = IS_ANDROID ? yield DeviceInfo.getCodename() : '';
        let Device = IS_ANDROID ? yield DeviceInfo.getDevice() : '';
        let DeviceId = DeviceInfo.getDeviceId();
        let DeviceType = DeviceInfo.getDeviceType();
        let Display = IS_ANDROID ? yield DeviceInfo.getDisplay() : '';
        let DeviceName = yield DeviceInfo.getDeviceName();
        let FirstInstallTime = IS_ANDROID
            ? yield DeviceInfo.getFirstInstallTime()
            : 0;
        let Fingerprint = IS_ANDROID ? yield DeviceInfo.getFingerprint() : '';
        let FontScale = yield DeviceInfo.getFontScale();
        let FreeDiskStorage = yield DeviceInfo.getFreeDiskStorage();
        let Hardware = IS_ANDROID ? yield DeviceInfo.getHardware() : '';
        let Host = IS_ANDROID ? yield DeviceInfo.getHost() : '';
        let IpAddress = yield DeviceInfo.getIpAddress();
        let Incremental = IS_ANDROID ? yield DeviceInfo.getIncremental() : '';
        let InstallReferrer = IS_ANDROID
            ? yield DeviceInfo.getInstallReferrer()
            : '';
        let InstanceId = IS_ANDROID ? yield DeviceInfo.getInstanceId() : '';
        let LastUpdateTime = IS_ANDROID
            ? yield DeviceInfo.getLastUpdateTime()
            : 0;
        let MacAddress = yield DeviceInfo.getMacAddress();
        let Manufacturer = yield DeviceInfo.getManufacturer();
        let MaxMemory = IS_ANDROID ? yield DeviceInfo.getMaxMemory() : 0;
        let Model = DeviceInfo.getModel();
        let PhoneNumber = IS_ANDROID ? yield DeviceInfo.getPhoneNumber() : '';
        let PowerState = yield DeviceInfo.getPowerState();
        let Product = IS_ANDROID ? yield DeviceInfo.getProduct() : '';
        let PreviewSdkInt = IS_ANDROID
            ? yield DeviceInfo.getPreviewSdkInt()
            : '';
        let ReadableVersion = DeviceInfo.getReadableVersion();
        let SerialNumber = IS_ANDROID ? yield DeviceInfo.getSerialNumber() : '';
        let SecurityPatch = IS_ANDROID
            ? yield DeviceInfo.getSecurityPatch()
            : '';
        let SystemAvailableFeatures = IS_ANDROID
            ? yield DeviceInfo.getSystemAvailableFeatures()
            : [];
        let SystemName = DeviceInfo.getSystemName();
        let SystemVersion = DeviceInfo.getSystemVersion();
        let Tags = IS_ANDROID ? yield DeviceInfo.getTags() : '';
        let Type = IS_ANDROID ? yield DeviceInfo.getType() : '';
        let TotalDiskCapacity = yield DeviceInfo.getTotalDiskCapacity();
        let TotalMemory = yield DeviceInfo.getTotalMemory();
        let UniqueId = DeviceInfo.getUniqueId();
        let UsedMemory = yield DeviceInfo.getUsedMemory();
        let UserAgent = yield DeviceInfo.getUserAgent();
        let Version = DeviceInfo.getVersion();
        let hasNotch = DeviceInfo.hasNotch();
        let hasSystemFeature = IS_ANDROID
            ? yield DeviceInfo.hasSystemFeature()
            : false;
        let isAirplaneMode = IS_ANDROID
            ? yield DeviceInfo.isAirplaneMode()
            : false;
        let isBatteryCharging = yield DeviceInfo.isBatteryCharging();
        let isEmulator = yield DeviceInfo.isEmulator();
        let isLandscape = yield DeviceInfo.isLandscape();
        let isLocationEnabled = yield DeviceInfo.isLocationEnabled();
        let isHeadphonesConnected = yield DeviceInfo.isHeadphonesConnected();
        let isPinOrFingerprintSet = yield DeviceInfo.isPinOrFingerprintSet();
        let isTablet = DeviceInfo.isTablet();
        let supported32BitAbis = IS_ANDROID
            ? yield DeviceInfo.supported32BitAbis()
            : [];
        let supported64BitAbis = IS_ANDROID
            ? yield DeviceInfo.supported64BitAbis()
            : [];
        let supportedAbis = yield DeviceInfo.supportedAbis();

        const info = {
            AndroidId,
            ApiLevel,
            ApplicationName,
            AvailableLocationProviders,
            BaseOs,
            BuildId,
            BatteryLevel,
            Bootloader,
            Brand,
            BuildNumber,
            BundleId,
            isCameraPresent,
            Carrier,
            Codename,
            Device,
            DeviceId,
            DeviceType,
            Display,
            DeviceName,
            FirstInstallTime,
            Fingerprint,
            FontScale,
            FreeDiskStorage,
            Hardware,
            Host,
            IpAddress,
            Incremental,
            InstallReferrer,
            InstanceId,
            LastUpdateTime,
            MacAddress,
            Manufacturer,
            MaxMemory,
            Model,
            PhoneNumber,
            PowerState,
            Product,
            PreviewSdkInt,
            ReadableVersion,
            SerialNumber,
            SecurityPatch,
            SystemAvailableFeatures,
            SystemName,
            SystemVersion,
            Tags,
            Type,
            TotalDiskCapacity,
            TotalMemory,
            UniqueId,
            UsedMemory,
            UserAgent,
            Version,
            hasNotch,
            hasSystemFeature,
            isAirplaneMode,
            isBatteryCharging,
            isEmulator,
            isLandscape,
            isLocationEnabled,
            isHeadphonesConnected,
            isPinOrFingerprintSet,
            isTablet,
            supported32BitAbis,
            supported64BitAbis,
            supportedAbis,
        };

        yield updateInstallation(info);

        yield put(deviceInstall(info));
    }
};

const updateLocation = function*() {
    const {lastUpdateLocationTime, lat} = yield select(state => state.system);

    if (lat === null) {
        Geolocation.setRNConfiguration({
            skipPermissionRequests: true,
            authorizationLevel: 'whenInUse',
        });

        Geolocation.requestAuthorization();
    }

    if (Date.now() - lastUpdateLocationTime > 600000) {
        try {
            const {error, coords} = yield Common.getCurrentPosition();

            if (error !== 1) {
                yield put(
                    changeLocation({
                        lat: coords.latitude,
                        lng: coords.longitude,
                    }),
                );
            }
        } catch (e) {
            Log(e);
        }
    }
};

const updateLocale = function*() {
    const {locale} = yield select(state => state.system);

    if (!locale) {
        let deviceLocale =
            Platform.OS === 'ios'
                ? NativeModules.SettingsManager.settings.AppleLocale ||
                  NativeModules.SettingsManager.settings.AppleLanguages[0]
                : NativeModules.I18nManager.localeIdentifier;

        if (deviceLocale.indexOf('zh-Hans') !== -1) {
            deviceLocale = 'zh-CN';
        } else if (
            deviceLocale.indexOf('zh-Hant') !== -1 ||
            deviceLocale.indexOf('yue-Hans') !== -1 ||
            deviceLocale.indexOf('yue-Hant') !== -1
        ) {
            deviceLocale = 'zh-HK';
        } else {
            deviceLocale = deviceLocale.substr(0, 2);
        }

        const newLocale = LANGUAGES.hasOwnProperty(deviceLocale)
            ? deviceLocale
            : 'en';

        yield put(changeLocale({locale: newLocale}));
    }
};

const updateNotification = function*() {
    const {badge, sound, alert} = yield NotificationsIOS.checkPermissions();
};

const updateState = function*({appState}) {
    const [notification, deepLinking] = yield Promise.all([
        initializePushNotifications(),
        Linking.getInitialURL(),
    ]);

    const parsedDeepLinkingURL = parseDeepLinking(deepLinking);
    Log(notification);
    if (notification) {
        onNotification(notification);
    } else if (parsedDeepLinkingURL) {
        store.dispatch(deepLinkingOpen(parsedDeepLinkingURL));
    } else {
        store.dispatch(appInit());

        if (appState === FOREGROUND) {
            yield fork(loadParseServer);
            yield fork(loadParams);
            yield fork(installDevice);
            yield fork(updateLocation);
            yield fork(updateLocale);
            yield fork(updateNotification);
        } else if (appState === BACKGROUND) {
        }
    }

    SplashScreen.hide();
};

const root = function*() {
    yield takeLatest(MODE.UPDATE_STATE, updateState);
};

export default root;
