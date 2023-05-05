import * as express from 'express';
import TestController from '../controllers/TestController.js';
import UserController from '../controllers/UserController.js';
import PageController from '../controllers/PageController.js';
import CountryController from '../controllers/CountryController.js';
import NotificationController from '../controllers/NotificationController.js';
import ProductController from '../controllers/ProductController.js';
import TagController from '../controllers/TagController.js';
import ShippingController from '../controllers/ShippingController.js';
import userModel from '../models/User.js';
import ChatbotController from "../controllers/ChatbotController.js";
import LivesessionController from "../controllers/LivesessionController.js";
import ChatbotMessageController from "../controllers/ChatbotMessageController.js";
import OrderController from "../controllers/OrderController.js";
import SupportController from '../controllers/SupportController.js';
import PaymentController from "../controllers/PaymentController.js";
import BuyerController from "../controllers/BuyerController.js";
import SellerController from "../controllers/SellerController.js";
import DashboardController from "../controllers/DashboardController.js";
import PaymentPlanController from "../controllers/PaymentPlanController.js";
import CheckoutController from "../controllers/CheckoutController.js";
import ContactUsController from "../controllers/ContactUsController.js";


const apiRoutes = express.Router();

apiRoutes.use(express.json({
    inflate: true,
    limit: '512kb',
    strict: true
}));

apiRoutes.route('/post-test').get(TestController.testData);
apiRoutes.route('/post-test').post(TestController.testData);
apiRoutes.route('/upload').post(TestController.uploadFile);
apiRoutes.route('/invoice').get(OrderController.generateInvoice);

apiRoutes.route('/countries').get(CountryController.getAll);

apiRoutes.route('/pages/all').get(PageController.getAll);
apiRoutes.route('/pages').get(PageController.getPage);
apiRoutes.route('/fetch-live-sessions').get(LivesessionController.getAllInAir);
apiRoutes.route('/launched-session/:id').get(LivesessionController.launchedSession);
apiRoutes.route('/fetch-session-for-start').get(LivesessionController.getSessionsForStart);
apiRoutes.route('/fetch-active-sessions').get(LivesessionController.getActiveSessions);
apiRoutes.route('/update-session-status').get(LivesessionController.updateSessionStatusFB);
apiRoutes.route('/fetch-launch-stop-sessions').get(LivesessionController.getLaunchForStop);
apiRoutes.route('/add-live-messages').post(ChatbotMessageController.addMessages);
apiRoutes.route('/parse-live-messages').get(ChatbotMessageController.parseMessages);
apiRoutes.route('/create-orders').get(OrderController.createOrders);

apiRoutes.route('/check-payment-status').post(UserController.checkPaymentStatus);
apiRoutes.route('/subscription').post(UserController.createUserFromSubscription);
apiRoutes.route('/payment-plans').get(PaymentPlanController.fetchItems);
apiRoutes.route('/get-plan-info').get(PaymentPlanController.fetchPlanInfo);
apiRoutes.route('/create-payment-intent').post(PaymentPlanController.stripeClientSecret);
apiRoutes.route('/contact-us').post(ContactUsController.sendMessage);
apiRoutes.route('/request-demo').post(ContactUsController.requestDemo);

/** ===================================================================== */
/** ================== AUTHENTIFICATED ROUTES =========================== */
/** ===================================================================== */
apiRoutes.use(async (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const decodedJsonObjectString = Buffer.from(bearer[1], 'base64').toString('ascii');
        const decodedJsonObject = decodedJsonObjectString.split(':');
        req.user = await userModel.findUserByEmail(decodedJsonObject[0]);
        next();
    } else {
        res.status(401).json({ code: 401, message: 'Do not have permissions' });
        next();
    }
});
apiRoutes.post('/changePassword', UserController.changePassword);
apiRoutes.get('/profile/subscription', UserController.getSubscription);
apiRoutes.post('/profile/delete-payment-method', UserController.deletePaymentMethod);
apiRoutes.post('/profile/default-payment-method', UserController.defaultPaymentSetup);
apiRoutes.post('/profile/add-payment-method', UserController.addPaymentMethod);
apiRoutes.post('/profile/update-subscription-plan', UserController.updateSubscriptionPlan);
apiRoutes.get('/profile/unsubscription', UserController.unsubscribe);
apiRoutes.get('/profile/generate-stripe-invoice', UserController.generateInvoice);
apiRoutes.route('/profile')
    .post(UserController.updateProfile)
    .get(UserController.getProfile);
