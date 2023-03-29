import Seed from './src/Seed.js';

const argv = process.argv.slice(2);

if (!argv.length) {
    console.log(
        'Usage: [up|down] [seedName]'
    );
} else {
    (new Seed()).run(argv);
}
