import { Router } from 'express';
import pool from './api/models/connect.js';
import shell from "shelljs";
import moment from "moment";

console.log(moment().add(`${process.env.SERVER_TIME_DIFF}`, 'hours').format('YYYY-MM-DD HH:mm:ss'))

const appRoute = Router();
appRoute.get(/.*$/, function (req, res, next) {
    pool.query('SELECT 1 + 1  AS solution', (error) => {
        if (error) {
            res.render('pages/db-connect', { title: 'No _DB connection' });
        } else {
            next();
        }
    });
});
// here automatically start jobs for project
if (parseFloat(process.env.START_ON_SERVER) === 1) {
    shell.exec(`pm2 start ./storeJobs/jobClearOrders.js --name "jobClearOrders"`, function(code, output) {
        console.log('Exit code:', code);
        console.log('Program output:', output);
    });
    shell.exec(`pm2 start ./storeJobs/jobClearOrdersFreePeriod.js --name "jobClearOrdersFreePeriod"`, function(code, output) {
        console.log('Exit code:', code);
        console.log('Program output:', output);
    });
    shell.exec(`pm2 start ./storeJobs/jobClearExpiredOrders.js --name "jobClearExpiredOrders"`, function(code, output) {
        console.log('Exit code:', code);
        console.log('Program output:', output);
    });
    // shell.exec(`pm2 start ./storeJobs/jobStart.js --name "jobStart"`, function(code, output) {
    //     console.log('Exit code:', code);
    //     console.log('Program output:', output);
    // });
    // shell.exec(`pm2 start ./storeJobs/jobEnd.js --name "jobEnd"`, function(code, output) {
    //     console.log('Exit code:', code);
    //     console.log('Program output:', output);
    // });
}

appRoute.get('/', (req, res) => {
    res.render('pages/index', { title: 'Home' });
});
// appRoute.get('/user', (req, res) => {
//     res.render('pages/user', { title: 'Profile', userProfile: { nickname: 'Auth0' } });
// })

export default appRoute;
