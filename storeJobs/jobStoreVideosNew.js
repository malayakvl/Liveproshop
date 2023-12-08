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
        console.log(`https://graph.facebook.com/v18.0/me/live_videos?broadcast_status=["VOD"]&fields=broadcast_start_time,id,title&access_token=${tokenData[1]}`);
        await axios.get(`https://graph.facebook.com/v18.0/me/live_videos?broadcast_status=["VOD"]&fields=broadcast_start_time,id,title&access_token=${tokenData[1]}`)
            .then(async function (response) {
                const results = response.data.data;
                console.log("Getting live video throw me", results);
                // for (let i=0; i<results.length;i++) {
                //     await axios.get(`${apiUrl}/api/update-store_session-status?sessionId=${sessionsData[1]}&videoId=${results[i].id}`)
                //         .then(function (_response) {
                //             // start process for getting messages and put it to _DB
                //             shell.exec(`pm2 start jobStoreComments.js --name "jobStoreComments ${sessionsData[1]}" -- videoId=${results[i].id} sessionId=${sessionsData[1]} accessToken=${tokenData[1]} `, function(code, output) {
                //             });
                //             // kill process
                //             shell.exec(`pm2 delete "jobStoreVideos ${sessionsData[1]}"`, function(code, output) {
                //             });
                //         })
                //         .catch(function (_error) {
                //             console.log(_error.message);
                //         });
                // }
            })
            .catch(function (error) {
                console.log("Error Getting Live Videos List", error.response.data.error.message);
            });
    } catch (e) {
        console.log("Error", e.error.data);
    }
}


setTimeout(await startProcess, 10000);


// curl -i -X GET 'https://graph.facebook.com/v18.0/159422623910969/live_videos?broadcast_status=["VOD"]&fields=broadcast_start_time,id,title&&access_token=EAArS9KI0vagBOxUp4PvAATjkDW5n7f51VzEsJEOnJWL1qVoyAvH7ZCw2yCE0tbd5uZAT7LzDHOpkgMsZBYeXnP4Pj8H5P6yt9yDjzZArZBP7Wz0XMpOhPRUiJRa6kv2oCOflZAEk0KnGG1Xj1Qo8GuiuYAZB78ofQKCe4zN6cYKCZA0eUPx47FkZAGXZC6v6q9wm2eFP5GnDmpQbd23Mxz5fhfqNsZD'
// curl -i -X GET \
//  "https://graph.facebook.com/v18.0/me/live_videos?access_token=EAArS9KI0vagBO3IVwuA73ZCknQdB43ZA2FCS7BxkwhHYzB2skDUe804jxsQeJYTRLskZA0AJdEKxZC00rlIdqZCxNyRk9xZAoyv7Y3prrN4zXncFMVobk6HmzZBLLhmEnQIZCvBDS02KSFTqNYmZBY262u7x8CTz0j1BZBIFGbibQJvG5CUeOwwRsl4UNWoP93J16pD31XdS0qtzoBiOwvpe0g0gkZD"
