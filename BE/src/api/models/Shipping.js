import pool from './connect.js';
import { logger } from '../../common/logger.js';

class Shipping {
    async fetchAll(userId) {
        const client = await pool.connect();
        try {
            // const query = `
            //     SELECT
            //         s.id,
            //         s.name,
            //         s.image,
            //         s.status,
            //         s.created_at,
            //         s2c.shipping_to_country__info AS countries
            //         FROM data.shipping s LEFT JOIN LATERAL (
            //             SELECT
            //                 s.id AS shipping_id,
            //                 json_agg(
            //                     json_build_object(
            //                         'country_id', s2c.country_id,
            //                         'price', s2c.price
            //                     )
            //                 ) AS shipping_to_country__info
            //             FROM data.shipping_to_country s2c
            //             WHERE TRUE
            //                 AND (s2c.user_id = ${userId})
            //                 AND (s2c.shipping_id = s.id)
            //             GROUP BY
            //                 s.id
            //         ) s2c ON (s.id = s2c.shipping_id)
            // `
            const query = `SELECT * FROM data.get_shipping_by_user(${userId})`;
            const res = await client.query(query);
            return res.rows.length ? res.rows : null;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Shippings Not found' } };
        } finally {
            client.release();
        }
    }

    async fetchCustomerAll(userId) {
        const client = await pool.connect();
        try {
            // const query = `
            //     SELECT
            //     s.id,
            //     s.name,
            //     s.image,
            //     (
            //         s.status
            //         AND
            //         NOT EXISTS (
            //             SELECT
            //                 cds.id
            //             FROM data.customer_disabled_shipping cds
            //             WHERE TRUE
            //                 AND (cds.user_id = ${userId})
            //                 AND (cds.shipping_id = s.id)
            //         )
            //     ) AS status,
            //     s.created_at,
            //     COALESCE(s2c.shipping_to_country__info, '[]'::json) AS countries
            // FROM data.shipping s LEFT JOIN LATERAL (
            //     SELECT
            //         s.id AS shipping_id,
            //         json_agg(
            //             json_build_object(
            //                 'country_id', s2c.country_id,
            //                 'price', s2c.price,
            //                 'iso', c.iso
            //             )
            //         ) AS shipping_to_country__info
            //     FROM data.shipping_to_country s2c
            //     LEFT JOIN data.countries c
            //         ON c.id = s2c.country_id
            //     WHERE TRUE
            //         AND (s2c.user_id = ${userId})
            //         AND (s2c.shipping_id = s.id)
            //     GROUP BY
            //         s.id
            // ) s2c ON (s.id = s2c.shipping_id)
            // ;
            // `
            const query = `SELECT
                                id, name, image, status, status__customer_disabled_shipping, countries, created_at
                            FROM data.get_shipping_by_user(${userId});`;
            const res = await client.query(query);

            return res.rows

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Shippings Not found' } };
        } finally {
            client.release();
        }

    }

    async create(name, image) {
        const client = await pool.connect();
        try {
            const queryInsert =
                `INSERT INTO data.shipping (name, image, status) VALUES ($1, $2, $3) RETURNING id;`;
            const res = await client.query(queryInsert, [name, image, false]);
            return res.rows[0].id;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Shipping error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Tags Not found' } };
        } finally {
            client.release();
        }

    }

    async findByName(name) {
        const client = await pool.connect();
        try {
            const query = 'SELECT * FROM data.shipping WHERE name = $1';
            const res = await client.query(query, [name]);
            return res.rows.length ? res.rows[0] : null
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Shipping Not found' } };
        } finally {
            client.release();
        }

    }

    async findById(id) {
        const client = await pool.connect();
        try {
            const query = `SELECT * FROM data.shipping WHERE id = $1`;
            const res = await client.query(query, [id]);
            return res.rows.length ? res.rows[0] : null
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Shipping Not found' } };
        } finally {
            client.release();
        }
    }

