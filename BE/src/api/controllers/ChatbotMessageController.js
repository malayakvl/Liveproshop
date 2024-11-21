import chatbotMessageModel from '../models/ChatbotMessage.js';
import shell from "shelljs";


class ChatbotMessageController {
    /**
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async getLiveCommentsParamsUrl(req, res) {
        const data = await chatbotMessageModel.getLiveCommentsParams(req.query.sessionId);
        if (!data.error) {
            return res.status(200).json({success: true, nextUrl: data.dateComment});
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

    async predparseMessage(messages) {
        for await (const message of messages) {
            console.log('MESSAGE', message);
        }
    }

    async addMessagesNew(req, res) {
        const data = await chatbotMessageModel.addMessagesNew(req.query.sessionId, req.body);
        const msgIds = [];

        if (!data.error) {
            return res.status(200).json({unixTimestamp: null});
        } else {
            return res.status(401).json({success: false, error: data.error});
        }
    }
    async addMessagesTest(req, res) {
        const data = await chatbotMessageModel.addMessagesTest(req.query.sessionId, req.body);
// console.log('DATA', data);
        if (!data.error) {
            const dateStr = data.dateComment;
            // Convert to Unix timestamp (in seconds)
            const unixTimestamp = Math.floor(new Date(dateStr).getTime() / 1000);

            return res.status(200).json({unixTimestamp: unixTimestamp});
        } else {
// console.log('TUT')
            return res.status(401).json({success: false, error: data.error});
        }
    }

    async transformLiveCommentsCnt(req, res) {
        try {
            const resData = await chatbotMessageModel.transformLiveCommentsCnt(req.query.sessionId);
            return res.status(200).json({success: true, launched: resData.launched });
        } catch (e) {
            return res.status(200).json({success: true, launched: null});
        }

        // return res.status(200).json({success: true, cnt: null});
    }

    async notParsedMessage(req, res) {
        try {
            const data = await chatbotMessageModel.notParsedLiveComments(req.query.sessionId);
console.log(data?.resultData);
            return res.status(200).json({success: true, data: data.resultData });
        } catch (e) {
            return res.status(500).json({success: true, error: 'notParsedMessage'});
        }
    }

    async transformLiveCommentsById(req, res) {
        try {
            await chatbotMessageModel.transformLiveCommentsByMessage(req.query.sessionId, JSON.parse(req.query.messageIds));
            return res.status(200).json({success: true, message: `transform messages`});
        } catch (e) {
            return res.status(500).json({success: false, message: `error transformed`});
        }

        return res.status(200).json({success: true, message: 'transform messages by id'});
    }

    async transformLiveComments(req, res) {
        try {
            await chatbotMessageModel.transformLiveCommentsByMessage(req.query.sessionId, req.query.messageId);
        } catch (e) {
console.log('Error here:', e)
            return res.status(200).json({success: true, message: 'transform messages error'});
        }

        return res.status(200).json({success: true, message: 'transform messages'});
    }

    async transformMessages(req, res) {
        try {
            await chatbotMessageModel.transformMessages(req.query.sessionId);
        } catch (e) {
            return res.status(200).json({success: true, message: 'transform messages error'});
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
