import livesessionModel from '../models/Livesession.js';

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
     * Get list session with started and have video for apply event about parsing/creating order
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async getActiveSessions (req, res) {
        const data = await livesessionModel.getAllActive();
        console.log(data);
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
    
}

export default new LivesessionController();
