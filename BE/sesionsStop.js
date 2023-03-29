import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';

const apiUrl = process.env.API_URL;


async function getLauncheLiveSession() {
    await axios(`${apiUrl}/api/fetch-launch-stop-sessions`)
        .then( (response) => {
            const items = response.data.items;

            response.data.items.forEach(async session => {
                console.log(`"pm2 start createOrders.js -- sessionId=${session.id}"`);
                shell.exec(`pm2 start launcheSession.js --name "Launch session ${session.id}" -- sessionId=${session.id}`, function(code, output) {
                    console.log('Exit code:', code);
                    console.log('Program output:', output);
                });

                await axios(`${apiUrl}/api/launched-session/${session.id}`)
                    .then(() => {

                    });
            })
        });
}
setTimeout(await getLauncheLiveSession, 10000);
