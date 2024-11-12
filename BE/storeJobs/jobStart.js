import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';
import moment from "moment/moment.js";

const apiUrl = process.env.API_URL;

// ***************************************************************************
// get list of session wich should be started for current time
// ***************************************************************************
async function startProcess() {
    // console.log(`Get list started events: ${apiUrl}/api/fetch-store-session-for-start`);
    const queryStr = `SELECT
                    id,
                    store_id,
                    access_token,
                    auth_provider_expiration_time,
                    auth_provider_expires_in
                FROM data.get_live_sessions_store_scheduled('${moment().format('YYYY-MM-DD')}', '${moment().add(2, 'hours').format('HH:mm:ss')}');`;
    // console.log(queryStr);
    await axios(`${apiUrl}/api/fetch-store-session-for-start`)
        .then( (response) => {
// console.log(response.data.result);
            response.data.result.forEach(async session => {
                // console.log('LiveVideo started:', session);
                shell.exec(`pm2 start jobStoreEvent.js --name "jobStoreEvent ${session.id}" -- sessionId=${session.id} accessToken=${session.auth_provider_access_token} providerId=${session.auth_provider_id}`, function(code, output) {
                    // console.log('Exit code:', code);
                    // console.log('Program output:', output);
                });

                await axios(`${apiUrl}/api/activate-store-session/${session.id}`)
                    .then(() => {

                    });
            })
        });
}
setTimeout(await startProcess, 10000);
