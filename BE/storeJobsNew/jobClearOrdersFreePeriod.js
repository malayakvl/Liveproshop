import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';

const apiUrl = process.env.API_URL;
// const args = process.argv;
// const sessionsData = args[2].split('=');
// const tokenData = args[4].split('=');
// const storeData = args[3].split('=');



async function clearOrdersFreePeriod() {
    // start parsing messages
    console.log('here', `${apiUrl}/api/get-order-clear-free-period`);
    // await axios(`${apiUrl}/api/get-order-clear-free-period?fromJob=yes`)
    // .then(async (responseQty) => {

    // }).catch((e) => {
    //     // console.log('error sending reply message', e,error.error.message);
    // });

}

setTimeout(await clearOrdersFreePeriod, 10000);
