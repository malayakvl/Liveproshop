import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';

const apiUrl = process.env.API_URL;

// ***************************************************************************
// get list of session wich should be started for current time
// ***************************************************************************
async function startProcess() {
    console.log(`Get list started session: ${apiUrl}/api/fetch-session-for-start`)
    await axios(`${apiUrl}/api/fetch-session-for-start`)
        .then( (response) => {
            response.data.result.forEach(async session => {
                console.log('Session:', session);
                // shell.exec(`pm2 start sessionFBEvent.js --name "FB session videoAPI ${session.id}" -- sessionId=${session.id} accessToken=${session.auth_provider_access_token} providerId=${session.auth_provider_id}`, function(code, output) {
                //     console.log('Exit code:', code);
                //     console.log('Program output:', output);
                // });

                // await axios(`${apiUrl}/api/activate-session/${session.id}`)
                //     .then(() => {
                //
                //     });
            })
        });
}
setTimeout(await startProcess, 10000);
