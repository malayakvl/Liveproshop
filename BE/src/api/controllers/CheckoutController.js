import checkoutModel from '../models/Checkout.js';
import userModel from '../models/User.js';
import orderModel from '../models/Order.js';
import order from "../models/Order.js";

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
        const shippingMethodsData = await checkoutModel.fetchShippingMethodsByCountry(orderData?.order?.id, orderData?.order?.country_id || address?.country_id, true);
        orderData.order.freeShipping = freeSheppingData?.freeShipping || 0;
        if ((sellerSettingsData[0].privacy_doc || sellerSettingsData[0].terms_doc || sellerSettingsData[0].delivery_doc || sellerSettingsData[0].return_doc) && !sellerSettingsData[0].doctype) {
            let termsDoc = sellerSettingsData[0].terms_doc ? sellerSettingsData[0].terms_doc : (
                sellerSettingsData[0].privacy_doc || sellerSettingsData[0].return_doc || sellerSettingsData.delivery_doc
            );
            let privacyDoc = sellerSettingsData[0].terms_doc ? sellerSettingsData[0].terms_doc : (
                sellerSettingsData[0].privacy_doc || sellerSettingsData[0].return_doc || sellerSettingsData.delivery_doc
            )
            const regExpDelBrackets = /[({})]/g;
            orderData.order.termsDoc = process.env.API_URL + termsDoc.replace(regExpDelBrackets, '').replace(process.env.DB_DOWNLOAD_FOLDER, '');
            orderData.order.privacyDoc = process.env.API_URL + privacyDoc.replace(regExpDelBrackets, '').replace(process.env.DB_DOWNLOAD_FOLDER, '');
        }
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
