import axios from "axios";
import 'dotenv/config';
import shell from "shelljs";
const args = process.argv;
const apiUrl = process.env.API_URL;
const sessionsData = args[2].split('=');
const storeData = args[3].split('=');
const tokenData = args[4].split('=');


// curl -i -X POST "https://graph.facebook.com/134773596380836/messages?recipient={'comment_id':'281006991455265_658980583001932'}&message={'text':'Thanks, Cindy!'}&message_type=RESPONSE&access_token=EAArS9KI0vagBOzv0dNkCUgcCvCysoHGS4VIqZBdZAv3GDlKoKmKyhqBZBSlZBH79EgRsntfQwSnkZAFrOuknjXOnJDi3U8tjY0OH2SGcjWAw4k8ZA6D3XAicQ6my5yP4wdsW6BLZBad5WV11XiWkujJZA3wICEzlP7cWaIBkhKOqQw0XND7Wa32nL0lH5lELdBmPZA3dEiNN2rfKCI1l1FLZBwlGgZD"

async function sessionLaunche() {
    // start parsing messages
    await axios(`${apiUrl}/api/reply-live-messages?sessionId=${sessionsData[1]}`)
        .then((response) => {
            response.data.data.forEach(async order => {
                if (order.message_id) {
                    const orderMessageId = order.message_id;
                    const orderFrom = order.message_id;
                    console.log(`Reply/Message comment ${order.message_id}: ${order.from_id}`);
                    if (order.from_id && order.parcer_status === true) {
                        // const product = await
                        const msgText = `Congrats! Item Ref ${order.parcer_data.item} ${order.parcer_data.color ? order.parcer_data.color : ''} ${order.parcer_data.size} quantity ${order.parcer_data.quantity} has been added to your cart! https://liveproshop.com So user can click and see his cart. ATTENTION: The reservation of your product is only valid for X minutes / hours / days Check the timer, because once the time is up, your products will be automatically put back on sale PLUS! If you order several times in the next few days, you will only be charged for shipping once! And from X €, shipping is free!`;
                        const msgTextNew = `Congrats! XXXX (example: Sleeveless Jacket) has been added to your cart! https://liveproshop.com ATTENTION: The reservation of your product is only valid for X minutes / hours / days Check the timer, because once the time is up, your products will be automatically put back on sale  PLUS! If you order several times in the next few days, you will only be charged for shipping once! And from X €, shipping is free!`;
                        console.log(msgText);
                        // const responceResultMessage =  await axios.post(
                        //     `https://graph.facebook.com/v18.0/${storeData[1]}/messages`,
                        //     '',
                        //     {
                        //         params: {
                        //             'recipient': {'id': order.from_id},
                        //             'message': `{'text': '${msgText}'}`,
                        //             'access_token': `${tokenData[1]}`
                        //         }
                        //     }
                        // )
                        //     .then(async function (responseSending) {
                        //         return responseSending;
                        //     }).catch(e => {
                        //         console.log(e.message);
                        //     });
                        await axios(`${apiUrl}/api/update-parsed-message?messageId=${orderMessageId}&replyId=${responceResultMessage.data.message_id}`)
                            .then( (response) => {

                            });
                    } else {

                    }
                    // const responceResult =  await axios.post(
                    //         `https://graph.facebook.com/v18.0/${order.message_id}/comments`,
                    //         '',
                    //         {
                    //             params: {
                    //                 'message': `Your order link https://liveproshop.com?token_key=${orderMessageId}`,
                    //                 'access_token': tokenData[1]
                    //             }
                    //         }
                    //     )
                    //     .then(async function (responseSending) {
                    //         return responseSending.data.id;
                    //     }).catch(e => {
                    //         console.log(e.data.message);
                    //     });
                    //     console.log(`${orderMessageId}: ${responceResult}`)
                    //     await axios(`${apiUrl}/api/update-parsed-message?messageId=${orderMessageId}&replyId=${responceResult}`)
                    //         .then( (response) => {
                    //
                    //         });
                }
            })

        }).catch((e) => {
            console.log('error sending reply message', e);
    });
}

