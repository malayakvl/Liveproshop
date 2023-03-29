import crypto from 'crypto';
import pool from './connect.js';
import { logger } from '../../common/logger.js';

class Invitation {
    async create(userData) {
        let email = userData.email;
        let role_id = userData.role_id;
        let hash = crypto.randomBytes(20).toString('hex');

        const client = await pool.connect();
        try {
            await client.query(`
                INSERT INTO data.invitations
                (
                    email, 
                    role_id, 
                    hash
                )
                VALUES
                (
                    '${email}',
                    '${role_id}',
                    '${hash}'
                )
                ;
            `);

            return await this.findByEmail(email);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }

            return { user: null, error: { code: 404, message: 'Something went wrong' } };

        } finally {
            client.release();

        }
    }

    async findByEmail(email) {
        const client = await pool.connect();
        try {
            const res = await client.query(`SELECT * FROM data.invitations WHERE email = '${email.toLowerCase()}';`);
            if (res.rows.length) {
                return res.rows[0];
                
            } else {
                return null;

            }
            
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }

            throw new Error(e);

        } finally {
            client.release();
        }

    }

    async findByHash(hash) {
        const client = await pool.connect();
        try {
            const res = await client.query(`SELECT * FROM data.invitations WHERE hash = '${hash}';`);
            if (res.rows.length) {
                return res.rows[0];
                
            } else {
                return null;

            }
            
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }

            throw new Error(e);

        } finally {
            client.release();
        }

    } 

    async deactivate(id) {
        const client = await pool.connect();
        try {
            const res = await client.query(`UPDATE data.invitations SET active = ${false} WHERE id = ${id}`);
            if (res.rows.length) {
                return res.rows[0];
                
            } else {
                return null;

            }
            
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }

            throw new Error(e);

        } finally {
            client.release();
        }

    }

    async delete(id) {
        const client = await pool.connect();
        try {
            await client.query(`DELETE FROM data.invitations WHERE id = ${id}`);
            
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }

            throw new Error(e);

        } finally {
            client.release();
        }

    }

}

export default new Invitation()
