import checkoutModel from '../models/Checkout.js';
import userModel from '../models/User.js';
import orderModel from '../models/Order.js';
import order from "../models/Order.js";
import user from "../models/User.js";

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

        // const orderItems = await checkoutModel.fetchOrderItems(orderData.or);
        const address = await userModel.findUserAddress(req.user.id);
        const shippingMethodsData = await checkoutModel.fetchShippingMethodsByCountry(orderData?.order?.id, orderData?.order?.country_id || address?.country_id, true, req.user.id);
        orderData.order.freeShipping = freeSheppingData?.freeShipping || 0;
        const regExpDelBrackets = /[({})]/g;
        let privacyLink = '';
        let termsLink = '';
        let returnLink = '';
        let deliveryLink = '';
        let countDownDate;
        if (sellerSettingsData[0]) {
            console.log("EEEE", sellerSettingsData[0].type)
            var d = new Date(orderData.order.created_at);
            if (sellerSettingsData[0].type === 'd') {
                // To add Days
                d.setDate(d.getDate() + sellerSettingsData[0].order_timer);
                orderData.order.countdownDate = d;
            } else if (sellerSettingsData[0].type === 'h') {
                // To add Hours
                d.setDate(d.getHours() + sellerSettingsData[0].order_timer);
            } else if (sellerSettingsData[0].type === 'm') {
                // To add Hours
                d.setDate(d.getMinutes() + sellerSettingsData[0].order_timer);
            }
            console.log("Created at", orderData.order.created_at);
            console.log("Timer at", sellerSettingsData[0].order_timer);
            console.log("Expire at", d.getTime());
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

        orderData.order.seller_settings = sellerSettingsData[0];
        return res.status(200).json({
            order: orderData.order,
            address,
            shippingMethods: shippingMethodsData.shippingMethods,
            freeShepping: freeSheppingData?.freeShipping || 0,
            orderItemsWait: orderItemsWait,
            sellerSettings: sellerSettingsData[0]
        });
    }

    async fetchShippingMethodsByCountry(req, res) {
        if (!req.user) return res.status(401).json('Access deny');
        const { orderId, countryId } = req.query;
        const shippingMethodsData = await checkoutModel.fetchShippingMethodsByCountry(orderId, countryId);

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
        
        const data = await checkoutModel.updateOrderStatus(req.body, req.user);
        
        if (data.paymentStatus) {
            return res.status(200).json({ paymentStatus: data.paymentStatus, error: data.error });
        } else {
            return res.status(401).json({ paymentStatus: data.paymentStatus, error: data.error });
        }
    }
}

export default new CheckoutController();
