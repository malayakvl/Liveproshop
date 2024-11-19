import axios from "axios";
import 'dotenv/config';
import shell from "shelljs";
const args = process.argv;
const apiUrl = process.env.API_URL;
console.log(args);
exit;
// const sessionsData = args[1].split('=');
// const testSessionData = 68;
// console.log(`Parse messages for session ${sessionsData[1]}`);
// console.log(`${apiUrl}/api/transform-live-messages?sessionId=${sessionsData[1]}`);

async function sessionLaunche() {
    // start parsing messages
    axios(`${apiUrl}/api/transform-live-messages?sessionId=${sessionsData[1]}`)
        .then((response) => {
            // console.log('Response Data:', response.data.message);
        });
}

setTimeout(await sessionLaunche, 10000);
