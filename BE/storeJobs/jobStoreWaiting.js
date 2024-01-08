import axios from "axios";
import 'dotenv/config';
import shell from "shelljs";
import slugify from "slugify";
import moment from "moment/moment.js";
const args = process.argv;
const apiUrl = process.env.API_URL;
const waitingData = args[2].split('=');
const configData = args[2].split('=');
// const storeData = args[3].split('=');
// const tokenData = args[4].split('=');


async function updateWaitingJob() {
    // start parsing messages
    await axios(`${apiUrl}/api/order/get-config-qty?configId=${configData[1]}`)
    .then(async (responseQty) => {
        if (parseInt(responseQty.data.qty) > 0) {
            await axios(`${apiUrl}/api/run-waiting-job?configId=${configData[1]}`)
                .then((response) => {
                    response.data.data.items.forEach(async item => {
                        console.log(item);
                        await axios(`${apiUrl}/api/update-wait-item_qty?itemId=${item.wait_item_id}&qty=${item.quantity}&configId=${item.product_configuration_id}&orderId=${item.order_id}`)
                            .then( (responseItemUpd) => {
                                return response.data.result;
                            }).catch(e => {
                                console.log(e);
                            });
                        let msgText;
                        let msgTextFr;
                        const lng = item.message.indexOf('sold') >= 0 ? 'en' : 'fr';
                        const slgStoreName = slugify(item.store_name, {
                            replacement: '-',  // replace spaces with replacement character, defaults to `-`
                            remove: undefined, // remove characters that match regex, defaults to `undefined`
                            lower: true,      // convert to lower case, defaults to `false`
                            strict: false,     // strip special characters except replacement, defaults to `false`
                            locale: 'vi',      // language code of the locale to use
                            trim: true         // trim leading and trailing replacement chars, defaults to `true`
                        });

                        if (item.order_id) {
                            // const statusUpdate = await axios(`${apiUrl}/api/update-wait-item_qty?itemId=${item.wait_item_id}&qty=${item.quantity}&configId=${item.product_configuration_id}&orderId=${item.order_id}`)
                            //     .then( (responseItemUpd) => {
                            //         return response.data.result;
                            //     }).catch(e => {
                            //         console.log(e);
                            //     });
                            // let msgText;
                            // let msgTextFr;
                            // const lng = item.message.indexOf('sold') >= 0 ? 'en' : 'fr';
                            // const slgStoreName = slugify(item.store_name, {
                            //     replacement: '-',  // replace spaces with replacement character, defaults to `-`
                            //     remove: undefined, // remove characters that match regex, defaults to `undefined`
                            //     lower: true,      // convert to lower case, defaults to `false`
                            //     strict: false,     // strip special characters except replacement, defaults to `false`
                            //     locale: 'vi',      // language code of the locale to use
                            //     trim: true         // trim leading and trailing replacement chars, defaults to `true`
                            // });
                            let typeTimer = item.order_timer.days ? 'd' : item.order_timer.hours ? 'h' : 'm';
                            let orderTimer = item.order_timer.hours ?? item.order_timer.days ?? item.order_timer.minutes;
                            let freeShippingTimer = '';
                            if (item.free_shipping_timer) {
                                freeShippingTimer = item.free_shipping_timer.hours ?? item.free_shipping_timer.days ?? item.free_shipping_timer.minutes;
                            }

                            // msgText = `Congrats! ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantity ${item.quantity} has been added to your cart!\n\nhttps://liveproshop.com/en/fb-order/${slgStoreName}?comment_id=${item.message_id}\n\nATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer}\n\nCheck the timer, because once the time is up, your products will be automatically put back on sale\n\nPLUS! If you order several times in the next few days, you will only be charged for shipping once! And from ${item.threshold} €, shipping is free!`;
                            // msgTextFr = `Bravo! ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantité ${item.quantity} a été ajouté(e) à votre panier !\n\nhttps://liveproshop.com/fb-order/${slgStoreName}?comment_id=${item.message_id}\n\nATTENTION : La réservation de votre produit est valable uniquement durant ${orderTimer} ${typeTimer}\n\nVérifiez le minuteur, car une fois le temps écoulé, vos produits seront automatiquement remis à la vente\n\nEN PLUS! Si vous commandez plusieurs fois dans les prochains jours, on vous facture les frais de port qu’une seule fois ! Et à partir de ${item.threshold} €, ils sont offerts!`;
                            msgText = `WHAT A LUCK!\n\nYou were on the waiting list for ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantity ${item.quantity} and we just added it to your cart!\n\nhttps://liveproshop.com/en/fb-wait/${slgStoreName}?order_id=${item.message_id}\n\nEnjoy it now!`;
                            msgTextFr = `QUELLE CHANCE!\n\nVous étiez sur la liste d’attente pour ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantité ${item.quantity} et nous venons de l’ajouter à votre panier !\n\nhttps://liveproshop.com/en/fb-wait/${slgStoreName}?order_id=${item.message_id}\n\nProfitez en vite ! `;
                            // send messeage about waiting
                            const responceResultMessage =  await axios.post(
                                `https://graph.facebook.com/v18.0/me/messages`,
                                '',
                                {
                                    params: {
                                        "recipient": {"id": `${item.recipient_id}`},
                                        "message": {"text": `${lng === 'en' ? msgText : msgTextFr}`},
                                        "messaging_type": "MESSAGE_TAG",
                                        "tag": "POST_PURCHASE_UPDATE",
                                        "access_token":`${item.access_token}`
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
                        } else {
                            msgText = `WHAT A LUCK!\n\nYou were on the waiting list for ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantity ${item.quantity} and we just added it to your cart!\n\nhttps://liveproshop.com/en/fb-wait/${slgStoreName}?comment_id=${item.message_id}\n\nEnjoy it now!`;
                            msgTextFr = `QUELLE CHANCE!\n\nVous étiez sur la liste d’attente pour ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantité ${item.quantity} et nous venons de l’ajouter à votre panier !\n\nhttps://liveproshop.com/fb-wait/${slgStoreName}?comment_id=${item.message_id}\n\nProfitez en vite ! `;
                            // msgText = `Congrats! ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantity ${item.quantity} has been added to your cart!\n\nhttps://liveproshop.com/en/fb-order/${slgStoreName}?comment_id=${item.message_id}\n\nATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer}\n\nCheck the timer, because once the time is up, your products will be automatically put back on sale\n\nPLUS! If you order several times in the next few days, you will only be charged for shipping once! And from ${item.threshold} €, shipping is free!`;
                            // msgTextFr = `Bravo! ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantité ${item.quantity} a été ajouté(e) à votre panier !\n\nhttps://liveproshop.com/fb-order/${slgStoreName}?comment_id=${item.message_id}\n\nATTENTION : La réservation de votre produit est valable uniquement durant ${orderTimer} ${typeTimer}\n\nVérifiez le minuteur, car une fois le temps écoulé, vos produits seront automatiquement remis à la vente\n\nEN PLUS! Si vous commandez plusieurs fois dans les prochains jours, on vous facture les frais de port qu’une seule fois ! Et à partir de ${item.threshold} €, ils sont offerts!`;
                            const responceResultMessage =  await axios.post(
                                `https://graph.facebook.com/v18.0/me/messages`,
                                '',
                                {
                                    params: {
                                        "recipient": {"id": `${item.recipient_id}`},
                                        "message": {"text": `${lng === 'en' ? msgText : msgTextFr}`},
                                        "messaging_type": "MESSAGE_TAG",
                                        "tag": "POST_PURCHASE_UPDATE",
                                        "access_token":`${item.access_token}`
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
                        // if (item.message_id) {
                        //     const orderFrom = item.message_id;
                        //     if (item.order_id) {
                        //         await axios(`${apiUrl}/api/update-waiting-order?orderId=${item.order_id}&configId=${configData[1]}`)
                        //             .then(async function (res) {
                        //
                        //             }).catch(e => {
                        //                 console.log(e);
                        //             });
                        //     }
                        //     const x = message.parcer_data;
                        //     let lng = 'fr';
                        //     if (message.parcer_data.hasOwnProperty("sold")) {
                        //         lng = 'en';
                        //     }
                        //     console.log(`Reply/Message comment ${message.message_id}: ${message.from_id}`);
                        //     if (message.from_id || orderFrom && message.parcer_status === true) {
                        //         let typeTimer = message.order_timer.days ? 'd' : message.order_timer.hours ? 'h' : 'm';
                        //         let orderTimer = message.order_timer.hours ?? message.order_timer.days ?? message.order_timer.minutes;
                        //         let freeShippingTimer = '';
                        //         if (message.free_shipping_timer) {
                        //             freeShippingTimer = message.free_shipping_timer.hours ?? message.free_shipping_timer.days ?? message.free_shipping_timer.minutes;
                        //         }
                        //         let msgText;
                        //         let msgTextFr;
                        //         const slgStoreName = slugify(message.store_name, {
                        //             replacement: '-',  // replace spaces with replacement character, defaults to `-`
                        //             remove: undefined, // remove characters that match regex, defaults to `undefined`
                        //             lower: true,      // convert to lower case, defaults to `false`
                        //             strict: false,     // strip special characters except replacement, defaults to `false`
                        //             locale: 'vi',      // language code of the locale to use
                        //             trim: true         // trim leading and trailing replacement chars, defaults to `true`
                        //         })
                        //
                        //
                        //         // before send message check order status about wait
                        //         const statusWaitItem = await axios(`${apiUrl}/api/check-wait-status?comment_id=${message.message_id}`)
                        //             .then( (response) => {
                        //                 return response.data.result;
                        //             }).catch(e => {
                        //                 console.log(e);
                        //             });
                        //
                        //         if (statusWaitItem) {
                        //             msgText = `We are sorry, but the product ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} is no longer available.\n\nYou have been added to the waiting list and we will notify you as soon as it is available again in your cart!`;
                        //             msgTextFr = `Nous sommes désolés, mais le produit ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} n'est plus disponible.\n\nVous avez été rajouté(e) sur la liste d’attente et nous vous avertirons dès qu’il sera à nouveau disponible dans votre panier!`;
                        //         } else {
                        //             if (message.order_status === true) {
                        //                 // we can parce message and find product
                        //                 msgText = `Congrats! ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} quantity ${message.parcer_data.quantity ? message.parcer_data.quantity : 1} has been added to your cart!\n\nhttps://liveproshop.com/en/fb-order/${slgStoreName}?comment_id=${orderFrom}\n\nATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer}\n\nCheck the timer, because once the time is up, your products will be automatically put back on sale\n\nPLUS! If you order several times in the next few days, you will only be charged for shipping once! And from ${message.threshold} €, shipping is free!`;
                        //                 msgTextFr = `Bravo! ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} quantité ${message.parcer_data.quantity ? message.parcer_data.quantity : 1} a été ajouté(e) à votre panier !\n\nhttps://liveproshop.com/fb-order/${slgStoreName}?comment_id=${orderFrom}\n\nATTENTION : La réservation de votre produit est valable uniquement durant ${orderTimer} ${typeTimer}\n\nVérifiez le minuteur, car une fois le temps écoulé, vos produits seront automatiquement remis à la vente\n\nEN PLUS! Si vous commandez plusieurs fois dans les prochains jours, on vous facture les frais de port qu’une seule fois ! Et à partir de ${message.threshold} €, ils sont offerts!`;
                        //                 // msgText = `Congrats! ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} quantity ${message.parcer_data.quantity ? message.parcer_data.quantity : 1} has been added to your cart!\n\nhttps://liveproshop.com/en/auth/signup?storeName=ahead_fashion&comment_id=${orderFrom}\n\nATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer}\n\nCheck the timer, because once the time is up, your products will be automatically put back on sale\n\nPLUS! If you order several times in the next few days, you will only be charged for shipping once! And from ${message.threshold} €, shipping is free!`;
                        //                 // msgTextFr = `Bravo! ${message.product_name} #${message.parcer_data.item} ${message.parcer_data.color ? message.parcer_data.color : ''} ${message.parcer_data.size ? message.parcer_data.size : ''} quantité ${message.parcer_data.quantity ? message.parcer_data.quantity : 1} a été ajouté(e) à votre panier !\n\nhttps://liveproshop.com/auth/signup?storeName=ahead_fashion&comment_id=${orderFrom}\n\nATTENTION : La réservation de votre produit est valable uniquement durant ${orderTimer} ${typeTimer}\n\nVérifiez le minuteur, car une fois le temps écoulé, vos produits seront automatiquement remis à la vente\n\nEN PLUS! Si vous commandez plusieurs fois dans les prochains jours, on vous facture les frais de port qu’une seule fois ! Et à partir de ${message.threshold} €, ils sont offerts!`;
                        //             } else {
                        //                 // we parce messege but not found product
                        //                 msgText = `Sorry, we could not find the keyword (reference / size / color / etc.) you were asking for.\n\nHere are some examples of correct comments:\n\nSOLD 14 green\n\nSOLD 169 M\n\nSOLD 35 beige M\n\nPlease check that you have typed the keyword correctly.`;
                        //                 msgTextFr = `Désolés, nous n'avons pas pu trouver le mot clé (référence / taille / couleur / etc.) que vous demandiez.\n\nVoici quelques exemples de commentaires corrects:\n\nVENDU 14 vert\n\nVENDU 169 M\n\nVENDU 35 beige M\n\nMerci de vérifier que vous avez correctement tapé le mot-clé.`;
                        //             }
                        //         }
                        //
                        //
                        //         await axios.get(
                        //             `${apiUrl}/api/update-live-messages?comment_id=${orderFrom}`
                        //         )
                        //             .then(async function (res) {
                        //                 console.log(orderFrom);
                        //                 return;
                        //             }).catch(e => {
                        //                 console.log(e);
                        //             });
                        //
                        //
                        //         const responceResultMessage =  await axios.post(
                        //             `https://graph.facebook.com/v18.0/me/messages`,
                        //             '',
                        //             {
                        //                 params: {
                        //                     "recipient": {"comment_id": `${orderFrom}`},
                        //                     "message": {"text": `${lng === 'en' ? msgText : msgTextFr}`},
                        //                     "access_token":`${tokenData[1]}`
                        //                 }
                        //             }
                        //         )
                        //             .then(async function (responseSending) {
                        //                 // console.log(responseSending);
                        //                 return true;
                        //             }).catch(e => {
                        //                 console.log('Error Send Message Yobany v rot:');
                        //                 return false;
                        //             });
                        //     } else {
                        //     }
                        // }
                    })

                }).catch((e) => {
                    // console.log('error sending reply message', e,error.error.message);
                });
        } else {
            // we need to stop job
        }

    }).catch((e) => {
        // console.log('error sending reply message', e,error.error.message);
    });

}

setTimeout(await updateWaitingJob, 10000);
