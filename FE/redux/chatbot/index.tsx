import { Action, handleActions } from 'redux-actions';
import {
    fetchDataAction,
    fetchFormAction,
    fetchDataSystemAction,
    showFormAction,
    showItemAction,
    setEmptyFormAction,
    switchChangeStatusAction,
    fetchCurrentSessionAction
} from './actions';

const initialState: {
    isFetched: boolean;
    count: number;
    loading: boolean;
    items: Chatbot.ChatbotItem[];
    itemsSystem: Chatbot.ChatbotItem[];
    item: Chatbot.ChatbotItem;
    showForm: boolean;
    showedItems: number[];
    changeActiveStatus: boolean | null;
    liveSessions: any[];
} = {
    loading: false,
    isFetched: false,
    count: 0,
    items: [],
    itemsSystem: [],
    item: {
        id: null,
        name: '',
        keywords: '',
        message_fr: '',
        message_en: '',
        active: true,
        answer_count: '',
        product: null,
        discount: '',
        created_at: null,
        updated_at: null
    },
    showForm: false,
    showedItems: [],
    changeActiveStatus: null,
    liveSessions: []
};

const ACTION_HANDLERS: any = {
    [fetchDataAction]: {
        next: (
            state: State.Chatbot,
            action: Type.ReduxAction<Pick<State.Chatbot, 'count' | 'items'>>
        ): State.Chatbot => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Chatbot): State.Chatbot => ({
            ...state,
            loading: false,
            isFetched: false
        })
    },
    [fetchDataSystemAction]: {
        next: (
            state: State.Chatbot,
            action: Type.ReduxAction<Pick<State.Chatbot, 'itemsSystem'>>
        ): State.Chatbot => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Chatbot): State.Chatbot => ({
            ...state,
            loading: false,
            isFetched: false
        })
    },
    [fetchFormAction]: {
        next: (
            state: State.Chatbot,
            action: Type.ReduxAction<Pick<State.Chatbot, 'item'>>
        ): State.Chatbot => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Chatbot): State.Chatbot => ({
            ...state,
            loading: false,
            isFetched: true
        })
    },
    [setEmptyFormAction]: {
        next: (state: State.Chatbot): State.Chatbot => ({
            ...state,
            item: {
                id: null,
                name: '',
                keywords: '',
                message_fr: '',
                message_en: '',
                active: true,
                product: null,
                discount: '',
                answer_count: '',
                created_at: null,
                updated_at: null
            }
        })
    },
    [showFormAction]: {
        next: (state: State.Chatbot, action: Action<boolean>): State.Chatbot => ({
            ...state,
            showForm: action.payload
        })
    },
    [switchChangeStatusAction]: {
        next: (state: State.Chatbot, action: Action<boolean>): State.Chatbot => ({
            ...state,
            changeActiveStatus: action.payload
        })
    },
    [showItemAction]: {
        next: (state: State.Chatbot, action: Action<number>): State.Chatbot => ({
            ...state,
            showedItems: state.showedItems.includes(action.payload)
                ? state.showedItems.filter((id) => id !== action.payload)
                : [...state.showedItems, action.payload]
        })
    },
    [fetchCurrentSessionAction]: {
        next: (
            state: State.Chatbot,
            action: Type.ReduxAction<Pick<State.Chatbot, 'liveSessions'>>
        ): State.Chatbot => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Chatbot): State.Chatbot => ({
            ...state,
            loading: false,
            isFetched: false
        })
    }
};

export {
    fetchDataAction,
    fetchFormAction,
    fetchDataSystemAction,
    showFormAction,
    showItemAction,
    setEmptyFormAction,
    switchChangeStatusAction,
    fetchCurrentSessionAction
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
