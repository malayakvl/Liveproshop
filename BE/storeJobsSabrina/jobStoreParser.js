import axios from "axios";
import 'dotenv/config';
const args = process.argv;
const apiUrl = process.env.API_URL;
const sessionsData = args[2].split('=');
const liveSessionId = sessionsData[1];
async function sessionLaunche() {
console.log('RUN PARCER SCRIPT FOR LS:', liveSessionId);

    axios(`${apiUrl}/api/parse-live-messages-new?sessionId=${liveSessionId}`)
        .then((response) => {
            // console.log('Response Data:', response.data.message);
        });

    // start creating orders
    axios(`${apiUrl}/api/create-orders?sessionId=${liveSessionId}`)
        .then((response) => {
            // console.log(response.data.message);
        });
}

setTimeout(await sessionLaunche, 10000);
