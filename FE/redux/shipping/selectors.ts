import { createSelector } from 'reselect';

const rootSelector = createSelector(
    (state: State.Root) => state.shippings,
    (shippings: State.Shippings): State.Shippings => shippings
);

export const shippingsSelector = createSelector(
    rootSelector,
    (shippings: State.Shippings): any => shippings.list
);

export const shippingSelector = createSelector(
    rootSelector,
    (shippings: State.Shippings): any => shippings.shipping
);
