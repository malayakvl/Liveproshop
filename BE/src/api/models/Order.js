import pool from './connect.js';
import { logger } from '../../common/logger.js';
import { OrderStatus, UserRole } from '../../constants/index.js';
import fs from 'fs';
import PDFDocument from 'pdfkit'
import moment from 'moment';
import pdf2base64 from 'pdf-to-base64';
import {
    setTimeout,
} from 'timers/promises';
import axios from "axios";
import * as zipLib from "zip-a-folder";

async function createInvoice (invoice, path, locale) {
    try {
        let doc = new PDFDocument({ size: "A4", margin: 50 });
        await generateHeader(doc, invoice.seller.data, locale);
        await generateCustomerInformation(doc, invoice, locale);
        await generateInvoiceTable(doc, invoice, locale);
        await generateFooter(doc, locale);

        doc.end();
        doc.pipe(fs.createWriteStream(path));

        return {success: true}
    } catch (e) {
        return {success: false}
    }
}


async function generateHeader(doc, seller, locale) {
    const { default: t } = await import(`../sender/order-${locale}.js`);

    doc
        .image("./public/images/logo.png", 40, 45, { width: 160 })
        .fillColor("#444444")
        .fontSize(20)
        .text("", 170, 0)
        .fontSize(10)
        .text(t['address_line_1'], 300, 50, { align: "right" })
        .text(t['address_line_2'], 300, 65, { align: "right" })
        .text(t['address_line_3'], 300, 80, { align: "right" })
        // .text(seller.phone, 300, 95, { align: "right" })
        .moveDown();
}
async function generateCustomerInformation(doc, invoice, locale) {
    const { default: t } = await import(`../sender/order-${locale}.js`);
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text(t["Invoice"], 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text(t["Invoice number:"], 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_nr, 150, customerInformationTop)
        .font("Helvetica")
        .text(t["Invoice Date:"], 50, customerInformationTop + 15)
        .text(invoice.invoice_date, 150, customerInformationTop + 15)
        .text(t["Balance Due:"], 50, customerInformationTop + 30)
        .text(
            formatCurrency(invoice.paid),
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(invoice.shipping.name, 300, customerInformationTop)
        .font("Helvetica")
        .text(invoice.shipping.address, 300, customerInformationTop + 15)
        // .text(
        //     invoice.shipping.city +
        //     ", " +
        //     invoice.shipping.state +
        //     ", " +
        //     invoice.shipping.country,
        //     300,
        //     customerInformationTop + 30
        // )
        .moveDown();

    generateHr(doc, 252);
}

async function generateInvoiceTable(doc, invoice, locale) {
    let i;
    const invoiceTableTop = 330;
    const { default: t } = await import(`../sender/order-${locale}.js`);

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        t["Item"],
        t["Description"],
        t["Unit Cost"],
        t["Quantity"],
        t["Line Total"]
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");
    if (invoice.items) {
        for (i = 0; i < invoice.items.length; i++) {
            const item = invoice.items[i];
            const position = invoiceTableTop + (i + 1) * 30;
            generateTableRow(
                doc,
                position,
                item.name,
                item.description,
                formatCurrency(item.price),
                item.quantity,
                formatCurrency(item.price * item.quantity)
            );

            generateHr(doc, position + 20);
        }

        const subtotalPosition = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            subtotalPosition,
            "",
            "",
            t["Subtotal"],
            "",
            formatCurrency(invoice.subtotal)
        );

        const paidToDatePosition = subtotalPosition + 20;
        generateTableRow(
            doc,
            paidToDatePosition,
            "",
            "",
            t["Shipping Amount"],
            "",
            formatCurrency(invoice.shipping_amount)
        );

        const vatToDatePosition = paidToDatePosition + 20;
        generateTableRow(
            doc,
            vatToDatePosition,
            "",
            "",
            t["VAT"],
            "",
            formatCurrency((invoice.subtotal*15/100))
        );


        const duePosition = vatToDatePosition + 25;
        doc.font("Helvetica-Bold");
        generateTableRow(
            doc,
            duePosition,
            "",
            "",
            t["Total Payment"],
            "",
            formatCurrency(invoice.paid)
        );
        doc.font("Helvetica");
    }
}

async function generateFooter(doc, locale) {
    const { default: t } = await import(`../sender/order-${locale}.js`);
    doc
        .fontSize(10)
        .text(
            t["Payment is due within 15 days. Thank you for your business."],
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        // .text(description.replace(/<[^>]*>?/gm, ''), 150, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(cents) {
    // return "$" + (cents / 100).toFixed(2);
    return parseFloat(cents).toFixed(2)+'€';
}

// function formatDate(date) {
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();
//
//     return year + "/" + month + "/" + day;
// }


class Order {
    async createOrders (sessionId) {
        const client = await pool.connect();
        try {
            const productQuery = `SELECT * FROM data.set_orders_from_live_sessions_messages(${sessionId}, 100);`;
            await client.query(productQuery);
            const items = [];
            const error = null;

            return {
                items,
                error
            };

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Create orders):',
                    { message: e.message }
                );
            }
            const items = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                items,
                error
            };

        } finally {
            client.release();
        }
    }

    async updateProductConfigQty(configId, qty, sessionId) {
        const client = await pool.connect();
        try {
            const updtQuery = `UPDATE data.product_configurations SET quantity=${qty} WHERE id=${configId};`;
            await client.query(updtQuery);

            // run workflow for update waiting items
            const waitListQuery = `SELECT * FROM data.set_orders_from_waiting_list_by_product(${sessionId}, ${configId});`;
            await client.query(waitListQuery);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (runWaitWorkflow):',
                    { message: e.message }
                );
            }
            const items = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                items,
                error
            };
        } finally {
            client.release();
        }
    }

    async runWaitWorkflow(sessionId, productConfigurationId) {
        const client = await pool.connect();
        try {
            const waitListQuery = `SELECT * FROM data.set_orders_from_waiting_list_by_product(${sessionId}, ${productConfigurationId});`;
            await client.query(waitListQuery);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (runWaitWorkflow):',
                    { message: e.message }
                );
            }
            const items = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                items,
                error
            };
        } finally {
            client.release();
        }
    }

    async fetchWaitingItems (page, perPage = 20, user, isRead = false, reqOffset = null, filters, column, sort) {
        const client = await pool.connect();
        try {
            const _filters = JSON.parse(filters);

            switch (user.role_id) {
                case UserRole.ADMIN:
                    break;
                case UserRole.CUSTOMER:
                    _filters.seller_id = [user.id];
                    // if (_filters.userIds) {
                    //     _filters.buyer_id = _filters.userIds;
                    //     delete _filters.userIds;
                    // }
                    break;
                case UserRole.BUYER:
                    _filters.buyer_id = [user.id];
            }

            const _total = await client.query(`SELECT count FROM data.get_orders_waiting_list_count('${JSON.stringify(_filters)}');`);
            const size = _total.rows[0].count;
            let offset;
            if (reqOffset) {
                offset = reqOffset;
            } else {
                offset = (Number(page) - 1) * Number(perPage);
            }
            const ordersQuery = `SELECT
                    id_cnt, live_sessions_id, product_id, product_configuration_id, configuration, item_buyers, total_quantity, total_price
                FROM data.get_orders_waiting_list(${perPage}, ${offset}, '${JSON.stringify(_filters)}', '${column} ${sort}');`;
            const res = await client.query(ordersQuery);
            const items = res.rows.length > 0 ? res.rows : [];
            const error = null;

            return {
                items,
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
            const items = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                items,
                error
            };
        } finally {
            client.release();
        }
    }


    async fetchItems (page, perPage = 20, user, isRead = false, reqOffset = null, filters, column, sort) {
        const client = await pool.connect();
        try {
            const _filters = JSON.parse(filters);
            console.log("BYERS", _filters.shopper_id)

            switch (user.role_id) {
                case UserRole.ADMIN:
                    break;
                case UserRole.CUSTOMER:
                    _filters.seller_id = [user.id];
                    if (_filters.userIds) {
                        _filters.buyer_id = _filters.userIds;
                        delete _filters.userIds;
                    }
                    break;
                case UserRole.BUYER:
                    _filters.buyer_id = [user.id];
            }

            if (_filters.status?.length === 0) {
                if (user.role_id === UserRole.BUYER) {
                    _filters.status = [OrderStatus.PAYED, OrderStatus.SHIPPED, OrderStatus.CANCELED, OrderStatus.NEW];
                } else {
                    _filters.status = [OrderStatus.PAYED, OrderStatus.SHIPPED, OrderStatus.CANCELED];
                }
            }

            _filters.buyer_id = _filters.shopper_id;

            const _total = await client.query(`SELECT count FROM data.get_orders_count('${JSON.stringify(_filters)}');`);
            const size = _total.rows[0].count;
            let offset;
            if (reqOffset) {
                offset = reqOffset;
            } else {
                offset = (Number(page) - 1) * Number(perPage);
            }
            if (!column && !sort) {

            } else {

            }
            const ordersQuery = `SELECT *
                                FROM data.get_orders (${perPage}, ${offset}, '${JSON.stringify(_filters)}', '${column} ${sort}');`;
            console.log(ordersQuery);
            const res = await client.query(ordersQuery);
            const items = res.rows.length > 0 ? res.rows : [];
            const error = null;

            return {
                items,
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
            const items = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                items,
                error
            };

        } finally {
            client.release();
        }
    }

    async fetchFilters (user) {
        const client = await pool.connect();
        try {
            const _filters = {};
            if (user.role_id === UserRole.BUYER) {
                _filters.status = [OrderStatus.PAYED, OrderStatus.SHIPPED, OrderStatus.CANCELED, OrderStatus.NEW];
            } else {
                _filters.status = [OrderStatus.PAYED, OrderStatus.SHIPPED, OrderStatus.CANCELED];
            }
            switch (user.role_id) {
                case UserRole.ADMIN:
                    break;
                case UserRole.CUSTOMER:
                    _filters.seller_id = [user.id];
                    break;
                case UserRole.BUYER:
                    _filters.buyer_id = [user.id];
            }
            const res = {};
            const shipping = await client.query(`SELECT * FROM data.get_orders_shipping('${JSON.stringify(_filters)}');`);
            res.shippings = shipping.rows[0].shipping ? shipping.rows[0].shipping : [];
            const payments = await client.query(`SELECT * FROM data.get_orders_payments('${JSON.stringify(_filters)}');`);
            res.payments = payments.rows[0].payments ? payments.rows[0].payments : [];
            const countries = await client.query(`SELECT * FROM data.get_orders_countries('${JSON.stringify(_filters)}');`);
            res.countries = countries.rows[0].countries ? countries.rows[0].countries : [];
            const amounts = await client.query(`SELECT * FROM data.get_orders_total_amount_range('${JSON.stringify(_filters)}');`);
            res.amounts = amounts.rows[0].total_amount_range.max ? [amounts.rows[0].total_amount_range.min, amounts.rows[0].total_amount_range.max] : [];
            const error = null;
            const _filterBuyers = {};
            if (user.role_id === 2) {
                // sellerIds.push(user.id);
                _filterBuyers.seller_id = [user.id];
                if (_filterBuyers.userIds) {
                    _filterBuyers.buyer_id = _filters.userIds;
                    delete _filterBuyers.userIds;
                }
            }
            // const buyersQuery = `SELECT * FROM data.get_buyers(10000, 0, '${JSON.stringify(_filterBuyers)}', '${column} ${sort}');`;

            const ordersQueryBuyers = await client.query(`SELECT * FROM data.get_buyers(100000, 0, '${JSON.stringify(_filterBuyers)}', 'first_name ASC');`); // 'orders.created_at DESC'
            res.buyers =  ordersQueryBuyers.rows;
            // res.shoppers = await client.query(`SELECT * FROM data.orders WHERE ('${JSON.stringify(_filters)}');`);

            return {
                res,
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
            const items = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                items,
                error
            };

        } finally {
            client.release();
        }
    }



    async generatePdf (orderNumber, userId, user, locale, type='') {
        const client = await pool.connect();
        const selectedLocale = !locale ? locale = 'fr' : locale;
        const { default: t } = await import(`../sender/order-${locale}.js`);
        let error = null;
        try {
            const _filters = {
                // status: [OrderStatus.PAYED],
                order_number: orderNumber
            };

            switch (user.role_id) {
                case UserRole.ADMIN:
                case UserRole.CUSTOMER:
                    _filters.seller_id = userId;
                    break;
                case UserRole.BUYER:
                    _filters.buyer_id = userId;
            }
            const filter = JSON.stringify(_filters);
            const ordersQuery = `SELECT *
                                FROM data.get_orders(1, 0, '${filter}');`;
            const res = await client.query(ordersQuery);
            const dirUpload = `${process.env.DOWNLOAD_FOLDER}/orders/${userId}`;
            const dirArchiveFolder = `${process.env.DOWNLOAD_FOLDER}/users/${userId}/orders/invoices`;
            if (type === 'download' && !fs.existsSync(dirArchiveFolder)) {
                fs.mkdirSync(dirArchiveFolder);
            }
            if (fs.existsSync(`${process.env.DOWNLOAD_FOLDER}/orders/${userId}/${type === 'download' ? 'invoices/' : ''}${res.rows[0].order_number}_${locale}.pdf`)) {
                const base64 = await pdf2base64(`${process.env.DOWNLOAD_FOLDER}/orders/${userId}/${type === 'download' ? 'invoices/' : ''}${res.rows[0].order_number}_${locale}.pdf`)
                    .then(
                        (response) => {
                            return response;
                        }
                    )
                    .catch(
                        (error) => {
                            console.log(error); //Exepection error....
                        }
                    );
                return {
                    filename: `${process.env.DB_DOWNLOAD_FOLDER}/orders/${userId}/${res.rows[0].order_number}_${locale}.pdf`,
                    fileEncoded: base64,
                    error: null
                }
            } else {
                if (!fs.existsSync(dirUpload)) {
                    fs.mkdirSync(dirUpload);
                }
            }
            if (res.rows.length > 0) {
                // get seller information
                const addressRes = await client.query(`SELECT data.addresses.*, data.users.company_name, data.users.phone
                                                       FROM data.addresses LEFT JOIN data.users ON data.users.id=data.addresses.user_id
                                                       WHERE user_id=${res.rows[0].seller_id}`);
                const invoice = {
                    shipping: {
                        name: res.rows[0].buyer_first_name,
                        address: res.rows[0].shipping_address,
                        state: res.rows[0].state,
                        city: res.rows[0].city,
                        post_code: res.rows[0].post_code,
                        phone: res.rows[0].phone
                    },
                    seller: {
                      data: addressRes.rows[0]
                    },
                    items: res.rows[0].order_items,
                    subtotal: res.rows[0].order_amount,
                    shipping_amount: res.rows[0].shipping_amount,
                    paid: res.rows[0].total_amount,
                    invoice_nr: res.rows[0].order_number,
                    invoice_date: moment(res.rows[0].created_at).format('DD/MM/YYYY'),
                };

                await createInvoice(invoice, `${dirUpload}/${res.rows[0].order_number}_${locale}.pdf`, locale);

                await setTimeout(4000);
                if (!fs.existsSync(`${process.env.DOWNLOAD_FOLDER}/orders/${userId}/${res.rows[0].order_number}.pdf`)) {
                    await setTimeout(4000);
                }
                const base64 = await pdf2base64(`${process.env.DOWNLOAD_FOLDER}/orders/${userId}/${res.rows[0].order_number}_${locale}.pdf`)
                    .then(
                        (response) => {
                            return response;
                        }
                    )
                    .catch(
                        (error) => {
                            console.log(error); //Exepection error....
                        }
                    );
                return {
                    filename: `${process.env.DB_DOWNLOAD_FOLDER}/orders/${userId}/${res.rows[0].order_number}_${locale}.pdf`,
                    fileEncoded: base64,
                    isCreated: true,
                    error: null
                }
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Generate PDF):',
                    { message: e.message }
                );
            }
            error = {
                code: 500,
                message: 'Error get list of users'
            };
            return  {
                fileName: '',
                error
            }
        } finally {
            client.release();
        }
    }


    async setupShippingStatus (orderIds) {
        const client = await pool.connect();
        try {
            const SQL = `UPDATE data.orders SET status='shipped' WHERE id IN (${orderIds.join(',')})`;
            await client.query(SQL);
            return {success: true, error: null};
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return {success: false, error: e.message };
        } finally {
            client.release();
        }
    }


    async bulkCancel (orderIds) {
        const client = await pool.connect();
        try {
            const SQL = `SELECT * FROM data.orders  WHERE id IN (${orderIds.join(',')})`;
            const res = await client.query(SQL);
            if (res.rows.length > 0) {
                const promisesQueries = [];
                res.rows.forEach(order => {
                    promisesQueries.push(this.cancelOrder(order));
                });
                if (promisesQueries.length) {
                    await Promise.all(promisesQueries);
                }
                return {success: true, error: null};
            } else {
                return {success: false, error: 'No record find'};
            }

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return {success: false, error: e.message };
        } finally {
            client.release();
        }
    }

    async bulkDownload(ids, user, locale) {
        const client = await pool.connect();
        try {
            const promisesQueries = [];
            ids.forEach(async (id) => {
                const order = await client.query(`SELECT * FROM data.orders WHERE id=${id};`);
                promisesQueries.push(this.generatePdf(order.rows[0].order_number, user.id, user, locale, 'download'));
            });
            if (promisesQueries.length) {
                await Promise.all(promisesQueries);
            }
            await setTimeout(4000);
            const tmpTime = Date.now();
            try {
                await zipLib.zip(`${process.env.DOWNLOAD_FOLDER}/orders/${user.id}`, `${process.env.DOWNLOAD_FOLDER}/achives/${user.id}_${tmpTime}.zip`);
            } catch (e) {
               console.log(e.message)
            }
            await setTimeout(4000);
            return {
                success: true,
                error: null,
                achive: `${process.env.API_URL}${process.env.DB_DOWNLOAD_FOLDER}/achives/${user.id}_${tmpTime}.zip`
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return {success: false, error: e.message };
        } finally {
            client.release();
        }
    }

    async cancelOrder(order) {
        const client = await pool.connect();
        try {
            const sellerSettingsRes = await client.query(`SELECT * FROM data.get_seller_settings(${order.id});`);
            if (sellerSettingsRes.rows.length === 0) {
                return {success: false, error: 'No key for payment'}
            }
            const orderData = {
                "currency": "EUR",
                "amount": order.total_amount*100,
                "description": "Refund by seller"
            }
            const multiSafePayClientRes = await axios
                .post(`https://testapi.multisafepay.com/v1/json/orders/amadeo-order-id-${order.id}/refunds?api_key=${sellerSettingsRes.rows[0].multisafe_api_key}`, orderData,{
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(async () => {
                    await client.query(`UPDATE data.orders SET status='canceled' WHERE id=${order.id};`);
                    return {success: true, error: null}
                }).catch(error => {
                    console.log(error.message);
                    return {success: false, error: error.message}
                });

            return {success: multiSafePayClientRes.success, error: null};
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error:',
                    { message: e.message }
                );
            }
            return {success: false, error: e.message };
        } finally {
            client.release();
        }
    }
}



export default new Order();
