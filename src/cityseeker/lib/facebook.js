import {
    LoginManager,
    AccessToken,
    GraphRequest,
    GraphRequestManager,
} from 'react-native-fbsdk';
const emptyFunction = () => {};
import mapObject from 'fbjs/lib/mapObject';
let _authResponse = null;

async function loginWithFacebookSDK(options) {
    const scope = options.scope || 'public_profile,email';
    const permissions = scope.split(',');

    const loginResult = await LoginManager.logInWithPermissions(permissions);

    if (loginResult.isCancelled) {
        throw new Error('cancelled');
    }

    const accessToken = await AccessToken.getCurrentAccessToken();

    if (!accessToken) {
        throw new Error('No access token');
    }

    _authResponse = {
        userID: accessToken.userID,
        accessToken: accessToken.accessToken,
        expiresIn: Math.round((accessToken.expirationTime - Date.now()) / 1000),
    };

    return _authResponse;
}

const Facebook = {
    init(options) {
        window.FB = Facebook;
    },

    login(callback, options) {
        loginWithFacebookSDK(options).then(
            authResponse => callback({authResponse}),
            error => callback({error}),
        );
    },

    getAuthResponse() {
        return _authResponse;
    },

    logout() {
        LoginManager.logOut();
    },

    api: function(path, ...args) {
        const argByType = {};

        args.forEach(arg => {
            argByType[typeof arg] = arg;
        });

        const httpMethod = (argByType.string || 'get').toUpperCase();
        const params = argByType.object || {};
        const callback = argByType.function || emptyFunction;
        const parameters = mapObject(params, value => ({string: value}));

        function processResponse(error, result) {
            if (!error && typeof result === 'string') {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    error = e;
                }
            }

            const data = error ? {error} : result;
            callback(data);
        }

        const request = new GraphRequest(
            path,
            {parameters, httpMethod},
            processResponse,
        );

        new GraphRequestManager().addRequest(request).start();
    },
};

export default Facebook;
