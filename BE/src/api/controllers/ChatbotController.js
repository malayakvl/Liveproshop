import chatbotModel from '../models/Chatbot.js';

class ChatbotController {
    /**
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async fetchItems (req, res) {
        const { limit, offset, queryFilter } = req.query;

        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        
        const data = await chatbotModel.getAll(1, limit, req.user.id, offset, queryFilter);
        if (!data.error) {
            return res.status(200).json({ items: data.items, count: data.size });
        } else {
            return res.status(401).json({ error: 'Something wend wrong' });
        }
    }
    
    async fetchItemsSystem (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        
        const items = await chatbotModel.getAllSystem();
        return res.status(200).json({ items: items.items, count: items.size });
    }

    async fetchItem (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        
        const data = await chatbotModel.fetchOne(req.user.id, req.params.id);
        return res.status(200).json({ item: data.item });
    }

    async deleteRow (req, res) {
        const ids = [];
        ids.push(req.params.id);
    
        await chatbotModel.bulkDelete(ids, req.user.id);
        
        return res.status(200).json({ success: true });
    }
    
    async storeItem(req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        let result;
        if (req.body.id) {
            result = await chatbotModel.update(req.user.id, req.body);
        } else {
            result = await chatbotModel.create(req.user.id, req.body);
        }
        if (!result.error) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ success: false, error: result.error.message });
        }
    }
    
    async storeItemDefault(req, res) {
        if (!req.user || req.user.role_id !== 3) {
            return res.status(401).json('Access deny');
        }
        const result = await chatbotModel.updateDefault(req.user.id, req.body);
        if (!result.error) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ success: false, error: result.error.message });
        }
    }
    
    async bulkDelete (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const ids = [];
        JSON.parse(req.body.data).filter(id => id.checked).forEach(data => ids.push(data.id));
        await chatbotModel.bulkDelete(ids, req.user.id);
        return res.status(200).json({ success: true });
    }
    
    async changeActive(req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        await chatbotModel.changeActive(req.params.id, req.user.id);
    
        return res.status(200).json({ success: true });
    }
    
    async changeAllActive(req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        await chatbotModel.changeAllActive(req.query.status, req.user.id);
        return res.status(200).json({ success: true });
    }
}

export default new ChatbotController();
