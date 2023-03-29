import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.products,
    (products: State.Products): State.Products => products
);

export const productAdditionalSelector = createSelector(
    rootSelector,
    (products: State.Products): any => products.additional
);

// export const productStyleSelector = createSelector(
//     rootSelector,
//     (products: State.Products): Products.Style[] => products.styles
// );
// export const productMaterialsSelector = createSelector(
//     rootSelector,
//     (products: State.Products): Products.Material[] => products.materials
// );
// export const productColorSelector = createSelector(
//     rootSelector,
//     (products: State.Products): Products.Color[] => products.colors
// );
// export const productSizesSelector = createSelector(
//     rootSelector,
//     (products: State.Products): Products.Size[] => products.sizes
// );
export const getIdentSelector = createSelector(
    rootSelector,
    (products: State.Products): boolean => products.setupIdent
);
export const isFetchedSelector = createSelector(
    rootSelector,
    (products: State.Products): boolean => products.isFetched
);
export const uploadedFilesSelector = createSelector(
    rootSelector,
    (products: State.Products): File[] => products.uploadedFiles
);
export const paginatedProductsSelector = createSelector(
    rootSelector,
    (products: State.Products): any => products.items
);
export const productsCountSelector = createSelector(
    rootSelector,
    (products: State.Products): number => products.count
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
