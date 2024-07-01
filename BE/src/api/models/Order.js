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
import { generateRndPrefix } from "../lib/utils.js";
import shell from "shelljs";
import {
    confirmShippedEmail, confirmSubscriptionEmail
} from "../sender/templates.js";
import { sendMail } from "../lib/sendMail.js";
import * as nodeFetch from "node-fetch";




async function createInvoice (invoice, path, locale, ivoiceType) {
    try {
        let doc = new PDFDocument({ size: "A4", margin: 50 });
        await generateHeader(doc, invoice.seller.data, locale);
console.log('generate header done');
        await generateCustomerInformation(doc, invoice, invoice.paymentDetails, locale, ivoiceType);
        await generateInvoiceTable(doc, invoice, locale, ivoiceType);
        await generateFooter(doc, locale);

        doc.end();
        doc.pipe(fs.createWriteStream(path));

        return {success: true}
    } catch (e) {
        console.log("error")
        return {success: false}
    }
}


async function generateHeader(doc, seller, locale) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("", 170, 0)
        .fontSize(10)
        .text(seller.full_address, 300, 50, { align: "right" })
        .text(`${seller.phone}`, 300, 75, { align: "right" })
        // .text(`${seller.address_line_1}`, 300, 65, { align: "right" })
        .text(seller.company_name, 300, 90, { align: "right" })
        .text("VAT: 20%", 300, 105, { align: "right" })
        // .text(seller.phone, 300, 95, { align: "right" })
        .moveDown();
}
async function generateCustomerInformation(doc, invoice, paymentData, locale, ivoiceType) {
    const { default: t } = await import(`../sender/order-${locale}.js`);
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text(ivoiceType !== 'refund' ? t["Invoice"] : t["Refund"], 50, 160);

    generateHr(doc, 185);
    const customerInformationTop = 200;
    let deliveryAddress = [];
    deliveryAddress[0] = invoice.shipping.country ? invoice.shipping.country : '';
    if (invoice.shipping.state) {
        deliveryAddress[1] = invoice.shipping.state ? invoice.shipping.state : 'N/A';
        deliveryAddress[2] = invoice.shipping.post_code;
        deliveryAddress[3] = invoice.shipping.city;
        deliveryAddress[4] = invoice.shipping.address;
    } else {
        deliveryAddress[1] = invoice.shipping.post_code;
        deliveryAddress[2] = invoice.shipping.city;
        deliveryAddress[3] = invoice.shipping.address;

    }
    const captionTotal = ivoiceType !== 'refund' ? t["Balance Due:"] : t["Refund Due:"];
    const captionNumber = ivoiceType !== 'refund' ? t["Invoice number:"] : t["Refund number:"];
    const captionDate = ivoiceType !== 'refund' ? t["Invoice Date:"] : t["Refund Date:"];
console.log('Ebat', invoice);
console.log('Transaction Id', invoice.transaction_id);
console.log('Payment Type', invoice.paymentType);

    let transactionId = '';
    if (invoice.paymentType === 'MASTERCARD' || invoice.paymentType === 'VISA') {
       transactionId = invoice.paymentDetails.paymentData.costs[0].transaction_id;
    } else if (invoice.paymentType === 'TRUSTLY') {
        transactionId = invoice.transaction_id;
    } else if (invoice.paymentType === 'CBC') {
        transactionId = invoice.transaction_id;
    } else if (invoice.paymentType === 'WECHAT') {
        transactionId = invoice.transaction_id;
    } else if (invoice.paymentType === 'MBWAY') {
        transactionId = invoice.transaction_id;
    } else if (invoice.paymentType === 'MULTIBANCO') {
        transactionId = invoice.transaction_id;
    } else if (invoice.paymentType === 'AMEX') {
        transactionId = invoice.transaction_id;
    } else if (invoice.paymentType === 'BANKTRANS') {
        transactionId = invoice.transaction_id;
    } else if (invoice.paymentType === 'PAYPAL') {
        transactionId = invoice.transaction_id;
    } else if (invoice.paymentType.includes('IDEAL')) {
        transactionId = invoice.transaction_id;
    } else if (invoice.paymentType.includes('ALIPAY')) {
        transactionId = invoice.transaction_id;
    } else if (invoice.paymentType.includes('MAESTRO')) {
        transactionId = invoice.transaction_id;
    } else if (paymentData.payment_details.type === 'BANKTRANS') {
        transactionId = paymentData.payment_details.external_transaction_id;
    } else if (paymentData.payment_details.type === 'ALIPAY') {
        transactionId = paymentData.transaction_id;
        // transactionId = '';
    } else if (paymentData.payment_details.type === 'MAESTRO') {
        transactionId = paymentData.transaction_id;
    }
console.log('Transaction ID', transactionId);    
    doc
        .fontSize(10)
        .text(captionNumber, 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_nr, 150, customerInformationTop)
        .font("Helvetica")
        .text(captionDate, 50, customerInformationTop + 15)
        .text(invoice.invoice_date, 150, customerInformationTop + 15)
        .text(captionTotal, 50, customerInformationTop + 30)
        .text(
            formatCurrency(parseFloat((0)) + parseFloat(invoice.shipping_amount) + parseFloat(invoice.subtotal) - parseFloat(invoice.refund_amount)),
            150,
            customerInformationTop + 30
        )
        .font("Helvetica-Bold");

    // if (parseFloat(invoice.refund_amount) > 0) {
    //     console.log('REFUND SHIPPING', invoice.refund_amount)
    //     // doc.text(t["Shipping refund"], 50, customerInformationTop + 45)
    //     doc.text(formatCurrency(parseFloat(invoice.refund_amount)), 150, customerInformationTop + 45)
    //     doc.text(t["Shipping refund1"], 50, customerInformationTop + 55)
    //
    // }
    console.log('HERE WE ARE');
    console.log('PAYMENT TYPE FROM ORDER', invoice.paymentType);
    doc.text(invoice.shipping.name, 300, customerInformationTop)
        .font("Helvetica")
        .text(t["Delivery Address"]+deliveryAddress.join(','), 300, customerInformationTop + 15)
        .text(t["Transaction ID"]+transactionId, 300, customerInformationTop + 40)
        .text(t["Payment Method"]+invoice.paymentType, 300, customerInformationTop + 55)
        .moveDown();

    generateHr(doc, 282);
}

