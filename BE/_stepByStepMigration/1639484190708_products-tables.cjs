/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`CREATE TABLE IF NOT EXISTS data.products (
            id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name character varying(255),
            price double precision,
            description text,
            keywords text,
            quantity integer,
            photos text[],
            publish boolean DEFAULT true,
            created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            user_id integer REFERENCES data.users(id) ON DELETE CASCADE ON UPDATE RESTRICT
        );
        CREATE TABLE IF NOT EXISTS data.product2color (
            product_id integer REFERENCES data.products ON DELETE RESTRICT,
            color_id integer REFERENCES data.product_colors ON DELETE CASCADE,
            PRIMARY KEY (product_id, color_id)
        );

        CREATE TABLE IF NOT EXISTS data.product2size (
            product_id integer REFERENCES data.products ON DELETE RESTRICT,
            size_id integer REFERENCES data.product_sizes ON DELETE CASCADE,
            PRIMARY KEY (product_id, size_id)
        );
        
        `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE IF EXISTS data.product2size;
        DROP TABLE IF EXISTS data.product2color;
        DROP TABLE IF EXISTS data.products;
    `)
};
