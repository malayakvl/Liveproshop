import { handleActions } from 'redux-actions';
import { fetchNotificationsAction, fetchLatestAction } from './actions';

const initialState: State.Notifications = {
    cntNew: 0,
    notificationsLatest: [],
    notifications: [],
    notification: {} as Notifications.Notification,
    loading: false,
    isFetched: false,
    count: 0,
    items: []
};

const ACTION_HANDLERS: any = {
    [fetchLatestAction]: {
        next: (
            state: State.Notifications,
            action: Type.ReduxAction<Pick<State.Notifications, 'cntNew' | 'notificationsLatest'>>
        ): State.Notifications => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Notifications): State.Notifications => ({
            ...state,
            loading: false,
            isFetched: false
        })
    },
    [fetchNotificationsAction]: {
        next: (
            state: State.Notifications,
            action: Type.ReduxAction<Pick<State.Notifications, 'count' | 'items'>>
        ): State.Notifications => ({
            ...state,
            ...action.payload,
            loading: false,
            isFetched: true
        }),
        throw: (state: State.Notifications): State.Notifications => ({
            ...state,
            loading: false,
            isFetched: false
        })
    }
};

export { fetchNotificationsAction, fetchLatestAction };

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
