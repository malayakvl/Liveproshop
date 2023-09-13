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
// 317742454138657_322466790440486
//
// setTimeout(await startProcess, 10000);
// curl -i -X POST "https://graph.facebook.com/v17.0/113005221897361/messages?recipient={'id':'317742454138657'}&messaging_type=RESPONSE&message={'text':'hello,world'}&access_token=EAArS9KI0vagBO6uz4aYBG9USdf26O95oE09jz7UaoOJZAZAjfu0B3ZB2NwGlOF0ZAc1Dl6bmsJVXs98zbiAIfl3kyYe6TCwmjE6wCyYNC91q6UnZCw4oqpIsPlX9jUfMObxASidXo597VaLwQtbt6ULqjukJ20l8kdbqvVhotGIttyde1nvpJVEwRSj2klIvTsK1cbdsQx0ruZAFam5XonA8AZD"
//
//
//
// curl -X POST -H "Content-Type: application/json" -d '{
// "recipient":{
//     "id":"6524494434302873"
// },
// "messaging_type": "RESPONSE",
//     "message":{
//     "text":"Sending Message FROM CURL"
// }
// }' "https://graph.facebook.com/v17.0/121167871079469/messages?access_token=EAArS9KI0vagBOzgGM4qv4Kwag2hvJIfKpGNkYU0Kb88Jpa9zkO6MmEb7fY3nyZBYr4x2wovvJrGWgQgT42FgViLp65HgZAPZAexjPXi91cZBZAw1ckZADOZBX2wfp8vwj8uLY8t9ipN1pn1UScU8S3osbVLAWLE7Kr5ZCSexjZBgZBc5bN0XvvAXvLSkzhZBjXZBW4nndVL0HRXlMjOtzyLblXCjz8ZCWz3uTgXovRP918TxMspBr8Vu0azcy0ayEBT4hqgZDZD"
//
// curl -i -X POST 'https://graph.facebook.com/v17.0/121167871079469/messages?recipient={'id":"2763630843946760"}&messaging_type=RESPONSE&message={"text":"Ho ho'}&access_token=EAArS9KI0vagBO5KYjprTV7ZCBTFZBBc4YQCcuHZAoxfkQZA0o0QMIlqdgqfHxJKU9T71ua9bOtvzfLqPKbV2RVN0M2yGFZA9nhtcNHG2BJ6EuVzAXz4ZATFs5DU11M0ZBmaiHeSdcrKk8ZBFGZAxgSbz5eg6JZCnXgnjsY285689r5nrsyzanQk54IPeKdv1qEYRE4iFy0qafcrCdQjCk43v0XDH8ZD'