setTimeout(await sessionLaunche, 10000);
// curl -i -X POST "https://graph.facebook.com/v18.0/119274097938531/messages?recipient={'id':'5266537510137737'}&messaging_type=RESPONSE&message={'text':'hello,world'}&access_token=EAArS9KI0vagBO8Y0ZAcIwDgnqdj2JYeQe9UIfBCGSUu2BjATWxmZBoA90yuPrFfZCaKUOBMZB4xS4fodF87cpAB2YuZACOJZCQgVfUKhDTWZCQ2Wv0Ysmn33yGgDzA08IjG9VD3tcjP1pA7o4ZB37GmuJI0jrXs9W5vrzEFUjZAtaHVhgdw7WNBfkGFqkj4sM9OhIZAyLfy0bJAzvFIIMJbbWsSHIZD"
// curl -i -X POST "https://graph.facebook.com/119274097938531/messages?recipient={'comment_id':'305776582052416_1461397691379952'}&message={'text':'Thanks, Cindy!'}&message_type=RESPONSE&access_token=EAArS9KI0vagBOzA6B4ciQ8m3OUk3JTEcePxtK9NhYQMParGFu5vhafF9POzk3tHkPyicbGAGR5eNouHDCPO5gjVY5XjY1gkiQ6fdZCDLNi192SXLZCxlwQ8FKZAhq2ktZAvvOIjEvBx4xsZBtZChAoUDik0qEu8lBKuiOQHJo67fA5HynxiGkHFOuBRo1T44ZCquZCTcXnGKSwZARr1EMkyBwXkgZD"
//
// curl -i -X POST "https://graph.facebook.com/119274097938531/messages?recipient:{ comment_id: 305776582052416_1461397691379952 }&message:{\"text\": \"Thanks for reaching out, how can I help?\"}&access_token=EAArS9KI0vagBOzA6B4ciQ8m3OUk3JTEcePxtK9NhYQMParGFu5vhafF9POzk3tHkPyicbGAGR5eNouHDCPO5gjVY5XjY1gkiQ6fdZCDLNi192SXLZCxlwQ8FKZAhq2ktZAvvOIjEvBx4xsZBtZChAoUDik0qEu8lBKuiOQHJo67fA5HynxiGkHFOuBRo1T44ZCquZCTcXnGKSwZARr1EMkyBwXkgZD"


// curl -i -X POST 'https://graph.facebook.com/v18.0/121167871079469/messages?recipient={"id":"1454620165082335_338495701952081"}&messaging_type=RESPONSE&message={"text":"Ho ho"}&access_token=EAArS9KI0vagBO8jbkIBlUxJWcYUFRQcdHGm3o9yEiibfsZAHwTCiSf4sIaUTVyGzNdAWN1fk2xL7T3U5ZCiNPdhioDETpZC1THZCpzFIngCu1as8vbtGF4cNXusfkzQlZCDPklE9qTExeQFQitZCEXlAQgJcT1Ry3zHzKFOEqUMg7LPBbpqXsIUuk1iBwe6z3hVQlprwyfTMfOw8kJ6LR49eVxVewhDKr6QAr0QyCPCE3hT7M7a89D33wk1oSCQQZDZD'


// curl -i -X POST "https://graph.facebook.com/18.0/159422623910969/messages?recipient={'id':'6882797135114788'}&messaging_type=RESPONSE&message={'text':'hello,world'} &access_token=EAArS9KI0vagBOx4c2vfP5RZB1W9hqcQQi2QItAtgHEF8yMoIjD4nIqVgn9pq4T1syl6AmSGpeJLCLio1se36gZCSDKEejn5SHhm1KnMSQH4109sU0seDSuz2nYcMRhUwOUyZBc68taTVZC6IfjDUpNYWwEF1ZCJLVV7AW737O5F7zmFZArcmDmXzU3JgyNigwfCnYdSmhSD88Ei0Q6YMgnafiZB7KAhmfAZD
