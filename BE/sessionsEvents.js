import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';

const apiUrl = process.env.API_URL;

// ***************************************************************************
// for active session start process about parsing messages and creating orders
// ***************************************************************************
async function startProcess() {
    console.log('Getting list of active sessions for launche process');
    
    await axios(`${apiUrl}/api/fetch-active-sessions`)
        .then( (response) => {
            console.log(response.data.result);
            response.data.result.forEach(async session => {
                shell.exec(`pm2 start sessionLaunche.js --name "Launch session ${session.id}" -- sessionId=${session.id}`, function(code, output) {
                    console.log('Exit code:', code);
                    console.log('Program output:', output);
                });
    
                await axios(`${apiUrl}/api/launched-session/${session.id}`)
                    .then(() => {
                    
                    });
            })
        });
}
setTimeout(await startProcess, 10000);

// SELECT * FROM data.set_orders_from_live_sessions_messages(2, 100);
// SELECT * FROM data.delete_orders_from_live_sessions(2);
// SELECT * FROM data.set_live_sessions_messages_parcer_data(2, 100);

// SELECT
// id_cnt, live_sessions_id, product_id, product_configuration_id, configuration, item_buyers
// FROM data.get_orders_waiting_list(10, 0, NULL, '');
