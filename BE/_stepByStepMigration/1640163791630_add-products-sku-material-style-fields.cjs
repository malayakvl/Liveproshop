/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns( { schema: 'data', name: 'products' }, {
        material_id: {
            type: 'integer',
            references: '"data"."product_materials"',
        },
        style_id: {
            type: 'integer',
            references: '"data"."product_styles"',
        },
        sku: { type: 'varchar(255)' }
    }, {
        ifNotExists: true
    });
};

exports.down = pgm => {
    pgm.dropColumns(
        { schema: 'data', name: 'products' },
        { material_id, style_id, sku },
        { ifExists: true}
    );
};
