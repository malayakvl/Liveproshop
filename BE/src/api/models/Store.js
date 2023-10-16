import pool from './connect.js';
import { logger } from '../../common/logger.js';

class Store {
    async getAll (page, perPage = 20, userId, reqOffset = null) {
        const client = await pool.connect();
        try {
            const _total = await client.query(
                `SELECT * FROM common__tools._select_total_from_table_by_where('data', 'user_stores', 'id', 'user_id = ''${userId}''');`
            );
            const size = _total.rows[0].total;
            let offset;
            if (reqOffset) {
                offset = reqOffset;
            } else {
                offset = (Number(page) - 1) * Number(perPage);
            }
            const productQuery = `SELECT * FROM data.user_stores WHERE user_id='${userId}' ORDER BY fan_count DESC limit ${perPage} OFFSET ${offset}`;
            const res = await client.query(productQuery);
            const items = res.rows.length > 0 ? res.rows : [];
            const error = null;
        
            return {
                items,
                size,
                error
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Stores getAll):',
                    { message: e.message }
                );
            }
            const products = null;
            const error = {
                code: 500,
                message: 'Error get list of user stores'
            };
            return {
                products,
                error
            };
        } finally {
            client.release();
        }
    }

    async bulkDelete (rowIds, userId) {
        const client = await pool.connect();
        try {
            await client.query(`DELETE FROM data.chatbot_scenarios WHERE id IN (${rowIds.join(',')}) AND user_id=${userId}`);
            return true;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return null;
        } finally {
            client.release();
        }
    }
}

export default new Store();
