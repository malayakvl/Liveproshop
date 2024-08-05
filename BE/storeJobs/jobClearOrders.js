import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';

const apiUrl = process.env.API_URL;
const args = process.argv;
const sessionsData = args[2].split('=');
const tokenData = args[4].split('=');
const storeData = args[3].split('=');



async function clearOrderJob() {
    // start parsing messages
    console.log('here', `${apiUrl}/api/get-order-clear`);
    await axios(`${apiUrl}/api/get-order-clear`)
    .then(async (responseQty) => {
        // if (parseInt(responseQty.data.qty) > 0) {
        //     await axios(`${apiUrl}/api/run-waiting-job?configId=${configData[1]}`)
        //         .then((response) => {
        //             response.data.data.items.forEach(async item => {
        //                 const tmpOrderNum = await axios(`${apiUrl}/api/update-wait-item_qty?itemId=${item.wait_item_id}&qty=${item.quantity}&configId=${item.product_configuration_id}&orderId=${item.order_id}`)
        //                     .then( (responseItemUpd) => {
        //                         return response.data.result;
        //                     }).catch(e => {
        //                         console.log(e);
        //                     });
        //                 let msgText;
        //                 let msgTextFr;
        //                 const lng = item.message.indexOf('sold') >= 0 ? 'en' : 'fr';
        //                 const slgStoreName = slugify(item.store_name, {
        //                     replacement: '-',  // replace spaces with replacement character, defaults to `-`
        //                     remove: undefined, // remove characters that match regex, defaults to `undefined`
        //                     lower: true,      // convert to lower case, defaults to `false`
        //                     strict: false,     // strip special characters except replacement, defaults to `false`
        //                     locale: 'vi',      // language code of the locale to use
        //                     trim: true         // trim leading and trailing replacement chars, defaults to `true`
        //                 });
        //
        //                 if (item.order_id) {
        //                     // const statusUpdate = await axios(`${apiUrl}/api/update-wait-item_qty?itemId=${item.wait_item_id}&qty=${item.quantity}&configId=${item.product_configuration_id}&orderId=${item.order_id}`)
        //                     //     .then( (responseItemUpd) => {
        //                     //         return response.data.result;
        //                     //     }).catch(e => {
        //                     //         console.log(e);
        //                     //     });
        //                     // let msgText;
        //                     // let msgTextFr;
        //                     // const lng = item.message.indexOf('sold') >= 0 ? 'en' : 'fr';
        //                     // const slgStoreName = slugify(item.store_name, {
        //                     //     replacement: '-',  // replace spaces with replacement character, defaults to `-`
        //                     //     remove: undefined, // remove characters that match regex, defaults to `undefined`
        //                     //     lower: true,      // convert to lower case, defaults to `false`
        //                     //     strict: false,     // strip special characters except replacement, defaults to `false`
        //                     //     locale: 'vi',      // language code of the locale to use
        //                     //     trim: true         // trim leading and trailing replacement chars, defaults to `true`
        //                     // });
        //                     let typeTimer = item.order_timer.days ? 'd' : item.order_timer.hours ? 'h' : 'm';
        //                     let orderTimer = item.order_timer.hours ?? item.order_timer.days ?? item.order_timer.minutes;
        //                     let freeShippingTimer = '';
        //                     if (item.free_shipping_timer) {
        //                         freeShippingTimer = item.free_shipping_timer.hours ?? item.free_shipping_timer.days ?? item.free_shipping_timer.minutes;
        //                     }
        //                     // msgText = `Congrats! ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantity ${item.quantity} has been added to your cart!\n\nhttps://liveproshop.com/en/fb-order/${slgStoreName}?comment_id=${item.message_id}\n\nATTENTION: The reservation of your product is only valid for ${orderTimer} ${typeTimer}\n\nCheck the timer, because once the time is up, your products will be automatically put back on sale\n\nPLUS! If you order several times in the next few days, you will only be charged for shipping once! And from ${item.threshold} €, shipping is free!`;
        //                     // msgTextFr = `Bravo! ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantité ${item.quantity} a été ajouté(e) à votre panier !\n\nhttps://liveproshop.com/fb-order/${slgStoreName}?comment_id=${item.message_id}\n\nATTENTION : La réservation de votre produit est valable uniquement durant ${orderTimer} ${typeTimer}\n\nVérifiez le minuteur, car une fois le temps écoulé, vos produits seront automatiquement remis à la vente\n\nEN PLUS! Si vous commandez plusieurs fois dans les prochains jours, on vous facture les frais de port qu’une seule fois ! Et à partir de ${item.threshold} €, ils sont offerts!`;
        //                     msgText = `WHAT A LUCK!\n\nYou were on the waiting list for ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantity ${item.quantity} and we just added it to your cart!\n\nhttps://liveproshop.com/en/fb-wait-exist/${slgStoreName}?order_id=${item.order_id}\n\nEnjoy it now!`;
        //                     msgTextFr = `QUELLE CHANCE!\n\nVous étiez sur la liste d’attente pour ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantité ${item.quantity} et nous venons de l’ajouter à votre panier !\n\nhttps://liveproshop.com/en/fb-wait-exist/${slgStoreName}?order_id=${item.order_id}\n\nProfitez en vite ! `;
        //                     // send messeage about waiting
        //                     const responceResultMessage =  await axios.post(
        //                         `https://graph.facebook.com/v18.0/me/messages`,
        //                         '',
        //                         {
        //                             params: {
        //                                 "recipient": {"id": `${item.recipient_id}`},
        //                                 "message": {"text": `${lng === 'en' ? msgText : msgTextFr}`},
        //                                 "messaging_type": "MESSAGE_TAG",
        //                                 "tag": "POST_PURCHASE_UPDATE",
        //                                 "access_token":`${item.access_token}`
        //                             }
        //                         }
        //                     )
        //                         .then(async function (responseSending) {
        //                             // console.log(responseSending);
        //                             return responseSending;
        //                         }).catch(e => {
        //                             console.log('Error Send Message Yobany v rot:');
        //                             return false;
        //                         });
        //                 } else {
        //                     // old message
        //                     // msgText = `WHAT A LUCK!\n\nYou were on the waiting list for ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantity ${item.quantity} and we just added it to your cart!\n\nhttps://liveproshop.com/en/fb-wait/${slgStoreName}?comment_id=${item.message_id}&type=2\n\nEnjoy it now!`;
        //                     // msgTextFr = `QUELLE CHANCE!\n\nVous étiez sur la liste d’attente pour ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantité ${item.quantity} et nous venons de l’ajouter à votre panier !\n\nhttps://liveproshop.com/fb-wait/${slgStoreName}?comment_id=${item.message_id}&type=2\n\nProfitez en vite ! `;
        //                     // new message
        //                     msgText = `WHAT A LUCK!\n\nYou were on the waiting list for ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantity ${item.quantity} and we just added it to your cart!\n\nhttps://liveproshop.com/en/fb-order/${slgStoreName}?comment_id=${item.message_id}\n\nEnjoy it now!`;
        //                     msgTextFr = `QUELLE CHANCE!\n\nVous étiez sur la liste d’attente pour ${item.configuration.name} #${item.configuration.sku} ${item.configuration.color_name} ${item.configuration.size_name} quantité ${item.quantity} et nous venons de l’ajouter à votre panier !\n\nhttps://liveproshop.com/fb-order/${slgStoreName}?comment_id=${item.message_id}\n\nProfitez en vite ! `;
        //                     const responceResultMessage =  await axios.post(
        //                         `https://graph.facebook.com/v18.0/me/messages`,
        //                         '',
        //                         {
        //                             params: {
        //                                 "recipient": {"id": `${item.recipient_id}`},
        //                                 "message": {"text": `${lng === 'en' ? msgText : msgTextFr}`},
        //                                 "messaging_type": "MESSAGE_TAG",
        //                                 "tag": "POST_PURCHASE_UPDATE",
        //                                 "access_token":`${item.access_token}`
        //                             }
        //                         }
        //                     )
        //                         .then(async function (responseSending) {
        //                             // console.log(responseSending);
        //                             return responseSending;
        //                         }).catch(e => {
        //                             console.log('Error Send Message Yobany v rot:');
        //                             return false;
        //                         });
        //                 }
        //             })
        //
        //         }).catch((e) => {
        //             // console.log('error sending reply message', e,error.error.message);
        //         });
        // } else {
        //     // we need to stop job
        // }

    }).catch((e) => {
        // console.log('error sending reply message', e,error.error.message);
    });

}

setTimeout(await clearOrderJob, 10000);
