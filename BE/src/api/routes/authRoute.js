import * as express from 'express';
import authController from '../controllers/AuthController.js';

const authRoute = express.Router();

authRoute.use(express.json({
    inflate: true,
    limit: '512kb',
    strict: true
}));

authRoute.post('/login', authController.authLogin);
authRoute.post('/subscription-login', authController.authSubscriptionLogin);
authRoute.post('/admin-seller', authController.authSellerLogin);
authRoute.post('/register', authController.authRegister);
authRoute.post('/invite', authController.authInvite);
authRoute.post('/provider-login', authController.authProviderLogin);
authRoute.post('/provider', authController.authProvider);
authRoute.post('/restorePassword', authController.restorePassword);
authRoute.post('/changePassword', authController.changePassword);
authRoute.get('/invitation/:hash', authController.getInvitation);
authRoute.get('/activate-hash/:hash', authController.activateHash);

export default authRoute;
