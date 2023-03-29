import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.settings,
    (settings: State.Settings): State.Settings => settings
);

export const itemSelector = createSelector(
    rootSelector,
    (settings: State.Settings): any => settings.item
);
