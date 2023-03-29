/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`CREATE TABLE IF NOT EXISTS data.product_styles (
            id serial  PRIMARY KEY,
            name character varying(255) NOT NULL,
            created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP);
            
            CREATE TABLE IF NOT EXISTS data.product_materials (
            id serial  PRIMARY KEY,
            name character varying(255) NOT NULL,
            created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP);
            `);
};

exports.down = pgm => {
    pgm.dropTable({ schema: 'data', name: 'product_styles' }, {
        ifExists: true,
        cascade: false
    });
    pgm.dropTable({ schema: 'data', name: 'product_styles' }, {
        ifExists: true,
        cascade: false
    });
};
