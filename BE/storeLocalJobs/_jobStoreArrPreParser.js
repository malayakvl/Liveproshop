import axios from "axios";
import 'dotenv/config';
const args = process.argv;
const apiUrl = process.env.API_URL;

const sessionsData = args[2].split('=');
const testSessionData = 68;
const msgIdsStr = args[3].split('=')[1].replace(/\[|\]/gm, '');
const msgIds =  msgIdsStr.split(',')
async function sessionLaunche() {
    console.log(`Parse messages for session ${sessionsData[1]}`);
    // start parsing messages
    try {
        axios(`${apiUrl}/api/transform-live-messages-arr?sessionId=${sessionsData[1]}&ids=${JSON.stringify(msgIds)}`)
            .then((response) => {
                console.log('Response Data:', response.data.message);
            });
    } catch (e) {
        console.log('TUT ERROR 1', e.message);
    }
}

setTimeout(await sessionLaunche, 5000);
