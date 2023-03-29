import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.user,
    (user: State.User): State.User => user
);

export const userSelector = createSelector(
    rootSelector,
    (user: State.User): User.User => user.user
);

export const hideRegisterFormSelector = createSelector(
    rootSelector,
    (user: State.User): boolean => user.hideRegisterFrom
);

export const userSubscriptionSelector = createSelector(
    rootSelector,
    (user: State.User): any => user.subscription
);

export const clientSecretSelector = createSelector(
    rootSelector,
    (user: State.User): any => user.clientSecret
);
export const paymentIntentSelector = createSelector(
    rootSelector,
    (user: State.User): any => user.paymentIntent
);
export const showChangeSubscriptionSelector = createSelector(
    rootSelector,
    (user: State.User): any => user.showChangeSubscription
);
