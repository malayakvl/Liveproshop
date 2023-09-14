declare namespace State {
    interface Root {
        router: Type.RouterRootState;
        address: Address.Root;
        profile: Profile;
        user: User;
        notifications: Notifications;
        layouts: Layouts;
        products: Products;
        chatbot: Chatbot;
        countries: Countries;
        shippings: Shippings;
        livesessions: Livesessions;
        orders: Orders;
        payments: Payments;
        waitingList: WaitingList;
        buyers: Buyers;
        sellers: Sellers;
        dashboard: Dashboard;
        settings: Settings;
        paymentPlans: PaymentPlans;
        checkout: Checkout;
        mystores: Mystores;
    }

    type Address = Address.Root;
    type Profile = Profile.Root;
    type User = User.Root;
    type Notifications = User.Notifications;
    type Layouts = Layouts.Root;
    type Products = Products.Root;
    type Chatbot = Chatbot.Root;
    type Countries = any;
    type Shippings = {
        list: Array<Shipping>;
        shipping: Shipping | null;
    };
    type Shippings = Array<Shipping>;
    type Livesessions = Livesessions.Root;
    type Orders = Orders.Root;
    type Payments = Payments.Root;
    type WaitingList = WaitingList.Root;
    type PaymentPlans = PaymentPlans.Root;
    type Buyers = Buyers.Root;
    type Sellers = Sellers.Root;
    type Dashboard = Dashboard.Root;
    type Settings = Settings.Root;
    type Checkout = Checkout.Root;
    type Mystores = Mystores.Root;
}
