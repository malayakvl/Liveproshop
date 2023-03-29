import { existsSync } from 'fs';
import { resolve } from 'path';

import paymentModel from '../models/Payment.js';
import orderModel from '../models/Order.js';

class PaymentController {
    /**
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async fetchItems(req, res) {
        const { limit, offset, queryFilter, column, sort } = req.query;
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const data = await paymentModel.fetchItems(1, limit, req.user, false, offset, queryFilter, column, sort);
            return res.status(200).json({ count: data.size, items: data.items});
        }
        // const data = await chatbotMessageModel.addMessages(req.query.sessionId, req.body);
        // if (!data.error) {
        //     return res.status(200).json({success: true});
        // } else {
        //     return res.status(401).json({success: false, error: 'Something wend wrong'});
        // }
    }

    async fetchItem(req, res) {
        const { orderNumber } = req.query;
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const data = await paymentModel.fetchItem(orderNumber, req.user.id);
            return res.status(200).json({ item: data.item});
        }
    }

    async fetchMethods(req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const methods = await paymentModel.fetchMethods(req.user.id);
            return res.status(200).json(methods);
        }
    }

    async changeMethodsStatuses(req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const methods = req.body.methods;
            await paymentModel.changeMethodsStatuses(methods, req.user.id);

            return res.status(200).json({})
        }
    }
    
    async fetchFilters(req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const items = await paymentModel.fetchFilters();
            return res.status(200).json({ items: items.res });
        }
    }
    
    async downloadInvoice(req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');

        } else {
            const filePath = resolve(process.env.DOWNLOAD_FOLDER, 'orders', String(req.user.id), req.params.orderNumber + '.pdf');

            if (!existsSync(filePath)) {
                const order = await orderModel.generatePdf(req.params.orderNumber, req.user.id, req.user);
                if (order.error) {
                    return res.status(500).json(order.error);
                }
            }
            res.download(filePath);
        }
    }
}

export default new PaymentController();
