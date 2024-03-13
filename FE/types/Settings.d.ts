declare namespace Settings {
    interface Root {
        item: SettingItem;
        loading: boolean;
        isFetched: boolean;
    }

    interface SettingItem {
        user_id: number;
        cart_duration: any;
        type: string;
        free_shipping_timer: any;
        free_shipping_status: any;
        created_at: any;
        updated_at: any;
        doctype: boolean;
        privacy_doc: any;
        terms_doc: any;
        delivery_doc: any;
        return_doc: any;
        privacy_link: any;
        terms_link: any;
        delivery_link: any;
        return_link: any;
    }
}
