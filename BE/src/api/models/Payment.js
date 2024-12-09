import pool from './connect.js';
import { logger } from '../../common/logger.js';
import axios from "axios";

class Payment {
    async fetchItems (page, perPage = 20, user, isRead = false, reqOffset = null, filters, column, sort) {
        const client = await pool.connect();
        try {
            // const sellerIds = [];
            // const buyerIds = [];
            const _filters = JSON.parse(filters);
            // console.log(_filters);
            // create main filters for seller
            if (user.role_id === 2) {
                _filters.seller_id = [user.id];
                if (_filters.shopper_id) {
                    _filters.buyer_id = _filters.shopper_id;
                    delete _filters.userIds;
                }
            }
            const _total = await client.query(`SELECT count FROM data.get_orders_count('${JSON.stringify(_filters)}');`);
            const size = _total.rows[0].count;
            let offset;
            if (reqOffset) {
                offset = reqOffset;
            } else {
                offset = (Number(page) - 1) * Number(perPage);
            }
            // console.log('_filters =', _filters);
            const ordersQuery = `SELECT *
                                FROM data.get_orders (${perPage}, ${offset}, '${JSON.stringify(_filters)}', '${column} ${sort}');`; // 'orders.created_at DESC'
            // console.log(ordersQuery);
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

    async fetchItem (orderNumber, userId, queryFilter, column, sort) {
        const client = await pool.connect();

        let item = null;
        let error = null;
        try {
            const filter = JSON.stringify({
                status: ["payed"],
                seller_id: userId,
                order_number: orderNumber,
            });

            const ordersQuery = `SELECT *
                                FROM data.get_orders (1, 0, '${filter}');`;
console.log(ordersQuery);
            const res = await client.query(ordersQuery);
            item = res.rows.length > 0 ? res.rows[0] : [];

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Products getAll):',
                    { message: e.message }
                );
            }
            error = {
                code: 500,
                message: 'Error get list of users'
            };
        } finally {
            client.release();
            return {
                item,
                error
            };
        }
    }

    async fetchMethods (userId) {
        const client = await pool.connect();

        let methods = null;
        let error = null;

        try {
            const sellerApiData = await client.query(`SELECT * FROM data.seller_settings WHERE user_id=${userId}`);
            const multiMethods = await axios
                .get(`${process.env.MULTISAFEPAY_URL}/payment-methods?api_key=${sellerApiData.rows[0].multisafe_api_key}`, {}, {
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(async (res) => {
                    // console.log('DATA SABRINA', res.data);
                    return {'success': true, paymentData: res.data.data}
                }).catch(error => {
                    console.log(error.message)
                    return {error: error.message}
                });

            return { success: true, paymentData: multiMethods.paymentData }

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            error = {
                code: 500,
                message: 'Error get list of payment methods'
            };
        }
    }

    async changeMethodsStatuses(methods, userId) {
        const client = await pool.connect();

        let result = false;
        let error = null;

        try {
            await client.query('BEGIN');

            for (const method of methods) {
                const querySQL = 'UPDATE data.payments_to_users SET status = $1 WHERE payment_id = $2 AND user_id = $3';
                await client.query(querySQL, [method.status, method.payment_id, userId]).querySQL;
            }
            
            await client.query('COMMIT');

            result = true;

          } catch (e) {
            await client.query('ROLLBACK');

            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Shipping error:',
                    { message: e.message }
                );
            }

            error = {
                code: 500,
                message: 'Error update payment methods status'
            };

          } finally {
            client.release();
            return { result, error };
          }

    }

    async fetchFilters (user) {
        const client = await pool.connect();

        const filter = '\'{"status":["payed"]}\'';
        let res = {};
        let error = null;

        const _filterBuyers = {};
        if (user.role_id === 2) {
            // sellerIds.push(user.id);
            _filterBuyers.seller_id = [user.id];
            if (_filterBuyers.userIds) {
                _filterBuyers.seller_id = _filters.userIds;
                delete _filterBuyers.userIds;
            }
        }
        // const buyersQuery = `SELECT * FROM data.get_buyers(10000, 0, '${JSON.stringify(_filterBuyers)}', '${column} ${sort}');`;

        const ordersQueryBuyers = await client.query(`SELECT * FROM data.get_buyers(100000, 0, '${JSON.stringify(_filterBuyers)}', 'first_name ASC');`); // 'orders.created_at DESC'
        res.buyers =  ordersQueryBuyers.rows;

        try {
            const payments = await client.query(`SELECT * FROM data.get_orders_payments(${filter});`);
            res.payments = payments.rows[0].payments ? payments.rows[0].payments : [];

            const amounts = await client.query(`SELECT * FROM data.get_orders_total_amount_range(${filter});`);
            res.amounts = amounts.rows[0].total_amount_range.min ? [amounts.rows[0].total_amount_range.min, amounts.rows[0].total_amount_range.max] : [];

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.log('[fetchFilters] pgSQL error.message = ', e.message);
                logger.log(
                    'error',
                    'Model error (Products getAll):',
                    { message: e.message }
                );
            }
            error = {
                code: 500,
                message: 'Error get list of users'
            };

        } finally {
            client.release();
            return { res, error };
        }
    }
}

export default new Payment();
