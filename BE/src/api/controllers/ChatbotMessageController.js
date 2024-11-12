import chatbotMessageModel from '../models/ChatbotMessage.js';


class ChatbotMessageController {
    /**
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async getSinceDate(req, res) {
        const data = await chatbotMessageModel.messagesSinceDate(req.query.sessionId);
        if (!data.error) {
            return res.status(200).json({success: true, unixTimestamp: data.dateComment});
        } else {
            return res.status(401).json({success: false, error: data.error});
        }
    }


    /**
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async addMessages(req, res) {
        const data = await chatbotMessageModel.addMessages(req.query.sessionId, req.body);
        if (!data.error) {
            const dateStr = data.dateComment;
            // Convert to Unix timestamp (in seconds)
            const unixTimestamp = Math.floor(new Date(dateStr).getTime() / 1000);

            return res.status(200).json({unixTimestamp: unixTimestamp});
        } else {
            return res.status(401).json({success: false, error: data.error});
        }
    }

    async addMessagesNew(req, res) {
        const data = await chatbotMessageModel.addMessagesNew(req.query.sessionId, req.body);
        if (!data.error) {
            const dateStr = data.dateComment;
            // Convert to Unix timestamp (in seconds)
            const unixTimestamp = Math.floor(new Date(dateStr).getTime() / 1000);

            return res.status(200).json({unixTimestamp: unixTimestamp});
        } else {
            return res.status(401).json({success: false, error: data.error});
        }
    }
    async addMessagesTest(req, res) {
        const data = await chatbotMessageModel.addMessagesTest(req.query.sessionId, req.body);
console.log('DATA', data);
        if (!data.error) {
            const dateStr = data.dateComment;
            // Convert to Unix timestamp (in seconds)
            const unixTimestamp = Math.floor(new Date(dateStr).getTime() / 1000);

            return res.status(200).json({unixTimestamp: unixTimestamp});
        } else {
console.log('TUT')
            return res.status(401).json({success: false, error: data.error});
        }
    }

    async transformMessages(req, res) {
        try {
            await chatbotMessageModel.transformMessages(req.query.sessionId);
        } catch (e) {

        }

        return res.status(200).json({success: true, message: 'transform messages'});
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
