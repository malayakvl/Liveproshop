import { Action, handleActions } from 'redux-actions';
import {
    fetchItemsAction,
    fetchItemAction,
    setEmptyFormAction,
    showPopupAction,
    fetchFilerItems,
    showDateSelectorAction,
    showPopupQtyAction,
    setupConfiguarationIdAction
} from './actions';

const initialState: {
    isFetched: boolean;
    loading: boolean;
    count: number;
    items: WaitingList.DataItem[];
    item: any;
    showPopup: boolean;
    fileterData: any;
    showDateSelector: boolean;
    orderFetched: boolean;
    showQtyModal: boolean;
    selectedConfiguarationItem: any;
} = {
    isFetched: false,
    loading: false,
    count: 0,
    items: [],
    item: {},
    showPopup: false,
    fileterData: {
        payments: [],
        countries: [],
        shippings: [],
        amounts: []
    },
    showDateSelector: false,
    orderFetched: false,
    showQtyModal: false,
    selectedConfiguarationItem: null
};

const ACTION_HANDLERS: any = {
    [fetchItemsAction]: {
        next: (
            state: State.WaitingList,
            action: Type.ReduxAction<Pick<State.WaitingList, 'count' | 'items'>>
        ): State.WaitingList => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.WaitingList): State.WaitingList => ({
            ...state,
            loading: false,
            isFetched: false
        })
    },
    [fetchItemAction]: {
        next: (
            state: State.WaitingList,
            action: Type.ReduxAction<Pick<State.WaitingList, 'item'>>
        ): State.WaitingList => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.WaitingList): State.WaitingList => ({
            ...state,
            loading: false,
            isFetched: true
        })
    },
    [fetchFilerItems]: {
        next: (
            state: State.WaitingList,
            action: Type.ReduxAction<Pick<State.WaitingList, 'fileterData'>>
        ): State.WaitingList => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.WaitingList): State.WaitingList => ({
            ...state,
            loading: false,
            isFetched: true
        })
    },
    [showPopupAction]: {
        next: (state: State.WaitingList, action: Action<boolean>): State.WaitingList => ({
            ...state,
            showPopup: action.payload
        })
    },
    [showDateSelectorAction]: {
        next: (state: State.WaitingList, action: Action<boolean>): State.WaitingList => ({
            ...state,
            showDateSelector: action.payload
        })
    },
    [showPopupQtyAction]: {
        next: (state: State.WaitingList, action: Action<boolean>): State.WaitingList => ({
            ...state,
            showQtyModal: action.payload
        })
    },
    [setupConfiguarationIdAction]: {
        next: (state: State.WaitingList, action: Action<any>): State.WaitingList => ({
            ...state,
            selectedConfiguarationItem: action.payload
        })
    }
};

export {
    fetchItemsAction,
    fetchItemAction,
    showPopupAction,
    setEmptyFormAction,
    fetchFilerItems,
    showDateSelectorAction,
    showPopupQtyAction,
    setupConfiguarationIdAction
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
