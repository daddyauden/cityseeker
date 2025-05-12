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
    duration: {
        type: 'number',
        required: false,
        label: 'spa.duration',
        placeholder: 'common.time.minute',
    },
    description: {
        type: 'textarea',
        required: false,
        label: 'common.description',
    },
};
