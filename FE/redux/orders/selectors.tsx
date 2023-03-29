import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.orders,
    (orders: State.Orders): State.Orders => orders
);

export const paginatedItemsSelector = createSelector(
    rootSelector,
    (orders: State.Orders): any => orders.items
);
export const itemsCountSelector = createSelector(
    rootSelector,
    (orders: State.Orders): number => orders.count
);
export const itemSelector = createSelector(
    rootSelector,
    (orders: State.Orders): any => orders.item
);
export const showPopupSelector = createSelector(
    rootSelector,
    (orders: State.Orders): boolean => orders.showPopup
);
export const filterDataSelector = createSelector(
    rootSelector,
    (orders: State.Orders): any => orders.fileterData
);
export const showDatePopupSelector = createSelector(
    rootSelector,
    (orders: State.Orders): boolean => orders.showDateSelector
);
export const orderFetchedSelector = createSelector(
    rootSelector,
    (orders: State.Orders): boolean => orders.orderFetched
);
export const orderFileNameFetchedSelector = createSelector(
    rootSelector,
    (orders: State.Orders): string => orders.fileName
);
export const orderBase64DataSelector = createSelector(
    rootSelector,
    (orders: State.Orders): string | null => orders.base64Data
);
export const tagSellersSuggestionsSelector = createSelector(
    rootSelector,
    (orders: State.Orders): any => orders.tagSellersSuggestions
);
export const cancelConfirmationModalSelector = createSelector(
    rootSelector,
    (orders: State.Orders): any => orders.showCancelPopup
);
