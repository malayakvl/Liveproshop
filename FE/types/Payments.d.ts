declare namespace Payments {
    interface Root {
        count: number;
        items: DataItem[];
        item: DataItemDetailed | null;
        methods: PaymentMethod[];
        isFetched: boolean;
        loading: boolean;
        showPopup: boolean;
        fileterData: any;
        showDateSelector: boolean;
    }

    interface DataItem {
        id: number;
        // live_sessions_id: number;
        // shipping_id: number | null;
        // country_id: number | null;
        payment_id: number | null;
        payment_name: string;
        payment_short_name: string;
        // order_amount: number;
        // discount_amount: number;
        // shipping_amount: number;
        total_amount: number;
        order_number: number;
        // status: string;
        // seller_id: number;
        // seller_first_name: string;
        // seller_photo: string;
        // buyer_id: number;
        buyer_first_name: string;
        buyer_photo: string;
        // buyer_email: string;
        // flag_name: string | null;
        // shipping_image: string | null;
        // shipping_address: string;
        // order_items: any;
        // user_id: number;
        // user_name: string;
        // photo: string;
        // shipping_name: string | null;
        // country_name: string | null;
        // payment_name: string | null;
        created_at: any;
        updated_at: any;
    }

    interface DataItemDetailed {
        id: number;
        // live_sessions_id: number;
        // shipping_id: number | null;
        // country_id: number | null;
        payment_id: number | null;
        payment_name: string;
        payment_short_name: string;
        order_amount: number;
        // discount_amount: number;
        shipping_amount: number;
        total_amount: number;
        order_number: number;
        // status: string;
        // seller_id: number;
        // seller_first_name: string;
        // seller_photo: string;
        // buyer_id: number;
        buyer_first_name: string;
        buyer_photo: string;
        buyer_email: string;
        flag_name: string | null;
        shipping_image: string | null;
        shipping_address: string;
        order_items: any;
        // user_id: number;
        // user_name: string;
        // photo: string;
        // shipping_name: string | null;
        // country_name: string | null;
        payment_name: string | null;
        created_at: any;
        updated_at: any;
    }

    interface PaymentMethod {
        payment_id: number;
        name: string;
        short_name: string;
        status: boolean;
    }
}
