import dashboardModel from '../models/Dashboard.js';

class DashboardController {
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
            const data = await dashboardModel.fetchItems(limit, offset, queryFilter, req.user, column, sort);
            return res.status(200).json(data);
        }
    }
}

export default new DashboardController();
