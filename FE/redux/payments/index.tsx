import { Action, handleActions } from 'redux-actions';
import {
    fetchItemsAction,
    fetchItemAction,
    fetchMethodsAction,
    setEmptyFormAction,
    showPopupAction,
    fetchFilerItems,
    showDateSelectorAction
} from './actions';

const initialState: {
    isFetched: boolean;
    loading: boolean;
    count: number;
    items: Payments.DataItem[];
    item: Payments.DataItemDetailed | null;
    methods: Payments.PaymentMethod[];
    showPopup: boolean;
    fileterData: any;
    showDateSelector: boolean;
} = {
    isFetched: false,
    loading: false,
    count: 0,
    items: [],
    item: null,
    methods: [],
    showPopup: false,
    fileterData: {
        payments: [],
        countries: [],
        shippings: [],
        amounts: []
    },
    showDateSelector: false
};

const ACTION_HANDLERS: any = {
    [fetchItemsAction]: {
        next: (
            state: State.Payments,
            action: Type.ReduxAction<Pick<State.Payments, 'count' | 'items'>>
        ): State.Payments => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Payments): State.Payments => ({
            ...state,
            loading: false,
            isFetched: false
        })
    },
    [fetchItemAction]: {
        next: (
            state: State.Payments,
            action: Type.ReduxAction<Pick<State.Payments, 'item'>>
        ): State.Payments => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Payments): State.Payments => ({
            ...state,
            loading: false,
            isFetched: true
        })
    },
    [fetchMethodsAction]: {
        next: (
            state: State.Payments,
            action: Type.ReduxAction<Pick<State.Payments, 'methods'>>
        ): State.Payments => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Payments): State.Payments => ({
            ...state,
            loading: false,
            isFetched: true
        })
    },
    [fetchFilerItems]: {
        next: (
            state: State.Payments,
            action: Type.ReduxAction<Pick<State.Payments, 'fileterData'>>
        ): State.Payments => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Payments): State.Payments => ({
            ...state,
            loading: false,
            isFetched: true
        })
    },
    // [setEmptyFormAction]: {
    //     next: (state: State.Payments): State.Payments => ({
    //         ...state,
    //         item: {
    //             id: null,
    //             name: '',
    //             keywords: '',
    //             message_fr: '',
    //             message_en: '',
    //             active: true,
    //             product: null,
    //             discount: '',
    //             answer_count: '',
    //             created_at: null,
    //             updated_at: null
    //         }
    //     })
    // },
    [showPopupAction]: {
        next: (state: State.Payments, action: Action<boolean>): State.Payments => ({
            ...state,
            showPopup: action.payload
        })
    },
    [showDateSelectorAction]: {
        next: (state: State.Payments, action: Action<boolean>): State.Payments => ({
            ...state,
            showDateSelector: action.payload
        })
    }
};

export {
    fetchItemsAction,
    fetchItemAction,
    fetchMethodsAction,
    showPopupAction,
    setEmptyFormAction,
    fetchFilerItems,
    showDateSelectorAction
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
