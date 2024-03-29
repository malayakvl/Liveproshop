declare namespace User {
    interface Root {
        user: User;
        hideRegisterFrom: boolean;
        subscription: any;
        paymentMethodsAllow: any;
        clientSecret: string;
        paymentIntent: any;
        paymentMethodsNoSubscription: any;
        showChangeSubscription: boolean;
        forFree: boolean | string;
        redirectAfterSubscription: boolean;
        commentId: string;
    }

    interface User {
        id: number;
        role_id: number;
        auth_provider_expiration_time: any;
        subscription_expired: boolean;
        email: string;
        email_real: string;
        photo: string | null;
        first_name: string | null;
        last_name: string | null;
        company_name: string | null;
        full_address: string | null;
        identification_number: string | null;
        subscription_id: string | null;
        subscription: any;
        vat: string | null;
        phone: string | null;
        status: string | null;
        created_at: any;
        updated_at: any;
        plan_id: number | null;
        is_trial: boolean;
        customer_id: string | null;
        selected_locale: string | null;
        plan_options: {
            feature_fb: boolean;
            support_coach: boolean;
            support_email: boolean;
            feature_report: boolean;
            advanced_design: boolean;
            advanced_wallet: boolean;
            support_manager: boolean;
            feature_fb_schedule: boolean;
            advanced_fb_duration: boolean;
            feature_manage_product: boolean;
            feature_unlimited_staff: boolean;
            feature_automatic_payment: boolean;
            feature_unlimited_product: boolean;
            feature_automatic_invoicing: boolean;
            feature_manage_shipping_rule: boolean;
            feature_manage_shipping_price: boolean;
            advanced_ecommerce_integration: boolean;
            advanced_pricing_and_invoicing: boolean;
            advanced_waiting_list_and_notification: boolean;
        };
    }
}
