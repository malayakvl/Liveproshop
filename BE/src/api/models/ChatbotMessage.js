import pool from './connect.js';
import { logger } from '../../common/logger.js';
import moment from 'moment';
import orderModel from "./Order.js";
import productModel from "./Product.js";

class ChatbotMessage {
    async messagesSinceDate(sessionId) {
        const client = await pool.connect();
        const commentQuery = `SELECT lates_comment_time AS created_time 
            FROM data.live_sessions WHERE id = '${sessionId}';`;
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
    async transformMessages(sessionId) {
console.log('Session Id', sessionId)
        // if (parseInt(sessionId) === 750) sessionId = 68;
        const client = await pool.connect();
        const updNotValidMsgs = `UPDATE data.live_sessions_messages SET parcer_status = false and transform_status = false 
                                        WHERE live_sessions_id='${sessionId}' AND 
                                            message NOT LIKE '%sold%' AND message NOT LIKE '%vendu%' 
                                            AND (parcer_status IS NULL AND transform_status IS NULL); `;
console.log(updNotValidMsgs);
        await client.query(updNotValidMsgs);
        const messagesData = await client.query(`SELECT * FROM data.live_sessions_messages WHERE
            live_sessions_id='${sessionId}' AND transform_status IS NULL AND parcer_status IS NULL 
            ORDER BY created_at LIMIT 50 `);
        const tPromises = [];
        if (messagesData.rows.length > 0) {
            messagesData.rows.forEach(row => {
                tPromises.push(this._transformMessage(row, sessionId));
            });
            await Promise.all(tPromises);
        }
        // const items = [];
        // const error = null;

        return {success: true, error: null};
    }


    async _transformMessage(fullMessage, sessionId) {
        const client = await pool.connect();
        fullMessage.from = {
            name: "Test without param",
            id: "88888888"
        }
        const msgData = fullMessage.message.split(' ');
        let fParserData;

        console.log('msgData', msgData)
        const performedSizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        let _predparsedMessage, _pQuery, updMsgQuery, simpleWithoutAnyParam;
        if (msgData[0] !== 'sold' && msgData[0] !== 'vendu') {
            // await client.query(`UPDATE data.live_sessions_messages SET
            //         parcer_status = false,
            //         transform_status = false
            //     WHERE
            //         message_id = '${fullMessage.message_id}'`)
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
                                from_id = '88888888',
                                from_name = 'NoFrom Param',
                                transform_status = true,
                                parcer_status = true,
                                parcer_data = '${JSON.stringify(_parsedMsg.results_json)}' 
                                WHERE message_id='${fullMessage.message_id}'`)
                    } else {
                        updMsgQuery = (`UPDATE data.live_sessions_messages SET
                                message = '${_predparsedMessage}',
                                transform_status = true,
                                from_id = '88888888',
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
                        if (parseInt(msgData[2])) {
                            _qty = parseInt(msgData[2]);
                        }
                        if (parseInt(msgData[3])) {
                            _qty = parseInt(msgData[3]);
                        }
                        if (performedSizes.includes(msgData[3])) {
                            _predparsedMessage = msgData[0]+' '+msgData[1]+' s'+msgData[3]  +' '+_qty;
                        }
                        else {
                            _predparsedMessage = msgData[0]+' '+msgData[1]+' '+msgData[3]  +' '+_qty;
                        }
// console.log(msgData);
                        _predparsedMessage = msgData[0]+' '+msgData[1]+' '+(msgData[2] ? msgData[2] : product.product.selectedColors[0].name) + ' '+_qty;
console.log('SIMPLE JUST COLOR', _predparsedMessage);
// exit;
                        if (msgData[0].trim() === 'sold')
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6290]));`;
                        else
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6302]));`;
                    } else if (product.product.selectedColors.length === 0 && product.product.selectedSizes.length > 0) {
                        let _size;let _sizeId;
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
// console.log('SIZE NAME', product.product.selectedSizes[0].name);
// console.log('SIZE LENGTH', msgData.length);
// console.log('_predparsed', _predparsedMessage);
// exit;
                        if (msgData[0].trim() === 'sold')
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6292]));`;
                        else
                            _pQuery = `SELECT * FROM data.chatbot_parcer('${_predparsedMessage}', data.get_chatbot_scenarios_keywords_regular(ARRAY[6302]));`;
console.log('SIMPLE JUST SIZE', _predparsedMessage);
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
console.log('SIMPLE SIZE/COLOR', _predparsedMessage);

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
                                from_id = '88888888',
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
                                from_id = '88888888',
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
                                from_id = '88888888',
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
                                from_id = '88888888',
                                from_name = 'NoFrom Param',
                                transform_status = true,
                                parcer_status = true,  
                                parcer_data = '${JSON.stringify(fParserData)}' 
                                WHERE message_id='${fullMessage.message_id}'`;
                await client.query(updMsgQuery);
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

    async addMessagesNew(sessionId, data) {
        const client = await pool.connect();
        if (data.length > 1) {
            if (data[data.length - 1].created_time) {
                await client.query(`UPDATE data.live_sessions SET lates_comment_time='${data[data.length - 1].created_time}' WHERE id='${sessionId}'`);
            }
        }

        const productQuery = `SELECT * FROM data.set_live_sessions_store_messages(${sessionId}, '${JSON.stringify(data).replaceAll("'", '')}');`;
console.log(productQuery);
        try {
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
                    { message: productQuery }
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
