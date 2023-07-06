import checkoutModel from '../models/Checkout.js';
import userModel from '../models/User.js';

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
        const address = await userModel.findUserAddress(req.user.id);
        const shippingMethodsData = await checkoutModel.fetchShippingMethodsByCountry(orderData?.order?.id, orderData?.order?.country_id || address?.country_id, true);

        return res.status(200).json({
            order: orderData.order,
            address,
            shippingMethods: shippingMethodsData.shippingMethods
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
        const data = await checkoutModel.checkoutSubmit(req.body, req.user);
        
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