apiRoutes.route('/address')
    .post(UserController.saveAddress);
apiRoutes.route('/fetch-notifications').get(NotificationController.fetchData);
apiRoutes.route('/count-notice').get(NotificationController.fetchNew);
apiRoutes.route('/new-notice').get(NotificationController.fetchLatest);

apiRoutes.route('/product').post(ProductController.addProduct);
apiRoutes.route('/products/fetch-additional').get(ProductController.fetchAdditional);
apiRoutes.route('/fetch-product/:id').get(ProductController.fetchProduct);
apiRoutes.route('/fetch-products').get(ProductController.fetchData);
apiRoutes.route('/products/copy/:id').get(ProductController.copyRow);
apiRoutes.route('/products/delete/:id').delete(ProductController.deleteRow);
apiRoutes.route('/products/photo-delete/:id').post(ProductController.deletePhoto);
apiRoutes.route('/products/bulk-delete').post(ProductController.bulkDelete);
apiRoutes.route('/products/bulk-copy').post(ProductController.bulkCopy);
apiRoutes.route('/products/import').post(ProductController.import);
apiRoutes.route('/products/find').get(ProductController.find);

apiRoutes.route('/tags/find').get(TagController.fetchTags);

apiRoutes.route('/chatbot').post(ChatbotController.storeItem);
apiRoutes.route('/chatbot-default').post(ChatbotController.storeItemDefault);
apiRoutes.route('/chatbot/delete/:id').delete(ChatbotController.deleteRow);
apiRoutes.route('/fetch-chatbot-messages').get(ChatbotController.fetchItems);
apiRoutes.route('/fetch-chatbot-default-messages').get(ChatbotController.fetchItemsSystem);
apiRoutes.route('/fetch-chatbot-message/:id').get(ChatbotController.fetchItem);
apiRoutes.route('/chatbot/bulk-delete').post(ChatbotController.bulkDelete);
apiRoutes.route('/chatbot/change-active/:id').get(ChatbotController.changeActive);
apiRoutes.route('/chatbot/change-active-all').get(ChatbotController.changeAllActive);

apiRoutes.route('/orders/fetch-items').get(OrderController.fetchItems);
apiRoutes.route('/orders/fetch-waiting-items').get(OrderController.fetchWaitingList);
apiRoutes.route('/orders/fetch-filters').get(OrderController.fetchFilters);
apiRoutes.route('/create-order/:id/').get(OrderController.generateInvoice);
apiRoutes.route('/create-order/:id/:locale').get(OrderController.generateInvoice);
apiRoutes.route('/orders/bulk-shipping').post(OrderController.setupShipped);
apiRoutes.route('/orders/bulk-cancel').post(OrderController.bulkCancel);
apiRoutes.route('/orders/bulk-download').post(OrderController.bulkDownload);
apiRoutes.route('/order/run-wait-workflow').post(OrderController.runWaitWorkflow);
apiRoutes.route('/order/update-config-qty').post(OrderController.updateProductConfigQty);

