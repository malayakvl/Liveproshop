declare namespace Chatbot {
    interface Root {
        count: number;
        items: ChatbotItem[];
        itemsSystem: ChatbotItem[];
        item: ChatbotItem;
        isFetched: boolean;
        loading: boolean;
        isSystemLoaded: boolean;
        showForm: boolean;
        showedItems: number[];
        changeActiveStatus: boolean | null;
        liveSessions: any[];
    }

    interface ChatbotItem {
        id: number | null;
        name: string;
        keywords: string;
        message_fr: string;
        message_en: string;
        active: boolean;
        answer_count: any;
        discount: any;
        product: any;
        created_at: any;
        updated_at: any;
    }
}
