import pool from './connect.js';
import { logger } from '../../common/logger.js';
import axios from "axios";
import crypto from "crypto";

class Checkout {

    async fetchOrder(orderNumber, userId) {
        const client = await pool.connect();

        let order = null;
        let error = null;

        try {
            const filter = JSON.stringify({
                // status: ["payed"],
                buyer_id: [userId],
                order_number: orderNumber
            });

            const ordersQuery = `SELECT * FROM data.get_orders(1, 0, '${filter}');`;
            console.log(ordersQuery)
            const res = await client.query(ordersQuery);
            order = res.rows.length > 0 ? res.rows[0] : [];
            console.log(res.rows[0].id)

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Checkout fetchOrder):',
                    { message: e.message }
                );
            }
            error = {
                code: 500,
                message: 'Error get order'
            };

        } finally {
            client.release();
            return {
                order,
                error
            };
        }
    }


    async fetchOrderItems(orderId, userId) {
        const client = await pool.connect();

        let order = null;
        let error = null;

        try {
            const filter = JSON.stringify({
                // status: ["payed"],
                buyer_id: [userId],
                order_number: orderNumber
            });

            const ordersQuery = `SELECT * FROM data.order_items WHERE order_id='${orderId}';`;
            const res = await client.query(ordersQuery);
            order = res.rows.length > 0 ? res.rows : [];
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Checkout fetchOrder):',
                    { message: e.message }
                );
            }
            error = {
                code: 500,
                message: 'Error get order'
            };

        } finally {
            client.release();
            return {
                order,
                error
            };
        }
    }

    async fetchShippingMethodsByCountry(orderId, countryId, checkFreeShipping = false) {
        const client = await pool.connect();

        let shippingMethods = null;
        let error = null;

        try {
            let query = 'SELECT is_free FROM data.get_shipping_is_free($1)';
            let res = checkFreeShipping && (await client.query(query, [orderId])).rows[0].is_free;

            if (res) {
                shippingMethods = []
            } else {
                query = 'SELECT id, name, price, image, status FROM data.get_shipping_by_country($1, $2) ORDER BY price ASC';
                res = await client.query(query, [orderId, countryId]);
                shippingMethods = res.rows;
            }

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
                message: 'Error get list of shippingMethods'
            };

        } finally {
            client.release();
            return { shippingMethods, error };
        }
    }
    
    async updateOrderStatus(data, user) {
        const client = await pool.connect();
        let error;
        try {
            const orderRes = await client.query(`SELECT id FROM data.orders WHERE hash='${data.hash}' AND user_id='${user.id}'`);
            if (orderRes.rows.length) {
                if (data.type === 'redirect') {
                    // setup payment details
                    // await axios
                    //     .get(`${process.env.MULTISAFEPAY_URL}/orders/LP-ID-${orderRes.rows[0].id}?api_key=${sellerSettingsRes.rows[0].multisafe_api_key}`, dataOrder, {
                    //         headers: { 'Content-Type': 'application/json' }
                    //     })
                    //     .then(async (res) => {
                    //         // console.log("Res Data", res.data);
                    //         console.log("MULTISAFE DATA", res.data);
                    //         // return {redirectUrl: 'https://testpayv2.multisafepay.com/connect/82EHClmcDytee3MubyiXfdojEFcxiWYJ2Vs/?lang=en_UA', error: null}
                    //     }).catch(error => {
                    //
                    //     });
                    await client.query(`UPDATE data.orders SET status='payed' WHERE id=${orderRes.rows[0].id}`);
                    return { paymentStatus: 'success', error: null };
                } else if (data.type === 'cancel') {
                    return { paymentStatus: 'cancel', error: 'Client cancel payment' };
                }
            } else {
                error = {
                    code: 500,
                    message: 'Order not found'
                };
                return { paymentStatus: 'error', error: error };
            }
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
                message: 'Error get list of shippingMethods'
            };
            return { paymentStatus: 'error', error: error };
        } finally {
            client.release();
            
        }
    }
    
    async checkoutSubmit(data, user) {
        const client = await pool.connect();
        try {
            const orderRes = await client.query(`SELECT * FROM data.orders WHERE order_number='${data.orderNumber}' AND user_id='${user.id}'`);
            if (orderRes.rows.length) {
                // fetch seller and system settings for receive api keys
                // const sellerSettingsRes = await client.query(`SELECT multisafe_api_key FROM data.get_seller_settings(${orderRes.rows[0].id});`);
                const systemSettingsRes = await client.query('SELECT multisafe_account FROM data.system_settings WHERE id=1;');
                const sellerSettingsRes = await client.query(`SELECT * FROM data.get_seller_settings(${orderRes.rows[0].id});`);
                // console.log(`SELECT * FROM data.get_seller_settings(${orderRes.rows[0].id});`);
                if (sellerSettingsRes.rows.length === 0) {
                    return {redirectUrl: null, error: 'No key for payment'}
                }
                let shippingPrice = 0;
                if (data.shippingMethodId) {
                    const shippingRes = await client.query(`SELECT * FROM data.shipping_to_country
                        WHERE user_id=${sellerSettingsRes.rows[0].user_id}
                            AND shipping_id=${data.shippingMethodId}
                            AND country_id=${data.country_id}`);
                    shippingPrice = parseFloat(shippingRes.rows[0].price);
                }
                // const multyData = await axios
                //     .get(`${process.env.MULTISAFEPAY_URL}/orders/LP-ID-${res.rows[0].id}?api_key=${process.env.MULTISAFE_API_KEY}`, {
                //         headers: { 'Content-Type': 'application/json' }
                //     })
                //     .then(async (resp) => {
                //         console.log(resp);
                //     }).catch(error => {
                //         console.log("Merchant error", error);
                //     });
                // generate unique code for check redirect from merchant
                const hash = crypto.randomBytes(25).toString('hex');
                const totalPayment = shippingPrice + parseFloat(orderRes.rows[0].order_amount);
                await client.query(`UPDATE data.orders SET
                                        country_id=${data.country_id},
                                        state=$$${data.state ? data.state : ''}$$,
                                        city=$$${data.city}$$,
                                        post_code=$$${data.post_code}$$,
                                        shipping_id=${data.shippingMethodId ? data.shippingMethodId : null},
                                        phone=$$${data.phone}$$,
                                        shipping_amount=${shippingPrice},
                                        shipping_address=$$${data.address_line_1 ?  data.address_line_1 : data.shipping_address}$$,
                                        hash='${hash}',
                                        total_amount='${totalPayment}'
                                        WHERE order_number='${data.orderNumber}' AND user_id='${user.id}'`);
                // return {redirectUrl: null, error: 'No find order'}
                const dataOrder = {
                    // site_id: '31313',
                    type: 'redirect',
                    // email: 'malaya.kvl@gmail.com',
                    order_id: `LP-ID-${orderRes.rows[0].id}`,
                    gateway: '',
                    currency: 'EUR',
                    amount: (totalPayment)*100,
                    description: `Payment for Order ${data.orderNumber}`,
                    payment_options: {
                        notification_url:
                            `${process.env.APPLICATION_BASE_URL}/checkout/confirmation?hash=${hash}&type=notification`,
                        redirect_url:
                            `${process.env.APPLICATION_BASE_URL}/checkout/confirmation?hash=${hash}&type=redirect`,
                        cancel_url: `${process.env.APPLICATION_BASE_URL}/checkout/confirmation?hash=${hash}&type=cancel`,
                        close_window: true,
                    },
                    customer: {
                        locale: 'en_US',
                    },
                    affiliate: {
                        "split_payments":[
                            {
                                "merchant":systemSettingsRes.rows[0].multisafe_account,
                                "percentage":sellerSettingsRes.rows[0].transaction_percent,
                                "description":`Percentage fee for order: ${data.orderNumber}`
                            }
                        ]
                    }
                }
                const multiSafePayClientRes = await axios
                    .post(`${process.env.MULTISAFEPAY_URL}/orders?api_key=${sellerSettingsRes.rows[0].multisafe_api_key}`, dataOrder, {
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .then(async (res) => {
                        return {redirectUrl: res.data.data.payment_url, error: null}
                    }).catch(error => {
                        console.log("Merchant error", error);
                        return {redirectUrl: null, error: error.message}
                    });
                // const multiSafePayClientRes = await axios
                //     .post(`https://testapi.multisafepay.com/v1/json/orders?api_key=${sellerSettingsRes.rows[0].multisafe_api_key}`, dataOrder, {
                //         headers: { 'Content-Type': 'application/json' }
                //     })
                //     .then(async (res) => {
                //         // console.log("Res Data", res.data);
                //         return {redirectUrl: res.data.data.payment_url, error: null}
                //         // return {redirectUrl: 'https://testpayv2.multisafepay.com/connect/82EHClmcDytee3MubyiXfdojEFcxiWYJ2Vs/?lang=en_UA', error: null}
                //     }).catch(error => {
                //         return {redirectUrl: null, error: error.message}
                //     });
                // console.log('here we are', multiSafePayClientRes);
                return {redirectUrl: multiSafePayClientRes.redirectUrl, error: multiSafePayClientRes.error}
            } else {
                return {redirectUrl: null, error: 'No find order'}
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            const error = {
                code: 500,
                message: e.message
            };
            return {
                redirectUrl: null, error: error}
        } finally {
            client.release();
        }
    }
}

export default new Checkout();
