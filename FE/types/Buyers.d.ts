declare namespace Buyers {
    interface Root {
        count: number;
        items: DataItem[];
        item: DataItem;
        // orders: { [index]: Orders.DataItem[] };
        methods: PaymentMethod[];
        isFetched: boolean;
        loading: boolean;
        showPopup: boolean;
        fileterData: any;
        showDateSelector: boolean;
        tagSellersSuggestions: any[];
        tagBuyerssSuggestions: any[];
    }

    interface DataItem {
        buyer_id: number;
        buyer_email: string;
        buyer_first_name: string;
        buyer_last_name: string;
        buyer_photo: string;
        buyer_phone: string;
        buyer_full_address: string;
        country_iso: string;
        country_name: string;
        total_count: number;
        total_amount: number;
        buyer_address: string;
        order_items: OrderDataItem[];
        country_json: any;
    }

    interface OrderDataItem extends Orders.DataItem {
        order_items_count: number;
    }
}
