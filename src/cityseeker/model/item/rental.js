import React from 'react';

module.exports = {
    description: {
        type: 'textarea',
        required: false,
        label: 'common.description',
    },
    name: {
        type: 'text',
        required: true,
        label: 'common.title',
    },
    // country: {
    //     type: "choice",
    //     label: "common.country",
    //     choices: {
    //         CA: "CA",
    //         AU: "AU",
    //         NZ: "NZ",
    //         UK: "UK",
    //         FR: "FR"
    //     },
    //     multiple: false
    // },
    // city: {
    //     type: "choice",
    //     label: "common.city",
    //     choices: {
    //         CA: {
    //             toronto: "toronto",
    //             vancouver: "vancouver",
    //             montreal: "montreal",
    //             calgary: "calgary",
    //             edmonton: "edmonton",
    //             ottawa: "ottawa",
    //             winnipeg: "winnipeg",
    //             quebec_city: "quebec_city",
    //             halifax: "halifax",
    //             saskatoon: "saskatoon",
    //             saint_john: "saint_john",
    //             fredericton: "fredericton",
    //             moncton: "moncton",
    //             charlottetown: "charlottetown",
    //             st_johns: "st_johns"
    //         },
    //         AU: {
    //             canberra: "canberra",
    //             sydney: "sydney",
    //             melbourne: "melbourne",
    //             brisbane: "brisbane",
    //             perth: "perth",
    //             adelaide: "adelaide",
    //             darwin: "darwin",
    //             gold_coast: "gold_coast",
    //             cairns: "cairns",
    //             hobart: "hobart"
    //         },
    //         NZ: {
    //             auckland: "auckland",
    //             wellington: "wellington",
    //             christchurch: "christchurch",
    //             hamilton: "hamilton"
    //         },
    //         UK: {
    //             london: "london",
    //             birmingham: "birmingham",
    //             glasgow: "glasgow",
    //             liverpool: "liverpool",
    //             bristol: "bristol",
    //             sheffield: "sheffield",
    //             manchester: "manchester",
    //             leeds: "leeds",
    //             edinburgh: "edinburgh",
    //             leicester: "leicester",
    //             bradford: "bradford",
    //             cardiff: "cardiff",
    //             coventry: "coventry",
    //             nottingham: "nottingham",
    //             belfast: "belfast",
    //             cambridge: "cambridge",
    //             oxford: "oxford",
    //             newcastle: "newcastle",
    //             portsmouth: "portsmouth",
    //             brighton: "brighton"
    //         },
    //         FR: {
    //             paris: "paris",
    //             marseille: "marseille",
    //             lyon: "lyon",
    //             toulouse: "toulouse",
    //             nice: "nice",
    //             nantes: "nantes",
    //             strasbourg: "strasbourg",
    //             montpellier: "montpellier",
    //             bordeaux: "bordeaux",
    //             lille: "lille",
    //             cannes: "cannes"
    //         }
    //     },
    //     multiple: false
    // },
    address: {
        type: 'text',
        required: true,
        label: 'common.address',
    },
    // zip: {
    //     type: "text",
    //     required: false,
    //     label: "common.zip"
    // },
    bedrooms: {
        type: 'number',
        required: true,
        label: 'common.bedrooms',
    },
    bathrooms: {
        type: 'number',
        required: true,
        label: 'common.bathrooms',
    },
    date_available: {
        type: 'date',
        format: 'YYYY-MM-DD',
        required: true,
        label: 'rental.date_available',
    },
    price: {
        type: 'number',
        required: true,
        label: 'common.price',
    },
    rent_type: {
        type: 'choice',
        required: true,
        label: 'rental.rent_type',
        choices: {
            'rental.rent_type.rental': 'rental',
            'rental.rent_type.transfer': 'transfer',
            'rental.rent_type.home': 'home',
        },
        multiple: false,
    },
    storey: {
        type: 'text',
        required: false,
        label: 'common.storey',
    },
    lease_term: {
        type: 'choice',
        required: false,
        label: 'rental.lease_term',
        choices: {
            'rental.lease_term.annual': 'annual',
            'rental.lease_term.semi-annual': 'semi-annual',
            'rental.lease_term.quarterly': 'quarterly',
            'rental.lease_term.monthly': 'monthly',
            'rental.lease_term.semi-monthly': 'semi-monthly',
            'rental.lease_term.bi-weekly': 'bi-weekly',
            'rental.lease_term.weekly': 'weekly',
        },
        multiple: false,
    },
    payment_frequency: {
        type: 'choice',
        required: false,
        label: 'rental.payment_frequency',
        choices: {
            'rental.payment_frequency.monthly': 'monthly',
            'rental.payment_frequency.quarterly': 'quarterly',
            'rental.payment_frequency.annual': 'Annual',
            'rental.payment_frequency.bi-weekly': 'bi-weekly',
            'rental.payment_frequency.weekly': 'weekly',
        },
        multiple: false,
    },
    property_type: {
        type: 'choice',
        required: true,
        label: 'rental.property_type',
        choices: {
            'rental.property_type.apartment': 'apartment',
            'rental.property_type.condo': 'condo',
            'rental.property_type.studio': 'studio',
            'rental.property_type.detached': 'detached',
            'rental.property_type.semi-detached': 'semi-detached',
            'rental.property_type.townhouse': 'townhouse',
            'rental.property_type.cottage': 'cottage',
            'rental.property_type.business': 'business',
            'rental.property_type.land': 'land',
        },
        multiple: false,
    },
    parking: {
        type: 'choice',
        required: false,
        label: 'rental.parking',
        choices: {
            'rental.parking.detached-garage': 'detached-garage',
            'rental.parking.attached-garage': 'attached-garage',
            'rental.parking.interior-parking': 'interior-parking',
            'rental.parking.street-parking': 'street-parking',
            'rental.parking.carport': 'carport',
            'rental.parking.valet-parking': 'valet-parking',
            'rental.parking.no-parking': 'no-parking',
        },
        multiple: true,
    },
    appliances: {
        type: 'choice',
        required: false,
        label: 'rental.appliances',
        choices: {
            'rental.appliances.refrigerator': 'refrigerator',
            'rental.appliances.stereo': 'stereo',
            'rental.appliances.dvd': 'dvd',
            'rental.appliances.television': 'television',
            'rental.appliances.washer': 'washer',
            'rental.appliances.dryer': 'dryer',
            'rental.appliances.stove': 'stove',
            'rental.appliances.exhaust-fan': 'exhaust-fan',
            'rental.appliances.dishwasher': 'dishwasher',
            'rental.appliances.microwave': 'microwave',
        },
        multiple: true,
    },
    characteristics_in_unit: {
        type: 'choice',
        required: false,
        label: 'rental.characteristics_in_unit',
        choices: {
            'rental.characteristics_in_unit.balcony': 'balcony',
            'rental.characteristics_in_unit.furniture': 'furniture',
            'rental.characteristics_in_unit.bedding': 'bedding',
            'rental.characteristics_in_unit.accessories': 'accessories',
            'rental.characteristics_in_unit.electricity': 'electricity',
            'rental.characteristics_in_unit.central-air-conditioning':
                'central-air-conditioning',
            'rental.characteristics_in_unit.cable-tv': 'cable-tv',
            'rental.characteristics_in_unit.plasma-televisions':
                'plasma-televisions',
            'rental.characteristics_in_unit.high-speed-internet':
                'high-speed-internet',
            'rental.characteristics_in_unit.telephone': 'telephone',
            'rental.characteristics_in_unit.linens': 'linens',
            'rental.characteristics_in_unit.fully-equipped-kitchen':
                'fully-equipped-kitchen',
            'rental.characteristics_in_unit.hardwood-floors': 'hardwood-floors',
            'rental.characteristics_in_unit.whirlpool': 'whirlpool',
            'rental.characteristics_in_unit.interior-parking':
                'interior-parking',
            'rental.characteristics_in_unit.non-smoking': 'non-smoking',
            'rental.characteristics_in_unit.heating': 'heating',
            'rental.characteristics_in_unit.hot-water': 'hot-water',
            'rental.characteristics_in_unit.no-pets': 'no-pets',
            'rental.characteristics_in_unit.home-office-space':
                'home-office-space',
        },
        multiple: true,
    },
    characteristics_in_building: {
        type: 'choice',
        required: false,
        label: 'rental.characteristics_in_building',
        choices: {
            'rental.characteristics_in_building.locker': 'locker',
            'rental.characteristics_in_building.laundry': 'laundry',
            'rental.characteristics_in_building.elevator': 'elevator',
            'rental.characteristics_in_building.indoor-pool': 'indoor-pool',
            'rental.characteristics_in_building.gym': 'gym',
            'rental.characteristics_in_building.intercom': 'intercom',
            'rental.characteristics_in_building.rooftop-terrace':
                'rooftop-terrace',
            'rental.characteristics_in_building.sauna': 'sauna',
            'rental.characteristics_in_building.electronic-monitoring':
                'electronic-monitoring',
        },
        multiple: true,
    },
};
