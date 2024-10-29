import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.livesessions,
    (livesessions: State.Livesessions): State.Livesessions => livesessions
);

export const paginatedItemsSelector = createSelector(
    rootSelector,
    (livesessions: State.Livesessions): any => livesessions.items
);
export const longTokenErrorSelector = createSelector(
    rootSelector,
    (livesessions: State.Livesessions): any => livesessions.longTokenError
);
export const longTokenExpireSelector = createSelector(
    rootSelector,
    (livesessions: State.Livesessions): any => livesessions.expireTokenAt
);
export const itemsCountSelector = createSelector(
    rootSelector,
    (livesessions: State.Livesessions): number => livesessions.count
);
export const itemSelector = createSelector(
    rootSelector,
    (livesessions: State.Livesessions): any => livesessions.item
);
export const showPopupSelector = createSelector(
    rootSelector,
    (livesessions: State.Livesessions): boolean => livesessions.showPopup
);
export const scenariosSelector = createSelector(
    rootSelector,
    (livesessions: State.Livesessions): Livesessions.DataScenario[] => livesessions.itemScenarios
);
export const storeSelector = createSelector(
    rootSelector,
    (livesessions: State.Livesessions): any => livesessions.selectedStoreId
);
