/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable({ schema: 'data', name: 'invitations' }, {
        id: 'id',
        email: { type: 'varchar(100)', notNull: true, unique: true },
        role_id: {
            type: 'integer',
            notNull: true,
            references: '"data"."roles"',
            onDelete: 'cascade',
        },
        hash: { type: 'text' },
        active: {type: 'boolean', noNull: true, default: true},
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
    pgm.dropTable({ schema: 'data', name: 'invitations' }, {
        ifExists: true,
        cascade: false
    });
};
