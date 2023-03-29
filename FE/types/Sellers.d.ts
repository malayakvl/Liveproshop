declare namespace Sellers {
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
        showLoginForm: boolean;
        showPersentForm: boolean;
        showPersentConfirmForm: boolean;
        showUnsubscribeConfirmForm: boolean;
        showHistoryPersentForm: boolean;
        selectedSeller: string;
        sellerPercent: number | null;
        itemsHistory: any[];
    }

    interface DataItem {
        id: number;
        email: string | null;
        first_name: string | null;
        last_name: string | null;
        company_name: string | null;
        phone: string | null;
        full_address: string | null;
        photo: string | null;
        total_count: number;
        total_buyers: number;
        total_amount: number;
        transaction_percent: number;
        created_at: any;
        updated_at: any;
    }
}
