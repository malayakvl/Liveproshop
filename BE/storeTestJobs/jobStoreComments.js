import 'dotenv/config';
import axios from "axios";

const apiUrl = process.env.API_URL;
const args = process.argv;
const sessionsData = args[3].split('=');
const testSessionData = 67;
const tokenData = args[4].split('=');
const videoData = args[2].split('=');
async function startProcess() {
    try {
console.log('TUT 1');
        const sinceParams = await axios.get(`${apiUrl}/api/get-live-messages-since?sessionId=${testSessionData}`)
            .then(async function (response) {
                const sinceDate = response.data.unixTimestamp;
                return sinceDate;
            })
            .catch(function (error) {
                console.log("error on get comment under video", error.message);
            });
console.log('TUT 2', sinceParams);
        let urlComment = `https://graph.facebook.com/v21.0/${videoData[1]}/comments?fields=id,from,comments,message,can_comment,created_time&limit=100&order=chronological&access_token=EAArS9KI0vagBO6skB2xYWPj9QvkEUHlNIJ2dOqlbGSIMAlpYndHrP4DmuZCxSkLISbU7pHYRSZBIIANiYZATUtKh99fH84VkZAvhv1snJZB8ggMrwTckJEeHUzeAZCc4riV1dtuf3aQEdH0OmDOKNDHgQk3XtWwy3j9DyFTNAeq66LLFlx60odu0g2bQ0xTZAcZD`;
        if (sinceParams) {
            const dateStr = sinceParams;
            // Convert to Unix timestamp (in seconds)
console.log(dateStr);
            const unixTimestamp = Math.floor(new Date(dateStr).getTime() / 1000);
console.log('unixTimestamp', unixTimestamp);
            urlComment = `https://graph.facebook.com/v21.0/${videoData[1]}/comments?fields=id,from,comments,message,can_comment,created_time&limit=100&since=${unixTimestamp}&order=chronological&access_token=${tokenData[1]}`;
        }
console.log('URL', urlComment);
        const result = await axios.get(urlComment)
            .then(async function (response) {
                const results = response.data.data;
console.log('Incoming Comments', results);
                try {
                    await axios
                        .post(`${apiUrl}/api/add-live-messages-test?sessionId=${testSessionData}`, results)
                        .then(() => {
                        }).catch(function (_error) {
                            console.log(_error.message);
                        });
                } catch (e) {
                    console.log('Error add messages to db')
                }
            })
            .catch(function (error) {
                console.log("error on get comment under video", error.message);
            });
    } catch (e) {
        console.log(e.message);
    }
}


setTimeout(await startProcess, 10000);
