import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pool from './connect.js';
import { logger } from '../../common/logger.js';
import Stripe from 'stripe';
import axios from "axios";
import paymentPlanModel from "./PaymentPlan.js";
import {
    changeSubscriptionPlanEmail,
    confirmSubscriptionEmail,
    sendPlatinumEmail,
    confirmSubscriptionPaymentEmail,
    confirmVerificationEmail, unsubscriberFromEmail, sessionSyncEmail
} from "../sender/templates.js";
import { sendMail, sendMailPlatinum}  from "../lib/sendMail.js";
import moment from 'moment';
import fs from "fs";

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
        // console.log("USER EMAIL", email);
        try {
            // const res = await client.query(`SELECT * FROM data.users WHERE email = '${email.toLowerCase()}'`);
            const res1 = await client.query(`SELECT fields_json FROM data.find_user_by_email('${email.toLowerCase()}', '3.5 hours');`);
            if (res1.rows[0].fields_json) {
                res1.rows[0].subscription_expired = false;
                if (res1.rows[0].fields_json.role_id === 1) {
                    if ((res1.rows[0].fields_json.customer_id || !res1.rows[0].fields_json.is_fake) && (res1.rows[0].fields_json.period_left === null || res1.rows[0].fields_json.period_left < 0)) {

                        try {
                            const subscription = await stripe.subscriptions.retrieve(res1.rows[0].fields_json.subscription_id);
                            if (subscription.current_period_end > moment().unix()) {
                                res1.rows[0].fields_json.subscription_expired = false;
                            }
                        } catch (e) {
                            res1.rows[0].fields_json.subscription_expired = true;
                            // res1.rows[0].fields_json.subscription_expired = false;
                            // console.log("INCOMING HERE")
                            // const haveTrialSubscription = await client.query();
                            // if (!res1.rows[0].fields_json.is_trial) {
                            // }
                            // res1.rows[0].fields_json.is_trial = true;
                            // res1.rows[0].fields_json.is_trial = true;
                        }
                    } else if (res1.rows[0].fields_json.customer_id && res1.rows[0].fields_json.is_trial) {
                        const resSubscription = await client.query(`SELECT * FROM data.subscriptions WHERE subscription_id='${res1.rows[0].fields_json.subscription_id}'`);
                        res1.rows[0].fields_json.subscription = resSubscription.rows[0];
                        if (res1.rows[0].fields_json.period_left > 0) {
                            res1.rows[0].fields_json.subscription_expired = false;
                        } else {
                            res1.rows[0].fields_json.subscription_expired = true;
                        }
                    }
                    else {
                        const periodStart =  new Date();
                        const periodEnd  = new Date();
                        periodEnd.setMonth(periodEnd.getMonth() + 1);
                        const timestampStart = periodStart.getTime();
                        const timestampEnd = periodEnd.getTime();
                        if (!res1.rows[0].fields_json.customer_id) {
                            const dbSubscription = {
                                user_id: res1.rows[0].fields_json.id,
                                plan_id: 1,
                                customer_id: `fake_subscription_${res1.rows[0].fields_json.id}`,
                                subscription_id: `fake_sub_${res1.rows[0].fields_json.id}`,
                                status: 'trialing',
                                period_start: timestampStart/1000,
                                period_end: timestampEnd/1000,
                                is_trial: true
                            }
                            // const _querySubscription = `SELECT * FROM data.set_subscriptions('${JSON.stringify(dbSubscription)}');`;
                            // await client.query(_querySubscription);
                        }
                        if (!['active', 'trialing', 'cancel_at_period_end'].includes(res1.rows[0].fields_json.status)) {
                            res1.rows[0].fields_json.subscription_expired = false;
                        }
                    }
                } else {
                    res1.rows[0].fields_json.subscription_expired = false;
                }
                // res1.rows[0].fields_json.is_trial = true;
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

    async createDbSubscription(userId, type = '') {
        const client = await pool.connect();
        try {
            const periodStart =  new Date();
            const periodEnd  = new Date();
            periodEnd.setMonth(periodEnd.getMonth() + 1);
            const timestampStart = periodStart.getTime();
            const timestampEnd = periodEnd.getTime();
            const dbSubscription = {
                user_id: userId,
                plan_id: 1,
                customer_id: `${type === 'skip' ? 'skip' : 'fake'}_subscription_${userId}`,
                subscription_id: `${type === 'skip' ? 'skip' : 'fake'}_sub_${userId}`,
                status: 'trialing',
                period_start: timestampStart/1000,
                period_end: timestampEnd/1000,
                is_trial: true
            }
            const _querySubscription = `SELECT * FROM data.set_subscriptions('${JSON.stringify(dbSubscription)}');`;
            await client.query(_querySubscription);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Create Fake error:',
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
    async findUserByProviderId(providerId, isDeleted = false, isFree = false) {
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
            const fullFbName = userData.name.split(' ');
            const firstName = fullFbName[0];
            let lastName = '';
            if (fullFbName.length > 1) {
                lastName = fullFbName[1];
            }
            if (!user) {
                const query = `
                    INSERT INTO data.users (email, auth_provider_name, auth_provider_id, auth_provider_access_token, auth_provider_expiration_time, first_name, last_name, role_id, auth_provider_accounts)
                    VALUES
                    (
                        '${userData.email ? userData.email : userData.id}',
                        'facebook',
                        '${userData.id}',
                        '${userData.accessToken}',
                        to_timestamp(${userData.expirationTime}),
                        '${firstName}',
                        '${lastName}',
                        '${userData.roleId}',
                        '${(userData.accounts ? userData.accounts : null)}'
                    )
                    ;
                `;
                console.log(query);
                const res = await client.query(query);
                user = res ? await this.findUserByProviderId(userData.id) : null;

                if (parseInt(userData.roleId) === 2) {
                    // get user stores
                    try {
                        if (userData.accessToken) {
                            await axios
                                .get(
                                    `https://graph.facebook.com/v17.0/me?fields=accounts&access_token=${userData.accessToken}`
                                )
                                .then(async (responsePages) => {
                                    // console.log("RESPONCE", responsePages.data.accounts.data);
                                    if (responsePages.data.error) {
                                        store.dispatch(setErrorToastAction('Could no getting stores list'));
                                    } else {
                                        const storesList = responsePages.data.accounts.data;
                                        storesList.forEach(async (store) => {
                                            const queryStore = await client.query(`SELECT * FROM data.user_stores WHERE account_id='${userData.id}' AND store_id='${store.id}'`);
                                            if (queryStore.rows.length === 0) {
                                                await  client.query(`
                                                    INSERT INTO data.user_stores (account_id, store_id, access_token, name, user_id)
                                                    VALUES
                                                    (
                                                        '${userData.id}',
                                                        '${store.id}',
                                                        '${store.access_token}',
                                                        '${store.name}',
                                                        '${user.id}'
                                                    );`
                                                );
                                            } else {
                                                await  client.query(`
                                                    UPDATE data.user_stores SET 
                                                     access_token='${store.access_token}', 
                                                     name='${store.name}'
                                                    WHERE user_id = '${user.id}';`
                                                );
                                            }
                                            await  client.query(`
                                                INSERT INTO data.user_stores (account_id, store_id, access_token, name, user_id)
                                                VALUES
                                                (
                                                    '${userData.id}',
                                                    '${store.id}',
                                                    '${store.access_token}',
                                                    '${store.name}',
                                                    '${user.id}'
                                                );`
                                            );
                                        })
                                    }
                                    const { data } = responsePages;
                                    // console.log("Users account connected pages", dataPages);
                                    if (data.error) {
                                        store.dispatch(setErrorToastAction('Could no getting stores list'));
                                    }
                                });
                        }
                    } catch (e) {
                        console.log(e.message);
                    }
                }

                if (parseInt(userData.roleId) === 2 && parseInt(userData.forFree) === 1) {
                    // check user subscription
                    // if we register for free
                    const periodStart = new Date();
                    const periodEnd = new Date();
                    periodEnd.setMonth(periodEnd.getMonth() + 1);
                    const timestampStart = periodStart.getTime();
                    const timestampEnd = periodEnd.getTime();
                    const dbSubscription = {
                        user_id: user.id,
                        plan_id: 1,
                        customer_id: `fake_subscription_${user.id}`,
                        subscription_id: `fake_sub_${user.id}`,
                        status: 'trialing',
                        period_start: timestampStart / 1000,
                        period_end: timestampEnd / 1000,
                        is_trial: true
                    }
                    const _querySubscription = `SELECT * FROM 
                        data.set_subscriptions('${JSON.stringify(dbSubscription)}');`;
                    await client.query(_querySubscription);
                }

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
            if (parseInt(userData.roleId) === 2) {
                // get user stores
                try {
                    if (userData.accessToken) {
                        await axios
                            .get(
                                `https://graph.facebook.com/v17.0/me?fields=accounts&access_token=${userData.accessToken}`
                            )
                            .then(async (responsePages) => {
                                if (responsePages.data.error) {
                                    store.dispatch(setErrorToastAction('Could no getting stores list'));
                                } else {
                                    const storesList = responsePages.data.accounts.data;
                                    storesList.forEach(async (store) => {
                                        const queryStore = await client.query(`SELECT * FROM data.user_stores WHERE account_id='${userData.id}' AND store_id='${store.id}'`);
                                        if (queryStore.rows.length === 0) {
                                            await  client.query(`
                                                    INSERT INTO data.user_stores (account_id, store_id, access_token, name, user_id)
                                                    VALUES
                                                    (
                                                        '${userData.id}',
                                                        '${store.id}',
                                                        '${store.access_token}',
                                                        '${store.name}',
                                                        '${user.id}'
                                                    );`
                                            );
                                        } else {
                                            await  client.query(`
                                                    UPDATE data.user_stores SET 
                                                     access_token='${store.access_token}', 
                                                     name='${store.name}'
                                                    WHERE user_id = '${user.id}';`
                                            );
                                        }
                                    })
                                }
                                const { data } = responsePages;
                                // console.log("Users account connected pages", dataPages);
                                if (data.error) {
                                    store.dispatch(setErrorToastAction('Could no getting stores list'));
                                }
                            });
                    }
                } catch (e) {
                    console.log(e.message);
                }
            }

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

    async createExistUserSubscriptionAfterTrial(userData, planId) {
        const client = await pool.connect();
        try {
            const resPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE id = '${planId}'`);
            const resSettings = await client.query('SELECT * FROM data.system_settings WHERE id=1');
            if (resPlan.rows.length) {
                if (resPlan.rows[0].stripe_id) {
                    let customerId;
                    // create custome on stripe
                    const customer = await stripe.customers.create({
                        email: userData.email,
                        name: `${userData.first_name} ${userData.last_name}`
                    });
                    customerId = customer.id;

                    // create setup intent
                    const setupIntent = await stripe.setupIntents.create({
                        customer: customerId,
                        payment_method_types: ['card'],
                    });

                    // generate subscription always new for receive secret key for payment form;
                    const subscriptionObject = {
                        customer: customerId,
                        items: [{
                            plan: resPlan.rows[0].stripe_id
                        }],
                        payment_behavior: 'default_incomplete',
                        expand: ['latest_invoice.payment_intent'],
                    };
                    subscriptionObject.coupon =  'free-period';
                    // if (userData.type === 'trial') {
                    //     subscriptionObject.trial_period_days = resSettings.rows[0].trial_period;
                    // } else {
                    //     subscriptionObject.coupon =  'free-period';
                    // }
                    const subscription = await stripe.subscriptions.create(subscriptionObject);
                    const dbSubscription = {
                        user_id: userData.id,
                        plan_id: planId,
                        customer_id: customerId,
                        subscription_id: subscription.id,
                        status: subscription.status,
                        period_start: subscription.current_period_start,
                        period_end: subscription.current_period_end,
                        is_trial: false
                    }
                    const querySubscription = `SELECT * FROM data.set_subscriptions('${JSON.stringify(dbSubscription)}');`;
                    await client.query(querySubscription);

                    return { subscription: subscription, setupIntent: setupIntent, planId: planId };
                }
            } else {
                return { subscription: null, error: { code: 404, message: 'User Not found' } };
            }
            // return { subscription: null, error: { code: 404, message: 'User Not found' } };
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

    async createSkipSubscriptionNew(userData) {
        const client = await pool.connect();
        try {
            // const subParam = userData.subscription_id.split('_');
            // console.log(userData);
            // const existSubscrQuery = await client.query(`SELECT * FROM data.subscriptions WHERE customer_id='fake_subscription_${subParam[2]}'`);
            let userId = userData.id;
            const periodStart =  new Date();
            const periodEnd  = new Date();
            periodEnd.setMonth(periodEnd.getMonth() + 1);
            const timestampStart = periodStart.getTime();
            const timestampEnd = periodEnd.getTime();
            const dbSubscription = {
                user_id: userId,
                plan_id: 1,
                customer_id: `skip_subscription_${userId}`,
                subscription_id: `skip_sub_${userId}`,
                status: 'skipping',
                period_start: timestampStart/1000,
                period_end: timestampEnd/1000,
                is_trial: true
            }
            const _querySubscription = `SELECT * FROM 
                        data.set_subscriptions('${JSON.stringify(dbSubscription)}');`;
            await client.query(_querySubscription);
            const dbUser = await client.query(`SELECT email FROM data.users WHERE id='${userId}'`);
            const _user = await this.findUserByEmail(dbUser.rows[0].email);
            return { user: _user, error: null };

        } catch (e) {
            console.log(e.message)
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


    async createSkipSubscription(userData) {
        const client = await pool.connect();
        try {
            const subParam = userData.subscription_id.split('_');
            const existSubscrQuery = await client.query(`SELECT * FROM data.subscriptions WHERE customer_id='fake_subscription_${subParam[2]}'`);
            let userId = existSubscrQuery.rows[0].user_id;
            const periodStart =  new Date();
            const periodEnd  = new Date();
            periodEnd.setMonth(periodEnd.getMonth() + 1);
            const timestampStart = periodStart.getTime();
            const timestampEnd = periodEnd.getTime();
            const dbSubscription = {
                user_id: userId,
                plan_id: 1,
                customer_id: `skip_subscription_${userId}`,
                subscription_id: `skip_sub_${userId}`,
                status: 'skipping',
                period_start: timestampStart/1000,
                period_end: timestampEnd/1000,
                is_trial: true
            }
            const _querySubscription = `SELECT * FROM 
                        data.set_subscriptions('${JSON.stringify(dbSubscription)}');`;
            await client.query(_querySubscription);
            const dbUser = await client.query(`SELECT email FROM data.users WHERE id='${userId}'`);
            // console.log(`SELECT email FROM data.users WHERE id='${userId}'`)
            // console.log("DB USER", dbUser.rows[0])
            // const _user = await this.findUserByEmail(dbUser.rows[0].email);
            const _user = await this.findUserByEmail(dbUser.rows[0].email);
            return { user: _user, error: null };

        } catch (e) {
            console.log(e.message)
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

    async createExistUserFromSkipSubscription(userData) {
        const client = await pool.connect();
        try {
            const resPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE id = '${userData.planId}'`);
            // const resSettings = await client.query('SELECT * FROM data.system_settings WHERE id=1');
            let paymentIntentSecret = '';
            if (resPlan.rows.length) {
                if (resPlan.rows[0].stripe_id) {
                    // we don't have any subscription in stripe
                    let customerId;
                    // create stripe customer
                    const customer = await stripe.customers.create({
                        email: userData.user.email,
                        name: `${userData.user.first_name} ${userData.user.last_name}`
                    });
                    customerId = customer.id;

                    const subscriptionObjectSkip = {
                        customer: customerId,
                        items: [{
                            plan: resPlan.rows[0].stripe_id
                        }],
                        payment_behavior: 'default_incomplete',
                        expand: ['latest_invoice.payment_intent'],
                    };
                    subscriptionObjectSkip.trial_period_days = process.env.SUBSCRIPTION_TRIAL_PERIOD;
console.log('here', subscriptionObjectSkip);

                    const subscriptionNewAfterSkip = await stripe.subscriptions.create(subscriptionObjectSkip);

                    if (subscriptionNewAfterSkip?.id) {
                        const subscriptionData = {
                            user_id: userData.user.id,
                            plan_id: userData.planId,
                            customer_id: customerId,
                            subscription_id: subscriptionNewAfterSkip.id,
                            status: subscriptionNewAfterSkip.status,
                            period_start: subscriptionNewAfterSkip.current_period_start,
                            period_end: subscriptionNewAfterSkip.current_period_end,
                            is_trial: true,
                        }
                        const querySubscription = `SELECT * FROM data.set_subscriptions('${JSON.stringify(subscriptionData)}');`;
                        await client.query(querySubscription);

                        // send mail about subscriotion
                        // const mail = await confirmSubscriptionEmail(userData.email, 'fr');
                        // sendMail(
                        //     userData.user.email,
                        //     mail.subject,
                        //     mail.body
                        // );

                    }

                    // SUBSCRIPTION CREATED AND HAS STATUS INCOMPLETE
                    // const uncompleteSubscr = await client.query(`SELECT * FROM data.subscriptions WHERE user_id=${userData.user.id} AND status='incomplete' ORDER BY updated_at DESC LIMIT 1`);
                    return { subscription: subscriptionNewAfterSkip, planId: userData.planId, paymentIntentSecret: paymentIntentSecret  };
// +++++++++++++++++++++++++
// +++++++++++++++++++++++++
// +++++++++++++++++++++++++
                    // update subscription
                    // const subscriptionAfterSkip = await stripe.subscriptions.update(
                    //     subscriptionNewAfterSkip.id,
                    //     {
                    //         payment_settings: {
                    //             payment_method_types: ['card'],
                    //         },
                    //     }
                    // );
                }
            } else {
                return { subscription: null, error: { code: 404, message: 'User Not found' } };
            }
            return { subscription: null, error: { code: 404, message: 'User Not found' } };
        } catch (e) {
            console.log(e.message)
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


    async createExistUserTrialSubscription(userData) {
        const client = await pool.connect();
        try {
            const resPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE id = '${userData.planId}'`);
            // const resSettings = await client.query('SELECT * FROM data.system_settings WHERE id=1');
            if (resPlan.rows.length) {
                if (resPlan.rows[0].stripe_id) {
                    let customerId;

                    const uncompleteSubscr = await client.query(`SELECT * FROM data.subscriptions WHERE user_id=${userData.user.id} AND status='incomplete' ORDER BY updated_at DESC LIMIT 1`);
                    if (uncompleteSubscr.rows.length > 0) {
                        userData.user.customer_id = uncompleteSubscr.rows[0].customer_id;
                    }
                    if (userData.user.customer_id) {
                        const customerStripe = await stripe.customers.retrieve(
                            userData.user.customer_id
                        );
                        if (!customerStripe || customerStripe?.deleted) {
                            userData.user.customer_id = null;
                        }
                    }
                    // check customer id from stripe
                    if (!userData.user.customer_id) {
                        const customer = await stripe.customers.create({
                            email: userData.user.email,
                            name: `${userData.user.first_name} ${userData.user.last_name}`
                        });
                        customerId = customer.id;
                    } else {
                        customerId = userData.user.customer_id;
                    }

                    // generate subscription always new for receive secret key for payment form;
                    const subscriptionObject = {
                        customer: customerId,
                        items: [{
                            plan: resPlan.rows[0].stripe_id
                        }],
                        payment_behavior: 'default_incomplete',
                        expand: ['latest_invoice.payment_intent'],
                    };
                    subscriptionObject.trial_period_days = process.env.SUBSCRIPTION_TRIAL_PERIOD;
                    const subscription = await stripe.subscriptions.create(subscriptionObject);

                    // if subscription created add record to DB
                    if (subscription?.id) {
                        const subscriptionData = {
                            user_id: userData.user.id,
                            plan_id: userData.planId,
                            customer_id: customerId,
                            subscription_id: subscription.id,
                            status: subscription.status,
                            period_start: subscription.current_period_start,
                            period_end: subscription.current_period_end,
                            is_trial: true,
                        }
                        // console.log("INSERT SUBSCRIPTION DATA", subscriptionData);
                        // console.log(`SELECT * FROM data.set_subscriptions('${JSON.stringify(subscriptionData)}');`);
                        const querySubscription = `SELECT * FROM data.set_subscriptions('${JSON.stringify(subscriptionData)}');`;
                        await client.query(querySubscription);
                    }
                    return { subscription: subscription, planId: userData.planId };
                    // return { subscription: {}, setupIntent: setupIntent, planId: userData.planId };
                }
            } else {
                return { subscription: null, error: { code: 404, message: 'User Not found' } };
            }
            return { subscription: null, error: { code: 404, message: 'User Not found' } };
        } catch (e) {
            console.log(e.message)
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
console.log('createExistUserSubscription');
            const resPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE id = '${userData.planId}'`);
            // const resSettings = await client.query('SELECT * FROM data.system_settings WHERE id=1');
            if (resPlan.rows.length) {
                if (resPlan.rows[0].stripe_id) {
                    let customerId;

                    // check if we have uncomplete subscription
                    // if (userData?.user?.id) {
                    //     console.log("ADD USER BUT NO HAVE THEM ID");
                    // }
                    const uncompleteSubscr = await client.query(`SELECT * FROM data.subscriptions WHERE user_id=${userData.user.id} AND status='incomplete' ORDER BY updated_at DESC LIMIT 1`);
                    if (uncompleteSubscr.rows.length > 0) {
                        userData.user.customer_id = uncompleteSubscr.rows[0].customer_id;
                    }
                    // check customer id from stripe
                    if (!userData.user.customer_id) {
                        const customer = await stripe.customers.create({
                            email: userData.user.email,
                            name: `${userData.user.first_name} ${userData.user.last_name}`
                        });
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
                    const subscriptionObject = {
                        customer: customerId,
                        items: [{
                            plan: resPlan.rows[0].stripe_id
                        }],
                        payment_behavior: 'default_incomplete',
                        expand: ['latest_invoice.payment_intent'],
                    };
                    subscriptionObject.trial_period_days = process.env.SUBSCRIPTION_TRIAL_PERIOD;
                    // if (userData.type === 'trial') {
                    //     subscriptionObject.trial_period_days = resSettings.rows[0].trial_period;
                    // } else {
                    //     subscriptionObject.coupon =  'free-period';
                    // }
                    const subscription = await stripe.subscriptions.create(subscriptionObject);
                    console.log("CREATED SUBSCRIPTION", subscription);

                    // if subscription created add record to DB
                    if (subscription?.id) {
                        const subscriptionData = {
                            user_id: userData.user.id,
                            plan_id: userData.planId,
                            customer_id: customerId,
                            subscription_id: subscription.id,
                            status: subscription.status,
                            period_start: subscription.current_period_start,
                            period_end: subscription.current_period_end,
                            is_trial: false
                        }
                        // console.log("INSERT SUBSCRIPTION DATA", subscriptionData);
                        // console.log(`SELECT * FROM data.set_subscriptions('${JSON.stringify(subscriptionData)}');`);
                        const querySubscription = `SELECT * FROM data.set_subscriptions('${JSON.stringify(subscriptionData)}');`;
                        await client.query(querySubscription);
                    }
                    // console.log("SUBSCRIPTION", subscription);
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
                    return { subscription: subscription, setupIntent: setupIntent, planId: userData.planId };
                    // return { subscription: {}, setupIntent: setupIntent, planId: userData.planId };
                }
            } else {
                return { subscription: null, error: { code: 404, message: 'User Not found' } };
            }
            return { subscription: null, error: { code: 404, message: 'User Not found' } };
        } catch (e) {
            console.log(e.message)
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
            const resChangeMethod = await stripe.customers.update(
                user.customer_id,
                {
                    invoice_settings: {
                        default_payment_method: paymentId
                    }
                }
            );
            return this.fetchSubscription(user.subscription_id, user.customer_id);
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

    async fetchSubscription(user, subscriptionId, customerId, isTrial = false) {
        const client = await pool.connect();
        try {
            let subscription;
            const currentSubscription = await stripe.subscriptions.retrieve(
                subscriptionId
            );
            const paymentMethods = await stripe.customers.listPaymentMethods(
                customerId,
                {type: 'card'}
            );
            const customer = await stripe.customers.retrieve(
                customerId
            );
            currentSubscription.paymentMethods = paymentMethods.data;
// console.log("Pyament Methods", paymentMethods.data);

            // getting all plans
            const dbPlansRes = await client.query('SELECT * FROM data.subscription_plans WHERE stripe_id IS NOT NULL');
            currentSubscription.dbPlans = dbPlansRes.rows;
            // getting current user plan
            if (currentSubscription.plan.id) {
                // console.log(`SELECT * FROM data.subscription_plans WHERE stripe_id = '${currentSubscription.plan.id}'`);
                const dbPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE stripe_id = '${currentSubscription.plan.id}'`);
                currentSubscription.dbUserPlan = dbPlan.rows[0];
                const userSubscrPlan = await client.query(`SELECT upgradet_at FROM data.subscriptions WHERE user_id=${user.id}`);
                currentSubscription.upgradet_at = userSubscrPlan.rows.length > 0 ?  userSubscrPlan.rows[0].upgradet_at : null;
                if (currentSubscription.upgradet_at) {
                    console.log(`SELECT data.subscriptions_upgrade.*,
                            data.subscription_plans.name AS plan_name
                            FROM data.subscriptions_upgrade
                            LEFT JOIN data.subscription_plans ON data.subscription_plans.id = data.subscriptions_upgrade.plan_id
                            WHERE user_id=${user.id}`);
                    const dbResUpgrade = await client.query(`SELECT data.subscriptions_upgrade.*,
                            data.subscription_plans.name AS plan_name
                            FROM data.subscriptions_upgrade
                            LEFT JOIN data.subscription_plans ON data.subscription_plans.id = data.subscriptions_upgrade.plan_id
                            WHERE user_id=${user.id}`);
                    if (dbResUpgrade.rows[0].status === 'cancel') {
                        currentSubscription.nameUpgrade = 'Cancel'
                    } else {
                        currentSubscription.nameUpgrade = dbResUpgrade.rows[0].plan_name;
                    }
                    currentSubscription.periodUpgrade = dbResUpgrade.rows[0].period_start;
                }
            }

            const endDate = new Date(currentSubscription.current_period_end * 1000);
            const startDate = new Date(currentSubscription.current_period_start * 1000);
            // const upgradeDate = currentSubscription.current_period_start ? new Date(currentSubscription.current_period_start * 1000) : '';
            currentSubscription.viewCreate = new Date(currentSubscription.created * 1000).toLocaleDateString();
            currentSubscription.periodStart = startDate.toLocaleDateString();
            currentSubscription.periodEnd = endDate.toLocaleDateString();

            const ONE_DAY = 1000 * 60 * 60 * 24;
            const differenceMs = Math.abs(new Date(currentSubscription.current_period_end * 1000) - new Date());
            currentSubscription.daysLeft = Math.round(differenceMs / ONE_DAY) - 1;

            currentSubscription.customer = customer;
            currentSubscription.defaultPayment = currentSubscription.customer.invoice_settings.default_payment_method;
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
            currentSubscription.invoicePdf = invoicePdf;
            return { subscription: currentSubscription };

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



    async getSubscriptionInfo(subscriptionId, customerId, isTrial = false) {
        const client = await pool.connect();
        try {
            const dbPlansRes = await client.query('SELECT * FROM data.subscription_plans WHERE stripe_id IS NOT NULL');
            let subscription;
            // console.log(dbPlansRes.rows);
            const stripeSubscription = await stripe.subscriptions.retrieve(
                subscriptionId
            );
            const nDate = new Date(stripeSubscription.current_period_start * 1000);
            console.log(stripeSubscription.current_period_start, nDate);
            console.log(customerId);



            if (customerId.includes('fake_subscription') || isTrial) {
                // getting subscription fron db
                const subscriptionRow = await client.query(`SELECT * FROM data.subscriptions WHERE customer_id='${customerId}'`);
                const subscriptionFakeData = subscriptionRow.rows[0];
                subscriptionFakeData.is_fake = true;
                subscriptionFakeData.paymentMethods = [];
                if (customerId.includes('cus_')) {
                    const paymentMethods = await stripe.customers.listPaymentMethods(
                        customerId,
                        {type: 'card'}
                    );
                    const customer = await stripe.customers.retrieve(
                        customerId
                    );
                    subscriptionFakeData.defaultPayment = customer.invoice_settings.default_payment_method;
                    subscriptionFakeData.defaultPlanId = 1;
                    subscriptionFakeData.dbPlans = dbPlansRes.rows;
                    subscriptionFakeData.paymentMethods = paymentMethods.data;
                    subscriptionFakeData.paymentPlanList = await paymentPlanModel.fetchItems();

                    const resSubscription = await client.query(`SELECT * FROM data.subscription_plans WHERE id='${subscriptionFakeData.plan_id}'`);
                    subscriptionFakeData.plan = resSubscription.rows[0];
                }
                return { subscription: subscriptionFakeData };
            } else if (customerId.includes('cus_')) {
                console.log('here');
                const paymentMethods = await stripe.customers.listPaymentMethods(
                    customerId,
                    {type: 'card'}
                );
                const customer = await stripe.customers.retrieve(
                    customerId
                );
                subscriptionFakeData.defaultPayment = customer.invoice_settings.default_payment_method;
                subscriptionFakeData.defaultPlanId = 1;
                subscriptionFakeData.dbPlans = dbPlansRes.rows;
                subscriptionFakeData.paymentMethods = paymentMethods.data;
                const resSubscription = await client.query(`SELECT * FROM data.subscription_plans WHERE id='${subscriptionId}'`);
                subscriptionFakeData.plan = resSubscription.rows[0];
                // subscriptionFakeData.plan.id = "dsadasd";
                // console.log("FAKE SUBSCRIPTION WITH REAL STRIPE CUSTOMER", subscriptionFakeData);
            }
            else {
                subscription = await stripe.subscriptions.retrieve(
                    subscriptionId
                );
            }
            const paymentMethods = await stripe.customers.listPaymentMethods(
                customerId,
                {type: 'card'}
            );
            const customer = await stripe.customers.retrieve(
                customerId
            );
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

    async createUserFromSubscription(userData ,planId, type, forFree = '') {
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
                return { user: resUser.rows[0], error: null };
                // return await this.createExistUserSubscription({ user: resUser.rows[0], type: type, planId:planId }, resUser.rows[0]);
                // return await this.createExistUserSubscription({ user: userData, type: type, planId:planId }, resUser.rows[0]);
            }
        } catch (e) {

        } finally {
            client.release();
        }
    }
    async checkPaymentOld(paymentIntent, paymentIntentSecret, planId, type, user = '') {
        const client = await pool.connect();
        try {
            let paymentIntentResult;
            // paymentIntentResult = await stripe.setupIntents.retrieve(
            //     paymentIntent
            // );

            if (type === 'useSetup') {
                console.log("paymentIntent", paymentIntent);
                paymentIntentResult = await stripe.setupIntents.retrieve(
                    paymentIntent
                );
                // paymentIntentResult = await stripe.paymentIntents.retrieve(
                //     paymentIntent
                // );
                console.log('paymentIntentResult:', paymentIntentResult)
            } else {
                // =======================================================================
                // =======================================================================
                // payment intent after registration->select plan->add card (WORK VARIANT)
                // =======================================================================
                // =======================================================================
                paymentIntentResult = await stripe.paymentIntents.retrieve(
                    paymentIntent
                );
            }


            // ========================================================
            // console.log("TYPE 2", paymentIntentResultType2);
            // if (type === 'fromPricing') {
            //     paymentIntentResult = await stripe.setupIntents.retrieve(
            //         paymentIntent
            //     );
            // } else {
            //     paymentIntentResult = await stripe.paymentIntents.retrieve(
            //         paymentIntent
            //     );
            // }
            // console.log("[paymentIntentResult]", paymentIntentResult.client_secret);
            // console.log("[paymentIntentSecret]", paymentIntentSecret);
            // console.log("[paymentIntentResult.client_secret]", paymentIntentSecret);
            // const subscription = await stripe.subscriptions.retrieve(
            //     'sub_1NYBa5DBSh7ykoyW6Qu4fGS4'
            // );
            // console.log(paymentIntentResult.client_secret, paymentIntentSecret);

            // console.log('[User.checkPayment] STRIPE PAYMENT INTENT', paymentIntentResult);
            // if (paymentIntentResult.client_secret === paymentIntentSecret) {
            console.log("STRIPE SECRET", paymentIntentResult.client_secret);
            console.log("URL SECRET", paymentIntentSecret);
            console.log("STRIPE INTENT", paymentIntentResult.client_secret);
            console.log("URL INTENT", paymentIntentSecret);
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
                // console.log(`SELECT * FROM data.subscription_plans WHERE id = '${planId}'`);
                // exit;
                // const resPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE id = '${planId}'`);
                const resPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE id = '${dbUser.plan_id}'`);
                const resSettings = await client.query('SELECT * FROM data.system_settings WHERE id=1');
                if (resPlan.rows.length) {
                    // const subscriptionObject = {
                    //     customer: paymentIntentResult.customer,
                    //     items: [{
                    //         plan: resPlan.rows[0].stripe_id
                    //     }],
                    //     payment_behavior: 'default_incomplete',
                    //     expand: ['latest_invoice.payment_intent'],
                    // };
                    // subscriptionObject.coupon =  'free-period';
                    // if (type === 'trial') {
                    //     subscriptionObject.trial_period_days = resSettings.rows[0].trial_period;
                    // } else {
                    //     subscriptionObject.coupon =  'free-period';
                    // }
                    // const subscription = await stripe.subscriptions.create(subscriptionObject);
                    // const dbSubscription = {
                    //     user_id: dbUser.id,
                    //     plan_id: planId,
                    //     customer_id: paymentIntentResult.customer,
                    //     subscription_id: subscription.id,
                    //     status: subscription.status,
                    //     period_start: subscription.current_period_start,
                    //     period_end: subscription.current_period_end,
                    //     is_trial: type === 'trial'
                    // }
                    // const _querySubscription = `SELECT * FROM data.set_subscriptions('${JSON.stringify(dbSubscription)}');`;
                    // await client.query(_querySubscription);
                    //
                    // const querySubscription = `UPDATE data.subscriptions SET status='${subscription.status}' WHERE customer_id='${paymentIntentResult.customer}'`;
                    const querySubscription = `UPDATE data.subscriptions SET status='${paymentIntentResult.status}' WHERE customer_id='${paymentIntentResult.customer}'`;
                    // console.log(paymentIntentResult.status)
                    if (paymentIntentResult.status === 'succeeded') {
                        console.log('[User.checkPayment] succeeded querySubscription = ', querySubscription);
                        await client.query(querySubscription);
                    }
                    const subscriptionRes = await client.query(`SELECT email, price FROM data.users
                    LEFT JOIN data.subscriptions ON data.subscriptions.user_id=data.users.id
                    LEFT JOIN data.subscription_plans ON data.subscription_plans.id = data.subscriptions.plan_id
                    WHERE customer_id='${paymentIntentResult.customer}'`);

                    if (subscriptionRes.rows.length) {
                        paymentIntentResult.email = subscriptionRes.rows[0].email;
                        // send email about success payment and subscription
                        // const mail = await confirmSubscriptionEmail(subscriptionRes.rows[0].email, 'fr');
                        // sendMail(
                        //     subscriptionRes.rows[0].email,
                        //     mail.subject,
                        //     mail.body
                        // );

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

    async checkPaymentAfterSkip(paymentIntent, paymentIntentSecret, planId, customerId = '') {
        const client = await pool.connect();
        try {
            let paymentIntentResult;
            paymentIntentResult = await stripe.paymentIntents.retrieve(
                paymentIntent
            );
            console.log("STRIPE SECRET", paymentIntentResult.client_secret);
            console.log("URL SECRET", paymentIntentSecret);
            console.log("STRIPE INTENT", paymentIntentResult.client_secret);
            console.log("URL INTENT", paymentIntentSecret);
            if (paymentIntentResult.client_secret === paymentIntentSecret) {
                console.log('paymentIntentResult:', paymentIntentResult);
                const paymentMethods = await stripe.paymentMethods.list({
                    type: 'card',
                    limit: 3,
                    customer: customerId,
                });
                console.log("Payment Methods ID", paymentMethods.data[0].id);
                // const customer = await stripe.customers.update(
                //     'cus_FOsk5sbh3ZQpAU',
                //     {
                //         invoice_settings: {
                //             default_payment_method: 'pm_1F0c9v2eZvKYlo2CJDeTrB4n',
                //         },
                //     }
                // );
                const methodUpdateResult = await stripe.customers.update(
                    customerId,
                    {
                        invoice_settings: {
                            default_payment_method: paymentMethods.data[0].id
                        }
                    }
                );
                console.log('RESULT UPDATE', methodUpdateResult);
                const stripeCustomer = await stripe.customers.retrieve(methodUpdateResult.id);






                const dbUser = await this.findUserByEmail(stripeCustomer.email);


                const resPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE id = '${dbUser.plan_id}'`);
                const resSettings = await client.query('SELECT * FROM data.system_settings WHERE id=1');
                if (resPlan.rows.length) {
                    const querySubscription = `UPDATE data.subscriptions SET status='${paymentIntentResult.status}' WHERE customer_id='${paymentIntentResult.customer}'`;
                    // console.log(paymentIntentResult.status)
                    if (paymentIntentResult.status === 'succeeded') {
                        console.log('[User.checkPayment] succeeded querySubscription = ', querySubscription);
                        await client.query(querySubscription);
                    }
                    const subscriptionRes = await client.query(`SELECT email, price FROM data.users
                    LEFT JOIN data.subscriptions ON data.subscriptions.user_id=data.users.id
                    LEFT JOIN data.subscription_plans ON data.subscription_plans.id = data.subscriptions.plan_id
                    WHERE customer_id='${paymentIntentResult.customer}'`);

                    if (subscriptionRes.rows.length) {
                        paymentIntentResult.email = subscriptionRes.rows[0].email;

                        const mailPayment = await confirmSubscriptionPaymentEmail(subscriptionRes.rows[0].email, 'fr', subscriptionRes.rows[0].price);
                        sendMail(
                            subscriptionRes.rows[0].email,
                            mailPayment.subject,
                            mailPayment.body
                        );

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

    async checkPayment(paymentIntent, paymentIntentSecret, planId, type, user = '') {
        const client = await pool.connect();
        try {
            let paymentIntentResult;
            if (type === 'useSetup') {
                console.log("paymentIntent", paymentIntent);
                paymentIntentResult = await stripe.setupIntents.retrieve(
                    paymentIntent
                );
                console.log('paymentIntentResult:', paymentIntentResult)
            } else {
                // =======================================================================
                // =======================================================================
                // payment intent after registration->select plan->add card (WORK VARIANT)
                // =======================================================================
                // =======================================================================
                paymentIntentResult = await stripe.paymentIntents.retrieve(
                    paymentIntent
                );
            }
            // console.log("STRIPE SECRET", paymentIntentResult.client_secret);
            // console.log("URL SECRET", paymentIntentSecret);
            // console.log("STRIPE INTENT", paymentIntentResult.client_secret);
            // console.log("URL INTENT", paymentIntentSecret);
            if (paymentIntentResult.client_secret === paymentIntentSecret) {
                // setup payment intent as default payment method
                console.log('AAAAA', paymentIntentResult);
                const x = await stripe.customers.update(
                    paymentIntentResult.customer,
                    {
                        invoice_settings: {
                            default_payment_method: paymentIntentResult.payment_method
                        }
                    }
                );
                console.log('RESULT UPDATE', paymentIntentResult);
                const stripeCustomer = await stripe.customers.retrieve(paymentIntentResult.customer);
                const dbUser = await this.findUserByEmail(stripeCustomer.email);
                const resPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE id = '${dbUser.plan_id}'`);
                const resSettings = await client.query('SELECT * FROM data.system_settings WHERE id=1');
                if (resPlan.rows.length) {
                    const querySubscription = `UPDATE data.subscriptions SET status='${paymentIntentResult.status}' WHERE customer_id='${paymentIntentResult.customer}'`;
                    // console.log(paymentIntentResult.status)
                    if (paymentIntentResult.status === 'succeeded') {
                        console.log('[User.checkPayment] succeeded querySubscription = ', querySubscription);
                        await client.query(querySubscription);
                    }
                    const subscriptionRes = await client.query(`SELECT email, price FROM data.users
                    LEFT JOIN data.subscriptions ON data.subscriptions.user_id=data.users.id
                    LEFT JOIN data.subscription_plans ON data.subscription_plans.id = data.subscriptions.plan_id
                    WHERE customer_id='${paymentIntentResult.customer}'`);

                    if (subscriptionRes.rows.length) {
                        paymentIntentResult.email = subscriptionRes.rows[0].email;

                        const mailPayment = await confirmSubscriptionPaymentEmail(subscriptionRes.rows[0].email, 'fr', subscriptionRes.rows[0].price);
                        sendMail(
                            subscriptionRes.rows[0].email,
                            mailPayment.subject,
                            mailPayment.body
                        );

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

    async findUserByEmailOnly(email) {
        const client = await pool.connect();
        const res = await client.query(`SELECT * FROM data.users WHERE email='${email}'`);

        return res.rows.length > 0 ? res.rows[0] : null;
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
            await client.query(`
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
            const user = await this.findUserByEmailOnly(userData.email);
            await client.query(`UPDATE data.users SET selected_locale='${userData.locale}' WHERE id=${user.id}`)
            user.selected_locale = userData.locale;

            if (user) {
                user.subscription = null;
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
            // console.log(query);
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
            if (res.rows.length === 0) {
                await client.query(`INSERT INTO data.addresses (user_id, address_type, country_id) VALUES ${userId}, 'home address', 1)`);
                const queryInstr = `SELECT * FROM data.addresses WHERE user_id='${userId}' ORDER BY id DESC;`;
                const resInsrt = await client.query(queryInstr);
            }
            return res.rows ? res.rows[0] : resInsrt.rows[0];
            // return res.rows ? res.rows[0] : null;
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
    async saveSellerAddress(userId, addressData) {
        const client = await pool.connect();

        try {
            await client.query(`UPDATE data.users SET full_address='${addressData}' WHERE id='${userId}'`);

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
     *
     * @param email
     * @param userId
     * @returns {Promise<{error: {code: number, message: string}, user: null}|{success: boolean}>}
     */
    async updateEmail(email, userId) {
        const client = await pool.connect();
        try {
            const query = `UPDATE data.users SET email='${email}' WHERE id='${userId}';`;
            await client.query(query);
            return { success: true };
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
    async activateByHash(hash, params) {
        const client = await pool.connect();
        const locale = params.locale;
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
        console.log(data.data_access_expiration_time);
        const userFbId = data.userID;

        // need to get user long live token
        // console.log('GET LONG LIVE USER TOKEN RESPONSE');
        // console.log(`https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${data.accessToken}`)
        // getting long live token
        const longToken = await axios
            .get(
                `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${data.accessToken}`
            )
            .then(async (responseLongToken) => {
                console.log("LONG LIVE TOKEN RESPONSE", responseLongToken.data);
                await client.query(`UPDATE data.users SET long_live_access_token='${responseLongToken.data.access_token}' WHERE id=${userData.id}`);

                return responseLongToken.data.access_token
            });

        try {
            if (data.accessToken) {
                await axios
                    .get(
                        `https://graph.facebook.com/v18.0/me/accounts?fields=picture{url},name,fan_count,access_token&access_token=${longToken}`
                    )
                    .then(async (responsePages) => {
                        if (responsePages.data.error) {
                            store.dispatch(setErrorToastAction('Could no getting stores list'));
                        } else {
                            const storesList = responsePages.data;
                            // getting picture for store
                            let storePicture = '';
                            storesList.data.forEach(async (store) => {
                                // const queryUpdate = await client.query(`UPDATE data.user_stores SET synchronized = false WHERE account_id='${userFbId}' AND store_id='${store.id}'`);
                                const queryStore = await client.query(`SELECT * FROM data.user_stores WHERE account_id='${userFbId}' AND store_id='${store.id}'`);
                                if (queryStore.rows.length === 0) {
                                    await  client.query(`
                                                    INSERT INTO data.user_stores (account_id, store_id, access_token, name, user_id, fan_count, synchronized, picture)
                                                    VALUES
                                                    (
                                                        '${userFbId}',
                                                        '${store.id}',
                                                        '${store.access_token}',
                                                        '${store.name}',
                                                        '${userData.id}',
                                                        '${store.fan_count}',
                                                        true,
                                                        '${store.picture.data.url}'
                                                    );`
                                    );
                                } else {
                                    await  client.query(`
                                                    UPDATE data.user_stores SET
                                                        access_token='${store.access_token}',
                                                        name='${store.name}',
                                                        picture='${store.picture.data.url}',
                                                        fan_count='${store.fan_count}',
                                                        synchronized=true
                                                    WHERE account_id='${userFbId}' AND store_id='${store.id}';`
                                    );
                                    // console.log('GET LONG LIVE USER TOKEN RESPONSE');
                                    // console.log(`https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${store.access_token}`)
                                    // // getting long live token
                                    // await axios
                                    //     .get(
                                    //         `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${store.access_token}`
                                    //     )
                                    //     .then(async (responseLongToken) => {
                                    //         console.log("LONG LIVE TOKEN RESPONSE", responseLongToken.data);
                                    //     });
                                }
                            })
                        }

                        const { data } = responsePages;
                        // console.log("Users account connected pages", dataPages);
                        if (data.error) {
                            store.dispatch(setErrorToastAction('Could no getting stores list'));
                        }
                    });
            }
        } catch (e) {
            console.log(e.message);
        }

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
                updated_at: '',
                doctype: false,
                privacy_doc: '',
                terms_doc: '',
                delivery_doc: '',
                return_doc: '',
                privacy_link: '',
                terms_link: '',
                delivery_link: '',
                return_link: ''
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

    async addPaymentMethodBySubscription(data) {
        const client = await pool.connect();
        try {
            const expPeriod = data.card_expire_date.split('/');
            const locale = data.locale;
            let customerId;
            const dbSubscriptionData = await client.query(`SELECT * from data.subscriptions WHERE
                subscription_id='${data.subscription.id}'`);
            if (dbSubscriptionData.rows.length > 0) {
                customerId = dbSubscriptionData.rows[0].customer_id;

                const userData = await client.query(`SELECT * from data.users WHERE id='${dbSubscriptionData.rows[0].user_id}'`)
                const user = userData.rows[0];
                user.customer_id = customerId;
                await stripe.customers.listPaymentMethods(
                    customerId,
                    {type: 'card'}
                );
                const paymentMethodCreate = await stripe.paymentMethods.create({
                    type: 'card',
                    card: {
                        number: data.card_number,
                        exp_month: expPeriod[0],
                        exp_year: expPeriod[1],
                        cvc: data.card_ccv,
                    },
                });
                await stripe.paymentMethods.attach(
                    paymentMethodCreate.id,
                    {customer: customerId}
                );
                await stripe.customers.update(
                    customerId,
                    {
                        invoice_settings: {
                            default_payment_method: paymentMethodCreate.id
                        }
                    }
                );

                // send mail about subscription
                const mail = await confirmSubscriptionEmail(user.email, locale ? locale : 'fr');

                sendMail(
                    user.email,
                    mail.subject,
                    mail.body
                );

                return { success: true, user: user,  };
            }
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


    async addPaymentMethod(user, data) {
        const client = await pool.connect();
console.log('BROKEN 2');
        try {
            const expPeriod = data.card_expire_date.split('/');
            // if it fake subscription we need to create stripe customer and after add card to their account
            if (user.customer_id.includes("fake_subscription")) {
                let customerId;
                // create custome on stripe
                const customer = await stripe.customers.create({
                    email: user.email,
                    name: `${user.first_name} ${user.last_name}`
                });
                customerId = customer.id;
                // const queryUpdSubscr = `UPDATE data.subscriptions SET customer_id='${customerId}' WHERE user_id=${user.id};`;
                // const resUpd = await client.query(`UPDATE data.subscriptions SET customer_id='${customerId}' WHERE user_id=${user.id};`);
                // const resUpd = await client.query(`DELETE FROM data.subscriptions WHERE user_id=${user.id};`);
                user.customer_id = customerId;
                await stripe.customers.listPaymentMethods(
                    customerId,
                    {type: 'card'}
                );
                const paymentMethodCreate = await stripe.paymentMethods.create({
                    type: 'card',
                    card: {
                        number: data.card_number,
                        exp_month: expPeriod[0],
                        exp_year: expPeriod[1],
                        cvc: data.card_ccv,
                    },
                });
                console.log("CREATED PAYMENT METHOD", paymentMethodCreate.id);
                await stripe.paymentMethods.attach(
                    paymentMethodCreate.id,
                    {customer: customerId}
                );
                await stripe.customers.update(
                    customerId,
                    {
                        invoice_settings: {
                            default_payment_method: paymentMethodCreate.id
                        }
                    }
                );
                return { success: true, error: null };
            } else {
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
            }
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

    async fetchSubscriptionsForUpdate() {
        const client = await pool.connect();
        const subscriptionData = await client.query(`SELECT * FROM data.subscriptions_upgrade LIMIT 20`);
        return {success: true, data: subscriptionData.rows.length > 0 ? subscriptionData.rows : []}
    }

    async upgradeSubscription(user, planId, locale) {
        const client = await pool.connect();
        const dbSubscriptionInfo = await client.query(`SELECT * from data.subscriptions WHERE user_id=${user.id}`);
        const dbPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE stripe_id='${planId}'`);
        const customerId = dbSubscriptionInfo.rows[0].customer_id;
        try {
            if (dbPlan.rows[0].name === 'Platinum') {
                const mail = await sendPlatinumEmail(user, locale);
                sendMailPlatinum(
                    process.env.EMAIL_PLATINUM,
                    mail.subject,
                    mail.body
                );
                return { success: true, error: null, planId: 'platinum' };
            } else {
                const upgrDate = moment(dbSubscriptionInfo.rows[0].period_end, "YYYY-mm-dd HH:mm").format('YYYY-MM-DD HH:mm:ss');
                const ts = moment(dbSubscriptionInfo.rows[0].period_end, "YYYY-MM-DD HH:mm").unix();
                const m = moment.unix(ts);
                const upgradeSubscription = {
                    user_id: user.id,
                    plan_id: dbPlan.rows[0].id,
                    customer_id: customerId,
                    subscription_id: dbSubscriptionInfo.rows[0].subscription_id,
                    period_start: m / 1000,
                    period_end: m / 1000,
                    status: 'change'
                }
                const _querySubscription = `SELECT * FROM data.set_subscriptions_upgrade('${JSON.stringify(upgradeSubscription)}');`;
// console.log(_querySubscription);
                await client.query(_querySubscription);
                await client.query(`UPDATE data.subscriptions SET upgradet_at='${upgrDate}' WHERE user_id=${user.id}`);

                return { success: true, error: null, planId: null };
            }

        } catch (e) {
            console.log(e.message);
        }
    }

    async cancelSubscription(user, planId) {
        const client = await pool.connect();
        const dbSubscriptionInfo = await client.query(`SELECT * from data.subscriptions WHERE user_id=${user.id}`);
        const dbPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE id='${dbSubscriptionInfo.rows[0].plan_id}'`);
        const customerId = dbSubscriptionInfo.rows[0].customer_id;
        try {
            const upgrDate = moment(dbSubscriptionInfo.rows[0].period_end, "YYYY-mm-dd HH:mm").format('YYYY-MM-DD HH:mm:ss');
            const ts = moment(dbSubscriptionInfo.rows[0].period_end, "YYYY-MM-DD HH:mm").unix();
            const m = moment.unix(ts);
            const upgradeSubscription = {
                user_id: user.id,
                plan_id: dbPlan.rows[0].id,
                customer_id: customerId,
                subscription_id: dbSubscriptionInfo.rows[0].subscription_id,
                period_start: m / 1000,
                period_end: m / 1000,
                status: 'cancel'
            }
            // console.log(upgradeSubscription);
            const _querySubscription = `SELECT * FROM data.set_subscriptions_upgrade('${JSON.stringify(upgradeSubscription)}');`;
            await client.query(_querySubscription);
            await client.query(`UPDATE data.subscriptions SET upgradet_at='${upgrDate}' WHERE user_id=${user.id}`);

            return { success: true, error: null };
        } catch (e) {
            console.log(e.message);
        }
    }

    async cancelSubscriptionOld(user) {
        const client = await pool.connect();
        const dbSubscriptionInfo = await client.query(`SELECT * from data.subscriptions WHERE user_id=${user.id}`);
        const customerId = dbSubscriptionInfo.rows[0].customer_id;
        const subscription = await stripe.subscriptions.retrieve(user.subscription_id);


        const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
            customer: subscription.customer,
            subscription: subscription.id
        });
        // find prorated amount
        const paymentIntents = await stripe.paymentIntents.list({
            limit: 3,
            customer: subscription.customer,
        });
        const paymentIntent = paymentIntents.data[0].id;
        const amountRemaining = upcomingInvoice.amount_remaining;

        const ONE_DAY = 1000 * 60 * 60 * 24;
        const differenceMs = Math.abs(new Date(subscription.current_period_end * 1000) - new Date(subscription.current_period_start * 1000));
        const daysLeft = Math.round(differenceMs / ONE_DAY) - 2;
        const refundAmount = parseInt(amountRemaining/30)*daysLeft;

        console.log('amountRemaining', amountRemaining)
        console.log('dayLeft', daysLeft);
        console.log(parseInt(amountRemaining/30)*daysLeft)

        if (refundAmount > 0  && paymentIntent) {
            await stripe.refunds.create({
                payment_intent: paymentIntent,
                amount: refundAmount,
            });
        }

        return { success: true, error: null };
    }

    async recurringPaymentList() {
        const client = await pool.connect();
        try {
            const currentDay = parseInt(moment().format('DD'));
            const queryStr = `SELECT  EXTRACT(month FROM period_start::date) as sub_month,
                    EXTRACT(day FROM period_start::date) as sub_day, data.subscriptions.*,
                    data.subscription_plans.price,
                    data.users.email
                    FROM data.subscriptions
                    LEFT JOIN data.users ON data.users.id = data.subscriptions.user_id
                    LEFT JOIN data.subscription_plans ON data.subscription_plans.id = data.subscriptions.plan_id
                    WHERE EXTRACT(day FROM period_start::date) = ${currentDay} 
                    AND data.subscriptions.status='active' AND notice_send IS NULL;';`;
            const res = await client.query(queryStr);
            return { success: false, data: res.rows.length > 0 ? res.rows : [] };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.log(e.message)
                logger.log(
                    'error',
                    'Stripe Add Payment Method Error:',
                    {message: e.message}
                );
            }
            return { success: false, error: e.message };
        }
    }

    async updateSubscriptionUpgradePlan(userId, data) {
        const client = await pool.connect();
        try {
            const planId = data.plan_id;
            const oldSubscriptionId = data.subscription_id;
            const customerId = data.customer_id;

            const dbPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE stripe_id='${planId}'`);
            const dbSubscriptionInfo = await client.query(`SELECT * from data.subscriptions WHERE user_id=${userId}`);

            if (data.status === 'cancel') {
                try {
                    const cancelSubscription = await stripe.subscriptions.cancel(oldSubscriptionId);
                    await client.query(`UPDATE data.subscriptions 
                            SET status='cancel', upgradet_at=null WHERE user_id=${userId}`);
                    await client.query(`DELETE FROM data.subscriptions_upgrade WHERE user_id=${userId}`);

                    return { success: true, error: null };
                } catch (e) {
                    console.log(e.message);
                }
            } else {
                const paymentIntents = await stripe.paymentIntents.list({
                    limit: 3,
                    customer: customerId,
                });
                const dbPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE id='${planId}'`);
                const subscriptioPlanId = dbPlan.rows[0].stripe_id;

                const subscriptionObject = {
                    customer: customerId,
                    items: [{
                        plan: subscriptioPlanId
                    }],
                    collection_method: 'charge_automatically',
                };
                const subscriptionNew = await stripe.subscriptions.create(subscriptionObject);

                // cancel old subscription
                const cancelPrevSubscription = await stripe.subscriptions.cancel(oldSubscriptionId);
                console.log('CANCEL SUBSCRIPTION', cancelPrevSubscription);

                // update subscription DB
                const periodStartNew =  new Date();
                const periodEndNew  = new Date();
                periodEndNew.setMonth(periodEndNew.getMonth() + 1);
                const timestampStartNew = periodStartNew.getTime();
                const timestampEndNew = periodEndNew.getTime();
                const dbSubscription = {
                    user_id: userId,
                    customer_id: customerId,
                    plan_id: dbPlan.rows[0].id,
                    subscription_id: `${subscriptionNew.id}`,
                    status: 'active',
                    period_start: timestampStartNew/1000,
                    period_end: timestampEndNew/1000,
                    is_trial: false
                }
                const _querySubscription = `SELECT * FROM data.set_subscriptions('${JSON.stringify(dbSubscription)}');`;
                await client.query(_querySubscription);
                await client.query(`DELETE FROM data.subscriptions_upgrade WHERE user_id=${userId}`);
                await client.query(`UPDATE data.subscriptions 
                            SET upgradet_at=null WHERE user_id=${userId}`);

                const userInfo = await client.query(`SELECT * FROM data.users WHERE id=${userId}`)
                const mail = await changeSubscriptionPlanEmail(userInfo.rows[0].email, userInfo.rows[0].selected_locale);
                sendMail(
                    userInfo.rows[0].email,
                    mail.subject,
                    mail.body
                );

            }

            return { success: true, error: null };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Stripe Add Payment Method Error:',
                    {message: e.message}
                );
            }
            return { success: false, error: e.message };
        }
    }

    async updateSubscriptionPlan(user, planId) {
        const client = await pool.connect();
        try {
            const dbSubscriptionInfo = await client.query(`SELECT * from data.subscriptions WHERE user_id=${user.id}`);
            const customerId = dbSubscriptionInfo.rows[0].customer_id;
            const oldSubscriptionId = dbSubscriptionInfo.rows[0].customer_id;
console.log('BROKEN 2')
            // REFUNDING METHANIZM
            // const periodStart =  new Date();
            // const timestampStart = periodStart.getTime();
            // const paymentMethods = await  stripe.paymentMethods.list({ customer: user.customer_id, type: 'card' });
            const subscription = await stripe.subscriptions.retrieve(user.subscription_id);
            // getting how days left
            // getting upcoming invoces
            const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
                customer: subscription.customer,
                subscription: subscription.id
            });
            const amountRemaining = upcomingInvoice.amount_remaining;
            const ONE_DAY = 1000 * 60 * 60 * 24;
            const differenceMs = Math.abs(new Date(subscription.current_period_end * 1000) - new Date(subscription.current_period_start * 1000));
            const daysLeft = Math.round(differenceMs / ONE_DAY) - 2;
            const refundAmount = parseInt(amountRemaining/30)*daysLeft;

            console.log(refundAmount);
            // find prorated amount
            const paymentIntents = await stripe.paymentIntents.list({
                limit: 3,
                customer: subscription.customer,
            });
            // const invoicePayment = paymentIntents.data[0].invoice;
            // const paymentIntentMethod = paymentIntents.data[0].payment_method;
            // const amountPayed = upcomingInvoice.amount_due;
            const paymentIntent = paymentIntents.data[0].id;

            // const amountRemaining = upcomingInvoice.amount_remaining;
            if (refundAmount > 0 && paymentIntent) {
                // refund payement
                // try {
                //     await stripe.refunds.create({
                //         payment_intent: paymentIntent,
                //         amount: refundAmount,
                //     });
                // } catch (e) {
                //     console.log(e.message);
                // }
                try {
                    const cancelSubscription = await stripe.subscriptions.cancel(oldSubscriptionId);
                } catch (e) {
                    console.log(e.message);
                }

                const subscriptionObject = {
                    customer: customerId,
                    items: [{
                        plan: planId
                    }],
                    collection_method: 'charge_automatically',
                };
                try {
                    const subscriptionNew = await stripe.subscriptions.create(subscriptionObject);
                    console.log("NEW SUBSCRIPTION", subscriptionNew);

                    // update subscription DB
                    const dbPlan = await client.query(`SELECT * FROM data.subscription_plans WHERE stripe_id='${planId}'`);
                    const periodStartNew =  new Date();
                    const periodEndNew  = new Date();
                    periodEndNew.setMonth(periodEndNew.getMonth() + 1);
                    const timestampStartNew = periodStartNew.getTime();
                    const timestampEndNew = periodEndNew.getTime();
                    const dbSubscription = {
                        user_id: user.id,
                        customer_id: customerId,
                        plan_id: dbPlan.rows[0].id,
                        subscription_id: `${subscriptionNew.id}`,
                        status: 'active',
                        period_start: timestampStartNew/1000,
                        period_end: timestampEndNew/1000,
                        is_trial: true
                    }
                    const _querySubscription = `SELECT * FROM data.set_subscriptions('${JSON.stringify(dbSubscription)}');`;
                    await client.query(_querySubscription);
                } catch (e) {
                    console.log(e.message);
                }
            }
            return { success: true, error: null };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Stripe Add Payment Method Error:',
                    {message: e.message}
                );
            }
            return { success: false, error: e.message };
        }
    }


    async unsubscribe() {
        const client = await pool.connect();
        try {
            const userRes = await client.query(`SELECT subscription_id FROM data.users
                    LEFT JOIN data.subscriptions ON data.subscriptions.user_id = data.users.id WHERE data.users.email = 'plan@123.com'`);
            return { success: true, error: null };
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

    async getSessionReminderList() {
        const client = await pool.connect();
        try {
            const query = `SELECT data.live_sessions.id AS lsid, data.users.selected_locale, data.users.email, event_date, event_time,
                (event_time - '${moment().format('HH:mm:ss')}') AS time_diff
                FROM data.live_sessions 
                LEFT JOIN data.users ON data.users.id = data.live_sessions.user_id
                WHERE status='scheduled' AND event_date='${moment().format('YYYY-MM-DD')}' AND
                event_time > '${moment().add(1, 'hours').format('HH:mm:ss')}'
                 AND data.live_sessions.notice_sended IS NULL LIMIT 20
                ;`;
            console.log(query);
            const data = await client.query(query);
            if (data.rows.length > 0) {
                await data.rows.forEach(async session => {
                    // if (session.time_diff.hours === 1 && session.time_diff.minutes <= 10) {
                    if (session.time_diff.hours === 1) {
                        const mail = await sessionSyncEmail(session, session.selected_locale ? session.selected_locale : 'fr');

                        sendMail(
                            session.email,
                            mail.subject,
                            mail.body
                        );

                        await client.query(`UPDATE data.live_sessions SET notice_sended=true
                            WHERE id='${session.lsid}'`)
                    }
                })
            }
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

    async setLocale(userId, locale) {
        const client = await pool.connect();
        try {
            const query = `UPDATE data.users SET selected_locale='${locale}' WHERE id=${userId};`;
            await client.query(query);
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

    async updateSellerLinkSettings(userId, data) {
        const client = await pool.connect();
        try {
            if (data.privacy_link) {
                const query = `INSERT INTO data.seller_settings(user_id, privacy_link)
                    VALUES ($1, $2) ON CONFLICT ON CONSTRAINT seller_settings__pkey DO UPDATE SET
                        privacy_link = EXCLUDED.privacy_link;`;
                await client.query(query, [userId, data.privacy_link]);
            } else {
                const query = `INSERT INTO data.seller_settings(user_id, privacy_link)
                    VALUES ($1, $2) ON CONFLICT ON CONSTRAINT seller_settings__pkey DO UPDATE SET
                        privacy_link = EXCLUDED.privacy_link;`;
                await client.query(query, [userId, '']);
            }
            if (data.terms_link) {
                const query = `INSERT INTO data.seller_settings(user_id, terms_link)
                    VALUES ($1, $2) ON CONFLICT ON CONSTRAINT seller_settings__pkey DO UPDATE SET
                        terms_link = EXCLUDED.terms_link;`;
                await client.query(query, [userId, data.terms_link]);
            } else {
                const query = `INSERT INTO data.seller_settings(user_id, terms_link)
                    VALUES ($1, $2) ON CONFLICT ON CONSTRAINT seller_settings__pkey DO UPDATE SET
                        terms_link = EXCLUDED.terms_link;`;
                await client.query(query, [userId, '']);
            }
            if (data.delivery_link) {
                const query = `INSERT INTO data.seller_settings(user_id, delivery_link)
                    VALUES ($1, $2) ON CONFLICT ON CONSTRAINT seller_settings__pkey DO UPDATE SET
                        delivery_link = EXCLUDED.delivery_link;`;
                await client.query(query, [userId, data.delivery_link]);
            } else {
                const query = `INSERT INTO data.seller_settings(user_id, delivery_link)
                    VALUES ($1, $2) ON CONFLICT ON CONSTRAINT seller_settings__pkey DO UPDATE SET
                        delivery_link = EXCLUDED.delivery_link;`;
                await client.query(query, [userId, '']);
            }
            if (data.delivery_link) {
                const query = `INSERT INTO data.seller_settings(user_id, return_link)
                    VALUES ($1, $2) ON CONFLICT ON CONSTRAINT seller_settings__pkey DO UPDATE SET
                        return_link = EXCLUDED.return_link;`;
                await client.query(query, [userId, data.return_link]);
            } else {
                const query = `INSERT INTO data.seller_settings(user_id, return_link)
                    VALUES ($1, $2) ON CONFLICT ON CONSTRAINT seller_settings__pkey DO UPDATE SET
                        return_link = EXCLUDED.return_link;`;
                await client.query(query, [userId, '']);
            }
            // getting new doc from tmp foldes
            const dirUpload = `${process.env.DOWNLOAD_FOLDER}/users/${userId}/documents/tmp`;
            const dirNewUpload = `${process.env.DOWNLOAD_FOLDER}/users/${userId}/documents`;
            fs.readdir(dirUpload, async (err, files) => {
                if (files) {
                    files.forEach(async file => {
                        let indexOfFirstPolicy = file.indexOf('policy');
                        let indexOfFirstTerms = file.indexOf('terms');
                        let indexOfFirstDelivery = file.indexOf('delivery');
                        let indexOfFirstReturn = file.indexOf('return');
                        if (indexOfFirstPolicy === 0) {
                            fs.rename(`${dirUpload}/${file}`, `${dirNewUpload}/${file}`, async function (err) {
                                if (err) throw err
                                await client.query(`UPDATE data.seller_settings SET privacy_doc='${file}' WHERE user_id='${userId}'`)
                            })
                        }
                        if (indexOfFirstTerms === 0) {
                            fs.rename(`${dirUpload}/${file}`, `${dirNewUpload}/${file}`, async function (err) {
                                if (err) throw err
                                await client.query(`UPDATE data.seller_settings SET terms_doc='${file}' WHERE user_id='${userId}'`)
                            })
                        }
                        if (indexOfFirstDelivery === 0) {
                            fs.rename(`${dirUpload}/${file}`, `${dirNewUpload}/${file}`, async function (err) {
                                if (err) throw err
                                await client.query(`UPDATE data.seller_settings SET delivery_doc='${file}' WHERE user_id='${userId}'`)
                            })
                        }
                        if (indexOfFirstReturn === 0) {
                            fs.rename(`${dirUpload}/${file}`, `${dirNewUpload}/${file}`, async function (err) {
                                if (err) throw err
                                await client.query(`UPDATE data.seller_settings SET return_doc='${file}' WHERE user_id='${userId}'`)
                            })
                        }
                        // if (file.indexOf('policy111') > 0) {
                        //     console.log('need update policy')
                        //     fs.rename(`${dirUpload}/${file}`, `${dirNewUpload}/${file}`, async function (err) {
                        //         if (err) throw err
                        //         // await client.query(`SELECT * FROM data.seller_settings WHERE user_id='${userId}'`);
                        //         console.log(`${dirUpload}/${file}`)
                        //         console.log('to')
                        //         console.log(`${dirNewUpload}/${file}`)
                        //     })
                        // }
                    });
                }
                // files.forEach(async file => {
                //     let indexOfFirstPolicy = file.indexOf('policy');
                //     let indexOfFirstTerms = file.indexOf('terms');
                //     let indexOfFirstDelivery = file.indexOf('delivery');
                //     let indexOfFirstReturn = file.indexOf('return');
                //     if (indexOfFirstPolicy === 0) {
                //         fs.rename(`${dirUpload}/${file}`, `${dirNewUpload}/${file}`, async function (err) {
                //             if (err) throw err
                //             await client.query(`UPDATE data.seller_settings SET privacy_doc='${file}' WHERE user_id='${userId}'`)
                //         })
                //     }
                //     if (indexOfFirstTerms === 0) {
                //         fs.rename(`${dirUpload}/${file}`, `${dirNewUpload}/${file}`, async function (err) {
                //             if (err) throw err
                //             await client.query(`UPDATE data.seller_settings SET terms_doc='${file}' WHERE user_id='${userId}'`)
                //         })
                //     }
                //     if (indexOfFirstDelivery === 0) {
                //         fs.rename(`${dirUpload}/${file}`, `${dirNewUpload}/${file}`, async function (err) {
                //             if (err) throw err
                //             await client.query(`UPDATE data.seller_settings SET delivery_doc='${file}' WHERE user_id='${userId}'`)
                //         })
                //     }
                //     if (indexOfFirstReturn === 0) {
                //         fs.rename(`${dirUpload}/${file}`, `${dirNewUpload}/${file}`, async function (err) {
                //             if (err) throw err
                //             await client.query(`UPDATE data.seller_settings SET return_doc='${file}' WHERE user_id='${userId}'`)
                //         })
                //     }
                //     // if (file.indexOf('policy111') > 0) {
                //     //     console.log('need update policy')
                //     //     fs.rename(`${dirUpload}/${file}`, `${dirNewUpload}/${file}`, async function (err) {
                //     //         if (err) throw err
                //     //         // await client.query(`SELECT * FROM data.seller_settings WHERE user_id='${userId}'`);
                //     //         console.log(`${dirUpload}/${file}`)
                //     //         console.log('to')
                //     //         console.log(`${dirNewUpload}/${file}`)
                //     //     })
                //     // }
                // });
            });
            // const fs = require('fs');

            const _settings = await client.query(`SELECT * FROM data.seller_settings WHERE user_id='${userId}'`);
            if (_settings.rows[0].tmp_privacy_doc) {
                await client.query(`UPDATE data.seller_settings SET 
                    privacy_doc='${_settings.rows[0].tmp_privacy_doc}', tmp_privacy_doc=null WHERE 
                    user_id=${userId}`);
            }
            if (_settings.rows[0].tmp_delivery_doc) {
                await client.query(`UPDATE data.seller_settings SET 
                    delivery_doc='${_settings.rows[0].tmp_delivery_doc}', tmp_delivery_doc=null WHERE 
                    user_id=${userId}`);
            }
            if (_settings.rows[0].tmp_return_doc) {
                await client.query(`UPDATE data.seller_settings SET 
                    return_doc='${_settings.rows[0].tmp_return_doc}', tmp_return_doc=null WHERE 
                    user_id=${userId}`);
            }
            if (_settings.rows[0].tmp_terms_doc) {
                await client.query(`UPDATE data.seller_settings SET 
                    terms_doc='${_settings.rows[0].tmp_terms_doc}', tmp_terms_doc=null WHERE 
                    user_id=${userId}`);
            }

            // const query = `INSERT INTO data.seller_settings(user_id, privacy_link, terms_link, delivery_link, return_link)
            //     VALUES ($1, $2, $3, $4, $5) ON CONFLICT ON CONSTRAINT seller_settings__pkey DO UPDATE SET
            //         doctype=true,
            //         privacy_link = EXCLUDED.privacy_link,
            //         terms_link = EXCLUDED.terms_link,
            //         delivery_link = EXCLUDED.delivery_link,
            //         return_link = EXCLUDED.return_link;`;
            // await client.query(query, [userId, data.privacy_link, data.terms_link, data.delivery_link, data.return_link]);

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

    async copyFiles(sourceDir, dirUpload, photo) {
        fs.copyFile(`${sourceDir}/${photo}`, `${dirUpload}/${photo}`, (err) => {
            if (err) {
                throw err;
            }
            fs.unlink(`${sourceDir}/${photo}`,function(err){
                if(err) return console.log(err);
            });
        });
    }

    /**
     *
     * @param type
     * @param userId
     * @returns {Promise<*|[{order_timer: string, free_shipping_timer: string, updated_at: string, user_id, created_at: string, free_shipping_status: string, type: string}]|{success: boolean, error: {code: number, message: string}}>}
     */
    async removeSettingsFile(type, tmpfile, ext, userId) {
        const client = await pool.connect();
        try {
            if (tmpfile === 'tmp') {
                switch (type) {
                    case 'policy':
                        const dirUpload = `${process.env.DOWNLOAD_FOLDER}/users/${userId}/documents/tmp`;
                        fs.unlink(`${dirUpload}/${type}.${ext}`,function(err){
                            if(err) return console.log(err);
                        });
                        break;
                    case 'terms':
                        const dirTermsUpload = `${process.env.DOWNLOAD_FOLDER}/users/${userId}/documents/tmp`;
                        fs.unlink(`${dirTermsUpload}/${type}.${ext}`,function(err){
                            if(err) return console.log(err);
                        });
                        break;
                    case 'delivery':
                        const dirDeliveryUpload = `${process.env.DOWNLOAD_FOLDER}/users/${userId}/documents/tmp`;
                        fs.unlink(`${dirDeliveryUpload}/${type}.${ext}`,function(err){
                            if(err) return console.log(err);
                        });
                        break;
                    case 'return':
                        const dirReturnUpload = `${process.env.DOWNLOAD_FOLDER}/users/${userId}/documents/tmp`;
                        fs.unlink(`${dirReturnUpload}/${type}.${ext}`,function(err){
                            if(err) return console.log(err);
                        });
                        break;
                }
            } else {
                switch (type) {
                    case 'policy':
                        const dirUpload = `${process.env.DOWNLOAD_FOLDER}/users/${userId}/documents`;
                        fs.unlink(`${dirUpload}/${type}.${ext}`,function(err){
                            if(err) return console.log(err);
                        });
                        await client.query(`UPDATE data.seller_settings SET privacy_doc=null WHERE user_id='${userId}'`);
                        break;
                    case 'terms':
                        const dirUploadTerms = `${process.env.DOWNLOAD_FOLDER}/users/${userId}/documents`;
                        fs.unlink(`${dirUploadTerms}/${type}.${ext}`,function(err){
                            if(err) return console.log(err);
                        });
                        await client.query(`UPDATE data.seller_settings SET terms_doc=null WHERE user_id='${userId}'`);
                        break;
                    case 'delivery':
                        const dirUploadDelivery = `${process.env.DOWNLOAD_FOLDER}/users/${userId}/documents`;
                        fs.unlink(`${dirUploadDelivery}/${type}.${ext}`,function(err){
                            if(err) return console.log(err);
                        });
                        await client.query(`UPDATE data.seller_settings SET delivery_doc=null WHERE user_id='${userId}'`);
                        break;
                    case 'return':
                        const dirUploadReturnDelivery = `${process.env.DOWNLOAD_FOLDER}/users/${userId}/documents`;
                        fs.unlink(`${dirUploadReturnDelivery}/${type}.${ext}`,function(err){
                            if(err) return console.log(err);
                        });
                        await client.query(`UPDATE data.seller_settings SET return_doc=null WHERE user_id='${userId}'`);
                        break;
                }
            }
            // const settingsQuery = await client.query(`SELECT * FROM data.seller_settings WHERE user_id='${userId}'`);
            // switch (type) {
            //     case 'privacy':
            //         fs.unlink(`${settingsQuery.rows[0].privacy_doc}`,function(err){
            //             if(err) return console.log(err);
            //         });
            //         break;
            // }
            // {/Users/viktoriakorogod/WEB/SolidSolution/Liveproshop.v0.01/BE/uploads/users/286/1710418057750-Policy.docx}
            let queryUpdate;
            // queryUpdate = `
            //             UPDATE data.seller_settings
            //             SET
            //                 ${type}_doc = null
            //              WHERE user_id=${userId};`;
            // await client.query(queryUpdate);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Addresses Not found' } };
        } finally {
            client.release();
        }

    }

    async uploadPolicies (dataFiles, userId) {
        const client = await pool.connect();
        try {
            const copyFiles = [];
            const sourceDir = `${process.env.DOWNLOAD_FOLDER}/tmp`;
            const dirUpload = `${process.env.DOWNLOAD_FOLDER}/users/${userId}`;
            const dirDBUpload = `${process.env.DB_DOWNLOAD_FOLDER}/users/${userId}`;
            if (!fs.existsSync(dirUpload)) {
                fs.mkdirSync(dirUpload);
            }
            if (dataFiles.length > 0) {
                const promisesDocs = [];
                dataFiles.forEach(doc => {
                    promisesDocs.push(this.copyFiles(sourceDir, dirUpload, doc));
                });
                await Promise.all(promisesDocs);
                dataFiles.forEach(doc => {
                    copyFiles.push(`${dirDBUpload}/${doc}`);
                })
                if (copyFiles.length > 0) {
                    const queryUpdate = `
                        UPDATE data.seller_settings
                        SET
                            tmp_privacy_doc = '{${copyFiles}}'
                         WHERE user_id=${userId};`;
                    console.log(queryUpdate);
                    await client.query(queryUpdate);
                }
            }

            return { success: true };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Addresses Not found' } };
        } finally {
            client.release();
        }
    }

    async uploadTerms (dataFiles, userId) {
        const client = await pool.connect();
        try {
            const copyFiles = [];
            const sourceDir = `${process.env.DOWNLOAD_FOLDER}/tmp`;
            const dirUpload = `${process.env.DOWNLOAD_FOLDER}/users/${userId}`;
            const dirDBUpload = `${process.env.DB_DOWNLOAD_FOLDER}/users/${userId}`;
            if (!fs.existsSync(dirUpload)) {
                fs.mkdirSync(dirUpload);
            }
            if (dataFiles.length > 0) {
                const promisesDocs = [];
                dataFiles.forEach(doc => {
                    promisesDocs.push(this.copyFiles(sourceDir, dirUpload, doc));
                });
                await Promise.all(promisesDocs);
                dataFiles.forEach(doc => {
                    copyFiles.push(`${dirDBUpload}/${doc}`);
                })
                if (copyFiles.length > 0) {
                    const queryUpdate = `
                        UPDATE data.seller_settings
                        SET
                            terms_doc = '{${copyFiles}}'
                         WHERE user_id=${userId};`;
                    await client.query(queryUpdate);
                }
            }

            return { success: true };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Addresses Not found' } };
        } finally {
            client.release();
        }
    }

    async uploadDelivery (dataFiles, userId) {
        const client = await pool.connect();
        try {
            const copyFiles = [];
            const sourceDir = `${process.env.DOWNLOAD_FOLDER}/tmp`;
            const dirUpload = `${process.env.DOWNLOAD_FOLDER}/users/${userId}`;
            const dirDBUpload = `${process.env.DB_DOWNLOAD_FOLDER}/users/${userId}`;
            if (!fs.existsSync(dirUpload)) {
                fs.mkdirSync(dirUpload);
            }
            if (dataFiles.length > 0) {
                const promisesDocs = [];
                dataFiles.forEach(doc => {
                    promisesDocs.push(this.copyFiles(sourceDir, dirUpload, doc));
                });
                await Promise.all(promisesDocs);
                dataFiles.forEach(doc => {
                    copyFiles.push(`${dirDBUpload}/${doc}`);
                })
                if (copyFiles.length > 0) {
                    const queryUpdate = `
                        UPDATE data.seller_settings
                        SET
                            delivery_doc = '{${copyFiles}}'
                         WHERE user_id=${userId};`;
                    await client.query(queryUpdate);
                }
            }

            return { success: true };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Addresses Not found' } };
        } finally {
            client.release();
        }
    }

    async uploadSettingsNewDoc (filename, userId, type) {
        const client = await pool.connect();
        try {
            let fieldName = '';
            if (type === 'delivery') {
                fieldName = 'tmp_delivery_doc';
            } else if (type === 'return') {
                fieldName = 'tmp_return_doc';
            } else if (type === 'policy') {
                fieldName = 'tmp_privacy_doc';
            } else if (type === 'terms') {
                fieldName = 'tmp_terms_doc';
            }

            const queryUpdate = `
                        UPDATE data.seller_settings
                        SET
                            ${fieldName} = '{${filename}}'
                         WHERE user_id=${userId};`;
            // console.log(queryUpdate)
            await client.query(queryUpdate);
            return true;

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Addresses Not found' } };
        } finally {
            client.release();
        }
    }

    async uploadSettingsDoc (dataFiles, userId, type) {
        const client = await pool.connect();
        try {

            const copyFiles = [];
            const sourceDir = `${process.env.DOWNLOAD_FOLDER}/users/${userId}`;
            const dirUpload = `${process.env.DOWNLOAD_FOLDER}/users/${userId}`;
            const dirDBUpload = `${process.env.DB_DOWNLOAD_FOLDER}/users/${userId}`;
            if (!fs.existsSync(dirUpload)) {
                fs.mkdirSync(dirUpload);
            }
            if (dataFiles.length > 0) {
                const promisesDocs = [];
                console.log('here');
                dataFiles.forEach(doc => {
                    console.log("DOC", doc);
                    // promisesDocs.push(this.copyFiles(sourceDir, dirUpload, doc));
                });
                await Promise.all(promisesDocs);
                dataFiles.forEach(doc => {
                    copyFiles.push(`${dirDBUpload}/${doc}`);
                })
                console.log('Uploaded files', copyFiles)
                if (copyFiles.length > 0) {
                    let fieldName = '';
                    if (type === 'delivery') {
                        fieldName = 'tmp_delivery_doc';
                    } else if (type === 'return') {
                        fieldName = 'tmp_return_doc';
                    } else if (type === 'policy') {
                        fieldName = 'tmp_privacy_doc';
                    } else if (type === 'terms') {
                        fieldName = 'tmp_terms_doc';
                    }
                    const queryUpdate = `
                        UPDATE data.seller_settings
                        SET
                            ${fieldName} = '{${copyFiles}}'
                         WHERE user_id=${userId};`;
                    // console.log(queryUpdate)
                    await client.query(queryUpdate);
                }
            }

            return { success: true };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Addresses Not found' } };
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
