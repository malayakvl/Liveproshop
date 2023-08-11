import { Action, handleActions } from 'redux-actions';
import {
    fetchUserAction,
    setUserAction,
    hideRegisterFormAction,
    createExistUserSubscriptionAction,
    createUserFromSubscriptionAction,
    checkPaymentStatusAction,
    fetchUserSubscriptionAction,
    showChangeSubscriptionFormAction,
    skipExistUserSubscriptionAction,
    setupFreeSubscriptionAction,
    skipExistUserSubscriptionNewAction,
    setRedirectAfterSubscription
} from './actions';

// const initialState: State.User = {
//     user: {} as User.User,
//     hideRegisterFrom: false,
//     subscription: {},
//
// };
const initialState: {
    clientSecret: null;
    subscription: null;
    user: User.User;
    paymentIntent: null;
    showChangeSubscription: boolean;
    forFree: boolean | string;
    redirectAfterSubscription: boolean;
} = {
    user: {} as User.User,
    clientSecret: null,
    subscription: null,
    paymentIntent: null,
    showChangeSubscription: false,
    forFree: false,
    redirectAfterSubscription: false
};

const ACTION_HANDLERS: any = {
    [fetchUserAction]: {
        next: (state: State.User, action: Action<any>): State.User => ({
            ...state,
            user: action.payload
        })
    },
    [setUserAction]: {
        next: (state: State.User, action: Action<any>): State.User => ({
            ...state,
            user: action.payload
        })
    },
    [hideRegisterFormAction]: {
        next: (state: State.User, action: Action<any>): State.User => ({
            ...state,
            hideRegisterFrom: action.payload
        })
    },
    [createExistUserSubscriptionAction]: {
        next: (
            state: State.User,
            action: Type.ReduxAction<Pick<State.User, 'subscription' | 'clientSecret'>>
        ): State.User => ({
            ...state,
            ...action.payload
        }),
        throw: (state: State.User): State.User => ({
            ...state
        })
    },
    [createUserFromSubscriptionAction]: {
        next: (
            state: State.User,
            action: Type.ReduxAction<Pick<State.User, 'subscription' | 'clientSecret'>>
        ): State.User => ({
            ...state,
            ...action.payload
        }),
        throw: (state: State.User): State.User => ({
            ...state
        })
    },
    [skipExistUserSubscriptionAction]: {
        next: (
            state: State.User,
            action: Type.ReduxAction<Pick<State.User, 'subscription' | 'clientSecret'>>
        ): State.User => ({
            ...state,
            ...action.payload
        }),
        throw: (state: State.User): State.User => ({
            ...state
        })
    },
    [checkPaymentStatusAction]: {
        next: (
            state: State.User,
            action: Type.ReduxAction<Pick<State.User, 'paymentIntent'>>
        ): State.User => ({
            ...state,
            ...action.payload
        }),
        throw: (state: State.User): State.User => ({
            ...state
        })
    },
    [fetchUserSubscriptionAction]: {
        next: (
            state: State.User,
            action: Type.ReduxAction<Pick<State.User, 'subscription'>>
        ): State.User => ({
            ...state,
            ...action.payload
        }),
        throw: (state: State.User): State.User => ({
            ...state
        })
    },
    [showChangeSubscriptionFormAction]: {
        next: (state: State.User, action: Action<boolean>): State.User => ({
            ...state,
            showChangeSubscription: action.payload
        })
    },
    [setupFreeSubscriptionAction]: {
        next: (state: State.User, action: Action<boolean>): State.User => ({
            ...state,
            forFree: action.payload
        })
    },
    [setRedirectAfterSubscription]: {
        next: (state: State.User, action: Action<boolean>): State.User => ({
            ...state,
            redirectAfterSubscription: action.payload
        })
    }
};

export {
    fetchUserAction,
    setUserAction,
    hideRegisterFormAction,
    createExistUserSubscriptionAction,
    createUserFromSubscriptionAction,
    checkPaymentStatusAction,
    fetchUserSubscriptionAction,
    showChangeSubscriptionFormAction,
    skipExistUserSubscriptionAction,
    setupFreeSubscriptionAction,
    skipExistUserSubscriptionNewAction,
    setRedirectAfterSubscription
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState as any);
