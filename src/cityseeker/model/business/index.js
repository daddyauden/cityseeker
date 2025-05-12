import React from 'react';

module.exports = {
    profile: {
        name: {
            type: 'text',
            label: 'user.name',
        },
        intro: {
            type: 'textarea',
            label: 'user.intro',
        },
        homepage: {
            type: 'text',
            label: 'user.homepage',
        },
        tag: {
            type: 'choice',
            label: 'user.tag',
            multiple: true,
        },
    },
    person: {
        first_name: {
            type: 'text',
            label: 'user.first_name',
        },
        last_name: {
            type: 'text',
            label: 'user.last_name',
        },
        gender: {
            type: 'choice',
            label: 'user.gender',
            choices: {
                'user.gender.0': 0,
                'user.gender.1': 1,
            },
            multiple: false,
        },
        birthday: {
            type: 'datetime',
            label: 'user.birthday',
            format: 'YYYY-MM-DD',
        },
        location: {
            type: 'text',
            label: 'user.location',
        },
        hometown: {
            type: 'text',
            label: 'user.hometown',
        },
        emotion: {
            type: 'choice',
            label: 'user.emotion',
            choices: {
                'user.emotion.1': 1,
                'user.emotion.2': 2,
                'user.emotion.3': 3,
            },
            multiple: false,
        },
        // education: {
        //     type: "text",
        //     label: "user.education"
        // },
        // career: {
        //     type: "text",
        //     label: "user.career"
        // }
    },
    social: {
        weibo: {
            type: 'text',
            label: 'user.weibo',
            link: 'https://www.weibo.com/u/',
            icon: {
                name: 'weibo',
                size: 18,
                color: '#df2029',
            },
        },
        instagram: {
            type: 'text',
            label: 'user.instagram',
            link: 'https://www.instagram.com/',
            icon: {
                name: 'instagram',
                size: 20,
                color: '#F56040',
            },
        },
        facebook: {
            type: 'text',
            label: 'user.facebook',
            link: 'https://www.facebook.com/',
            icon: {
                name: 'facebook-square',
                size: 20,
                color: '#4267B2',
            },
        },
        twitter: {
            type: 'text',
            label: 'user.twitter',
            link: 'https://twitter.com/',
            icon: {
                name: 'twitter-square',
                size: 20,
                color: '#1da1f2',
            },
        },
        linkedin: {
            type: 'text',
            label: 'user.linkedin',
            link: 'https://www.linkedin.com/in/',
            icon: {
                name: 'linkedin',
                size: 20,
                color: '#0077B5',
            },
        },
        github: {
            type: 'text',
            label: 'user.github',
            link: 'https://github.com/',
            icon: {
                name: 'github-square',
                size: 20,
                color: '#333',
            },
        },
        dribbble: {
            type: 'text',
            label: 'user.dribbble',
            link: 'https://dribbble.com/',
            icon: {
                name: 'dribbble-square',
                size: 20,
                color: '#ea4c89',
            },
        },
        behance: {
            type: 'text',
            label: 'user.behance',
            link: 'https://www.behance.net/',
            icon: {
                name: 'behance-square',
                size: 20,
                color: '#1769ff',
            },
        },
    },
    message: {
        wechat: {
            type: 'text',
            label: 'user.wechat',
            icon: {
                name: 'weixin',
                size: 20,
                color: '#4AAF32',
            },
        },
        whatsapp: {
            type: 'text',
            label: 'user.whatsapp',
            icon: {
                name: 'whatsapp',
                size: 20,
                color: '#25D366',
            },
        },
        line: {
            type: 'text',
            label: 'user.line',
            icon: {
                name: 'line',
                size: 20,
                color: '#00c300',
            },
        },
        snapchat: {
            type: 'text',
            label: 'user.snapchat',
            icon: {
                name: 'snapchat-square',
                size: 20,
                color: '#ff8651',
            },
        },
    },
    business: {
        type: {
            type: 'text',
            readonly: true,
            label: 'user.type',
        },
        reservation: {
            type: 'text',
            label: 'user.reservation',
            placeholder: 'common.link',
        },
        menu: {
            type: 'text',
            label: 'user.menu',
            placeholder: 'common.link',
        },
        description: {
            type: 'textarea',
            label: 'common.description',
        },
        country: {
            type: 'choice',
            label: 'common.country',
            choices: {
                ca: 'ca',
                au: 'au',
                nz: 'nz',
                uk: 'uk',
                fr: 'fr',
            },
            multiple: false,
        },
        city: {
            type: 'choice',
            label: 'common.city',
            choices: {
                CA: {
                    toronto: 'toronto',
                    vancouver: 'vancouver',
                    montreal: 'montreal',
                    calgary: 'calgary',
                    edmonton: 'edmonton',
                    ottawa: 'ottawa',
                    winnipeg: 'winnipeg',
                    quebec_city: 'quebec_city',
                    halifax: 'halifax',
                    saskatoon: 'saskatoon',
                    saint_john: 'saint_john',
                    fredericton: 'fredericton',
                    moncton: 'moncton',
                    charlottetown: 'charlottetown',
                    st_johns: 'st_johns',
                },
                AU: {
                    canberra: 'canberra',
                    sydney: 'sydney',
                    melbourne: 'melbourne',
                    brisbane: 'brisbane',
                    perth: 'perth',
                    adelaide: 'adelaide',
                    darwin: 'darwin',
                    gold_coast: 'gold_coast',
                    cairns: 'cairns',
                    hobart: 'hobart',
                },
                NZ: {
                    auckland: 'auckland',
                    wellington: 'wellington',
                    christchurch: 'christchurch',
                    hamilton: 'hamilton',
                },
                UK: {
                    london: 'london',
                    birmingham: 'birmingham',
                    glasgow: 'glasgow',
                    liverpool: 'liverpool',
                    bristol: 'bristol',
                    sheffield: 'sheffield',
                    manchester: 'manchester',
                    leeds: 'leeds',
                    edinburgh: 'edinburgh',
                    leicester: 'leicester',
                    bradford: 'bradford',
                    cardiff: 'cardiff',
                    coventry: 'coventry',
                    nottingham: 'nottingham',
                    belfast: 'belfast',
                    cambridge: 'cambridge',
                    oxford: 'oxford',
                    newcastle: 'newcastle',
                    portsmouth: 'portsmouth',
                    brighton: 'brighton',
                },
                FR: {
                    paris: 'paris',
                    marseille: 'marseille',
                    lyon: 'lyon',
                    toulouse: 'toulouse',
                    nice: 'nice',
                    nantes: 'nantes',
                    strasbourg: 'strasbourg',
                    montpellier: 'montpellier',
                    bordeaux: 'bordeaux',
                    lille: 'lille',
                    cannes: 'cannes',
                },
            },
            multiple: false,
        },
        address: {
            type: 'text',
            label: 'common.address',
        },
        zip: {
            type: 'text',
            label: 'common.zip',
        },
        features: {
            type: 'choice',
            label: 'user.features',
            choices: {
                'features.parking': 'parking',
                'features.bike_parking': 'bike_parking',
                'features.credit_cards': 'credit_cards',
                'features.takes_reservations': 'takes_reservations',
                'features.online_bookings': 'online_bookings',
                'features.delivery': 'delivery',
                'features.takeout': 'takeout',
                'features.outdoor_seating': 'outdoor_seating',
                'features.private_dining': 'private_dining',
                'features.buffet': 'buffet',
                'features.serves_alcohol': 'serves_alcohol',
                'features.free_wifi': 'free_wifi',
                'features.television': 'television',
                'features.wheelchair_accessible': 'wheelchair_accessible',
                'features.coat_check': 'coat_check',
                'features.waiter_service': 'waiter_service',
                'features.good_for_dancing': 'good_for_dancing',
                'features.good_for_business_meetings':
                    'good_for_business_meetings',
                'features.good_for_groups': 'good_for_groups',
                'features.special_occasion_dining': 'special_occasion_dining',
                'features.good_for_kids': 'good_for_kids',
                'features.romantic': 'romantic',
                'features.sports_bars': 'sports_bars',
                'features.live_music': 'live_music',
                'features.vegan': 'vegan',
                'features.vegetarian': 'vegetarian',
                'features.gluten_free': 'gluten_free',
                'features.caters': 'caters',
                'features.gender_neutral_restrooms': 'gender_neutral_restrooms',
                'features.pets_allowed': 'pets_allowed',
                'features.smoking_allowed': 'smoking_allowed',
            },
            multiple: true,
        },
        tel: {
            type: 'tel',
            label: 'common.tel',
        },
        // open_hours: {
        //     type: "choice",
        //     label: "user.open_hours"
        // }
    },
    account: {
        username: {
            type: 'text',
            label: 'user.username',
        },
        email: {
            type: 'text',
            label: 'common.email',
        },
        // phone: {
        //     type: "text",
        //     label: "user.phone"
        // },
        password: {
            type: 'text',
            label: 'user.password',
        },
    },
};
