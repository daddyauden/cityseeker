import {
    schemaMigrations,
    addColumns,
} from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
    migrations: [
        {
            toVersion: 2,
            steps: [
                addColumns({
                    table: 'subscriptions',
                    columns: [
                        {
                            name: 'jitsi_timeout',
                            type: 'number',
                            isOptional: true,
                        },
                    ],
                }),
            ],
        },
        {
            toVersion: 3,
            steps: [
                addColumns({
                    table: 'subscriptions',
                    columns: [
                        {
                            name: 'hide_unread_status',
                            type: 'boolean',
                            isOptional: true,
                        },
                    ],
                }),
            ],
        },
    ],
});
