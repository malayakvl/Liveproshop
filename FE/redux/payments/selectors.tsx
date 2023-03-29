import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.payments,
    (payments: State.Payments): State.Payments => payments
);

export const paginatedItemsSelector = createSelector(
    rootSelector,
    (payments: State.Payments): any => payments.items
);
export const itemsCountSelector = createSelector(
    rootSelector,
    (payments: State.Payments): number => payments.count
);
export const itemSelector = createSelector(
    rootSelector,
    (payments: State.Payments): any => payments.item
);
export const showPopupSelector = createSelector(
    rootSelector,
    (payments: State.Payments): boolean => payments.showPopup
);
export const methodsSelector = createSelector(
    rootSelector,
    (payments: State.Payments): any => payments.methods
);
export const filterDataSelector = createSelector(
    rootSelector,
    (payments: State.Payments): any => payments.fileterData
);
export const showDatePopupSelector = createSelector(
    rootSelector,
    (payments: State.Payments): boolean => payments.showDateSelector
);
