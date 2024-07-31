import axios from "axios";
import 'dotenv/config';
import shell from "shelljs";
import slugify from "slugify";
import moment from "moment/moment.js";
const args = process.argv;
const apiUrl = process.env.API_URL;
const waitingData = args[2].split('=');
const configData = args[2].split('=');


async function updateWaitingJob() {
    // start parsing messages
    await axios(`${apiUrl}/api/run-waiting-job?configId=${configData[1]}`)
        .then((response) => {
            console.log('Length wait', response.data.data.items.length);
            if (response.data.data.items.length > 0) {
                response.data.data.items.forEach(async item => {
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


                    // check item qty
                    await axios(`${apiUrl}/api/order/get-config-qty?configId=${configData[1]}`)
                        .then(async (responseQty) => {
                            if (parseInt(responseQty.data.qty) > 0) {
                                if (item.order_id) {
                                    let typeTimer = item.order_timer.days ? 'd' : item.order_timer.hours ? 'h' : 'm';
                                    let orderTimer = item.order_timer.hours ?? item.order_timer.days ?? item.order_timer.minutes;
                                    let freeShippingTimer = '';
                                    if (item.free_shipping_timer) {
                                        freeShippingTimer = item.free_shipping_timer.hours ?? item.free_shipping_timer.days ?? item.free_shipping_timer.minutes;
                                    }
                                    msgText = `WHAT A LUCK!\n\nYou were on the waiting list for ${item.configuration.name} #${item.product_id} ${item.configuration.color_name} ${item.configuration.size_name} quantity ${item.quantity} and we just added it to your cart!\n\nhttps://liveproshop.com/en/fb-wait-exist/${slgStoreName}?order_id=${item.order_id}\n\nEnjoy it now!`;
                                    msgTextFr = `QUELLE CHANCE!\n\nVous étiez sur la liste d’attente pour ${item.configuration.name} #${item.product_id} ${item.configuration.color_name} ${item.configuration.size_name} quantité ${item.quantity} et nous venons de l’ajouter à votre panier !\n\nhttps://liveproshop.com/en/fb-wait-exist/${slgStoreName}?order_id=${item.order_id}\n\nProfitez en vite ! `;
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
                                            // minusing qty from configuration
console.log('SHOULD REMOVE QTY FROM CONFIGURATION 1', item)

                                            return responseSending;
                                        }).catch(e => {
                                            console.log('Error Send Message Yobany v rot:');
                                            return false;
                                        });
                                } else {
                                    msgText = `WHAT A LUCK!\n\nYou were on the waiting list for ${item.configuration.name} #${item.product_id} ${item.configuration.color_name} ${item.configuration.size_name} quantity ${item.quantity} and we just added it to your cart!\n\nhttps://liveproshop.com/en/fb-order/${slgStoreName}?comment_id=${item.message_id}\n\nEnjoy it now!`;
                                    msgTextFr = `QUELLE CHANCE!\n\nVous étiez sur la liste d’attente pour ${item.configuration.name} #${item.product_id} ${item.configuration.color_name} ${item.configuration.size_name} quantité ${item.quantity} et nous venons de l’ajouter à votre panier !\n\nhttps://liveproshop.com/fb-order/${slgStoreName}?comment_id=${item.message_id}\n\nProfitez en vite ! `;
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
                                            await axios(`${apiUrl}/api/order/remove-wait-from-item?itemId=${item.wait_item_id}`)
                                                .then(async (responseQty) => {

                                                }).catch((e) => {
                                                    // console.log('error sending reply message', e,error.error.message);
                                                });
                                            const resultQty = await axios(`${apiUrl}/api/order/update-qty-after-wait?configId=${item.configuration.product_configuration_id}&qty=${item.quantity}`)
                                                .then(async (responseQty) => {

                                                }).catch((e) => {
                                                    // console.log('error sending reply message', e,error.error.message);
                                                });
                                            return responseSending;
                                        }).catch(e => {
                                            console.log('Error Send Message Yobany v rot:');
                                            return false;
                                        });
                                }

                            } else {
                                console.log('HAVE ZERO SHOULD QUIT');
                                shell.exec(`pm2 delete "jobStoreWaiting ${configData[1]}"`, function(code, output) {
                                });
                            }
                        }).catch((e) => {
                            // console.log('error sending reply message', e,error.error.message);
                        });
                })
            } else {
                // // we need to stop job
                shell.exec(`pm2 delete "jobStoreWaiting ${configData[1]}"`, function(code, output) {
                });
            }


        }).catch((e) => {
            // console.log('error sending reply message', e,error.error.message);
        });


}

setTimeout(await updateWaitingJob, 1000);
