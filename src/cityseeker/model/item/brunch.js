import React from 'react';

module.exports = {
    name: {
        type: 'text',
        required: true,
        label: 'common.title',
    },
    avarage: {
        type: 'choice',
        required: true,
        label: 'common.avarage',
        choices: {
            'common.avarage.one': 'one',
            'common.avarage.two': 'two',
            'common.avarage.three': 'three',
            'common.avarage.four': 'four',
        },
        multiple: false,
    },
    description: {
        type: 'textarea',
        required: false,
        label: 'common.description',
    },
};
