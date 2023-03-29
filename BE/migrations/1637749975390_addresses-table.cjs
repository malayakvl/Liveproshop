/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`CREATE TABLE IF NOT EXISTS data.addresses (
            id serial  PRIMARY KEY,
            user_id integer NOT NULL REFERENCES data.users(id) ON DELETE CASCADE,
            country_id integer NOT NULL REFERENCES data.countries(id),
            state character varying(255),
            post_code character varying(255),
            address_type character varying(255),
            city character varying(255),
            address_line_1 text,
            address_line_2 text,
            created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`);
};

exports.down = pgm => {
    pgm.dropTable({ schema: 'data', name: 'addresses' }, {
        ifExists: true,
        cascade: false
    })
};
