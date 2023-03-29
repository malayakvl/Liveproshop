import pool from './connect.js';
import { logger } from '../../common/logger.js';

class Notification {
    async fetchNew (userId) {
        const client = await pool.connect();
        try {
            const query = `SELECT * FROM common__tools._select_total_from_table_by_where('data', 'notifications', 'id', '(user_id = ''${userId}'' AND is_read=false)');`;
            const res = await client.query(query);
            return res.rows.length ? res.rows[0].total : 0;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Notification fetch error' } };
        } finally {
            client.release();
        }
    }

    async getAll (page, perPage = 20, userId, isRead = false, reqOffset = null) {
        const client = await pool.connect();
        try {
            const _total = await client.query(`SELECT * FROM common__tools._select_total_from_table_by_where('data', 'notifications', 'id', 'user_id=''${userId}'' AND is_read=${isRead}');`);
            const size = _total.rows[0].total;
            // const perPage = 20;
            let offset;
            if (reqOffset) {
                offset = reqOffset;
            } else {
                offset = (Number(page) - 1) * Number(perPage);
            }
            const res = await client.query(`SELECT * FROM data.get_notifications(${perPage}, ${offset}, 'user_id=''${userId}'' AND is_read=${isRead}', 'created_at DESC')`);
            const notifications = res.rows.length > 0 ? res.rows : [];
            const error = null;

            return {
                notifications,
                size,
                error
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Notifications getAll):',
                    { message: e.message }
                );
            }
            const users = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                users,
                error
            };
        } finally {
            client.release();
        }
    }
}

export default new Notification();
