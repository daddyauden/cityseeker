import AppConfig from './app';

const apicenter = AppConfig.apicenter;

module.exports = {
    business: {
        index: apicenter + '/business',
        avator: apicenter + '/business/avator',
        cover: apicenter + '/business/cover',
        resume: apicenter + '/business/resume',
        info: apicenter + '/business/info',
        list: apicenter + '/business/list',
        record: apicenter + '/business/record',
        check: {
            username: apicenter + '/business/username/check',
            email: apicenter + '/business/email/check',
            phone: apicenter + '/business/phone/check',
        },
        signup: apicenter + '/business/signup',
        signin: apicenter + '/business/signin',
        exist: apicenter + '/business/exist',
        verifyCode: apicenter + '/business/verify-code',
    },
    calendar: {
        events: apicenter + '/calendar/events',
    },
    comment: {
        add: apicenter + '/comment',
        list: apicenter + '/comment/list',
        feed: apicenter + '/comment/feed/list',
    },
    events: {
        add: apicenter + '/events',
        info: apicenter + '/events/info',
        list: apicenter + '/events/list',
        calendar: apicenter + '/events/calendar',
    },
    feed: {
        type: apicenter + '/feed/type',
        add: apicenter + '/feed',
        info: apicenter + '/feed/info',
        list: apicenter + '/feed/list',
    },
    image: {
        business: apicenter + '/image/business',
        item: apicenter + '/image/item',
        list: apicenter + '/image/list',
        delete: apicenter + '/image',
    },
    init: {
        all: apicenter + '/init',
        params: apicenter + '/init/params',
        locale: apicenter + '/init/locale',
        area: apicenter + '/init/area',
    },
    item: {
        index: apicenter + '/item',
        banner: apicenter + '/item/banner',
        info: apicenter + '/item/info',
        list: apicenter + '/item/list',
    },
    record: {
        index: apicenter + '/record',
        list: apicenter + '/record/list',
    },
    search: {
        index: apicenter + '/search',
        item: apicenter + '/search/item',
        business: apicenter + '/search/business',
        job: apicenter + '/search/job',
    },
    complain: {
        add: apicenter + '/complain',
        list: apicenter + '/complain/list',
        delete: apicenter + '/complain',
    },
    support: {
        terms_of_use: 'https://ca.daddyauden.com/agreement',
        privacy_policy: 'https://ca.daddyauden.com/privacy',
    },
    job: {
        index: apicenter + '/job',
        info: apicenter + '/job/info',
        list: apicenter + '/job/list',
    },
};
