import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';

const apiUrl = process.env.API_URL;
const args = process.argv;

const sessionsData = args[2].split('=');
const tokenData = args[3].split('=');
const providerData = args[4].split('=');

async function startProcess() {
    console.log(`Getting video parameters for sessionId: ${sessionsData[1]}, with token: ${tokenData[1]}, provider: ${providerData[1]}`);
    try {
        await axios.get(`https://graph.facebook.com/v13.0/me/live_videos?broadcast_status=["LIVE"]&fields=broadcast_start_time,id,title&access_token=${tokenData[1]}`)
            .then(async function () {
                // imagine that we receive list
                // const results = response.data;
                const results = [{ id: 123455543 }];
                for (let i=0; i<results.length;i++) {
                    await axios.get(`${apiUrl}/api/update-session-status?sessionId=${sessionsData[1]}&videoId=${results[i].id}`)
                        .then(function (_response) {
                            // start process for getting messages and put it to _DB
                            shell.exec(`pm2 start sessionFBcomments.js --name "FB session commentsAPI ${sessionsData[1]}" -- sessionId=${sessionsData[1]} accessToken=${tokenData[1]} providerId=${providerData[1]}`, function(code, output) {
                            });
                            // kill process
                            shell.exec(`pm2 delete "FB session videoAPI ${sessionsData[1]}"`, function(code, output) {
                            });
                        })
                        .catch(function (_error) {
                            console.log(_error.message);
                        });
                }
            })
            .catch(function (error) {
                console.log(error.message);
            });
    } catch (e) {
        console.log(e.message);
    }
}


setTimeout(await startProcess, 10000);
