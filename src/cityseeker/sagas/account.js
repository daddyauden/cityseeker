import React from 'react';
import {Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {put, call, takeLatest, delay, select} from 'redux-saga/effects';
import RNUserDefaults from 'rn-user-defaults';
import Parse from 'parse/react-native';
import SHA256 from 'js-sha256';
import axios from 'axios';

import Navigation from '../lib/navigation';
import I18n from '../locale';
import Style from '../style';

import RouteConfig from '../config/route';
import AppConfig from '../config/app';

import {Wechat, WechatUtils} from '../lib/wechat';
import {Google, GoogleUtils} from '../lib/google';
import Facebook from '../lib/facebook';

import {Common, IS_IOS} from '../utils/lib';
import Log from '../utils/log';

import {getDeviceToken} from '../notifications/push';

import {
    signoutSuccess,
    signinSuccess,
    signinFailure,
    updateSuccess,
} from '../actions/account';
import {updateInstallation} from '../actions/installation';
import {deviceRemove} from '../actions/device';
import {changeLocale} from '../actions/system';
import {ACCOUNT} from '../actions/actionsTypes';
import {info, update} from '../actions/business';
import {init} from '../actions/record';

import RocketChat from '../../lingchat/lib/rocketchat';
import {
    logout as LingChatLogout,
    loginSuccess as LingChatLoginSuccess,
    loginRequest,
    setUser,
} from '../../lingchat/actions/login';

let toast;

const handlePostRequest = (host, data) => {
    return axios.post(host, data).then(res => {
        return res.data;
    });
};

async function ParseFacebookLogin(scope) {
    return new Promise((resolve, reject) => {
        Parse.FacebookUtils.logIn(scope)
            .then(account => {
                resolve(account);
            })
            .catch(error => {
                reject(error);
            });
    });
}

async function ParseGoogleLogin() {
    return new Promise((resolve, reject) => {
        GoogleUtils.logIn()
            .then(account => {
                resolve(account);
            })
            .catch(error => {
                reject(error);
            });
    });
}

async function ParseWechatLogin(scope) {
    return new Promise((resolve, reject) => {
        WechatUtils.logIn(scope)
            .then(account => {
                resolve(account);
            })
            .catch(error => {
                reject(error);
            });
    });
}

async function queryFacebookAPI(path, ...args) {
    return new Promise((resolve, reject) => {
        Facebook.api(path, ...args, response => {
            if (response && !response.error) {
                resolve(response);
            } else {
                reject(response && response.error);
            }
        });
    });
}

const skip_signin = function*() {
    yield Navigation.navigate('RunningStack');
};

const _signupcityseeker = function*(profile) {
    return yield call(handlePostRequest, RouteConfig.business.signup, profile);
};

const signup = function*({profile, navigation}) {
    toast = Common.showToast({
        message: (
            <Text style={[Style.f_color_15, Style.f_size_13, Style.f_bold]}>
                {I18n.t('common.signup') + '...'}
            </Text>
        ),
        style: {
            ...Style.bg_color_green,
        },
        config: {
            duration: 20000,
        },
    });

    try {
        const {status, message} = yield call(_signupcityseeker, profile);

        if (status) {
            try {
                yield call(_signinParseServer, profile);

                const lingchat = yield call(_signinLingChat, profile);

                if (lingchat !== null) {
                    yield put(LingChatLoginSuccess(lingchat));
                    yield delay(100);
                    return yield put(
                        signinSuccess({id: message.id}, navigation),
                    );
                } else {
                    return yield put(signinFailure({}, navigation));
                }
            } catch (e) {
                Log(e);
                return yield put(signinFailure({}, navigation));
            }
        } else {
            return yield put(signinFailure({}, navigation));
        }
    } catch (e) {
        Log(e);

        const {message} = e.error;

        if (message !== undefined && message === 'cancelled') {
            return yield put(
                signinFailure(
                    {
                        message: I18n.t('common.cancelled'),
                    },
                    navigation,
                ),
            );
        } else if (message !== undefined && message === 'denied') {
            return yield put(
                signinFailure(
                    {
                        message: I18n.t('common.denied'),
                    },
                    navigation,
                ),
            );
        } else {
            return yield put(signinFailure({}, navigation));
        }
    }
};

const _signinLingChat = function*({name, username, email, password}) {
    try {
        const user = yield RocketChat.loginWithPassword({
            user: username || email,
            password,
        });

        if (user.hasOwnProperty('id')) {
            return user;
        }
    } catch (e) {
        Log(e);

        const res = yield RocketChat.register({
            name,
            email,
            pass: password,
            username,
        });

        if (res.success !== undefined && res.success) {
            return yield call(_signinLingChat, {
                name,
                username,
                email,
                password,
            });
        } else {
            return null;
        }
    }
};

const _signinParseServer = function*({username, password}) {
    const currentAccount = yield Parse.User.currentAsync();

    if (_.isNil(currentAccount)) {
        const query = new Parse.Query('User');
        query.equalTo('username', username);
        const user = yield query.find();

        const installationId = yield Parse._getInstallationId();

        if (!_.isEmpty(user)) {
            yield Parse.User.logIn(username, password, {
                installationId: installationId,
            });
        } else {
            yield Parse.User.signUp(username, password, {
                installationId: installationId,
            });
        }
    }
};

const _signinFacebook = function*() {
    const {lat, lng, area} = yield select(state => state.system);

    yield ParseFacebookLogin('public_profile,email');

    const res = yield queryFacebookAPI('/me', {
        fields: 'name,first_name,last_name,picture.type(large),email',
    });

    return {
        name: res.name,
        avator: res.picture.data.url,
        first_name: res.first_name,
        last_name: res.last_name,
        email: res.email,
        username: Common.c2c(res.email),
        password: Common.c2c(res.email + res.email),
        source: 'facebook',
        status: 1,
        condition: 0,
        country: area.country.toLowerCase(),
        city: area.city.toLowerCase(),
        lat: lat || null,
        lng: lng || null,
    };
};

const _signinGoogle = function*() {
    const {lat, lng, area} = yield select(state => state.system);

    yield ParseGoogleLogin();

    const res = yield Google.api();

    return {
        name: res.name,
        avator: res.photo,
        first_name: res.givenName,
        last_name: res.familyName,
        email: res.email,
        username: Common.c2c(res.email),
        password: Common.c2c(res.email + res.email),
        source: 'google',
        status: 1,
        condition: 0,
        country: area.country.toLowerCase(),
        city: area.city.toLowerCase(),
        lat: lat || null,
        lng: lng || null,
    };
};

const _signinWechat = function*() {
    const {lat, lng, area} = yield select(state => state.system);

    yield ParseWechatLogin({});

    const res = yield Wechat.api();

    const email = res.unionid + '@daddyauden.com';

    return {
        name: res.nickname,
        avator: res.headimgurl,
        gender: parseInt(res.sex) === 2 ? 0 : 1,
        hometown: res.city,
        email: email,
        username: Common.c2c(email),
        password: Common.c2c(email + email),
        source: 'wechat',
        status: 1,
        condition: 0,
        country: area.country.toLowerCase(),
        city: area.city.toLowerCase(),
        lat: lat || null,
        lng: lng || null,
    };
};

const _signincityseeker = function*(profile) {
    return yield handlePostRequest(RouteConfig.business.signin, profile);
};

const signin = function*({profile, navigation}) {
    let status;
    let message;

    toast = Common.showToast({
        message: (
            <Text style={[Style.f_color_15, Style.f_size_13, Style.f_bold]}>
                {I18n.t('common.signin') + '...'}
            </Text>
        ),
        style: {
            ...Style.bg_color_green,
        },
        config: {
            duration: 20000,
        },
    });

    try {
        const source =
            profile.source !== undefined && profile.source
                ? profile.source.toLowerCase()
                : 'cityseeker';

        if (source === 'facebook') {
            profile = yield call(_signinFacebook);
        } else if (source === 'google') {
            profile = yield call(_signinGoogle);
        } else if (source === 'wechat') {
            profile = yield call(_signinWechat);
        }

        const signin = yield call(_signincityseeker, profile);

        if (source !== 'cityseeker' && !signin.status) {
            const signup = yield call(_signupcityseeker, profile);

            status = signup.status;
            message = signup.message;
        } else {
            status = signin.status;
            message = signin.message;
        }

        if (status) {
            try {
                yield call(_signinParseServer, {
                    username: message.username,
                    password: profile.password,
                });

                const lingchat = yield call(_signinLingChat, {
                    name: message.name,
                    username: message.username,
                    email: message.email,
                    password: profile.password,
                });

                if (lingchat !== null) {
                    yield put(LingChatLoginSuccess(lingchat));
                    yield delay(100);
                    return yield put(signinSuccess(message, navigation));
                } else {
                    return yield put(signinFailure({}, navigation));
                }
            } catch (e) {
                Log(e);
                return yield put(signinFailure({}, navigation));
            }
        } else {
            return yield put(signinFailure({}, navigation));
        }
    } catch (e) {
        Log(e);

        const {message} = e.error;

        if (message !== undefined && message === 'cancelled') {
            return yield put(
                signinFailure(
                    {
                        message: I18n.t('common.cancelled'),
                    },
                    navigation,
                ),
            );
        } else if (message !== undefined && message === 'denied') {
            return yield put(
                signinFailure(
                    {
                        message: I18n.t('common.denied'),
                    },
                    navigation,
                ),
            );
        } else {
            return yield put(signinFailure({}, navigation));
        }
    }
};

const signin_success = function*({data, navigation}) {
    const {login, system} = yield select(state => state);

    Common.hideToast(toast);

    yield RNUserDefaults.setName(AppConfig.group_name);

    yield updateInstallation({
        deviceToken: getDeviceToken(),
    });

    const {status, message} = yield info({
        where: ["id = '" + data.id + "'"],
    });

    if (status) {
        yield put(updateSuccess(message));

        const installationId = yield Parse._getInstallationId();
        const currentAccount = yield Parse.User.currentAsync();

        if (currentAccount !== null && currentAccount !== undefined) {
            for (var key in message) {
                currentAccount.set(key.toUpperCase(), message[key]);
            }
            currentAccount.set('installationId', installationId);

            yield currentAccount.save();
        }
    }

    yield put(
        init({
            select: ['id', 'business', 'type', 'action', 'content'],
            where: ["business = '" + message.id + "'"],
        }),
    );

    if (login.user.language === undefined && login.user.id !== undefined) {
        yield RocketChat.saveUserPreferences({language: system.locale || 'en'});
    }

    if (
        login.user.language !== undefined &&
        login.user.language.toLowerCase() !== system.locale.toLowerCase()
    ) {
        yield put(changeLocale({locale: login.user.language}));
    }

    toast = Common.showToast({
        message: IS_IOS ? (
            <MaterialCommunityIcons
                name="check"
                style={[Style.f_size_30, Style.f_color_15]}
            />
        ) : (
            <Text style={[Style.f_color_15, Style.f_size_13, Style.f_bold]}>
                {I18n.t('common.success')}
            </Text>
        ),
        style: {
            ...Style.bg_color_green,
        },
        op: {
            onHidden: () => {
                navigation.dismiss();
                Navigation.navigate('RunningStack');
            },
        },
    });
};

const signin_fail = function*({error, navigation}) {
    Common.hideToast(toast);

    toast = Common.showToast({
        message:
            error.message !== undefined ? (
                <Text style={[Style.f_color_15, Style.f_size_13, Style.f_bold]}>
                    {error.message}
                </Text>
            ) : IS_IOS ? (
                <MaterialCommunityIcons
                    name="close"
                    style={[Style.f_size_30, Style.f_color_15]}
                />
            ) : (
                <Text style={[Style.f_color_15, Style.f_size_13, Style.f_bold]}>
                    {I18n.t('common.fail')}
                </Text>
            ),
        style: {
            ...Style.bg_color_cityseeker,
        },
        op: {
            onHidden: () => {
                navigation.dismiss();
            },
        },
    });
};

const signout = function*({source}) {
    yield put(deviceRemove());
    yield put(LingChatLogout());

    yield Parse.User.logOut();

    if (source.toLowerCase() === 'facebook') {
        Facebook.logout();
    } else if (source.toLowerCase() === 'google') {
        Google.logout();
    }

    return yield put(signoutSuccess());
};

const signout_success = function*() {
    toast = Common.showToast({
        message: IS_IOS ? (
            <MaterialCommunityIcons
                name="check"
                style={[Style.f_size_30, Style.f_color_15]}
            />
        ) : (
            <Text style={[Style.f_color_15, Style.f_size_13, Style.f_bold]}>
                {I18n.t('common.success')}
            </Text>
        ),
        style: {
            ...Style.bg_color_green,
        },
        op: {
            onHidden: () => {
                Navigation.navigate('RunningStack');
            },
        },
    });

    updateInstallation({
        deviceToken: null,
        channels: null,
    });
};

const updateRequest = function*({data, action, navigation}) {
    let status = 0,
        success = false;
    const currentAccount = yield Parse.User.currentAsync();
    const {user} = yield select(state => state.login);
    const {
        id,
        username,
        currentUsername,
        email,
        currentEmail,
        password,
        currentPassword,
    } = data;

    if (action === 'UPDATE_USERNAME') {
        const res = yield update({id, username});
        status = res.status;
    } else if (action === 'UPDATE_EMAIL') {
        const res = yield update({id, email});
        status = res.status;
    } else if (action === 'UPDATE_PASSWORD') {
        const res = yield update({id, password});
        status = res.status;
    }

    try {
        if (status) {
            if (action === 'UPDATE_USERNAME') {
                const res = yield RocketChat.setUsername(username);

                success = !!res;
            } else if (action === 'UPDATE_EMAIL') {
                const res = yield RocketChat.updateUser(user.id, {email});

                success = res.success;
            } else if (action === 'UPDATE_PASSWORD') {
                const res = yield RocketChat.saveUserProfile(
                    {
                        newPassword: password,
                        currentPassword: SHA256(currentPassword),
                    },
                    {},
                );

                success = res.success;
            }
        } else {
            if (action === 'UPDATE_USERNAME') {
                yield update({id, currentUsername});
            } else if (action === 'UPDATE_EMAIL') {
                yield update({id, currentEmail});
            } else if (action === 'UPDATE_PASSWORD') {
                yield update({id, currentPassword});
            }

            Common.showToast({
                message: (
                    <MaterialCommunityIcons
                        name="close"
                        style={[Style.f_size_30, Style.f_color_15]}
                    />
                ),
                style: {
                    ...Style.bg_color_cityseeker,
                },
                op: {
                    onHidden: () => {
                        navigation.goBack();
                    },
                },
            });
        }

        if (success) {
            try {
                if (action === 'UPDATE_USERNAME') {
                    currentAccount.set('username', username);

                    yield put(loginRequest({resume: user.token}));
                    yield put(updateSuccess({username}));
                } else if (action === 'UPDATE_EMAIL') {
                    currentAccount.set('email', email);

                    yield put(setUser({email}));
                    yield put(updateSuccess({email}));
                } else if (action === 'UPDATE_PASSWORD') {
                    currentAccount.set('password', password);
                }

                yield currentAccount.save();

                Common.showToast({
                    message: (
                        <MaterialCommunityIcons
                            name="check"
                            style={[Style.f_size_30, Style.f_color_15]}
                        />
                    ),
                    style: {
                        ...Style.bg_color_green,
                    },
                    op: {
                        onHidden: () => {
                            navigation.goBack();
                        },
                    },
                });
            } catch (e) {
                Log(e);

                Common.showToast({
                    message: (
                        <MaterialCommunityIcons
                            name="close"
                            style={[Style.f_size_30, Style.f_color_15]}
                        />
                    ),
                    style: {
                        ...Style.bg_color_cityseeker,
                    },
                    op: {
                        onHidden: () => {
                            navigation.goBack();
                        },
                    },
                });
            }
        } else {
            if (action === 'UPDATE_USERNAME') {
                yield update({id, currentUsername});
            } else if (action === 'UPDATE_EMAIL') {
                yield update({id, currentEmail});
            } else if (action === 'UPDATE_PASSWORD') {
                yield update({id, currentPassword});
            }

            Common.showToast({
                message: (
                    <MaterialCommunityIcons
                        name="close"
                        style={[Style.f_size_30, Style.f_color_15]}
                    />
                ),
                style: {
                    ...Style.bg_color_cityseeker,
                },
                op: {
                    onHidden: () => {
                        navigation.goBack();
                    },
                },
            });
        }
    } catch (e) {
        Log(e);

        Common.showToast({
            message: (
                <MaterialCommunityIcons
                    name="close"
                    style={[Style.f_size_30, Style.f_color_15]}
                />
            ),
            style: {
                ...Style.bg_color_cityseeker,
            },
            op: {
                onHidden: () => {
                    navigation.goBack();
                },
            },
        });
    }
};

const root = function*() {
    yield takeLatest(ACCOUNT.SKIP_SIGNIN, skip_signin);
    yield takeLatest(ACCOUNT.SIGNUP_REQUEST, signup);
    yield takeLatest(ACCOUNT.SIGNIN_REQUEST, signin);
    yield takeLatest(ACCOUNT.SIGNIN_SUCCESS, signin_success);
    yield takeLatest(ACCOUNT.SIGNIN_FAILURE, signin_fail);
    yield takeLatest(ACCOUNT.SIGNOUT_REQUEST, signout);
    yield takeLatest(ACCOUNT.SIGNOUT_SUCCESS, signout_success);
    yield takeLatest(ACCOUNT.UPDATE_REQUEST, updateRequest);
};

export default root;
