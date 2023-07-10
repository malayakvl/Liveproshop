import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.layouts,
    (layouts: State.Layouts): State.Layouts => layouts
);

export const paginationSelectorFactory = (type: string) =>
    createSelector(
        rootSelector,
        (layouts: State.Layouts): Layouts.Pagination => (layouts.pagination as any)[type]
    );

export const isSidebarOpenSelector = createSelector(
    rootSelector,
    (layouts: State.Layouts): boolean => layouts.isSidebarOpen
);
export const isMobileDeviceSelector = createSelector(
    rootSelector,
    (layouts: State.Layouts): boolean | null => layouts.isMobileDevice
);

export const isDataLoadingSelector = createSelector(
    rootSelector,
    (layouts: State.Layouts): boolean => layouts.isDataLoading
);

export const switchHeaderSelector = createSelector(
    rootSelector,
    (layouts: State.Layouts): boolean => layouts.switchHeader
);

export const switchToggledSelector = createSelector(
    rootSelector,
    (layouts: State.Layouts): boolean => layouts.switchToggled
);

export const checkedIdsSelector = createSelector(
    rootSelector,
    (layouts: State.Layouts): Layouts.checkedIds[] => layouts.checkedIds
);

export const toastsSelector = createSelector(
    rootSelector,
    (layouts: State.Layouts): Layouts.Toast[] => layouts.toasts
);

export const rowIdChecked = (id: number) =>
    createSelector(
        rootSelector,
        (layouts: State.Layouts): boolean =>
            layouts.checkedIds.find((data: any) => data.id === id)?.checked || false
    );

export const modalConfirmationMetaSelector = createSelector(
    rootSelector,
    (layouts: State.Layouts): Layouts.ModalConfirmationMeta | null => layouts.modalConfirmationMeta
);

export const modalCalendlyMetaSelector = createSelector(
    rootSelector,
    (layouts: State.Layouts): Layouts.ModalCalendlyMeta | null => layouts.modalCalendlyMeta
);

export const activeTabSelectorFactory = (type: string) =>
    createSelector(rootSelector, (formula: State.Layouts): any => (formula.activeTab as any)[type]);
export const isSTextingMenuOpenSelector = createSelector(
    rootSelector,
    (layouts: State.Layouts): boolean => layouts.showTextingMenu
);
