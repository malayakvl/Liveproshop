/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable({ schema: 'data', name: 'users' }, {
        id: 'id',
        email: { type: 'varchar(100)', notNull: true, unique: true },
        password: { type: 'text' },
        salt: { type: 'varchar(255)' },
        auth_provider_name: { type: 'varchar(100)' },
        auth_provider_id: { type: 'varchar(100)' },
        role_id: {
            type: 'integer',
            notNull: true,
            references: '"data"."roles"',
            onDelete: 'cascade',
        },
        last_name: { type: 'varchar(255)' },
        first_name: { type: 'varchar(255)' },
        company_name: { type: 'varchar(255)' },
        identification_number: { type: 'varchar(100)' },
        vat: { type: 'varchar(255)' },
        phone: { type: 'varchar(255)' },
        full_address: { type: 'varchar(255)' },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    }, {
        ifNotExists: true
    });
    // pgm.createIndex('users', 'role_id')
};

exports.down = pgm => {
    pgm.dropTable({ schema: 'data', name: 'users' }, {
        ifExists: true,
        cascade: false
    });
};
