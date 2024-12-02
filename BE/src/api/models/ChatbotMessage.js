import pool from './connect.js';
import { logger } from '../../common/logger.js';
import moment from 'moment';
import orderModel from "./Order.js";
import productModel from "./Product.js";
import chatbotMessageModel from '../models/ChatbotMessage.js';
import shell from "shelljs";
import {setTimeout} from "timers/promises";

class ChatbotMessage {
    async getLiveCommentsParams(sessionId) {
        const client = await pool.connect();
        const commentQuery = `SELECT lates_comment_time, url_api_next
            FROM data.live_sessions WHERE id = '${sessionId}';`;
        try {
            const resQuery = await client.query(commentQuery);
            const dateComment = resQuery.rows.length > 0 ? resQuery.rows[0].url_api_next : null;
            const urlNext = resQuery.rows.length > 0 ? resQuery.rows[0].url_api_next : null;
            const error = null;

            return {
                dateComment,
                urlNext,
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

    async _performMessage(msgData, _message, sessionId, fullMessage) {
        const client = await pool.connect();
        let _predparsedMessage;
        let _pQuery;
        let performedData = [];
        let updMessage;
        let lng = 'en';
        if (msgData[0] === 'vendu') {
            lng = 'fr';
        }
        const product = await this._findProductData(msgData[1]);
        if (product) {
            if (product.configured) {
                updMessage = {
                    created_time: fullMessage.created_time,
                    from: fullMessage.from,
                    message: null,
                    id: fullMessage.id,
                    parcer_status: null,
                    parcer_data: null
                }
                // config colog no size
console.log('PARAMS');
console.log('NO SIZE', product.nosize);
console.log('NO COLOR', product.nocolor)
                if (product.nosize && !product.nocolor) {
                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2];
console.log('MSG', _predparsedMessage);
console.log('msgData[0]', msgData[0]);
                    if (msgData[0] === 'sold')
                        _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6291,6290]));`;
                    else
                        _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6300,6301]));`;
console.log('_pQuery');
console.log(_pQuery);
                    const tmpParsedData = await client.query(_pQuery);
                    if (tmpParsedData.rows.length > 0) {
                        tmpParsedData.rows.forEach(async _row => {
                            if (_row.status) {
                                const _tmpJsonData = _row.results_json;
                                let tColor, tSize, tColorId, tSizeId;
                                tColor = product.selectedColors[0] ? product.selectedColors[0].name : null;
                                tSize = product.selectedSizes[0] ? product.selectedSizes[0].name : null;
                                tColorId = product.selectedColors[0] ? product.selectedColors[0].id : null;
                                tSizeId = product.selectedSizes[0] ? product.selectedSizes[0].id : null;

                                _tmpJsonData.color = tColor;
                                _tmpJsonData.color_id = tColorId;
                                _tmpJsonData.size = tSize;
                                _tmpJsonData.size_id = tSizeId;

                                updMessage.message = _predparsedMessage;
                                updMessage.parcer_status = true;
                                updMessage.parcer_data = _tmpJsonData;
                            } else {
console.log('NOT FIND REQ CONFIG');
                            }
                        });
                    }
console.log('updMessage', updMessage);
                    const insertMsg = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '[${JSON.stringify(updMessage).replaceAll("'", '')}]');`;
                    await client.query(insertMsg);
                } else if (!product.nosize && product.nocolor) {
                    _predparsedMessage = msgData[0]+' '+msgData[1]+' s'+msgData[2];
                    if (msgData[0] === 'sold')
                        _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6293,6302]));`;
                    else
                        _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6303,6302]));`;
                    const tmpParsedData = await client.query(_pQuery);
                    if (tmpParsedData.rows.length > 0) {
                        tmpParsedData.rows.forEach(async _row => {
                            if (_row.status) {
                                const _tmpJsonData = _row.results_json;
                                let tColor, tSize, tColorId, tSizeId;
                                tColor = product.selectedColors[0] ? product.selectedColors[0].name : null;
                                tSize = product.selectedSizes[0] ? product.selectedSizes[0].name : null;
                                tColorId = product.selectedColors[0] ? product.selectedColors[0].id : null;
                                tSizeId = product.selectedSizes[0] ? product.selectedSizes[0].id : null;

                                _tmpJsonData.color = tColor;
                                _tmpJsonData.color_id = tColorId;
                                _tmpJsonData.size = tSize;
                                _tmpJsonData.size_id = tSizeId;

                                updMessage.message = _predparsedMessage;
                                updMessage.parcer_status = true;
                                updMessage.parcer_data = _tmpJsonData;
                            }
                        });
                    }
console.log('updMessage', updMessage);
                    const insertMsg = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '[${JSON.stringify(updMessage).replaceAll("'", '')}]');`;
                    await client.query(insertMsg);
                } else if (!product.nosize && !product.nocolor) {
                    if (msgData[3] >= 1 && msgData[3] <= 10)
                        _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2] + ' s'+msgData[3] + (msgData[4] ? ' '+msgData[3] : ' 1');
                    else
                        _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2] + ' '+msgData[3] + (msgData[4] ? ' '+msgData[3] : ' 1');
                    if (msgData[0] === 'sold')
                        _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6286,6288]));`;
                    else if (msgData[0] === 'vendu')
                        _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6296,6298]));`;

                    const tmpParsedData = await client.query(_pQuery);
                    if (tmpParsedData.rows.length > 0) {
                        tmpParsedData.rows.forEach(async _row => {
                            if (_row.status) {
                                const _tmpJsonData = _row.results_json;
                                let tColor, tSize, tColorId, tSizeId;
                                tColor = product.selectedColors[0] ? product.selectedColors[0].name : null;
                                tSize = product.selectedSizes[0] ? product.selectedSizes[0].name : null;
                                tColorId = product.selectedColors[0] ? product.selectedColors[0].id : null;
                                tSizeId = product.selectedSizes[0] ? product.selectedSizes[0].id : null;

                                _tmpJsonData.color = tColor;
                                _tmpJsonData.color_id = tColorId;
                                _tmpJsonData.size = tSize;
                                _tmpJsonData.size_id = tSizeId;

                                updMessage.message = _predparsedMessage;
                                updMessage.parcer_status = true;
                                updMessage.parcer_data = _tmpJsonData;
                            }
                        });
                    }
console.log('updMessage', updMessage);
                    const insertMsg = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '[${JSON.stringify(updMessage).replaceAll("'", '')}]');`;
console.log('insertMsg', insertMsg);
                    await client.query(insertMsg);
                }
            } else {
                let _qty = 1;
console.log(product)
                if (product.selectedColors.length > 0 && product.selectedSizes.length === 0) {
                    if (parseInt(msgData[2])) {
                        _qty = parseInt(msgData[2]);
                    }
                    if (parseInt(msgData[3])) {
                        _qty = parseInt(msgData[3]);
                    }
                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+product.selectedColors[0].name + ' '+_qty;
                    _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6286,6291,6296,6301]));`;
                } else if (product.selectedColors.length === 0 && product.selectedSizes.length > 0) {
                    if (parseInt(msgData[2])) {
                        _qty = parseInt(msgData[2]);
                    }
                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+product.selectedSizes[0].name + ' '+_qty;
                    _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6292,6302]));`;
                } else if (product.selectedColors.length > 0 && product.selectedSizes.length > 0) {
                    if (msgData[2]) {
                        _qty = parseInt(msgData[2]);
                    }
                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+_qty;
                    _pQuery = `// SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6294,6304]));`;
                    _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6294,6304]));`;
                } else {
                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+_qty;
                    _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6295,6305]));`;
                }
