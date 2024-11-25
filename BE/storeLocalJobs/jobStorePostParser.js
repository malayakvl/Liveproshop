import axios from "axios";
import 'dotenv/config';
import shell from "shelljs";
const args = process.argv;
const apiUrl = process.env.API_URL;

const sessionsData = args[2].split('=');


async function sessionLaunche() {
    try {
        const resultMsg = await axios(`${apiUrl}/api/transform-notparsed-messages?sessionId=${sessionsData[1]}`)
            .then((response) => {
                return response.data;
            });
            const mssIds = [];
            if (resultMsg?.data?.length > 0) {
console.log(resultMsg?.data?.rows);
                resultMsg.data.forEach(async _msg => {
                    mssIds.push(_msg.message_id);
                });
                if (mssIds.length > 0) {
                    await axios(`${apiUrl}/api/transform-live-messages-id?messageIds=${JSON.stringify(mssIds)}&sessionId=${sessionsData[1]}`)
                        .then((response) => {
                            // console.log(response.data)
                        })
                }
            } else {
                console.log('ALL TRANSFORMED');
            }
    } catch (e) {
console.log('error', e)
    }
}
// await sessionLaunche;
setTimeout(await sessionLaunche, 1000);
