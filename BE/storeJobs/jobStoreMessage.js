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
            // console.log(response);
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
                        let lang = 'fr';
                        if (order.message.indexOf('sold')){
                            lang = 'en';
                        }
                        if (order.free_shipping_timer) {
                            freeShippingTimer = order.free_shipping_timer.hours ?? order.free_shipping_timer.days ?? order.free_shipping_timer.minutes;
                        }
                        let msgText = '';
                        let msgTextFr = ''
                        const cntProduct = await axios(`${apiUrl}/api/get-product-qty?productId=${order.parcer_data.item}`)
                            .then(async function (data) {
                                // console.log(responseSending);
                                return data.quantity;
                            }).catch(e => {
                                console.log('Error');
                            });
                        if (cntProduct > 0) {
                            msgText = `Congrats! White Dress #${order.parcer_data.item} ${order.parcer_data.color ? order.parcer_data.color : ''} ${order.parcer_data.size} quantity ${order.parcer_data.quantity} has been added to your cart! ATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer} Check the timer, because once the time is up, your products will be automatically put back on sale PLUS! PLUS! If you order several times in the next few days, you will only be charged for shipping once! And from ${order.threshold} €, shipping is free!`;
                            msgTextFr = `Bravo! White Dress #${order.parcer_data.item} ${order.parcer_data.color ? order.parcer_data.color : ''} ${order.parcer_data.size ? order.parcer_data.size : ''} quantity ${order.parcer_data.quantity ? order.parcer_data.quantity : 1} à votre panier! https://liveproshop.com ATTENTION : La réservation de votre produit est valable uniquement durant ${orderTimer} ${typeTimer} Vérifiez le minuteur, car une fois le temps écoulé, vos produits seront automatiquement remis à la vente EN PLUS! Si vous commandez plusieurs fois dans les prochains jours, on vous facture les frais de port qu’une seule fois ! Et à partir de ${order.threshold} € ils sont offerts!`;
                        } else {
                            msgText = `We are sorry, but the product White Dress #${order.parcer_data.item} ${order.parcer_data.color ? order.parcer_data.color : ''} ${order.parcer_data.size} quantity ${order.parcer_data.quantity} is no longer available. You have been added to the waiting list and we will notify you as soon as it is available again in your cart!`;
                            msgTextFr = `Nous sommes désolés, mais le produit White Dress #${order.parcer_data.item} ${order.parcer_data.color ? order.parcer_data.color : ''} ${order.parcer_data.size ? order.parcer_data.size : ''} quantity ${order.parcer_data.quantity ? order.parcer_data.quantity : 1} n'est plus disponible. Vous avez été rajouté(e) sur la liste d’attente et nous vous avertirons dès qu’il sera à nouveau disponible dans votre panier! `;
                        }

                        const responceResultMessage =  await axios.post(
                            `https://graph.facebook.com/v18.0/me/messages`,
                            '',
                            {
                                params: {
                                    "recipient": {"comment_id": `${order.comment_id}`},
                                    "message": {"text": `${lang === 'en' ? msgText : msgTextFr}`},
                                }
                            }
                        )
                            .then(async function (responseSending) {
                                // console.log(responseSending);
                                await axios.post(
                                    `https://graph.facebook.com/v18.0/me/messages`,
                                    '',
                                    {
                                        params: {
                                            "recipient": {"comment_id": `${order.comment_id}`},
                                            "message": {"text": `${lang === 'en' ? msgText : msgText}`},
                                        }
                                    }
                                )
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
