import tagModel from "../models/Tag.js";

class TagController {
    async fetchTags (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const data = await tagModel.findTags(req.query.tag);
        return res.status(200).json({ result: data});
    }
}

export default new TagController();
