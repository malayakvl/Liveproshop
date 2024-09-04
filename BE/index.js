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
// import sgMail from '@sendgrid/mail';


/**
 * App Variables
 */
const app = express();
const port = process.env.APPLICATION_PORT || '4000';
const __dirname = path.resolve();
const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000', 'https://dev-tech.com.ua', 'http://35.180.114.80', 'http://35.180.114.80:81', 'https://api.liveproshop.com', 'https://liveproshop.com'];
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

app.use(bodyParser.json({limit: '2gb'}));
app.use(bodyParser.urlencoded({limit: '2gb', extended: false}));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(cors(corsOptions));
app.use(passport.initialize());
// app.use(express.urlencoded({ extended: false, limit: '2gb' }));

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
