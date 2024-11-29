import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';
import moment from 'moment';
import fs from "fs";

const apiUrl = process.env.API_URL;

// ***************************************************************************
// Получаем из нашей бази все лив сессии которие доджни случиться на момент
// на момент проверки, для каждой лив видео сессии запускаем такс по чтению
// комментарием, их дальнейшему парсигну, созданию заказов и рассилки ответов
// ***************************************************************************
async function startProcess() {
    console.log('Getting list of active live video sessions for launche process');
    await axios(`${apiUrl}/api/fetch-active-sessions`)
        .then( (response) => {
            response.data.result.forEach(async session => {
                let txtLog = `\n[${moment().format("DD-MM-YYYY, HH:mm:ss")}]=================Start Session Job\n`
                txtLog += `Session ID: ${session.id}\n`;
                txtLog += `pm2 start jobStoreVideos.js\n`;
                txtLog += `pm2 start jobStoreParser.js\n`;
                txtLog += `[${moment().format("DD-MM-YYYY, HH:mm:ss")}]=================END Start Session Job\n`;
                fs.appendFile(`/var/www/BE/session_logs/${session.id}.log`, txtLog, (err) => {
                    if(err) throw err;
                });
                // get list of live videos for store
                shell.exec(`pm2 start jobStoreVideos.js --name "jobStoreVideos ${session.id}" -- sessionId=${session.id} storeData=${session.store_id} access_toked=${session.access_token}`, function(code, output) {
                });

                // run parser script
                shell.exec(`pm2 start jobStoreParser.js --name "jobStoreParser ${session.id}" -- sessionId=${session.id}`, function(code, output) {
                });

                // run message script
                shell.exec(`pm2 start jobStoreMessage.js --name "jobStoreMessage ${session.id}" -- sessionId=${session.id}`, function(code, output) {
                });

            })
        });
}
setTimeout(await startProcess, 10000);
