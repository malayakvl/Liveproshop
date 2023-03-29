import multer from 'multer';
import shippingModel from '../models/Shipping.js'

export default new class ShippingController {
    create(req, res) {
        if (!req.user) {
            return res.status(402).json('Something wend wrong');

        }

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/uploads/shipping/');
            },
            filename: function (req, file, cb) {
                const unique = (Date.now() + '-' + Math.floor(Math.random() * 100))
                const extension = file.originalname.split('.').pop()

                cb(null, `${unique}.${extension}`);
            }
        });

        const upload = multer({ storage }).single('logo');

        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err);

            }

            const shipping = await shippingModel.findByName(req.body.name)

            if (shipping) {
                return res.status(403).json({})

            }

            shippingModel.create(req.body.name, `/uploads/shipping/${req.file.filename}`);

            return res.status(200).json({});
        });

    }

    async update(req, res) {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/uploads/shipping/');
            },
            filename: function (req, file, cb) {
                const unique = (Date.now() + '-' + Math.floor(Math.random() * 100))
                const extension = file.originalname.split('.').pop()

                cb(null, `${unique}.${extension}`);
            }
        });

        const upload = multer({ storage }).single('logo');

        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err);

            }
            const id = req.params.id
            const name = req.body.name

            let shipping = await shippingModel.findByName(name)

            if (!shipping || (shipping && shipping.id == id)) {
                shipping = await shippingModel.findById(id)
                shippingModel.update(id, name, req.file ? `/uploads/shipping/${req.file.filename}` : shipping.image)
                return res.status(200).json({});

            }

            return res.status(403).json({});

        });

    }

    delete(req, res) {
        shippingModel.delete(req.params.id).then(() => {
            res.status(200).json({})
        })

    }

    async saveCountries(req, res) {
        await shippingModel.saveCountries(req.user.id, req.params.id, req.body)
        return res.status(200).json({})
    }

    async fetchAll(req, res) {
        if (!req.user) return res.status(401).json('Access deny');

        let shippings = []

        if (req.user.role_id !== 3) {
            shippings = await shippingModel.fetchCustomerAll(req.user.id)

        } else {
            shippings = await shippingModel.fetchAll(req.user.id)

        }

        if (!shippings || !shippings.length) {
            return res.status(200).json({ shippings: [] })
        }

        return res.status(200).json({ shippings })

    }

    async fetch(req, res) {
        if (!req.user) return res.status(401).json('Access deny');

        const shipping = await shippingModel.findById(req.params.id)
        const countries = await shippingModel.findCountriesById(req.params.id, req.user.id)

        return res.status(200).json({ ...shipping, countries })
    }

    changeStatuses(req, res) {
        const user = req.user
        const status = req.body.status

        if (user.role_id !== 3) {
            shippingModel.changeCustomerStatuses(status, user.id)
            return res.status(200).json({})
        }

        shippingModel.changeStatuses(status)
        return res.status(200).json({})

    }

    changeStatus(req, res) {
        const user = req.user
        const status = req.body.status
        const shippingId = req.params.id

        if (user.role_id !== 3) {
            shippingModel.changeCustomerStatus(status, user.id, shippingId)
            return res.status(200).json({})
        }

        shippingModel.changeStatus(status, shippingId)
        return res.status(200).json({})

    }

    setThreshold(req, res) {
        shippingModel.setThreshold(req.user.id, req.body.threshold)
        res.status(200).json({})
    }

    async fetchThreshold(req, res) {
        if (!req.user) return res.status(401).json('Access deny');

        const result = await shippingModel.fetchThreshold(req.user.id)

        if (!result) {
            return res.status(200).json({ threshold: '' })
        }

        return res.status(200).json({ threshold: result.threshold })

    }
}
