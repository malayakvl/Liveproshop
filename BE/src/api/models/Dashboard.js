import pool from './connect.js';
import { logger } from '../../common/logger.js';
import { OrderStatus, UserRole } from '../../constants/index.js';

class Dashboard {

    async fetchItems (perPage = 25, reqOffset = null, filters, user, column, sort) {
        const client = await pool.connect();

        let orders = [];
        let buyers = [];
        let totals = [];
        let error = null;

        try {
            const _filters = JSON.parse(filters);

            switch (user.role_id) {
                case UserRole.ADMIN:
                    break;
                case UserRole.CUSTOMER:
                    _filters.seller_id = [user.id];
                    if (_filters.userIds) {
                        _filters.buyer_id = _filters.userIds;
                        delete _filters.userIds;
                    }
                    break;
                case UserRole.BUYER:
                    _filters.buyer_id = [user.id];
            }

            let offset;
            if (reqOffset) {
                offset = reqOffset;
            } else {
                offset = (Number(page) - 1) * Number(perPage);
            }
            // console.log('[Dashboard.fetchItems] _filters =', _filters);

            if (user.role_id !== UserRole.BUYER) {
                let querySQL = `SELECT * FROM data.get_buyers(${perPage}, ${offset}, '${JSON.stringify(_filters)}', 'first_name ASC');`; //'${column} ${sort}'
                // console.log('[Dashboard.fetchItems] buyersQuery = ', querySQL);
                let res = await client.query(querySQL);
                buyers = res.rows.length > 0 ? res.rows : [];
            }

            const _orderFilters = { ..._filters };

            if (!_orderFilters.status?.length) {
                switch (user.role_id) {
                    case UserRole.ADMIN:
                    case UserRole.CUSTOMER:
                        _orderFilters.status = [OrderStatus.PAYED, OrderStatus.SHIPPED, OrderStatus.CANCELED];
                        break;
                    case UserRole.BUYER:
                        // _orderFilters.status = [OrderStatus.NEW, OrderStatus.PAYED, OrderStatus.SHIPPED, OrderStatus.CANCELED]
                }
            }

            let querySQL = `SELECT
                    *
                FROM data.get_orders(${perPage}, ${offset}, '${JSON.stringify(_orderFilters)}', '${column} ${sort}');`; // 'created_at DESC'
            // console.log('[Dashboard.fetchItems] ordersQuery = ', querySQL);
            let res = await client.query(querySQL);
            orders = res.rows.length > 0 ? res.rows : [];
            
            querySQL = `SELECT dashboard_total FROM data.get_dashboard_total('${JSON.stringify(_filters)}');`;
            // console.log('[Dashboard.fetchItems] totalsQuery = ', querySQL);
            res = await client.query(querySQL);
            totals = res.rows.length > 0 ? res.rows[0].dashboard_total : [];

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Dashboard getAll):',
                    { message: e.message }
                );
            }
            // console.log('[Dashboard.fetchItems] error.message = ', e.message);
            error = {
                code: 500,
                message: 'Error get Dashboard data'
            };

        } finally {
            client.release();
            
            return {
                orders,
                buyers,
                totals,
                error
            };
        }
    }
}

export default new Dashboard();
