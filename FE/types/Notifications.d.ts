declare namespace Notifications {
    interface Root {
        cntNew: number;
        notificationsLatest: Notification[];
        notifications: Notification[];
        notification: Notification;
        count: number;
        items: Notification[];
        loading: boolean;
        isFetched: boolean;
    }

    interface Notification {
        id: number;
        user_id: number;
        subject: string;
        message: string;
        is_read: boolean;
        type: string;
        first_name: string | null;
        last_name: string | null;
        sender_first_name: string | null;
        sender_last_name: string | null;
        sender_photo: string | null;
        created_at: any;
        updated_at: any;
    }
}
