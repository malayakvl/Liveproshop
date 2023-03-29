declare namespace PaymentPlans {
    interface Root {
        items: { header: any[]; values: any[] };
        loading: boolean;
        isFetched: boolean;
        clientSecret: string;
        planInfo: any;
        stripeItems: any;
        settings: any;
    }

    // interface SettingItem {
    //     user_id: number;
    //     cart_duration: any;
    //     type: string;
    //     free_shipping_timer: any;
    //     free_shipping_status: any;
    //     created_at: any;
    //     updated_at: any;
    // }
}
