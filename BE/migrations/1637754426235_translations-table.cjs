/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(
        `CREATE TABLE IF NOT EXISTS data.translations (
            id serial  PRIMARY KEY,
            table_name character varying(255) NOT NULL,
            column_name character varying(255) NOT NULL,
            foreign_key integer NOT NULL,
            locale character varying(20) NOT NULL,
            value text NOT NULL,
            created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            constraint translations_table_name_column_name_foreign_key_locale_unique
            unique (table_name, column_name, foreign_key, locale)
        );
        `
    );
};

exports.down = pgm => {
    pgm.dropTable({ schema: 'data', name: 'translations' }, {
        ifExists: true,
        cascade: false
    })
};
