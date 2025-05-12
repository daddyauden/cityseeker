import React from 'react';

module.exports = {
    title: {
        type: 'text',
        required: true,
        label: 'module.job.title',
    },
    address: {
        type: 'text',
        required: true,
        label: 'module.job.address',
    },
    type: {
        type: 'choice',
        required: true,
        label: 'module.job.type',
        multiple: true,
        choices: {
            'module.job.type.full_time': 'full_time',
            'module.job.type.part_time': 'part_time',
            'module.job.type.contract': 'contract',
            'module.job.type.temporary': 'temporary',
            'module.job.type.casual': 'casual',
            'module.job.type.internship': 'internship',
            'module.job.type.volunteer': 'volunteer',
            'module.job.type.apprenticeship': 'apprenticeship',
        },
    },
    salary: {
        type: 'number',
        required: false,
        label: 'module.job.salary',
        subtitle: 'module.job.salary.subtitle',
    },
    salary_max: {
        type: 'number',
        required: false,
    },
    period: {
        type: 'choice',
        required: false,
        multiple: false,
        choices: {
            'module.job.period.hour': 'hour',
            'module.job.period.day': 'day',
            'module.job.period.week': 'week',
            'module.job.period.month': 'month',
            'module.job.period.year': 'year',
        },
    },
    description: {
        type: 'textarea',
        required: true,
        label: 'module.job.description',
        subtitle: 'module.job.description.subtitle',
    },
    receiver: {
        type: 'text',
        required: false,
        label: 'module.job.receiver',
        subtitle: 'module.job.receiver.subtitle',
    },
};
