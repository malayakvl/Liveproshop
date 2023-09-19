import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';

const apiUrl = process.env.API_URL;
const args = process.argv;
const sessionsData = args[3].split('=');
const tokenData = args[4].split('=');
const videoData = args[2].split('=');
async function startProcess() {
    try {

        await axios.get(`https://graph.facebook.com/v17.0/${videoData[1]}/comments?fields=id,from,comments,message,can_comment&limit=100&access_token=${tokenData[1]}`)
            .then(async function (response) {
                const results = response.data.data;
                await axios
                    .post(`${apiUrl}/api/add-live-messages?sessionId=${sessionsData[1]}`, results)
                    .then(() => {
                        shell.exec(`pm2 start sessionFBStoreSendReply.js --name "FB STORE session send reply ${session.id}" -- sessionId=${session.id} storeId=${session.store_id} accessToken=${session.access_token}`, function(code, output) {
                            console.log('Exit code:', code);
                            console.log('Program output:', output);
                        });
                    }).catch(function (_error) {
                        console.log(_error.message);
                    });
            })
            .catch(function (error) {
                console.log("error on get comment under video", error.message);
            });
    } catch (e) {
        console.log(e.message);
    }
}


setTimeout(await startProcess, 10000);
