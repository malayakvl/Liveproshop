import pool from './connect.js';
import { logger } from '../../common/logger.js';
import moment from 'moment';

class Livesession {
    async getUserScenarios (userId) {
        const client = await pool.connect();
        try {
            const productQuery = `SELECT id, name FROM data.chatbot_scenarios WHERE user_id='${userId}' AND active=true ORDER BY created_at DESC`;
            const res = await client.query(productQuery);
            const items = res.rows.length > 0 ? res.rows : [];
            const error = null;
    
            return {
                items,
                error
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Chatbot getAll active):',
                    { message: e.message }
                );
            }
            const products = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                products,
                error
            };
        } finally {
            client.release();
        }
    }
    
    async getAllInAir () {
        const client = await pool.connect();
        try {
            const query = await client.query(
                `SELECT data.live_sessions.id FROM data.live_sessions WHERE status='live'`
            );
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Products getAll)2:',
                    { message: e.message }
                );
            }
            const products = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                products,
                error
            };
        } finally {
            client.release();
        }
    }
    
    async stopSession(itemId, userId) {
        const client = await pool.connect();
        try {
            // const query = await client.query(
            //     `UPDATE data.live_sessions SET closed=true WHERE id=${itemId} AND user_id=${userId}`
            // );
            const query = await client.query(
                `UPDATE data.live_sessions SET status='closed' WHERE id=${itemId} AND user_id=${userId}`
            );
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Products getAll):',
                    { message: e.message }
                );
            }
            const result = [];
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                result,
                error
            };
        } finally {
            client.release();
        }
    }
    
    async updateSessionStatusFB(sessionId, videoId) {
        const client = await pool.connect();
        const queryStr = `UPDATE data.live_sessions SET status='live', video_id='${videoId}' WHERE id=${sessionId}`;
        try {
            await client.query(queryStr);
            return { success: true };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (updateSessionStatusFB):',
                    { message: e.message }
                );
                logger.log(
                    'error',
                    'Model query:',
                    { message: queryStr }
                );
            }
            const error = {
                code: 500,
                message: 'check query'
            };
            return {
                success: false,
                error
            };
        } finally {
            client.release();
        }
    }
    
    async getSessionsForStart () {
        const client = await pool.connect();
        const queryStr = `SELECT
                    id,
                    user_id,
                    auth_provider_id,
                    auth_provider_access_token,
                    auth_provider_expiration_time,
                    auth_provider_expires_in
                FROM data.get_live_sessions_scheduled('${moment().format('YYYY-MM-DD')}', '${moment().format('HH:mm:ss')}');`;
        try {
            const query = await client.query(queryStr);
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Live Sessions):',
                    { message: e.message }
                );
                logger.log(
                    'error',
                    'Model query:',
                    { message: queryStr }
                );
            }
            const products = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                products,
                error
            };
        } finally {
            client.release();
        }
    }
    
    async launchedSession(sessionId) {
        const client = await pool.connect();
        try {
            const query = await client.query(
                `UPDATE data.live_sessions SET launched=true WHERE id=${sessionId}`
            );
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Launched session):',
                    { message: e.message }
                );
            }
            const products = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                products,
                error
            };
        } finally {
            client.release();
        }
    }
    
    async launchedForStopSession() {
        const client = await pool.connect();
        try {
            const query = await client.query(
                `SELECT data.live_sessions.id WHERE video_id IS NOT NULL AND launched=true`
            );
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Products getAll):',
                    { message: e.message }
                );
            }
            const products = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                products,
                error
            };
        } finally {
            client.release();
        }
    }
    
    
    async getAllActive () {
        const client = await pool.connect();
        const query = await client.query(
            `SELECT data.live_sessions.*, u.auth_provider_access_token FROM data.live_sessions LEFT JOIN data.users u ON u.id = user_id WHERE video_id IS NOT NULL AND launched IS NULL`
        );
        console.log(            `SELECT data.live_sessions.*, u.auth_provider_access_token FROM data.live_sessions LEFT JOIN data.users u ON u.id = user_id WHERE video_id IS NOT NULL AND launched IS NULL`
        );
        try {
            const error = null;
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result,
                error
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    `Model error (Live Session getAllActive): ${query}`,
                    { message: e.message }
                );
            }
            const result = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                result,
                error
            };
        } finally {
            client.release();
        }
    }
    
    async getAll (page, perPage = 20, userId, reqOffset = null) {
        const client = await pool.connect();
        try {
            const _total = await client.query(
                `SELECT * FROM common__tools._select_total_from_table_by_where('data', 'live_sessions', 'id', 'user_id = ''${userId}''');`
            );
            const size = _total.rows[0].total;
            let offset;
            if (reqOffset) {
                offset = reqOffset;
            } else {
                offset = (Number(page) - 1) * Number(perPage);
            }
            
            const productQuery = `SELECT * FROM data.live_sessions WHERE user_id='${userId}' ORDER BY event_date DESC, event_time DESC limit ${perPage} OFFSET ${offset}`;
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
                    'Model error (Products getAll)1:',
                    { message: e.message }
                );
            }
            const products = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                products,
                error
            };
        } finally {
            client.release();
        }
    }
    
    
    async fetchOne(userId, itemId) {
        const client = await pool.connect();
        try {
            const res = await client.query(`SELECT * FROM data.live_sessions WHERE user_id=${userId} AND id=${itemId}`);
            if (res.rows[0].product) {
                res.rows[0].product = JSON.parse(res.rows[0].product);
            }
            res.rows[0].answer_count = !res.rows[0].answer_count ? '' : res.rows[0].answer_count;
            res.rows[0].discount = !res.rows[0].discount ? '' : res.rows[0].discount;
            return { item: res.rows[0] };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Session fetch one):',
                    { message: e.message }
                );
            }
            const item = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                item,
                error
            };
        } finally {
            client.release();
        }
    }
    
    async create (userId, data) {
        const client = await pool.connect();
        
        const scenariosRes = await client.query(`SELECT ARRAY_AGG(id) AS ids FROM data.chatbot_scenarios WHERE user_id = ${userId}`);
        const settings = await client.query(`SELECT order_timer, free_shipping_timer, free_shipping_status, user_id
                            FROM data.seller_settings WHERE user_id=${userId};`);
        let intervalDuration;
        const timeValue = settings.rows[0].order_timer.hours ? settings.rows[0].order_timer.hours: settings.rows[0].order_timer.days;
        const type = settings.rows[0].order_timer.hours ? 'h': 'd';
        if (type === 'h') {
            intervalDuration = `${timeValue} hour${timeValue > 1 ? 's' : ''}`;
        } else {
            intervalDuration = `${timeValue} day${timeValue > 1 ? 's' : ''}`;
        }
        
        const query =  `INSERT INTO data.live_sessions (user_id, event_date, event_time, scenarios, status, order_timer)
                VALUES (${userId}, '${data.event_date}', '${data.event_time}',
                    '{${scenariosRes.rows[0].ids}}', 'scheduled', '${intervalDuration}'
                );`;
        try {
            await client.query(query);
            return { success: true };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Chatbot update):',
                    { message: e.message }
                );
            }
            const item = null;
            const error = {
                code: 500,
                message: 'Error update chatbot_scenarios'
            };
            return {
                success: false,
                error,
                item
            };
        } finally {
            client.release();
        }
    }
    
    async update (userId, data) {
        const client = await pool.connect();
        try {
            const itemId = data.id;
            // delete data.id;
            const query =  `UPDATE data.chatbot_scenarios SET
                                name = $$${data.name}$$,
                                keywords = $$${data.keywords}$$,
                                answer_count=${data.answer_count ? data.answer_count : null},
                                product='${data.product ? JSON.stringify(data.product) : ''}',
                                discount=${data.discount ? data.discount : null},
                                message_fr = regexp_replace($$${data.message_fr}$$, '\\\\n+', E'\\n', 'g' ),
                                message_en = regexp_replace($$${data.message_en}$$, '\\\\n+', E'\\n', 'g' )
                            WHERE id=${itemId} AND user_id=${userId}
                `;
            await client.query(query);
            return { success: true };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Chatbot update):',
                    { message: e.message }
                );
            }
            const item = null;
            const error = {
                code: 500,
                message: 'Error update chatbot_scenarios'
            };
            return {
                success: false,
                error,
                item
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
    
    async changeActive(itemId, userId) {
        const client = await pool.connect();
        try {
            await client.query(`UPDATE data.chatbot_scenarios SET active = NOT active WHERE id=${itemId} AND user_id=${userId}`);
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
    
    async changeAllActive(status, userId) {
        const client = await pool.connect();
        try {
            await client.query(`UPDATE data.chatbot_scenarios SET active = ${status} WHERE user_id=${userId}`);
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

export default new Livesession();
