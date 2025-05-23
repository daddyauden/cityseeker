const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
    transformer: {
        getTransformOptions: () => ({
            transform: {
                experimentalImportSupport: true,
                inlineRequires: true,
            },
        }),
    },
    maxWorkers: 2,
    resolver: {
        blacklistRE: blacklist([
            /ios\/Pods\/JitsiMeetSDK\/Frameworks\/JitsiMeet.framework\/assets\/node_modules\/react-native\/.*/,
        ]),
    },
};
