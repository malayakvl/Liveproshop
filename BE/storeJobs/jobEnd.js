import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';
import moment from "moment/moment.js";

const apiUrl = process.env.API_URL;

// ***************************************************************************
// get list of session wich should be started for current time
// ***************************************************************************
async function startProcess() {
    console.log(`Get list ended events: ${apiUrl}/api/fetch-store-session-for-end`);
    const queryStr = `SELECT
                    *
                FROM data.get_live_sessions_store_ended_tmp('${moment().format('YYYY-MM-DD')}', '${moment().add(3, 'hours').format('HH:mm:ss')}');`;
    // // console.log(queryStr);
    // console.log(`${apiUrl}/api/fetch-store-session-for-end`);
    await axios(`${apiUrl}/api/fetch-store-session-for-end`)
        .then( (response) => {
            console.log(response.data.result);
            response.data.result.forEach(async session => {
                console.log(session.id)
                shell.exec(`pm2 delete "jobStoreEvent ${session.id}"`, function(code, output) {
                });

                shell.exec(`pm2 delete "jobStoreComments ${session.id}"`, function(code, output) {
                });

                shell.exec(`pm2 delete "jobStoreMessage ${session.id}"`, function(code, output) {
                });

                shell.exec(`pm2 delete "jobStoreParser ${session.id}"`, function(code, output) {
                });

                await axios(`${apiUrl}/api/update-closed-session?sessionId=${session.id}`)
                    .then(() => {

                    });
            })
        });
}
setTimeout(await startProcess, 10000);
