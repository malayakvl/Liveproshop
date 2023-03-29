import notificationModel from '../models/Notification.js';

class NotificationController {
    async fetchNew (req, res) {
        if (!req.user) {
            return res.status(402).json('Something wend wrong');
        }
        const cnt = await notificationModel.fetchNew(req.user.id);
        return res.status(200).json({ cntNotice: cnt });
    }

    async fetchLatest (req, res) {
        if (!req.user) {
            return res.status(402).json('Something wend wrong');
        }
        const cnt = await notificationModel.fetchNew(req.user.id);
        const data = await notificationModel.getAll(1, 5, req.user.id, false);
        if (!data.error) {
            return res.status(200).json({ items: data.notifications, count: cnt });
        } else {
            return res.status(402).json({ error: 'Something wend wrong' });
        }
    }

    async fetchData (req, res) {
        const { limit, offset } = req.query;
        /*
        {
          column: 'created_at',
          limit: '35',
          offset: '0',
          query: '',
          sort: 'DESC'
        }

         */
        if (!req.user) {
            return res.status(402).json('Something wend wrong');
        }
        const data = await notificationModel.getAll(1, limit, req.user.id, false, offset);
        if (!data.error) {
            return res.status(200).json({ items: data.notifications, count: data.size });
        } else {
            return res.status(402).json({ error: 'Something wend wrong' });
        }
    }
}

export default new NotificationController();
