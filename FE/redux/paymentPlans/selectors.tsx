import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.paymentPlans,
    (paymentPlans: State.PaymentPlans): State.PaymentPlans => paymentPlans
);

export const itemsSelector = createSelector(
    rootSelector,
    (paymentPlans: State.PaymentPlans): any => paymentPlans.items
);

export const clientSecretSelector = createSelector(
    rootSelector,
    (paymentPlans: State.PaymentPlans): any => paymentPlans.clientSecret
);

export const planInfoSelector = createSelector(
    rootSelector,
    (paymentPlans: State.PaymentPlans): any => paymentPlans.planInfo
);

export const stripeItemsSelector = createSelector(
    rootSelector,
    (paymentPlans: State.PaymentPlans): any => paymentPlans.stripeItems
);
export const settingsSelector = createSelector(
    rootSelector,
    (paymentPlans: State.PaymentPlans): any => paymentPlans.settings
);
