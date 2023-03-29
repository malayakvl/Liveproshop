/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`CREATE TABLE IF NOT EXISTS data.countries (
            id serial  PRIMARY KEY,
            iso character varying(5) NOT NULL,
            name character varying(255) NOT NULL,
            nicename character varying(255) NOT NULL,
            iso3 character varying(10),
            numcode integer,
            phonecode character varying(10),
            created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
};

exports.down = pgm => {
    pgm.dropTable({ schema: 'data', name: 'countries' }, {
        ifExists: true,
        cascade: false
    });
};
