import pool from './connect.js';
import { logger } from '../../common/logger.js';
import moment from 'moment';
import orderModel from "./Order.js";
import productModel from "./Product.js";

class ChatbotMessage {
    async messagesSinceDate(sessionId) {
        const client = await pool.connect();
        const commentQuery = `SELECT created_time FROM data.live_sessions_messages WHERE live_sessions_id = '${sessionId}' 
            ORDER BY created_at DESC LIMIT 1;`;
console.log('Comment Query', commentQuery);
        try {
            const resQuery = await client.query(commentQuery);
            const dateComment = resQuery.rows.length > 0 ? resQuery.rows[0].created_time : null;
            const error = null;

            return {
                dateComment,
                error
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (chatbot messages addMessages):',
                    { message: commentQuery }
                );
                logger.log(
                    'error',
                    'Query:',
                    { message: e.message }
                );
            }
            const dateComment = null;
            const error = {
                code: 500,
                message: 'error getting last comment datetime message'
            };
            return {
                dateComment,
                error
            };
        } finally {
            client.release();
        }
    }
    
    async addMessages(sessionId, data) {
        const client = await pool.connect();
        const commentQuery = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '${JSON.stringify(data).replaceAll("'", '')}');`;
console.log('Comment query');
console.log(commentQuery);
        try {
            await client.query(commentQuery);
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
                    'Model error (chatbot messages addMessages):',
                    { message: commentQuery }
                );
                logger.log(
                    'error',
                    'Query:',
                    { message: e.message }
                );
            }
            const items = null;
            const error = {
                code: 500,
                message: 'error insering message'
            };
            return {
                items,
                error
            };
        } finally {
            client.release();
        }
    }

    async _findProductData(productId) {
        const client = await pool.connect();
        const _tProduct = await client.query(`SELECT nosize, nocolor, configured  FROM data.products WHERE id=${productId}`);
        if (!_tProduct.rows[0].configured) {
            const _xx = await productModel.fetchSimpleProduct(productId);
            return _xx.product;
        }
        return _tProduct.rows[0];
    }


    async _performMessage(product, msgData, _message, sessionId, fullMessage) {
        const client = await pool.connect();
        let _predparsedMessage;
        let _pQuery;
        let qPredparser;
        let performedData = [];
        let insertMsg;
        let updMessage;
        if (product.configured) {
            if (product.nosize && !product.nocolor) {
                _predparsedMessage = msgData[0]+' '+msgData[1]+' s'+msgData[2];
                _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[2603,2602]));`;
                await client.query(_pQuery);
                updMessage = {
                    created_time: fullMessage.created_time,
                    from: fullMessage.from,
                    message: _predparsedMessage,
                    id: fullMessage.id
                }
                const insertMsg = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '[${JSON.stringify(updMessage).replaceAll("'", '')}]');`;
                await client.query(insertMsg);
            } else if (!product.nosize && product.nocolor) {
                _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2];
                _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[2601,2600]));`;
                await client.query(_pQuery);
                updMessage = {
                    created_time: fullMessage.created_time,
                    from: fullMessage.from,
                    message: _predparsedMessage,
                    id: fullMessage.id
                }
                const insertMsg = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '[${JSON.stringify(updMessage).replaceAll("'", '')}]');`;
                await client.query(insertMsg);
            } else if (product.nosize && product.nocolor) {
                if (msgData[3] >= 1 && msgData[3] <= 10)
                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2] + ' s'+msgData[3] + (msgData[4] ? ' '+msgData[3] : ' 1');
                else
                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2] + ' '+msgData[3] + (msgData[4] ? ' '+msgData[3] : ' 1');
                _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[2596]));`;
                await client.query(_pQuery);
                updMessage = {
                    created_time: fullMessage.created_time,
                    from: fullMessage.from,
                    message: _predparsedMessage,
                    id: fullMessage.id
                }
                const insertMsg = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '[${JSON.stringify(updMessage).replaceAll("'", '')}]');`;
                await client.query(insertMsg);
            }
        } else {
            let _qty = 1;
            if (product.selectedColors.length > 0 && product.selectedSizes.length === 0) {
                if (parseInt(msgData[2])) {
                    _qty = parseInt(msgData[2]);
                }
                if (parseInt(msgData[3])) {
                    _qty = parseInt(msgData[3]);
                }
                _predparsedMessage = msgData[0]+' '+msgData[1]+' '+product.selectedColors[0].name + ' '+_qty;
                _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[2596]));`;
            } else if (product.selectedColors.length === 0 && product.selectedSizes.length > 0) {
                let _prodSize = product.selectedSizes[0].name;
                if (parseInt(msgData[2])) {
                    _qty = parseInt(msgData[2]);
                }
                _predparsedMessage = msgData[0]+' '+msgData[1]+' '+product.selectedSizes[0].name + ' '+_qty;
                _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[2602]));`;
            } else if (product.selectedColors.length > 0 && product.selectedSizes.length > 0) {
                if (msgData[2]) {
                    _qty = parseInt(msgData[2]);
                }
                _predparsedMessage = msgData[0]+' '+msgData[1]+' '+_qty;
                _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[2604]));`;
            } else {
                _predparsedMessage = msgData[0]+' '+msgData[1]+' '+_qty;
                _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[2605]));`;
            }
            await client.query(_pQuery);
            updMessage = {
                created_time: fullMessage.created_time,
                from: fullMessage.from,
                message: _predparsedMessage,
                id: fullMessage.id
            }
            const insertMsg = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '[${JSON.stringify(updMessage).replaceAll("'", '')}]');`;
            await client.query(insertMsg);
        }

        return performedData;
    }

    async performMessage(data, sessionId) {
        const client = await pool.connect();
        const msgData = data.message.split(' ');
        const promisesProduct = [];
        const promisesParser = [];
        promisesProduct.push(this._findProductData(msgData[1]));
        const _productRes = await Promise.all(promisesProduct);

        if (_productRes.length > 0) {
            const _product = _productRes[0];
            promisesParser.push(this._performMessage(_product, msgData, data.message, sessionId, data));
        }
        await Promise.all(promisesParser);

        return {success: true};
    }

    async addMessagesTest(sessionId) {
        const client = await pool.connect();
        const data = [
            {
                "created_time": "2024-10-28T16:25:12+0000",
                "from": {
                    "name": "Kyryl Proshop",
                    "id": "6681200108589867"
                },
                "message": "sold 194 red 9",
                "id": "1149695475472325_563802062787510"
            },
            {
                "created_time": "2024-10-28T16:25:12+0000",
                "from": {
                    "name": "Kyryl Proshop",
                    "id": "6681200108589867"
                },
                "message": "sold 193 7",
                "id": "1249695475472325_563802062787512"
            },
            {
                "created_time": "2024-10-28T16:25:12+0000",
                "from": {
                    "name": "Kyryl Proshop",
                    "id": "6681200108589867"
                },
                "message": "sold 190 red 3",
                "id": "5549695475472325_563802062787512"
            },
            {
                "created_time": "2024-10-28T16:25:12+0000",
                "from": {
                    "name": "Kyryl Proshop",
                    "id": "6681200108589867"
                },
                "message": "sold 198",
                "id": "1119695475472325_563802062787510"
            },
            {
                "created_time": "2024-10-28T16:25:12+0000",
                "from": {
                    "name": "Kyryl Proshop",
                    "id": "6681200108589867"
                },
                "message": "sold 195",
                "id": "2249695475472325_563802062787510"
            },
            {
                "created_time": "2024-10-28T16:25:12+0000",
                "from": {
                    "name": "Kyryl Proshop",
                    "id": "6681200108589867"
                },
                "message": "sold 196 3",
                "id": "3349795475472325_563802062787510"
            }
        ];
        const tPromises = [];
        data.forEach(_data => {
            tPromises.push(this.performMessage(_data, sessionId));
        })
        await Promise.all(tPromises);
        const items = [];
        const error = null;

        return {
            items,
            error
        };
        // exit;
        // const commentQuery = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '${JSON.stringify(data).replaceAll("'", '')}');`;
        // console.log('Comment query');
        // console.log(commentQuery);
        try {
            // await client.query(commentQuery);
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
                    'Model error (chatbot messages addMessages):',
                    { message: commentQuery }
                );
                logger.log(
                    'error',
                    'Query:',
                    { message: e.message }
                );
            }
            const items = null;
            const error = {
                code: 500,
                message: 'error insering message'
            };
            return {
                items,
                error
            };
        } finally {
            client.release();
        }
    }


    async parseMessages(sessionId) {
        const client = await pool.connect();
        try {
            const productQuery = `SELECT * FROM data.set_live_sessions_messages_parcer_data(${sessionId}, 100);`;
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
                    'Model error (chatbot messages addMessages):',
                    { message: e.message }
                );
            }
            const items = null;
            const error = {
                code: 500,
                message: 'add live messages'
            };
            return {
                items,
                error
            };
        } finally {
            client.release();
        }
    }
    
    async createOrders() {
        const client = await pool.connect();
        try {
            const productQuery = `SELECT data.live_sessions_messages.*, data.live_sessions.user_id
                FROM data.live_sessions_messages
                LEFT JOIN data.live_sessions ON data.live_sessions.id = live_sessions_messages.live_sessions_id
                WHERE parcer_status=true AND order_status IS NULL LIMIT 10`;
            const res = await client.query(productQuery);
            const items = res.rows.length > 0 ? res.rows : [];
            const error = null;
            
            const promisesQuery = [];
            items.forEach(item => {
                promisesQuery.push(this.createOrder(item));
            });
            await Promise.all(promisesQuery);
            return {
                items,
                error
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (chatbot messages addMessages):',
                    { message: e.message }
                );
            }
            const items = null;
            const error = {
                code: 500,
                message: 'add live messages'
            };
            return {
                items,
                error
            };
        } finally {
            client.release();
        }
    }


    async updateMessageStatus(messageId, recipientId) {
        const client = await pool.connect();
        try {
            const query = await client.query(
                `UPDATE data.live_sessions_messages SET 
                        reply_sended=true, recipient_id='${recipientId}'
                    WHERE message_id='${messageId}'`
            );
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Launched session):',
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

    async checkWaitingItemStatus(messageId) {
        const client = await pool.connect();
        try {
            // const query = await client.query(
            //     `SELECT * FROM data.order_items WHERE message_id='${messageId}' AND status='waiting'`
            // );
            const query = await client.query(
                `SELECT * FROM data.order_items WHERE message_id='${messageId}'`
            );
            const itemInWait = query.rows[0].quantity;
            let result;
            const queryExist = await client.query(`SELECT * FROM data.order_items WHERE message_id='${messageId}' AND status IS NULL`);
            result = !(queryExist.rows.length > 0 && query.rows.length > 0);


            // CHECK CODE CORRECTLY
            // if (!result) {
            //     await client.query(`UPDATE data.orders SET status='waiting' WHERE id='${query.rows[0].order_id}'`);
            // }


            // if (queryExist.rows.length > 0 && query.rows.length > 0) {
            //     // removing wait item from order
            //     // await client.query(`DELETE FROM data.order_items WHERE message_id='${messageId}' AND status='waiting'`);
            //     result = false;
            //
            // } else {
            //     result = true;
            // }

            return {
                result
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Launched session):',
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
    
    
    async getMessagesForReply(sessionId, data) {
        const client = await pool.connect();
        try {
            const productQueryNew = `SELECT lsm.* , p.name AS product_name, ls.user_id, dss.order_timer, 
                    dss.free_shipping_timer, foth.threshold, us.name as store_name, p.publish AS activeProduct,
                    p.publish AS active_product, p.configured, us.id AS store_id,
                    lsm.real_from_id, lsm.message_id, dss.free_shipping_from, dss.free_shipping_to,
                    (lsm.created_at BETWEEN dss.free_shipping_from AND dss.free_shipping_to) AS in_period,
                    dss.free_shipping_to
                    FROM data.live_sessions_messages lsm
                    LEFT JOIN data.products p ON (p.id = (lsm.parcer_data->>'item')::integer)
                    LEFT JOIN data.live_sessions ls ON lsm.live_sessions_id = ls.id
                    LEFT JOIN data.user_stores us ON us.id=ls.store_id
                    LEFT JOIN data.seller_settings dss ON dss.user_id = ls.user_id
                    LEFT JOIN data.free_order_threshold foth ON foth.user_id = ls.user_id
                    WHERE ((lsm.parcer_status = TRUE AND lsm.order_status IS NOT NULL AND lsm.reply_sended IS NULL) OR 
                    (lsm.parcer_status = FALSE AND lsm.reply_sended IS NULL AND (lsm.message LIKE '%vendu%' OR lsm.message LIKE '%sold%'))) 
                    AND ls.id='${sessionId}'
                    ORDER BY lsm.created_at DESC LIMIT 50`;
            const res = await client.query(productQueryNew);


            // before send check free period if yes set 'free_period_end' params in orders
            if (res.rows.length > 0) {
                res.rows.forEach(async data => {
                    await orderModel.connectThrowStore(data.message_id, data.real_from_id, data.store_id, !!data.in_period, data.free_shipping_to);
                })
            }

            const items = res.rows.length > 0 ? res.rows : [];
            const error = null;

            // const promisesQuery = [];
            // items.forEach(item => {
            //     promisesQuery.push(this.createOrder(item));
            // });
            // await Promise.all(promisesQuery);
            return {
                items,
                error
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (chatbot messages addMessages):',
                    { message: e.message }
                );
            }
            const items = null;
            const error = {
                code: 500,
                message: 'add live messages'
            };
            return {
                items,
                error
            };
        } finally {
            client.release();
        }
    }

    async setMessageAsReplied(messageId, replyId) {
        const client = await pool.connect();
        try {
            const productQuery = `UPDATE data.live_sessions_messages SET message_store_id='${replyId}' WHERE message_id='${messageId}'`;
            const res = await client.query(productQuery);
            const items = res.rows.length > 0 ? res.rows : [];
            const error = null;

            // const promisesQuery = [];
            // items.forEach(item => {
            //     promisesQuery.push(this.createOrder(item));
            // });
            // await Promise.all(promisesQuery);
            return {
                items,
                error
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (chatbot messages addMessages):',
                    { message: e.message }
                );
            }
            const items = null;
            const error = {
                code: 500,
                message: 'add live messages'
            };
            return {
                items,
                error
            };
        } finally {
            client.release();
        }
    }


    async createMessage(item) {
        const client = await pool.connect();
        try {
            const messageQuery = `INSERT INTO data.notifications
                (
                    user_id, type, subject, message
                )
                VALUES
                (
                    '${item.user_id}',
                    'system',
                    'Create invoice #${moment().valueOf()}',
                    'Create invoice #${moment().valueOf()}: item ${item.parcer_data.item}, qty ${item.parcer_data.quantity} '
                );`;
            await client.query(messageQuery);
            // await client.query(`UPDATE data.live_sessions_messages SET order_status=true WHERE message_id='${item.message_id}'`);
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
                    'Model error (chatbot messages addMessages):',
                    { message: e.message }
                );
            }
            const items = null;
            const error = {
                code: 500,
                message: 'add live messages'
            };
            return {
                items,
                error
            };
        } finally {
            client.release();
        }
    }
}

export default new ChatbotMessage();
