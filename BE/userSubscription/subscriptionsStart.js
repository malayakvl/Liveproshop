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
            if (response.data.data.length > 0) {
                response.data.data.forEach(async subscription => {
                    await axios
                        .post(`${apiUrl}/api/update-subscription-plan-job`, subscription)
                        .then(() => {
                        }).catch(function (_error) {
                            console.log(_error.message);
                        });
                })
            }
        });
}
setTimeout(await startProcess, 10000);
