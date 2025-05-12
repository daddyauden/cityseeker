const Tool = {
    Map: {
        getScreen: () => require('./module/tool/map').default,
    },
    Search: {
        getScreen: () => require('./module/tool/search').default,
    },
    Web: {
        getScreen: () => require('./module/tool/web').default,
    },
};

const Complain = {
    ComplainInfo: {
        getScreen: () => require('./module/complain/info').default,
    },
};

const Business = {
    BusinessAction: {
        getScreen: () => require('./module/business/action').default,
    },
    BusinessInfo: {
        getScreen: () => require('./module/business/info').default,
    },
    ...Complain,
};

const Account = {
    Account: {
        getScreen: () => require('./module/account').default,
    },
    AccountEmail: {
        getScreen: () => require('./module/account/email').default,
    },
    AccountPassword: {
        getScreen: () => require('./module/account/password').default,
    },
    AccountPhone: {
        getScreen: () => require('./module/account/phone').default,
    },
    AccountUsername: {
        getScreen: () => require('./module/account/username').default,
    },
    Profile: {
        getScreen: () => require('./module/account/profile').default,
    },
    Sign: {
        getScreen: () => require('./module/account/sign').default,
    },
    Signin: {
        getScreen: () => require('./module/account/signin').default,
    },
    Signup: {
        getScreen: () => require('./module/account/signup').default,
    },
    ResetPassword: {
        getScreen: () => require('./module/account/resetPassword').default,
    },
    TermsOfUse: {
        getScreen: () => require('./module/account/terms').default,
    },
    PrivacyPolicy: {
        getScreen: () => require('./module/account/privacy').default,
    },
};

const Autotrade = {
    Autotrade: {
        getScreen: () => require('./module/autotrade').default,
    },
    AutotradeTransfer: {
        getScreen: () => require('./module/autotrade/transfer').default,
    },
    AutotradeUsed: {
        getScreen: () => require('./module/autotrade/used').default,
    },
};

const Block = {
    Block: {
        getScreen: () => require('./module/block').default,
    },
    BlockUser: {
        getScreen: () => require('./module/block/user').default,
    },
};

const Comment = {
    CommentPost: {
        getScreen: () => require('./module/comment/post').default,
    },
};

const Discovery = {
    Discovery: {
        getScreen: () => require('./module/discovery').default,
    },
    ...Business,
    ...Tool,
};

const Event = {
    Event: {
        getScreen: () => require('./module/event').default,
    },
    EventsAction: {
        getScreen: () => require('./module/event/action').default,
    },
    EventCategory: {
        getScreen: () => require('./module/event/category').default,
    },
    EventInfo: {
        getScreen: () => require('./module/event/info').default,
    },
    EventPost: {
        getScreen: () => require('./module/event/post').default,
    },
    ...Business,
};

const Feed = {
    Feed: {
        getScreen: () => require('./module/feed').default,
    },
    FeedInfo: {
        getScreen: () => require('./module/feed/info').default,
    },
    ...Business,
};

const Hotel = {
    Hotel: {
        getScreen: () => require('./module/hotel').default,
    },
    ...Business,
    ...Tool,
};

const Item = {
    Item: {
        getScreen: () => require('./module/item/indexTabBar').default,
    },
    ItemEdit: {
        getScreen: () => require('./module/item/edit').default,
    },
    ItemMedia: {
        getScreen: () => require('./module/item/media').default,
    },
    ItemPost: {
        getScreen: () => require('./module/item/post').default,
    },
};

const Job = {
    Job: {
        getScreen: () => require('./module/job').default,
    },
    JobInfo: {
        getScreen: () => require('./module/job/info').default,
    },
    JobAdd: {
        getScreen: () => require('./module/job/add').default,
    },
    JobEdit: {
        getScreen: () => require('./module/job/edit').default,
    },
    JobHistory: {
        getScreen: () => require('./module/job/history').default,
    },
    ...Business,
};

const Launch = {
    Launch: {
        getScreen: () => require('./module/launch').default,
    },
    Sign: {
        getScreen: () => require('./module/launch/sign').default,
    },
    Signin: {
        getScreen: () => require('./module/launch/signin').default,
    },
    Signup: {
        getScreen: () => require('./module/launch/signup').default,
    },
    ResetPassword: {
        getScreen: () => require('./module/launch/resetPassword').default,
    },
    TermsOfUse: {
        getScreen: () => require('./module/launch/terms').default,
    },
    PrivacyPolicy: {
        getScreen: () => require('./module/launch/privacy').default,
    },
};

const Manage = {
    ManageAlbum: {
        getScreen: () => require('./module/manage/album').default,
    },
    ManageItem: {
        getScreen: () => require('./module/manage/item').default,
    },
    ManageJob: {
        getScreen: () => require('./module/manage/job').default,
    },
};

const More = {
    More: {
        getScreen: () => require('./module/more').default,
    },
    ...Business,
};

const Restaurant = {
    Restaurant: {
        getScreen: () => require('./module/restaurant').default,
    },
    ...Business,
    ...Tool,
};

const Retail = {
    Retail: {
        getScreen: () => require('./module/retail').default,
    },
    ...Business,
    ...Tool,
};

const Secondhand = {
    Secondhand: {
        getScreen: () => require('./module/secondhand').default,
    },
};

const Setting = {
    Setting: {
        getScreen: () => require('./module/setting').default,
    },
    CitySetting: {
        getScreen: () => require('./module/setting/city').default,
    },
    LocaleSetting: {
        getScreen: () => require('./module/setting/locale').default,
    },
};

const User = {
    UserInfo: {
        getScreen: () => require('./module/user/info').default,
    },
    UserFollow: {
        getScreen: () => require('./module/user/follow').default,
    },
};

module.exports = {
    Account,
    Autotrade,
    Block,
    Business,
    Comment,
    Complain,
    Discovery,
    Event,
    Feed,
    Hotel,
    Item,
    Job,
    Launch,
    Manage,
    More,
    Restaurant,
    Retail,
    Secondhand,
    Setting,
    Tool,
    User,
};
