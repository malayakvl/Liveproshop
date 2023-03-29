import pool from './connect.js';
import { logger } from '../../common/logger.js';

class Tag {
    async findTags (searchStr) {
        const client = await pool.connect();
        try {
            const regex = /\'/ig;
            const query = `SELECT data.get_hashtags_json_arr('${searchStr.replaceAll(regex, "''")}');`;
            const res = await client.query(query);
            return res.rows[0].get_hashtags_json_arr ? res.rows[0].get_hashtags_json_arr : [];
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Tag error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Tags Not found' } };
        } finally {
            client.release();
        }
    }
    
    async createTag(value) {
        const client = await pool.connect();
        try {
            const queryInsert = `INSERT INTO data.hashtags (name)
                            VALUES (
                                $$${value}$$
                            ) RETURNING id;`;
            const res = await client.query(queryInsert);
            return res.rows[0].id;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Tag error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Tags Not found' } };
        } finally {
            client.release();
        }
        
    }
}

export default new Tag();
