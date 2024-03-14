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
export const uploadedPolicyFilesSelector = createSelector(
    rootSelector,
    (settings: State.Settings): File[] => settings.uploadedPolicyFiles
);
export const uploadedTermsFilesSelector = createSelector(
    rootSelector,
    (settings: State.Settings): File[] => settings.uploadedTermsFiles
);
export const uploadedDeliveryFilesSelector = createSelector(
    rootSelector,
    (settings: State.Settings): File[] => settings.uploadedDeliveryFiles
);
export const uploadedReturnFilesSelector = createSelector(
    rootSelector,
    (settings: State.Settings): File[] => settings.uploadedReturnFiles
);
