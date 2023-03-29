exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(
        `
        INSERT INTO data.product_styles (id, name)
            VALUES
            (1, 'Casual'),
            (2, 'Office'),
            (3, 'Evening');
            
        INSERT INTO data.product_materials (id, name)
            VALUES
            (1, 'Cotton'),
            (2, 'Lazer'),
            (3, 'Silk');
        `
    );
};
