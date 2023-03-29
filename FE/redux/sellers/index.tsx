import { Action, handleActions } from 'redux-actions';
import {
    fetchItemsAction,
    fetchItemAction,
    showLoginFormAction,
    showPopupAction,
    fetchFilerItems,
    showDateSelectorAction,
    setSelectedSellerAction,
    showPersentFormAction,
    showPersentConfirmFormAction,
    setSellerPercentAction,
    showUnsubscribeConfirmFormAction,
    showSellerPercentHistoryAction,
    fetchHistoryAction
} from './actions';

const initialState: {
    isFetched: boolean;
    loading: boolean;
    count: number;
    items: Orders.DataItem[];
    item: any;
    showPopup: boolean;
    fileterData: any;
    showDateSelector: boolean;
    showLoginForm: boolean;
    selectedSeller: string;
    showPersentForm: boolean;
    showPersentConfirmForm: boolean;
    showUnsubscribeConfirmForm: boolean;
    sellerPercent: number | null;
    showHistoryPersentForm: boolean;
    itemsHistory: any;
} = {
    isFetched: false,
    loading: false,
    count: 0,
    items: [],
    item: {},
    showPopup: false,
    fileterData: {
        total_orders: [],
        total_buyers: [],
        total_sessions: [],
        countries: [],
        shippings: [],
        amounts: []
    },
    showDateSelector: false,
    showLoginForm: false,
    showPersentForm: false,
    showPersentConfirmForm: false,
    showUnsubscribeConfirmForm: false,
    selectedSeller: '',
    sellerPercent: null,
    showHistoryPersentForm: false,
    itemsHistory: []
};

const ACTION_HANDLERS: any = {
    [fetchItemsAction]: {
        next: (
            state: State.Sellers,
            action: Type.ReduxAction<Pick<State.Sellers, 'count' | 'items'>>
        ): State.Sellers => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Sellers): State.Sellers => ({
            ...state,
            loading: false,
            isFetched: false
        })
    },
    [fetchHistoryAction]: {
        next: (
            state: State.Sellers,
            action: Type.ReduxAction<Pick<State.Sellers, 'itemsHistory'>>
        ): State.Sellers => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Sellers): State.Sellers => ({
            ...state,
            loading: false,
            isFetched: false
        })
    },
    // [fetchItemAction]: {
    //     next: (
    //         state: State.Orders,
    //         action: Type.ReduxAction<Pick<State.Orders, 'item'>>
    //     ): State.Orders => ({
    //         ...state,
    //         ...action.payload,
    //         loading: false,
    //         isFetched: true
    //     }),
    //     throw: (state: State.Orders): State.Orders => ({
    //         ...state,
    //         loading: false,
    //         isFetched: true
    //     })
    // },
    [fetchFilerItems]: {
        next: (
            state: State.Sellers,
            action: Type.ReduxAction<Pick<State.Sellers, 'fileterData'>>
        ): State.Sellers => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Sellers): State.Sellers => ({
            ...state,
            loading: false,
            isFetched: true
        })
    },
    [showPopupAction]: {
        next: (state: State.Sellers, action: Action<boolean>): State.Sellers => ({
            ...state,
            showPopup: action.payload
        })
    },
    [showLoginFormAction]: {
        next: (state: State.Sellers, action: Action<boolean>): State.Sellers => ({
            ...state,
            showLoginForm: action.payload
        })
    },
    [showPersentFormAction]: {
        next: (state: State.Sellers, action: Action<boolean>): State.Sellers => ({
            ...state,
            showPersentForm: action.payload
        })
    },
    [showPersentConfirmFormAction]: {
        next: (state: State.Sellers, action: Action<boolean>): State.Sellers => ({
            ...state,
            showPersentConfirmForm: action.payload
        })
    },
    [showUnsubscribeConfirmFormAction]: {
        next: (state: State.Sellers, action: Action<boolean>): State.Sellers => ({
            ...state,
            showUnsubscribeConfirmForm: action.payload
        })
    },
    [showDateSelectorAction]: {
        next: (state: State.Sellers, action: Action<boolean>): State.Sellers => ({
            ...state,
            showDateSelector: action.payload
        })
    },
    [setSelectedSellerAction]: {
        next: (state: State.Sellers, action: Action<string>): State.Sellers => ({
            ...state,
            selectedSeller: action.payload
        })
    },
    [setSellerPercentAction]: {
        next: (state: State.Sellers, action: Action<number | null>): State.Sellers => ({
            ...state,
            sellerPercent: action.payload
        })
    },
    [showSellerPercentHistoryAction]: {
        next: (state: State.Sellers, action: Action<boolean>): State.Sellers => ({
            ...state,
            showHistoryPersentForm: action.payload
        })
    }
};

export {
    fetchItemsAction,
    fetchItemAction,
    showPopupAction,
    showLoginFormAction,
    fetchFilerItems,
    showDateSelectorAction,
    setSelectedSellerAction,
    showPersentFormAction,
    showPersentConfirmFormAction,
    setSellerPercentAction,
    showUnsubscribeConfirmFormAction,
    showSellerPercentHistoryAction
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
