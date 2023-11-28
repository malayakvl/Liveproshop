import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';

const apiUrl = process.env.API_URL;
const args = process.argv;
const sessionsData = args[2].split('=');
const tokenData = args[4].split('=');
const storeData = args[3].split('=');

async function startProcess() {
    try {
        await axios.get(`https://graph.facebook.com/v18.0/${storeData[1]}/live_videos?broadcast_status=["LIVE"]&fields=broadcast_start_time,id,title&access_token=${tokenData[1]}`)
            .then(async function (response) {
                const results = response.data.data;
                console.log("Getting live video", results);
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
                console.log("Error Getting Live Videos List", error.message);
            });
    } catch (e) {
        console.log(e.message);
    }
}


setTimeout(await startProcess, 10000);


// curl -i -X GET 'https://graph.facebook.com/v18.0/102950859578947/live_videos?broadcast_status=["VOD"]&fields=broadcast_start_time,id,title&&access_token=EAArS9KI0vagBO6o91fTDaVAqZB4NPgMsnGgUMRHgygY3w20DsvFFnDO1udR3JMhYFi4ImocG8qVkp5xZBNhc0vHv3a7qBMamKsiFJKi173oKxXKoaDBGZCI8P6ZCEVTq8nV1ZCKgiebwvvnEUZCZBu87dg1L5SDls2cTTEBmxzFrJocZBar2KEIhB1kUltiP3DXfkkmmbrFpJ9FO0j156ra0M80ZD'
// // curl -i -X GET \
// //  "https://graph.facebook.com/v18.0/me/live_videos?access_token=EAArS9KI0vagBO3IVwuA73ZCknQdB43ZA2FCS7BxkwhHYzB2skDUe804jxsQeJYTRLskZA0AJdEKxZC00rlIdqZCxNyRk9xZAoyv7Y3prrN4zXncFMVobk6HmzZBLLhmEnQIZCvBDS02KSFTqNYmZBY262u7x8CTz0j1BZBIFGbibQJvG5CUeOwwRsl4UNWoP93J16pD31XdS0qtzoBiOwvpe0g0gkZD"
// curl -i -X GET "https://graph.facebook.com/v18.0/102950859578947/live_videos?recipient=%7B'id'%3A%20'6179485072153047'%7D&message=%7B'text'%3A'hello1'%7D&access_token=EAArS9KI0vagBOxyP8OgwC2rQAuYsQwyN6sF4WyvhzezGZCsviMUcfVc2lTt8Ypt5P5oXvf1aunnPXl2SFGKAKQVSn0s0wvOB3ZBKj4OCGEAQRugacRZArwzq68byhrI9uxHpcqdQIZCHioAZBRAJDmvlLI1k2Gehb41HXJevZBo2LZC9vo3jL2Yt9ZCL1lhZAPJZAvo8434rm86p20Q8wVKw44abWn"
