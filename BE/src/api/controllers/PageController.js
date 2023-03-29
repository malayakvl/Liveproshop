import multer from 'multer';

class PageController {
    async getPage (req, res) {
        let error;
        const testData = [
            { id: 1, title: 'Page 1', slug: 'terms', content: '' }
        ];
        if (testData) res.status(200).json({ data: testData });
        if (error) res.status(error.code).json({ error: 'Show error message' });
    }

    async getAll (req, res) {
        let error;
        const testData =
            [
                {
                    params: {
                        slug: 'terms'
                    }
                },
                {
                    params: {
                        slug: 'price'
                    }
                },
                {
                    params: {
                        slug: 'privacy'
                    }
                }
            ]
        ;
        if (testData) res.status(200).json({ data: testData });
        if (error) res.status(error.code).json({ error: 'Show error message' });
    }
    
    async fetchTags (req, res) {
        return res.status(200).json({ result: [
            { id: 3, name: 'Bananas' },
            { id: 4, name: 'Mangos' },
            { id: 5, name: 'Lemons' },
            { id: 6, name: 'Apricots' }
        ]});
        // return [
        //     { id: 3, name: 'Bananas' },
        //     { id: 4, name: 'Mangos' },
        //     { id: 5, name: 'Lemons' },
        //     { id: 6, name: 'Apricots', disabled: true }
        // ];
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
        const upload = multer({ storage: storage }).single('file');
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

export default new PageController();
