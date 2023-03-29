/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`CREATE TABLE IF NOT EXISTS data.product_configurations (
            id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            product_id integer REFERENCES data.products(id) ON DELETE CASCADE,
            configuration json
        );
        `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE IF EXISTS data.product_configurations;
    `)
};
