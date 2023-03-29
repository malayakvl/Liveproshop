/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns( { schema: 'data', name: 'users' },
        {
            photo: { type: 'text' },
        } , {
            ifNotExists: true
        });
};

// exports.down = pgm => {};
