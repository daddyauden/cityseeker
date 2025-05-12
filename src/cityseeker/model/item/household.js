import React from 'react';

module.exports = {
    name: {
        type: 'text',
        required: true,
        label: 'common.title',
    },
    price: {
        type: 'number',
        required: false,
        label: 'common.price',
    },
    category: {
        type: 'choice',
        required: true,
        label: 'common.category',
        choices: {
            'household.category.appliances': 'appliances',
            'household.category.decoration': 'decoration',
            'household.category.hallway': 'hallway',
            'household.category.livingroom': 'livingroom',
            'household.category.bedroom': 'bedroom',
            'household.category.children': 'children',
            'household.category.bathroom': 'bathroom',
            'household.category.cooking': 'cooking',
            'household.category.dining': 'dining',
            'household.category.eating': 'eating',
            'household.category.laundry': 'laundry',
            'household.category.storage': 'storage',
            'household.category.textiles': 'textiles',
            'household.category.window': 'window',
            'household.category.lighting': 'lighting',
            'household.category.outdoor': 'outdoor',
            'household.category.office': 'office',
            'household.category.pets': 'pets',
        },
        multiple: false,
    },
    description: {
        type: 'textarea',
        required: false,
        label: 'common.description',
    },
};
