declare namespace Livesessions {
    interface Root {
        count: number;
        items: DataItem[];
        item: DataItem;
        isFetched: boolean;
        loading: boolean;
        showPopup: boolean;
        itemScenarios: DataScenario[];
    }

    interface DataScenario {
        id: number;
        name: string;
    }

    interface DataItem {
        id: number | null;
        event_date: string;
        event_time: string;
        order_timer: string;
        closed: boolean;
        created_at: any;
        updated_at: any;
    }
}
