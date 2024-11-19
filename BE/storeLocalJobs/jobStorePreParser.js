import axios from "axios";
import 'dotenv/config';
const args = process.argv;
const apiUrl = process.env.API_URL;
const sessionsData = args[2].split('=');
// const testSessionData = 70;

async function sessionLaunche() {
    console.log(`PreParse messages for session ${sessionsData[1]}`);
    // start parsing messages
    try {
        await axios(`${apiUrl}/api/transform-live-messages?sessionId=${sessionsData[1]}`)
            .then((response) => {
                // console.log('Response Data:', response?.data);
            });
//         const dataResCnt = await axios(`${apiUrl}/api/transform-live-messages-cnt?sessionId=${sessionsData[1]}`)
//             .then((response) => {
//                 return response.data.launched;
//             });
// console.log('LAUNCHED:', dataResCnt);
//         if (!dataResCnt) {
//             await axios(`${apiUrl}/api/transform-live-messages?sessionId=${sessionsData[1]}`)
//                 .then((response) => {
//                     // console.log('Response Data:', response?.data);
//                 });
//         } else {
//             // tryCnt++;
//         }

        // const dataResCnt = axios(`${apiUrl}/api/transform-live-messages-cnt?sessionId=${sessionsData[1]}`)
        //     .then((response) => {
        //         if (!response.data.cnt) {
        //             axios(`${apiUrl}/api/transform-live-messages?sessionId=${sessionsData[1]}`)
        //                 .then((response) => {
        //                     console.log('Response Data:', response.data.message);
        //                 });
        //         }
        //     });
    //     axios(`${apiUrl}/api/transform-live-messages?sessionId=${sessionsData[1]}`)
    //         .then((response) => {
    //             console.log('Response Data:', response.data.message);
    //         });
    } catch (e) {
        console.log('ERROR PRED PARCER', e.message);
    }
}

setTimeout(await sessionLaunche, 10000);
