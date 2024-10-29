import { Action, handleActions } from 'redux-actions';
import {
    fetchItemsAction,
    fetchItemAction,
    setEmptyFormAction,
    showPopupAction,
    fetchScenariosAction,
    setLiveSessionStoreAction
} from './actions';

const initialState: {
    isFetched: boolean;
    loading: boolean;
    count: number;
    items: Livesessions.DataItem[];
    item: Livesessions.DataItem;
    showPopup: boolean;
    itemScenarios: Livesessions.DataScenario[];
    selectedStoreId: number | null;
    longToken: string | null;
} = {
    isFetched: false,
    loading: false,
    count: 0,
    items: [],
    item: {
        id: null,
        event_date: '',
        event_time: '',
        order_timer: '',
        closed: false,
        created_at: '',
        updated_at: ''
    },
    showPopup: false,
    itemScenarios: [],
    selectedStoreId: null,
    longToken: null
};

const ACTION_HANDLERS: any = {
    [fetchItemsAction]: {
        next: (
            state: State.Livesessions,
            action: Type.ReduxAction<Pick<State.Livesessions, 'count' | 'items'>>
        ): State.Livesessions => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Livesessions): State.Livesessions => ({
            ...state,
            loading: false,
            isFetched: false
        })
    },
    [fetchItemAction]: {
        next: (
            state: State.Livesessions,
            action: Type.ReduxAction<Pick<State.Livesessions, 'item'>>
        ): State.Livesessions => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Livesessions): State.Livesessions => ({
            ...state,
            loading: false,
            isFetched: true
        })
    },
    [setEmptyFormAction]: {
        next: (state: State.Livesessions): State.Livesessions => ({
            ...state,
            item: {
                id: null,
                event_date: '',
                event_time: '',
                order_timer: '',
                closed: false,
                created_at: null,
                updated_at: null
            }
        })
    },
    [showPopupAction]: {
        next: (state: State.Livesessions, action: Action<boolean>): State.Livesessions => ({
            ...state,
            showPopup: action.payload
        })
    },
    [setLiveSessionStoreAction]: {
        next: (state: State.Livesessions, action: Action<any>): State.Livesessions => ({
            ...state,
            selectedStoreId: action.payload
        })
    }
};

export {
    fetchItemsAction,
    fetchItemAction,
    showPopupAction,
    setEmptyFormAction,
    fetchScenariosAction,
    setLiveSessionStoreAction
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