console.log(_pQuery);
                const tmpParsedData = await client.query(_pQuery);
                if (tmpParsedData.rows.length > 0) {
                    tmpParsedData.rows.forEach(async _row => {
                        if (_row.status) {
                            updMessage = {
                                created_time: fullMessage.created_time,
                                from: fullMessage.from,
                                message: _predparsedMessage,
                                id: fullMessage.id,
                                parcer_status: null,
                                parcer_data: null
                            }
                            const _tmpJsonData = _row.results_json;
                            let tColor, tSize, tColorId, tSizeId;
                            tColor = product.selectedColors[0] ? product.selectedColors[0].name : null;
                            tSize = product.selectedSizes[0] ? product.selectedSizes[0].name : null;
                            if (lng === 'fr') {
                                if (product.selectedColors.length) {
                                    if (product.selectedColors[0].translations) {
                                        tColor = product.selectedColors[0].translations[0].fr.name;
                                    }
                                }
                            }
                            tColorId = product.selectedColors[0] ? product.selectedColors[0].id : null;
                            tSizeId = product.selectedSizes[0] ? product.selectedSizes[0].id : null;
                            _tmpJsonData.color = tColor;
                            _tmpJsonData.color_id = tColorId;
                            _tmpJsonData.size = tSize;
                            _tmpJsonData.size_id = tSizeId;

                            updMessage.parcer_status = true;
                            updMessage.parcer_data = _tmpJsonData;

                            const insertMsg = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '[${JSON.stringify(updMessage).replaceAll("'", '')}]');`;
console.log('INSERT MSG', insertMsg);
                            await client.query(insertMsg);
                        }
                    })
                }
            }

            return performedData;
        } else {
console.log('MSG', _message)
            updMessage = {
                created_time: fullMessage.created_time,
                from: fullMessage.from,
                message: _message,
                id: fullMessage.id,
                parcer_status: false,
                parcer_data: null
            }
            if (msgData[0] === 'sold')
                _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6286,6291,6296,6301,6292,6302,6294,6304,6295,6305,6286,6288,6296,6298]));`;
            else if (msgData[0] === 'vendu')
                _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6286,6291,6296,6301,6292,6302,6294,6304,6295,6305,6286,6288,6296,6298]));`;

            const tmpParsedData = await client.query(_pQuery);
            updMessage.parcer_data =  tmpParsedData.rows[0];
            const insertMsg = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '[${JSON.stringify(updMessage).replaceAll("'", '')}]');`;
            await client.query(insertMsg);

            return performedData;
        }

    }

    async performMessage(data, sessionId) {
        const client = await pool.connect();
        try {
            const msgData = data.message.split(' ');
            if (msgData[1]) {
//                 const _product = await this._findProductData(msgData[1]);
// console.log('FINDED PRODUCT', _product);
//                 if (_product.id) {
                    this._performMessage(msgData, data.message, sessionId, data);
                // }
            }
//             const promisesProduct = [];
//             const promisesParser = [];
//             // update time for latest comment
//             // await client.query(`UPDATE data.live_sessions SET lates_comment_time='${data.created_time}' WHERE id='${sessionId}'`);
//
//             if (msgData[1]) {
//                 promisesProduct.push(this._findProductData(msgData[1]));
//                 const _productRes = await Promise.all(promisesProduct);
//                 if (_productRes.length > 0) {
//                     const _product = _productRes[0];
// console.log('PRODUCT', _product)    ;
//                     // promisesParser.push(this._performMessage(_product, msgData, data.message, sessionId, data));
//                     // await Promise.all(promisesParser);
//                 }
//             }

            return {success: true};

        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (chatbot messages addMessages):',
                    { message: e.message }
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

    async performMessageByParam(sessionId, message) {
        const client = await pool.connect();
        const messageForTransform = message.message_transform;
        const msgData = messageForTransform.split(' ');
        const commentId = message.message_id;
        const commentData = commentId.split('_');

        let productId = msgData[1].trim();
        const performedSizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        let _predparsedMessage, _pQuery, updMsgQuery, simpleWithoutAnyParam;
        let _size, _color, _qty;
        if (!parseInt(productId)) {
            await client.query(`UPDATE data.live_sessions_messages SET transformed = true,
                parcer_status = false
                WHERE message_id='${commentId}'`);
        } else {
            const product = await productModel.fetchSimpleProduct(parseInt(productId));
            if (!product?.product) {
                await client.query(`UPDATE data.live_sessions_messages SET
                            from_id = '${commentData[0]}',
                            from_name = 'PARSER DONE',
                            transformed = true,
                            lng = '${msgData[0] === 'sold' ? 'en' : 'fr'}'
                            WHERE message_id = '${commentId}'`);
            } else {
                if (!product?.product.configured) {
                    switch (true) {
                        case (product.product.nosize && !product.product.nocolor) :
                            _predparsedMessage = msgData[0].trim() + ' ' + productId + ' ' +
                                (msgData[2] ? msgData[2].trim() : '') + ' ' +
                                (msgData[3] ? msgData[3].trim() : 1);
console.log('_predparsedMessage SIMPLE SIZE, NO COLOR', _predparsedMessage);
                            break;
                        case (!product.product.nosize && product.product.nocolor) :
                            _qty = msgData[3] ? msgData[3] : 1;
                            if (performedSizes.includes(msgData[2])) {
                                _size = 's' + msgData[2];
                            } else {
                                _size = msgData[2];
                            }
                            _predparsedMessage = msgData[0] + ' ' + productId + ' ' + _size + ' ' + _qty;
console.log('_predparsedMessage SIMPLE NO SIZE, COLOR', _predparsedMessage);
                            break;
                        case (!product.product.nosize && !product.product.nocolor) :
                            _qty = msgData[2] ? msgData[2] : 1;
                            _predparsedMessage = msgData[0] + ' ' + productId + ' ' + _qty;
console.log('_predparsedMessage SIMPLE SIZE, COLOR', _predparsedMessage);
                            break;
                        case (product.product.nosize && product.product.nocolor) :
                            _qty = msgData[2] ? msgData[2] : 1;
                            _predparsedMessage = msgData[0] + ' ' + productId + ' ' + _qty;
console.log('_predparsedMessage SIMPLE NO SIZE NO COLOR', _predparsedMessage);
                            break;
                        default:
                            _predparsedMessage = msgRes.rows[0].message_transform;
                            break;
                    }
                    const msgUpSimple = `UPDATE data.live_sessions_messages SET
                            from_id = '${commentData[0]}',
                            from_name = 'PARSER SIMPLE',
                            transformed = true,
                            lng = '${msgData[0] === 'sold' ? 'en' : 'fr'}',
                            message='${_predparsedMessage}'
                        WHERE message_id = '${commentId}'`;
                    await client.query(msgUpSimple);
console.log(msgUpSimple);
                    return { success: true, message: _predparsedMessage, commentId: commentId}
                } else {
                    switch (true) {
                        case (product.product.nosize && !product.product.nocolor) :
                            _predparsedMessage = msgData[0].trim()+' '+productId+ ' ' +
                                (msgData[2] ? msgData[2].trim() : '')+' '+
                                (msgData[3] ? msgData[3].trim() : 1);
console.log('_predparsedMessage CONF1 JCOLOR', _predparsedMessage);
                            break;
                        case (!product.product.nosize && product.product.nocolor) :
                            _qty = msgData[3] ? msgData[3] : 1;
                            if (performedSizes.includes(msgData[2])) {
                                _size = 's'+msgData[2];
                            } else {
                                _size = msgData[2];
                            }
                            _predparsedMessage = msgData[0]+' '+productId+' '+_size + ' '+_qty;
console.log('_predparsedMessage CONF2 JSIZE', _predparsedMessage);
                            break;
                        case (!product.product.nosize && !product.product.nocolor) :
                            _qty = msgData[4] ? msgData[4] : 1;
                            if (performedSizes.includes(msgData[3])) {
                                _predparsedMessage = msgData[0] + ' ' + productId + ' ' + msgData[2] + ' s' + msgData[3] + ' ' + _qty;
                            } else if (performedSizes.includes(msgData[2])) {
                                _predparsedMessage = msgData[0] + ' ' + productId + ' s' + msgData[2] + ' ' + msgData[3] + ' ' + _qty;
                            } else {
                                _predparsedMessage = msgData[0] + ' ' + productId + ' ' + msgData[2] + ' ' + msgData[3] + ' ' + _qty;
                            }
console.log('_predparsedMessage CONF3 FULL', _predparsedMessage);
                            break;
                        default:
                            _predparsedMessage = msgRes.rows[0].message_transform;
                            break;
                    }
                    const msgUpConf = `UPDATE data.live_sessions_messages SET
                            from_id = '${commentData[0]}',
                            from_name = 'PARSER SIMPLE',
                            transformed = true,
                            lng = '${msgData[0] === 'sold' ? 'en' : 'fr'}',
                            message='${_predparsedMessage}'
                        WHERE message_id = '${commentId}'`;
                    await client.query(msgUpConf);
console.log(msgUpConf);

                    return { success: true }
                    // await client.query(`UPDATE data.live_sessions_messages SET
                    //         from_id = '${commentData[0]}',
                    //         from_name = 'CONF PRODUCT',
                    //         transformed = true,
                    //         lng = '${msgData[0] === 'sold' ? 'en' : 'fr'}'
                    //     WHERE message_id = '${commentId}'`);
                }
            }
        }

        return { success: true }
    }


    async transformLiveCommentsByMessage(sessionId, commentIds) {
        const client = await pool.connect();
        // const commentData = commentId.split('_');
        // const fromId = commentData[1];
console.log('COMMENTS IDS:', commentIds);
        const commentIdsIn =  (JSON.stringify(commentIds).replace('[', '').replace(']', '').replaceAll('"', "'"));
        const msgRes = await client.query(`SELECT * 
            FROM data.live_sessions_messages
            WHERE message_id IN (${commentIdsIn})`);

        if (msgRes.rows.length > 0) {
            const promisesQueries = [];
            msgRes.rows.forEach(async _msg => {
                // const _data = await this.performMessageByParam(sessionId, _msg);
                // console.log('_data', _data);
// console.log(_msg.message_id, _msg.message_id);
                const _data = promisesQueries.push(this.performMessageByParam(sessionId, _msg));
            })
            await Promise.all(promisesQueries);

        } else {
            return { success: true }
        }
        console.log('transform done: ', msgRes.rows[0].message_transform);
        console.log('======');

        return { success: true };
    }


    async transformLiveCommentsCnt(sessionId) {
        const client = await pool.connect();
        // const msgQuery = `SELECT data.live_sessions_messages.message_id FROM data.live_sessions_messages WHERE
        //     live_sessions_id='${sessionId}' AND transformed IS NULL AND parcer_status IS NULL
        //     ORDER BY created_at LIMIT 50`;
        const msgQuery = `SELECT transform_launched FROM data.live_sessions WHERE
            id='${sessionId}`;
        const messagesData = await client.query(msgQuery);
        return {success: true, launched: messagesData.rows[0].transform_launched }
    }

    async updateNoValidMessages(sessionId) {
        const client = await pool.connect();
        const updNotValidMsgs = `UPDATE data.live_sessions_messages SET 
                        parcer_status = false,
                        transformed = true 
              WHERE live_sessions_id='${sessionId}' AND 
                (message_transform NOT LIKE '%sold%' AND message_transform NOT LIKE '%vendu%') 
                AND (transformed IS NULL); `;
// console.log(updNotValidMsgs);exit;
        await client.query(updNotValidMsgs);
    }

    async notParsedLiveComments(sessionId) {
        const client = await pool.connect();

        // mark not valid as parsed
        // await client.query(`UPDATE data.live_sessions_messages SET
        //         transformed = true,
        //         parcer_status = false
        //         WHERE
        //         live_sessions_id='${sessionId}' AND transformed IS NULL AND
        //         (message_transform NOT LIKE 'sold%' AND message_transform NOT LIKE 'vendu%')
        // `);

        const msgQuery = `SELECT message_id,message_transform FROM data.live_sessions_messages
                WHERE 
                live_sessions_id='${sessionId}' AND transformed IS NULL 
                    AND 
                (message_transform LIKE 'sold%' OR message_transform LIKE 'vendu%')
                ORDER BY created_at LIMIT 1`;
        const messagesData = await client.query(msgQuery);

        return { success: true, resultData: messagesData.rows.length ? messagesData.rows : null  }
    }


    async transformLiveComments(sessionId) {
        const client = await pool.connect();
        await this.updateNoValidMessages(sessionId);
        const tPromises = [];
        // const msgQuery = `SELECT * FROM data.live_sessions_messages WHERE
        //     live_sessions_id='${sessionId}' AND transformed IS NULL AND parcer_status IS NULL
        //     ORDER BY created_at LIMIT 5`;
        const msgQuery = `SELECT * FROM data.live_sessions_messages WHERE
            live_sessions_id='${sessionId}' AND transformed IS NULL
            ORDER BY created_at LIMIT 1`;
        const messagesData = await client.query(msgQuery);
        if (messagesData.rows.length > 0) {
            // const tPromises = [];
            await client.query(`UPDATE data.live_sessions SET transform_launched = true WHERE id='${sessionId}'`);
//             messagesData.rows.forEach(async _row => {
// console.log('parse msg: ', _row.message_transform);
//                 await this._transformLiveVideoComment(_row, sessionId);
//                 // tPromises.push(this._transformLiveVideoComment(_row, sessionId));
//             });
            // await Promise.all(tPromises);
            await this._transformLiveVideoComment(messagesData.rows[0], sessionId);

            await client.query(`UPDATE data.live_sessions SET transform_launched = null WHERE id='${sessionId}'`);
console.log('========= PARSER DONE =========')
            shell.exec(`pm2 delete ../BE/storeLocalJobs/jobStorePreParser.js --name "jobStorePreParser ${sessionId}"`, function(code, output) {
            });

// console.log('=============');
// console.log('START PREDPARSER', messagesData.rows[0].message_transform);
//             try {
//                 // const redPredPrs = await this._transformLiveVideoComment(messagesData.rows[0], sessionId);
//
//                 tPromises.push(this._transformLiveVideoComment(messagesData.rows[0], sessionId));
//                 await Promise.all(tPromises);
//
//             } catch (e) {
// // console.log('HERE WTF', e.data.error.message);
//             }

            await client.query(`UPDATE data.live_sessions SET transform_launched = null WHERE id='${sessionId}'`);
console.log('END PREDPARSER');
console.log('=============');
            return { success: true }

            // try {
            //     // shell.exec(`pm2 save`, function(code, output) {
            //     // });
            //     // shell.exec(`pm2 delete ../BE/storeLocalJobs/jobStorePreParser.js --name "jobStorePreParser ${sessionId}"`, function(code, output) {
            //     // });
            //     // shell.exec(`pm2 save`, function(code, output) {
            //     // });
            //     // await setTimeout(2000);
            //     // console.log('RE RUN JOB');
            //     // shell.exec(`pm2 start ../BE/jobStorePreParser.js --name "jobStorePreParser ${sessionId}" -- sessionId=${sessionTestId}`, function(code, output) {
            //     // });
            //     // shell.exec(`pm2 save`, function(code, output) {
            //     // });
            //     // shell.exec(`pm2 save`, function(code, output) {
            //     // });
            // } catch (e) {
            //     console.log('Exception', e.data.error.message)
            //     // shell.exec(`pm2 delete ../BE/storeLocalJobs/jobStorePreParser.js --name "jobStorePreParser ${sessionId}"`, function(code, output) {
            //     // });
            // }


            // shell.exec(`pm2 start ../BE/storeLocalJobs/jobStorePreParser.js --name "jobStorePreParser ${sessionId}" -- sessionId=${sessionId}`, function(code, output) {
            // });
            // await client.query(`UPDATE data.live_sessions SET transform_launched = null WHERE id='${sessionId}'`);

            // await this._transformLiveVideoComment(messagesData.rows[0], sessionId)
            // await client.query(`UPDATE data.live_sessions SET transform_launched = null WHERE id='${sessionId}'`);

            // const queryPredpar = `SELECT transform_launched FROM data.live_sessions WHERE id='${sessionId}'`;
            // const scriptRes = await client.query(queryPredpar);
            // if (!scriptRes.rows[0].transform_launched) {
            //     const tPromises = [];
            //     messagesData.rows.forEach(async _row => {
            //         console.log('parse msg: ', _row.message_transform);
            //         // await this._transformLiveVideoComment(_row, sessionId)
            //         tPromises.push(this._transformLiveVideoComment(_row, sessionId));
            //     });
            //     await Promise.all(tPromises);
            //     await client.query(`UPDATE data.live_sessions SET transform_launched = null WHERE id='${sessionId}'`);
            // }


            // shell.exec(`pm2 delete ../BE/storeLocalJobs/jobStorePreParser.js --name "jobStorePreParser ${sessionId}"`, function(code, output) {
            // });

            // shell.exec(`pm2 delete ../BE/storeLocalJobs/jobStorePreParser.js --name "jobStorePreParser ${sessionId}"`, function(code, output) {
            // });

            // shell.exec(`pm2 start ../BE/storeLocalJobs/jobStorePreParser.js --name "jobStorePreParser ${sessionTestId}" -- sessionId=${sessionTestId}`, function(code, output) {
            // });
        } else {
            await client.query(`UPDATE data.live_sessions SET transform_launched = null WHERE id='${sessionId}'`);
            // shell.exec(`pm2 delete ../BE/storeLocalJobs/jobStorePreParserModel.js --name "jobStorePreParser ${sessionId}"`, function(code, output) {
            // });
        }

        return { success: true };
    }

    // async transformLiveComments(sessionId) {
    //     const client = await pool.connect();
    //     const msgQuery = `SELECT * FROM data.live_sessions_messages WHERE
    //         live_sessions_id='${sessionId}' AND transformed IS NULL AND parcer_status IS NULL
    //         ORDER BY created_at LIMIT 10`;
    //     const messagesData = await client.query(msgQuery);
    //     if (messagesData.rows.length > 0) {
    //         const tPromises = [];
    //         messagesData.rows.forEach(_row => {
    //             // tPromises.push(this._transformMessageNew(_row, sessionId));
    //         });
    //         await Promise.all(tPromises);
    //     } else {
    //         // shell.exec(`pm2 delete ../BE/storeLocalJobs/_jobStoreArrPreParser.js --name "jobStoreArrPreParser ${sessionId}"`, function(code, output) {
    //         // });
    //     }
    //
    //     return { success: true };
    // }




    async _transformMessageOld(fullMessage, sessionId) {
        const client = await pool.connect();
        fullMessage.from = {
            name: "Test without param",
            id: Math.floor(Date.now() / 1000)
        }
        const msgData = fullMessage.message.split(' ');
        let fParserData;

// console.log('msgData', msgData)
        const performedSizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        let _predparsedMessage, _pQuery, updMsgQuery, simpleWithoutAnyParam;
        if (msgData[0] !== 'sold' && msgData[0] !== 'vendu') {
            await client.query(`UPDATE data.live_sessions_messages SET
                    parcer_status = false,
                    transform_status = false
                WHERE
                    message_id = '${fullMessage.message_id}'`)
            // console.log(fullMessage.message, fullMessage.message_id);
        } else {
            const product  = await productModel.fetchSimpleProduct(msgData[1].trim());
            if (product?.product) {
                if (product.product.configured) {
                    // CONFIGURED PRODUCT
                    // Set color and size
                    if (!product.product.nocolor && !product.product.nosize) {
                        const _qty = msgData[4] ? msgData[4] : 1;

                        if (performedSizes.includes(msgData[3])) {
                            _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2] + ' s'+msgData[3] +' '+_qty;
                        } else if (performedSizes.includes(msgData[2])) {
                            _predparsedMessage = msgData[0]+' '+msgData[1]+' s'+msgData[2] + ' '+msgData[3] +' '+_qty;
                        }
                        else {
                            _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2] + ' '+msgData[3] +' '+_qty;
                        }

                        if (msgData[0].trim() === 'sold')
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6286,6288]));`;
                        else
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6296,6298]));`;
                        // const _parsedMsg = tmpParsedData.rows.find((_row) => _row.status === true);
                        // if (_parsedMsg) {
                        //     updMsgQuery = (`UPDATE data.live_sessions_messages SET
                        //         message = '${_predparsedMessage}',
                        //         transform_status = true,
                        //         parcer_status = true,
                        //         parcer_data = '${JSON.stringify(_parsedMsg.results_json)}'
                        //         WHERE message_id='${fullMessage.message_id}'`)
                        // } else {
                        //     updMsgQuery = (`UPDATE data.live_sessions_messages SET
                        //         message = '${_predparsedMessage}',
                        //         transform_status = true,
                        //         parcer_status = false,
                        //         parcer_data = '${JSON.stringify(_parsedMsg.results_json)}'
                        //         WHERE message_id='${fullMessage.message_id}'`)
                        // }
                        // await client.query(updMsgQuery);
                    } else if (product.product.nosize && !product.product.nocolor) {
// console.log('PRODUCT JUST COLOR');
                        const _qty = msgData[3] ? msgData[3] : 1;
                        _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2]  +' '+_qty;
                        if (msgData[0].trim() === 'sold')
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6290]));`;
                        else
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6300]));`;
                        // const tmpParsedData = await client.query(_pQuery);
                    } else {
                        const _qty = msgData[3] ? msgData[3] : 1;
                        if (performedSizes.includes(msgData[2])) {
                            _predparsedMessage = msgData[0]+' '+msgData[1]+' s'+msgData[2]  +' '+_qty;
                        }
                        else {
                            _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2]  +' '+_qty;
                        }
