import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';

const apiUrl = process.env.API_URL;

// ***************************************************************************
// Получаем из нашей бази все лив сессии которие доджни случиться на момент
// на момент проверки, для каждой лив видео сессии запускаем такс по чтению
// комментарием, их дальнейшему парсигну, созданию заказов и рассилки ответов
// ***************************************************************************
async function startProcess() {
    console.log('Getting list of active live video sessions for launche process');

    const tokenTest = 'EAArS9KI0vagBOZC8TWnq88hDab2k5Hebfn3PDNRZAjDMqG1BeF8HSxELECtkvmeZBJ9J6Pg5ZB0YFlg2acjxVzkksOiVQmA4cUD9eLN5QeeeyZBDYXO2PkkJK93BotLR3GCFDsRip7DgoTK7eHoVPZCR6T9PnrP98GsdjxXUV4Swca0iDAE0nYgki9ysqkbQOYT744HoEIDxMkPQZDZD';
    const storeTestId = '134773596380836';
    const sessionTestId = 942;
    const videoTestId = '965685342252380'

    shell.exec(`pm2 start jobStoreComments.js --name "jobStoreComments ${sessionTestId}" -- videoId=${videoTestId} sessionId=${sessionTestId} accessToken=${tokenTest} `, function(code, output) {
    });
    // setTimeout(() => {
    //     shell.exec(`pm2 delete "jobStoreVideos ${sessionTestId}"`, function(code, output) {
    //     });
    // }, 5000);


    // await axios.get(`https://graph.facebook.com/v21.0/${storeTestId}/live_videos?broadcast_status=["VOD"]&fields=broadcast_start_time,id,title,description&access_token=${tokenTest}`)
    //     .then(async function (response) {
    //         const results = response.data.data;
    //         await axios.get(`${apiUrl}/api/update-store_session-status?sessionId=${sessionTestId}&videoId=${videoTestId}`)
    //                 .then(function (_response) {
    //                     // start process for getting messages and put it to _DB
    //                     shell.exec(`pm2 start jobStoreComments.js --name "jobStoreComments ${sessionTestId}" -- videoId=${videoTestId} sessionId=${sessionTestId} accessToken=${tokenTest} `, function(code, output) {
    //                     });
    //
    //                     // shell.exec(`pm2 start _jobStoreSender.js --name "jobStoreSender"   `, function(code, output) {
    //                     // });
    //                     //
    //                     // shell.exec(`pm2 start _jobStoreParser.js --name "jobStoreParser ${sessionTestId}" -- sessionId=${sessionTestId}`, function(code, output) {
    //                     //     console.log('Exit code:', code);
    //                     //     console.log('Program output:', output);
    //                     // });
    //
    //                     // kill process
    //                     // setTimeout(() => {
    //                     //     shell.exec(`pm2 delete "jobStoreVideos ${sessionTestId}"`, function(code, output) {
    //                     //     });
    //                     // }, 5000);
    //
    //
    //                     // starting sending messages
    //
    //                 })
    //     })
    //     .catch(function (error) {
    //         console.log("Error", error.response.data.error.message);
    //     });



    // await axios(`${apiUrl}/api/fetch-active-sessions`)
    //     .then( (response) => {
    //         response.data.result.forEach(async session => {
    //             // get list of live videos for store
    //             shell.exec(`pm2 start jobStoreVideos.js --name "jobStoreVideos ${session.id}" -- sessionId=${session.id} storeData=${session.store_id} access_toked=${session.access_token}`, function(code, output) {
    //                 console.log('Exit code:', code);
    //                 console.log('Program output:', output);
    //             });
    //             shell.exec(`pm2 start jobStorePreParser.js --name "jobStorePreParser ${sessionTestId}" -- sessionId=${sessionTestId}`, function(code, output) {
    //             });
    //             // shell.exec(`pm2 start jobStoreVideosNew.js --name "jobStoreVideosNew ${session.id}" -- sessionId=${session.id} storeData=${session.store_id} access_toked=${session.access_token}`, function(code, output) {
    //             //     console.log('Exit code:', code);
    //             //     console.log('Program output:', output);
    //             // });
    //
    //             shell.exec(`pm2 start jobStoreParser.js --name "jobStoreParser ${session.id}" -- sessionId=${session.id}`, function(code, output) {
    //                 // console.log('Exit code:', code);
    //                 // console.log('Program output:', output);
    //             });
    //             shell.exec(`pm2 start _jobStoreOrder.js --name "jobStoreOrder ${session.id}" -- sessionId=${session.id}`, function(code, output) {
    //                 // console.log('Exit code:', code);
    //                 // console.log('Program output:', output);
    //             });
    //         })
    //     });
}
setTimeout(await startProcess, 10000);
