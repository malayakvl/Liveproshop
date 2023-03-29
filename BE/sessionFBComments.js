import 'dotenv/config';
import axios from "axios";
import moment from 'moment';
// import shell from 'shelljs';

const apiUrl = process.env.API_URL;
const args = process.argv;

const sessionsData = args[2].split('=');
const tokenData = args[3].split('=');
const providerData = args[4].split('=');

async function startProcess() {
    console.log(`Getting video comments for sessionId: ${sessionsData[1]}, with token: ${tokenData[1]}, provider: ${providerData[1]}`);
    try {
        await axios.get(`https://streaming-graph.facebook.com/{live-video-id}/live_comments?comment_rate=one_hundred_per_second&fields=from{email,name,id},message&access_token=${tokenData[1]}`)
            .then(async function (response) {
                // imagine that we receive list
                const results = response.data;
                // const results = [
                //     {
                //         id: moment().valueOf(),
                //         message: 'Hello',
                //         from: { name: `Test ${moment().valueOf()}`, id: moment().valueOf() },
                //         created_time: moment.utc().valueOf()
                //     },
                //     {
                //         id: moment().valueOf(),
                //         message: 'Hello',
                //         from: { name: `Test ${moment().valueOf()}`, id: moment().valueOf() },
                //         created_time: moment.utc().valueOf()
                //     },
                //     {
                //         id: moment().valueOf(),
                //         message: 'Hello',
                //         from: { name: `Test ${moment().valueOf()}`, id: moment().valueOf() },
                //         created_time: moment.utc().valueOf()
                //     },
                //     {
                //         id: moment().valueOf(),
                //         message: 'Hello',
                //         from: { name: `Test ${moment().valueOf()}`, id: moment().valueOf() },
                //         created_time: moment.utc().valueOf()
                //     }
                // ];
                await axios
                    .post(`${apiUrl}/api/add-live-messages?sessionId=${sessionsData[1]}`, results)
                    .then(() => {
                        console.log('data was inserted');
                    }).catch(function (_error) {
                        console.log(_error.message);
                    });
            })
            .catch(async function (error) {
                console.log(error.message);
                const results = [
                    {
                        id: moment().valueOf(),
                        message: 'Hello',
                        from: { name: `Test ${moment().valueOf()}`, id: moment().valueOf() },
                        created_time: moment.utc().valueOf()
                    },
                    {
                        id: moment().valueOf(),
                        message: 'Hello',
                        from: { name: `Test ${moment().valueOf()}`, id: moment().valueOf() },
                        created_time: moment.utc().valueOf()
                    },
                    {
                        id: moment().valueOf(),
                        message: 'Hello',
                        from: { name: `Test ${moment().valueOf()}`, id: moment().valueOf() },
                        created_time: moment.utc().valueOf()
                    },
                    {
                        id: moment().valueOf(),
                        message: 'Hello',
                        from: { name: `Test ${moment().valueOf()}`, id: moment().valueOf() },
                        created_time: moment.utc().valueOf()
                    }
                ];
                await axios
                    .post(`${apiUrl}/api/add-live-messages?sessionId=${sessionsData[1]}`, results)
                    .then(() => {
                        console.log('data was inserted');
                    }).catch(function (_error) {
                        console.log(_error.message);
                    });
            });
    } catch (e) {
        console.log(e.message);
    }
}


setTimeout(await startProcess, 10000);
