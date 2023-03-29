import sellerModel from '../models/Seller.js';
import userModel from '../models/User.js';

class SellerController {
    /**
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async fetchItems(req, res) {
        const { limit, offset, queryFilter, column, sort } = req.query;
        if (!req.user || req.user.role_id !== 3) {
            return res.status(401).json('Access deny');
        } else {
            const data = await sellerModel.fetchItems(1, limit, req.user, false, offset, queryFilter, column, sort);
            return res.status(200).json({ count: data.size, items: data.items});
        }
    }
    
    
    async fetchFilters (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const items = await sellerModel.fetchFilters();
            return res.status(200).json({ items: items.res });
        }
    }
    
    async percentHistory(req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const items = await sellerModel.getSellerPercentHistory(req.query.emailSeller);
            return res.status(200).json({ items: items.res });
        }
    }
    
    async updatePercent(req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const items = await sellerModel.updatePercent(req.body);
            return res.status(200).json({ success: items.res });
        }
    }
    
    async generateInvoice (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            // check if file exist, than return true
            const order = await sellerModel.generatePdf(req.params.id, req.user.id);
            return res.status(200).json({ fileName: order.filename, success: true, filebase64: order.fileEncoded });
        }
    }
    
    
    async fetchWaitingList (req, res) {
        const { limit, offset, queryFilter, column, sort } = req.query;
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const data = await sellerModel.fetchWaitingItems(1, limit, req.user, false, offset, queryFilter, column, sort);
            return res.status(200).json({ count: data.size, items: data.items});
        }
    }
    
    async createOrders (req, res) {
        await sellerModel.createOrders(req.query.sessionId);
        // if (!data.error) {
        //     return res.status(200).json({success: true});
        // } else {
        //     return res.status(401).json({success: false, error: 'Something wend wrong'});
        // }
        return res.status(200).json({success: true, message: 'creating orders'});
    }
    
    async unsubscribe (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const data = await userModel.unsubscribe(req.body.seller);
            if (data.success) {
                return res.status(200).json({ success: data.success, error: null });
            } else {
                return res.status(403).json({ success: data.success, error: data.error });
    
            }
        }
    }
}

export default new SellerController();
