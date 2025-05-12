import {Dimensions} from 'react-native';

module.exports = {
    limit: 20,
    upcomingLimit: 20,
    upcomingBannerWidth: Dimensions.get('window').width / 2.5,
    upcomingBannerHeight: 150,
    topRatedLimit: 20,
    topRatedBannerWidth: Dimensions.get('window').width / 2,
    topRatedBannerHeight: 200,
};
