import axios from "axios";
import 'dotenv/config';
import shell from "shelljs";
const args = process.argv;
const apiUrl = process.env.API_URL;
const sessionsData = args[2].split('=');
const storeData = args[3].split('=');
const tokenData = args[4].split('=');


async function sessionLaunche() {
    // start parsing messages
    await axios(`${apiUrl}/api/reply-live-messages?sessionId=${sessionsData[1]}`)
        .then((response) => {
            console.log(response);
            response.data.data.forEach(async order => {
                // console.log(order);
                if (order.message_id) {
                    console.log(`Message comment ${order.message_id}: ${order.from_id}`);
                    const orderMessageId = order.message_id;
                    const orderFrom = order.message_id;
                    if ((order.from_id || order.message_id) && order.parcer_status === true ) {
                        let typeTimer = order.order_timer.days ? 'd' : order.order_timer.hours ? 'h' : 'm';
                        let orderTimer = order.order_timer.hours ?? order.order_timer.days ?? order.order_timer.minutes;
                        let freeShippingTimer = '';
                        let freeTimer = '';
                        if (order.free_shipping_timer) {
                            freeShippingTimer = order.free_shipping_timer.hours ?? order.free_shipping_timer.days ?? order.free_shipping_timer.minutes;
                        }
                        let msgText = `Congrats! Red shirt #${order.parcer_data.item} ${order.parcer_data.color ? order.parcer_data.color : ''} ${order.parcer_data.size} quantity ${order.parcer_data.quantity} has been added to your cart! ATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer} Check the timer, because once the time is up, your products will be automatically put back on sale PLUS! PLUS! If you order several times in the next few days, you will only be charged for shipping once! And from ${order.threshold} €, shipping is free!`;
                        const responceResultMessage =  await axios.post(
                            `https://graph.facebook.com/v18.0/me/messages`,
                            '',
                            {
                                params: {
                                    "recipient": {"comment_id": `${order.comment_id}`},
                                    "message": {"text": `${msgText}`},
                                }
                            }
                        )
                            .then(async function (responseSending) {
                                // console.log(responseSending);
                                return responseSending;
                            }).catch(e => {
                                console.log('Error');
                                // console.log(e.message);
                            });
                    } else {
                        console.log(`Reply comment ${order.message_id}: ${order.from_id}`);
                    }
                }
            })

        }).catch((e) => {
            console.log('error sending reply message', e);
        });
}

setTimeout(await sessionLaunche, 10000);
