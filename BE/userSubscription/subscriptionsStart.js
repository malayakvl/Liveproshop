import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';
import moment from "moment/moment.js";

const apiUrl = process.env.API_URL;

// ***************************************************************************
// get list of session wich should be started for current time
// ***************************************************************************
async function startProcess() {
    console.log(`Get list updated subscription: ${apiUrl}/api/check-subscription-for-update`);
    await axios(`${apiUrl}/api/check-subscription-for-update`)
        .then( (response) => {
            response.data.data.forEach(async subscription => {

                await axios
                    .post(`${apiUrl}/api/update-subscription-plan-job`, subscription)
                    .then(() => {
                    }).catch(function (_error) {
                        console.log(_error.message);
                    });
            })

            // response.data.result.forEach(async session => {
            //     // console.log('LiveVideo started:', session);
            //     shell.exec(`pm2 start jobStoreEvent.js --name "jobStoreEvent ${session.id}" -- sessionId=${session.id} accessToken=${session.auth_provider_access_token} providerId=${session.auth_provider_id}`, function(code, output) {
            //         console.log('Exit code:', code);
            //         console.log('Program output:', output);
            //     });
            //
            //     await axios(`${apiUrl}/api/activate-store-session/${session.id}`)
            //         .then(() => {
            //
            //         });
            // })
        });
}
setTimeout(await startProcess, 10000);
