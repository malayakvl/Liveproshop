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
    console.log('Getting list of active live comments under sessions for launche process');
    await axios(`${apiUrl}/api/fetch-active-sessions-sender`)
        .then( (response) => {
            response.data.result.forEach(async session => {
                shell.exec(`pm2 start jobStoreMessage.js --name "jobStoreMessage ${session.id}" -- sessionId=${session.id} storeData=${session.store_id} access_token=${session.access_token}`, function(code, output) {
                    console.log('Exit code Sender:', code);
                    console.log('Program output:', output);
                });

                // kill process
                shell.exec(`pm2 delete "jobStoreSender"`, function(code, output) {
                });
            })
        });
}
setTimeout(await startProcess, 10000);

