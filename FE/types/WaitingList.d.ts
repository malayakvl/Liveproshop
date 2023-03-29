declare namespace WaitingList {
    interface Root {
        count: number;
        items: DataItem[];
        item: DataItem;
        isFetched: boolean;
        loading: boolean;
        showPopup: boolean;
        fileterData: any;
        showDateSelector: boolean;
        orderFetched: boolean;
        showQtyModal: boolean;
        selectedConfiguarationItem: any;
    }

    interface DataItem {
        id: number;
        live_sessions_id: number;
        shipping_id: number | null;
        country_id: number | null;
        payment_id: number | null;
        order_amount: number;
        discount_amount: number;
        total_amount: number;
        order_number: number;
        status: string;
        seller_id: number;
        seller_first_name: string;
        seller_photo: string;
        buyer_id: number;
        buyer_first_name: string;
        buyer_photo: string;
        product_configuration_id: number;
        total_quantity: number;
        total_price: number;
        id_cnt: number;
        flag_name: string | null;
        configuration: any;
        item_buyers: any;
        created_at: any;
        updated_at: any;
    }
}
