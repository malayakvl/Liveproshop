import pool from './connect.js';
import tagModel from "./Tag.js";
import { logger } from '../../common/logger.js';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

function createListFromCSV(pathName){
    return new Promise((resolve, reject) => {
        const wholeCSV = [];
        fs.createReadStream(pathName)
            .on('error' , reject)
            .pipe(csv())
            .on('data', (row) => {
                wholeCSV.push(row);
            })
            .on('end', ()=> {
                resolve(wholeCSV);
            });
    })
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const copyRecursiveSync = function(src, dest) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName),
                path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

class Product {
    async getAdditional () {
        const client = await pool.connect();
        try {
            const queryColors = 'SELECT table_translation FROM common__tools._get_translation(\'data\', \'product_colors\', \'id\', \'name, code\');';
            const querySizes = 'SELECT table_translation FROM common__tools._get_translation(\'data\', \'product_sizes\', \'id\', \'name\', \'\', \'id\');';
            const querySizesTable = 'SELECT data.get_products_size_list();';
            const queryMaterials = 'SELECT table_translation FROM common__tools._get_translation(\'data\', \'product_materials\', \'id\', \'name\');';
            const queryPrices = 'SELECT * FROM data.get_products_price_range();';
            const queryQty = 'SELECT * FROM data.get_products_quantity_range();';
            const resColors = await client.query(queryColors);
            const resSizes = await client.query(querySizes);
            const resSizesTable = await client.query(querySizesTable);
            const resMaterials = await client.query(queryMaterials);
            const resPrices = await client.query(queryPrices);
            const resQty = await client.query(queryQty);
            return { additional: {
                    colors: resColors.rows.length ? resColors.rows[0].table_translation : null,
                    sizes: resSizes.rows.length ? resSizes.rows[0].table_translation : null,
                    sizesTable: resSizesTable.rows.length ? resSizesTable.rows[0].get_products_size_list : null,
                    materials: resMaterials.rows.length ? resMaterials.rows[0].table_translation : null,
                    price: resPrices.rows.length ? [resPrices.rows[0].get_products_price_range.min, resPrices.rows[0].get_products_price_range.max] : [],
                    quantity: resQty.rows.length ? [resQty.rows[0].get_products_quantity_range.min, resQty.rows[0].get_products_quantity_range.max] : [],
                    priceRange: resPrices.rows.length ? resPrices.rows[0].get_products_price_range : null,
                    qtyRange: resQty.rows.length ? resQty.rows[0].get_products_quantity_range : null
                }
            };
        } catch (e) {
            console.log(e.message);
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error1:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Addresses Not found' } };
        } finally {
            client.release();
        }
    }
    
    
    
    
    async import (data, userId) {
        const dataProduct = [];
        const tmpData = await createListFromCSV(`./public${data.file}`);
        const client = await pool.connect();
        for (let i=0; i < tmpData.length; i++) {
            if (tmpData[i+1]) {
                if (tmpData[i+1].product_name === '') {
                    let j = (i+1);
                    const configuration = [];
                    for (let k=(i+1); k < tmpData.length; k++) {
                        if (tmpData[k].product_name !== '') {
                            j = k;
                            break;
                        } else {
                            configuration.push({
                                "sku": tmpData[k].sku,
                                "price": tmpData[k].price,
                                "quantity": tmpData[k].quantity,
                                "color_name": tmpData[k].color ? capitalizeFirstLetter(tmpData[k].color) : null,
                                "size_name": tmpData[k].size ? capitalizeFirstLetter(tmpData[k].size) : null
                            })
                        }
                    }
                    if (tmpData[i].product_name) {
                        dataProduct.push({
                            user_id: userId,
                            name: tmpData[i].product_name,
                            description: tmpData[i].description,
                            material_name: tmpData[i].material_value ? capitalizeFirstLetter(tmpData[i].material_value) : null,
                            photos: tmpData[i].photos ? tmpData[i].photos.split(',') : null,
                            tags: tmpData[i].hashtag ? tmpData[i].hashtag.replaceAll('#', '').split(',') : null,
                            publish: tmpData[i].publish === 'TRUE',
                            configured: true,
                            configuration: configuration
                        });
                    }
                    i = j - 1;
                } else {
                    if (tmpData[i].product_name) {
                        dataProduct.push({
                            user_id: userId,
                            name: tmpData[i].product_name,
                            description: tmpData[i].description,
                            material_name: tmpData[i].material_value ? capitalizeFirstLetter(tmpData[i].material_value) : null,
                            photos: tmpData[i].photos ? tmpData[i].photos.split(',') : null,
                            tags: tmpData[i].hashtag ? tmpData[i].hashtag.replaceAll('#', '').split(',') : null,
                            publish: tmpData[i].publish === 'TRUE',
                            configured: true,
                            configuration: [
                                {
                                    "sku": tmpData[i].sku,
                                    "price": tmpData[i].price,
                                    "quantity": tmpData[i].quantity,
                                    "color_name": tmpData[i].color ? capitalizeFirstLetter(tmpData[i].color) : null,
                                    "size_name": tmpData[i].size ? capitalizeFirstLetter(tmpData[i].size) : null
                                }
                            ]
                        });
                    }
                }
            } else {
                if (tmpData[i].product_name) {
                    dataProduct.push({
                        user_id: userId,
                        name: tmpData[i].product_name,
                        description: tmpData[i].description,
                        material_name: tmpData[i].material_value ? capitalizeFirstLetter(tmpData[i].material_value) : null,
                        photos: tmpData[i].photos ? tmpData[i].photos.split(',') : null,
                        tags: tmpData[i].hashtag ? tmpData[i].hashtag.replaceAll('#', '').split(',') : null,
                        publish: tmpData[i].publish === 'TRUE',
                        configured: true,
                        configuration: [
                            {
                                "sku": "123",
                                "price": tmpData[i].price,
                                "quantity": tmpData[i].quantity,
                                "color_name": tmpData[i].color ? capitalizeFirstLetter(tmpData[i].color) : null,
                                "size_name": tmpData[i].size ? capitalizeFirstLetter(tmpData[i].size) : null
                            }
                        ]
                    });
                }
            }
        }
        try {
            await client.query(`SELECT * FROM data.import_products('${JSON.stringify(dataProduct)}')`);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Tags error:',
                    { message: `SELECT * FROM data.import_products('${JSON.stringify(dataProduct)}')` }
                );
                logger.log(
                    'error',
                    'Model Tags error:',
                    { message: e.message }
                );
            }
        }
    }

    
    async find(searchStr, userId) {
        const client = await pool.connect();
        try {
            const query = `SELECT * FROM data.find_product_by_name(${userId}, '${searchStr}');`;
            const res = await client.query(query);
            return res.rows[0].find_product_by_name ? res.rows[0].find_product_by_name : [];
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Tag error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Tags Not found' } };
        } finally {
            client.release();
        }
    }
    
    
    async prepareTags(tags) {
        const productTags = [];
        try {
            const promisesTags = [];
            if (tags) {
                JSON.parse(tags).forEach(tag => {
                    if (!tag.id) {
                        promisesTags.push(tagModel.createTag(tag.name));
                    } else {
                        productTags.push(tag.id);
                    }
                });
                const newTagsIds = await Promise.all(promisesTags);
                return productTags.concat(newTagsIds);
            } else return [];
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model Tags error:',
                    { message: e.message }
                );
            }
        }
    }

    async update (dataProduct, userId) {
        const client = await pool.connect();
        try {
            const _resProd = await client.query(`SELECT * FROM data.products WHERE id=${dataProduct.id} AND user_id=${userId}`);
            let photos = [];
            const copyPhotos = [];
            if (_resProd.rows.length) {
                if (_resProd.rows[0].photos) photos = _resProd.rows[0].photos;
                const sourceDir = `${process.env.DOWNLOAD_FOLDER}/tmp`;
                const dirUpload = `${process.env.DOWNLOAD_FOLDER}/products/${dataProduct.id}`;
                const dirDBUpload = `${process.env.DB_DOWNLOAD_FOLDER}/products/${dataProduct.id}`;
                if (!fs.existsSync(dirUpload)) {
                    fs.mkdirSync(dirUpload);
                }
                // copies files to product dir
                if (dataProduct.photos.length > 0) {
                    const promisesPhotos = [];
                    dataProduct.photos.forEach(photo => {
                        promisesPhotos.push(this.copyFiles(sourceDir, dirUpload, photo));
                    });
                    await Promise.all(promisesPhotos);
                    dataProduct.photos.forEach(photo => {
                        copyPhotos.push(`${dirDBUpload}/${photo}`);
                    })
                }
                const productPhotos = photos.concat(copyPhotos);
                
                // prepare tags
                // const tags = [];
                const tags = await this.prepareTags(dataProduct.tags);
                const productTags = _resProd.rows[0].tags ? _resProd.rows[0].tags.concat(tags) : tags;
                
                const queryUpdate = `
                    UPDATE data.products
                    SET
                        name = $$${dataProduct.name}$$,
                        description = $$${dataProduct.description}$$,
                        photos = '{${productPhotos}}',
                        tags = '{${productTags}}',
                        material_id = ${dataProduct.material_id},
                        configured = ${dataProduct.configured ? dataProduct.configured : true},
                        publish = ${dataProduct.publish ? dataProduct.publish : true}
                     WHERE id=${_resProd.rows[0].id};`;
                await client.query(queryUpdate);
                
                // update configuration
                await client.query(`DELETE FROM data.product_configurations WHERE product_id=${_resProd.rows[0].id}`);
                const configs = JSON.parse(dataProduct.configurations);
                if (configs.config) {
                    const promisesQueries = [];
                    configs.config.forEach((configuration, index) => {
                        promisesQueries.push(this.addConfiguration(_resProd.rows[0].id, configuration, configs.configData[[index]]));
                    });
                    await Promise.all(promisesQueries);
                }
    
                return { success: true };
            } else {
                return { success: false };
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Addresses Not found' } };
        } finally {
            client.release();
        }
    }

    async create (dataProduct, userId) {
        const client = await pool.connect();
        try {
            // prepare tags
            const tags = await this.prepareTags(dataProduct.tags);
            // const tags = [];
    
            const queryInsert = `
                INSERT INTO data.products
                    (name, description, tags, photos, publish, configured, material_id, user_id )
                VALUES (
                    $$${dataProduct.name}$$,
                    $$${dataProduct.description}$$,
                    '{${tags}}',
                    '{${dataProduct.photos}}',
                    ${dataProduct.publish ? dataProduct.publish : true},
                    ${dataProduct.configured ? dataProduct.configured : false},
                    ${dataProduct.material_id},
                    ${userId}
                ) RETURNING id;`;
            const resProduct = await client.query(queryInsert);
            
            const sourceDir = `${process.env.DOWNLOAD_FOLDER}/tmp`;
            const dirUpload = `${process.env.DOWNLOAD_FOLDER}/products/${resProduct.rows[0].id}`;
            const dirDBUpload = `${process.env.DB_DOWNLOAD_FOLDER}/products/${resProduct.rows[0].id}`;
            if (!fs.existsSync(dirUpload)) {
                fs.mkdirSync(dirUpload);
            }
            // copies files to product dir
            if (dataProduct.photos.length > 0) {
                const copyPhotos = [];
                const promisesPhotos = [];
                dataProduct.photos.forEach(photo => {
                    promisesPhotos.push(this.copyFiles(sourceDir, dirUpload, photo));
                });
                await Promise.all(promisesPhotos);
                dataProduct.photos.forEach(photo => {
                    copyPhotos.push(`${dirDBUpload}/${photo}`);
                })
                if (copyPhotos.length > 0) {
                    const queryUpdate = `
                        UPDATE data.products
                        SET
                            photos = '{${copyPhotos}}'
                         WHERE id=${resProduct.rows[0].id};`;
                    await client.query(queryUpdate);
                }
            }
    
            // update configuration
            const configs = JSON.parse(dataProduct.configurations);
            if (configs.config) {
                const promisesQueries = [];
                configs.config.forEach((configuration, index) => {
                    promisesQueries.push(this.addConfiguration(resProduct.rows[0].id, configuration, configs.configData[[index]]));
                });
                await Promise.all(promisesQueries);
            }

            return { success: true };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return { success: false, error: { code: 404, message: 'Addresses Not found' } };
        } finally {
            client.release();
        }
    }
    
    async copyFiles(sourceDir, dirUpload, photo) {
        fs.copyFile(`${sourceDir}/${photo}`, `${dirUpload}/${photo}`, (err) => {
            if (err) {
                throw err;
            }
            fs.unlink(`${sourceDir}/${photo}`,function(err){
                if(err) return console.log(err);
            });
        });
    }

    async fetchProduct (id, userId) {
        const client = await pool.connect();
        try {
            const res = await client.query(`SELECT * FROM data.products WHERE user_id=${userId} AND id=${id}`);
            if (res.rows.length) {
                res.rows[0].selectedColors = [];
                res.rows[0].selectedSizes = [];
                res.rows[0].selectedMaterials = [];
                const resConfigs = await client.query(`SELECT * FROM data.product_configurations WHERE product_id=${id}`);
                
                // build configured options
                if (resConfigs.rows.length > 0) {
                    const colors = [];
                    const sizes = [];
                    resConfigs.rows.forEach(config => {
                        if (config.configuration.color_id) {
                            colors.push(config.configuration.color_id);
                        }
                        if (config.configuration.size_id) {
                            sizes.push(config.configuration.size_id);
                        }
                    });
                    let selectedColorsData = [];
                    if (colors.length > 0) {
                        const queryColors = `SELECT table_translation FROM common__tools._get_translation('data', 'product_colors', 'id', 'name, code', ' id IN (${colors.join(',')})');`;
                        const resColor = await client.query(queryColors);
                        selectedColorsData = resColor.rows[0].table_translation;
                    }
                    let selectedSizesData = [];
                    if (sizes.length > 0) {
                        const querySizes = `SELECT table_translation FROM common__tools._get_translation('data', 'product_sizes', 'id', 'name', ' id IN (${sizes.join(',')})');`;
                        const resSize = await client.query(querySizes);
                        selectedSizesData = resSize.rows[0].table_translation;
                    }
                    let selectedMaterialsData = [];
                    if (res.rows[0].material_id) {
                        const queryMaterials = `SELECT table_translation FROM common__tools._get_translation('data', 'product_materials', 'id', 'name', ' id=${res.rows[0].material_id}');`;
                        const resMaterial = await client.query(queryMaterials);
                        selectedMaterialsData = resMaterial.rows[0].table_translation;
                    }
                    if (!res.rows[0].configured) {
                        res.rows[0].sku = resConfigs.rows[0].sku;
                        res.rows[0].price = resConfigs.rows[0].price;
                        res.rows[0].quantity = resConfigs.rows[0].quantity;
                    }
                    let selectedTagsData = [];
                    if (res.rows[0].tags) {
                        if (res.rows[0].tags.length > 0) {
                            const queryTags = `SELECT table_translation FROM common__tools._get_translation('data', 'hashtags', 'id', 'name', ' id IN (${res.rows[0].tags.join(',')})');`;
                            const resTags = await client.query(queryTags);
                            selectedTagsData = resTags.rows[0].table_translation;
                        }
                    }
                    res.rows[0].selectedColors = selectedColorsData;
                    res.rows[0].selectedSizes = selectedSizesData;
                    res.rows[0].selectedMaterials = selectedMaterialsData;
                    res.rows[0].selectedTags = selectedTagsData;
                }
                // res.rows[0].configured = resConfigs.rows.length > 0;
                return { product: res.rows[0], configurations: resConfigs.rows };
            } else {
                return { success: false, error: { code: 404, message: 'Product Not found' } };
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Product fetch one product):',
                    { message: e.message }
                );
            }
            const products = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                products,
                error
            };
        } finally {
            client.release();
        }
    }

    async getAll (page, perPage = 20, userId, isRead = false, reqOffset = null, filters, column, sort) {
        const client = await pool.connect();
        try {
            const userIds = [];
            userIds.push(userId);
            const _filters = JSON.parse(filters);
            _filters.user_id = userIds;
            const _total = await client.query(`SELECT count FROM data.get_products_count('${JSON.stringify(_filters)}');`);
            const size = _total.rows[0].count;
            let offset;
            if (reqOffset) {
                offset = reqOffset < size ? reqOffset : (Math.ceil(size / perPage) - 1) * perPage;
            } else {
                offset = (Number(page) - 1) * Number(perPage);
            }
            const productQuery = `SELECT * FROM data.get_products(${perPage}, ${offset}, '${JSON.stringify(_filters)}', '${column} ${sort}');`;
            // const res = await client.query(`SELECT * FROM data.get_all_products(${perPage}, ${offset}, 'user_id=''${userId}'' ')`);
            const res = await client.query(productQuery);
            const products = res.rows.length > 0 ? res.rows : [];
            const error = null;

            return {
                products,
                size,
                error
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Products getAll):',
                    { message: e.message }
                );
            }
            const products = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                products,
                error
            };
        } finally {
            client.release();
        }
    }

    async addConfiguration (productId, config, configData) {
        const SQL = `INSERT INTO data.product_configurations (product_id, price, quantity, sku, configuration)
                        VALUES (
                            ${productId},
                            ${configData.price},
                            ${configData.qty},
                            '${configData.sku || '' }',
                            '${JSON.stringify(config)}'
                        )`;
        const client = await pool.connect();
        try {
            await client.query(SQL);
            return true;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error Product Configuration:',
                    { message: e.message }
                );
            }
            return null;
        } finally {
            client.release();
        }
    }

    
    async bulkDelete (productIds, userId) {
        const client = await pool.connect();
        try {
            const SQL = `SELECT * FROM data.products WHERE id IN (${productIds.join(',')}) AND user_id=${userId}`;
            const res = await client.query(SQL);
            if (res.rows.length > 0) {
                res.rows.forEach(product => {
                    const photos = product.photos;
                    if (photos) {
                        photos.forEach(photo => {
                            fs.unlink(`${process.env.DOWNLOAD_FOLDER}/${photo.replace('/uploads', '')}`,function(err){
                                if(err) return console.log(err);
                            });
                        })
                    }
                });
                await client.query(`DELETE FROM data.products WHERE id IN (${productIds.join(',')}) AND user_id=${userId}`);
                return true;
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return null;
        } finally {
            client.release();
        }
    }
    
    async copyProducts(ids) {
        if (ids.length > 0) {
            try {
                const promisesQueries = [];
                ids.forEach(id => {
                    const _ids = [];
                    _ids.push(id);
                    promisesQueries.push(this.copyProduct(_ids));
                });
                if (promisesQueries.length) {
                    const data = await Promise.all(promisesQueries);
                    
                    return {productId: data}
                }
            } catch (e) {
                if (process.env.NODE_ENV === 'development') {
                    logger.log(
                        'error',
                        'Model copyProducts error:',
                        { message: e.message }
                    );
                }
            }
            
        } else {
            return true;
        }
    }
    
    async copyProduct(ids) {
        const client = await pool.connect();
        const SQL = `SELECT * FROM data.copy_products('[${ids.join(',')}]');`;
        try {
            const res = await client.query(SQL);
            const newIds = res.rows[0].id_json_arr;
            
            if (newIds.length > 0) {
                const promisesQueries = [];
                newIds.forEach(id => {
                    promisesQueries.push(this.copyPhotos(id));
                });
                if (promisesQueries.length) {
                    await Promise.all(promisesQueries);
                }
            }
            return {productId: newIds}
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model copyProducts error:',
                    { message: e.message }
                );
            }
            return null;
        } finally {
            client.release();
        }
    }
    
    
    async copyPhotos(productId) {
        const client = await pool.connect();
        const SQL = `SELECT photos FROM data.products WHERE id= ${productId};`;
        try {
            const res = await client.query(SQL);
            const product = res.rows[0];
            if (product.photos.length > 0) {
                // get copyed product id from photos
                const _photo = product.photos[0].split('/');
                copyRecursiveSync(`./public/uploads/products/${_photo[3]}`, `./public/uploads/products/${productId}`);
                const newPhotos = [];
                product.photos.forEach(photo => {
                    newPhotos.push(photo.replace(`products/${_photo[3]}/`, `products/${productId}/`));
                });
                const queryUpdate = `
                    UPDATE data.products
                    SET
                        photos = '{${newPhotos}}'
                     WHERE id=${productId} ;`;
                await client.query(queryUpdate);
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model copyPhotos error:',
                    { message: e.message }
                );
            }
            return null;
        } finally {
            client.release();
        }
        
    }
    
    
    async bulkCopy (productIds, userId) {
        const client = await pool.connect();
        const SQL = `SELECT * FROM data.products WHERE id IN (${productIds.join(',')}) AND user_id=${userId}`;
        try {
            const res = await client.query(SQL);
            if (res.rows.length > 0) {
                const promisesQueries = [];
                res.rows.forEach(product => {
                    promisesQueries.push(this.copyProduct(product));
                });
                if (promisesQueries.length) {
                    await Promise.all(promisesQueries);
                }
                return true;
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return null;
        } finally {
            client.release();
        }
    }
    
    
    async deletePhoto (productId, userId, photo) {
        const SQL = `SELECT photos FROM data.products WHERE user_id=${userId} AND id=${productId}`;
        const client = await pool.connect();
        try {
            const res = await client.query(SQL);
            const productPhotos = res.rows[0].photos;
            // {uploads/products/4/1639512136725-j3.jpeg,uploads/products/4/1639512136725-j2.jpeg}
            const queryUpdate = `
                    UPDATE data.products
                    SET
                        photos = '{${productPhotos.filter(file => file !== photo)}}'
                     WHERE id=${productId} ;`;
            await client.query(queryUpdate);
            return true;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return null;
        } finally {
            client.release();
        }
    }
    
    
}

export default new Product();
