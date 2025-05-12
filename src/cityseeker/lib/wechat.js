import axios from 'axios';
import * as WeChat from 'react-native-wechat';
import Parse from 'parse/react-native';
import {wxappid, wxsecret} from '../config/app';

let initialized = false;
let initOptions;
let _authResponse;
let requestedPermissions;

async function checkWxInstalled() {
    return await WeChat.isWXAppInstalled();
}

async function sendAuthRequest() {
    return await WeChat.sendAuthRequest('snsapi_userinfo', 'cityseeker_wechat');
}

async function getAccessCode(code) {
    const url =
        'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' +
        wxappid +
        '&secret=' +
        wxsecret +
        '&code=' +
        code +
        '&grant_type=authorization_code';

    const response = await axios.get(url);

    return response.data;
}

async function loginWithWechatSDK() {
    const status = await checkWxInstalled();

    if (status) {
        const response = await sendAuthRequest();
        if (response.errCode === 0) {
            const auth = await getAccessCode(response.code);

            _authResponse = {
                id: auth.openid,
                access_token: auth.access_token,
            };

            requestedPermissions = auth.scope;
        } else if (response.errCode === -2) {
            throw new Error('cancelled');
        } else if (response.errCode === -4) {
            throw new Error('denied');
        }
    } else {
        throw new Error("Your didn't install WeChat");
    }

    return _authResponse;
}

async function logout() {
    let error = {
        status: 0,
        message: '',
    };

    return error;
}

export const Wechat = {
    init(options) {
        window.WECHAT = Wechat;
    },

    login(callback, options) {
        loginWithWechatSDK(options).then(
            authResponse => {
                callback({authResponse});
            },
            error => callback({error}),
        );
    },

    getAuthResponse() {
        return _authResponse;
    },

    logout() {
        const response = logout();
    },

    api: async function() {
        const {id, access_token} = _authResponse;

        const user = await axios.get(
            'https://api.weixin.qq.com/sns/userinfo?access_token=' +
                access_token +
                '&openid=' +
                id,
        );

        return user.data;
    },
};

const provider = {
    authenticate(options) {
        if (typeof WECHAT === 'undefined') {
            options.error(this, 'Wechat SDK not found.');
        }

        WECHAT.login(response => {
            if (response.authResponse) {
                if (options.success) {
                    options.success(this, {
                        id: response.authResponse.id,
                        access_token: response.authResponse.access_token,
                    });
                }
            } else {
                if (options.error) {
                    options.error(this, response);
                }
            }
        });
    },

    restoreAuthentication(authData) {
        if (authData) {
            const authResponse = {
                id: authData.id,
                access_token: authData.access_token,
            };

            const newOptions = {};

            if (initOptions) {
                for (const key in initOptions) {
                    newOptions[key] = initOptions[key];
                }
            }

            newOptions.authResponse = authResponse;

            newOptions.status = false;

            const existingResponse = WECHAT.getAuthResponse();

            if (existingResponse && existingResponse.id !== authResponse.id) {
                WECHAT.logout();
            }

            WECHAT.init(newOptions);
        }

        return true;
    },

    getAuthType() {
        return 'wechat';
    },

    deauthenticate() {
        this.restoreAuthentication(null);
    },
};

export const WechatUtils = {
    init(appid) {
        if (typeof WECHAT === 'undefined') {
            throw new Error(
                'The WECHAT JavaScript SDK must be loaded before calling init.',
            );
        }

        WeChat.registerApp(appid);

        Parse.User._registerAuthenticationProvider(provider);

        initialized = true;
    },

    isLinked(user) {
        return user._isLinked('wechat');
    },

    logIn() {
        if (!initialized) {
            throw new Error(
                'You must initialize WechatUtils before calling logIn.',
            );
        }

        return Parse.User.logInWith('wechat', {});
    },

    link(user, permissions, options) {
        if (!permissions || typeof permissions === 'string') {
            if (!initialized) {
                throw new Error(
                    'You must initialize WechatUtils before calling link.',
                );
            }

            requestedPermissions = permissions;
            return user._linkWith('wechat', options);
        } else {
            const newOptions = {};

            if (options) {
                for (const key in options) {
                    newOptions[key] = options[key];
                }
            }

            newOptions.authData = permissions;
            return user._linkWith('wechat', newOptions);
        }
    },

    unlink: function(user, options) {
        if (!initialized) {
            throw new Error(
                'You must initialize WechatUtils before calling unlink.',
            );
        }

        return user._unlinkFrom('wechat', options);
    },
};
