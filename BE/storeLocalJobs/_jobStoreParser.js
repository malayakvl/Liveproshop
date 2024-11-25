import axios from "axios";
import 'dotenv/config';
const args = process.argv;
const apiUrl = process.env.API_URL;
import shell from 'shelljs';

const sessionsData = args[2].split('=');
const testSessionData = 70;

async function sessionLaunche() {
    console.log('RUN PARCER SCRIPT', sessionsData[1]);

    try {
        const dataResCnt = axios(`${apiUrl}/api/transform-live-messages-cnt?sessionId=${sessionsData[1]}`)
            .then((response) => {
                if (!response.data.cnt) {
                    // try {
                    //     axios(`${apiUrl}/api/transform-live-messages?sessionId=${testSessionData}`)
                    //         .then((response) => {
                    //             console.log('Response Data:', response.data.message);
                    //         });
                    // } catch (e) {
                    //     console.log('TUT ERROR 1', e.message);
                    // }
                    shell.exec(`pm2 start jobStorePreParser.js --name "jobStorePreParser ${sessionsData[1]}" -- sessionId=${sessionsData[1]}`, function(code, output) {
                    });
                    // shell.exec(`pm2 start jobStorePreParserModel.js --name "jobStorePreParser ${testSessionData}" -- sessionId=${testSessionData} ids=${JSON.stringify([])}`, function(code, output) {
                    // });
                } else {
                    shell.exec(`pm2 delete "jobStorePreParser ${sessionsData[1]}"`, function(code, output) {
                    });
                }

                // setTimeout(() => {
                //     shell.exec(`pm2 delete "jobStoreParser ${sessionsData[1]}"`, function(code, output) {
                //     });
                // }, 5000);
            });
    } catch (e) {
        console.log('TUT ERROR 1', e.message);
    }

    // axios(`${apiUrl}/api/add-live-messages-new?sessionId=${testSessionData}`)
    //     .then((response) => {
    //         // console.log('Response Data:', response.data.message);
    //     });

    // start creating orders
    // axios(`${apiUrl}/api/create-orders?sessionId=${testSessionData}`)
    //     .then((response) => {
    //         // console.log(response.data.message);
    //     });
}
setTimeout(await sessionLaunche, 10000);
