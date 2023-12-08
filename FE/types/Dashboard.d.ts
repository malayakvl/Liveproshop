declare namespace Dashboard {
    interface Root {
        orders: Orders.DataItem[];
        buyers: Buyers.DataItem[];
        totals: Totals;
        isFetched: boolean;
        loading: boolean;
        showPopup: boolean;
        fileterData: any;
        showDateSelector: boolean;
        dashboardFetched: boolean;
    }

    interface Totals {
        total_amount: number;
        total_buyers: number;
        total_pending: number;
        total_refund: number;
    }
}
