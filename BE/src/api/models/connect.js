import pg from 'pg';
import { logger } from '../../common/logger.js';

const config = {
    user: process.env.DATABASE_MAIN_USER,
    database: process.env.DATABASE_MAIN_BASE,
    password: process.env.DATABASE_MAIN_PASS,
    host: process.env.DATABASE_MAIN_HOST,
    port: process.env.DATABASE_MAIN_PORT,
    max: '20',
    idleTimeoutMillis: '30000'
};
if (process.env.NODE_ENV === 'development') {
    logger.log(
        'info',
        '_DB connection settings:',
        { message: JSON.stringify(config) }
    );
}
const pool = new pg.Pool(config);

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    if (process.env.NODE_ENV === 'development') {
        logger.log(
            'error',
            '_DB connection error:',
            { message: err }
        );
    }
});

export default pool;
