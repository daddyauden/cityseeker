import React from 'react';
import {Text, Platform, Dimensions, StatusBar} from 'react-native';
import {phonecall, text, web, email} from 'react-native-communications';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import NumberFormat from 'react-number-format';
import {concat, indexOf} from 'lodash/array';
import Toast from 'react-native-root-toast';
import {merge} from 'lodash/object';
import {Base64} from 'js-base64';
import moment from 'moment';
import AppConfig from '../config/app';
import Style from '../style';

const crc32 = require('crc32');

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const HAS_NOTCH = DeviceInfo.hasNotch();
export const TRANSLUCENT_STATUS = false;
export const HIDE_STATUS = false;
export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;
export const X_HEIGHT = 812;
export const X_ABOVE_HEIGHT = 896;
export const scrollProps = {
    keyboardShouldPersistTaps: 'never',
    keyboardDismissMode: 'interactive',
};

export const Common = {
    replaceArray: function(str, find, replace) {
        var replaceString = str;
        for (var i = 0; i < find.length; i++) {
            replaceString = replaceString.replace(find[i], replace[i]);
        }
        return replaceString;
    },

    isIphoneX: function() {
        return (
            Platform.OS === 'ios' &&
            !Platform.isPad &&
            !Platform.isTVOS &&
            (HEIGHT === X_HEIGHT ||
                WIDTH === X_HEIGHT ||
                HEIGHT === X_ABOVE_HEIGHT ||
                WIDTH === X_ABOVE_HEIGHT)
        );
    },

    ifIphoneX: function(iphoneXStyle, regularStyle) {
        if (this.isIphoneX()) {
            return iphoneXStyle;
        }

        return regularStyle;
    },

    isAndroid: function() {
        return Platform.OS === 'android';
    },

    ifAndroid: function(androidStyle, regularStyle) {
        if (this.isAndroid()) {
            return androidStyle;
        }
        return regularStyle;
    },

    getStatusBarHeight: function(safe) {
        return Platform.select({
            ios: this.ifIphoneX(safe ? 44 : 30, 20),
            android: StatusBar.currentHeight,
            default: 0,
        });
    },

    getBottomSpace: function() {
        return this.isIphoneX() ? 34 : 0;
    },

    getAddress: function(data) {
        let address = '';

        if (_.isString(data)) {
            address = data;
        } else if (_.isPlainObject(data)) {
            let str = '';
            if (_.get(data, 'line2', '')) {
                str += data.line2 + '-';
            }

            if (_.get(data, 'line1', '')) {
                str += data.line1 + ', ';
            }

            if (_.get(data, 'city', '')) {
                str += data.city + ', ';
            }

            if (_.get(data, 'state', '')) {
                str += data.state + ', ';
            }

            if (_.get(data, 'country', '')) {
                str += data.country + ' ';
            }

            if (_.get(data, 'postal_code', '')) {
                str += data.postal_code;
            }

            address = str;
        } else if (_.isArray(data)) {
            address = _.join(data, ',');
        }

        return encodeURIComponent(address);
    },

    capitalize: function(s) {
        if (typeof s !== 'string') {
            return '';
        }
        return s.charAt(0).toUpperCase() + s.slice(1);
    },

    baseName: function(path) {
        return path.split('/').reverse()[0];
    },

    encode: function() {
        return this.base64(AppConfig.auth.user + ':' + AppConfig.auth.password);
    },

    base64: function(data) {
        return Base64.encode(data.toString());
    },

    c2c: function(data) {
        return crc32(data.toString(), true);
    },

    merge: function(obj1, obj2) {
        return merge(obj1, obj2);
    },

    concat: function(arr1, arr2) {
        return concat(arr1 ? arr1 : [], arr2 ? arr2 : []);
    },

    inArray: function(element, arr) {
        return indexOf(arr, element) !== -1;
    },

    distance: function(data) {
        let distance = Math.ceil(data);
        if (data / 1000 > 1) {
            return (data / 1000).toFixed(2) + ' km';
        } else {
            return Math.ceil(data) + ' m';
        }
    },

    mileage: function(mileage) {
        return (
            <NumberFormat
                value={mileage}
                displayType={'text'}
                thousandSeparator={true}
                renderText={value => <Text>{value}</Text>}
            />
        );
    },

    phoneNumberFormat: function(data) {
        return (
            <NumberFormat
                value={data}
                format="+1 (###) ###-####"
                mask="_"
                displayType={'text'}
                renderText={value => <Text>{value}</Text>}
            />
        );
    },

    price: function(price, prefix) {
        if (prefix === null) {
            prefix = '$';
        }
        return (
            <NumberFormat
                value={price}
                displayType={'text'}
                thousandSeparator={true}
                prefix={prefix}
                renderText={value => <Text>{value}</Text>}
            />
        );
    },

    tel: function(phoneNumber, prompt) {
        return phonecall(phoneNumber, prompt ? true : false);
    },

    sms: function(phoneNumber, body) {
        return text(phoneNumber, body);
    },

    browser: function(url) {
        return web(url);
    },

    email: function(address) {
        return email([address], null, null, null, '');
    },

    decration_title: function(title) {
        if (!title) {
            return;
        } else {
            if (title.indexOf('_') > 0) {
                return title.replace(/_/g, ' & ');
            }
            return title;
        }
    },

    admin_host: function(country) {
        return AppConfig.admin_host.replace(
            /{country}/gi,
            country.toLowerCase(),
        );
    },

    load_media: function(uri) {
        return AppConfig.media_host + uri;
    },

    load_image: function(image) {
        let url = '';

        if (typeof image === 'object') {
            if (image['path'] !== undefined && image['path']) {
                url += image['path'];
            }

            if (image['name'] !== undefined && image['name']) {
                url += '/' + image['name'];
            }

            url = AppConfig.media_host + url;
        } else if (
            typeof image === 'string' &&
            image.substr(0, 4).toLowerCase() === 'http'
        ) {
            url = image;
        } else if (
            typeof image === 'string' &&
            image.substr(0, 5).toLowerCase() === 'data:'
        ) {
            url = image;
        } else if (typeof image === 'string' && image.indexOf('/') === 0) {
            url = AppConfig.media_host + image.substr(1, image.length - 1);
        } else if (typeof image === 'string') {
            url = AppConfig.media_host + image;
        }

        return url;
    },

    avator: function(user) {
        let avator = null;

        if (typeof user === 'object') {
            if (user && user.avator !== undefined && user.avator) {
                avator = {
                    uri: this.load_image(user.avator),
                };
            } else {
                avator = {
                    uri: 'https://media.daddyauden.com/original/avatar.png',
                };
            }
        } else if (typeof user === 'string') {
            const url = this.load_image(user);

            avator = {
                uri: url,
            };
        }

        return avator;
    },

    getCurrentPosition: async () => {
        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
            distanceFilter: 0,
            forceRequestLocation: true,
        };

        return new Promise((resolve, reject) =>
            Geolocation.getCurrentPosition(resolve, reject, options),
        ).catch(reject => {
            return {
                error: 1,
                message: reject.message,
            };
        });
    },

    getLocationUpdates: async () => {
        const options = {
            enableHighAccuracy: true,
            distanceFilter: 1,
            interval: 2000,
            fastestInterval: 1000,
        };

        return new Promise((resolve, reject) =>
            Geolocation.getCurrentPosition(resolve, reject, options),
        ).catch(reject => {
            return {
                error: 1,
                message: reject.message,
            };
        });
    },

    customNumber: function(number) {
        const num = 0 + number;

        if (num > 1000000000000) {
            return (num / 1000000000000).toFixed(1) + ' T';
        } else if (num > 100000000) {
            return (num / 100000000).toFixed(1) + ' B';
        } else if (num > 1000000) {
            return (num / 1000000).toFixed(1) + ' M';
        } else if (num > 1000) {
            return (num / 1000).toFixed(1) + ' K';
        } else {
            return num;
        }
    },

    datetime: function(timestamp, format) {
        timestamp = timestamp ? timestamp : {};

        if (!format) {
            format = 'YYYY-MM-DD HH:mm';
        }

        return moment(timestamp).format(format);
    },

    year: function(timestamp) {
        timestamp = timestamp ? timestamp : {};

        return moment(timestamp).format('YYYY');
    },

    getDate: function(name, timestamp) {
        name = name.toLowerCase();

        timestamp = timestamp ? timestamp : {};

        if (name === 'year') {
            return moment(timestamp).year();
        } else if (name === 'month') {
            return moment(timestamp).month();
        } else if (name === 'dayofmonth') {
            return moment(timestamp).date();
        } else if (name === 'dayofweek') {
            return moment(timestamp).isoWeekday();
        } else if (name === 'hour') {
            return moment(timestamp).hour();
        } else if (name === 'minute') {
            return moment(timestamp).minute();
        } else {
            return moment(timestamp).format('YYYY-MM-DD HH:mm');
        }
    },

    dayOfWeek: function(timestamp, locale, short = true) {
        return new Date(timestamp)
            .toLocaleDateString(locale, {
                weekday: short ? 'short' : 'long',
            })
            .replace('.', '');
    },

    dayAndMonth: function(timestamp, locale) {
        return new Date(timestamp)
            .toLocaleDateString(locale, {
                month: 'short',
                day: '2-digit',
            })
            .replace('.', '');
    },

    dayAndMonthAndYear: function(timestamp, locale) {
        return new Date(timestamp)
            .toLocaleDateString(locale, {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            })
            .replace('.', '');
    },

    minuteAndHour: function(timestamp, locale) {
        return moment(timestamp).format('HH:mm');
    },

    showToast: function(data) {
        const {message, config, style, op} = data;

        const containerStyle = style || {};

        return Toast.show(message, {
            containerStyle: {
                ...Style.bg_color_3,
                ...Style.p_3,
                ...Style.column,
                ...Style.row_center,
                ...Style.column_center,
                ...containerStyle,
            },
            opacity: 1,
            textColor: Style.f_color_15.color,
            shadow: true,
            shadowColor: Style.bg_color_6.backgroundColor,
            duration: config && config.duration ? config.duration : 1000,
            position:
                config && config.position
                    ? config.position
                    : Toast.positions.CENTER,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onShow: op && op.onShow ? op.onShow : () => {},
            onShown: op && op.onShown ? op.onShown : () => {},
            onHide: op && op.onHide ? op.onHide : () => {},
            onHidden: op && op.onHidden ? op.onHidden : () => {},
        });
    },

    hideToast: function(toast) {
        Toast.hide(toast);
    },

    isValidEmail: function(email) {
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return reg.test(email);
    },

    canUploadFile: function(file, serverInfo) {
        const {
            FileUpload_MediaTypeWhiteList,
            FileUpload_MaxFileSize,
        } = serverInfo;
        if (!(file && file.path)) {
            return {success: true};
        }
        if (FileUpload_MaxFileSize > -1 && file.size > FileUpload_MaxFileSize) {
            return {success: false, error: 'error-file-too-large'};
        }
        // if white list is empty, all media types are enabled
        if (!FileUpload_MediaTypeWhiteList) {
            return {success: true};
        }
        const allowedMime = FileUpload_MediaTypeWhiteList.split(',');
        if (allowedMime.includes(file.mime)) {
            return {success: true};
        }
        const wildCardGlob = '/*';
        const wildCards = allowedMime.filter(
            item => item.indexOf(wildCardGlob) > 0,
        );
        if (
            file.mime &&
            wildCards.includes(file.mime.replace(/(\/.*)$/, wildCardGlob))
        ) {
            return {success: true};
        }
        return {success: false, error: 'error-invalid-file-type'};
    },
};