apiRoutes.route('/payments/fetch-items').get(PaymentController.fetchItems);
apiRoutes.route('/payments/fetch-item').get(PaymentController.fetchItem);
apiRoutes.route('/payments/fetch-methods').get(PaymentController.fetchMethods);
apiRoutes.route('/payments/change-methods-statuses').patch(PaymentController.changeMethodsStatuses);
apiRoutes.route('/payments/fetch-filters').get(PaymentController.fetchFilters);
apiRoutes.route('/payments/download-invoice/:orderNumber').get(PaymentController.downloadInvoice);

apiRoutes.route('/buyers/fetch-items').get(BuyerController.fetchItems);
apiRoutes.route('/buyers/fetch-item').get(BuyerController.fetchItem);
apiRoutes.route('/buyers/fetch-filters').get(BuyerController.fetchFilters);

apiRoutes.route('/sellers/fetch-items').get(SellerController.fetchItems);
apiRoutes.route('/sellers/fetch-filters').get(SellerController.fetchFilters);
apiRoutes.route('/sellers/update-percent').post(SellerController.updatePercent);
apiRoutes.route('/sellers/history').get(SellerController.percentHistory);
apiRoutes.route('/sellers/unsubscribe').post(SellerController.unsubscribe);

apiRoutes.route('/users/find-seller').get(UserController.fetchSellers);
apiRoutes.route('/users/find-buyer').get(UserController.fetchBuyers);
apiRoutes.route('/dashboard/fetch-items').get(DashboardController.fetchItems);

apiRoutes.route('/support/send-message').post(SupportController.sendMessage);

apiRoutes.route('/livesession').post(LivesessionController.storeItem);
apiRoutes.route('/livesession/stop/:id').get(LivesessionController.stopSession);
apiRoutes.route('/livesession/fetch-items').get(LivesessionController.fetchItems);
apiRoutes.route('/livesession/fetch-scenarios').get(LivesessionController.fetchScenarios);

apiRoutes.route('/fetch-settings').get(UserController.fetchSettings);
apiRoutes.route('/update-settings').post(UserController.updateSettings);

// apiRoutes.route('/payment-plans').get(PaymentPlanController.fetchItems);
apiRoutes.route('/payment-plans').post(PaymentPlanController.updateStatus);
apiRoutes.route('/payment-stripe-plans').get(PaymentPlanController.fetchStripeProducts);
apiRoutes.route('/sync-stripe').post(PaymentPlanController.syncStripe);

apiRoutes.route('/checkout').get(CheckoutController.fetch);
apiRoutes.route('/checkout/fetch-shipping-methods').get(CheckoutController.fetchShippingMethodsByCountry);
apiRoutes.route('/checkout').post(CheckoutController.chechoutSubmit);
apiRoutes.route('/checkout/confirm').post(CheckoutController.chechoutComfirmation);

//FB routes
apiRoutes.route('/fb-authenticate').post(UserController.syncFb);

apiRoutes.route('/exist-user-subscription').post(UserController.createExistUserSubscription);
apiRoutes.route('/skip-exist-user-subscription').post(UserController.skipExistUserSubscription);

apiRoutes.route('/shipping/create').post(ShippingController.create);
apiRoutes.route('/shipping/fetch-all').get(ShippingController.fetchAll);
apiRoutes.route('/shipping/fetch/:id').get(ShippingController.fetch);
apiRoutes.route('/shipping/update/:id').post(ShippingController.update);
apiRoutes.route('/shipping/delete/:id').delete(ShippingController.delete);
apiRoutes.route('/shipping/save-countries/:id').post(ShippingController.saveCountries);
apiRoutes.route('/shipping/change-statuses').put(ShippingController.changeStatuses);
apiRoutes.route('/shipping/change-status/:id').put(ShippingController.changeStatus);
apiRoutes.route('/shipping/threshold').post(ShippingController.setThreshold);
apiRoutes.route('/shipping/threshold').get(ShippingController.fetchThreshold);




apiRoutes.get('/*', defaultHandler);

export default apiRoutes;

// Default handler for unknown routes
function defaultHandler(req, res) {
    res.status(404).send('Unknown API endpoint');
}
