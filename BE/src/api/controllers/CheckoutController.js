import checkoutModel from '../models/Checkout.js';
import userModel from '../models/User.js';
import orderModel from '../models/Order.js';
import { addHoursToDate, addMinutesToDate, addDaysToDate } from '../lib/utils.js';
import moment from 'moment-timezone';
// import moment from "moment";
// import * from "moment-timezone"

class CheckoutController {
    /**
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */


    async fetch(req, res) {
        if (!req.user) return res.status(401).json('Access deny');
        const { orderNumber } = req.query;
        const orderData = await checkoutModel.fetchOrder(orderNumber, req.user.id);
        const sellerSettingsData = await userModel.fetchUserSettings(orderData.order.seller_id);

        // getting waiting products from current order
        // (e.g. seller have 1 buyer want 3, and we create order for 1 qnt and need to show how not available)
        // orderData.order.order_items.forEach(_item => {
        //     console.log(_item.message_id);
        // })
        const orderItemsWait = await checkoutModel.fetchWaitInOrder(orderData.order.order_items, orderData.order.id);
        // console.log("wait products", orderItemsWait);
        // get latest order amount
        const freeSheppingData = await orderModel.isFreeShipping(req.user.id, orderNumber);
        console.log('SHIPPING PARAMS', freeSheppingData);

        // const orderItems = await checkoutModel.fetchOrderItems(orderData.or);
        const address = await userModel.findUserAddress(req.user.id);
        const shippingMethodsData = await checkoutModel.fetchShippingMethodsByCountry(orderData?.order?.id, orderData?.order?.country_id || address?.country_id, freeSheppingData.freeShipping, req.user.id);
        orderData.order.freeShipping = freeSheppingData?.freeShipping || 0;
        orderData.order.refund_amount = freeSheppingData?.amount_refund;
        const regExpDelBrackets = /[({})]/g;
        let privacyLink = '';
        let termsLink = '';
        let returnLink = '';
        let deliveryLink = '';
        let countDownDate;
        let convertedCreatedAt = orderData.order.sync_at;

        // for server add time duration
        // let convertedCreatedAt = addHoursToDate(orderData.order.sync_at, -3);
        if (sellerSettingsData[0]) {
            var d = new Date(orderData.order.created_at);
            if (sellerSettingsData[0].type === 'd') {
                // To add Days
                // orderData.order.countdownDate = moment(orderData.order.sync_at).add(sellerSettingsData[0].order_timer, 'days').tz('UTC').format();
                orderData.order.countdownDate = moment(orderData.order.sync_at).add(`${-process.env.SERVER_TIME_DIFF}`, 'hours').add(sellerSettingsData[0].order_timer, 'days').tz('UTC').format();
                // d.setDate(d.getDate() + sellerSettingsData[0].order_timer);
                // orderData.order.countdownDate = addDaysToDate(convertedCreatedAt, sellerSettingsData[0].order_timer);
            } else if (sellerSettingsData[0].type === 'h') {
                // To add Hours
                // orderData.order.countdownDate = moment(orderData.order.sync_at).add(`${process.env.SERVER_TIME_DIFF} hours`).add(sellerSettingsData[0].order_timer, 'hours').tz('UTC').format();
                orderData.order.countdownDate = moment(orderData.order.sync_at).add(`${-process.env.SERVER_TIME_DIFF}`, 'hours').add(sellerSettingsData[0].order_timer, 'hours').tz('UTC').format();
            } else if (sellerSettingsData[0].type === 'm') {
                orderData.order.countdownDate = moment(orderData.order.sync_at).add(`${-process.env.SERVER_TIME_DIFF}`, 'hours').add(sellerSettingsData[0].order_timer, 'minutes').tz('UTC').format();

                // d.setDate(d.getMinutes() + sellerSettingsData[0].order_timer);
                // orderData.order.countdownDate = addMinutesToDate(convertedCreatedAt, sellerSettingsData[0].order_timer);
            }
        }
        if (sellerSettingsData[0].privacy_doc || sellerSettingsData[0].privacy_link) {
            if (sellerSettingsData[0].privacy_doc) {
                privacyLink = process.env.API_URL + `/uploads/users/${orderData.order.seller_id}/documents/${sellerSettingsData[0].privacy_doc}`;
            } else {
                if(/(http(s?)):\/\//i.test(sellerSettingsData[0].privacy_link)) {
                    privacyLink = sellerSettingsData[0].privacy_link;
                } else {
                    privacyLink = 'https://'+sellerSettingsData[0].privacy_link
                }
            }
            // termsLink = privacyLink;
            delete sellerSettingsData[0].privacy_link;
        }
        if (sellerSettingsData[0].terms_doc || sellerSettingsData[0].terms_link) {
            if (sellerSettingsData[0].terms_doc) {
                termsLink = process.env.API_URL + `/uploads/users/${orderData.order.seller_id}/documents/${sellerSettingsData[0].terms_doc}`;
            } else {
                if(/(http(s?)):\/\//i.test(sellerSettingsData[0].terms_link)) {
                    termsLink = sellerSettingsData[0].terms_link;
                } else {
                    termsLink = 'https://'+sellerSettingsData[0].terms_link
                }
                // termsLink = sellerSettingsData[0].terms_link
            }
            delete sellerSettingsData[0].terms_link;
        }
        if (sellerSettingsData[0].delivery_doc || sellerSettingsData[0].delivery_link) {
            if (sellerSettingsData[0].delivery_doc) {
                deliveryLink = process.env.API_URL + `/uploads/users/${orderData.order.seller_id}/documents/${sellerSettingsData[0].delivery_doc}`;
                // deliveryLink = process.env.API_URL + docParced3.replace(regExpDelBrackets, '').replace(process.env.DB_DOWNLOAD_FOLDER, '');
            } else {
                if(/(http(s?)):\/\//i.test(sellerSettingsData[0].delivery_link)) {
                    deliveryLink = sellerSettingsData[0].delivery_link;
                } else {
                    deliveryLink = 'https://'+sellerSettingsData[0].delivery_link
                }
                // deliveryLink = sellerSettingsData[0].delivery_link
            }
            delete sellerSettingsData[0].delivery_link;
        }
        if (sellerSettingsData[0].return_doc || sellerSettingsData[0].return_link) {
            if (sellerSettingsData[0].return_doc) {
                returnLink = process.env.API_URL + `/uploads/users/${orderData.order.seller_id}/documents/${sellerSettingsData[0].return_doc}`;
                // returnLink = process.env.API_URL + docParced4.replace(regExpDelBrackets, '').replace(process.env.DB_DOWNLOAD_FOLDER, '');
            } else {
                if(/(http(s?)):\/\//i.test(sellerSettingsData[0].return_link)) {
                    returnLink = sellerSettingsData[0].return_link;
                } else {
                    returnLink = 'https://'+sellerSettingsData[0].return_link
                }

                // returnLink = sellerSettingsData[0].return_link
            }
            delete sellerSettingsData[0].return_link;
        }
        // console.log('Terms LINK', termsLink)
        sellerSettingsData[0].privacy_doc = privacyLink ? privacyLink : '';
        sellerSettingsData[0].terms_doc = termsLink ? termsLink : '';
        sellerSettingsData[0].delivery_doc = deliveryLink ? deliveryLink : '';
        sellerSettingsData[0].return_doc = returnLink ? returnLink : '';
        // console.log(sellerSettingsData[0]);
        // orderData.freeShipping = freeSheppingData?.freeShipping
        orderData.freeShipping = freeSheppingData?.freeShipping
        orderData.refund_ammount = freeSheppingData?.refundAmount

        orderData.order.seller_settings = sellerSettingsData[0];
        return res.status(200).json({
            order: orderData.order,
            address,
            shippingMethods: shippingMethodsData.shippingMethods,
            freeShepping: freeSheppingData?.freeShipping || 0,
            refundAmount: freeSheppingData?.amount_refund || 0,
            orderItemsWait: orderItemsWait,
            sellerSettings: sellerSettingsData[0]
        });
    }

