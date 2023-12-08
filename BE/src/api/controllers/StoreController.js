import storeModel from '../models/Store.js';
import multer from 'multer';
import fs from 'fs';

class StoreController {
    async fetchData (req, res) {
        const { limit, offset, queryFilter, column, sort } = req.query;
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const data = await storeModel.getAll(1, limit, req.user.id, false, offset, queryFilter, column, sort);
        if (!data.error) {
            return res.status(200).json({ items: data.items, count: data.size });
        } else {
            return res.status(401).json({ error: 'Something wend wrong' });
        }
    }

    async deleteRow (req, res) {
        const ids = [];
        ids.push(req.params.id);

        await productModel.bulkDelete(ids, req.user.id);

        return res.status(200).json({ success: true });
    }

    async bulkDelete (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const ids = [];
        JSON.parse(req.body.data).filter(id => id.checked).forEach(data => ids.push(data.id));
        await productModel.bulkDelete(ids, req.user.id);

        return res.status(200).json({ success: true });
    }

    async find (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const data = await productModel.find(req.query.searchStr, req.user.id);

        return res.status(200).json({ result: data});
    }
}

export default new StoreController();
