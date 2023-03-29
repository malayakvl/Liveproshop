export default class Validator {
    /**
    * @param {object} seed
    */
    validateSeed (seed) {
        if (seed.up === undefined) {
            throw new Error('Up operation does\'t exist');
        }

        if (seed.down === undefined) {
            throw new Error('Down operation does\'t exist');
        }
    }

    /**
     * @param {string} operation
     */
    validateOperation (operation) {
        if (
            operation !== 'up' &&
            operation !== 'down'
        ) {
            throw new Error('The operation you have passed does\'t exist');
        }
    }
}
