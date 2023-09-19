import axios from "axios";
import 'dotenv/config';
import shell from "shelljs";
const args = process.argv;
const apiUrl = process.env.API_URL;
const sessionsData = args[2].split('=');
// const tokenData = args[3].split('=');

async function sessionLaunche() {
    // start parsing messages
    axios(`${apiUrl}/api/reply-live-messages?sessionId=${sessionsData[1]}`)
        .then((response) => {
            // console.log(response.data.data.length)
            response.data.data.forEach(async order => {
                if (order.message_id) {
                    console.log(`https://graph.facebook.com/v17.0/${order.message_id}/comments&access_token=EAArS9KI0vagBO1HuuayyF1qFOrRBJ7xooDRsV27NNQMZBWZBUZCvrdbFkUfXg9I3Or4xqH33O0w9LB5ijSyFxVQa5fYTpGyHSNEoubmLSejpsdxJkgp4uRcCk89nUdO9i3yRZCXAnZCCDb6aUAKR4UZAn3V3yWEV4BOMArDYWYYoCtcDqwLjRttDNtNsu8oElDU5iCZCWYyLLK4BYpaCgB39fEZD`);
 //                    curl -i -X POST \
 // "https://graph.facebook.com/v17.0/305776582052416_2113417975679885/comments?message=You%20can%20find%20your%20order%20by%20this%20lnk%20https%3A%2F%2Fliveproshop.com&access_token=EAArS9KI0vagBO1HuuayyF1qFOrRBJ7xooDRsV27NNQMZBWZBUZCvrdbFkUfXg9I3Or4xqH33O0w9LB5ijSyFxVQa5fYTpGyHSNEoubmLSejpsdxJkgp4uRcCk89nUdO9i3yRZCXAnZCCDb6aUAKR4UZAn3V3yWEV4BOMArDYWYYoCtcDqwLjRttDNtNsu8oElDU5iCZCWYyLLK4BYpaCgB39fEZD"
                    const response = await axios.post(
                        `https://graph.facebook.com/v17.0/${order.message_id}/comments`,
                        '',
                        {
                            params: {
                                'message': 'Your order link https://liveproshop.com',
                                'access_token': 'EAArS9KI0vagBO1HuuayyF1qFOrRBJ7xooDRsV27NNQMZBWZBUZCvrdbFkUfXg9I3Or4xqH33O0w9LB5ijSyFxVQa5fYTpGyHSNEoubmLSejpsdxJkgp4uRcCk89nUdO9i3yRZCXAnZCCDb6aUAKR4UZAn3V3yWEV4BOMArDYWYYoCtcDqwLjRttDNtNsu8oElDU5iCZCWYyLLK4BYpaCgB39fEZD'
                            }
                        }
                    );
                    // await axios.post(`https://graph.facebook.com/v17.0/${order.message_id}/comments&access_token=EAArS9KI0vagBO1HuuayyF1qFOrRBJ7xooDRsV27NNQMZBWZBUZCvrdbFkUfXg9I3Or4xqH33O0w9LB5ijSyFxVQa5fYTpGyHSNEoubmLSejpsdxJkgp4uRcCk89nUdO9i3yRZCXAnZCCDb6aUAKR4UZAn3V3yWEV4BOMArDYWYYoCtcDqwLjRttDNtNsu8oElDU5iCZCWYyLLK4BYpaCgB39fEZD`,
                    //     {"message": "Send message throw code 1212121"})
                    //     .then(async function (response) {
                    //     })
                    //     .catch(function (error) {
                    //         console.log("error on get comment under video", error.message);
                    //     });

                }
            })

        }).catch((e) => {
            console.log('here error', e);
    });
}

setTimeout(await sessionLaunche, 10000);
// curl -i -X POST "https://graph.facebook.com/v18.0/119274097938531/messages?recipient={'id':'5266537510137737'}&messaging_type=RESPONSE&message={'text':'hello,world'}&access_token=EAArS9KI0vagBO8Y0ZAcIwDgnqdj2JYeQe9UIfBCGSUu2BjATWxmZBoA90yuPrFfZCaKUOBMZB4xS4fodF87cpAB2YuZACOJZCQgVfUKhDTWZCQ2Wv0Ysmn33yGgDzA08IjG9VD3tcjP1pA7o4ZB37GmuJI0jrXs9W5vrzEFUjZAtaHVhgdw7WNBfkGFqkj4sM9OhIZAyLfy0bJAzvFIIMJbbWsSHIZD"
// curl -i -X POST "https://graph.facebook.com/119274097938531/messages?recipient={'comment_id':'305776582052416_1461397691379952'}&message={'text':'Thanks, Cindy!'}&message_type=RESPONSE&access_token=EAArS9KI0vagBOzA6B4ciQ8m3OUk3JTEcePxtK9NhYQMParGFu5vhafF9POzk3tHkPyicbGAGR5eNouHDCPO5gjVY5XjY1gkiQ6fdZCDLNi192SXLZCxlwQ8FKZAhq2ktZAvvOIjEvBx4xsZBtZChAoUDik0qEu8lBKuiOQHJo67fA5HynxiGkHFOuBRo1T44ZCquZCTcXnGKSwZARr1EMkyBwXkgZD"
//
// curl -i -X POST "https://graph.facebook.com/119274097938531/messages?recipient:{ comment_id: 305776582052416_1461397691379952 }&message:{\"text\": \"Thanks for reaching out, how can I help?\"}&access_token=EAArS9KI0vagBOzA6B4ciQ8m3OUk3JTEcePxtK9NhYQMParGFu5vhafF9POzk3tHkPyicbGAGR5eNouHDCPO5gjVY5XjY1gkiQ6fdZCDLNi192SXLZCxlwQ8FKZAhq2ktZAvvOIjEvBx4xsZBtZChAoUDik0qEu8lBKuiOQHJo67fA5HynxiGkHFOuBRo1T44ZCquZCTcXnGKSwZARr1EMkyBwXkgZD"
