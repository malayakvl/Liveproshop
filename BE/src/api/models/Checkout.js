import pool from './connect.js';
import { logger } from '../../common/logger.js';
import axios from "axios";
import crypto from "crypto";
import moment from 'moment';
import shippingModel from "./Shipping.js";
import orderModel from "./Order.js";
import { confirmOrderPaymentEmail } from "../sender/templates.js";
import {sendMail} from "../lib/sendMail.js";

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
            const res = await client.query(ordersQuery);
            order = res.rows.length > 0 ? res.rows[0] : [];
            // console.log(res.rows[0].id)

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


    async fetchWaitInOrder(orderItems, orderId) {
        const client = await pool.connect();

        let productsWaiting = null;
        let error = null;
        console.log(orderItems);

        try {
            const waitingProductsMessagesIds = [];
            await orderItems.forEach(async (_item) => {
                // const productWaiting = await client.query(`SELECT * FROM data.order_items WHERE
                //     message_id = '${_item.message_id}' AND status='waiting'`);
                waitingProductsMessagesIds.push(`'${_item.message_id}'`);
                // productWaiting.rows.forEach(_waitProduct => {
                //     console.log("waiting", _waitProduct);
                //     waitingProducts.push(_waitProduct);
                // })

            });
            // console.log('ORDER ID', orderId);
            // console.log(waitingProductsMessagesIds)
            // console.log(`SELECT * FROM data.order_items WHERE
            //     message_id IN (${waitingProductsMessagesIds.join(',')}) AND status='waiting'`)
            const productWaitingRes = await client.query(`SELECT * FROM data.order_items WHERE
                message_id IN (${waitingProductsMessagesIds.join(',')}) AND status='waiting'`);
            productsWaiting = productWaitingRes.rows.length ? productWaitingRes.rows : [];
            // return {success: true, waitingProducts: productWaiting.rows.length ? productWaiting.rows : []}
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
                productsWaiting,
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

    async fetchWaitInOrder(orderItems) {
        const client = await pool.connect();

        let productsWaiting = null;
        let error = null;

        try {
            const waitingProductsMessagesIds = [];
            await orderItems.forEach(async (_item) => {
                // const productWaiting = await client.query(`SELECT * FROM data.order_items WHERE
                //     message_id = '${_item.message_id}' AND status='waiting'`);
                waitingProductsMessagesIds.push(`'${_item.message_id}'`);
                // productWaiting.rows.forEach(_waitProduct => {
                //     console.log("waiting", _waitProduct);
                //     waitingProducts.push(_waitProduct);
                // })

            });
            // console.log(waitingProductsMessagesIds)
            // console.log(`SELECT * FROM data.order_items WHERE
            //     message_id IN (${waitingProductsMessagesIds.join(',')}) AND status='waiting'`)
            const productWaitingRes = await client.query(`SELECT * FROM data.order_items WHERE
                message_id IN (${waitingProductsMessagesIds.join(',')}) AND status='waiting'`);
            productsWaiting = productWaitingRes.rows.length ? productWaitingRes.rows : []
            // return {success: true, waitingProducts: productWaiting.rows.length ? productWaiting.rows : []}
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
                productsWaiting,
                error
            };
        }
    }


    async fetchShippingMethodsByCountry(orderId, countryId, freeShipping = false, userId='') {
        const client = await pool.connect();

        let shippingMethods = null;
        let error = null;
        try {
            // const orderQuerySeller = `SELECT data.live_sessions.user_id as seller_id FROM data.orders
            //     LEFT JOIN data.live_sessions ON data.live_sessions.id = data.orders.live_sessions_id
            //     WHERE data.orders.id=${orderId}`;
            // const sellerRes = await client.query(orderQuerySeller);
            // const sellerId = sellerRes.rows[0].seller_id;
            // let isFreePeriodActive = false;
            // let shippingFree = false;
            // let prevOrderAmount = 0;
            // const sellerSettingsRes = await client.query(`SELECT free_shipping_from, free_shipping_to FROM data.seller_settings WHERE user_id=${sellerId}`);
            // if (sellerSettingsRes.rows.length) {
            //     if (sellerSettingsRes.rows[0].free_shipping_from) {
            //         const dateFrom = moment(sellerSettingsRes.rows[0].free_shipping_from);
            //         const dateTo = moment(sellerSettingsRes.rows[0].free_shipping_to);
            //         const now = moment();
            //         if (now >= dateFrom && now <= dateTo) {
            //             isFreePeriodActive = true;
            //         }
            //     }
            // }
            // free shipping period active, get prev order amount
            // const resultThreshold = await shippingModel.fetchThreshold(sellerId);
            // if (isFreePeriodActive) {
            //     const totalOrderQuery = `SELECT SUM(order_amount) as total_amount FROM data.orders
            //         WHERE user_id=${userId} AND status='payed'`;
            //     const resTotalAmount = await client.query(totalOrderQuery);
            //     prevOrderAmount = parseInt(resTotalAmount.rows[0].total_amount);
            //     if (resultThreshold.threshold <= prevOrderAmount) {
            //         shippingFree = true;
            //     }
            // }
            shippingMethods = [];
            let query = 'SELECT id, name, price, image, status FROM data.get_shipping_by_country($1, $2) ORDER BY price ASC';
            const res = await client.query(query, [orderId, countryId]);
            if (res.rows.length > 0) {
                if (freeShipping) {
                    res.rows.forEach(_method => {
                        _method.price = 0;
                    })
                }
            }
            shippingMethods = res.rows;
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
    
    async updateOrderStatus(data, user, locale) {
        const client = await pool.connect();
        let error;
        console.log('locale', locale);
        try {
            const orderRes = await client.query(`SELECT * FROM data.orders WHERE hash='${data.hash}' AND user_id='${user.id}'`);
            const sellerData = await client.query(`SELECT data.user_stores.name AS store_name 
                FROM data.live_sessions 
                LEFT JOIN data.user_stores ON data.user_stores.id = data.live_sessions.store_id`);
            const storeName = sellerData.rows[0].store_name
            if (orderRes.rows.length) {
                if (data.type === 'redirect') {
                    await client.query(`UPDATE data.orders SET status='payed' WHERE id=${orderRes.rows[0].id}`);

                    // send email about success payment and generate pdf
                    const userData = await client.query(`SELECT email, email_real, last_name, first_name FROM data.users WHERE id='${orderRes.rows[0].user_id}'`);
                    const orderData = orderRes.rows[0];
    console.log('GENERATE INVOICE PDF', locale);
                    // check if file exist, then return true
                    const coutryRes = await client.query(`SELECT nicename FROM data.countries WHERE id='${orderRes.rows[0].country_id}'`);
                    const deliveryAddress = coutryRes.rows[0].nicename+', '+orderRes.rows[0].post_code+', '+orderRes.rows[0].city+', '+orderRes.rows[0].shipping_address
                    const multiOrderPaymentData = await axios
                        .get(`${process.env.MULTISAFEPAY_URL}/orders/${process.env.MULTISAFE_ORDER_PREFIX}-${orderRes.rows[0].id}?api_key=${process.env.MULTISAFE_API_KEY}`, {}, {
                            headers: { 'Content-Type': 'application/json' }
                        })
                        .then(async (res) => {
                            // console.log('PAYMENT METHODS', res.data.data);
                            return {'success': true, paymentData: res.data.data}
                        }).catch(error => {
                            return {error: error.message}
                        });
                    // generate pad
console.log('Multisafe data', multiOrderPaymentData)  ;
                    const order = await orderModel.generatePdf(orderRes.rows[0].order_number, orderRes.rows[0].user_id, user, locale, "", 'download');
console.log('Order Data', order);
                    const filePathArr = order.filename.split('/');
                    // console.log(filePathArr);
                    const fileAttachment = {
                        name: filePathArr[4],
                        path: `${process.env.FULL_DOWNLOAD_FOLDER}${order.filename}`
                    }
                    console.log('File attachment', fileAttachment);

                    const paymentMethod = multiOrderPaymentData.paymentData.payment_details.type;
                    const mailConfirmPayment = await confirmOrderPaymentEmail(locale, storeName, orderRes.rows[0], deliveryAddress, paymentMethod);
                    sendMail(
                        userData.rows[0].email_real,
                        mailConfirmPayment.subject,
                        mailConfirmPayment.body,
                        fileAttachment
                    );
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
console.log(e.message)
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            error = {
                code: 500,
                message: 'Error updateOrderStatus'
            };
            return { paymentStatus: 'error', error: error };
        } finally {
            client.release();
            
        }
    }
    
    async checkoutSubmit(data, user, freeShipping, lng) {
        const client = await pool.connect();
        try {
            const freeShippingData = await orderModel.isFreeShipping(user.id, data.orderNumber);
            const isFreeShipping = freeShippingData.freeShipping;
            // const isFreeShipping = freeShipping.freeShipping;
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
                if (data.shippingMethodId && !isFreeShipping) {
                    const shippingRes = await client.query(`SELECT * FROM data.shipping_to_country
                        WHERE user_id=${sellerSettingsRes.rows[0].user_id}
                            AND shipping_id=${data.shippingMethodId}
                            AND country_id=${data.country_id}`);
                    shippingPrice = parseFloat(shippingRes.rows[0].price);
                }
                const hash = crypto.randomBytes(25).toString('hex');
                const amountRefund = freeShippingData.amount_refund;
                // const amountRefund = orderRes.rows[0].refund_amount ? orderRes.rows[0].refund_amount : 0;
                // const amountRefund = freeShippingData.amount_refund;
                const totalPayment = shippingPrice + parseFloat(orderRes.rows[0].order_amount - parseFloat(amountRefund));

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
                                        refund_amount='${freeShippingData.amount_refund}'
                                        WHERE order_number='${data.orderNumber}' AND user_id='${user.id}'`);
                const bAddressRes = await client.query(`SELECT * FROM data.addresses WHERE user_id='${user.id}'`);
                if (bAddressRes.rows.length === 0) {

                    const queryAddress = `INSERT INTO data.addresses (
                        user_id, country_id, state, post_code, city, address_line_1, address_type) VALUES (
                        '${user.id}', '${data.country_id}', '${data.state ? data.state : ''}',
                        '${data.post_code}', '${data.city}', 
                        '${data.address_line_1 ?  data.address_line_1 : data.shipping_address}', 'home address')`;
                    await client.query(queryAddress);
                }
                const orderNumberMultisafe = `${process.env.MULTISAFE_ORDER_PREFIX}-${orderRes.rows[0].id}`
                const dataOrder = {
                    type: 'redirect',
                    order_id: orderNumberMultisafe,
                    gateway: '',
                    currency: 'EUR',
                    amount: (totalPayment)*100,
                    description: `Payment for Order ${data.orderNumber}`,
                    payment_options: {
                        notification_url:
                            `${process.env.APPLICATION_BASE_URL}/${lng === 'en' ? 'en/' : ''}checkout/confirmation?orderId=${orderRes.rows[0].id}&lang=${lng === 'en' ? 'en' : 'fr'}&hash=${hash}&type=notification`,
                        redirect_url:
                            `${process.env.APPLICATION_BASE_URL}/${lng === 'en' ? 'en/' : ''}checkout/confirmation?orderId=${orderRes.rows[0].id}&lang=${lng === 'en' ? 'en' : 'fr'}&hash=${hash}&type=redirect`,
                        cancel_url: `${process.env.APPLICATION_BASE_URL}/${lng === 'en' ? 'en/' : ''}checkout/confirmation?orderId=${orderRes.rows[0].id}&lang=${lng === 'en' ? 'en' : 'fr'}&hash=${hash}&type=cancel`,
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
                        const multiSafePayClientRes = await axios
                            .get(`${process.env.MULTISAFEPAY_URL}/orders/${orderNumberMultisafe}?api_key=${sellerSettingsRes.rows[0].multisafe_api_key}`, {
                                headers: { 'Content-Type': 'application/json' }
                            })
                            .then(async (resM) => {
                                console.log('Merchant result', resM.data.data);
                                return resM.data.data;
                            }).catch(error => {
                                console.log("Merchant error", error);
                            });
                        return {redirectUrl: res.data.data.payment_url, error: null}
                    }).catch(error => {
                        console.log("Merchant error", error);
                        return {redirectUrl: null, error: error.message}
                    });

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
