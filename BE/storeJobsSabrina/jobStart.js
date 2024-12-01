import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';
import moment from "moment/moment.js";

const apiUrl = process.env.API_URL;
const storeId = 1060;

// ***************************************************************************
// get list of session wich should be started for current time
// ***************************************************************************
async function startProcess() {
    const token = 'EAArS9KI0vagBOZC8TWnq88hDab2k5Hebfn3PDNRZAjDMqG1BeF8HSxELECtkvmeZBJ9J6Pg5ZB0YFlg2acjxVzkksOiVQmA4cUD9eLN5QeeeyZBDYXO2PkkJK93BotLR3GCFDsRip7DgoTK7eHoVPZCR6T9PnrP98GsdjxXUV4Swca0iDAE0nYgki9ysqkbQOYT744HoEIDxMkPQZDZD'
    const sessionId = 100;
    const videoId = '960764652744449';

    // start comment script
    // shell.exec(`pm2 start jobStoreComments.js --name "jobStoreComments ${sessionId}" -- videoId=${videoId} sessionId=${sessionId} accessToken=${token} `, function(code, output) {
    // });

    // start parser script
    // shell.exec(`pm2 start jobStoreParser.js --name "jobStoreParser ${sessionId}" -- sessionId=${sessionId}`, function(code, output) {
    // });

    shell.exec(`pm2 start jobStoreMessage.js --name "jobStoreMessage ${sessionId}" -- sessionId=${sessionId}`, function(code, output) {
    });
    //
    // shell.exec(`pm2 start jobStoreMessage.js --name "jobStoreMessage ${sessionId}" -- sessionId=${sessionId} storeData=${storeId} access_token=${token}`, function(code, output) {
    //     // console.log('Exit code Sender:', code);
    //     // console.log('Program output:', output);
    // });

}
setTimeout(await startProcess, 10000);