    async fetchShippingMethodsByCountry(req, res) {
        if (!req.user) return res.status(401).json('Access deny');
        const { orderId, countryId } = req.query;
        const shippingMethodsData = await checkoutModel.fetchShippingMethodsByCountry(orderId, countryId, false, req.user.id);

        return res.status(200).json({
            shippingMethods: shippingMethodsData.shippingMethods
        });
    }
    
    
    async chechoutSubmit(req, res) {
        if (!req.user) return res.status(401).json('Access deny');
        const locale = req.query.locale;
        const freeSheppingData = await orderModel.isFreeShipping(req.user.id, req.body.orderNumber);
        const data = await checkoutModel.checkoutSubmit(req.body, req.user, freeSheppingData, locale ? locale : 'fr');


        if (data.redirectUrl) {
            return res.status(200).json({ redirectUrl: data.redirectUrl });
        } else {
            return res.status(401).json({ redirectUrl: data.redirectUrl, error: data.error });
        }
    }
    
    async chechoutComfirmation(req, res) {
        if (!req.user) return res.status(401).json('Access deny');
        console.log('Query params', req.query.locale);
        // exit;
        console.log('User Id', req.user.id);
        // console.log('User', req.user);
        // await orderModel.generatePdf(req.params.id, req.user.id, req.user, req.params.locale, "", req.params.type);
        const data = await checkoutModel.updateOrderStatus(req.body, req.user, req.query.locale);
        
        if (data.paymentStatus) {
            return res.status(200).json({ paymentStatus: data.paymentStatus, error: data.error });
        } else {
            return res.status(401).json({ paymentStatus: data.paymentStatus, error: data.error });
        }
    }
}

export default new CheckoutController();
