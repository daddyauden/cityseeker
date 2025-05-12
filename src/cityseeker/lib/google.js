import axios from 'axios';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import Parse from 'parse/react-native';
import {google_map_key} from '../config/app';
import Log from '../utils/log';

let initialized = false;
let _authResponse = null;
let userInfo = {};

async function hasPlayServices() {
    return GoogleSignin.hasPlayServices();
}

async function sendAuthRequest() {
    return await GoogleSignin.signIn();
}

async function loginWithGoogleSDK() {
    let err = {
        status: 0,
        message: '',
    };

    try {
        await hasPlayServices();
        const response = await sendAuthRequest();

        _authResponse = {
            id: response.user.id,
            id_token: response.idToken,
            access_token: response.accessToken,
        };

        userInfo = response.user;
    } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            err = {
                status: 1,
                message: 'cancelled',
            };
        } else if (error.code === statusCodes.IN_PROGRESS) {
            err = {
                status: 1,
                message: 'Progress already',
            };
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            err = {
                status: 1,
                message: 'Play services not available or outdated',
            };
        } else {
            err = {
                status: 1,
                message: 'some other error happened',
            };
        }
    }

    if (err.status === 1) {
        throw new Error(err.message);
    }

    return _authResponse;
}

async function logout() {
    let err = {
        status: 0,
        message: '',
    };

    try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
    } catch (error) {
        err = {
            status: 1,
            message: error,
        };
    }

    return err;
}

export const Google = {
    init(options) {
        window.GOOGLE = Google;
    },

    login(callback) {
        loginWithGoogleSDK().then(
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
        logout();
        userInfo = {};
    },

    api: function() {
        return userInfo;
    },

    geocode: async function(lat, lng) {
        // cn = 30.6216081,104.0681355 chengdu
        // au = "-37.8261562,144.9443387" melboneour
        // ca = "49.2399647,-123.0283807" vancouver
        // ca = "45.4907854,-73.582763", montreal
        // ca = "46.8157125,-71.226768" quebec city
        // ca = "45.5878394,-73.7802445" laval
        // us = "37.4018119,-122.321285" guigu
        // fr = "48.8371624,2.3479803" paris
        // fr = "48.807066,2.3170663" greater paris
        // uk = "51.4939016,-0.1434941" london
        let area = {
            country: null,
            city: null,
            lat: lat,
            lng: lng,
        };
        // const administrative = "administrative_area_level_2";
        const locality = 'locality';
        const country = 'country';
        const url =
            `https://maps.googleapis.com/maps/api/geocode/json?language=en&result_type=${locality}&latlng=${lat},${lng}&key=` +
            google_map_key;

        try {
            const response = await axios.get(url);
            const {results, status} = response.data;

            if (status.toUpperCase() == 'OK') {
                results[0].address_components.map(result => {
                    if (result.types[0].toLowerCase() == locality) {
                        let city = result.short_name;
                        if (city.indexOf(' ') != -1) {
                            city = city.replace(/^\s+|\s+$/g, '');
                            city = city.replace(/\s+/g, '_');
                        }

                        area.city = city.toLowerCase();
                    }

                    if (result.types[0].toLowerCase() == country) {
                        area.country = result.short_name.toLowerCase();
                    }
                });
            }
        } catch (e) {
            Log(e);
        }

        return area;
    },
};

const provider = {
    authenticate(options) {
        if (typeof GOOGLE === 'undefined') {
            options.error(this, 'Google SDK not found.');
        }

        GOOGLE.login(response => {
            if (response.authResponse) {
                if (options.success) {
                    options.success(this, {
                        id: response.authResponse.id,
                        id_token: response.authResponse.id_token,
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
                id_token: authData.id_token,
                access_token: authData.access_token,
            };

            const newOptions = {};

            newOptions.authResponse = authResponse;

            newOptions.status = false;

            const existingResponse = GOOGLE.getAuthResponse();

            if (existingResponse && existingResponse.id !== authResponse.id) {
                GOOGLE.logout();
            }

            GOOGLE.init(newOptions);
        }

        return true;
    },

    getAuthType() {
        return 'google';
    },
};

export const GoogleUtils = {
    init(options) {
        if (typeof GOOGLE === 'undefined') {
            throw new Error(
                'The Google JavaScript SDK must be loaded before calling init.',
            );
        }

        GoogleSignin.configure(options);

        Parse.User._registerAuthenticationProvider(provider);

        initialized = true;
    },

    logIn() {
        if (!initialized) {
            throw new Error(
                'You must initialize GoogleUtils before calling logIn.',
            );
        }

        return Parse.User.logInWith('google', {});
    },
};
