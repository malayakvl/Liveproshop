import pool from './connect.js';
import { logger } from '../../common/logger.js';

class Chatbot {
    async getAllSystem() {
        const client = await pool.connect();
        try {
            const _total = await client.query(
                `SELECT * FROM common__tools._select_total_from_table_by_where('data', 'system_chatbot_scenarios', 'id');`
            );
            const size = _total.rows[0].total;
            const productQuery = `SELECT * FROM data.system_chatbot_scenarios ORDER BY id`;
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
                    'Model error (Products getAll):',
                    { message: e.message }
                );
            }
            const items = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                items,
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
                `SELECT * FROM common__tools._select_total_from_table_by_where('data', 'chatbot_scenarios', 'id', 'user_id = ''${userId}''');`
            );
            const size = _total.rows[0].total;
            let offset;
            if (reqOffset) {
                offset = reqOffset;
            } else {
                offset = (Number(page) - 1) * Number(perPage);
            }
            
            const productQuery = `SELECT * FROM data.chatbot_scenarios WHERE user_id='${userId}' ORDER BY created_at DESC limit ${perPage} OFFSET ${offset}`;
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
                    'Model error (Chatbot getAll):',
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
            const res = await client.query(`SELECT * FROM data.chatbot_scenarios WHERE user_id=${userId} AND id=${itemId}`);
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
                    'Model error (Chatbot fetch one):',
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
        const query =  `INSERT INTO data.chatbot_scenarios (user_id, name, keywords, message_fr, message_en, active, answer_count, product, discount)
                VALUES (${userId}, $$${data.name}$$, $$${data.keywords}$$,
                    regexp_replace($$${data.message_fr}$$, '\\\\n+', E'\\n', 'g' ),
                    regexp_replace($$${data.message_en}$$, '\\\\n+', E'\\n', 'g' ),
                    true,
                    ${data.answer_count ? data.answer_count : null},
                    '${data.product ? JSON.stringify(data.product) : ''}',
                    ${data.discount ? data.discount : null}
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
                message: e.message
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
    
    async updateDefault (userId, data) {
        const client = await pool.connect();
        try {
            const itemId = data.id;
            // delete data.id;
            const query =  `UPDATE data.system_chatbot_scenarios SET
                                message_fr = regexp_replace($$${data.translationFr}$$, '\\\\n+', E'\\n', 'g' ),
                                message_en = regexp_replace($$${data.translationEn}$$, '\\\\n+', E'\\n', 'g' )
                            WHERE id=${itemId}
                `;
            // console.log(query);
            await client.query(query);
            // await client.query(`SELECT * FROM common__tools._update_table_by_where(
            //     'data',
            //     'chatbot_scenarios',
            //     '${JSON.stringify(data)}',
            //     'user_id = ''${userId}'' AND id = ''${itemId}''')`);
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
            // await client.query(`SELECT * FROM common__tools._update_table_by_where(
            //     'data',
            //     'chatbot_scenarios',
            //     '${JSON.stringify(data)}',
            //     'user_id = ''${userId}'' AND id = ''${itemId}''')`);
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

export default new Chatbot();
