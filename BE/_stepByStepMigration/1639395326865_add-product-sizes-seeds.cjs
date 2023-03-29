exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(
        `
        INSERT INTO data.product_sizes (id, name, code)
            VALUES
            (1, 'S', 'S'),
            (2, 'M', 'M'),
            (3, 'L', 'L'),
            (4, 'XL', 'XL'),
            (5, 'XXL', 'XXL');
        `
    );
};
