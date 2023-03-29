import multer from 'multer';

class TestController {
    async testData (req, res) {
        let error;
        const testData = [
            { id: 1, title: 'Page 1' },
            { id: 2, title: 'Page 2' }
        ];
        if (testData) res.status(200).json({ user: { name: 'This is Test User', id: 10, token: 'dddweqeeew' } });
        if (error) res.status(error.code).json({ error: 'Show error message' });
    }

    async uploadFile (req, res) {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/uploads');
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname);
            }
        });
        const upload = multer({ storage: storage }).single('photo');
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err);
            } else if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).send(req.file);
        });
    }
}

export default new TestController();
