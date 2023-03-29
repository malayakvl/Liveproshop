import { Action, handleActions } from 'redux-actions';
import {
    fetchItemsAction,
    setEmptyFormAction,
    showPopupAction,
    // fetchFilerItems,
    showDateSelectorAction
} from './actions';

const initialState: {
    isFetched: boolean;
    loading: boolean;
    orders: Orders.DataItem[];
    buyers: Buyers.DataItem[];
    totals: Dashboard.Totals;
    showPopup: boolean;
    fileterData: any;
    showDateSelector: boolean;
} = {
    isFetched: false,
    loading: false,
    orders: [],
    buyers: [],
    totals: {
        total_amount: 0,
        total_buyers: 0,
        total_pending: 0
    },
    showPopup: false,
    fileterData: {
        // dashboard: [],
        // countries: [],
        // shippings: [],
        // amounts: []
    },
    showDateSelector: false
};

const ACTION_HANDLERS: any = {
    [fetchItemsAction]: {
        next: (
            state: State.Dashboard,
            action: Type.ReduxAction<Pick<State.Dashboard, 'orders' | 'buyers'>>
        ): State.Dashboard => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Dashboard): State.Dashboard => ({
            ...state,
            loading: false,
            isFetched: false
        })
    },
    // [fetchFilerItems]: {
    //     next: (
    //         state: State.Dashboard,
    //         action: Type.ReduxAction<Pick<State.Dashboard, 'fileterData'>>
    //     ): State.Dashboard => ({
    //         ...state,
    //         ...action.payload,
    //         loading: false,
    //         isFetched: true
    //     }),
    //     throw: (state: State.Dashboard): State.Dashboard => ({
    //         ...state,
    //         loading: false,
    //         isFetched: true
    //     })
    // },
    // [setEmptyFormAction]: {
    //     next: (state: State.Dashboard): State.Dashboard => ({
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
        next: (state: State.Dashboard, action: Action<boolean>): State.Dashboard => ({
            ...state,
            showPopup: action.payload
        })
    },
    [showDateSelectorAction]: {
        next: (state: State.Dashboard, action: Action<boolean>): State.Dashboard => ({
            ...state,
            showDateSelector: action.payload
        })
    }
};

export {
    fetchItemsAction,
    showPopupAction,
    setEmptyFormAction,
    // fetchFilerItems,
    showDateSelectorAction
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
