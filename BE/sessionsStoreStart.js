import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';

const apiUrl = process.env.API_URL;

// ***************************************************************************
// get list of session wich should be started for current time
// ***************************************************************************
async function startProcess() {
    console.log(`Get list started session: ${apiUrl}/api/fetch-store-session-for-start`)
    await axios(`${apiUrl}/api/fetch-store-session-for-start`)
        .then( (response) => {
            response.data.result.forEach(async session => {
                // console.log('Livesession:', session);
                // console.log('pm2 command:', `pm2 start jobStoreVideos.js --name "FB store session videoAPI ${session.id}" -- sessionId=${session.id} storeId=${session.store_id} accessToken=${session.access_token} `);
                shell.exec(`pm2 start sessionFBStoreVideos.js --name "FB STORE session videoAPI ${session.id}" -- sessionId=${session.id} storeId=${session.store_id} accessToken=${session.access_token}`, function(code, output) {
                    console.log('Exit code:', code);
                    console.log('Program output:', output);
                });

                // await axios(`${apiUrl}/api/activate-session/${session.id}`)
                //     .then(() => {
                //
                //     });
            })
        });
}
setTimeout(await startProcess, 10000);
