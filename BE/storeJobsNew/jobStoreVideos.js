import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';
import fs from "fs";
import moment from 'moment';

const apiUrl = process.env.API_URL;
const args = process.argv;
const sessionsData = args[2].split('=');
const tokenData = args[4].split('=');
const storeData = args[3].split('=');

async function startProcess() {
    try {
        // await axios.get(`https://graph.facebook.com/v21.0/403450987175510/live_videos?broadcast_status=["VOD"]&fields=broadcast_start_time,id,title&access_token=EAArS9KI0vagBOZCtVGUwZAEYHnkV6I9tKFEGznwQoiKv0iIw16ZBlCDmVTewc2086D9zPbMZCw2tCKkS2Ln9xhdCSeZBZAuKCPGdaZAKPgqgExZBG9HpFOpsOYbrOVxwcjNXdsT3LzuHpswnSJOwQi5W2cpENJEUygZBe57yX2l7GK2z1q0DDxj48OJ2ZB5zjJfQkM7X4Ypkzmi5HkkwZDZD`)
        //     .then(async function (response) {
        //         const results = response.data.data;
        //         console.log("Getting vod videos", results);
        //     })
        //     .catch(function (error) {
        //         console.log("Error", error.response.data.error.message);
        //     });
        // let txtLog = `\n[${moment().format("DD-MM-YYYY, HH:mm:ss")}]=================Start FB Live Video API\n`
        // txtLog += `Session ID: ${sessionsData[1]}\n`;
        // txtLog += `[${moment().format("DD-MM-YYYY, HH:mm:ss")}]=================END FB Live Video APIb\n`;
        // fs.appendFile(`/var/www/BE/session_logs/${session.id}.log`, txtLog, (err) => {
        //     if(err) throw err;
        // });
// console.log(`https://graph.facebook.com/v21.0/${storeData[1]}/live_videos?broadcast_status=["LIVE"]&fields=broadcast_start_time,id,title&access_token=${tokenData[1]}`);
        await axios.get(`https://graph.facebook.com/v21.0/${storeData[1]}/live_videos?broadcast_status=["LIVE"]&fields=broadcast_start_time,id,title&access_token=${tokenData[1]}`)
            .then(async function (response) {
                const results = response.data.data;
                console.log("Getting live video", results);
                for (let i=0; i<results.length;i++) {
                    await axios.get(`${apiUrl}/api/update-store_session-status?sessionId=${sessionsData[1]}&videoId=${results[i].id}`)
                        .then(function (_response) {
                            // txtLog = `\n[${moment().format("DD-MM-YYYY, HH:mm:ss")}]=================Update record in DB\n`
                            // txtLog += `Live Video ID ${results[i].id}\n`;
                            // txtLog += `Live Video ID ${results[i].id}\n`;
                            // txtLog += `pm2 start jobStoreComments.js\n`;
                            // txtLog += `pm2 start jobStoreSender.js\n`;
                            // fs.appendFile(`/var/www/BE/session_logs/${session.id}.log`, txtLog, (err) => {
                            //     if(err) throw err;
                            // });
                            let txtLog;
                            txtLog = `\n[${moment().format("DD-MM-YYYY, HH:mm:ss")}]=================Update record in DB\n`
                            txtLog += `Live Video ID ${results[i].id}\n`;
                            txtLog += `pm2 start jobStoreComments.js\n`;
                            txtLog += `pm2 start jobStoreSender.js\n`;
                            txtLog += `[${moment().format("DD-MM-YYYY, HH:mm:ss")}]=================END Update record in DB\n`
                            fs.appendFile(`/var/www/BE/session_logs/${sessionsData[1]}.log`, txtLog, (err) => {
                                if(err) throw err;
                            });

                            // start process for getting messages and put it to _DB
                            shell.exec(`pm2 start jobStoreComments.js --name "jobStoreComments ${sessionsData[1]}" -- videoId=${results[i].id} sessionId=${sessionsData[1]} accessToken=${tokenData[1]} `, function(code, output) {
                            });

                            shell.exec(`pm2 start jobStoreSender.js --name "jobStoreSender"   `, function(code, output) {
                            });

                            // kill process
                            setTimeout(() => {
                                let txtLog1;
                                txtLog1 = `\n[${moment().format("DD-MM-YYYY, HH:mm:ss")}]=================Delete live video JOB\n`
                                txtLog1 += `pm2 delete "jobStoreVideos\n`;
                                txtLog1 += `[${moment().format("DD-MM-YYYY, HH:mm:ss")}]=================END Delete live video JOB\n`
                                fs.appendFile(`/var/www/BE/session_logs/${sessionsData[1]}.log`, txtLog1, (err) => {
                                    if(err) throw err;
                                });
                                shell.exec(`pm2 delete "jobStoreVideos ${sessionsData[1]}"`, function(code, output) {
                                });
                            }, 3000);

                            // starting sending messages

                        })
                        .catch(function (_error) {
                            console.log("Error", _error.response.data.error.message);
                        });
                }
            })
            .catch(function (error) {
                console.log("Error", error.response.data.error.message);
            });
    } catch (e) {
        console.log(e.message);
    }
}


setTimeout(await startProcess, 10000);
