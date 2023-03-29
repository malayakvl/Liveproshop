import chatbotMessageModel from '../models/ChatbotMessage.js';


class ChatbotMessageController {
    /**
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async addMessages(req, res) {
        const data = await chatbotMessageModel.addMessages(req.query.sessionId, req.body);
        if (!data.error) {
            return res.status(200).json({success: true});
        } else {
            return res.status(401).json({success: false, error: data.error});
        }
    }
    
    async parseMessages(req, res) {
        await chatbotMessageModel.parseMessages(req.query.sessionId);
        // if (!data.error) {
        //     return res.status(200).json({success: true});
        // } else {
        //     return res.status(401).json({success: false, error: 'Something wend wrong'});
        // }
        return res.status(200).json({success: true, message: 'parsing messages'});
    }
    
    async createOrders(req, res) {
        await chatbotMessageModel.createOrders();
        return res.status(200).json({success: true, message: 'start create order will be here!!!'});
    }
}

export default new ChatbotMessageController();
