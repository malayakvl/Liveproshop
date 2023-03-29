import paymentPlanModel from '../models/PaymentPlan.js';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_API_KEY);
// const stripe = require("stripe")('sk_test_26PHem9AhJZvU623DfE1x4sd');

const calculateOrderAmount = () => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1000;
};

class PaymentPlanController {
    /**
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async fetchItems (req, res) {
        const items = await paymentPlanModel.fetchItems();
        const settings = await paymentPlanModel.fetchSettings();
        return res.status(200).json({ items: items, settings: settings });
    }
    
    async fetchStripeProducts(req, res) {
        try {
            const products = await stripe.products.list({
                limit: 10,
            });
            const prices =  await stripe.prices.list({
                limit: 10,
            });
            products.data.forEach(product => {
                product.price = prices.data.filter(price => price.product === product.id);
            });
            return res.status(200).json({ items: products.data });
        } catch (e) {
            return res.status(401).json({ items: null });
        }
    }
    
    async syncStripe (req, res) {
        try {
            const products = await stripe.products.list({
                limit: 10,
            });
            const prices =  await stripe.prices.list({
                limit: 10,
            });
            const data = await paymentPlanModel.syncPrices(req.body, products, prices);
            if (data.success) {
                return res.status(200).json({ success: true });
            } else {
                return res.status(301).json('Access deny');
            }
        } catch (e) {
            return res.status(301).json({ message: 'Something wend wrong' });
        }
    }
    
    async updateStatus (req, res) {
        if (!req.user || req.user.role_id !== 3) {
            return res.status(401).json('Access deny');
        } else {
            await paymentPlanModel.changeStatus(req.body);
            return res.status(200).json({ status: true });
        }
    }
    
    
    async stripeClientSecret(req, res) {
        const { items } = req.body;
        // console.log('ITEMS', items);
        // console.log('AMOUNT', calculateOrderAmount(items));
    
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: "eur",
            automatic_payment_methods: {
                enabled: true,
            }
        });
        // console.log(paymentIntent);
    
        return res.status(200).json({ clientSecret: paymentIntent.client_secret });
    }
    
    
    async fetchPlanInfo (req, res) {
        const planInfo = await paymentPlanModel.fetchInfo(req.query.planId);
        if (planInfo.success) {
            return res.status(200).json({ planInfo: planInfo.planInfo });
        } else {
            return res.status(301).json('Access deny');
        }
    }
}

export default new PaymentPlanController();
