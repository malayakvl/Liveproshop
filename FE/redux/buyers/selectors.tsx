import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.buyers,
    (buyers: State.Buyers): State.Buyers => buyers
);

export const paginatedItemsSelector = createSelector(
    rootSelector,
    (buyers: State.Buyers): any => buyers.items
);
export const itemsCountSelector = createSelector(
    rootSelector,
    (buyers: State.Buyers): number => buyers.count
);
export const itemSelector = createSelector(
    rootSelector,
    (buyers: State.Buyers): any => buyers.item
);
// export const ordersSelector = createSelector(
//     rootSelector,
//     (buyers: State.Buyers): any => buyers.orders
// );
export const showPopupSelector = createSelector(
    rootSelector,
    (buyers: State.Buyers): boolean => buyers.showPopup
);
export const filterDataSelector = createSelector(
    rootSelector,
    (buyers: State.Buyers): any => buyers.fileterData
);
export const showDatePopupSelector = createSelector(
    rootSelector,
    (buyers: State.Buyers): boolean => buyers.showDateSelector
);
export const tagSellersSuggestionsSelector = createSelector(
    rootSelector,
    (buyers: State.Buyers): any => buyers.tagSellersSuggestions
);
export const tagBuyersSuggestionsSelector = createSelector(
    rootSelector,
    (buyers: State.Buyers): any => buyers.tagBuyerssSuggestions
);
