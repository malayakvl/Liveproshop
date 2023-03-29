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