// console.log(_predparsedMessage);exit;
                        if (msgData[0].trim() === 'sold')
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6292]));`;
                        else
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6302]));`;
                    }
                    const tmpParsedData = await client.query(_pQuery);
                    const _parsedMsg = tmpParsedData.rows.find((_row) => _row.status === true);
                    if (_parsedMsg) {
                        updMsgQuery = (`UPDATE data.live_sessions_messages SET
                                message = '${_predparsedMessage}',
                                from_id = '${Math.floor(Date.now() / 1000)}',
                                from_name = 'NoFrom Param',
                                transform_status = true,
                                parcer_status = true,
                                parcer_data = '${JSON.stringify(_parsedMsg.results_json)}' 
                                WHERE message_id='${fullMessage.message_id}'`)
                    } else {
                        updMsgQuery = (`UPDATE data.live_sessions_messages SET
                                message = '${_predparsedMessage}',
                                transform_status = true,
                                from_id = '${Math.floor(Date.now() / 1000)}',
                                from_name = 'NoFrom Param',
                                parcer_status = false,  
                                parcer_data = '${JSON.stringify(_parsedMsg.results_json)}' 
                                WHERE message_id='${fullMessage.message_id}'`)
                    }
                    await client.query(updMsgQuery);
                } else {
                    // SIMPLE PRODUCT
                    let _qty = 1;
                    if (product.product.selectedColors.length > 0 && product.product.selectedSizes.length === 0) {
                        let _color;
                        // sold 246 black 2
                        // sold 246 black
                        // sold 246
                        if (msgData.length > 2) {
                            _color = msgData[2];
                            _qty = msgData[3] ? msgData[3] : 1;
                        } else {
                            _qty = 1;
                            _color = product.product.selectedColors[0].name;
                        }
                        _predparsedMessage = msgData[0]+' '+msgData[1]+' '+_color  +' '+_qty;
                        console.log('_predparsedMessage', _predparsedMessage);
                        console.log('SIMPLE JUST COLOR', _predparsedMessage);
                        if (msgData[0].trim() === 'sold')
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6290]));`;
                        else
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6300]));`;
                    } else if (product.product.selectedColors.length === 0 && product.product.selectedSizes.length > 0) {
                        let _size;
                        if (msgData.length === 4) {
                            _qty = msgData[3];
                            _size = performedSizes.includes(msgData[2]) ? 's'+msgData[2] : msgData[2];
                        } else if (msgData.length === 3) {
                            if (performedSizes.includes(msgData[2]) && product.product.selectedSizes[0].name === 's'+msgData[2]) {
                                _size = product.product.selectedSizes[0].name;
                                _qty = 1;
                            } else if (performedSizes.includes(msgData[2]) && product.product.selectedSizes[0].name !== 's'+msgData[2]) {
                                _size = product.product.selectedSizes[0].name;
                                _qty = msgData[2];
                            }
                        } else {
                            _qty = 1;
                            _size = product.product.selectedSizes[0].name;
                        }
                        _predparsedMessage = msgData[0]+' '+msgData[1]+' '+(_size ? _size : product.product.selectedSizes[0].name) + ' '+_qty;
                        if (msgData[0].trim() === 'sold')
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6292]));`;
                        else
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6302]));`;
                    } else if (product.product.selectedColors.length > 0 && product.product.selectedSizes.length > 0) {
                        let _msgSize, _msgColor;
                        const _pColor = product.product.selectedColors[0].name;
                        const _pSize = product.product.selectedSizes[0].name;
                        if (msgData.length === 3) {
                            if (msgData[2] === _pSize || 's'+msgData[2] === _pSize) {
                                _msgSize = performedSizes.includes(msgData[2]) ? 's'+msgData[2] : msgData[2];
                                _msgColor = _pColor;
                            } else {
                                _msgColor = _pColor;
                                _msgSize = _pSize;
                                _qty = msgData[2];
                            }
                            _predparsedMessage = msgData[0]+' '+msgData[1]+' '+ _msgColor + ' '+_msgSize +  ' '+_qty;
                        } else if (msgData.length === 4) {
                            const _tmpSize1 = msgData[2];
                            const _tmpSize2 = msgData[3];

                            if (_pSize === _tmpSize1 || _pSize === 's'+_tmpSize1) {
                                _msgSize = performedSizes.includes(_tmpSize1) ? 's'+_tmpSize1 : _tmpSize1;
                                _msgColor = msgData[3] ? msgData[3] : _pColor;
                            } else {
                                _msgSize = _msgColor = msgData[3] ? msgData[3] : _pSize;
                                _msgColor = _msgColor = msgData[2] ? msgData[2] : _pColor;
                                _msgSize = performedSizes.includes(_msgSize) ? 's'+_msgSize : _msgSize;
                            }

                            _predparsedMessage = msgData[0]+' '+msgData[1]+' '+ _msgColor + ' '+_msgSize +  ' '+_qty;
                        } else {
                            _predparsedMessage = msgData[0]+' '+msgData[1]+' '+ _pColor + ' '+_pSize +  ' '+_qty;
                        }
                        if (msgData[0].trim() === 'sold')
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6286,6292]));`;
                        else
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6302,6302]));`;
                    } else if (product.product.selectedColors.length === 0 && product.product.selectedSizes.length === 0) {
                        _predparsedMessage = msgData[0]+' '+msgData[1]+  ' '+_qty;
                        simpleWithoutAnyParam = true;
                        if (msgData[0].trim() === 'sold')
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6286,6292]));`;
                        else
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6302,6302]));`;
                    }

                    const tmpParsedData = await client.query(_pQuery);
                    let _parsedMsg = tmpParsedData.rows.find((_row) => _row.status === true);
                    if (_parsedMsg) {
                        updMsgQuery = (`UPDATE data.live_sessions_messages SET
                                message = '${_predparsedMessage}',
                                from_id = '${Math.floor(Date.now() / 1000)}',
                                from_name = 'NoFrom Param',
                                transform_status = true,
                                parcer_status = true,
                                parcer_data = '${JSON.stringify(_parsedMsg.results_json)}' 
                                WHERE message_id='${fullMessage.message_id}'`)
                    } else {
                        if (simpleWithoutAnyParam) {
// console.log('Quantity', _qty);
                            // {"status":true,"sold":true,"item":216,"color":"red","color_id":1,"size":"s2","size_id":101,"quantity":1}
                            updMsgQuery = (`UPDATE data.live_sessions_messages SET
                                message = '${_predparsedMessage}',
                                from_id = '${Math.floor(Date.now() / 1000)}',
                                from_name = 'NoFrom Param',
                                transform_status = true,
                                parcer_status = true,  
                                parcer_data = '${JSON.stringify({"status" : true, "vendu" : true, "item" : product.product.id, "quantity" : _qty})}' 
                                WHERE message_id='${fullMessage.message_id}'`);
                        } else {
                            if (msgData[0] === 'sold') {
                                fParserData = {"status" : false, "sold" : null, "item" : null, "quantity" : null};
                            } else {
                                fParserData = {"status" : false, "vendu" : null, "item" : null, "quantity" : null}
                            }

                            updMsgQuery = (`UPDATE data.live_sessions_messages SET
                                message = '${fullMessage.message}',
                                from_id = '${Math.floor(Date.now() / 1000)}',
                                from_name = 'NoFrom Param',
                                transform_status = true,
                                parcer_status = true,  
                                parcer_data = '${JSON.stringify(fParserData)}' 
                                WHERE message_id='${fullMessage.message_id}'`);
                        }
                    }
                    await client.query(updMsgQuery);
                }

            } else {
                if (msgData[0] === 'sold') {
                    fParserData = {"status" : false, "sold" : null, "item" : null, "quantity" : null};
                } else {
                    fParserData = {"status" : false, "vendu" : null, "item" : null, "quantity" : null}
                }

                updMsgQuery = `UPDATE data.live_sessions_messages SET
                                message = '${fullMessage.message}',
                                from_id = '${Math.floor(Date.now() / 1000)}',
                                from_name = 'NoFrom Param',
                                transform_status = true,
                                parcer_status = true,  
                                parcer_data = '${JSON.stringify(fParserData)}' 
                                WHERE message_id='${fullMessage.message_id}'`;
                await client.query(updMsgQuery);
            }
        }
    }



    async _transformMessage(fullMessage, sessionId) {
        const client = await pool.connect();
        fullMessage.from = {
            name: "Test without param",
            id: Math.floor(Date.now() / 1000)
        }
        const msgData = fullMessage.message.split(' ');
// console.log(fullMessage);
        let fParserData;
// console.log(`SELECT transform_status, parcer_status FROM data.live_sessions_messages WHERE message_id='${fullMessage.message_id}'`);
        const msgSaved = await client.query(`SELECT transform_status, parcer_status FROM data.live_sessions_messages WHERE message_id='${fullMessage.message_id}'`);
        if (msgSaved.rows.length > 0) {
            if (msgSaved.rows[0].parcer_status === null) {
                const performedSizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
                let _predparsedMessage, _pQuery, updMsgQuery, simpleWithoutAnyParam;
                if (msgData[0] !== 'sold' && msgData[0] !== 'vendu') {
                    await client.query(`UPDATE data.live_sessions_messages SET
                        parcer_status = false,
                        transform_status = false
                        WHERE
                            message_id = '${fullMessage.id}'`)
                } else {
                    const product  = await productModel.fetchSimpleProduct(msgData[1].trim());
                    if (product?.product) {
                        if (product.product.configured) {
                            // CONFIGURED PRODUCT
                            if (!product.product.nocolor && !product.product.nosize) { // Color and size
                                const _qty = msgData[4] ? msgData[4] : 1;
                                if (performedSizes.includes(msgData[3])) {
                                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2] + ' s'+msgData[3] +' '+_qty;
                                } else if (performedSizes.includes(msgData[2])) {
                                    _predparsedMessage = msgData[0]+' '+msgData[1]+' s'+msgData[2] + ' '+msgData[3] +' '+_qty;
                                }
                                else {
                                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2] + ' '+msgData[3] +' '+_qty;
                                }
                            } else if (product.product.nosize && !product.product.nocolor) { // Size no color
                                const _qty = msgData[3] ? msgData[3] : 1;
                                _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2]  +' '+_qty;
                            } else { // Color no size
                                const _qty = msgData[3] ? msgData[3] : 1;
                                if (performedSizes.includes(msgData[2])) {
                                    _predparsedMessage = msgData[0]+' '+msgData[1]+' s'+msgData[2]  +' '+_qty;
                                }
                                else {
                                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2]  +' '+_qty;
                                }
                            }
                            updMsgQuery = (`UPDATE data.live_sessions_messages SET
                                message = '${_predparsedMessage}',
                                from_id = '${Math.floor(Date.now() / 1000)}',
                                from_name = 'NoFrom Param',
                                transform_status = true
                                WHERE message_id='${fullMessage.message_id}'`);
                            // console.log(updMsgQuery);
                            await client.query(updMsgQuery);
                        } else {
                            // SIMPLE PRODUCT
// console.log('MESSAGE', fullMessage);
                            let _qty = 1;
                            if (product.product.selectedColors.length > 0 && product.product.selectedSizes.length === 0) {
                                let _color;
                                if (parseInt(msgData[2])) {
                                    _qty = msgData[2];
                                    _color = msgData[0] === 'sold' ? product.product.selectedColors[0].name : product.product.selectedColors[0].translations[0].fr.name;
                                } else {
                                    _color = msgData[2];
                                    _qty = msgData[3] ? msgData[3] : 1;
                                }
                                _predparsedMessage = msgData[0]+' '+msgData[1]+' '+_color  +' '+_qty;
                            } else if (product.product.selectedColors.length === 0 && product.product.selectedSizes.length > 0) {
                                let _size;
                                if (msgData.length === 4) {
                                    _qty = msgData[3];
                                    _size = performedSizes.includes(msgData[2]) ? 's'+msgData[2] : msgData[2];
                                } else if (msgData.length === 3) {
                                    if (performedSizes.includes(msgData[2]) && product.product.selectedSizes[0].name === 's'+msgData[2]) {
                                        _size = product.product.selectedSizes[0].name;
                                        _qty = 1;
                                    } else if (performedSizes.includes(msgData[2]) && product.product.selectedSizes[0].name !== 's'+msgData[2]) {
                                        _size = product.product.selectedSizes[0].name;
                                        _qty = msgData[2];
                                    }
                                } else {
                                    _qty = 1;
                                    _size = product.product.selectedSizes[0].name;
                                }
                                _predparsedMessage = msgData[0]+' '+msgData[1]+' '+(_size ? _size : product.product.selectedSizes[0].name) + ' '+_qty;
                            } else if (product.product.selectedColors.length > 0 && product.product.selectedSizes.length > 0) {
                                let _msgSize, _msgColor;
                                const _pColor = product.product.selectedColors[0].name;
                                const _pSize = product.product.selectedSizes[0].name;

                                if (msgData.length === 3) {
                                    if (msgData[2] === _pSize || 's'+msgData[2] === _pSize) {
                                        _msgSize = performedSizes.includes(msgData[2]) ? 's'+msgData[2] : msgData[2];
                                        _msgColor = _pColor;
                                    } else {
                                        _msgColor = _pColor;
                                        _msgSize = _pSize;
                                        _qty = msgData[2];
                                    }
                                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+ _msgColor + ' '+_msgSize +  ' '+_qty;
                                } else if (msgData.length === 4) {
                                    const _tmpSize1 = msgData[2];
                                    const _tmpSize2 = msgData[3];

                                    if (_pSize === _tmpSize1 || _pSize === 's'+_tmpSize1) {
                                        _msgSize = performedSizes.includes(_tmpSize1) ? 's'+_tmpSize1 : _tmpSize1;
                                        _msgColor = msgData[3] ? msgData[3] : _pColor;
                                    } else {
                                        _msgSize = _msgColor = msgData[3] ? msgData[3] : _pSize;
                                        _msgColor = _msgColor = msgData[2] ? msgData[2] : _pColor;
                                        _msgSize = performedSizes.includes(_msgSize) ? 's'+_msgSize : _msgSize;
                                    }

                                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+ _msgColor + ' '+_msgSize +  ' '+_qty;
                                } else {
                                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+ _pColor + ' '+_pSize +  ' '+_qty;
                                }
                            } else if (product.product.selectedColors.length === 0 && product.product.selectedSizes.length === 0) {
                                _qty = msgData[2] ? msgData[2] : 1;
                                _predparsedMessage = (msgData[0] === 'sold' ? 'simplify' : 'simplifier')+' '+msgData[1]+  ' '+_qty;
                            }
                            updMsgQuery = (`UPDATE data.live_sessions_messages SET
                                message = '${_predparsedMessage}',
                                from_id = '${Math.floor(Date.now() / 1000)}',
                                from_name = 'NoFrom Param',
                                transform_status = true
                                WHERE message_id='${fullMessage.message_id}'`);
                            // console.log(updMsgQuery);
                            await client.query(updMsgQuery);
                        }

                    } else {
                        updMsgQuery = (`UPDATE data.live_sessions_messages SET
                                message = '${fullMessage.message}',
                                from_id = '${Math.floor(Date.now() / 1000)}',
                                from_name = 'NoFrom Param',
                                transform_status = true
                                WHERE message_id='${fullMessage.message_id}'`);
                        await client.query(updMsgQuery);
                    }
                }
            }
        }

    }


    async _performMessageNew(fullMessage, sessionId, msgData) {
        const client = await pool.connect();
        let _predparsedMessage;
        let _pQuery;
        let performedData = [];
        let updMessage;
        let lng = 'fr';
        const performedSizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        if (msgData[0] === 'sold') {
            lng = 'fr';
        }
// console.log('fullMessage', fullMessage.message);
        await client.query(`UPDATE data.live_sessions SET lates_comment_time='${fullMessage.created_time}' WHERE id='${sessionId}'`);
        fullMessage.from = {
            name: "Kyryl Proshop",
            id: "6681200108589867"
        }
        const product = await this._findProductData(msgData[1]);
        updMessage = {
            created_time: fullMessage.created_time,
            from: fullMessage.from,
            message: null,
            id: fullMessage.id,
            parcer_status: null,
            parcer_data: null
        }
        if (product) {
            if (product.configured) {
                let tColor, tSize, tColorId, tSizeId;
                if (msgData[0] === 'sold') {
                    tColor = product.selectedColors[0] ? product.selectedColors[0].name : null;
                    tSize = product.selectedSizes[0] ? product.selectedSizes[0].name : null;
                    tColorId = product.selectedColors[0] ? product.selectedColors[0].id : null;
                    tSizeId = product.selectedSizes[0] ? product.selectedSizes[0].id : null;
                } else {
                    tColor = product.selectedColors[0] ? product.selectedColors[0].translations[0].fr.name : null;
                    tSize = product.selectedSizes[0] ? product.selectedSizes[0].name : null;
                    tColorId = product.selectedColors[0] ? product.selectedColors[0].id : null;
                    tSizeId = product.selectedSizes[0] ? product.selectedSizes[0].id : null;
                }
                if (product.nosize && !product.nocolor) {
                    const _qty = msgData[3] ? msgData[3] : 1;
                    // NO SIZE WITH COLOR
                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2] + ' '+_qty;
                    if (msgData[0] === 'sold')
                        _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6291,6290]));`;
                    else
                        _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6300,6301]));`;

                    const tmpParsedData = await client.query(_pQuery);
                    if (tmpParsedData.rows.length > 0) {
                        const _parsedMsg = tmpParsedData.rows.find((_row) => _row.status === true);
                        if (_parsedMsg) {
                            const _tmpJsonData = _parsedMsg.results_json;

                            _tmpJsonData.color = tColor;
                            _tmpJsonData.color_id = tColorId;
                            _tmpJsonData.size = tSize;
                            _tmpJsonData.size_id = tSizeId;
                            _tmpJsonData.qty = parseInt(_qty);
                            _tmpJsonData.quantity = parseInt(_qty);

                            updMessage.message = _predparsedMessage;
                            updMessage.parcer_status = true;
                            updMessage.parcer_data = _tmpJsonData;
                        }
                    }
                } else if (!product.nosize && product.nocolor) {
                    const _qty = msgData[3] ? msgData[3] : 1;
                    // NO COLOR WITH SIZE
                    _predparsedMessage = msgData[0]+' '+msgData[1]+' s'+msgData[2]+(msgData[3] ? ' '+msgData[3] : ' 1');
                    if (msgData[0] === 'sold')
                        _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6293,6302]));`;
                    else
                        _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6303,6302]));`;
