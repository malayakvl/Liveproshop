module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        'standard'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 11,
        sourceType: 'module'
    },
    rules: {
        indent: ['error', 4],
        semi: ['error', 'always'],
        quotes: [2, 'single']
    }
};
