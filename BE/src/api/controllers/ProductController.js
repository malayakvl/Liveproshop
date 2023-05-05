import productModel from '../models/Product.js';
import multer from 'multer';
import fs from 'fs';

class ProductController {
    /**
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async fetchAdditional (req, res) {
        const additional = await productModel.getAdditional();
        if (!additional) {
            return res.status(401).json('Something wend wrong');
        }
        return res.status(200).json({ additional: additional.additional });
    }

    async import (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const dirUpload = `${process.env.DOWNLOAD_FOLDER}/users/${req.user.id}`;
        if (!fs.existsSync(dirUpload)) {
            fs.mkdirSync(dirUpload);
        }
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `public/uploads/users/${req.user.id}`);
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname);
            }
        });
        const upload = multer({ storage: storage }).single('file');
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err);
            } else if (err) {
                return res.status(500).json(err);
            }
            const dataUser = {};
            if (req.file) {
                dataUser.file = `/uploads/users/${req.user.id}/${req.file.filename}`;
            }
            await productModel.import(dataUser, req.user.id);
            return res.status(200).json({ success: true });
        });
        // return res.status(200).json({ success: true });
    }

    async addProduct (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                // cb(null, `public/uploads/products/${req.user.id}`);
                // cb(null, './public/uploads/tmp');
                cb(null, `${process.env.DOWNLOAD_FOLDER}/tmp`);
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname);
            }
        });
        const upload = multer({ storage: storage }).any('photos');

        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err);
            } else if (err) {
                return res.status(500).json(err);
            }
            const dataProduct = req.body;
            const photos = [];
            if (req.files.length > 0) {
                req.files.forEach(file => {
                    photos.push(file.filename);
                });
            }
            dataProduct.photos = photos;

            if (!dataProduct.id) {
                await productModel.create(dataProduct, req.user.id);
            } else {
                await productModel.update(dataProduct, req.user.id);
            }
            return res.status(200).json({ success: true });
        });
    }

    async fetchData (req, res) {
        const { limit, offset, queryFilter, column, sort } = req.query;

        if (!req.user) {
            return res.status(401).json('Access deny');
        }

        const data = await productModel.getAll(1, limit, req.user.id, false, offset, queryFilter, column, sort);
        if (!data.error) {
            return res.status(200).json({ items: data.products, count: data.size });
        } else {
            return res.status(401).json({ error: 'Something wend wrong' });
        }
    }

    async fetchProduct (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const data = await productModel.fetchProduct(req.params.id, req.user.id);
        if (!data.error) {
            return res.status(200).json({ product: data });
        } else {
            return res.status(401).json({ error: 'Access deny' });
        }
    }

    async deleteRow (req, res) {
        const ids = [];
        ids.push(req.params.id);

        await productModel.bulkDelete(ids, req.user.id);

        return res.status(200).json({ success: true });
    }

    async copyRow (req, res) {
        const ids = [];
        ids.push(req.params.id);
        const data = await productModel.copyProduct(ids, req.user.id);

        return res.status(200).json({ success: true, productIds: data.productId });
    }

    async deletePhoto (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        await productModel.deletePhoto(req.params.id, req.user.id, req.body.data);
        // delete photo
        fs.unlink(`${process.env.DOWNLOAD_FOLDER}/${req.body.data.replace('/uploads', '')}`,function(err){
            if(err) return console.log(err);
        });
        // fs.unlinkSync(`public/${req.body.data}`);
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

    async bulkCopy (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const ids = [];
        JSON.parse(req.body.data).filter(id => id.checked).forEach(data => ids.push(data.id));
        const data = await productModel.copyProducts(ids, req.user.id);

        return res.status(200).json({ success: true, productIds: data.productId });
    }

    async find (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const data = await productModel.find(req.query.searchStr, req.user.id);

        return res.status(200).json({ result: data});
    }
}

export default new ProductController();
