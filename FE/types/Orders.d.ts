declare namespace Orders {
    interface Root {
        count: number;
        items: DataItem[];
        itemsStatuses: any[];
        item: DataItem;
        isFetched: boolean;
        loading: boolean;
        showPopup: boolean;
        fileterData: any;
        showDateSelector: boolean;
        orderFetched: boolean;
        fileName: string;
        base64Data: string | null;
        tagSellersSuggestions: any[];
        showCancelPopup: boolean;
        showShippedPopup: boolean;
        achiveName: null | string;
        downloadFileName: null | string;
        commentIdOrder: null | any;
        tmpCommentOrderId: null | any;
        connectedOrderNumber: null | any;
        orderReturnedUrl: null | any;
        redirectCheckout: boolean;
        redirectOrderNumber: any;
    }

    interface DataItem {
        order_items_count: number;
        id: number;
        live_sessions_id: number;
        shipping_id: number | null;
        country_id: number | null;
        payment_id: number | null;
        order_amount: number;
        discount_amount: number;
        total_amount: number;
        order_number: number;
        status: OrderStatus;
        status_waiting: string;
        seller_id: number;
        seller_first_name: string;
        seller_photo: string;
        buyer_id: number;
        buyer_first_name: string;
        buyer_last_name: string;
        buyer_photo: string;
        flag_name: string | null;
        shipping_image: string | null;
        shipping_address?: string | null;
        post_code?: string | null;
        city?: string | null;
        state?: string | null;
        phone?: string | null;
        order_items: any;
        country_json: any;
        freeShipping: number;
        waiting_products: any;
        seller_settings: any;
        countdownDate: any;
        // user_id: number;
        // user_name: string;
        // photo: string;
        // shipping_name: string | null;
        // country_name: string | null;
        // payment_name: string | null;
        created_at: any;
        updated_at: any;
    }

    type OrderStatus = import('../constants').OrderStatus;
}
