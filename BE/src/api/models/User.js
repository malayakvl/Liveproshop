import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pool from './connect.js';
import { logger } from '../../common/logger.js';
import Stripe from 'stripe';
import moment from "moment";
import paymentPlanModel from "./PaymentPlan.js";
import { confirmSubscriptionEmail, confirmSubscriptionPaymentEmail } from "../sender/templates.js";
import { sendMail } from "../lib/sendMail.js";

const stripe = Stripe(process.env.STRIPE_API_KEY);
/**
 * User model
 */
class User {
    /**
     * Find user by email
     *
     * @param email - string
     * @param isDeleted - boolean
     * @returns {Promise<any|null>}
     */
    async findUserByEmail(email, isDeleted = false) {
        const client = await pool.connect();
        try {
            // const res = await client.query(`SELECT * FROM data.users WHERE email = '${email.toLowerCase()}'`);
            const res1 = await client.query(`SELECT fields_json FROM data.find_user_by_email('${email.toLowerCase()}', '3.5 hours');`);
            if (res1.rows[0].fields_json) {
                res1.rows[0].subscription_expired = false;
                if (res1.rows[0].fields_json.role_id === 2) {
                    if (res1.rows[0].fields_json.customer_id && (res1.rows[0].fields_json.period_left === null || res1.rows[0].fields_json.period_left < 0)) {
                        try {
                            const subscription = await stripe.subscriptions.retrieve(res1.rows[0].fields_json.subscription_id);
                            // update subscription period
                            // await client.query(`SELECT
                            //                         *
                            //                     FROM data.set_subscriptions_period_end(
                            //                         '${subscription.status}',
                            //                         ${subscription.current_period_end},
                            //                         '${JSON.stringify({subscription_id: subscription.id})}'
                            //                     );`);
                            if (subscription.current_period_end > moment().unix()) {
                                res1.rows[0].fields_json.subscription_expired = true;
                            }
                        } catch (e) {
                            res1.rows[0].fields_json.subscription_expired = true;
                        }
                    } else {
                        if (!['active', 'trialing', 'cancel_at_period_end'].includes(res1.rows[0].fields_json.status)) {
                            res1.rows[0].fields_json.subscription_expired = true;
                        }
                    }
                } else {
                    res1.rows[0].fields_json.subscription_expired = false;
                }
                delete res1.rows[0].fields_json.auth_provider_name;
                delete res1.rows[0].fields_json.auth_provider_id;
                return res1.rows[0].fields_json;
            } else {
                return null;
            }
            // return res.rows.length > 0 ? res.rows[0] : null;
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

    /**
     * Find user by email
     *
     * @param providerId - string
     * @param isDeleted - boolean
     * @returns {Promise<any|null>}
     */
    async findUserByProviderId(providerId, isDeleted = false) {
        const client = await pool.connect();
        try {
            const res = await client.query(`SELECT * FROM data.users WHERE auth_provider_id = '${providerId}'`);
            if (res.rows.length) {
                delete res.rows[0].auth_provider_name;
                delete res.rows[0].auth_provider_id;
                return res.rows[0];
            } else {
                return null;
            }
            // return res.rows.length > 0 ? res.rows[0] : null;
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

    /**
     * Login or Register user via provider Facebook, Google, etc
     *
     * @param userData - object
     * @returns {Promise<{error: {code: number, message: string}, user: null}|{error: null, user: *}>}
     */
    async provider(userData) {
        const client = await pool.connect();
        try {
            let user;
            // user = await this.findUserByEmail(userData.email);
            user = await this.findUserByProviderId(userData.id);
            if (!user) {
                const query = `
                    INSERT INTO data.users (email, auth_provider_name, auth_provider_id, auth_provider_access_token, auth_provider_expiration_time, first_name, role_id)
                    VALUES
                    (
                        '${userData.email ? userData.email : userData.id}',
                        'facebook',
                        '${userData.id}',
                        '${userData.accessToken}',
                        to_timestamp(${userData.expirationTime}),
                        '${userData.name}',
                        '${userData.roleId}'
                    )
                    ;
                `;
                const res = await client.query(query);
                // user = res ? await this.findUserByEmail(userData.email) : null;
                user = res ? await this.findUserByProviderId(userData.id) : null;
                if (user) {
                    return { user: user, error: null };
                } else {
                    return { user: null, error: { code: 404, message: 'User Not found' } };
                }
            } else {
                return { user: user, error: null };
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { user: null, error: { code: 404, message: 'User Not found' } };
        } finally {
            client.release();
        }
    }

    /**
     * Login or Register user via provider Facebook, Google, etc
     *
     * @param userData - object
     * @returns {Promise<{error: {code: number, message: string}, user: null}|{error: null, user: *}>}
     */
    async providerLogin(userData) {
        const client = await pool.connect();
        try {
            let user;
            user = await this.findUserByProviderId(userData.userID);
            if (!user) {
                return { user: null, error: { code: 404, message: 'User Not found' } };
            } else {
                return { user: user, error: null };
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { user: null, error: { code: 404, message: 'User Not found' } };
        } finally {
            client.release();
        }
    }

    async createExistUserSubscription(userData) {
        const client = await pool.connect();
        try {
            const resPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE id = '${userData.planId}'`);
            // const resSettings = await client.query('SELECT * FROM data.system_settings WHERE id=1');
            if (resPlan.rows.length) {
                if (resPlan.rows[0].stripe_id) {
                    let customerId;
                    // check customer id from stripe
                    if (!userData.user.customer_id) {
                        const customer = await stripe.customers.create({
                            email: userData.user.email,
                            name: `${userData.user.first_name} ${userData.user.last_name}`
                        });
                        // console.log('CUSTOMER', customer);
                        customerId = customer.id;
                    } else {
                        customerId = userData.user.customer_id;
                    }

                    // create setup intent
                    const setupIntent = await stripe.setupIntents.create({
                        customer: customerId,
                        payment_method_types: ['card'],
                    });

                    // generate subscription always new for receive secret key for payment form;
                    // const subscriptionObject = {
                    //     customer: customerId,
                    //     items: [{
                    //         plan: resPlan.rows[0].stripe_id
                    //     }],
                    //     payment_behavior: 'default_incomplete',
                    //     expand: ['latest_invoice.payment_intent'],
                    // };
                    // if (userData.type === 'trial') {
                    //     subscriptionObject.trial_period_days = resSettings.rows[0].trial_period;
                    // } else {
                    //     subscriptionObject.coupon =  'free-period';
                    // }
                    // const subscription = await stripe.subscriptions.create(subscriptionObject);
                    // const dbSubscription = {
                    //     user_id: user.id,
                    //     plan_id: userData.planId,
                    //     customer_id: customerId,
                    //     subscription_id: subscription.id,
                    //     status: subscription.status,
                    //     period_start: subscription.current_period_start,
                    //     period_end: subscription.current_period_end,
                    //     is_trial: userData.type === 'trial'
                    // }
                    // const querySubscription = `SELECT * FROM data.set_subscriptions('${JSON.stringify(dbSubscription)}');`;
                    // await client.query(querySubscription);
                    // return { subscription: subscription, setupIntent: setupIntent, planId: userData.planId };
                    return { subscription: {}, setupIntent: setupIntent, planId: userData.planId };
                }
            } else {
                return { subscription: null, error: { code: 404, message: 'User Not found' } };
            }
            return { subscription: null, error: { code: 404, message: 'User Not found' } };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { user: null, error: { code: 404, message: 'User Not found' } };
        } finally {
            client.release();
        }
    }

    async deletePaymentMethod(user, paymentId) {
        try {
            await stripe.paymentMethods.detach(
                paymentId
            );
            return this.getSubscriptionInfo(user.subscription_id, user.customer_id);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { user: null, error: { code: 404, message: 'User Not found' } };
        }
    }


    async setupDefaultPayment(user, paymentId) {
        try {
            await stripe.customers.update(
                user.customer_id,
                {
                    invoice_settings: {
                        default_payment_method: paymentId
                    }
                }
            );
            return this.getSubscriptionInfo(user.subscription_id, user.customer_id);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { user: null, error: { code: 404, message: 'User Not found' } };
        }
    }

    async getSubscriptionInfo(subscriptionId, customerId) {
        const client = await pool.connect();
        try {
            const dbPlansRes = await client.query('SELECT * FROM data.subscription_plans WHERE stripe_id IS NOT NULL');
            const subscription = await stripe.subscriptions.retrieve(
                subscriptionId
            );
            const paymentMethods = await stripe.customers.listPaymentMethods(
                customerId,
                {type: 'card'}
            );
            const customer = await stripe.customers.retrieve(
                customerId
            );
            // const resSubscription = await client.query(`SELECT name FROM data.subscription_plans
            //         LEFT JOIN data.subscriptions ON data.subscriptions.plan_id=data.subscription_plans.id
            //         WHERE subscription_id='${subscriptionId}'`);
            const resSubscription = await client.query(`SELECT * FROM data.subscription_plans WHERE stripe_id='${subscription.plan.id}'`);
            subscription.DBName = resSubscription.rows.length ? resSubscription.rows[0].name : '';
            subscription.paymentMethods = paymentMethods.data;
            subscription.defaultPayment = customer.invoice_settings.default_payment_method;
            subscription.defaultPlanId = subscription.items.data[0].plan.id;
            subscription.dbPlans = dbPlansRes.rows;

            // const paymentPlansInfo = await paymentPlanModel.fetchItems();
            subscription.paymentPlanList = await paymentPlanModel.fetchItems();

            let invoices = await stripe.invoices.list({
                limit: 3,
                customer: customerId
            });
            if (!invoices.data.length ) {
                await stripe.invoices.create({
                    customer: user.customer_id,
                });
                invoices = await stripe.invoices.list({
                    limit: 1,
                    customer: user.curstomer_id
                });
            }
            let invoicePdf = '';
            invoices.data.forEach(_invoice => {
                if (_invoice.invoice_pdf) {
                    invoicePdf = _invoice.invoice_pdf;
                    return;
                }
            });
            subscription.invoicePdf = invoicePdf;
            return { subscription: subscription };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'User[getSubscriptionInfo]:',
                    { message: e.message }
                );
            }
            return { subscription: null };
        }
    }

    async createUserFromSubscription(userData ,planId, type) {
        const {
            salt,
            hash
        } = this.setPassword(userData.password);
        const client = await pool.connect();
        try {
            const res = await client.query(`SELECT * FROM data.users WHERE email = '${userData.email.toLowerCase()}'`);
            if (res.rows.length) {
                return { user: null, subscription: null, error: { code: 404, message: 'User present' } };
            }
            const userQuery = `
                INSERT INTO data.users (
                    email, password, salt, role_id, first_name, last_name
                ) VALUES ('${userData.email.toLowerCase()}', '${hash}', '${salt}', 2, $$${userData.first_name}$$, $$${userData.last_name}$$);`;
            await client.query(userQuery);
            const resUser = await client.query(`SELECT * FROM data.users WHERE email = '${userData.email.toLowerCase()}'`);
            if (!resUser.rows.length) {
                return { subscription: {}, error: { code: 404, message: 'User Not found' } };
            } else {
                return await this.createExistUserSubscription({ user: userData, type: type, planId:planId }, resUser.rows[0]);
            }
        } catch (e) {

        } finally {
            client.release();
        }
    }


    async checkPayment(paymentIntent, paymentIntentSecret, planId, type) {
        const client = await pool.connect();
        try {
            const paymentIntentResult = await stripe.setupIntents.retrieve(
                paymentIntent
            );
            // const paymentIntentResult = await stripe.paymentIntents.retrieve(
            //     paymentIntent
            // );

            // console.log('[User.checkPayment] STRIPE PAYMENT INTENT', paymentIntentResult);
            if (paymentIntentResult.client_secret === paymentIntentSecret) {
                // setup payment intent as default payment method
                await stripe.customers.update(
                    paymentIntentResult.customer,
                    {
                        invoice_settings: {
                            default_payment_method: paymentIntentResult.payment_method
                        }
                    }
                );
                const stripeCustomer = await stripe.customers.retrieve(paymentIntentResult.customer);
                const dbUser = await this.findUserByEmail(stripeCustomer.email);
                // create subscription here
                const resPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE id = '${planId}'`);
                const resSettings = await client.query('SELECT * FROM data.system_settings WHERE id=1');
                if (resPlan.rows.length) {
                    const subscriptionObject = {
                        customer: paymentIntentResult.customer,
                        items: [{
                            plan: resPlan.rows[0].stripe_id
                        }],
                        payment_behavior: 'default_incomplete',
                        expand: ['latest_invoice.payment_intent'],
                    };
                    // subscriptionObject.coupon =  'free-period';
                    if (type === 'trial') {
                        subscriptionObject.trial_period_days = resSettings.rows[0].trial_period;
                    } else {
                        subscriptionObject.coupon =  'free-period';
                    }
                    const subscription = await stripe.subscriptions.create(subscriptionObject);
                    const dbSubscription = {
                        user_id: dbUser.id,
                        plan_id: planId,
                        customer_id: paymentIntentResult.customer,
                        subscription_id: subscription.id,
                        status: subscription.status,
                        period_start: subscription.current_period_start,
                        period_end: subscription.current_period_end,
                        is_trial: type === 'trial'
                    }
                    const _querySubscription = `SELECT * FROM data.set_subscriptions('${JSON.stringify(dbSubscription)}');`;
                    await client.query(_querySubscription);

                    const querySubscription = `UPDATE data.subscriptions SET status='${subscription.status}' WHERE customer_id='${paymentIntentResult.customer}'`;
                    if (paymentIntentResult.status === 'succeeded') {
                        console.log('[User.checkPayment] succeeded querySubscription = ', querySubscription);
                        await client.query(querySubscription);
                    }
                    const subscriptionRes = await client.query(`SELECT email, price FROM data.users
                    LEFT JOIN data.subscriptions ON data.subscriptions.user_id=data.users.id
                    LEFT JOIN data.subscription_plans ON data.subscription_plans.id = data.subscriptions.plan_id
                    WHERE customer_id='${paymentIntentResult.customer}'`);
                    console.log('[User.checkPayment]', subscriptionRes.rows[0]);

                    if (subscriptionRes.rows.length) {
                        paymentIntentResult.email = subscriptionRes.rows[0].email;

                        // send email about success payment and subscription
                        const mail = await confirmSubscriptionEmail(subscriptionRes.rows[0].email, 'fr');
                        sendMail(
                            subscriptionRes.rows[0].email,
                            mail.subject,
                            mail.body
                        );

                        const mailPayment = await confirmSubscriptionPaymentEmail(subscriptionRes.rows[0].email, 'fr', subscriptionRes.rows[0].price);
                        sendMail(
                            subscriptionRes.rows[0].email,
                            mailPayment.subject,
                            mailPayment.body
                        );

                        // console.log('[User.checkPayment] paymentIntent = ', paymentIntentResult);

                        return { paymentIntent: paymentIntentResult }
                    }
                }
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            console.log('[User.checkPayment] e.message = ', e.message);
            return { user: null, error: { code: 404, message: 'Payment subscription error' } };

        } finally {
            client.release();
        }
    }


    /**
     * Create user
     *
     * @param userData - object
     * @returns {Promise<{error: {code: number, message: string}, user: null}|{error: null, user: *}>}
     */
    async create(userData) {
        const {
            salt,
            hash
        } = this.setPassword(userData.password);
        const client = await pool.connect();
        try {
            const res = await client.query(`
            INSERT INTO data.users (
                email, password, salt, role_id, first_name, last_name, company_name,
                phone, vat, identification_number, full_address
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [
                userData.email,
                hash,
                salt,
                userData.role_id,
                userData.first_name,
                userData.last_name,
                userData.company_name,
                userData.phone,
                userData.vat,
                userData.identification_number,
                userData.full_address
            ]);
            const user = res ? await this.findUserByEmail(userData.email) : null;
            if (user) {
                // add to user default chatbot scenarios
                // buy+item+color+size+quantity
                // buy+item+size+color+quantity
                // buy+item+color+size
                // buy+item+size+color
                // buy+item+color+quantity
                // buy+item+size+quantity
                // buy+item+color
                // buy+item+size
                // buy+item+quantity
                // buy+item
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Buy item full config with qty', 'buy+item+color+size+quantity')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Buy item full config without qty', 'buy+item+color+size')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Buy item full config with qty (1)', 'buy+item+size+color+quantity')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Buy item full config without qty (1)', 'buy+item+size+color')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Buy item color config with qty', 'buy+item+color+qty')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Buy item color config without qty', 'buy+item+color')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Buy item size config with qty', 'buy+item+size+qty')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Buy item size config without qty', 'buy+item+size')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Buy simple product without config with qty', 'buy+item+qty')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Buy simple product without config without qty', 'buy+item')`);

                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Sold item full config with qty', 'sold+item+color+size+quantity')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Sold item full config without qty', 'sold+item+color+size')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Sold item full config with qty (1)', 'sold+item+size+color+quantity')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Sold item full config without qty (1)', 'sold+item+size+color')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Sold item color config with qty', 'sold+item+color+qty')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Sold item color config without qty', 'sold+item+color')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Sold item size config with qty', 'sold+item+size+qty')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Sold item size config without qty', 'sold+item+size')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Sold simple product without config with qty', 'sold+item+qty')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Sold simple product without config without qty', 'sold+item')`);

                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Vendu item full config with qty', 'vendu+item+color+size+quantity')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Vendu item full config without qty', 'vendu+item+color+size')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Vendu item full config with qty (1)', 'vendu+item+size+color+quantity')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Vendu item full config without qty (1)', 'vendu+item+size+color')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Vendu item color config with qty', 'vendu+item+color+qty')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Vendu item color config without qty', 'vendu+item+color')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Vendu item size config with qty', 'vendu+item+size+qty')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Vendu item size config without qty', 'vendu+item+size')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Vendu simple product without config with qty', 'vendu+item+qty')`);
                await client.query(`INSERT INTO data.chatbot_scenarios (user_id, name, keywords) VALUES (${user.id}, 'Vendu simple product without config without qty', 'vendu+item')`);

                delete user.salt;
                delete user.password;
                return { user: user, error: null };
            } else {
                return { user: null, error: { code: 404, message: 'User Not found' } };
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { user: null, error: { code: 404, message: 'User Not found' } };
        } finally {
            client.release();
        }
    }

    /**
     *
     * @param userData
     * @param userId
     * @returns {Promise<{error: null, user}|{error: {code: number, message: string}, user: null}>}
     */
    async update(userData, userId) {
        const client = await pool.connect();
        try {
            const query = `SELECT common__tools._update_table_by_id('data', 'users', '${JSON.stringify(userData)}', ${userId});`;
            await client.query(query);
            // const query1 = `// UPDATE data.users SET photo='${userData.photo}' WHERE id=${userId};`;
            // await client.query(query1);
            if (user) {
                return { user: userData, error: null };
            } else {
                return { user: null, error: { code: 404, message: 'User Not found' } };
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { user: null, error: { code: 404, message: 'User Not found' } };
        } finally {
            client.release();
        }
    }

    async updateProfilePhoto(photo, userId) {
        const client = await pool.connect();
        try {
            const query = `UPDATE data.users SET photo='${photo}' WHERE id=${userId};`;
            await client.query(query);
            if (user) {
                return { user: userData, error: null };
            } else {
                return { user: null, error: { code: 404, message: 'User Not found' } };
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { user: null, error: { code: 404, message: 'User Not found' } };
        } finally {
            client.release();
        }
    }
    /**
     *
     * @param userId integer
     * @returns {Promise<{addresses: null, error: {code: number, message: string}}|any|null>}
     */
    async findUserAddress(userId) {
        const client = await pool.connect();
        try {
            const query = `SELECT * FROM data.addresses WHERE user_id='${userId}' ORDER BY id DESC;`;
            const res = await client.query(query);
            return res.rows ? res.rows[0] : null;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { addresses: null, error: { code: 404, message: 'Addresses Not found' } };
        } finally {
            client.release();
        }
    }

    /**
     *
     * @param userId integer
     * @param addressData json object
     * @returns {Promise<{error: {code: number, message: string}, user: null}|{success: boolean}>}
     */
    async saveAddress(userId, addressData) {
        const client = await pool.connect();

        try {
            if (addressData.id) {
                await client.query(`DELETE FROM data.addresses WHERE user_id = '${userId}'`);
            }

            await client.query(`INSERT INTO data.addresses
            (
                user_id, country_id, state, post_code, address_type, city,
                address_line_1, address_line_2
            )
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )`, [
                userId,
                addressData.country_id,
                addressData.state,
                addressData.post_code,
                addressData.address_type,
                addressData.city,
                addressData.address_line_1,
                addressData.address_line_2
            ]);

            return { success: true };

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { user: null, error: { code: 404, message: 'Addresses Not found' } };

        } finally {
            client.release();
        }
    }

    /**
     *
     * @param user - json object
     * @param data - json object
     * @returns {Promise<{error: {code: number, message: string}, user: null}|{success: boolean, error: {code: number, message: string}}|{success: boolean}>}
     */
    async changePassword(user, data) {
        const client = await pool.connect();
        try {
            const {
                salt,
                hash
            } = this.setPassword(data.password);
            const passwordData = {
                salt: salt,
                password: hash
            };
            const query = `SELECT common__tools._update_table_by_id('data', 'users', '${JSON.stringify(passwordData)}', ${user.id});`;
            await client.query(query);
            return { success: true };
            // if (!user || !this.validatePassword(data.old_password, user.salt, user.password)) {
            //     return { success: false, error: { code: 402, message: 'Access Deny' } };
            // } else {
            // }
        } catch (e) {
            return {
                user: null,
                error: {
                    code: 500,
                    message: 'Error change password'
                }
            };
        } finally {
            client.release();
        }
    }

    /**
     *
     * @param user
     * @returns {Promise<{error: {code: number, message: string}, user: null}|{success: boolean, hash: string}>}
     */
    async generateRestoreHash(user) {
        const client = await pool.connect();
        try {
            const hash = crypto.randomBytes(20).toString('hex');
            const expiredAt = new Date();
            expiredAt.setSeconds(expiredAt.getSeconds() + process.env.EMAIL_VALIDATION_TOKEN_LIFE);
            const query = `SELECT common__tools._update_table_by_id('data', 'users', '${JSON.stringify({ hash: hash, expired_at: expiredAt.toUTCString() })}', ${user.id});`;
            await client.query(query);
            return { success: true, hash: hash };
        } catch (e) {
            return {
                user: null,
                error: {
                    code: 500,
                    message: 'Error restore password'
                }
            };
        } finally {
            client.release();
        }
    }

    /**
     * Login user via email link
     * @param hash
     * @returns {Promise<{error: {code: number, message: string}, user: null}|*|null>}
     */
    async activateByHash(hash) {
        const client = await pool.connect();
        const query = `SELECT * FROM data.find_user_by_hash('${hash}', false);`;
        try {
            const res = await client.query(query);

            if (res.rows.length > 0) {
                const user = res.rows[0];
                await client.query(`UPDATE data.users SET hash = null WHERE id = $1`, [user.id]);
                return user;
            }

            return null
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Query:',
                    { message: query }
                );
                logger.log(
                    'error',
                    'Model error (User activateByHash):',
                    { message: e.message }
                );
            }
            const error = {
                code: 500,
                message: 'Error create reset token'
            };
            return {
                user: null,
                error
            };
        } finally {
            client.release();
        }
    }

    /**
     * sync our user data with fb profile data
     * @param userData - user object
     * @param data -fb data object
     * @returns {Promise<{user: (*|null)}|{error: {code: number, message: string}, user: null}>}
     */
    async syncFb(userData, data) {
        const client = await pool.connect();
        const query = `UPDATE data.users SET
                        auth_provider_name='facebook', auth_provider_id='${data.userID}',
                        auth_provider_access_token='${data.accessToken}',
                        auth_provider_expiration_time=to_timestamp(${data.data_access_expiration_time})
                       WHERE id=${userData.id}
                        `;
        try {
            await client.query(query);
            const user = await this.findUserByEmail(userData.email);

            return {user: user};
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Query:',
                    { message: query }
                );
                logger.log(
                    'error',
                    'Model error (User activateByHash):',
                    { message: e.message }
                );
            }
            const error = {
                code: 500,
                message: 'Error create reset token'
            };
            return {
                user: null,
                error
            };
        } finally {
            client.release();
        }
    }

    /**
     *
     * @param searchStr - string
     * @param roleId - numeric
     * @returns {Promise<*|*[]|{success: boolean, error: {code: number, message: string}}>}
     */
    async findUsersSuggestion(searchStr, roleId) {
        const client = await pool.connect();
        try {
            const regex = /\'/ig;
            // const query = `SELECT data.get_hashtags_json_arr('${searchStr.replaceAll(regex, "''")}');`;
            const query = `SELECT users FROM data.get_users('{"role_id": ${roleId}, "name":  "${searchStr.replaceAll(regex, "''")}"}');`;
            const res = await client.query(query);
            return res.rows[0].users ? res.rows[0].users : [];
            // return [{ name: 'hello', id: 2}, { name: 'hello2', id: 3}, { name: 'hello3', id: 3}];
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model User (findUsersSuggestion) error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Users not found' } };
        } finally {
            client.release();
        }
    }


    /**
     *
     * @param userId
     * @returns {Promise<*|[{order_timer: string, free_shipping_timer: string, updated_at: string, user_id, created_at: string, free_shipping_status: string, type: string}]|{success: boolean, error: {code: number, message: string}}>}
     */
    async fetchUserSettings(userId) {
        const client = await pool.connect();
        try {
            const query = 'SELECT * FROM data.seller_settings WHERE user_id=$1;';
            const res = await client.query(query, [userId]);
            console.log(res.rows[0]);

            if (res.rows.length > 0) {
                if (res.rows[0].order_timer) {
                    res.rows[0].type = res.rows[0].order_timer.days ? 'd' : res.rows[0].order_timer.hours ? 'h' : 'm';
                    res.rows[0].order_timer = res.rows[0].order_timer.hours ?? res.rows[0].order_timer.days ?? res.rows[0].order_timer.minutes;
                }

                if (res.rows[0].free_shipping_timer) {
                    res.rows[0].free_shipping_timer = res.rows[0].free_shipping_timer.hours ?? res.rows[0].free_shipping_timer.days ?? res.rows[0].free_shipping_timer.minutes;
                }
            }

            return res.rows[0] ? res.rows : [{
                user_id: userId,
                order_timer: '',
                type: 'h',
                free_shipping_timer: '',
                free_shipping_status: '',
                created_at: '',
                updated_at: ''
            }];

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model User (fetchUserSettings) error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Users not found' } };

        } finally {
            client.release();
        }
    }

    async addPaymentMethod(user, data) {
        try {
            const expPeriod = data.card_expire_date.split('/');
            await stripe.customers.listPaymentMethods(
                user.customer_id,
                {type: 'card'}
            );
            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: data.card_number,
                    exp_month: expPeriod[0],
                    exp_year: expPeriod[1],
                    cvc: data.card_ccv,
                },
            });
            await stripe.paymentMethods.attach(
                paymentMethod.id,
                {customer: user.customer_id}
            );
            return { success: true, error: null };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Stripe Add Payment Method Error:',
                    {message: e.message}
                );
            }
            return { success: false, error: { code: 404, message: 'Cannot add payment method to customer' } };
        }

    }

    async updateSubscriptionPlan(user, planId) {
        try {
            // const paymentMethods = await  stripe.paymentMethods.list({ customer: user.customer_id, type: 'card' });
            const subscription = await stripe.subscriptions.retrieve(user.subscription_id);
            await stripe.subscriptions.update(user.subscription_id, {
                cancel_at_period_end: false,
                proration_behavior: 'create_prorations',
                items: [{
                    id: subscription.items.data[0].id,
                    price: planId,
                }]
            });
            return { success: true, error: null };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Stripe Add Payment Method Error:',
                    {message: e.message}
                );
            }
            return { success: false, error: { code: 404, message: 'Cannot add payment method to customer' } };
        }
    }

    async unsubscribe() {
        const client = await pool.connect();
        try {
            const userRes = await client.query(`SELECT subscription_id FROM data.users
                    LEFT JOIN data.subscriptions ON data.subscriptions.user_id = data.users.id WHERE data.users.email = 'plan@123.com'`);
            if (userRes.rows.length) {
                const unsubscribeRes = await stripe.subscriptions.update(userRes.rows[0].subscription_id, {cancel_at_period_end: true});
                if (unsubscribeRes.id){
                    await client.query(`UPDATE data.subscriptions SET status='cancel_at_period_end' WHERE subscription_id='${unsubscribeRes.id}'`);
                }
                return { success: true, error: null };
            } else {
                return { success: false, error: 'No subscription on _DB' };
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model User (Unsubscribe) error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Users not found' } };
        } finally {
            client.release();
        }
    }


    async updateSellerSettings(userId, data) {
        const client = await pool.connect();
        try {
            let free_shipping_timer = '0 hour';
            if (data.free_shipping_status) {
                free_shipping_timer = `${data.free_shipping_timer || 0} hour${data.free_shipping_timer > 1 ? 's' : ''}`;
            }

            const intervalDuration = `${data.order_timer || 0} ${data.type === 'h'? 'hour' : data.type === 'd' ? 'day' : 'minute'}${data.order_timer > 1 ? 's' : ''}`;
            const query = `INSERT INTO data.seller_settings(user_id, order_timer, free_shipping_timer, free_shipping_status, multisafe_api_key)
                VALUES ($1, $2, $3, $4, $5) ON CONFLICT ON CONSTRAINT seller_settings__pkey DO UPDATE SET
                    order_timer = EXCLUDED.order_timer,
                    free_shipping_timer = EXCLUDED.free_shipping_timer,
                    free_shipping_status = EXCLUDED.free_shipping_status,
                    multisafe_api_key = EXCLUDED.multisafe_api_key;`;
            await client.query(query, [userId, intervalDuration, free_shipping_timer, !!data.free_shipping_status, data.multisafe_api_key]);

            return { success: true };

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model User (updateUserSettings) error:',
                    { message: e.message }
                );
                console.log('[User.updateSellerSettings] sql e.message = ', e.message);
            }
            return { success: false, error: { code: 404, message: 'Users not found' } };

        } finally {
            client.release();
        }
    }

    async generatePdf(user) {
        try {
            let invoices = await stripe.invoices.list({
                limit: 3,
                customer: user.curstomer_id
            });
            if (!invoices.data.length ) {
                await stripe.invoices.create({
                    customer: user.customer_id,
                });
                invoices = await stripe.invoices.list({
                    limit: 1,
                    customer: user.curstomer_id
                });
            }
            let invoicePdf = '';
            invoices.data.forEach(_invoice => {
                if (_invoice.invoice_pdf) {
                    invoicePdf = _invoice.invoice_pdf;
                    return;
                }
            })
            // console.log('INVOICE PDF', invoicePdf);

            return { success: true, invoiceUrl: invoicePdf };

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model User (updateUserSettings) error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Users not found' } };
        }
    }

    /**
     * Check pasword
     *
     * @param password - string
     * @param salt - string
     * @param hash - string
     * @returns {boolean}
     */
    validatePassword(password, salt, hash) {
        const hashCheck = crypto.pbkdf2Sync(password, salt, 10000, 256, 'sha256').toString('hex');
        return hash === hashCheck;
    }

    /**
     * Encode password
     *
     * @param password - string
     * @returns {{salt: string, hash: string}}
     */
    setPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 256, 'sha256').toString('hex');
        return {
            salt,
            hash
        };
    }

    generateJWT(email, id) {
        const secret = process.env.LOGIN_TOKEN_SECRET;
        const tokenLife = Number(process.env.LOGIN_TOKEN_LIFE);
        return jwt.sign({ email: email, id: id }, secret, { expiresIn: tokenLife });
    }

    generateRefreshToken(id) {
        const secret = process.env.LOGIN_TOKEN_SECRET_REFRESH;
        const tokenLife = Number(process.env.LOGIN_TOKEN_LIFE_REFRESH);
        return jwt.sign({ id: id }, secret, { expiresIn: tokenLife });
    }
}

export default new User();
