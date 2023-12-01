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
    await axios(`${apiUrl}/api/fetch-active-sessions`)
        .then( (response) => {
            response.data.result.forEach(async session => {
                // get list of live videos for store
                shell.exec(`pm2 start jobStoreVideos.js --name "jobStoreVideos ${session.id}" -- sessionId=${session.id} storeData=${session.store_id} access_toked=${session.access_token}`, function(code, output) {
                    console.log('Exit code:', code);
                    console.log('Program output:', output);
                });
                // shell.exec(`pm2 start jobStoreVideosNew.js --name "jobStoreVideosNew ${session.id}" -- sessionId=${session.id} storeData=${session.store_id} access_toked=${session.access_token}`, function(code, output) {
                //     console.log('Exit code:', code);
                //     console.log('Program output:', output);
                // });

                shell.exec(`pm2 start jobStoreParser.js --name "jobStoreParser ${session.id}" -- sessionId=${session.id}`, function(code, output) {
                    console.log('Exit code:', code);
                    console.log('Program output:', output);
                });
            })
        });
}
setTimeout(await startProcess, 10000);
