import React from 'react';

module.exports = {
    description: {
        type: 'textarea',
        required: false,
        label: 'estate.description',
    },
    proximity: {
        type: 'textarea',
        required: false,
        label: 'estate.proximity',
    },
    name: {
        type: 'text',
        required: true,
        label: 'estate.name.label',
    },
    // country: {
    //     type: "choice",
    //     label: "user.country",
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
    //     label: "user.city",
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
        label: 'estate.address.label',
    },
    // zip: {
    //     type: "text",
    //     required: false,
    //     label: "common.zip"
    // },
    bedrooms: {
        type: 'number',
        required: true,
        label: 'estate.bedrooms.label',
    },
    bathrooms: {
        type: 'number',
        required: true,
        label: 'estate.bathrooms.label',
    },
    // build_in: {
    //     type: "date",
    //     format: "YYYY",
    //     required: true,
    //     label: "estate.build_in.label"
    // },
    price: {
        type: 'number',
        required: true,
        label: 'estate.price.label',
    },
    seller: {
        type: 'choice',
        required: true,
        label: 'estate.seller.label',
        multiple: false,
        choices: {
            'estate.seller.realtor': 'realtor',
            'estate.seller.owner': 'owner',
            'estate.seller.consultant': 'consultant',
            'estate.seller.broker': 'broker',
        },
    },
    property_type: {
        type: 'choice',
        required: true,
        label: 'estate.property_type.label',
        multiple: false,
        choices: {
            'estate.property_type.apartment': 'apartment',
            'estate.property_type.condo': 'condo',
            'estate.property_type.studio': 'studio',
            'estate.property_type.detached': 'detached',
            'estate.property_type.semi-detached': 'semi-detached',
            'estate.property_type.townhouse': 'townhouse',
            'estate.property_type.flat': 'flat',
            'estate.property_type.cottage': 'cottage',
            'estate.property_type.business': 'business',
            'estate.property_type.land': 'land',
        },
    },
    floor_size: {
        type: 'number',
        required: true,
        label: 'estate.floor_size.label',
    },
    // lot_size: {
    //     order: 13,
    //     type: "number",
    //     required: false,
    //     label: "estate.lot_size"
    // },
    lot_assessment: {
        type: 'number',
        required: false,
        label: 'estate.lot_assessment',
    },
    building_assessment: {
        type: 'number',
        required: false,
        label: 'estate.building_assessment',
    },
    monthly_fees: {
        order: 17,
        type: 'number',
        required: false,
        label: 'estate.monthly_fees',
    },
    municipal_tax: {
        type: 'number',
        required: false,
        label: 'estate.municipal_tax',
    },
    school_tax: {
        type: 'number',
        required: false,
        label: 'estate.school_tax',
    },
    parking: {
        type: 'choice',
        required: false,
        label: 'estate.parking',
        multiple: true,
        choices: {
            'estate.parking.detached-garage': 'detached-garage',
            'estate.parking.attached-garage': 'attached-garage',
            'estate.parking.interior-parking': 'interior-parking',
            'estate.parking.street-parking': 'street-parking',
            'estate.parking.carport': 'carport',
            'estate.parking.valet-parking': 'valet-parking',
            'estate.parking.no-parking': 'no-parking',
        },
    },
    appliances: {
        type: 'choice',
        required: false,
        label: 'estate.appliances',
        multiple: true,
        choices: {
            'estate.appliances.refrigerator': 'refrigerator',
            'estate.appliances.stereo': 'stereo',
            'estate.appliances.dvd': 'dvd',
            'estate.appliances.television': 'television',
            'estate.appliances.washer': 'washer',
            'estate.appliances.dryer': 'dryer',
            'estate.appliances.stove': 'stove',
            'estate.appliances.exhaust-fan': 'exhaust-fan',
            'estate.appliances.dishwasher': 'dishwasher',
            'estate.appliances.microwave': 'microwave',
            'estate.appliances.central-air-conditioning':
                'central-air-conditioning',
            'estate.appliances.plasma-televisions': 'plasma-televisions',
            'estate.appliances.electronic-monitoring': 'electronic-monitoring',
        },
    },
    inclusions: {
        type: 'choice',
        required: false,
        label: 'estate.inclusions',
        multiple: true,
        choices: {
            'estate.inclusions.balcony': 'balcony',
            'estate.inclusions.furniture': 'furniture',
            'estate.inclusions.accessories': 'accessories',
            'estate.inclusions.fully-equipped-kitchen':
                'fully-equipped-kitchen',
            'estate.inclusions.hardwood-floors': 'hardwood-floors',
            'estate.inclusions.elevator': 'elevator',
            'estate.inclusions.pool': 'pool',
            'estate.inclusions.gym': 'gym',
            'estate.inclusions.frontyard': 'frontyard',
            'estate.inclusions.backyard': 'backyard',
            'estate.inclusions.mountain-view': 'mountain-view',
            'estate.inclusions.ocean-view': 'ocean-view',
        },
    },
};
