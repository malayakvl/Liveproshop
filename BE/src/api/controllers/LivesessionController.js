import livesessionModel from '../models/Livesession.js';
import chatbotMessageModel from "../models/ChatbotMessage.js";

class LivesessionController {
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

        const data = await livesessionModel.getAll(1, limit, req.user.id, offset, queryFilter);
        if (!data.error) {
            return res.status(200).json({ items: data.items, count: data.size });
        } else {
            return res.status(401).json({ error: 'Something wend wrong' });
        }
    }

    /**
     * After start event for session change status that session is add to pm2 process
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async launchedSession (req, res) {
        const data = await livesessionModel.launchedSession(req.params.id);
        return res.status(200).json({ result: data.result });
    }

    async removeItem(req, res){
        console.log(req.params.id);

        const data = await livesessionModel.deleteRecord(req.params.id);
        // if (!data.error) {
        //     return res.status(200).json({ items: data.items, count: data.size });
        // } else {
        //     return res.status(401).json({ error: 'Something wend wrong' });
        // }
        return res.status(200).json({ status: true });
    }


    async updateLiveMessage (req, res) {
        const data = await chatbotMessageModel.updateMessageStatus(req.query.comment_id, req.query.recipient_id);
        return res.status(200).json({ result: req.query.comment_id });
    }


    async checkOrderStatus (req, res) {
        // const data = await chatbotMessageModel.checkWaitingItemStatus(req.query.comment_id);
        return res.status(200).json({ result: data.result });
    }


    async checkOrderWaitStatus (req, res) {
        const data = await chatbotMessageModel.checkWaitingItemStatus(req.query.comment_id);
        return res.status(200).json({ result: data.result });
    }


    /**
     * Get list of session which have parameter close but still worked on pm2
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async getLaunchForStop (req, res) {
        const data = await livesessionModel.launchedForStopSession(req.params.id);
        if (!data.error) {
            return res.status(200).json({ result: data.result, error: data.error });
        } else {
            return res.status(401).json({ error: data.error });
        }
    }


    /**
     * Get list of session wich started and get video id for it
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async getSessionsForStart (req, res) {
        const data = await livesessionModel.getSessionsForStart();
        if (!data.error) {
            return res.status(200).json({ result: data.result, error: data.error });
        } else {
            return res.status(401).json({ error: data.error });
        }
    }

    /**
     * Get list of session wich started and get video id for it
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async getStoreSessionsForStart (req, res) {
        const data = await livesessionModel.getStoreSessionsForStart();
        if (!data.error) {
            return res.status(200).json({ result: data.result, error: data.error });
        } else {
            return res.status(401).json({ error: data.error });
        }
    }


    /**
     * Get list of session wich started and get video id for it
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async getStoreSessionsForEnd (req, res) {
        const data = await livesessionModel.getStoreSessionsForEnd();
        if (!data.error) {
            console.log(data.result);
            return res.status(200).json({ result: data.result, error: data.error });
        } else {
            return res.status(401).json({ error: data.error });
        }
    }

    /**
     * Get list of session wich started and get video id for it
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async updateClosedSession (req, res) {
        const data = await livesessionModel.updateClosedSession(req.query.sessionId);
        if (!data.error) {
            // console.log(data.result);
            return res.status(200).json({ success: true, error: data.error });
        } else {
            return res.status(401).json({ error: data.error });
        }
    }


    /**
     * Get list session with started and have video for apply event about parsing/creating order
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async getActiveSessions (req, res) {
        // const data = await livesessionModel.getAllActive();
        const data = await livesessionModel.getAllStoreActive();
        if (!data.error) {
            return res.status(200).json({ result: data.result, error: data.error });
        } else {
            return res.status(401).json({ result: [], error: data.error });
        }
    }

    async getActiveSessionsSender (req, res) {
        // const data = await livesessionModel.getAllActive();
        const data = await livesessionModel.getAllStoreActiveSender();
        if (!data.error) {
            return res.status(200).json({ result: data.result, error: data.error });
        } else {
            return res.status(401).json({ result: [], error: data.error });
        }
    }

    /**
     * Getting FB video id change status to active and setup video ID
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async updateSessionStatusFB (req, res) {
        const data = await livesessionModel.updateSessionStatusFB(req.query.sessionId, req.query.videoId);
        if (!data.error) {
            return res.status(200).json({ result: true, error: data.error });
        } else {
            return res.status(401).json({ result: false, error: data.error });
        }
    }

    /**
     * Getting FB video id change status to active and setup video ID
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async updateStoreSessionStatusFB (req, res) {
        const data = await livesessionModel.updateSessionStoreStatusFB(req.query.sessionId, req.query.videoId);
        if (!data.error) {
            return res.status(200).json({ result: true, error: data.error });
        } else {
            return res.status(401).json({ result: false, error: data.error });
        }
    }

    async getAllInAir (req, res) {
        const data = await livesessionModel.getAllInAir();
        return res.status(200).json({ items: data.result });
    }

    async fetchScenarios (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }

        const data = await livesessionModel.getUserScenarios(req.user.id);
        if (!data.error) {
            return res.status(200).json({ items: data.items });
        } else {
            return res.status(401).json({ error: 'Something wend wrong' });
        }
    }

    async fetchItem (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }

        const data = await livesessionModel.fetchOne(req.user.id, req.params.id);
        return res.status(200).json({ item: data.item });
    }

    async deleteRow (req, res) {
        const ids = [];
        ids.push(req.params.id);

        await livesessionModel.bulkDelete(ids, req.user.id);

        return res.status(200).json({ success: true });
    }

    async storeItem(req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        if (req.body.id) {
            await livesessionModel.update(req.user.id, req.body);
        } else {
            await livesessionModel.create(req.user.id, req.body);
        }
        return res.status(200).json({ success: true });
    }

    async stopSession(req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        await livesessionModel.stopSession(req.params.id, req.user.id);
        return res.status(200).json({ success: true });
    }

    async sendReplyToParsedMessage(req, res) {
        const data = await chatbotMessageModel.getMessagesForReply(req.query.sessionId, req.body);
        // const settings = await set
        if (!data.error) {
            return res.status(200).json({success: true, data: data.items});
        } else {
            return res.status(401).json({success: false, error: data.error});
        }
    }updateMessageForSend

    async updateReplyedMessage(req, res) {
        const messageId = req.query.messageId;
        const replyId = req.query.replyId;
        const data = await chatbotMessageModel.setMessageAsReplied(messageId, replyId);
        if (!data.error) {
            return res.status(200).json({success: true});
        } else {
            return res.status(401).json({success: false});
        }
    }

}

export default new LivesessionController();