async function generateInvoiceTable(doc, invoice, locale, ivoiceType) {
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
    // console.log(invoice.items);
    if (invoice.items) {
        for (i = 0; i < invoice.items.length; i++) {
            const item = invoice.items[i];
            const position = invoiceTableTop + (i + 1) * 30;
            generateTableRow(
                doc,
                position,
                item.name+` ${t["color"]}: ${item.color_name} ${t['size']}: ${item.size_name}`,
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
        let refundToDatePosition = paidToDatePosition + 20;
        if (invoice.refund_amount) {

            generateTableRow(
                doc,
                refundToDatePosition,
                "",
                "",
                t["Shipping refund"],
                "",
                formatCurrency(invoice.refund_amount)
            );
        }
        // reacalculate vat
        let vatAmount = 0;
        let totalAmount = 0;
        // (parseInt(order.order_amount) + 10) - ((parseInt(order.order_amount) + 10)/1.2)
        totalAmount = parseFloat(invoice.subtotal) + parseFloat(invoice.shipping_amount);
        vatAmount = (parseFloat(invoice.subtotal) + parseFloat(invoice.shipping_amount)) / 1.2;

        const vatToDatePosition = invoice.refund_amount ? refundToDatePosition + 20 : paidToDatePosition + 30;
        generateTableRow(
            doc,
            vatToDatePosition,
            "",
            "",
            "VAT (20%)",
            "",
            formatCurrency(totalAmount - vatAmount)
        );


        const duePosition = vatToDatePosition + 25;
        doc.font("Helvetica-Bold");
        generateTableRow(
            doc,
            duePosition,
            "",
            "",
            t[ivoiceType !== 'refund' ? "Total Payment" : "Refund Payment"],
            "",
            formatCurrency(parseFloat((0)) + parseFloat(invoice.shipping_amount) + parseFloat(invoice.subtotal) - parseFloat(invoice.refund_amount))
        );
        doc.font("Helvetica");
    }
}

async function generateFooter(doc, locale) {
    // const { default: t } = await import(`../sender/order-${locale}.js`);
    doc
        .fontSize(10)
        .text(
            "",
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

    async getProductQty (productId, configId) {
        const client = await pool.connect();
        try {
            const productQuery = `SELECT pc.quantity FROM data.products p LEFT JOIN data.product_configurations pc ON pc.product_id = p.id 
                                    WHERE p.id = 15 AND pc.id = 260;`;
            const resQuery = await client.query(productQuery);
            const qty = (resQuery.rows[0].quantity);
            return {
                qty
            };

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Create orders):',
                    { message: e.message }
                );
            }
            // const items = null;
            const error = {
                code: 500,
                message: 'Error get list of product qty'
            };
            return {
                error
            };

        } finally {
            client.release();
        }
    }

    async removeItemWaitStatus(itemId) {
        const client = await pool.connect();
        try {
            await client.query(`UPDATE data.order_items SET status=null WHERE id='${itemId}'`);
            return { success: true }
            // const orderData = await client.query(`SELECT quantity FROM 
            //         data.product_configurations WHERE id='${configId}'`);
            //
            // if (orderData.rows.length > 0) {
            //     const newQty = parseInt(orderData.rows[0].quantity) - parseInt(qty);
            //     await client.query(`UPDATE data.product_configurations SET quantity='${newQty}'
            //         WHERE id='${configId}'`);
            //     return { success: true }
            // } else {
            //     return { success: true }
            // }

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Create orders):',
                    { message: e.message }
                );
            }
            // const items = null;
            const error = {
                code: 500,
                message: 'Error get list of product qty'
            };
            return {
                error
            };

        } finally {
            client.release();
        }
    }


    async updateConfigQty(configId, qty) {
        const client = await pool.connect();
        try {
            const orderData = await client.query(`SELECT quantity FROM 
                    data.product_configurations WHERE id='${configId}'`);

            if (orderData.rows.length > 0) {
                const newQty = parseInt(orderData.rows[0].quantity) - parseInt(qty);
                await client.query(`UPDATE data.product_configurations SET quantity='${newQty}'
                    WHERE id='${configId}'`);
                return { success: true }
            } else {
                return { success: true }
            }

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Create orders):',
                    { message: e.message }
                );
            }
            // const items = null;
            const error = {
                code: 500,
                message: 'Error get list of product qty'
            };
            return {
                error
            };

        } finally {
            client.release();
        }
    }

    async getConfigQty(configId) {
        const client = await pool.connect();
        try {
            const orderData = await client.query(`SELECT quantity FROM 
                    data.product_configurations WHERE id='${configId}'`);

            if (orderData.rows.length > 0) {
                return { success: true, qty: orderData.rows[0].quantity }
            } else {
                return { success: true, qty: 0 }
            }

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Create orders):',
                    { message: e.message }
                );
            }
            // const items = null;
            const error = {
                code: 500,
                message: 'Error get list of product qty'
            };
            return {
                error
            };

        } finally {
            client.release();
        }
    }


    async updateWaitWithOrderId(orderId) {
        const client = await pool.connect();
        try {
            console.log(`UPDATE data.orders SET 
                    status='new', statusWaiting=null WHERE id='${orderId}' `);
            const orderData = await client.query(`UPDATE data.orders SET 
                    status='new', statusWaiting=null WHERE id='${orderId}' `);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Create orders):',
                    { message: e.message }
                );
            }
            // const items = null;
            const error = {
                code: 500,
                message: 'Error get list of product qty'
            };
            return {
                error
            };

        } finally {
            client.release();
        }
    }

    async sendingMessageByWaiting(configId) {
        const client = await pool.connect();
        try {

            const waitingQuery = `SELECT data.order_items.message_id, order_id, data.order_items.quantity,
                        data.order_items.product_configuration_id, data.order_items.configuration,
                        data.live_sessions.store_id, data.live_sessions_messages.recipient_id, 
                        data.order_items.id AS wait_item_id, access_token, data.live_sessions_messages.message,
                        data.seller_settings.order_timer, data.seller_settings.free_shipping_timer, threshold,
                        data.user_stores.name as store_name, data.order_items.product_id
                    FROM data.order_items 
                    LEFT JOIN data.live_sessions ON data.live_sessions.id = data.order_items.live_sessions_id
                    LEFT JOIN data.user_stores ON data.user_stores.id = data.live_sessions.store_id
                    LEFT JOIN data.live_sessions_messages ON data.live_sessions_messages.message_id = data.order_items.message_id
                    LEFT JOIN data.seller_settings ON data.seller_settings.user_id = data.live_sessions.user_id
                    LEFT JOIN data.free_order_threshold foth ON foth.user_id = data.live_sessions.user_id
                    WHERE product_configuration_id=${configId} AND data.order_items.status='waiting'
                    ORDER BY data.order_items.created_at LIMIT 1`;

// console.log(waitingQuery);
            const waitingData = await client.query(waitingQuery);

            return { items: waitingData.rows.length > 0 ? waitingData.rows : [] }

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Create orders):',
                    { message: e.message }
                );
            }
            // const items = null;
            const error = {
                code: 500,
                message: 'Error get list of product qty'
            };
            return {
                error
            };

        } finally {
            client.release();
        }
    }

    async returnNotParsedConfigQty(qty, configId) {
        const client = await pool.connect();
        try {
            await client.query(`UPDATE data.product_configurations SET quantity=quantity+${qty} WEHRE id='${configId}'`);

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Return Not Parser Configured:',
                    { message: e.message }
                );
            }
            // const items = null;
            const error = {
                code: 500,
                message: 'Error get list of product qty'
            };
            return {
                error
            };

        } finally {
            client.release();
        }
    }

    async updateWaitingItemQty(itemId, qty, configId, orderId) {
        const client = await pool.connect();
        try {
// console.log('itemId', itemId);
// console.log('qty', qty);
// console.log('configId', configId);
// console.log('orderId', orderId);
            const dataOrderNumArr = (new Date().toISOString().slice(0,11).replace('T',' ')).split('-');
            const _tmpNumber = dataOrderNumArr[2]+dataOrderNumArr[1]+dataOrderNumArr[0];
            const queryNumber = `SELECT order_number FROM
                data.orders WHERE 
                    order_number LIKE '${_tmpNumber.replace(/ /g,'')}-%'
                    AND order_number NOT LIKE '%-WO-%'
                 ORDER BY created_at DESC LIMIT 1`;
            const orderNumData = await client.query(queryNumber);
            let _newOrderNumber;
            if (orderNumData.rows.length === 0) {
                _newOrderNumber = moment().format('YYYYMMDD')+'-1';
            } else {
                const _tNum = orderNumData.rows[0].order_number.split('-')
                _newOrderNumber = `${moment().format('YYYYMMDD')}-${parseInt(_tNum[1]) + 1}`;
            }
            // const laterstOrder = await client.query(`SELECT order_number FROM
            //     data.orders WHERE order_number LIKE '${dataOrderNumArr[2]+dataOrderNumArr[1]+dataOrderNumArr[0]}-%'
            //     LIMIT 1 ORDER BY created_at DESC`);
            const updtQueryItem = `UPDATE data.order_items SET status=null WHERE id=${itemId};`;
            await client.query(updtQueryItem);
            const waitItems = await client.query(`SELECT * FROM data.order_items WHERE id=${itemId}`);
            let totalAmount = 0;
            waitItems.rows.forEach(_item => {
                totalAmount += parseFloat(_item.price)*parseInt(_item.quantity);
            })
console.log('ZZZZ', 1);
            //update product config qty
            const updtConfigQuery = `UPDATE data.product_configurations SET quantity=quantity - ${qty} WHERE id=${configId};`;
            await client.query(updtConfigQuery);


            if (orderId) {
                const updtQueryOrder = `UPDATE data.orders SET 
                        status='new', status_waiting=null, order_number='${_newOrderNumber}',
                        order_amount='${totalAmount}', total_amoint='${totalAmount}' 
                        WHERE id=${orderId};`;
                console.log('ZZZZ', updtQueryOrder);
                await client.query(updtQueryOrder);
            }

            return { orderNuber: _newOrderNumber }
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


    async updateProductConfigQty(configId, qty, sessionId) {
        const client = await pool.connect();
        try {
            const updtQuery = `UPDATE data.product_configurations SET quantity=${qty} WHERE id=${configId};`;
            await client.query(updtQuery);
            // getting all wait with this configuration
            shell.exec(`pm2 start ../BE/storeJobs/jobStoreWaiting.js --name "jobStoreWaiting ${configId}" -- configId=${configId}`, function(code, output) {
                console.log('Exit code:', code);
                console.log('Program output:', output);
            });
            exit;
            // const waitingQuery = `SELECT data.order_items.message_id, data.live_sessions.store_id, data.live_sessions_messages.recipient_id,
            //         access_token
            //         FROM data.order_items
            //         LEFT JOIN data.live_sessions ON data.live_sessions.id = data.order_items.live_sessions_id
            //         LEFT JOIN data.user_stores ON data.user_stores.id = data.live_sessions.store_id
            //         LEFT JOIN data.live_sessions_messages ON data.live_sessions_messages.message_id = data.order_items.message_id
            //         WHERE product_configuration_id=${configId} AND data.order_items.status='waiting'`;
            // const waitingData = await client.query(waitingQuery);
            // console.log(waitingData.rows.length)
            // exit;
            // const updtQuery = `UPDATE data.product_configurations SET quantity=${qty} WHERE id=${configId};`;
            // await client.query(updtQuery);

            // shell.exec(`pm2 start jobStoreWaiting.js --name "jobStoreWaiting 46" -- sessionId=46 configId=290 accessToken=${session.auth_provider_access_token} providerId=${session.auth_provider_id}`, function(code, output) {
            //     console.log('Exit code:', code);
            //     console.log('Program output:', output);
            // });
            // exit;

            // run workflow for update waiting items
            // const waitingItemsQuery = `SELECT * FROM data.order_items WHERE product_configuration_id=${configId} AND status='waiting'`;
            // console.log(waitingItemsQuery);
            // exit;

            // const waitListQuery = `SELECT * FROM data.set_orders_from_waiting_list_by_product(${sessionId}, ${configId});`;
            // console.log(waitListQuery);
            // await client.query(waitListQuery);

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
                FROM data.get_orders_waiting_list_new(${perPage}, ${offset}, '${JSON.stringify(_filters)}', '${column} ${sort}');`;
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
            switch (user.role_id) {
                case UserRole.ADMIN:
                    break;
                case UserRole.CUSTOMER:
                    _filters.seller_id = [user.id];
                    if (_filters.shopper_id) {
                        _filters.buyer_id = _filters.shopper_id;
                        delete _filters.userIds;
                    }
                    break;
                case UserRole.BUYER:
                    _filters.buyer_id = [user.id];
            }
            // _filters.buyer_id = [1095];
            if (_filters.status?.length === 0) {
                if (user.role_id === UserRole.BUYER) {
                    _filters.status = [OrderStatus.PAYED, OrderStatus.SHIPPED, OrderStatus.CANCELED, OrderStatus.NEW, OrderStatus.WAITING];
                } else {
                    _filters.status = [OrderStatus.PAYED, OrderStatus.SHIPPED, OrderStatus.CANCELED];
                }
            }

            // _filters.buyer_id = _filters.shopper_id;
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
            // console.log(ordersQuery);
            const res = await client.query(ordersQuery);
            const items = res.rows.length > 0 ? res.rows : [];
            const _items = res.rows.length > 0 ? res.rows : [];
            const _orderIds = [];
            if (_items.length > 0) {
                // console.log(_items)
                const orderIds = [];
                _items.map(_order => {
                    _orderIds.push(_order.id);
                })
            }
            // const orderStatuses = `SELECT
            //         json_agg(
            //             (jsonb_build_object('status', order_statuses.status) || jsonb_build_object('created_at', order_statuses.created_at) || jsonb_build_object('order_id', order_statuses.order_id))::json
            //         ) AS order_statuses
            //     FROM data.order_statuses
            //     WHERE TRUE
            //         AND (order_statuses.order_id IN (${_orderIds.join(',')}))`;
            //
            let orderStatuses;
            let orderStatusesRes = [];
            if (_orderIds.length) {
                orderStatuses = `
                    SELECT
                        json_agg(
                            json_build_object(
                            'status', order_statuses.status,
                            'created_at', order_statuses.created_at,
                            'order_id', order_statuses.order_id
                            )
                        ) AS order_statuses
                    FROM data.order_statuses
                    WHERE TRUE
                        AND (order_statuses.order_id IN (${_orderIds.join(',')}))
                `;
                orderStatusesRes = await client.query(orderStatuses);
            }
//             console.log(orderStatuses);
//             const orderStatusesRes = await client.query(orderStatuses);
            const _itemStatuses = orderStatusesRes.rows[0].order_statuses;
            const _itemStatusesIds = [];
            const grouppedStatuses = [];
            if (orderStatusesRes.rows[0].order_statuses !== null) {
                orderStatusesRes.rows[0].order_statuses.map(status => {
                    _itemStatusesIds.push(status.order_id);
                });
                let unique = _itemStatusesIds.reduce(function (a, b)  {
                    if (a.indexOf(b) < 0) a.push(b);
                    return a;
                }, []);
                // console.log(_itemStatuses)
                // console.log('++++++++++++');
                // itemStatuses.
                unique.forEach(_id => {
                    // console.log(_itemStatuses.find(_item => _item.order_id === _id));
                    grouppedStatuses.push({id:_id, statuses:(_itemStatuses.filter(obj => {
                            return obj.order_id === _id
                        }))});
                });
            }
            const error = null;

            return {
                items,
                grouppedStatuses,
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

    async fetchFilters (user, type) {
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
            // console.log(`SELECT * FROM data.get_orders_countries('${JSON.stringify(_filters)}');`);
            res.countries = countries.rows[0].countries ? countries.rows[0].countries : [];
            const amounts = await client.query(`SELECT * FROM data.get_orders_total_amount_range('${JSON.stringify(_filters)}');`);
            res.amounts = amounts.rows[0].total_amount_range.max ? [amounts.rows[0].total_amount_range.min, amounts.rows[0].total_amount_range.max] : [];
            const error = null;
            const _filterBuyers = {};
            if (user.role_id === 2) {
                // sellerIds.push(user.id);
                _filterBuyers.seller_id = [user.id];
                if (_filterBuyers.userIds) {
                    _filterBuyers.seller_id = _filters.userIds;
                    delete _filterBuyers.userIds;
                }
            }
            let ordersQueryBuyers;
            // const buyersQuery = `SELECT * FROM data.get_buyers(10000, 0, '${JSON.stringify(_filterBuyers)}', '${column} ${sort}');`;
            if (type === 'waiting') {
                console.log(`SELECT * FROM data.get_buyers_waiting(100000, 0, '${JSON.stringify(_filterBuyers)}', 'first_name ASC');`);
                ordersQueryBuyers = await client.query(`SELECT * FROM data.get_buyers_waiting(100000, 0, '${JSON.stringify(_filterBuyers)}', 'first_name ASC');`); // 'orders.created_at DESC'
            } else {
                ordersQueryBuyers = await client.query(`SELECT * FROM data.get_buyers(100000, 0, '${JSON.stringify(_filterBuyers)}', 'first_name ASC');`); // 'orders.created_at DESC'
            }
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



    async generatePdf (orderNumber, userId, user, locale, type='download', typeInvoice='') {
        const client = await pool.connect();
console.log('LOCALE', locale)
        // const selectedLocale = !locale ? locale = 'fr' : locale;
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
console.log(ordersQuery);
            const res = await client.query(ordersQuery);
            const orderId = res.rows[0].id;
            let historyRes;
            if (res.rows[0].status === 'canceled') {
                historyRes  = await client.query(`SELECT * FROM data.order_statuses WHERE order_id='${orderId}' AND status='canceled'`);
            } else {
                historyRes  = await client.query(`SELECT * FROM data.order_statuses WHERE order_id='${orderId}' AND status='payed'`);
            }
            if (!historyRes.rows[0]) {
                await client.query(`INSERT INTO data.order_statuses (order_id, status) VALUES ('${orderId}', 'payed')`);
                historyRes  = await client.query(`SELECT * FROM data.order_statuses WHERE order_id='${orderId}' AND status='payed'`);
            }
            const dirUpload = `${process.env.DOWNLOAD_FOLDER}/orders/${userId}`;
            const dirArchiveFolder = `${process.env.DOWNLOAD_FOLDER}/users/${userId}/orders/invoices`;
            if (type === 'download' && !fs.existsSync(dirArchiveFolder)) {
                if (!fs.existsSync(`${process.env.DOWNLOAD_FOLDER}/users/${userId}`)) {
                    fs.mkdirSync(`${process.env.DOWNLOAD_FOLDER}/users/${userId}`);
                }
                if (!fs.existsSync(`${process.env.DOWNLOAD_FOLDER}/users/${userId}/orders`)) {
                    fs.mkdirSync(`${process.env.DOWNLOAD_FOLDER}/users/${userId}/orders`);
                }
                if (!fs.existsSync(`${process.env.DOWNLOAD_FOLDER}/users/${userId}/orders/invoices`)) {
                    fs.mkdirSync(`${process.env.DOWNLOAD_FOLDER}/users/${userId}/orders/invoices`);
                }
            }

            // console.log(`${process.env.DOWNLOAD_FOLDER}/orders/${userId}/${type === 'download' ? 'invoices/' : ''}${typeInvoice !== 'refund' ? 'invoice' : 'refund'}_${res.rows[0].order_number}_${locale}.pdf`);
            if (fs.existsSync(`${process.env.DOWNLOAD_FOLDER}/orders/${userId}/${type === 'download' ? 'invoices/' : ''}${typeInvoice !== 'refund' ? 'invoice' : 'refund'}_${res.rows[0].order_number}_${locale}.pdf`)) {
                const base64 = await pdf2base64(`${process.env.DOWNLOAD_FOLDER}/orders/${userId}/${type === 'download' ? 'invoices/' : ''}${typeInvoice !== 'refund' ? 'invoice' : 'refund'}_${res.rows[0].order_number}_${locale}.pdf`)
                    .then(
                        (response) => {
                            return response;
                        }
                    )
                    .catch(
                        (error) => {
                            console.log(error.message); //Exepection error....
                        }
                    );
                return {
                    filename: `${process.env.DB_DOWNLOAD_FOLDER}/orders/${userId}/${typeInvoice !== 'refund' ? 'invoice' : 'refund'}_${res.rows[0].order_number}_${locale}.pdf`,
                    fileEncoded: base64,
                    error: null
                }
            } else {
                if (!fs.existsSync(dirUpload)) {
                    fs.mkdirSync(dirUpload);
                }
            }
            if (res.rows.length > 0) {
                // get buyer information
                const addressRes = await client.query(`SELECT data.addresses.*, data.users.company_name, data.users.phone
                                                       FROM data.addresses LEFT JOIN data.users ON data.users.id=data.addresses.user_id
                                                       WHERE user_id=${res.rows[0].buyer_id}`);
                const buyerData = await client.query(`SELECT * FROM data.users WHERE id='${res.rows[0].buyer_id}'`);

                const sellerData = await client.query(`SELECT * FROM data.users WHERE id='${res.rows[0].seller_id}'`);

                // console.log(`SELECT * FROM data.order_statuses WHERE order_id='${res.rows[0].id}' AND status='${typeInvoice !== 'refund' ? 'payed' : 'canceled'}'`);
                const historyStatusRes = await client.query(`SELECT * FROM data.order_statuses WHERE order_id='${res.rows[0].id}' AND status='${typeInvoice !== 'refund' ? 'payed' : 'canceled'}'`);
                const orderNuberForMultisafe = `${process.env.MULTISAFE_ORDER_PREFIX}-${res.rows[0].id}`;
                const multiOrderPaymentData = await axios
                    .get(`${process.env.MULTISAFEPAY_URL}/orders/${process.env.MULTISAFE_ORDER_PREFIX}-${res.rows[0].id}?api_key=${process.env.MULTISAFE_API_KEY}`, {}, {
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .then(async (res) => {
                        // console.log('PAYMENT METHODS', res.data.data);
                        return {'success': true, paymentData: res.data.data}
                    }).catch(error => {
                        return {error: error.message}
                    });
console.log('MS', multiOrderPaymentData);
                const refundAmount = parseFloat(res.rows[0].refund_amount);
                const coutryRes = await client.query(`SELECT nicename FROM data.countries WHERE id='${res.rows[0].country_id}'`);
                // console.log(buyerData.rows[0].first_name + (buyerData.rows[0].last_name ? " "+buyerData.rows[0].last_name : ''));
                const invoice = {
                    shipping: {
                        name: buyerData.rows[0].first_name + " " +(buyerData.rows[0].last_name ? buyerData.rows[0].last_name : ''),
                        address: res.rows[0].shipping_address,
                        state: res.rows[0].state,
                        city: res.rows[0].city,
                        post_code: res.rows[0].post_code,
                        phone: res.rows[0].phone,
                        country: coutryRes.rows[0].nicename
                    },
                    seller: {
                        data: sellerData.rows[0]
                    },
                    status: res.rows[0].status,
                    items: res.rows[0].order_items,
                    subtotal: res.rows[0].order_amount,
                    refund_amount: refundAmount,
                    shipping_amount: res.rows[0].shipping_amount,
                    paid: res.rows[0].total_amount,
                    invoice_nr: res.rows[0].order_number+(typeInvoice !== 'refund' ? '' : `-${res.rows[0].refund_prefix}`),
                    invoice_date: moment(historyRes.rows[0].created_at).format('DD/MM/YYYY'),
                    paymentDetails: multiOrderPaymentData,
                    transaction_id: multiOrderPaymentData.paymentData.payment_methods[0].external_transaction_id,
                    paymentType: multiOrderPaymentData.paymentData.payment_methods[0].type,
                    orderId: orderId
                    // paymentDetails: {}
                };
                await createInvoice(invoice, `${dirUpload}/${typeInvoice !== 'refund' ? 'invoice' : 'refund'}_${res.rows[0].order_number}_${locale}.pdf`, locale, typeInvoice !== 'refund' ? 'invoice' : 'refund');

                // await setTimeout(3000);
                if (!fs.existsSync(`${process.env.DOWNLOAD_FOLDER}/orders/${userId}/${typeInvoice !== 'refund' ? 'invoice' : 'refund'}_${res.rows[0].order_number}.pdf`)) {
                    await setTimeout(2000);
                }
                const base64 = await pdf2base64(`${process.env.DOWNLOAD_FOLDER}/orders/${userId}/${typeInvoice !== 'refund' ? 'invoice' : 'refund'}_${res.rows[0].order_number}_${locale}.pdf`)
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
                    filename: `${process.env.DB_DOWNLOAD_FOLDER}/orders/${userId}/${typeInvoice !== 'refund' ? 'invoice' : 'refund'}_${res.rows[0].order_number}_${locale}.pdf`,
                    fileEncoded: base64,
                    isCreated: true,
                    error: null
                }
            }
        } catch (e) {
            console.log(e.message)
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Generate PDF):',
                    { message: e.message }
                );
            }
            error = {
                code: 500,
                message: 'Model error (Generate PDF):'
            };
            return  {
                fileName: '',
                error
            }
        } finally {
            client.release();
        }
    }


    async updateOrderByCommentId (commentId, userId) {
        const client = await pool.connect();
        try {
            const SQL = `SELECT * FROM data.order_items WHERE message_id='${commentId}';`;
            const res = await client.query(SQL);
            if (res.rows[0]) {
                const orderId = res.rows[0].order_id;
                await client.query(`UPDATE data.orders SET user_id=${userId} WHERE id=${orderId}`);
            }
            return {success: true, error: null, data: res.rows[0]};
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


    async checkOrderStatus (messageId) {
        const client = await pool.connect();
        try {
            const SQL = `SELECT * FROM data.order_items WHERE message_id = '${messageId}';`;
            const res = await client.query(SQL);
            return {success: true, error: null, data: res.rows[0]};
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

    async setupShippingStatus (orderIds) {
        const client = await pool.connect();
        try {
            // send email about shipping
            const emailSql = `
                SELECT data.users.*, data.user_stores.name AS store_name, 
                    data.orders.order_number, data.users.selected_locale,
                    data.users.email, data.users.email_real
                FROM data.orders 
                    LEFT JOIN data.users ON data.users.id=data.orders.user_id 
                    LEFT JOIN data.live_sessions ON data.live_sessions.id = data.orders.live_sessions_id
                    LEFT JOIN data.user_stores ON data.user_stores.id = data.live_sessions.store_id                   
                    WHERE data.orders.id IN (${orderIds.join(',')})`;
            const emailRes = await client.query(emailSql);
            let mail = '';
            let mailSendAddress = '';

            await emailRes.rows.forEach(async _order => {
                mail = await confirmShippedEmail(_order.email, _order.selected_locale ? _order.selected_locale : 'fr', _order);
                mailSendAddress = _order.email
                if (!_order.email.match(
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )) {
                    mailSendAddress = _order.email_real;
                };

                sendMail(
                    mailSendAddress,
                    mail.subject,
                    mail.body
                );
            })
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


    async removeOrderItem (orderItemId) {
        const client = await pool.connect();
        try {
            const itemRow = await client.query(`SELECT * FROM data.order_items WHERE id='${orderItemId}'`);
            const itemConfigurationId = itemRow.rows[0].product_configuration_id;

            // start waiting when remove item from cart
            shell.exec(`pm2 start ../BE/storeJobs/jobStoreWaiting.js --name "jobStoreWaiting ${itemConfigurationId}" -- configId=${itemConfigurationId}`, function(code, output) {
                console.log('Exit code:', code);
                console.log('Program output:', output);
            });

            // console.log(`UPDATE data.orders SET
            //     order_amount=order_amount - ${itemRow.rows[0].price*itemRow.rows[0].quantity},
            //     total_amount=total_amount - ${itemRow.rows[0].price*itemRow.rows[0].quantity}
            //     WHERE id=${itemRow.rows[0].order_id}`);
            await client.query(`UPDATE data.orders SET 
                order_amount=order_amount - ${itemRow.rows[0].price*itemRow.rows[0].quantity},
                total_amount=total_amount - ${itemRow.rows[0].price*itemRow.rows[0].quantity}
                WHERE id=${itemRow.rows[0].order_id}`);
            await client.query(`DELETE FROM data.order_items WHERE id='${orderItemId}'`);
            // return quantity to product
            await client.query(`UPDATE data.product_configurations SET quantity = quantity + ${itemRow.rows[0].quantity}
                WHERE id='${itemRow.rows[0].product_configuration_id}'`);
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


    async minusOrderItem (orderItemId) {
        const client = await pool.connect();
        try {
            const itemRow = await client.query(`SELECT * FROM data.order_items WHERE id='${orderItemId}'`);
            console.log(itemRow.rows[0]);
            console.log(`UPDATE data.orders SET
                order_amount=order_amount - ${itemRow.rows[0].price*1},
                total_amount=total_amount - ${itemRow.rows[0].price*1}
                WHERE id=${itemRow.rows[0].order_id}`);
            await client.query(`UPDATE data.orders SET
                order_amount=order_amount - ${itemRow.rows[0].price*1},
                total_amount=total_amount - ${itemRow.rows[0].price*1}
                WHERE id=${itemRow.rows[0].order_id}`);
            // console.log(`UPDATE data.order_items SET quantity = quantity - 1 WHERE id='${orderItemId}'`);
            await client.query(`UPDATE data.order_items SET quantity = quantity - 1 WHERE id='${orderItemId}'`);
            // return quantity to product
            // console.log(`UPDATE data.product_configurations SET quantity = quantity + 1
            //     WHERE id='${itemRow.rows[0].product_configuration_id}'`);
            await client.query(`UPDATE data.product_configurations SET quantity = quantity + 1
                WHERE id='${itemRow.rows[0].product_configuration_id}'`);

            shell.exec(`pm2 start ../BE/storeJobs/jobStoreWaiting.js --name "jobStoreWaiting ${itemRow.rows[0].product_configuration_id}" -- configId=${itemRow.rows[0].product_configuration_id}`, function(code, output) {
                console.log('Exit code:', code);
                console.log('Program output:', output);
            });

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

    async connectThrowStore(messageId, fromId, storeId) {
        const client = await pool.connect();
        try {
            // find order by message and attach to current user
            const connetedQuery = `SELECT * FROM data.user2pages WHERE from_id='${fromId}' AND store_id=${storeId}`
            const connetedQueryRes = await client.query(connetedQuery);
            if (connetedQueryRes.rows.length > 0) {
                const userId = connetedQueryRes.rows[0].user_id;
                // find order by message
                const queryOrder = `SELECT data.orders.id FROM data.order_items LEFT JOIN 
                    data.orders ON data.orders.id = data.order_items.order_id 
                    WHERE message_id='${messageId}'`;
                const findedOrderRes = await client.query(queryOrder);
                console.log('Finded Order Info', findedOrderRes.rows[0]);
                console.log('Update Orders');
                console.log(`UPDATE data.orders SET user_id='${userId}' WHERE id='${findedOrderRes.rows[0].id}'`)

                await client.query(`UPDATE data.orders SET user_id='${userId}' WHERE id='${findedOrderRes.rows[0].id}'`)
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
            return {success: false, error: e.message };
        } finally {
            client.release();
        }
    }

    async findWaitByCommentId (commentId, userId) {
        const client = await pool.connect();
        try {
            let orderNumber;let orderId;let waitItemId;
            const SQL = `SELECT data.orders.id as order_wait_id, order_number, data.order_items.status, data.orders.id AS orderId,
                        data.orders.live_sessions_id, order_amount, total_amount, quantity, data.order_items.user_id, 
                                data.order_items.id as item_id
                                FROM data.order_items 
                                LEFT JOIN data.orders ON data.orders.user_id = data.order_items.user_id
                                WHERE message_id='${commentId}' AND order_number IS NOT null ORDER BY order_id`;
            console.log(SQL);
            const res = await client.query(SQL);
            orderNumber = res.rows[0].order_number;
            orderId = res.rows[0].order_wait_id;
            waitItemId = res.rows[0].item_id;
            // get order items
            console.log(`SELECT price, quantity FROM data.order_items WHERE user_id='${res.rows[0].user_id}'`);
            const waitItems = await client.query(`SELECT price, quantity FROM data.order_items WHERE user_id='${res.rows[0].user_id}'`);
            let totalWaitAmount = parseFloat(waitItems.rows[0].price)*parseInt(waitItems.rows[0].quantity);
            const updateAmountSQL = `UPDATE data.orders 
                    SET order_amount = ${totalWaitAmount},
                    total_amount = ${totalWaitAmount},
                    user_id='${userId}'
                    WHERE id='${orderId}'`;
            console.log(updateAmountSQL);
            await client.query(updateAmountSQL);
            console.log(`UPDATE data.order_items SET order_id=${orderId} WHERE id=${waitItemId}`);
            await client.query(`UPDATE data.order_items SET order_id=${orderId} WHERE id=${waitItemId}`);

            return {success: true, orderId: orderId, orderNumber: orderNumber };
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

    async findWaitById (itemOrderId, userId) {
        const client = await pool.connect();
        try {
            let orderNumber;let orderId;let waitItemId;
            const SQL = `SELECT data.orders.id as order_wait_id, order_number, data.order_items.status, data.orders.id AS orderId,
                        data.orders.live_sessions_id, order_amount, total_amount, quantity, data.order_items.user_id, 
                                data.order_items.id as item_id
                                FROM data.order_items 
                                LEFT JOIN data.orders ON data.orders.user_id = data.order_items.user_id
                                WHERE data.orders.id=${itemOrderId}`;
            console.log(SQL);
            const res = await client.query(SQL);
            orderNumber = res.rows[0].order_number;
            orderId = res.rows[0].order_wait_id;
            waitItemId = res.rows[0].item_id;
            // get order items
            // console.log(`SELECT price, quantity FROM data.order_items WHERE user_id='${res.rows[0].user_id}'`);
            // const waitItems = await client.query(`SELECT price, quantity FROM data.order_items WHERE user_id='${res.rows[0].user_id}'`);
            // let totalWaitAmount = parseFloat(waitItems.rows[0].price)*parseInt(waitItems.rows[0].quantity);
            // const updateAmountSQL = `UPDATE data.orders
            //         SET order_amount = ${totalWaitAmount},
            //         total_amount = ${totalWaitAmount},
            //         user_id='${userId}'
            //         WHERE id='${orderId}'`;
            // console.log(updateAmountSQL);
            // await client.query(updateAmountSQL);
            // console.log(`UPDATE data.order_items SET order_id=${orderId} WHERE id=${waitItemId}`);
            // await client.query(`UPDATE data.order_items SET order_id=${orderId} WHERE id=${waitItemId}`);

            return {success: true, orderId: orderId, orderNumber: orderNumber };
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

    async expireOrder(orderId, userId) {
        const client = await pool.connect();
        try {
            console.log('EXPIRE ORDER');

            const order = await client.query(`SELECT * FROM data.orders WHERE id='${orderId}' AND user_id='${userId}' AND status !='expired'`);
            if (order.rows.length > 0) {
                await client.query(`UPDATE data.orders SET total_amount = 0, order_amount=0, expire_order_at=now(), status='expired' WHERE id=${order.rows[0].id}`)
                const sessionId = order.rows[0].live_sessions_id;
                const orderItems = await client.query(`SELECT * FROM data.order_items WHERE order_id='${order.rows[0].id}'`);
                if (orderItems.rows.length > 0) {
                    orderItems.rows.forEach(async _item => {
                        // put qty back to product
                        console.log(`UPDATE data.product_configurations SET quantity=quantity+${parseInt(_item.quantity)} WHERE id=${_item.product_configuration_id}`);
                        // await client.query(`UPDATE data.product_configurations SET quantity=1 WHERE id=${_item.product_configuration_id}`);
                        await client.query(`UPDATE data.product_configurations SET quantity=quantity+${parseInt(_item.quantity)} WHERE id=${_item.product_configuration_id}`);
                        // remove item
                        await client.query(`DELETE FROM data.order_items WHERE id='${_item.id}'`);

                        // start wait job
                        shell.exec(`pm2 start ../BE/storeJobs/jobStoreWaiting.js --name "jobStoreWaiting ${_item.product_configuration_id}" -- configId=${_item.product_configuration_id}`, function(code, output) {
                            console.log('Exit code:', code);
                            console.log('Program output:', output);
                        });
                    });
                }
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

    async findByCommentId (commentId, userId) {
        const client = await pool.connect();
        try {
            let orderNumber;let orderId;let copyOrderData;let storeName;let sessionId;
            const SQL = `SELECT order_id, order_number, data.order_items.status, data.orders.id AS orderId, data.order_items.user_id AS tmp_user_id,
                        data.orders.live_sessions_id, order_amount, total_amount, 
                        quantity, data.order_items.user_id AS tmp_user, data.user_stores.name AS store_name
                                FROM data.order_items 
                                LEFT JOIN data.orders ON data.orders.id = data.order_items.order_id
                                LEFT JOIN data.live_sessions ON data.live_sessions.id = data.orders.live_sessions_id
                                LEFT JOIN data.user_stores ON data.user_stores.id = data.live_sessions.store_id
                                WHERE message_id='${commentId}' ORDER BY order_id`;
            const res = await client.query(SQL);
            orderNumber = res.rows[0].order_number;
            storeName = res.rows[0].store_name;
            sessionId = res.rows[0].live_sessions_id;
            const tmpUserId = res.rows[0].tmp_user_id;
console.log('Order Number', orderNumber);
            if (!orderNumber) {
                const SQLWait = `SELECT *
                                FROM data.order_items 
                                WHERE message_id='${commentId}' ORDER BY order_id`;
                const resWait = await client.query(SQLWait);
                let updateTotal = 0;
console.log('Wait order ID', resWait.rows[0].order_id);
console.log('Order ID', resWait.rows[0].order_id);
                if (!resWait.rows[0].order_id) {
console.log(`SELECT * FROM data.orders WHERE status='new' AND user_id='${userId}' AND total_amount > 0 ORDER BY created_at DESC`);
                    const existNonPayed = await client.query(`SELECT * FROM data.orders WHERE status='new' AND user_id='${userId}' AND total_amount > 0 ORDER BY created_at DESC`);
                    if (existNonPayed.rows.length > 0) {
                        orderId = existNonPayed.rows[0].id;
                        orderNumber = existNonPayed.rows[0].order_number;
                    } else {
                        const existNonPayedEmpty = await client.query(`SELECT * FROM data.orders WHERE status='new' AND user_id='${userId}' ORDER BY created_at DESC`);
                        if (existNonPayedEmpty.rows.length > 0) {
                            orderId = existNonPayedEmpty.rows[0].id;
                            orderNumber = existNonPayedEmpty.rows[0].order_number;
                        } else {
                            const emptyWaitRes = await client.query(`SELECT id, order_number, live_sessions_id FROM data.orders WHERE user_id='${tmpUserId}'`);
                            orderId = emptyWaitRes.rows[0].id;
                            orderNumber = emptyWaitRes.rows[0].live_sessions_id+'-'+emptyWaitRes.rows[0].order_number;
                            const updtQuery = `UPDATE data.orders 
                                SET user_id=${userId}, 
                                total_amount=${resWait.rows[0].quantity*resWait.rows[0].price}, 
                                order_amount=${resWait.rows[0].quantity*resWait.rows[0].price},
                                order_number='${orderNumber}',
                                sync_at='${moment().utcOffset(0, true).format('YYYY-MM-DD HH:mm:ss')}' 
                                WHERE id=${emptyWaitRes.rows[0].id}`;
                            await client.query(updtQuery);

                            await client.query(`UPDATE data.order_items SET order_id=${emptyWaitRes.rows[0].id} WHERE user_id=${tmpUserId}`)
                        }
                    }
                    if (resWait.rows.length > 0) {
                        for (const _item of resWait.rows) {
                            if (!_item.order_id) {
                                updateTotal += _item.price*_item.quantity;
                                await client.query(`UPDATE data.order_items SET order_id = ${orderId} WHERE message_id='${commentId}'`);
                            }
                        }
                    }
                }
                // return {success: true, orderId: orderId, orderNumber: orderNumber };
                return {success: true, orderId: orderId, orderNumber: orderNumber, storeName: storeName };

            } else {
                const _tmpOrderNumber = res.rows[0].order_number.split('-');
                const prefixWait = Math.floor(Date.now()/1000);
                copyOrderData = res.rows[0];
                // copyOrderData.order_number = `${_tmpOrderNumber[0]}-WO-${_tmpOrderNumber[1]}`;
                copyOrderData.order_number = `${res.rows[0].order_number}-WO-${prefixWait}`;
                orderId = res.rows[0].orderId;
                const existNonPayedOrder = await client.query(
                    `SELECT data.orders.id, data.orders.order_number, data.orders.live_sessions_id FROM data.orders 
                                     LEFT JOIN data.live_sessions ON data.live_sessions.id = data.orders.live_sessions_id
                                        LEFT JOIN data.user_stores ON data.user_stores.id = data.live_sessions.store_id   
                                        WHERE data.orders.user_id='${userId}'
                                        AND data.orders.status='new' AND data.orders.id != '${res.rows[0].order_id}'
                                        AND live_sessions_id='${res.rows[0].live_sessions_id}' AND status_waiting IS NULL`);
                if (existNonPayedOrder.rows[0]?.id) {
console.log('Non payed order', existNonPayedOrder.rows[0]?.id);
                    orderNumber = existNonPayedOrder.rows[0].order_number;
                    orderId = existNonPayedOrder.rows[0].id;
                    // before add new items check if this item already aexist in order, if yes only change quantity
                    const updateExistItemsSQL = `UPDATE data.order_items SET 
                        order_id='${existNonPayedOrder.rows[0].id}' WHERE message_id='${commentId}' AND status IS NULL `;
                    await client.query(updateExistItemsSQL);
                    // update amounts for order splited order
                    const updateAmountSQL = `UPDATE data.orders 
                        SET order_amount = order_amount + ${res.rows[0].order_amount},
                        total_amount = total_amount +  ${res.rows[0].total_amount},
                        sync_at=now()
                        WHERE id='${existNonPayedOrder.rows[0].id}'`;
                    await client.query(updateAmountSQL);

                    // delete unused order
                    await client.query(`DELETE FROM data.orders  WHERE id='${res.rows[0].order_id}'`);

                    // combined same rows in order_items
                    const combinedSQL = await client.query(`
                        SELECT product_configuration_id, SUM(quantity) AS resultsQty
                        FROM data.order_items
                        WHERE order_id=${existNonPayedOrder.rows[0]?.id}
                        GROUP BY product_configuration_id`);
                    const realOrderItems = await client.query(`SELECT id 
                    FROM data.order_items WHERE order_id=${existNonPayedOrder.rows[0]?.id}`);
                    // need to combine two rows into one
                    if (combinedSQL.rows.length < realOrderItems.rows.length) {
                        const combinedData = [];
                        combinedSQL.rows.forEach(_item => {
                            combinedData.push({config_id: _item.product_configuration_id, qty: _item.resultsqty})
                        })
                        const _dataResCombine = await client.query(`SELECT product_configuration_id, 
                        SUM(quantity) AS resultsQty, array_agg(id) as products
                        FROM data.order_items
                        WHERE order_id=${existNonPayedOrder.rows[0]?.id}
                        GROUP BY product_configuration_id;`)
                        _dataResCombine.rows.forEach(_row => {
                            if (_row.products.length > 1) {
                                _row.products.forEach(async (_itemId, _key) => {
                                    console.log(_key)
                                    if (_key > 0) {
                                        await client.query(`DELETE FROM data.order_items WHERE id='${_itemId}'`);
                                    }
                                })
                            }
                        });
                        // update quantity for order items row
                        combinedData.forEach(async (_item) => {
                            await client.query(`UPDATE data.order_items SET quantity='${_item.qty}' 
                        WHERE product_configuration_id='${_item.config_id}'`)
                        });
                    }
                } else {
                    let nOrderNumber = sessionId+'-'+res.rows[0].order_number;
                    orderId = res.rows[0].order_id;
                    const orderSQL = `UPDATE data.orders SET user_id='${userId}', sync_at=now(),
                        total_amount=order_amount WHERE id='${res.rows[0].order_id}'`;
                    await client.query(orderSQL);

                    const fromQuery = `SELECT data.order_items.message_id, 
                        data.live_sessions_messages.from_id, data.live_sessions.store_id,
                        data.live_sessions_messages.real_from_id  
                        FROM data.order_items
                        LEFT JOIN data.live_sessions_messages ON 
                            data.live_sessions_messages.message_id = data.order_items.message_id
                        LEFT JOIN data.live_sessions ON data.live_sessions.id = data.live_sessions_messages.live_sessions_id
                        WHERE order_id='${res.rows[0].order_id}'
                        LIMIT 1`;
                    const fromQueryRes = await client.query(fromQuery);
                    const connQeryUserStoreQuery = `SELECT * FROM data.user2pages WHERE 
                        from_id='${fromQueryRes.rows[0].from_id}' AND user_id='${userId}' AND 
                        store_id='${fromQueryRes.rows[0].store_id}'`;
                    const connQeryUserStoreQueryRes = await client.query(connQeryUserStoreQuery);
                    if (connQeryUserStoreQueryRes.rows.length === 0) {
                        if (fromQueryRes.rows[0].real_from_id) {
                            const insertQueryConnect =
                                `INSERT INTO data.user2pages (from_id, user_id, store_id) VALUES 
                            ('${fromQueryRes.rows[0].from_id}', '${userId}', '${fromQueryRes.rows[0].store_id}')
                            `;

                            await client.query(insertQueryConnect)
                        }
                    }
                    const oData = await client.query(`SELECT order_number FROM data.orders WHERE id='${res.rows[0].order_id}'`);
                    const combineOrderNumber = sessionId+'-'+oData.rows[0].order_number.replace(sessionId+'-', '');
                    await client.query(`UPDATE data.orders SET order_number='${combineOrderNumber}' WHERE id='${res.rows[0].order_id}'`);
                    orderNumber = combineOrderNumber;
                }
                console.log('ORDER NUMBER', orderNumber);

                // find waiting products in order
                const waitingItems = await client.query(`SELECT * FROM data.order_items WHERE
                message_id='${commentId}' AND status='waiting'`);

                // create separate order for each wait item
                waitingItems.rows.forEach(async (_item, key) => {
                    const insertOrder = await client.query(`INSERT INTO data.orders
                    (user_id, live_sessions_id, order_amount, total_amount, order_number, status, status_waiting)
                    VALUES ('${userId}', '${copyOrderData.live_sessions_id}', ${_item.price},
                     ${_item.price}, '${copyOrderData.order_number}', 'waiting', true) RETURNING id;`);

                    // console.log("ITEM CONFIG", _item.configuration);
                    await client.query(`INSERT INTO data.order_items (order_id, message_id, product_id,
                                    product_configuration_id, color_id, size_id, price, quantity, status,
                                    configuration, user_id, live_sessions_id) VALUES (
                                    ${insertOrder.rows[0].id}, '${_item.message_id}',
                                    '${_item.product_id}', '${_item.product_configuration_id}',
                                    '${_item.color_id}', '${_item.size_id}',
                                    ${_item.price}, ${_item.quantity}, 'waiting',
                                    '${JSON.stringify(_item.configuration)}', ${userId}, ${_item.live_sessions_id}

                )`);
                    await client.query(`DELETE FROM data.order_items WHERE id=${_item.id}`);
                })

                await client.query(`UPDATE data.orders SET waiting_products='${JSON.stringify(waitingItems.rows)}' WHERE id=${orderId}`)

                console.log("=============");
                console.log("RETURNED DATA");
                console.log({success: true, orderId: orderId, orderNumber: orderNumber, storeName: storeName })
                console.log("=============");
                return {success: true, orderId: orderId, orderNumber: orderNumber, storeName: storeName };
            }
            // console.log(orderNumber);
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


    async insertOrderStatus (orderId, status, locale) {
        const client = await pool.connect();
        try {
console.log('here')
            // console.log(`INSERT INTO data.order_statuses (order_id, status) VALUES ('${orderId}', '${status}')`);
            const _tmpRes = await client.query(`SELECT * FROM data.order_statuses WHERE order_id='${orderId}' AND status='${status}'`);
            if (_tmpRes.rows.length === 0) {
                const SQL = await client.query(`INSERT INTO data.order_statuses (order_id, status) VALUES ('${orderId}', '${status}')`);
            }
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

    async removeUnpayedSessionsOrders () {
        const client = await pool.connect();
        try {
            const expireDateNotSync = moment().add(-process.env.ORDER_REMOVE_DAYS, 'days').add(3, 'hours').format('YYYY-MM-DD HH:mm:ss');
            const ordersNotSyncQuery = `SELECT * FROM data.orders WHERE status='new'
                AND created_at <= '${expireDateNotSync}' AND sync_at IS NULL`;
            const ordersSyncQuery = `SELECT * FROM data.orders WHERE status='new'
                AND sync_at <= '${expireDateNotSync}'`;
            const notSyncRes = await client.query(ordersNotSyncQuery);
            const syncRes = await client.query(ordersSyncQuery);
            if (notSyncRes.rows.length > 0) {
                // store products back and set status expired
                notSyncRes.rows.forEach(async _order => {
                    const notSyncItems = await client.query(`SELECT * FROM data.order_items WHERE order_id=${_order.id}`);
                    if (notSyncItems.rows.length > 0) {
                        notSyncItems.rows.forEach(async _item => {
                            // console.log(_item.product_configuration_id, _item.quantity);
                            await client.query(`UPDATE data.product_configurations 
                                SET quantity = quantity + ${parseInt(_item.quantity)} WHERE id='${_item.product_configuration_id}'`);
                            await client.query(`DELETE FROM data.order_items WHERE id='${_item.id}'`);
                        });
                    }
                    await client.query(`UPDATE data.orders SET status='expired' WHERE id=${_order.id}`)
                })
            }
            if (syncRes.rows.length > 0) {
                // store products back and set status expired
                syncRes.rows.forEach(async _order => {
                    const notSyncItems = await client.query(`SELECT * FROM data.order_items WHERE order_id=${_order.id}`);
                    if (notSyncItems.rows.length > 0) {
                        notSyncItems.rows.forEach(async _item => {
                            // console.log(_item.product_configuration_id, _item.quantity);
                            await client.query(`UPDATE data.product_configurations 
                                SET quantity = quantity + ${parseInt(_item.quantity)} WHERE id='${_item.product_configuration_id}'`);
                            await client.query(`DELETE FROM data.order_items WHERE id='${_item.id}'`);
                        });
                    }
                    await client.query(`UPDATE data.orders SET status='expired' WHERE id=${_order.id}`)
                })
            }
            return {success: true};
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

    async removeUnpayedSessionOrder (sessionId) {
        const client = await pool.connect();
        try {
            const _tmpRes = await client.query(`SELECT * FROM data.orders WHERE live_sessions_id='${sessionId}' AND status='new' AND total_amount > 0 LIMIT 20`);
            if (_tmpRes.rows.length > 0) {
                _tmpRes.rows.forEach(async _order => {
                    const tmpResItems = await client.query(`SELECT * FROM data.order_items WHERE order_id='${_order.id}'`);
                    if (tmpResItems.rows.length > 0) {
                        tmpResItems.rows.forEach(async _item => {
                            // return quntity for configuration
                            await client.query(`UPDATE data.product_configurations SET quantity=quantity+${parseInt(_item.quantity)} WHERE id=${_item.product_configuration_id}`)
                            await client.query(`DELETE FROM data.order_items WHERE id=${_item.id}`);

                            shell.exec(`pm2 start ../BE/storeJobs/jobStoreWaiting.js --name "jobStoreWaiting ${_item.product_configuration_id}" -- configId=${_item.product_configuration_id}`, function(code, output) {
                                console.log('Exit code:', code);
                                console.log('Program output:', output);
                            });
                        })
                    }
                    await client.query(`DELETE FROM data.orders WHERE id=${_order.id}`)
                })
            }

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

    async bulkDownload(ids, user, locale) {
        console.log('LOCALE', locale);
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
            console.log(e.message)
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

    async isFreeShipping(userId, orderNumber) {
        const client = await pool.connect();
        try {
            let sellerData;
            let settingsThreshold;
            let settings;
            const currentOrder = await client.query(`SELECT * FROM data.orders WHERE order_number='${orderNumber}' AND user_id=${userId}`);
            sellerData = await client.query(`SELECT user_id 
                                FROM data.live_sessions WHERE id=${currentOrder.rows[0].live_sessions_id}`);
            const currOrderId = currentOrder.rows[0].id;
            let compareAmountTherehold = 0;
            // get seller settings
            // console.log(`SELECT * FROM data.seller_settings WHERE user_id=${sellerData.rows[0].user_id}`);
            settings = await client.query(`SELECT * FROM data.seller_settings WHERE user_id=${sellerData.rows[0].user_id}`);

            settingsThreshold = await client.query(`SELECT * FROM data.free_order_threshold WHERE user_id=${sellerData.rows[0].user_id}`);
            let threshold = 0;
            if (settingsThreshold.rows.length > 0) {
                threshold = parseInt(settingsThreshold.rows[0].threshold) > 0 ? settingsThreshold.rows[0].threshold : 0;
            }

            const SQL = `SELECT * FROM data.orders WHERE 
                user_id=${userId} AND status='payed' 
                AND (return_shipping IS NULL AND refund_amount = 0) 
                ORDER BY updated_at DESC LIMIT 1`;
            const res = await client.query(SQL);
            let inPeriod = false;
            let freeShipping = false;
            let amountRefund = 0;

            if (res.rows.length > 0) {
                const startDateDb   = moment(settings.rows[0].free_shipping_from).format("YYYY-MM-DD HH:mm:ss");
                const endDateDb     = moment(settings.rows[0].free_shipping_to).format("YYYY-MM-DD HH:mm:ss");
                const orderCreatedAtDb= moment(currentOrder.rows[0].created_at).format("YYYY-MM-DD HH:mm:ss");

                // defined is period setup and yes, check whether the order arrived within the specified period
                if (settings.rows[0].free_shipping_from) {
                    const checkPeriodQuery = `SELECT 1 WHERE '${orderCreatedAtDb}' 
                        BETWEEN '${startDateDb}' 
                        AND '${endDateDb}'`;
                    const checkPeriodRes = await client.query(checkPeriodQuery);
                    inPeriod =  checkPeriodRes.rows.length > 0;
                }
                if (inPeriod) {
                    let prevTotal = 0;
                    let refundShipping = 0;
                    let ordersCount = 0;
                    const prevOrdersQuery = `SELECT * FROM data.orders 
                            LEFT JOIN data.live_sessions ON data.live_sessions.id = data.orders.live_sessions_id
                            WHERE  (data.orders.status = 'payed' OR data.orders.status = 'new') 
                            AND data.orders.user_id='${userId}' AND 
                            data.orders.created_at BETWEEN '${startDateDb}' AND '${endDateDb}'
                            `;
// console.log(prevOrdersQuery);
                    const prevOrderRes = await client.query(prevOrdersQuery);
                    prevOrderRes.rows.forEach(_order => {
                        prevTotal += parseFloat(_order.order_amount);
                        amountRefund += parseFloat(_order.shipping_amount);
                        ordersCount++;
                    });
// console.log(ordersCount);
                    // scenario 1:
                    // Free shipping is active. User makes the first order and it does not reach the threshold
                    // Buyer pays for shipping regardless the price and shipping method
console.log('order name', ordersCount);

                    if (ordersCount === 1 && prevTotal < threshold) {
                        return {success: true, amount_refund: 0, freeShipping: false}
                    } else if (ordersCount === 0 && currentOrder.rows[0].order_amount >= threshold) {
                        return {success: true, amount_refund: 0, freeShipping: true}
                    } else if (ordersCount === 1 && prevTotal >= threshold) {
                        return {success: true, amount_refund: 0, freeShipping: true}
                    } else if (ordersCount > 1) {
                        if (prevTotal < threshold) {
                            return {success: true, amount_refund: 0, freeShipping: true}
                        } else {
                            // check if user peayed for shipping
                            const checkRefundQuery =  `SELECT SUM(shipping_amount) AS total_shipping 
                                FROM data.orders
                                WHERE 
                                user_id='${userId}' AND
                                status='payed' AND
                                created_at 
                                BETWEEN 
                                '${startDateDb}' 
                                AND 
                                '${endDateDb}'`;
                            const resRefundQuery = await client.query(checkRefundQuery);
                            // check do we refund before
                            let refundAmount = resRefundQuery.rows[0].total_shipping ? resRefundQuery.rows[0].total_shipping : 0;
// console.log('Refund Shipping', refundAmount);
                            const existRefundQuery =  `SELECT SUM(refund_amount) AS total_refund
                                FROM data.orders
                                WHERE 
                                user_id='${userId}' AND
                                status='payed' AND
                                refund_amount > 0 AND
                                created_at 
                                BETWEEN 
                                '${startDateDb}' 
                                AND 
                                '${endDateDb}'`;
                            const existRefundQueryRes = await client.query(existRefundQuery);
// console.log('EXIST refund', )
                            if (existRefundQueryRes.rows[0].total_refund > 0) {
                                refundAmount = 0;
                            }
// console.log(existRefundQuery);

                            return {success: true, amount_refund: refundAmount, freeShipping: true}
                        }
                    }
                }

console.log('IN PERIOD', inPeriod) ;
console.log('THRESHOLD', threshold) ;
                if (threshold > 0 && inPeriod) {
                    const prevOrdersQuery = `SELECT * FROM data.orders 
                        LEFT JOIN data.order_statuses ON data.order_statuses.order_id = data.orders.id 
                        LEFT JOIN data.live_sessions ON data.live_sessions.id = data.orders.live_sessions_id
                        WHERE 
                            data.order_statuses.status = 'payed' AND
                            data.live_sessions.user_id = ${sellerData.rows[0].user_id} 
                            AND data.orders.user_id='${userId}' 
                            AND
                            data.order_statuses.created_at BETWEEN '${startDateDb}' AND '${endDateDb}'`;
                    const prevOrderRes = await client.query(prevOrdersQuery);
                    let prevTotal = 0;
                    let refundShipping = 0;
                    let ordersCount = 0;
                    prevOrderRes.rows.forEach(_order => {
                        prevTotal += parseFloat(_order.order_amount);
                        ordersCount++;
                        refundShipping += !_order.return_shipping ? 0 : parseFloat(_order.shipping_amount);
                    });
                    ordersCount = ordersCount + 1;

                    let makeRefund = false;
                    if (prevTotal + parseFloat(currentOrder.rows[0].order_amount) >= threshold) {
                        makeRefund = true;
                        // calculate refund amount
                        console.log(`SELECT shipping_amount, id 
                                FROM data.orders WHERE shipping_amount > 0 AND user_id=${userId} AND return_shipping IS NOT TRUE ORDER BY created_at DESC LIMIT 1`)
                        const refundData = await client.query(`SELECT shipping_amount, id 
                                FROM data.orders WHERE shipping_amount > 0 AND user_id=${userId} AND return_shipping IS NOT TRUE ORDER BY created_at DESC LIMIT 1`);
                        amountRefund = parseFloat(refundData.rows[0].shipping_amount);


                        console.log('AMOUNT REFUND', amountRefund)
                        // check if we refund before
                        const refundedOrderRes =  await client.query(`SELECT id FROM data.orders WHERE refund_amount > 0 AND user_id=${userId} AND status='payed'`);
                        if (refundedOrderRes.rows.length !== 0) {
                            amountRefund = 0;
                        }
                        if (amountRefund) {
                            await client.query(`UPDATE data.orders SET refund_amount='${amountRefund}' WHERE id='${currentOrder.rows[0].id}' `)
                            return {success: true, amount_refund: amountRefund, freeShipping: freeShipping}
                        }
                        // await client.query(`UPDATE data.orders SET return_shipping = true WHERE id='${refundData.rows[0].id}'`)
                        console.log('Make refund', amountRefund)

                        return {success: true, amount_refund: amountRefund, freeShipping: freeShipping}
                    } else {
                        return {success: true, amount_refund: 0, freeShipping: freeShipping}
                    }
                } else {
console.log('WE ARE NOT IN PERIOD');
                    return {success: true, amount_refund: 0, freeShipping: freeShipping}
                }

                if (parseFloat(amountRefund) > 0) {
                    await client.query(`UPDATE data.orders SET refund_amount='${amountRefund}' WHERE id='${currOrderId}'`)
                }
                let prevOrderRes1 = null;
                if (!inPeriod) {
                    console.log('AAAAAA');
                } else {
                    const prevOrdersQuery1 = `SELECT * FROM data.orders 
                        LEFT JOIN data.order_statuses ON data.order_statuses.order_id = data.orders.id 
                        LEFT JOIN data.live_sessions ON data.live_sessions.id = data.orders.live_sessions_id
                        WHERE 
                            data.order_statuses.status = 'payed' AND 
                            data.live_sessions.user_id = ${sellerData.rows[0].user_id} AND data.orders.user_id='${userId}' AND
                            data.order_statuses.created_at BETWEEN '${startDateDb}' AND '${endDateDb}'`;
                    prevOrderRes1 = await client.query(prevOrdersQuery1);
                }

                return {success: true, amount_refund: amountRefund, freeShipping: freeShipping}
            } else {
                const currOrder = await client.query(`SELECT order_amount, user_id, live_sessions_id, created_at, updated_at FROM 
                    data.orders WHERE order_number='${orderNumber}'`);

                // const userOrdersQuery = await client.query()
                const payedOrdersQuery = (`SELECT SUM(order_amount) as totalPayed FROM data.orders WHERE user_id='${currOrder.rows[0].user_id}'AND status='payed'`)
                const payedOrdersQueryRes = await client.query(payedOrdersQuery)
                // console.log(payedOrdersQuery);
                let amountPayed = 0;
                if (payedOrdersQueryRes.rows[0].totalPayed) {
                    amountPayed = parseFloat(currOrder.rows[0].totalPayed);
                }


                const compareDate = moment(currOrder.rows[0].updated_at, "DD/MM/YYYY");
                const startDate   = moment(settings.rows[0].free_shipping_from, "DD/MM/YYYY");
                const endDate     = moment(settings.rows[0].free_shipping_to, "DD/MM/YYYY");
                const startDateDb   = moment(settings.rows[0].free_shipping_from).format("YYYY-MM-DD");
                const endDateDb     = moment(settings.rows[0].free_shipping_to).format("YYYY-MM-DD");
                const inPeriod = compareDate.isBetween(startDate, endDate);
console.log(1, amountPayed);
console.log(2, currOrder.rows[0].order_amount);


                sellerData = await client.query(`SELECT user_id 
                                FROM data.live_sessions WHERE id=${currOrder.rows[0].live_sessions_id}`);
                settingsThreshold = await client.query(`SELECT * FROM data.free_order_threshold WHERE user_id=${sellerData.rows[0].user_id}`);
                let isFree = false;let refundAmountNew = 0;
console.log('in period', inPeriod)
                if (inPeriod) {
                    console.log('TYT', parseFloat(currOrder.rows[0].order_amount)+amountPayed)
                    // order already more therehold
                    if (parseFloat(currOrder.rows[0].order_amount)+amountPayed > parseFloat(settingsThreshold.rows[0].threshold)) {
                        isFree = true;
                        return {success: true, amount_refund: 0, freeShipping: true}
                    }
                    // calculate refund
                    // const prevQuries =  await client.query(`SELECT * FROM  data.orders WHERE user_id=${userId} AND status='payed'`)
                    // const prevQuries =  await client.query('SELECT * FROM  data.orders WHERE user_id=${}')
                    // if (parseFloat(currOrder.rows[0].order_amount)+amountPayed > parseFloat(settingsThreshold.rows[0].threshold)) {
                    //     // console.log('Amount OrderD', parseFloat(currOrder.rows[0].order_amount)
                    //     return {success: true, amount_refund: 0, freeShipping: false}
                    // } else {
                    //     console.log('ORDER AMOUNT', parseFloat(currOrder.rows[0].order_amount));
                    //     console.log('THEREHOLD', parseFloat(settingsThreshold.rows[0].threshold));
                    //     if (parseFloat(currOrder.rows[0].order_amount) < parseFloat(settingsThreshold.rows[0].threshold) )
                    //     {
                    //         return {success: true, amount_refund: 0, freeShipping: false}
                    //     } else {
                    //         return {success: true, amount_refund: 0, freeShipping: true}
                    //     }
                    // }
                } else {
                    return {success: true, amount_refund: 0, freeShipping: false}
                }

                return {success: true, amount_refund: 0, freeShipping: false}
            }
        } catch (e) {
            console.log(e.message)
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
            const refundPrefix = generateRndPrefix(4);
            if (sellerSettingsRes.rows.length === 0) {
                return {success: false, error: 'No key for payment'}
            }
            const orderData = {
                "currency": "EUR",
                "amount": (parseFloat(order.total_amount) + parseFloat(order.shipping_amount > 0 ? order.shipping_amount : 0))*100,
                "description": "Refund by seller"
            }
            console.log(orderData);
            console.log(`${process.env.MULTISAFE_ORDER_PREFIX}-${order.id}`);
            const multiSafePayClientRes = await axios
                .post(`${process.env.MULTISAFEPAY_URL}/orders/${process.env.MULTISAFE_ORDER_PREFIX}-${order.id}/refunds?api_key=${sellerSettingsRes.rows[0].multisafe_api_key}`, orderData,{
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(async () => {
                    console.log(`UPDATE data.orders SET status='canceled', refund_prefix='${refundPrefix}' WHERE id=${order.id};`);
                    await client.query(`UPDATE data.orders SET status='canceled', refund_prefix='${refundPrefix}' WHERE id=${order.id};`);
                    await client.query(`INSERT INTO data.order_statuses (order_id, status) VALUES ('${order.id}', 'canceled')`);
                    return {success: true, error: null}
                }).catch(error => {
                    console.log(error);
                    console.log('Multisafe error', error.message);
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
