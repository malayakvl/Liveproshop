import pool from './connect.js';
import { logger } from '../../common/logger.js';

class Buyer {

    async fetchItems (page, perPage = 25, user, isRead = false, reqOffset = null, filters, column, sort) {
        const client = await pool.connect();
        try {
            // const sellerIds = [];
            // const buyerIds = [];
            // console.log('filters = ', filters);
            const _filters = JSON.parse(filters);
            // console.log(_filters);
            // create main filters for sellet
            if (user.role_id === 2) {
                // sellerIds.push(user.id);
                _filters.seller_id = [user.id];
                if (_filters.userIds) {
                    _filters.buyer_id = _filters.userIds;
                    delete _filters.userIds;
                }
            }
            const totalQuery = `SELECT count FROM data.get_buyers_count('${JSON.stringify(_filters)}');`;
            const _total = await client.query(totalQuery);
            // console.log(totalQuery);

            const size = _total.rows[0].count;
            let offset;
            if (reqOffset) {
                offset = reqOffset;
            } else {
                offset = (Number(page) - 1) * Number(perPage);
            }
            // console.log('_filters =', _filters);
            const buyersQuery = `SELECT * FROM data.get_buyers(${perPage}, ${offset}, '${JSON.stringify(_filters)}', '${column} ${sort}');`;
            // console.log(buyersQuery);
            const res = await client.query(buyersQuery);
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
                    'Model error (Buyers.fetchItems):',
                    { message: e.message }
                );
            }
            console.log('[Buyers.fetchItems] e.message = ', e.message);
            const items = null;
            const error = {
                code: 500,
                message: 'Error get list of Buyers'
            };
            return {
                items,
                error
            };
        } finally {
            client.release();
        }
    }


    async fetchItem (user, filters) {
        const client = await pool.connect();
        try {
            // const sellerIds = [];
            // const buyerIds = [];
            // console.log('filters = ', filters);
            const _filters = JSON.parse(filters);
            // console.log(_filters);
            // create main filters for sellet
            if (user.role_id === 2) {
                _filters.seller_id = [user.id];
                delete _filters.userIds;
            }

            // console.log('_filters =', _filters);
            const buyersQuery = `SELECT * FROM data.get_buyers(1, 0, '${JSON.stringify(_filters)}');`;
            // console.log(buyersQuery);
            const res = await client.query(buyersQuery);
            const item = res.rows.length > 0 ? res.rows[0] : {};
            const error = null;
            
            return {
                item,
                error
            };

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Buyers.fetchItem):',
                    { message: e.message }
                );
            }
            console.log('[Buyers.fetchItem] e.message = ', e.message);
            const item = null;
            const error = {
                code: 500,
                message: 'Error get Buyer'
            };
            return {
                item,
                error
            };
        } finally {
            client.release();
        }
    }


    async fetchFilters (userId) {
        const client = await pool.connect();
        try {
            const _filters = {
                seller_id: [userId]
            };
            
            // console.log(_filters);
           
            const res = {};
            const countries = await client.query(`SELECT * FROM data.get_buyers_countries('${JSON.stringify(_filters)}');`);
            res.countries = countries.rows[0].countries ? countries.rows[0].countries : [];
            const amounts = await client.query(`SELECT * FROM data.get_buyers_total_amount_range('${JSON.stringify(_filters)}');`);
            res.amounts = amounts.rows[0].total_amount_range.min ? [amounts.rows[0].total_amount_range.min, amounts.rows[0].total_amount_range.max] : [];
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
}

export default new Buyer();
