import pool from './connect.js';
import { logger } from '../../common/logger.js';

class Seller {
    async fetchItems(page, perPage = 20, user, isRead = false, reqOffset = null, filters, column, sort) {
        const client = await pool.connect();
        try {
            const _filters = JSON.parse(filters);
            if (user.role_id === 2) {
                _filters.seller_id = [user.id];
                if (_filters.userIds) {
                    _filters.buyer_id = _filters.userIds;
                    delete _filters.userIds;
                }
            }
            const _total = await client.query(`SELECT count FROM data.get_sellers_count('${JSON.stringify(_filters)}');`);
            const size = _total.rows[0].count;
            // const size = 12;
            let offset;
            if (reqOffset) {
                offset = reqOffset;
            } else {
                offset = (Number(page) - 1) * Number(perPage);
            }
            
            const ordersQuery = `SELECT * FROM data.get_sellers(${perPage}, ${offset}, '${JSON.stringify(_filters)}', '${column} ${sort}');`;
            const res = await client.query(ordersQuery);
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
                console.log('[Seller.fetchItems] e.message = ', e.message);
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
    
    async fetchFilters () {
        const client = await pool.connect();
        try {
            const res = {};
            const countries = await client.query('SELECT * FROM data.get_sellers_countries();');
            res.countries = countries.rows[0].countries ? countries.rows[0].countries : [];
            const amounts = await client.query('SELECT total_amount_range FROM data.get_sellers_total_amount_range();');
            res.amounts = amounts.rows[0].total_amount_range.max ? [amounts.rows[0].total_amount_range.min, amounts.rows[0].total_amount_range.max] : [];
            const sessions = await client.query('SELECT total_sessions_range FROM data.get_sellers_total_sessions_range();');
            res.total_sessions = sessions.rows[0].total_sessions_range.max ? [sessions.rows[0].total_sessions_range.min, sessions.rows[0].total_sessions_range.max] : [];
            const buyer = await client.query('SELECT total_buyers_range FROM data.get_sellers_total_buyers_range();');
            res.total_buyers = buyer.rows[0].total_buyers_range.max ? [buyer.rows[0].total_buyers_range.min, buyer.rows[0].total_buyers_range.max] : [];
            const orders = await client.query('SELECT total_orders_range FROM data.get_sellers_total_orders_range();');
            res.total_orders = orders.rows[0].total_orders_range.max ? [orders.rows[0].total_orders_range.min, orders.rows[0].total_orders_range.max] : [];
            const error = null;
            return {
                res,
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
    
    async getSellerPercentHistory(emailSeller) {
        const client = await pool.connect();
        try {
            const resUser = await client.query(`SELECT id FROM data.users WHERE email='${emailSeller.toLowerCase()}'`);
            if (resUser.rows.length > 0) {
                const query = `SELECT * FROM data.sellers_persent_history WHERE user_id=${resUser.rows[0].id} ORDER BY created_at DESC`;
                const items = await client.query(query);
                return {res: items.rows, error: null };
            } else {
                const res = [];
                const error = {
                    code: 500,
                    message: 'Error get list of users'
                };
                return {
                    res,
                    error
                };
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Products getAll):',
                    { message: e.message }
                );
            }
            const res = [];
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                res,
                error
            };
        } finally {
            client.release();
        }
    }
    
    
    async updatePercent(data) {
        const client = await pool.connect();
        try {
            let res = false;
            const resUser = await client.query(`SELECT id FROM data.users WHERE email='${data.email.toLowerCase()}'`);
            if (resUser.rows.length > 0) {
                const sellerSettingsResPrev = await client.query(`SELECT * FROM data.seller_settings WHERE user_id=${resUser.rows[0].id};`);
                const query = `INSERT INTO data.seller_settings(user_id, transaction_percent)
                                    VALUES (${resUser.rows[0].id}, '${data.transaction_percent}')
                                    ON CONFLICT ON CONSTRAINT seller_settings__pkey DO UPDATE SET
                                        transaction_percent = EXCLUDED.transaction_percent
                                    ;`;
                let prevPersent = 0;
                if (sellerSettingsResPrev.rows.length) {
                    prevPersent = sellerSettingsResPrev.rows[0].transaction_percent;
                }
                const queryHistory = `INSERT INTO data.sellers_persent_history (user_id, percent_prev, percent_next) VALUES
                    (${resUser.rows[0].id}, ${prevPersent}, ${data.transaction_percent})`;
                await client.query(query);
                await client.query(queryHistory);
                res = true;
            }
            
            return {
                res
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
}



export default new Seller();
