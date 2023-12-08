import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.mystores,
    (mystores: State.Mystores): State.Mystores => mystores
);
export const isFetchedSelector = createSelector(
    rootSelector,
    (mystores: State.Mystores): boolean => mystores.isFetched
);
export const paginatedStoresSelector = createSelector(
    rootSelector,
    (mystores: State.Mystores): any => mystores.items
);
export const storeCountSelector = createSelector(
    rootSelector,
    (mystores: State.Mystores): number => mystores.count
);
export const activeTabSelector = createSelector(
    rootSelector,
    (products: State.Products): string => products.activeTab
);
export const copyIdsSelector = createSelector(
    rootSelector,
    (products: State.Products): number[] => products.copyProductIds
);
export const productItemSelector = createSelector(
    rootSelector,
    (products: State.Products): Products.Product => products.product
);
export const isFetchSelector = createSelector(
    rootSelector,
    (products: State.Products): boolean => products.isFetched
);
export const selectedAdditionalsSelector = createSelector(
    rootSelector,
    (products: State.Products): any => products.selectedAdditionals
);
export const selectedColorsSelector = createSelector(
    rootSelector,
    (products: State.Products): any => products.selectedAdditionals.colors
);
export const selectedSizesSelector = createSelector(
    rootSelector,
    (products: State.Products): any => products.selectedAdditionals.sizes
);
export const tagSuggestionsSelector = createSelector(
    rootSelector,
    (products: State.Products): any => products.tagSuggestions
);
