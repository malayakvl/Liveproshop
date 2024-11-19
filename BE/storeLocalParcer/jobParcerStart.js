import 'dotenv/config';
import axios from "axios";
import shell from 'shelljs';
import moment from "moment/moment.js";

const apiUrl = process.env.API_URL;

// ***************************************************************************
// get list of session wich should be started for current time
// ***************************************************************************
async function startProcess() {
    // const tokenTest = 'EAArS9KI0vagBO6skB2xYWPj9QvkEUHlNIJ2dOqlbGSIMAlpYndHrP4DmuZCxSkLISbU7pHYRSZBIIANiYZATUtKh99fH84VkZAvhv1snJZB8ggMrwTckJEeHUzeAZCc4riV1dtuf3aQEdH0OmDOKNDHgQk3XtWwy3j9DyFTNAeq66LLFlx60odu0g2bQ0xTZAcZD';
    const tokenTest = 'EAArS9KI0vagBO7We3M1ZAMwWw8oi5ftBFGAWjd9Na5woX2ngHGBZAnzRMc6sNRyKYaeHYclOw7o4eMtx8e69A9U3em46g9pX6Dl2YaymJKAZAMvr0sZACUx18r66eAk77TN12LbejgXCFECoAvCa5ZBr52VYooV17Oe5AkXfD9CDznTHwiunOodIdiLMjeMHpZAQlAqzoSUti8JVm4igzcXicZD';
    const storeTestId = '134773596380836';
    const sessionTestId = 885;
    const sessionLocalTestId = 885;
    const videoTestId = '122184285890041438';

    // shell.exec(`pm2 start jobStoreComments.js --name "jobStoreComments ${sessionTestId}" -- videoId=${videoTestId} sessionId=${sessionTestId} accessToken=${tokenTest} `, function(code, output) {
    // });
    // shell.exec(`pm2 start jobStorePreParserModel.js --name "jobStorePreParser ${sessionTestId}" -- sessionId=${sessionTestId}`, function(code, output) {
    // });
    // shell.exec(`pm2 start jobStorePostParcer.js --name "jobStorePostParcer ${sessionTestId}" -- sessionId=${sessionTestId}`, function(code, output) {
    // });
    shell.exec(`pm2 start jobStoreParser.js --name "jobStoreParser ${sessionTestId}" -- sessionId=${sessionTestId}`, function(code, output) {
    });
    // shell.exec(`pm2 start jobStoreOrder.js --name "jobStoreOrder ${sessionTestId}" -- sessionId=${sessionTestId}`, function(code, output) {
    // });

    // shell.exec(`pm2 start jobStoreSender.js --name "jobStoreSender"   `, function(code, output) {
    // });
    //

    setTimeout(() => {
        shell.exec(`pm2 delete jobParcerStart.js`, function(code, output) {
        });
    }, 5000);

//     await axios.get(`https://graph.facebook.com/v21.0/${storeTestId}/live_videos?broadcast_status=["VOD"]&fields=broadcast_start_time,id,title,description&access_token=${tokenTest}`)
//         .then(async function (response) {
//             const results = response.data.data;
// console.log('Results', results);
//             // if ()
//             await axios.get(`${apiUrl}/api/update-store_session-status?sessionId=${sessionTestId}&videoId=${videoTestId}`)
//                     .then(function (_response) {
//                         // start process for getting messages and put it to _DB
//                         shell.exec(`pm2 start jobStoreComments.js --name "jobStoreComments ${sessionTestId}" -- videoId=${videoTestId} sessionId=${sessionTestId} accessToken=${tokenTest} `, function(code, output) {
//                         });
//
//                         shell.exec(`pm2 start jobStoreSender.js --name "jobStoreSender"   `, function(code, output) {
//                         });
//
//                         shell.exec(`pm2 start _jobStoreParser.js --name "jobStoreParser ${sessionTestId}" -- sessionId=${sessionTestId}`, function(code, output) {
//                             console.log('Exit code:', code);
//                             console.log('Program output:', output);
//                         });
//
//                         // kill process
//                         // setTimeout(() => {
//                         //     shell.exec(`pm2 delete "jobStoreVideos ${sessionTestId}"`, function(code, output) {
//                         //     });
//                         // }, 5000);
//
//
//                         // starting sending messages
//
//                     })
//         })
//         .catch(function (error) {
//             console.log("Error", error.response.data.error.message);
//         });
}
setTimeout(await startProcess, 10000);
