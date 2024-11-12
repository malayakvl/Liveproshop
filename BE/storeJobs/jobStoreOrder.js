import axios from "axios";
import 'dotenv/config';
const args = process.argv;
const apiUrl = process.env.API_URL;

const sessionsData = args[2].split('=');


async function sessionLaunche() {
console.log('CREATE ORDERS', `${apiUrl}/api/create-orders?sessionId=${sessionsData[1]}`);

    // start creating orders
    axios(`${apiUrl}/api/create-orders?sessionId=${sessionsData[1]}`)
        .then((response) => {
            // console.log(response.data.message);
        });
    // console.log(`Parse messages for session ${sessionsData[1]}`);
    // start parsing messages
    // axios(`${apiUrl}/api/parse-live-messages?sessionId=${sessionsData[1]}`)
    //     .then((response) => {
    //         console.log('Response Data:', response.data.message);
    //     });
    //
    // // start creating orders
    // axios(`${apiUrl}/api/create-orders?sessionId=${sessionsData[1]}`)
    //     .then((response) => {
    //         console.log(response.data.message);
    //     });

}

setTimeout(await sessionLaunche, 10000);
