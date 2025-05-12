import {Platform} from 'react-native';
import Parse from 'parse/react-native';

import {name, version, bundle_identifier} from '../config/app';

async function currentInstallation() {
    const installationId = await Parse._getInstallationId();

    return new Parse.Installation({
        installationId,
        appName: name,
        appVersion: version + '',
        appIdentifier: bundle_identifier,
        pushType: Platform.OS ? 'APN' : 'GCM',
        deviceType: Platform.OS,
        parseVersion: Parse.CoreManager.get('VERSION'),
    });
}

async function updateInstallation(updates) {
    const installation = await currentInstallation();

    await installation.save(updates);
}

module.exports = {
    currentInstallation,
    updateInstallation,
};
