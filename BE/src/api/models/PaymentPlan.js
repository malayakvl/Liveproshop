import pool from './connect.js';
import { logger } from '../../common/logger.js';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_API_KEY);

class PaymentPlan {
    async fetchItems () {
        const client = await pool.connect();
        try {
            const query = 'SELECT fields_json FROM data.get_subscription_plans_to_options_list();';
            const res = await client.query(query);
            return res.rows.length ? res.rows[0].fields_json : [];
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Country Not found' } };
        } finally {
            client.release();
        }
    }
    
    
    async fetchSettings () {
        const client = await pool.connect();
        try {
            const query = 'SELECT * FROM data.system_settings WHERE id=1';
            const res = await client.query(query);
            return res.rows.length ? res.rows[0] : [];
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error(fetchSettings):',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Settings not found' } };
        } finally {
            client.release();
        }
    }
    
    async changeStatus(data) {
        const client = await pool.connect();
        try {
            const query = `UPDATE data.subscription_plans_to_options SET value= NOT value WHERE option_id=${data.optionId} AND plan_id=${data.planId}`;
            await client.query(query);
            
            return { success: true };
            // const res = await client.query(query);
            // return res.rows.length ? res.rows[0].fields_json : [];
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Country Not found' } };
        } finally {
            client.release();
        }
    }
    
    async fetchInfo(planId) {
        const client = await pool.connect();
        try {
            const query = `SELECT * FROM data.subscription_plans WHERE id=${planId}`;
            const res = await client.query(query);
            if (res.rows.length > 0) {
              if (res.rows[0].stripe_id) {
                  const price = await stripe.prices.retrieve(
                      res.rows[0].stripe_id
                  );
                  res.rows[0].stripeInfo = price;
                  return { success: true, planInfo: res.rows[0] };
              } else {
                  return { success: false, planInfo: null };
              }
            } else {
                return { success: false, planInfo: null };
            }
            
            // const res = await client.query(query);
            // return res.rows.length ? res.rows[0].fields_json : [];
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Country Not found' } };
        } finally {
            client.release();
        }
    }
    
    async syncPrices(data, sripeProducts, stripePrices) {
        const client = await pool.connect();
        try {
            const query = `SELECT * FROM data.subscription_plans`;
            await client.query(`UPDATE data.system_settings SET trial_period='${data.trial_period}',
                                    support_email=$$${data.support_email}$$,
                                    multisafe_api_key=$$${data.multisafe_api_key}$$,
                                    multisafe_account=$$${data.multisafe_account}$$ WHERE id='1'`);
            
            const res = await client.query(query);
            const promisesQuery = [];
            if (res.rows.length) {
                res.rows.forEach(plan => {
                    if (data[`plan_stripe_${plan.id}`]) {
                        const price = (stripePrices.data.filter(price => price.id === data[`plan_stripe_${plan.id}`]));
                        if (price.length) {
                            promisesQuery.push(client.query(`UPDATE data.subscription_plans SET stripe_id='${price[0].id}', price=${price[0].unit_amount/100} WHERE id=${plan.id}`));
                        }
                    }
                });
                await Promise.all(promisesQuery);
                return { success: true };
            }
            return { success: false, error: { code: 404, message: 'Country Not found' } };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Country Not found' } };
        } finally {
            client.release();
        }
    }
}

export default new PaymentPlan();
