import { fetchShippingAction, fetchShippingsAction } from './actions';
import { handleActions } from 'redux-actions';

const initialState: State.Shippings = {
    list: [],
    shipping: null
};

const ACTION_HANDLERS: any = {
    [fetchShippingsAction]: {
        next: (state: State.Root, action: Type.ReduxAction<State.Shippings>): State.Shippings =>
            action.payload
    },
    [fetchShippingAction]: {
        next: (state: State.Root, action: Type.ReduxAction<Shipping>): Shipping => action.payload
    }
};

export default handleActions(ACTION_HANDLERS, initialState as any);
