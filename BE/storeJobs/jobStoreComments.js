import 'dotenv/config';
import axios from "axios";

const apiUrl = process.env.API_URL;
const args = process.argv;
const sessionsData = args[3].split('=');
const tokenData = args[4].split('=');
const videoData = args[2].split('=');
async function startProcess() {
    try {
        const sinceParams = await axios.get(`${apiUrl}/api/get-live-messages-since?sessionId=${sessionsData[1]}`)
            .then(async function (response) {
                const sinceDate = response.data.unixTimestamp;
                console.log('Since', sinceDate);
                return sinceDate;
            })
            .catch(function (error) {
                console.log("error on get comment under video", error.message);
            });
        console.log('SINCE PARAMS FOR COMMENTS', sinceParams);
        let urlComment = `https://graph.facebook.com/v21.0/${videoData[1]}/comments?fields=id,from,comments,message,can_comment,created_time&limit=100&order=chronological&access_token=${tokenData[1]}`;
        if (sinceParams) {
            const dateStr = sinceParams;
            // Convert to Unix timestamp (in seconds)
            const unixTimestamp = Math.floor(new Date(dateStr).getTime() / 1000);

            urlComment = `https://graph.facebook.com/v21.0/${videoData[1]}/comments?fields=id,from,comments,message,can_comment,created_time&limit=100&order=chronological&access_token=${tokenData[1]}`;
        }
// console.log(`https://graph.facebook.com/v21.0/122184562124041438/comments?fields=id,from,comments,message,can_comment,created_time&limit=100&order=chronological&access_token=EAArS9KI0vagBO2n48wfmwMMiV2aA5xKZCRZC5yYPKo4GXJh2KYpsR2OV2QXFsm0sJAUC0Hp3vw2vDOUByjSbHKUZBOOnZBsoxTTaaFaqL7y5DbSmLu0dL28WXSkR8XenQDWGvbZAFUQPKmjZC2YqnaMViAhZCRBhAZAujizY9rlIWpSyWbjNZAo9gK8MZAJIwS5ycZD`)
// console.log(urlComment);
// exit;
        await axios.get(urlComment)
            .then(async function (response) {
                const results = response.data.data;
console.log('Incoming Comments', response.data?.data);
                await axios
                    .post(`${apiUrl}/api/add-live-messages-new?sessionId=${sessionsData[1]}`, results)
                    .then(() => {
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
