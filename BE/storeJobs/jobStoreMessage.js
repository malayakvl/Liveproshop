import axios from "axios";
import 'dotenv/config';
import shell from "shelljs";
const args = process.argv;
const apiUrl = process.env.API_URL;
const sessionsData = args[2].split('=');
// const storeData = args[3].split('=');
// const tokenData = args[4].split('=');


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
                        // console.log(order);
                        let typeTimer = order.order_timer.days ? 'd' : order.order_timer.hours ? 'h' : 'm';
                        let orderTimer = order.order_timer.hours ?? order.order_timer.days ?? order.order_timer.minutes;
                        // const msgText = `Congrats! ${order.product_name} #${order.parcer_data.item} ${order.parcer_data.color ? order.parcer_data.color : ''} ${order.parcer_data.size} quantity ${order.parcer_data.quantity} has been added to your cart! https://liveproshop.com So user can click and see his cart. ATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer} Check the timer, because once the time is up, your products will be automatically put back on sale PLUS! If you order several times in the next few days, you will only be charged for shipping once! And from X €, shipping is free!`;
                        let freeShippingTimer = '';
                        let freeTimer = '';
                        if (order.free_shipping_timer) {
                            freeShippingTimer = order.free_shipping_timer.hours ?? order.free_shipping_timer.days ?? order.free_shipping_timer.minutes;
                        }

                        const msgText1 = `Congrats! ${order.product_name} #${order.parcer_data.item} ${order.parcer_data.color ? order.parcer_data.color : ''} ${order.parcer_data.size} quantity ${order.parcer_data.quantity} has been added to your cart!`;
                        const msgText2 = `ATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer} Check the timer, because once the time is up, your products will be automatically put back on sale PLUS!`;
                        const msgText3 = `PLUS! If you order several times in the next few days, you will only be charged for shipping once! And from ${order.threshold} €, shipping is free!`;
                        console.log(msgText1);
                        console.log(msgText2);
                        console.log(msgText3);

                        // const msgTextNew = `Congrats! XXXX (example: Sleeveless Jacket) has been added to your cart! https://liveproshop.com ATTENTION: The reservation of your product is only valid for X minutes / hours / days Check the timer, because once the time is up, your products will be automatically put back on sale  PLUS! If you order several times in the next few days, you will only be charged for shipping once! And from X €, shipping is free!`;
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
                        // await axios(`${apiUrl}/api/update-parsed-message?messageId=${orderMessageId}&replyId=${responceResultMessage.data.message_id}`)
                        //     .then( (response) => {
                        //
                        //     });
                    } else {

                    }
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
