import axios from "axios";
import 'dotenv/config';
import shell from "shelljs";
import slugify from "slugify";
const args = process.argv;
const apiUrl = process.env.API_URL;
const sessionsData = args[2].split('=');
const storeData = args[3].split('=');
const tokenData = args[4].split('=');


async function sessionLaunche() {
    // start parsing messages
    console.log('here');
    await axios(`${apiUrl}/api/reply-live-messages?sessionId=${sessionsData[1]}`)
        .then((response) => {
            response.data.data.forEach(async message => {
                if (message.message_id) {
                    const orderMessageId = message.message_id;
                    const orderFrom = message.message_id;
                    const x = message.parcer_data;
                    let lng = 'fr';
                    if (message.parcer_data.hasOwnProperty("sold")) {
                        lng = 'en';
                    }
                    console.log(`Reply/Message comment ${message.message_id}: ${message.from_id}`);
                    if (message.from_id || orderFrom && message.parcer_status === true) {
                        let typeTimer = message.order_timer.days ? 'd' : message.order_timer.hours ? 'h' : 'm';
                        let orderTimer = message.order_timer.hours ?? message.order_timer.days ?? message.order_timer.minutes;
                        let freeShippingTimer = '';
                        if (message.free_shipping_timer) {
                            freeShippingTimer = message.free_shipping_timer.hours ?? message.free_shipping_timer.days ?? message.free_shipping_timer.minutes;
                        }
                        let msgText;
                        let msgTextFr;
                        const slgStoreName = slugify(message.store_name, {
                            replacement: '-',  // replace spaces with replacement character, defaults to `-`
                            remove: undefined, // remove characters that match regex, defaults to `undefined`
                            lower: true,      // convert to lower case, defaults to `false`
                            strict: false,     // strip special characters except replacement, defaults to `false`
                            locale: 'vi',      // language code of the locale to use
                            trim: true         // trim leading and trailing replacement chars, defaults to `true`
                        })


                        // before send message check order status about wait
                        const statusWaitItem = await axios(`${apiUrl}/api/check-wait-status?comment_id=${message.message_id}`)
                            .then( (response) => {
                                return response.data.result;
                            }).catch(e => {
                                console.log(e);
                            });
console.log('STATUS WAIT', statusWaitItem);
console.log('ORDER STATUS', message.order_status);
console.log("active1", message.active_product);
console.log("active2", message.activeProduct);
                        if (message.order_status === true && message.active_product === true) {
                            if (statusWaitItem) {
                                msgText = `We are sorry, but the product ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} is no longer available.\n\nYou have been added to the waiting list and we will notify you as soon as it is available again in your cart!`;
                                msgTextFr = `Nous sommes désolés, mais le produit ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} n'est plus disponible.\n\nVous avez été rajouté(e) sur la liste d’attente et nous vous avertirons dès qu’il sera à nouveau disponible dans votre panier!`;
                            } else {
                                msgText = `Congrats! ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} quantity ${message.parcer_data.quantity ? message.parcer_data.quantity : 1} has been added to your cart!\n\nhttps://liveproshop.com/en/fb-order/${slgStoreName}?comment_id=${orderFrom}\n\nATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer}\n\nCheck the timer, because once the time is up, your products will be automatically put back on sale\n\nPLUS! If you order several times in the next few days, you will only be charged for shipping once! And from ${message.threshold} €, shipping is free!`;
                                msgTextFr = `Bravo! ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} quantité ${message.parcer_data.quantity ? message.parcer_data.quantity : 1} a été ajouté(e) à votre panier !\n\nhttps://liveproshop.com/fb-order/${slgStoreName}?comment_id=${orderFrom}\n\nATTENTION : La réservation de votre produit est valable uniquement durant ${orderTimer} ${typeTimer}\n\nVérifiez le minuteur, car une fois le temps écoulé, vos produits seront automatiquement remis à la vente\n\nEN PLUS! Si vous commandez plusieurs fois dans les prochains jours, on vous facture les frais de port qu’une seule fois ! Et à partir de ${message.threshold} €, ils sont offerts!`;
                            }
                            // we can parce message and find product
                            // msgText = `Congrats! ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} quantity ${message.parcer_data.quantity ? message.parcer_data.quantity : 1} has been added to your cart!\n\nhttps://liveproshop.com/en/auth/signup?storeName=ahead_fashion&comment_id=${orderFrom}\n\nATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer}\n\nCheck the timer, because once the time is up, your products will be automatically put back on sale\n\nPLUS! If you order several times in the next few days, you will only be charged for shipping once! And from ${message.threshold} €, shipping is free!`;
                            // msgTextFr = `Bravo! ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} quantité ${message.parcer_data.quantity ? message.parcer_data.quantity : 1} a été ajouté(e) à votre panier !\n\nhttps://liveproshop.com/auth/signup?storeName=ahead_fashion&comment_id=${orderFrom}\n\nATTENTION : La réservation de votre produit est valable uniquement durant ${orderTimer} ${typeTimer}\n\nVérifiez le minuteur, car une fois le temps écoulé, vos produits seront automatiquement remis à la vente\n\nEN PLUS! Si vous commandez plusieurs fois dans les prochains jours, on vous facture les frais de port qu’une seule fois ! Et à partir de ${message.threshold} €, ils sont offerts!`;
                        } else {
                            // we parce messege but not found product
                            if (statusWaitItem) {
                                msgText = `We are sorry, but the product ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} is no longer available.\n\nYou have been added to the waiting list and we will notify you as soon as it is available again in your cart!`;
                                msgTextFr = `Nous sommes désolés, mais le produit ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} n'est plus disponible.\n\nVous avez été rajouté(e) sur la liste d’attente et nous vous avertirons dès qu’il sera à nouveau disponible dans votre panier!`;
                            } else {
                                msgText = `Sorry, we could not find the keyword (reference / size / color / etc.) you were asking for.\n\nHere are some examples of correct comments:\n\nSOLD 14 green\n\nSOLD 169 M\n\nSOLD 35 beige M\n\nPlease check that you have typed the keyword correctly.`;
                                msgTextFr = `Désolés, nous n'avons pas pu trouver le mot clé (référence / taille / couleur / etc.) que vous demandiez.\n\nVoici quelques exemples de commentaires corrects:\n\nVENDU 14 vert\n\nVENDU 169 M\n\nVENDU 35 beige M\n\nMerci de vérifier que vous avez correctement tapé le mot-clé.`;
                            }
                        }
                        // if (statusWaitItem) {
                        //     msgText = `We are sorry, but the product ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} is no longer available.\n\nYou have been added to the waiting list and we will notify you as soon as it is available again in your cart!`;
                        //     msgTextFr = `Nous sommes désolés, mais le produit ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} n'est plus disponible.\n\nVous avez été rajouté(e) sur la liste d’attente et nous vous avertirons dès qu’il sera à nouveau disponible dans votre panier!`;
                        // } else {
                        //     if (message.order_status === true && message.activeProduct === true) {
                        //         // we can parce message and find product
                        //         msgText = `Congrats! ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} quantity ${message.parcer_data.quantity ? message.parcer_data.quantity : 1} has been added to your cart!\n\nhttps://liveproshop.com/en/fb-order/${slgStoreName}?comment_id=${orderFrom}\n\nATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer}\n\nCheck the timer, because once the time is up, your products will be automatically put back on sale\n\nPLUS! If you order several times in the next few days, you will only be charged for shipping once! And from ${message.threshold} €, shipping is free!`;
                        //         msgTextFr = `Bravo! ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} quantité ${message.parcer_data.quantity ? message.parcer_data.quantity : 1} a été ajouté(e) à votre panier !\n\nhttps://liveproshop.com/fb-order/${slgStoreName}?comment_id=${orderFrom}\n\nATTENTION : La réservation de votre produit est valable uniquement durant ${orderTimer} ${typeTimer}\n\nVérifiez le minuteur, car une fois le temps écoulé, vos produits seront automatiquement remis à la vente\n\nEN PLUS! Si vous commandez plusieurs fois dans les prochains jours, on vous facture les frais de port qu’une seule fois ! Et à partir de ${message.threshold} €, ils sont offerts!`;
                        //         // msgText = `Congrats! ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} quantity ${message.parcer_data.quantity ? message.parcer_data.quantity : 1} has been added to your cart!\n\nhttps://liveproshop.com/en/auth/signup?storeName=ahead_fashion&comment_id=${orderFrom}\n\nATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer}\n\nCheck the timer, because once the time is up, your products will be automatically put back on sale\n\nPLUS! If you order several times in the next few days, you will only be charged for shipping once! And from ${message.threshold} €, shipping is free!`;
                        //         // msgTextFr = `Bravo! ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} quantité ${message.parcer_data.quantity ? message.parcer_data.quantity : 1} a été ajouté(e) à votre panier !\n\nhttps://liveproshop.com/auth/signup?storeName=ahead_fashion&comment_id=${orderFrom}\n\nATTENTION : La réservation de votre produit est valable uniquement durant ${orderTimer} ${typeTimer}\n\nVérifiez le minuteur, car une fois le temps écoulé, vos produits seront automatiquement remis à la vente\n\nEN PLUS! Si vous commandez plusieurs fois dans les prochains jours, on vous facture les frais de port qu’une seule fois ! Et à partir de ${message.threshold} €, ils sont offerts!`;
                        //     } else {
                        //         // we parce messege but not found product
                        //         msgText = `Sorry, we could not find the keyword (reference / size / color / etc.) you were asking for.\n\nHere are some examples of correct comments:\n\nSOLD 14 green\n\nSOLD 169 M\n\nSOLD 35 beige M\n\nPlease check that you have typed the keyword correctly.`;
                        //         msgTextFr = `Désolés, nous n'avons pas pu trouver le mot clé (référence / taille / couleur / etc.) que vous demandiez.\n\nVoici quelques exemples de commentaires corrects:\n\nVENDU 14 vert\n\nVENDU 169 M\n\nVENDU 35 beige M\n\nMerci de vérifier que vous avez correctement tapé le mot-clé.`;
                        //     }
                        // }


                        // await axios.get(
                        //     `${apiUrl}/api/update-live-messages?comment_id=${orderFrom}`
                        // )
                        //     .then(async function (res) {
                        //         console.log(orderFrom);
                        //         return;
                        //     }).catch(e => {
                        //         console.log(e);
                        //     });
                        let responceResultMessage;
                        if (statusWaitItem) {
                            responceResultMessage =  await axios.post(
                                `https://graph.facebook.com/v18.0/me/messages`,
                                '',
                                {
                                    params: {
                                        "recipient": {"comment_id": `${orderFrom}`},
                                        "message": {
                                            "attachment":{
                                                "type":"template",
                                                "payload":{
                                                    "template_type":"button",
                                                    "text": `${lng === 'en' ? msgText : msgTextFr}`,
                                                    "buttons":[
                                                        {
                                                            "type": "postback",
                                                            "title": `${lng === 'en' ? 'Confirm my order' : 'Confirmer ma commande'}`,
                                                            "payload": "DEVELOPER_DEFINED_PAYLOAD"
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        "access_token":`${tokenData[1]}`
                                    }
                                }
                            )
                                .then(async function (responseSending) {
                                    // console.log(responseSending);
                                    return responseSending;
                                }).catch(e => {
                                    console.log('Error with button:');
                                    return false;
                                });

                        } else {
                            responceResultMessage =  await axios.post(
                                `https://graph.facebook.com/v18.0/me/messages`,
                                '',
                                {
                                    params: {
                                        "recipient": {"comment_id": `${orderFrom}`},
                                        "message": {"text": `${lng === 'en' ? msgText : msgTextFr}`},
                                        "access_token":`${tokenData[1]}`
                                    }
                                }
                            )
                                .then(async function (responseSending) {
                                    // console.log(responseSending);
                                    return responseSending;
                                }).catch(e => {
                                    console.log('Error Send Message Yobany v rot:');
                                    return false;
                                });
                        }
                        // responceResultMessage =  await axios.post(
                        //     `https://graph.facebook.com/v18.0/me/messages`,
                        //     '',
                        //     {
                        //         params: {
                        //             "recipient": {"comment_id": `${orderFrom}`},
                        //             "message": {"text": `${lng === 'en' ? msgText : msgTextFr}`},
                        //             "access_token":`${tokenData[1]}`
                        //         }
                        //     }
                        // )
                        //     .then(async function (responseSending) {
                        //         // console.log(responseSending);
                        //         return responseSending;
                        //     }).catch(e => {
                        //         console.log('Error Send Message Yobany v rot:');
                        //         return false;
                        //     });
                        console.log("Respionce send result", responceResultMessage.data);


                        if (responceResultMessage.data.recipient_id) {
                            await axios.get(
                                `${apiUrl}/api/update-live-messages?comment_id=${orderFrom}&recipient_id=${responceResultMessage.data.recipient_id}`
                            )
                                .then(async function (res) {
                                    console.log(orderFrom);
                                    return;
                                }).catch(e => {
                                    console.log(e);
                                });
                        }
                        console.log("AAAA", responceResultMessage.data.recipient_id);
                    } else {
                    }
                }
            })

        }).catch((e) => {
            // console.log('error sending reply message', e,error.error.message);
        });
}

setTimeout(await sessionLaunche, 10000);
