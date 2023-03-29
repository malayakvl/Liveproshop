/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns( { schema: 'data', name: 'product_sizes' },
        {
            group_by: { type: 'smallint' },
            order_by: { type: 'smallint' },
        } , {
            ifNotExists: true
        });
};

// exports.down = pgm => {};
