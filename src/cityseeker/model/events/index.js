import React from 'react';

module.exports = {
    title: {
        type: 'text',
        required: true,
        label: 'common.title',
    },
    category: {
        type: 'choice',
        required: true,
        label: 'common.category',
        multiple: false,
        choices: {
            'events.category.festival': 'festival',
            'events.category.market': 'market',
            'events.category.music': 'music',
            'events.category.drama': 'drama',
            'events.category.dance': 'dance',
            'events.category.exhibition': 'exhibition',
            'events.category.speech': 'speech',
            'events.category.film': 'film',
            'events.category.party': 'party',
            'events.category.sport': 'sport',
            'events.category.public': 'public',
            'events.category.travel': 'travel',
            'events.category.course': 'course',
            'events.category.competition': 'competition',
            'events.category.kids': 'kids',
            'events.category.other': 'other',
        },
    },
    address: {
        type: 'text',
        required: false,
        label: 'common.address',
    },
    price: {
        type: 'number',
        required: false,
        label: 'common.price',
    },
    ticket: {
        type: 'text',
        required: false,
        label: 'events.ticket',
    },
    detail: {
        type: 'textarea',
        required: false,
        label: 'common.detail',
    },
};