console.log(_pQuery);
                    const tmpParsedData = await client.query(_pQuery);
                    if (tmpParsedData.rows.length > 0) {
                        const _parsedMsg = tmpParsedData.rows.find((_row) => _row.status === true);
console.log('_parsedMsg', _parsedMsg);
                        if (_parsedMsg) {
                            const _tmpJsonData = _parsedMsg.results_json;

                            _tmpJsonData.color = tColor;
                            _tmpJsonData.color_id = tColorId;
                            _tmpJsonData.size = tSize;
                            _tmpJsonData.size_id = tSizeId;
                            _tmpJsonData.qty = parseInt(_qty);
                            _tmpJsonData.quantity = parseInt(_qty);

                            updMessage.message = _predparsedMessage;
                            updMessage.parcer_status = true;
                            updMessage.parcer_data = _tmpJsonData;

                            // const insertMsg = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '[${JSON.stringify(updMessage).replaceAll("'", '')}]');`;
                            // await client.query(insertMsg);
                        }
                    }

                } else if (!product.nosize && !product.nocolor) {
                    const _qty = msgData[4] ? msgData[4] : 1;
                    if (performedSizes.includes(msgData[msgData[3]])) {
                        _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2] + ' s'+msgData[3] +' '+_qty;
                    } else {
                        _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[2] + ' '+msgData[3] +' '+_qty;
                    }
