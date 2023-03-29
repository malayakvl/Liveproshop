import { handleActions } from 'redux-actions';
import { fetchCountriesAction } from './actions';

const initialState: State.Countries = [];

const ACTION_HANDLERS: any = {
    [fetchCountriesAction]: {
        next: (
            state: State.Countries,
            action: Type.ReduxAction<State.Countries>
        ): State.Countries => action.payload,
        throw: (state: State.Countries): State.Countries => ({
            ...state,
            loading: false,
            isFetched: false
        })
    }
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
