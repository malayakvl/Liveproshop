/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(
        `CREATE SCHEMA IF NOT EXISTS common__tools;`
    );
};

exports.down = pgm => {
    pgm.sql(
        `DROP SCHEMA IF EXISTS common__tools;`
    );
};
