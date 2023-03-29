/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`CREATE TABLE IF NOT EXISTS data.hashtags (
            id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name character varying(255)
        );
        `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE IF EXISTS data.hashtags;
    `)
};
