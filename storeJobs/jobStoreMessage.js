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
            response.data.data.forEach(async order => {
                // console.log(order.parcer_data.message);
                if (order.message_id) {
                    const orderMessageId = order.message_id;
                    const orderFrom = order.message_id;
                    const x = order.parcer_data;
                    let lng = 'fr';
                    if (order.parcer_data.hasOwnProperty("sold")) {
                        lng = 'en';
                    }
                    console.log(`Reply/Message comment ${order.message_id}: ${order.from_id}`);
                    if (order.from_id || orderFrom && order.parcer_status === true) {
                        let typeTimer = order.order_timer.days ? 'd' : order.order_timer.hours ? 'h' : 'm';
                        let orderTimer = order.order_timer.hours ?? order.order_timer.days ?? order.order_timer.minutes;
                        let freeShippingTimer = '';
                        let freeTimer = '';
                        if (order.free_shipping_timer) {
                            freeShippingTimer = order.free_shipping_timer.hours ?? order.free_shipping_timer.days ?? order.free_shipping_timer.minutes;
                        }
                        let msgText = `Congrats! White Dress #${order.parcer_data.item} ${order.parcer_data.color ? order.parcer_data.color : ''} ${order.parcer_data.size ? order.parcer_data.size : ''} quantity ${order.parcer_data.quantity ? order.parcer_data.quantity : 1} has been added to your cart! https://liveproshop.com?comment_id=${orderFrom} ATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer} Check the timer, because once the time is up, your products will be automatically put back on sale PLUS! PLUS! If you order several times in the next few days, you will only be charged for shipping once! And from ${order.threshold} €, shipping is free!`;
                        let msgTextFr = `Bravo! White Dress #${order.parcer_data.item} ${order.parcer_data.color ? order.parcer_data.color : ''} ${order.parcer_data.size ? order.parcer_data.size : ''} quantity ${order.parcer_data.quantity ? order.parcer_data.quantity : 1} à votre panier! https://liveproshop.com?comment_id=${orderFrom} ATTENTION : La réservation de votre produit est valable uniquement durant ${orderTimer} ${typeTimer} Vérifiez le minuteur, car une fois le temps écoulé, vos produits seront automatiquement remis à la vente EN PLUS! Si vous commandez plusieurs fois dans les prochains jours, on vous facture les frais de port qu’une seule fois ! Et à partir de ${order.threshold} € ils sont offerts!`;
                        let msgTextWait = `We are sorry, but the product White Dress #${order.parcer_data.item} ${order.parcer_data.color ? order.parcer_data.color : ''} ${order.parcer_data.size ? order.parcer_data.size : ''} is no longer available. to the waiting list and we will notify you as soon as it is available again in your cart!`;
                        let msgTextWaitFr = `Nous sommes désolés, mais le produit White Dress #${order.parcer_data.item} ${order.parcer_data.color ? order.parcer_data.color : ''} ${order.parcer_data.size ? order.parcer_data.size : ''} n'est plus disponible. Vous avez été rajouté(e) sur la liste d’attente et nous vous avertirons dès qu’il sera à nouveau disponible dans votre panier! `;


                        const responceResultMessage =  await axios.post(
                            `https://graph.facebook.com/v18.0/me/messages`,
                            '',
                            {
                                params: {
                                    "recipient": {"comment_id": `${orderFrom}`},
                                    "message": {"text": `${lng == 'en' ? msgText : msgTextFr}`},
                                    "access_token":`${tokenData[1]}`
                                }
                            }
                        )
                            .then(async function (responseSending) {
                                console.log(responseSending);
                                return responseSending;
                            }).catch(e => {
                                console.log('Error Send Message Yobany v rot:');
                                console.log(e);
                                // console.log(e.error.error.message);
                            });
                    } else {
                       // let msgTextWrong = `Sorry, we could not find the keyword (reference / size / color / etc.) you were asking for. Here are some examples of correct comments: SOLD 14 green SOLD 169 M SOLD 35 beige check that you have typed the keyword correctly. `;
                       // const responceResultMessage =  await axios.post(
                       //      `https://graph.facebook.com/v18.0/me/messages`,
                       //      '',
                       //      {
                       //          params: {
                       //              "recipient": {"comment_id": `${orderFrom}`},
                       //              "message": {"text": `${msgTextWrong}`},
                       //              "access_token":`${tokenData[1]}`
                       //          }
                       //      }
                       //  )
                       //      .then(async function (responseSending) {
                       //          return responseSending;
                       //      }).catch(e => {
                       //          console.log('Error Here:');
                       //          // console.log(e.error.error.message);
                       //      });


                    }
                }
            })

        }).catch((e) => {
            // console.log('error sending reply message', e,error.error.message);
        });
}

setTimeout(await sessionLaunche, 10000);
