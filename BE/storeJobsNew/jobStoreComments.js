import 'dotenv/config';
import axios from "axios";

const apiUrl = process.env.API_URL;
const args = process.argv;
const sessionsData = args[3].split('=');
const tokenData = args[4].split('=');
const videoData = args[2].split('=');
async function startProcess() {
    try {
        const sinceParams = await axios.get(`${apiUrl}/api/get-live-messages-comments-param?sessionId=${sessionsData[1]}`)
            .then(async function (response) {
                const sinceDate = response.data.dateComment;
                return response.data.nextUrl;
            })
            .catch(function (error) {
                console.log("error on get comment under video", error.message);
            });
console.log('SINCE', sinceParams);

        let urlComment = `https://graph.facebook.com/v21.0/${videoData[1]}/comments?fields=id,from,message,can_comment,created_time&limit=100&order=chronological&access_token=${tokenData[1]}`;
        if (sinceParams) {
            urlComment = sinceParams;
        }

        // urlComment = 'https://graph.facebook.com/v21.0/960764652744449/comments?fields=id,from,comments,message,can_comment,created_time&limit=100&order=chronological&access_token=EAArS9KI0vagBOZC8TWnq88hDab2k5Hebfn3PDNRZAjDMqG1BeF8HSxELECtkvmeZBJ9J6Pg5ZB0YFlg2acjxVzkksOiVQmA4cUD9eLN5QeeeyZBDYXO2PkkJK93BotLR3GCFDsRip7DgoTK7eHoVPZCR6T9PnrP98GsdjxXUV4Swca0iDAE0nYgki9ysqkbQOYT744HoEIDxMkPQZDZD&pretty=1&after=QVFIUjJQNzZARQkNYQ0YxQ1g5TlJYbnFGSnhPQ3VuNXpaT185NktMdlBOeXFMUVY0eXdLZAzRITm1yOExTYW1aazZALWlB4ODhTbEVqM2RHQnVNOTlwcFVXUEtR';
        await axios.get(urlComment)
            .then(async function (response) {
                const results = response.data;
                await axios
                    .post(`${apiUrl}/api/add-live-messages-new-parser?sessionId=${sessionsData[1]}`, results)
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
