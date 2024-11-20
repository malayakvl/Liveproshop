import 'dotenv/config';
import axios from "axios";

const apiUrl = process.env.API_URL;
const args = process.argv;
const sessionsData = args[3].split('=');
const testSessionData = 72;
const tokenData = 'EAArS9KI0vagBO2n48wfmwMMiV2aA5xKZCRZC5yYPKo4GXJh2KYpsR2OV2QXFsm0sJAUC0Hp3vw2vDOUByjSbHKUZBOOnZBsoxTTaaFaqL7y5DbSmLu0dL28WXSkR8XenQDWGvbZAFUQPKmjZC2YqnaMViAhZCRBhAZAujizY9rlIWpSyWbjNZAo9gK8MZAJIwS5ycZD';
// const tokenData = 'EAArS9KI0vagBO8AzX0MjQrsA0VQKEElvP1wrIPfFIiFKz74NBEZBxKAwR1MrWZBs3ebggZBkNaXVjZBZCPkxvhJE5jZBBwPs5zq4gGHSJqEP6uW540hpMd4UC6V6XWisZC8E0OEHl9oaUE0dJw1wGOr87th0wiXBtqeE8DZCeboZBzlDZCtjPSsy9K1gWH5mJRwV4ZD';
const videoData = args[2].split('=');

//https://graph.facebook.com/v21.0/122184380186041438/comments?fields=id,from,comments,message,can_comment,created_time&limit=2&order=chronological&access_token=EAArS9KI0vagBO8AzX0MjQrsA0VQKEElvP1wrIPfFIiFKz74NBEZBxKAwR1MrWZBs3ebggZBkNaXVjZBZCPkxvhJE5jZBBwPs5zq4gGHSJqEP6uW540hpMd4UC6V6XWisZC8E0OEHl9oaUE0dJw1wGOr87th0wiXBtqeE8DZCeboZBzlDZCtjPSsy9K1gWH5mJRwV4ZD&pretty=1&after=QVFIUmVKeHpUSEQxYnNkd3pORDJYSWlnWklBejJ4N3RMMUtSQmxSRk9RTS1HX2RUdXFqTjc1OE1saGdmSmpTSkZATcU10R2tMYnhoR0pnRGY3ZADlXenVJVVBn


//https://graph.facebook.com/v21.0/122184380186041438/comments?fields=id,from,comments,message,can_comment,created_time&limit=2&order=chronological&access_token=EAArS9KI0vagBO8AzX0MjQrsA0VQKEElvP1wrIPfFIiFKz74NBEZBxKAwR1MrWZBs3ebggZBkNaXVjZBZCPkxvhJE5jZBBwPs5zq4gGHSJqEP6uW540hpMd4UC6V6XWisZC8E0OEHl9oaUE0dJw1wGOr87th0wiXBtqeE8DZCeboZBzlDZCtjPSsy9K1gWH5mJRwV4ZD
// &pretty=1&
// before=QVFIUmxxeklrdGR3QzA5eHF5TWFxaVNHMXEzYllGWjdpdTA2SWIzcTJyRVA1Qm1ZAM0pJeEVLeWJ3QzRVSzJhbTlPQ1ZAYdG8wQlozaDJLN09FT0tFbzZAXRm13


async function startProcess() {
// console.log('Start script');
    try {
        let sinceDate, urlNext;
// console.log('Start getting comment');
        const commentParams = await axios.get(`${apiUrl}/api/get-live-messages-comments-param?sessionId=${testSessionData}`)
            .then(async function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log("error on get comment under video", error.message);
            });
        let urlComment;
        if (commentParams.data.dateComment) {
            urlComment = commentParams.data.dateComment;
        } else {
            // urlComment = `https://graph.facebook.com/v21.0/122184562124041438/comments?fields=id,from,comments,message,can_comment,created_time&limit=50&order=chronological&access_token=${tokenData}`;
            urlComment = `https://graph.facebook.com/v21.0/122184895934041438/comments?fields=id,from,comments,message,can_comment,created_time&limit=5&order=chronological&access_token=${tokenData}`;
        }
        try {
            const result = await axios.get(urlComment)
                .then(async function (response) {
                    const results = response.data;
console.log('COMMENTS', response.data.data);
                    await axios
                        .post(`${apiUrl}/api/add-live-messages-new?sessionId=${testSessionData}`, results)
                        .then(() => {
                        }).catch(function (_error) {
                            console.log(_error.message);
                        });
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
