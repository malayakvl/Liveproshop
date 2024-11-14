import 'dotenv/config';
import axios from "axios";

const apiUrl = process.env.API_URL;
const args = process.argv;
const sessionsData = args[3].split('=');
const testSessionData = 68;
const tokenData = 'EAArS9KI0vagBO8AzX0MjQrsA0VQKEElvP1wrIPfFIiFKz74NBEZBxKAwR1MrWZBs3ebggZBkNaXVjZBZCPkxvhJE5jZBBwPs5zq4gGHSJqEP6uW540hpMd4UC6V6XWisZC8E0OEHl9oaUE0dJw1wGOr87th0wiXBtqeE8DZCeboZBzlDZCtjPSsy9K1gWH5mJRwV4ZD';
const videoData = args[2].split('=');

async function startProcess() {
// console.log('Start script');
    try {
console.log('Start getting comment');
        const sinceParams = await axios.get(`${apiUrl}/api/get-live-messages-since?sessionId=${testSessionData}`)
            .then(async function (response) {
                const sinceDate = response.data.unixTimestamp;
                return sinceDate;
            })
            .catch(function (error) {
                console.log("error on get comment under video", error.message);
            });
console.log('TUT 2', tokenData[1]);
        let urlComment = `https://graph.facebook.com/v21.0/${videoData[1]}/comments?fields=id,from,comments,message,can_comment,created_time&limit=100&order=chronological&access_token=${tokenData}`;
        if (sinceParams) {
            const dateStr = sinceParams;
            // Convert to Unix timestamp (in seconds)
console.log(dateStr);
            const unixTimestamp = Math.floor(new Date(dateStr).getTime() / 1000);
console.log('unixTimestamp', unixTimestamp);
            urlComment = `https://graph.facebook.com/v21.0/${videoData[1]}/comments?fields=id,from,comments,message,can_comment,created_time&limit=100&since=${unixTimestamp}&order=chronological&access_token=${tokenData}`;
        }
console.log('URL', urlComment);
        try {
            const result = await axios.get(urlComment)
                .then(async function (response) {
                    const results = response.data.data;
console.log('Incoming Comments', results);
                    await axios
                        .post(`${apiUrl}/api/add-live-messages-new?sessionId=${testSessionData}`, results)
                        .then(() => {
                        }).catch(function (_error) {
                            console.log(_error.message);
                        });
                    // try {
                    //     await axios
                    //         .post(`${apiUrl}/api/add-live-messages-test?sessionId=${testSessionData}`, results)
                    //         .then(() => {
                    //         }).catch(function (_error) {
                    //             console.log(_error.message);
                    //         });
                    // } catch (e) {
                    //     console.log('Error add messages to db')
                    // }
                })
                .catch(function (error) {
                    console.log("error on get comment under video", error.message);
                });
        } catch (e) {
            console.log('Error get comment');
        }
    } catch (e) {
        console.log('TUT ERROR 1', e.message);
    }
}


setTimeout(await startProcess, 10000);
