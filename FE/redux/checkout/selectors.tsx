import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.checkout,
    (checkout: State.Checkout): State.Checkout => checkout
);

export const orderCheckoutSelector = createSelector(rootSelector, ({ order }) => order);

export const addressCheckoutSelector = createSelector(rootSelector, ({ address }) => address);

export const shippingMethodsCheckoutSelector = createSelector(
    rootSelector,
    ({ shippingMethods }) => shippingMethods
);

export const firstShippingMethodCheckoutSelector = createSelector(
    rootSelector,
    ({ shippingMethods }) => shippingMethods[0]
);

export const redirectMerchantUrlSelector = createSelector(
    rootSelector,
    (checkout: State.Checkout): any => checkout.redirectUrl
);
export const paymentStatusSelector = createSelector(
    rootSelector,
    (checkout: State.Checkout): any => checkout.paymentStatus
);