    async update(id, name, image) {
        const client = await pool.connect();
        try {
            const queryInsert =
                `UPDATE data.shipping SET name = $1, image = $2 WHERE id = $3 RETURNING id`;
            const res = await client.query(queryInsert, [name, image, id]);

            return res.rows[0].id;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Shipping error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Tags Not found' } };
        } finally {
            client.release();
        }

    }

    async delete(id) {
        const client = await pool.connect();
        try {
            const queryInsert =
                `DELETE FROM data.shipping WHERE id = $1`;
            await client.query(queryInsert, [id]);

            return true;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Shipping error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Tags Not found' } };
        } finally {
            client.release();
        }
    }

    async findCountriesById(id, userId) {
        const client = await pool.connect();
        try {
            const res = await client.query(
                'SELECT country_id AS id, price FROM data.shipping_to_country WHERE shipping_id = $1 AND user_id = $2', [id, userId]
            );

            return res.rows;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Shipping error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Tags Not found' } };
        } finally {
            client.release();
        }
    }

    async saveCountries(userId, shippingId, countries) {
        const client = await pool.connect();
        try {
            await client.query('DELETE FROM data.shipping_to_country WHERE user_id = $1 AND shipping_id = $2', [userId, shippingId]);
            countries.forEach((country) => {
                client.query(
                    'INSERT INTO data.shipping_to_country (user_id, shipping_id, country_id, price) VALUES ($1, $2, $3, $4)',
                    [userId, shippingId, country.id, country.price]
                )
            })

            return true;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Shipping error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Tags Not found' } };
        } finally {
            client.release();
        }

    }

    async changeStatuses(status) {
        const client = await pool.connect();
        try {
            const queryInsert =
                `UPDATE data.shipping SET status = $1 RETURNING id`;
            const res = await client.query(queryInsert, [status]);

            return res.rows[0].id;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Shipping error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Tags Not found' } };
        } finally {
            client.release();
        }

    }

    async changeCustomerStatuses(status, userId) {
        const shippings = await this.fetchCustomerAll(userId)

        for (const shipping of shippings) {
            await this.changeCustomerStatus(status, userId, shipping.id)

        }

    }

    async changeCustomerStatus(status, customerId, shippingId) {
        const client = await pool.connect();
        try {
            let query =
                'DELETE FROM data.customer_disabled_shipping WHERE user_id = $1 AND shipping_id = $2';

            if (!status) {
                query =
                    'INSERT INTO data.customer_disabled_shipping(user_id, shipping_id) VALUES($1, $2)';
            }

            await client.query(query, [customerId, shippingId]);

            return true
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Shipping error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Tags Not found' } };
        } finally {
            client.release();
        }
    }

    async changeStatus(status, shippingId) {
        const client = await pool.connect();
        try {
            const queryInsert =
                `UPDATE data.shipping SET status = $1 WHERE id = $2 RETURNING id`;
            const res = await client.query(queryInsert, [status, shippingId]);

            return res.rows[0].id;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Shipping error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Tags Not found' } };
        } finally {
            client.release();
        }

    }

    async setThreshold(userId, threshold) {
        const client = await pool.connect();
        try {
            await client.query('DELETE FROM data.free_order_threshold WHERE user_id = $1', [userId]);
            client.query(
                'INSERT INTO data.free_order_threshold (user_id, threshold) VALUES ($1, $2)',
                [userId, threshold]
            )

            return true;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Shipping error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Tags Not found' } };
        } finally {
            client.release();
        }
    }

    async fetchThreshold(userId) {
        const client = await pool.connect();
        try {
            const res = await client.query(
                'SELECT threshold FROM data.free_order_threshold WHERE user_id = $1', [userId]
            );

            if (res.rows.length) {
                return res.rows[0];
            }

            return false;

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Shipping error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Tags Not found' } };
        } finally {
            client.release();
        }
    }
}

export default new Shipping();
