import pool from './connect.js';
import { logger } from '../../common/logger.js';
import moment from 'moment';
import store from "./Store.js";
import axios from "axios";

class Livesession {
    async getUserScenarios (userId) {
        const client = await pool.connect();
        try {
            const productQuery = `SELECT id, name FROM data.chatbot_scenarios WHERE user_id='${userId}' AND active=true ORDER BY created_at DESC`;
            const res = await client.query(productQuery);
            const items = res.rows.length > 0 ? res.rows : [];
            const error = null;

            return {
                items,
                error
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Chatbot getAll active):',
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

    async getAllInAir () {
        const client = await pool.connect();
        try {
            const query = await client.query(
                `SELECT data.live_sessions.id FROM data.live_sessions WHERE status='live'`
            );
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Products getAll)2:',
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
    
    async stopSession(itemId, userId) {
        const client = await pool.connect();
        try {
            // const currDateTime = new Date();
            // const currTime = currDateTime.getHours()+':'+currDateTime.getMinutes()+':'+currDateTime.getSeconds();
            // const currDate = currDateTime.getFullYear()+'-'+currDateTime.getMonth()+'-'+currDateTime.getUTCDay();
            // console.log(moment().format("YYYY-MM-DD"));
            const durationQuery = await client.query(`SELECT * FROM data.live_sessions WHERE id='${itemId}' AND user_id=${userId}`);
            let endPeriod;
            endPeriod = moment().add(0, 'minutes');
            // if (durationQuery.rows[0].order_timer.minutes) {
            //     endPeriod = moment().add(durationQuery.rows[0].order_timer.minutes, 'minutes');
            // } else if (durationQuery.rows[0].order_timer.hours) {
            //     endPeriod = moment().add(durationQuery.rows[0].order_timer.hours, 'hours');
            // } else {
            //     endPeriod = moment().add(durationQuery.rows[0].order_timer.days, 'days');
            // }
            const query = await client.query(
                `UPDATE data.live_sessions SET status='closed',
                    event_time_end = '${endPeriod.format("HH:mm:ss")}', event_date_end='${endPeriod.format("YYYY-MM-DD")}' WHERE id=${itemId} AND user_id=${userId}`
            );
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.log(e.message)
                logger.log(
                    'error',
                    'Model error (Products getAll):',
                    { message: e.message }
                );
            }
            const result = [];
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                result,
                error
            };
        } finally {
            client.release();
        }
    }

    async updateSessionStatusFB(sessionId, videoId) {
        const client = await pool.connect();
        const queryStr = `UPDATE data.live_sessions SET status='live', video_id='${videoId}' WHERE id=${sessionId}`;
        try {
            await client.query(queryStr);
            return { success: true };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (updateSessionStatusFB):',
                    { message: e.message }
                );
                logger.log(
                    'error',
                    'Model query:',
                    { message: queryStr }
                );
            }
            const error = {
                code: 500,
                message: 'check query'
            };
            return {
                success: false,
                error
            };
        } finally {
            client.release();
        }
    }

    async updateSessionStoreStatusFB(sessionId, videoId) {
        const client = await pool.connect();
        const queryStr = `UPDATE data.live_sessions SET status='live', video_id='${videoId}' WHERE id=${sessionId}`;
        try {
            await client.query(queryStr);
            return { success: true };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (updateSessionStatusFB):',
                    { message: e.message }
                );
                logger.log(
                    'error',
                    'Model query:',
                    { message: queryStr }
                );
            }
            const error = {
                code: 500,
                message: 'check query'
            };
            return {
                success: false,
                error
            };
        } finally {
            client.release();
        }
    }


    async getSessionsForStart () {
        const client = await pool.connect();
        console.log('KAKOGO HERA')
        // const queryStr = `SELECT
        //             id,
        //             user_id,
        //             auth_provider_id,
        //             auth_provider_access_token,
        //             auth_provider_expiration_time,
        //             auth_provider_expires_in
        //         FROM data.get_live_sessions_scheduled('${moment().format('YYYY-MM-DD')}', '${moment().format('HH:mm:ss')}');`;
        const queryStr = `SELECT
                    id,
                    store_id,
                    access_token,
                    auth_provider_expiration_time,
                    auth_provider_expires_in
                FROM data.get_live_sessions_store_scheduled('${moment().format('YYYY-MM-DD')}', '${moment().add(2, 'hours').format('HH:mm:ss')}');`;
        console.log(queryStr);
        exit;
        try {
            const query = await client.query(queryStr);
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Live Sessions):',
                    { message: e.message }
                );
                logger.log(
                    'error',
                    'Model query:',
                    { message: queryStr }
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

    async getStoreSessionsForStart() {
        const client = await pool.connect();
        // const queryStr = `SELECT
        //             id,
        //             store_id,
        //             access_token,
        //             auth_provider_expiration_time,
        //             auth_provider_expires_in
        //         FROM data.get_live_sessions_store_scheduled('${moment().add(-3, 'hours').format('YYYY-MM-DD')}', '${moment().add(3, 'hours').format('HH:mm:ss')}');`;
        const queryStr = `SELECT
                    id,
                    user_id,
                    auth_provider_id,
                    auth_provider_access_token,
                    auth_provider_expiration_time,
                    auth_provider_expires_in
                FROM data.get_live_sessions_scheduled('${moment().format('YYYY-MM-DD')}', '${moment().add(2, 'hours').format('HH:mm:ss')}');`;
        // console.log(queryStr);
        try {
            const query = await client.query(queryStr);
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Live Sessions):',
                    { message: e.message }
                );
                logger.log(
                    'error',
                    'Model query:',
                    { message: queryStr }
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

    async getStoreSessionsForEnd() {
        const client = await pool.connect();
        // const queryStr = `SELECT
        //             *
        //         FROM data.get_live_sessions_store_ended_new('${moment().format('YYYY-MM-DD')}', '${moment().add(3, 'hours').format('HH:mm:ss')}');`;
        // console.log(queryStr);
        // const queryStr = `SELECT ls.* FROM data.live_sessions ls INNER JOIN data.user_stores us ON (ls.store_id = us.id)
        //                 WHERE TRUE
        //                     AND (ls.status = 'closed')
        //                     AND (ls.video_id IS NOT NULL)
        //                     AND (ls.job_closed IS NULL)
        //                     AND event_date_end = '${moment().format('YYYY-MM-DD')}'
        //                     AND event_time_end <= '${moment().add(3, 'hours').format('HH:mm:ss')}'`;
        const queryStr = `SELECT ls.* FROM data.live_sessions ls INNER JOIN data.user_stores us ON (ls.store_id = us.id)
                        WHERE TRUE
                            AND (ls.status = 'closed')
                            AND (ls.video_id IS NOT NULL)
                            AND (ls.job_closed IS NULL)
                            AND event_date_end = '${moment().format('YYYY-MM-DD')}'
                            AND event_time_end <= '${moment().add(3, 'hours').format('HH:mm:ss')}'`;
        // console.log(queryStr);
        try {
            const query = await client.query(queryStr);
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Live Sessions):',
                    { message: e.message }
                );
                logger.log(
                    'error',
                    'Model query:',
                    { message: queryStr }
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


    async updateClosedSession(sessionId) {
        const client = await pool.connect();
        const queryStr = `UPDATE data.live_sessions SET job_closed=true WHERE id='${sessionId}'`;
        try {
            const query = await client.query(queryStr);
            // const result = query.rows.length > 0 ? query.rows : [];
            return {
                success: true
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Live Sessions):',
                    { message: e.message }
                );
                logger.log(
                    'error',
                    'Model query:',
                    { message: queryStr }
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




    async launchedSession(sessionId) {
        const client = await pool.connect();
        try {
            const query = await client.query(
                `UPDATE data.live_sessions SET launched=true WHERE id=${sessionId}`
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

    async launchedForStopSession() {
        const client = await pool.connect();
        try {
            const query = await client.query(
                `SELECT data.live_sessions.id WHERE video_id IS NOT NULL AND launched=true`
            );
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result
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


    async getAllActive () {
        const client = await pool.connect();
        const query = await client.query(
            `SELECT data.live_sessions.*, us.auth_provider_access_token 
                FROM data.live_sessions 
                LEFT JOIN data.users u ON u.id = user_id 
                LEFT JOIN data.user_stores us ON us.id = data.live_sessions.store_id 
                WHERE video_id IS NOT NULL AND launched IS NULL`
        );
        // console.log(            `SELECT data.live_sessions.*, u.auth_provider_access_token FROM data.live_sessions LEFT JOIN data.users u ON u.id = user_id WHERE video_id IS NOT NULL AND launched IS NULL`
        // );
        try {
            const error = null;
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result,
                error
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    `Model error (Live Session getAllActive): ${query}`,
                    { message: e.message }
                );
            }
            const result = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                result,
                error
            };
        } finally {
            client.release();
        }
    }
    // https://graph.facebook.com/v21.0/134773596380836/live_videos?broadcast_status=["LIVE"]&fields=broadcast_start_time,id,title&access_token=EAArS9KI0vagBO5GDNQqlislTFs1Wv2nbSPLtLQZBMZAoLMpdayCZClAZBWqROW0nl4VDCluCz9YZAPG4mBOO3fqliCvbiZAh7f4BWWIZAYIoc1jkgUF2fQEqm8xE9B2Y1ooBsuv4qZCRyM5WBSUydZBB2jU4eKFXVoufwqPBxvPYWsB4xqzhj6TThyursMZCsA4LUZD
    async getAllStoreActive () {
        const client = await pool.connect();
        const query = await client.query(
            `SELECT data.live_sessions.*, us.access_token, us.store_id, us.account_id
                FROM data.live_sessions
                LEFT JOIN data.users u ON u.id = user_id
                LEFT JOIN data.user_stores us ON us.id = data.live_sessions.store_id
                WHERE video_id IS NULL AND launched IS NOT NULL`
        );
// console.log(`SELECT data.live_sessions.*, us.access_token, us.store_id, us.account_id
//                 FROM data.live_sessions
//                 LEFT JOIN data.users u ON u.id = user_id
//                 LEFT JOIN data.user_stores us ON us.id = data.live_sessions.store_id
//                 WHERE video_id IS NOT NULL AND launched IS NOT NULL`);
        try {
            const error = null;
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result,
                error
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    `Model error (Live Session getAllActive): ${query}`,
                    { message: e.message }
                );
            }
            const result = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                result,
                error
            };
        } finally {
            client.release();
        }
    }

    async getAllStoreActiveSender () {
        const client = await pool.connect();
        const query = await client.query(
            `SELECT data.live_sessions.*, us.access_token, us.store_id, us.account_id
                FROM data.live_sessions
                LEFT JOIN data.users u ON u.id = user_id
                LEFT JOIN data.user_stores us ON us.id = data.live_sessions.store_id
                WHERE video_id IS NOT NULL AND status='live'`
        );
        try {
            const error = null;
            const result = query.rows.length > 0 ? query.rows : [];
            return {
                result,
                error
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    `Model error (Live Session getAllActive): ${query}`,
                    { message: e.message }
                );
            }
            const result = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                result,
                error
            };
        } finally {
            client.release();
        }
    }

//     async getAll (page, perPage = 20, userId, reqOffset = null) {
//         const client = await pool.connect();
//         try {
//             const _total = await client.query(
//                 `SELECT * FROM common__tools._select_total_from_table_by_where('data', 'live_sessions', 'id', 'user_id = ''${userId}''');`
//             );
//             const size = _total.rows[0].total;
//             let offset;
//             if (reqOffset) {
//                 offset = reqOffset;
//             } else {
//                 offset = (Number(page) - 1) * Number(perPage);
//             }
// //             const storesQuery = `SELECT * FROM data.user_stores WHERE user_id='${userId}' ORDER BY fan_count DESC limit ${perPage} OFFSET ${offset}`;
// //             const resStores = await client.query(storesQuery);
// // console.log('USER', user);
// //             const userData = user;
// //             const longToken = await axios
// //                 .get(
// //                     `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${userData.auth_provider_access_token}`
// //                 )
// //                 .then(async (responseLongToken) => {
// //                     console.log("LONG LIVE TOKEN RESPONSE", responseLongToken.data);
// //                     // await client.query(`UPDATE data.users SET long_live_access_token='${responseLongToken.data.access_token}' WHERE id=${userData.id}`);
// //
// //                     return responseLongToken.data.access_token
// //                 });
//
//             if (resStores.rows.length > 0) {
//                 resStores.rows.forEach(_store => {
//                     console.log('STORE', _store);
//                 })
//             }
//
//
//             // const productQuery = `SELECT * FROM data.live_sessions WHERE user_id='${userId}' ORDER BY event_date DESC, event_time DESC limit ${perPage} OFFSET ${offset}`;
//             const productQuery = `SELECT data.live_sessions.*, data.user_stores.name AS store_name
//                     FROM data.live_sessions
//                     LEFT JOIN data.user_stores ON data.user_stores.id = data.live_sessions.store_id
//                     WHERE data.live_sessions.user_id='${userId}'
//                 ORDER BY event_date DESC, event_time DESC limit ${perPage} OFFSET ${offset}`;
//             // console.log(productQuery);
//             const res = await client.query(productQuery);
//             const items = res.rows.length > 0 ? res.rows : [];
//             const error = null;
//
//             return {
//                 items,
//                 size,
//                 error
//             };
//         } catch (e) {
//             if (process.env.NODE_ENV === 'development') {
//                 logger.log(
//                     'error',
//                     'Model error (Products getAll)1:',
//                     { message: e.message }
//                 );
//             }
//             const products = null;
//             const error = {
//                 code: 500,
//                 message: 'Error get list of users'
//             };
//             return {
//                 products,
//                 error
//             };
//         } finally {
//             client.release();
//         }
//     }
    async getUserPages(user) {
        console.log('USER TOKEN', user.long_live_access_token);
        // getting long live token
        // const longToken = await axios
        //     .get(
        //         `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${data.accessToken}`
        //     )
        //     .then(async (responseLongToken) => {
        //         console.log("LONG LIVE TOKEN RESPONSE", responseLongToken.data);
        //         await client.query(`UPDATE data.users SET long_live_access_token='${responseLongToken.data.access_token}' WHERE id=${userData.id}`);
        //
        //         return responseLongToken.data.access_token
        //     }).catch(e => {
        //         return  e.response.data.error.message
        //     });
        // console.log('LONG TOKEN RESPONSE', longToken);
        return {success: true}
    }

    async getAll (page, perPage = 20, userId, reqOffset = null, queryFilter = null, user = null) {
        const client = await pool.connect();
        try {
            const _total = await client.query(
                `SELECT * FROM common__tools._select_total_from_table_by_where('data', 'live_sessions', 'id', 'user_id = ''${userId}''');`
            );

            const size = _total.rows[0].total;
            let offset;
            if (reqOffset) {
                offset = reqOffset;
            } else {
                offset = (Number(page) - 1) * Number(perPage);
            }
            const storesQuery = `SELECT * FROM data.user_stores WHERE user_id='${userId}' ORDER BY fan_count DESC limit ${perPage} OFFSET ${offset}`;
            const resStores = await client.query(storesQuery);
            let longToken;
            let expiteLongTokenAt;
            let expiteAccessLongTokenAt;
            longToken = await axios
                .get(
                    `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${user.long_live_access_token}`
                )
                .then(async (responseLongToken) => {
// console.log("LONG LIVE TOKEN RESPONSE", responseLongToken.data);
                    // await client.query(`UPDATE data.users SET long_live_access_token='${responseLongToken.data.access_token}' WHERE id=${userData.id}`);

                    return {result: responseLongToken.data};
                }).catch(e => {
                    console.log('ERROR', e.response.data.error.message)
                    return  {error: e.response.data.error.message}
                })
// console.log('RESULT RESPONSE', longToken);
            let longTokenExpire;
            if (!longToken.error) {
                // get app access token
                const appAccessToken = await axios
                    .get(
                        `https://graph.facebook.com/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&grant_type=client_credentials`
                    )
                    .then(async (responseLongToken) => {
                        return {appToken: responseLongToken.data.access_token};
                    }).catch(e => {
                        return {error: e.response.data.error.message};
                        // return  e.response.data.error.message
                    })
// console.log('APP TOKEN DATA', appAccessToken);


                longTokenExpire = await axios
                    .get(
                        `https://graph.facebook.com/debug_token?input_token=${longToken.result.access_token}&access_token=${appAccessToken.appToken}`
                    )
                    .then(async (responseLongToken) => {
                        // console.log("LONG TOKEN DEBUG", responseLongToken.data);
                        return {result: responseLongToken.data};
                    }).catch(e => {
                        return  {error: e.response.data.error.message}
                    })
                // console.log('LONG TOKEN EXPIRE', longTokenExpire)
                if (!longTokenExpire.error) {
// console.log('data_access_expires_at', longTokenExpire.result.data.data_access_expires_at);
                    expiteLongTokenAt = moment.unix(longTokenExpire.result.data.data_access_expires_at).format("DD-MM-YYYY HH:mm:ss");
                }
            }  else {
                // get date expired
                // user.auth_provider_access_token
                const appAccessToken = await axios
                    .get(
                        `https://graph.facebook.com/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&grant_type=client_credentials`
                    )
                    .then(async (responseLongToken) => {
                        return {appToken: responseLongToken.data.access_token};
                    }).catch(e => {
                        return {error: e.response.data.error.message};
                        // return  e.response.data.error.message
                    });
// console.log('APP TOKEN DATA', appAccessToken);


                longTokenExpire = await axios
                    .get(
                        `https://graph.facebook.com/debug_token?input_token=${user.auth_provider_access_token}&access_token=${appAccessToken.appToken}`
                    )
                    .then(async (responseLongToken) => {
                        // console.log("LONG TOKEN DEBUG", responseLongToken.data);
                        return {result: responseLongToken.data};
                    }).catch(e => {
                        return  {error: e.response.data.error.message}
                    })
                // console.log('LONG TOKEN EXPIRE', longTokenExpire)
                if (!longTokenExpire.error) {
                    expiteLongTokenAt = moment.unix(longTokenExpire.result.data.expires_at).format("DD-MM-YYYY HH:mm:ss");
                    expiteAccessLongTokenAt = moment.unix(longTokenExpire.result.data.data_access_expires_at).format("DD-MM-YYYY HH:mm:ss");
                    // console.log('EXPIRED', expiteLongTokenAt);
                    // console.log('EXPIRED', expiteAccessLongTokenAt);
                }
            }
            // }
            await axios
                .get(
                    `https://graph.facebook.com/v21.0/me/accounts?fields=picture{url},name,fan_count,is_published,access_token&access_token=${user.long_live_access_token}`
                )
                .then(async (responsePages) => {
// console.log('PAGES', responsePages.data);
                });

            // const productQuery = `SELECT * FROM data.live_sessions WHERE user_id='${userId}' ORDER BY event_date DESC, event_time DESC limit ${perPage} OFFSET ${offset}`;
            const productQuery = `SELECT data.live_sessions.*, data.user_stores.name AS store_name 
                    FROM data.live_sessions 
                    LEFT JOIN data.user_stores ON data.user_stores.id = data.live_sessions.store_id
                    WHERE data.live_sessions.user_id='${userId}'
                ORDER BY event_date DESC, event_time DESC limit ${perPage} OFFSET ${offset}`;
            // console.log(productQuery);
            const res = await client.query(productQuery);
            const items = res.rows.length > 0 ? res.rows : [];
            const error = null;

            return {
                items,
                size,
                error,
                longToken,
                expiteLongTokenAt,
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Products getAll)1:',
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


    async getAllSabrinas (page, perPage = 20, user, reqOffset = null, queryFilter = null) {
        const userId = user.id;
        const client = await pool.connect();
        try {
            const _total = await client.query(
                `SELECT * FROM common__tools._select_total_from_table_by_where('data', 'live_sessions', 'id', 'user_id = ''${userId}''');`
            );
            const size = _total.rows[0].total;
            let offset;
            if (reqOffset) {
                offset = reqOffset;
            } else {
                offset = (Number(page) - 1) * Number(perPage);
            }
            const storesQuery = `SELECT * FROM data.user_stores WHERE user_id='${userId}' ORDER BY fan_count DESC limit ${perPage} OFFSET ${offset}`;
            const resStores = await client.query(storesQuery);
            let longToken;
            let expiteLongTokenAt;
            let expiteAccessLongTokenAt;
            longToken = await axios
                .get(
                    `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${user.long_live_access_token}`
                )
                .then(async (responseLongToken) => {
                    console.log("LONG LIVE TOKEN RESPONSE", responseLongToken.data);
                    // await client.query(`UPDATE data.users SET long_live_access_token='${responseLongToken.data.access_token}' WHERE id=${userData.id}`);

                    return {result: responseLongToken.data};
                }).catch(e => {
                    console.log('ERROR', e.response.data.error.message)
                    return  {error: e.response.data.error.message}
                })
            let longTokenExpire;
            if (!longToken.error) {
                // get app access token
                const appAccessToken = await axios
                    .get(
                        `https://graph.facebook.com/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&grant_type=client_credentials`
                    )
                    .then(async (responseLongToken) => {
                        return {appToken: responseLongToken.data.access_token};
                    }).catch(e => {
                        return {error: e.response.data.error.message};
                        // return  e.response.data.error.message
                    })

                longTokenExpire = await axios
                    .get(
                        `https://graph.facebook.com/debug_token?input_token=${longToken.result.access_token}&access_token=${appAccessToken.appToken}`
                    )
                    .then(async (responseLongToken) => {
                        // console.log("LONG TOKEN DEBUG", responseLongToken.data);
                        return {result: responseLongToken.data};
                    }).catch(e => {
                        return  {error: e.response.data.error.message}
                    })
                // console.log('LONG TOKEN EXPIRE', longTokenExpire)
                if (!longTokenExpire.error) {
                    expiteLongTokenAt = moment.unix(longTokenExpire.result.data.data_access_expires_at).format("DD-MM-YYYY HH:mm:ss");
                }
            }  else {
                // get date expired
                // user.auth_provider_access_token
                const appAccessToken = await axios
                    .get(
                        `https://graph.facebook.com/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&grant_type=client_credentials`
                    )
                    .then(async (responseLongToken) => {
                        return {appToken: responseLongToken.data.access_token};
                    }).catch(e => {
                        return {error: e.response.data.error.message};
                        // return  e.response.data.error.message
                    });

                longTokenExpire = await axios
                    .get(
                        `https://graph.facebook.com/debug_token?input_token=${user.auth_provider_access_token}&access_token=${appAccessToken.appToken}`
                    )
                    .then(async (responseLongToken) => {
                        // console.log("LONG TOKEN DEBUG", responseLongToken.data);
                        return {result: responseLongToken.data};
                    }).catch(e => {
                        return  {error: e.response.data.error.message}
                    })
                // console.log('LONG TOKEN EXPIRE', longTokenExpire)
                if (!longTokenExpire.error) {
                    expiteLongTokenAt = moment.unix(longTokenExpire.result.data.expires_at).format("DD-MM-YYYY HH:mm:ss");
                    expiteAccessLongTokenAt = moment.unix(longTokenExpire.result.data.data_access_expires_at).format("DD-MM-YYYY HH:mm:ss");
                }
            }
            // }
            const providerData = await client.query(`SELECT auth_provider_id FROm data.users  WHERE id='${user.id}'`);
            const pagesData = await axios
                .get(
                    `https://graph.facebook.com/v21.0/me/accounts?fields=picture{url},name,fan_count,is_published,access_token&access_token=${user.long_live_access_token}`
                )
                .then(async (responsePages) => {
                    return responsePages.data;
                });
            const userFbId = providerData.rows[0].auth_provider_id;
            if (pagesData.data.length > 0) {
                let storePicture = '';
                pagesData.data.forEach(async (store) => {
                    const queryStore = await client.query(`SELECT * FROM data.user_stores WHERE account_id='${userFbId}' AND store_id='${store.id}' AND user_id=${user.id}`);
                    if (queryStore.rows.length === 0) {
                        await  client.query(`
                                                    INSERT INTO data.user_stores (account_id, store_id, access_token, name, user_id, fan_count, synchronized, picture)
                                                    VALUES
                                                    (
                                                        '${userFbId}',
                                                        '${store.id}',
                                                        '${store.access_token}',
                                                        '${store.name}',
                                                        '${user.id}',
                                                        '${store.fan_count}',
                                                        true,
                                                        '${store.picture.data.url}'
                                                    );`
                        );
                    } else {
                        console.log(`
                                                    UPDATE data.user_stores SET
                                                        access_token='${store.access_token}',
                                                        name='${store.name}',
                                                        picture='${store.picture.data.url}',
                                                        fan_count='${store.fan_count}',
                                                        synchronized=true,
                                                        updated_at='${moment().add(`3`, 'hours').format('YYYY-MM-DD HH:mm:ss')}'
                                                    WHERE account_id='${userFbId}' AND store_id='${store.id}';`);
                        await  client.query(`
                                                    UPDATE data.user_stores SET
                                                        access_token='${store.access_token}',
                                                        name='${store.name}',
                                                        picture='${store.picture.data.url}',
                                                        fan_count='${store.fan_count}',
                                                        synchronized=true,
                                                        updated_at='${moment().add(`3`, 'hours').format('YYYY-MM-DD HH:mm:ss')}'
                                                    WHERE account_id='${userFbId}' AND store_id='${store.id}';`
                        );
                    }

                })
            }
            // const productQuery = `SELECT * FROM data.live_sessions WHERE user_id='${userId}' ORDER BY event_date DESC, event_time DESC limit ${perPage} OFFSET ${offset}`;
            const productQuery = `SELECT data.live_sessions.*, data.user_stores.name AS store_name 
                    FROM data.live_sessions 
                    LEFT JOIN data.user_stores ON data.user_stores.id = data.live_sessions.store_id
                    WHERE data.live_sessions.user_id='${userId}'
                ORDER BY event_date DESC, event_time DESC limit ${perPage} OFFSET ${offset}`;
            // console.log(productQuery);
            const res = await client.query(productQuery);
            const items = res.rows.length > 0 ? res.rows : [];
            const error = null;

            return {
                items,
                size,
                error,
                longToken,
                expiteLongTokenAt,
            };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Products getAll)1:',
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



    async fetchOne(userId, itemId) {
        const client = await pool.connect();
        try {
            const res = await client.query(`SELECT * FROM data.live_sessions WHERE user_id=${userId} AND id=${itemId}`);
            if (res.rows[0].product) {
                res.rows[0].product = JSON.parse(res.rows[0].product);
            }
            res.rows[0].answer_count = !res.rows[0].answer_count ? '' : res.rows[0].answer_count;
            res.rows[0].discount = !res.rows[0].discount ? '' : res.rows[0].discount;
            return { item: res.rows[0] };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Livesession fetch one):',
                    { message: e.message }
                );
            }
            const item = null;
            const error = {
                code: 500,
                message: 'Error get list of users'
            };
            return {
                item,
                error
            };
        } finally {
            client.release();
        }
    }

    async create (userId, data) {
        const client = await pool.connect();
        const scenariosRes = await client.query(`SELECT ARRAY_AGG(id) AS ids FROM data.chatbot_scenarios WHERE user_id = ${userId}`);
        // console.log(`SELECT order_timer, free_shipping_timer, free_shipping_status, user_id
        //                     FROM data.seller_settings WHERE user_id=${userId};`);
        // const scenariosResNew = await client.query(`SELECT id FROM data.chatbot_scenarios WHERE user_id = ${userId} ORDER BY id`);
        // let scenarioIds = '';
        // scenariosResNew.rows.forEach(_res => {
        //     scenarioIds += _res.id+',';
        // });

        // console.log(scenarioIds.substring(0, scenarioIds.length - 1));

        const settings = await client.query(`SELECT order_timer, free_shipping_timer, free_shipping_status, user_id
                            FROM data.seller_settings WHERE user_id=${userId};`);
        let intervalDuration;
        let _timeValue;
        let _type;
        if (settings.rows[0].order_timer.hours) {
            _timeValue = settings.rows[0].order_timer.hours;
            _type = 'h';
        } else if (settings.rows[0].order_timer.days) {
            _timeValue = settings.rows[0].order_timer.days;
            _type = 'd';
        } else {
            _timeValue = settings.rows[0].order_timer.minutes;
            _type = 'm';
        }
        const timeValue = settings.rows[0].order_timer.hours ? settings.rows[0].order_timer.hours: settings.rows[0].order_timer.days;
        const type = settings.rows[0].order_timer.hours ? 'h': 'd';
        let _intervalDuration;
        if (_type === 'h') {
            _intervalDuration = `${_timeValue} hour${_timeValue > 1 ? 's' : ''}`;
        } else if (_type === 'd') {
            _intervalDuration = `${_timeValue} day${timeValue > 1 ? 's' : ''}`;
        } else {
            _intervalDuration = `${_timeValue} minute${timeValue > 1 ? 's' : ''}`;
        }
        // console.log( `INSERT INTO data.live_sessions (user_id, event_date, event_time, scenarios, status, order_timer, store_id)
        //         VALUES (${userId}, '${data.event_date}', '${data.event_time}',
        //             '{${scenariosRes.rows[0].ids}}', 'scheduled', '${_intervalDuration}', '${data.storeId}'
        //         );`)

        if (type === 'h') {
            intervalDuration = `${timeValue} hour${timeValue > 1 ? 's' : ''}`;
        } else {
            intervalDuration = `${timeValue} day${timeValue > 1 ? 's' : ''}`;
        }

        // const query =  `INSERT INTO data.live_sessions (user_id, event_date, event_time, scenarios, status, order_timer, store_id)
        //         VALUES (${userId}, '${data.event_date}', '${data.event_time}',
        //             '{6286,6296,6288,6298,6290,6300,6292,6302,6294,6304,6295,6291,6301,6305}', 'scheduled', '${_intervalDuration}', '${data.storeId}'
        //         );`;
        const query =  `INSERT INTO data.live_sessions (user_id, event_date, event_time, status, order_timer, store_id,
                scenarios, scenarios_colorconf, scenarios_sizeconf, scenarios_fullconf)
                VALUES (${userId}, '${data.event_date}', '${data.event_time}',
                    'scheduled', '${_intervalDuration}', '${data.storeId}',
                    '{6294,6304}', '{6290,6300}', '{6292,6302}', '{6286,6288,6296,6298}'
                );`;
        try {
            await client.query(query);
            return { success: true };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Chatbot update):',
                    { message: e.message }
                );
            }
            const item = null;
            const error = {
                code: 500,
                message: 'Error update chatbot_scenarios'
            };
            return {
                success: false,
                error,
                item
            };
        } finally {
            client.release();
        }
    }

    async update (userId, data) {
        const client = await pool.connect();
        try {
            const itemId = data.id;
            // delete data.id;
            const query =  `UPDATE data.chatbot_scenarios SET
                                name = $$${data.name}$$,
                                keywords = $$${data.keywords}$$,
                                answer_count=${data.answer_count ? data.answer_count : null},
                                product='${data.product ? JSON.stringify(data.product) : ''}',
                                discount=${data.discount ? data.discount : null},
                                message_fr = regexp_replace($$${data.message_fr}$$, '\\\\n+', E'\\n', 'g' ),
                                message_en = regexp_replace($$${data.message_en}$$, '\\\\n+', E'\\n', 'g' )
                            WHERE id=${itemId} AND user_id=${userId}
                `;
            await client.query(query);
            return { success: true };
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                logger.log(
                    'error',
                    'Model error (Chatbot update):',
                    { message: e.message }
                );
            }
            const item = null;
            const error = {
                code: 500,
                message: 'Error update chatbot_scenarios'
            };
            return {
                success: false,
                error,
                item
            };
        } finally {
            client.release();
        }
    }

    async bulkDelete (rowIds, userId) {
        const client = await pool.connect();
        try {
            await client.query(`DELETE FROM data.chatbot_scenarios WHERE id IN (${rowIds.join(',')}) AND user_id=${userId}`);
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

    async deleteRecord(id) {
        const client = await pool.connect();
        // console.log(`DELETE from data.live_sessions WHERE id='${id}'`);
        await client.query(`DELETE from data.live_sessions WHERE id='${id}'`);
        return true;
    }

    async changeActive(itemId, userId) {
        const client = await pool.connect();
        try {
            await client.query(`UPDATE data.chatbot_scenarios SET active = NOT active WHERE id=${itemId} AND user_id=${userId}`);
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

    async changeAllActive(status, userId) {
        const client = await pool.connect();
        try {
            await client.query(`UPDATE data.chatbot_scenarios SET active = ${status} WHERE user_id=${userId}`);
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

export default new Livesession();
