/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.dropColumns(
        { schema: 'data', name: 'products' },
        { style_id, sku, price, quantity, keywords },
        { ifExists: true}
    );
};

