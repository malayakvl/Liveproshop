import buyersModel from '../models/Buyer.js';


class BuyerController {
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
            // console.log('req.query = ', req.query);
            const data = await buyersModel.fetchItems(1, limit, req.user, false, offset, queryFilter, column, sort);
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
        const { queryFilter } = req.query;
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            // console.log('req.query = ', req.query);
            const data = await buyersModel.fetchItem(req.user, queryFilter);
            return res.status(200).json(data);
        }
    }
       
    
    async fetchFilters (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const items = await buyersModel.fetchFilters(req.user.id);
            return res.status(200).json({ items: items.res });
        }
    }

}

export default new BuyerController();
