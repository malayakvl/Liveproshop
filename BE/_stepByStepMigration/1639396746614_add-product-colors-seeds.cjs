exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(
        `
        INSERT INTO data.product_colors (id, name, code)
            VALUES
            (1, 'red', '#CA4573'),
            (2, 'yellow', '#EFBB58'),
            (3, 'blue', '#99ABCE'),
            (4, 'green', '#61E9B0');
        `
    );
};
