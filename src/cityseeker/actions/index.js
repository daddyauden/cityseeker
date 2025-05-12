import * as account from './account';
import * as deepLinking from './deepLinking';
import * as device from './device';
import * as feed from './feed';
import * as installation from './installation';
import * as mode from './mode';
import * as notification from './notification';
import * as record from './record';
import * as system from './system';

module.exports = {
    ...account,
    ...deepLinking,
    ...device,
    ...feed,
    ...installation,
    ...mode,
    ...notification,
    ...record,
    ...system,
};
