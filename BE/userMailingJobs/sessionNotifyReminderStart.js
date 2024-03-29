import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';
import moment from "moment/moment.js";

const apiUrl = process.env.API_URL;

// ***************************************************************************
// get list of session wich should be started for current time
// ***************************************************************************
async function startProcess() {
    console.log(`Get list updated subscription: ${apiUrl}/api/session-reminder`);
    await axios(`${apiUrl}/api/session-reminder`)
        .then( (response) => {
        });
}
setTimeout(await startProcess, 10000);
