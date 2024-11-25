import axios from "axios";
import 'dotenv/config';
import shell from "shelljs";
const args = process.argv;
const apiUrl = process.env.API_URL;
const sessionsData = args[2].split('=');
const messageData = args[3].split('=');

async function sessionLaunche() {
    console.log(`PreParse messages :  ${messageData[1]}`);
    // start parsing messages
    try {
        await axios(`${apiUrl}/api/transform-live-messages-id?messageId=${messageData[1]}&sessionId=${sessionsData[1]}`)
            .then((response) => {
                // console.log('Response Data:', response?.data);
                // shell.exec(`pm2 delete "jobStorePreParserByMessage ${messageData[1]}"`, function(code, output) {
                // });
            })
    } catch (e) {
        // shell.exec(`pm2 delete "jobStorePreParserByMessage ${messageData[1]}"`, function(code, output) {
        // });
        console.log('ERROR PRED PARCER');
    }
}

setTimeout(await sessionLaunche, 10000);
