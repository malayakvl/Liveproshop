import { handleActions } from 'redux-actions';
import { fetchFormAction } from './actions';

const initialState: {
    loading: boolean;
    item: Settings.SettingItem;
} = {
    loading: false,
    item: {
        user_id: 0,
        cart_duration: '',
        type: '',
        free_shipping_timer: false,
        free_shipping_status: '',
        created_at: '',
        updated_at: ''
    }
};

const ACTION_HANDLERS: any = {
    [fetchFormAction]: {
        next: (
            state: State.Settings,
            action: Type.ReduxAction<Pick<State.Settings, 'item'>>
        ): State.Settings => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Settings): State.Settings => ({
            ...state,
            loading: false,
            isFetched: true
        })
    }
};

export { fetchFormAction };

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
