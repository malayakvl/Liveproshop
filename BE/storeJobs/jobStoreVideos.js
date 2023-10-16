import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';

const apiUrl = process.env.API_URL;
const args = process.argv;
const sessionsData = args[2].split('=');
const tokenData = args[4].split('=');
const storeData = args[3].split('=');

async function startProcess() {
    // console.log(tokenData[1]);
    // console.log(`https://graph.facebook.com/v17.0/${storeData[1]}/live_videos?broadcast_status=["VOD"]&fields=broadcast_start_time,id,title&access_token=${tokenData[1]}`);
    // console.log(`with token: ${tokenData[0]}, storeId: ${tokenData[0]}`);
    // console.log(`storeId: ${storeData[0]}`);
    // console.log(args);
    try {
        console.log(`https://graph.facebook.com/v18.0/${storeData[1]}/live_videos?broadcast_status=["LIVE"]&fields=broadcast_start_time,id,title&access_token=`);
        await axios.get(`https://graph.facebook.com/v18.0/${storeData[1]}/live_videos?broadcast_status=["LIVE"]&fields=broadcast_start_time,id,title&access_token=${tokenData[1]}`)
            .then(async function (response) {
                const results = response.data.data;
                console.log(results);
                for (let i=0; i<results.length;i++) {
                    await axios.get(`${apiUrl}/api/update-store_session-status?sessionId=${sessionsData[1]}&videoId=${results[i].id}`)
                        .then(function (_response) {
                            // start process for getting messages and put it to _DB
                            shell.exec(`pm2 start jobStoreComments.js --name "jobStoreComments ${sessionsData[1]}" -- videoId=${results[i].id} sessionId=${sessionsData[1]} accessToken=${tokenData[1]} `, function(code, output) {
                            });
                            // kill process
                            shell.exec(`pm2 delete "jobStoreVideos ${sessionsData[1]}"`, function(code, output) {
                            });
                        })
                        .catch(function (_error) {
                            console.log(_error.message);
                        });
                }
            })
            .catch(function (error) {
                console.log("Error on getting live videos", error.message);
            });
    } catch (e) {
        console.log(e.message);
    }
}


setTimeout(await startProcess, 10000);
