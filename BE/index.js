/**
 * Required External Modules
 */
import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import passport from './src/api/middleware/passport.js';
import authRoutes from './src/api/routes/authRoute.js';
import apiRoutes from './src/api/routes/apiRoutes.js';
import appRoute from './src/appRoute.js';
import bodyParser from 'body-parser';
import slugify from "slugify";
// const x = '{"status" : true, "sold" : true, "item" : 48, "color" : "white", "color_id" : 2, "size" : "m", "size_id" : 25, "quantity" : 1}';
// const parsedJson = (JSON.parse(x));
// let lng = 'fr';
// if (parsedJson.hasOwnProperty("sold")) {
//     lng = 'en';
// }
// const slgWord = slugify('Ahead Fashion', {
//     replacement: '-',  // replace spaces with replacement character, defaults to `-`
//     remove: undefined, // remove characters that match regex, defaults to `undefined`
//     lower: true,      // convert to lower case, defaults to `false`
//     strict: false,     // strip special characters except replacement, defaults to `false`
//     locale: 'vi',      // language code of the locale to use
//     trim: true         // trim leading and trailing replacement chars, defaults to `true`
// })
// console.log(slgWord);
/**
 * App Variables
 */
const app = express();
const port = process.env.APPLICATION_PORT || '4000';
const __dirname = path.resolve();
const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000', 'https://dev-tech.com.ua', 'https://api.dev-tech.com.ua', 'https://test.dev-tech.com.ua', 'https://test-api.dev-tech.com.ua'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

/**
 *  App Configuration
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(cors(corsOptions));
app.use(passport.initialize());

/**
 * Routes Definitions
 */
app.use('/', appRoute);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