console.log(_predparsedMessage);
                    let tmpParsedData;let _parsedMsg;
                    // parsre scenario (buy/sold/vendu)+item+size+color+quantity
                    if (msgData[0] === 'sold')
                        _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6276,6277,6286,6287]));`;
                    else
                        _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6296,6297]));`;
                    tmpParsedData = await client.query(_pQuery);
                    let findByScenario = 0;
                    if (tmpParsedData.rows.length > 0) {
                        _parsedMsg = tmpParsedData.rows.find((_row) => _row.status === true);
console.log(_parsedMsg.results_json);
                        if (_parsedMsg) {
                            const _tmpJsonData = _parsedMsg.results_json;

                            _tmpJsonData.color = _parsedMsg.results_json.color;
                            _tmpJsonData.color_id = _parsedMsg.results_json.color_id;
                            _tmpJsonData.size = _parsedMsg.results_json.size;
                            _tmpJsonData.size_id = _parsedMsg.results_json.size_id;
                            _tmpJsonData.qty = parseInt(_qty);
                            _tmpJsonData.quantity = parseInt(_qty);

                            updMessage.message = _predparsedMessage;
                            updMessage.parcer_status = true;
                            updMessage.parcer_data = _tmpJsonData;
                            findByScenario = 1;
                        }
                    }
                    if (findByScenario !== 1) {
                        _predparsedMessage = msgData[0]+' '+msgData[1]+' s'+msgData[2] + ' '+msgData[3] +' '+_qty;
                        if (msgData[0] === 'sold')
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6278,6279,6288,6289]));`;
                        else
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6298,6299]));`;

                        tmpParsedData = await client.query(_pQuery);
                        if (tmpParsedData.rows.length > 0) {
                            _parsedMsg = tmpParsedData.rows.find((_row) => _row.status === true);
                            if (_parsedMsg) {
                                const _tmpJsonData = _parsedMsg.results_json;

                                _tmpJsonData.color = tColor;
                                _tmpJsonData.color_id = tColorId;
                                _tmpJsonData.size = tSize;
                                _tmpJsonData.size_id = tSizeId;
                                _tmpJsonData.qty = parseInt(_qty);
                                _tmpJsonData.quantity = parseInt(_qty);

                                updMessage.message = _predparsedMessage;
                                updMessage.parcer_status = true;
                                updMessage.parcer_data = _tmpJsonData;
                            }
                        }
                    }
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
                    _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6286,6291,6296,6301]));`;
                } else if (product.selectedColors.length === 0 && product.selectedSizes.length > 0) {
                    if (parseInt(msgData[2])) {
                        _qty = parseInt(msgData[2]);
                    }
                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+product.selectedSizes[0].name + ' '+_qty;
                    _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6292,6302]));`;
                } else if (product.selectedColors.length > 0 && product.selectedSizes.length > 0) {
                    if (msgData[2]) {
                        _qty = parseInt(msgData[2]);
                    }
                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+_qty;
                    _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6294,6304]));`;
                } else {
                    _predparsedMessage = msgData[0]+' '+msgData[1]+' '+_qty;
                    _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6295,6305]));`;
                }
                const tmpParsedData = await client.query(_pQuery);
                if (tmpParsedData.rows.length > 0) {
                    const _parsedMsg = tmpParsedData.rows.find((_row) => _row.status === true);
                    if (_parsedMsg) {
                        const _tmpJsonData = _parsedMsg.results_json;

                        let tColor, tSize, tColorId, tSizeId;
                        tColor = product.selectedColors[0] ? product.selectedColors[0].name : null;
                        tSize = product.selectedSizes[0] ? product.selectedSizes[0].name : null;
                        if (lng === 'fr') {
                            if (product.selectedColors.length) {
                                if (product.selectedColors[0].translations) {
                                    tColor = product.selectedColors[0].translations[0].fr.name;
                                }
                            }
                        }
                        tColorId = product.selectedColors[0] ? product.selectedColors[0].id : null;
                        tSizeId = product.selectedSizes[0] ? product.selectedSizes[0].id : null;
                        _tmpJsonData.color = tColor;
                        _tmpJsonData.color_id = tColorId;
                        _tmpJsonData.size = tSize;
                        _tmpJsonData.size_id = tSizeId;

                        updMessage.message = _predparsedMessage;
                        updMessage.parcer_status = true;
                        updMessage.parcer_data = _tmpJsonData;
                    }
                }

            }
            if (updMessage.parcer_data) {
console.log('updMessage', updMessage);
                const insertMsg = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '[${JSON.stringify(updMessage).replaceAll("'", '')}]');`;
                await client.query(insertMsg);

            }
        } else {
            const insertMsg = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '[${JSON.stringify(updMessage).replaceAll("'", '')}]');`;
            await client.query(insertMsg);
        }

        return performedData;

    }

    async addMessagesNewParserOld(sessionId, data) {
        const client = await pool.connect();
        if (data?.paging?.next) {
            await client.query(`UPDATE data.live_sessions SET url_api_next='${data.paging.next}' WHERE id='${sessionId}'`);
        }
        const withFromComments = [];
        const arrIds = [];
        let confProductColorConfigIds = [];
        let confProductSizeConfigIds = [];
        let confProductFullConfIds = [];
        const usrSessionQ = `SELECT user_id FROM data.live_sessions WHERE id=${sessionId}`;
        const usrRes = await client.query(usrSessionQ);
        if (data?.data?.length > 0) {
            const filteredMessages = data.data.filter(x => ((x.message.toLowerCase().match(/(sold|vendu)\s[0-9]/g))));
console.log('FILTERED:', filteredMessages);
            if (filteredMessages.length === 0) {
                return {error: null};
            } else {
                filteredMessages.forEach(async _comment => {
                    let commentData = _comment.message.split(' ');
                    // console.log(_comment.message)
                    if (parseInt(commentData[1]) > 0) {
                        arrIds.push(commentData[1]);
                    }
                })
console.log('product IDS', arrIds);exit;
                return {error: null};
            }
            data.data.forEach(async _comment => {
                let commentData = _comment.message.split(' ');
                // console.log(_comment.message)
                if (parseInt(commentData[1]) > 0) {
                    arrIds.push(commentData[1]);
                }
            });
            if (arrIds.length > 0) {
                // config just color
                const pQueryColorFull = `SELECT ARRAY_AGG(id) AS conf_ids FROM data.products WHERE configured = true 
                    AND (nocolor IS NULL AND nosize IS NOT NULL)
                    AND user_id='${usrRes.rows[0].user_id}'
                    AND id IN (${arrIds.join(',')})`;
                const confColorProdIdsRes = await client.query(pQueryColorFull);
                if (confColorProdIdsRes.rows[0].conf_ids) {
                    confProductColorConfigIds = confColorProdIdsRes.rows[0].conf_ids;
                }
                // config just size
                const pQuerySizeFull = `SELECT ARRAY_AGG(id) AS conf_ids FROM data.products WHERE configured = true 
                    AND (nosize IS NULL AND nocolor IS NOT NULL)
                    AND user_id='${usrRes.rows[0].user_id}'
                    AND id IN (${arrIds.join(',')})`;
                const confSizeProdIdsRes = await client.query(pQuerySizeFull);
                if (confSizeProdIdsRes.rows[0].conf_ids) {
                    confProductSizeConfigIds = confSizeProdIdsRes.rows[0].conf_ids;
                }
                // full config
                const pQueryFull = `SELECT ARRAY_AGG(id) AS conf_ids FROM data.products WHERE configured = true 
                    AND (nocolor IS NULL AND nosize IS NULL)
                    AND user_id='${usrRes.rows[0].user_id}'
                    AND id IN (${arrIds.join(',')})`;
                const confProdFullIdsRes = await client.query(pQueryFull);
                if (confProdFullIdsRes.rows[0].conf_ids) {
                    confProductFullConfIds = confProdFullIdsRes.rows[0].conf_ids;
                }
            }
// console.log('confProductColorConfigIds', confProductColorConfigIds);
// console.log('confProductSizeConfigIds', confProductSizeConfigIds);
// console.log('confProductFullConfIds', confProductFullConfIds);
// exit;
            // data.data.forEach(async _comment => {
            //     let commentData = _comment.message.split(' ');
            //     let newMsg = '';
            //     if (confProductColorConfigIds.includes(parseInt(commentData[1]))) {
            //         newMsg = _comment.message + ' 1';
            //         _comment.configured_color = true;
            //     } else if (confProductSizeConfigIds.includes(parseInt(commentData[1]))) {
            //         newMsg = _comment.message + ' 1';
            //         _comment.configured_size = true;
            //     }  else if (confProductFullConfIds.includes(parseInt(commentData[1]))) {
            //         newMsg = _comment.message + ' 1';
            //         _comment.configured_full = true;
            //     }
            //     else {
            //         newMsg = _comment.message + ' 1';
            //         _comment.no_config = true;
            //     }
            //     // setup from parameters
            //     if (!_comment.from) {
            //         const commId = _comment.id.split('_')
            //         _comment.from = {
            //             name: "NO FROM PARAM",
            //             id: commId[1]
            //         }
            //     }
            //     _comment.message = newMsg;
            //     withFromComments.push(_comment);
            // })
        }
        if (withFromComments.length === 0) {
            return;
        }
        const commentQuery = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '${JSON.stringify(withFromComments).replaceAll("'", '')}');`;
console.log(commentQuery);
        const msgIds = [];
        try {

            await client.query(commentQuery);
            // await chatbotMessageModel.updateNoValidMessages(sessionId);
            // shell.exec(`pm2 start ../BE/storeLocalJobs/jobStorePreParserModel.js --name "jobStorePreParser ${sessionId}" -- sessionId=${sessionId} ids=${JSON.stringify([])}`, function(code, output) {
            // });
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


    async addMessagesNewParser(sessionId, data) {
        const client = await pool.connect();
        try {
            if (data?.paging?.next) {
                await client.query(`UPDATE data.live_sessions SET url_api_next='${data.paging.next}' WHERE id='${sessionId}'`);
            }
            const withFromComments = [];
            const arrIds = [];
            let confProductColorConfigIds = [];
            let confProductSizeConfigIds = [];
            let confProductFullConfIds = [];
            const usrSessionQ = `SELECT user_id FROM data.live_sessions WHERE id=${sessionId}`;
            const usrRes = await client.query(usrSessionQ);
            if (data?.data?.length > 0) {
                const filteredMessages = data.data.filter(x => ((x.message.toLowerCase().match(/(sold|vendu)\s[0-9]/g))));
                if (filteredMessages?.length > 0) {
// console.log('Filter', filteredMessages);exit;
                    filteredMessages.forEach(async _comment => {
                        let commentData = _comment.message.split(' ');
                        if (parseInt(commentData[1]) > 0) {
                            arrIds.push(commentData[1]);
                        }
                    });
// console.log('arrIds', arrIds);
                    if (arrIds.length > 0) {
                        // config just color
                        const pQueryColorFull = `SELECT ARRAY_AGG(id) AS conf_ids FROM data.products WHERE configured = true 
                            AND (nocolor IS NULL AND nosize IS NOT NULL)
                            AND id IN (${arrIds.join(',')})`;

                        const confColorProdIdsRes = await client.query(pQueryColorFull);
                        if (confColorProdIdsRes.rows[0].conf_ids) {
                            confProductColorConfigIds = confColorProdIdsRes.rows[0].conf_ids;
                        }
                        // config just size
                        const pQuerySizeFull = `SELECT ARRAY_AGG(id) AS conf_ids FROM data.products WHERE configured = true 
                            AND (nosize IS NULL AND nocolor IS NOT NULL)
                            AND user_id='${usrRes.rows[0].user_id}'
                            AND id IN (${arrIds.join(',')})`;
                        const confSizeProdIdsRes = await client.query(pQuerySizeFull);
                        if (confSizeProdIdsRes.rows[0].conf_ids) {
                            confProductSizeConfigIds = confSizeProdIdsRes.rows[0].conf_ids;
                        }
                        // full config
                        const pQueryFull = `SELECT ARRAY_AGG(id) AS conf_ids FROM data.products WHERE configured = true 
                            AND (nocolor IS NULL AND nosize IS NULL)
                            AND user_id='${usrRes.rows[0].user_id}'
                            AND id IN (${arrIds.join(',')})`;
                        const confProdFullIdsRes = await client.query(pQueryFull);
                        if (confProdFullIdsRes.rows[0].conf_ids) {
                            confProductFullConfIds = confProdFullIdsRes.rows[0].conf_ids;
                        }
                        filteredMessages.forEach(async _comment => {
                            let commentData = _comment.message.split(' ');
                            let newMsg = '';
                            if (confProductColorConfigIds.includes(parseInt(commentData[1]))) {
                                newMsg = _comment.message + ' 1';
                                _comment.configured_color = true;
                            } else if (confProductSizeConfigIds.includes(parseInt(commentData[1]))) {
                                newMsg = _comment.message + ' 1';
                                _comment.configured_size = true;
                            }  else if (confProductFullConfIds.includes(parseInt(commentData[1]))) {
                                newMsg = _comment.message + ' 1';
                                _comment.configured_full = true;
                            }
                            else {
                                newMsg = _comment.message + ' 1';
                                _comment.no_config = true;
                            }
                            // setup from parameters
                            if (!_comment.from) {
                                const commId = _comment.id.split('_')
                                _comment.from = {
                                    name: "EMPTY_FROM",
                                    id: commId[1]
                                }
                            }
                            _comment.message = newMsg;
                            withFromComments.push(_comment);
                        })
console.log(withFromComments);
                        const commentQuery = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '${JSON.stringify(withFromComments).replaceAll("'", '')}');`;
                        await client.query(commentQuery);

                        const items = [];
                        const error = null;

                        return {
                            items,
                            error
                        };
                    }

                }
            }
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

    async addMessagesNew(sessionId, data) {
        const client = await pool.connect();
        if (data?.paging?.next) {
            await client.query(`UPDATE data.live_sessions SET url_api_next='${data.paging.next}' WHERE id='${sessionId}'`);
        }
        const withFromComments = []
        if (data?.data?.length > 0) {
            data.data.forEach(async _comment => {
                if (!_comment.from) {
                    const commId = _comment.id.split('_')
                    _comment.from = {
                        name: "NO FROM PARAM",
                        id: commId[1]
                    }
                }
                withFromComments.push(_comment);
            })
        }
// console.log('COMENTS DATA', withFromComments)
        const commentQuery = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '${JSON.stringify(withFromComments).replaceAll("'", '')}');`;

        const msgIds = [];
        try {

            await client.query(commentQuery);
            // await chatbotMessageModel.updateNoValidMessages(sessionId);
            // shell.exec(`pm2 start ../BE/storeLocalJobs/jobStorePreParserModel.js --name "jobStorePreParser ${sessionId}" -- sessionId=${sessionId} ids=${JSON.stringify([])}`, function(code, output) {
            // });
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



    async addMessagesTest(sessionId, messagesData) {
        // const client = await pool.connect();
        const data = [
            // {
            //     "created_time": "2024-10-28T16:25:12+0000",
            //     "from": {
            //         "name": "Kyryl Proshop",
            //         "id": "6681200108589867"
            //     },
            //     "message": "vendu 220 Noir 1",
            //     "id": "2255695475472325_563802552787588"
            // },
            {
                "created_time": "2024-10-28T16:25:12+0000",
                "from": {
                    "name": "Kyryl Proshop",
                    "id": "6681200108589867"
                },
                // "message": "sold 193 7",
                "message": "sold 225 9",
                "id": "7855698875552325_563802062787512"
            },
            // {
            //     "created_time": "2024-10-28T16:25:12+0000",
            //     "from": {
            //         "name": "Kyryl Proshop",
            //         "id": "6681200108589867"
            //     },
            //     "message": "sold 190 red 3",
            //     // "message": "vendu 190 rouge 3",
            //     "id": "9849090075472325_563802062787512"
            // },

            // SIMPLE MESSAGES
            // {
            //     "created_time": "2024-10-28T16:25:12+0000",
            //     "from": {
            //         "name": "Kyryl Proshop",
            //         "id": "6681200108589867"
            //     },
            //     "message": "sold 216",
            //     "id": "1119695475472325_563802062787510"
            // },
            // {
            //     "created_time": "2024-10-28T16:25:12+0000",
            //     "from": {
            //         "name": "Kyryl Proshop",
            //         "id": "6681200108589867"
            //     },
            //     "message": "vendu 217 red 1",
            //     "id": "2249695475472325_563802062787510"
            // },
            // {
            //     "created_time": "2024-10-28T16:25:12+0000",
            //     "from": {
            //         "name": "Kyryl Proshop",
            //         "id": "6681200108589867"
            //     },
            //     "message": "vendu 196 3",
            //     "id": "3349795475472325_563802062787510"
            // },
        ];
console.log('MESSAGES', messagesData);
        const tPromises = [];
        messagesData.forEach(_data => {
            const msgData = _data.message.split(' ');
            tPromises.push(this._performMessageNew(_data, sessionId, msgData));
        })
        // data.forEach(_data => {
        //     tPromises.push(this.performMessage(_data, sessionId));
        // })
        await Promise.all(tPromises);
        const items = [];
        const error = null;

        return {success: true, error: null};
    }

    
    async addMessages(sessionId, data) {
        const client = await pool.connect();
        try {
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
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (chatbot messages addMessages):',
                    { message: e.message }
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


        const commentQuery = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '${JSON.stringify(data).replaceAll("'", '')}');`;
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
        // const _tProduct = await client.query(`SELECT nosize, nocolor, configured  FROM data.products WHERE id=${productId}`);
        // if (!_tProduct.rows[0].configured) {
        //     const _xx = await productModel.fetchSimpleProduct(productId);
        //     return _xx.product;
        // }
        const _xx = await productModel.fetchSimpleProduct(productId);
        return _xx.product;

        return _tProduct.rows[0];
    }

    async parseMessagesNew(sessionId) {
        const client = await pool.connect();
        try {
console.log('HERE', sessionId);
            const parcerQuerySimple = `SELECT * FROM data.set_live_sessions_messages_parcer_simple_data(${sessionId}, 100);`;
            const parcerQueryPartColorConf = `SELECT * FROM data.set_live_sessions_messages_parcer_colorconf_data(${sessionId}, 100);`;
            const parcerQueryPartSizeConf = `SELECT * FROM data.set_live_sessions_messages_parcer_sizeconf_data(${sessionId}, 100);`;
            const parcerQueryFullConf = `SELECT * FROM data.set_live_sessions_messages_parcer_fullconf_data(${sessionId}, 100);`;
console.log('===SIMPLE PROD PARCER===')
console.log(parcerQuerySimple)
console.log('===SIMPLE PROD PART COLOR PARCER===')
console.log(parcerQueryPartColorConf)
console.log('===SIMPLE PROD PART SIZE PARCER===')
console.log(parcerQueryPartSizeConf)
console.log('===SIMPLE PROD FULL PARCER===')
console.log(parcerQueryFullConf)
            await client.query(parcerQuerySimple);
            await client.query(parcerQueryPartColorConf);
            await client.query(parcerQueryPartSizeConf);
            await client.query(parcerQueryFullConf);
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

    async parseMessages(sessionId) {
        const client = await pool.connect();
        try {
            const parcerQuery = `SELECT * FROM data.set_live_sessions_messages_parcer_data(${sessionId}, 100);`;
            const parcerQueryConf = `SELECT * FROM data.set_live_sessions_messages_parcer_config_data(${sessionId}, 100);`;
// console.log('PARCER QUERY', parcerQuery);
            await client.query(parcerQuery);
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
                    dss.free_shipping_to, us.access_token
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
// console.log(productQueryNew);
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
