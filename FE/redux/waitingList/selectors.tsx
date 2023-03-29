import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.waitingList,
    (waitingList: State.WaitingList): State.WaitingList => waitingList
);

export const paginatedItemsSelector = createSelector(
    rootSelector,
    (waitingList: State.WaitingList): any => waitingList.items
);
export const itemsCountSelector = createSelector(
    rootSelector,
    (waitingList: State.WaitingList): number => waitingList.count
);
export const itemSelector = createSelector(
    rootSelector,
    (waitingList: State.WaitingList): any => waitingList.item
);
export const showPopupSelector = createSelector(
    rootSelector,
    (waitingList: State.WaitingList): boolean => waitingList.showPopup
);
export const filterDataSelector = createSelector(
    rootSelector,
    (waitingList: State.WaitingList): any => waitingList.fileterData
);
export const showDatePopupSelector = createSelector(
    rootSelector,
    (waitingList: State.WaitingList): boolean => waitingList.showDateSelector
);
export const orderFetchedSelector = createSelector(
    rootSelector,
    (waitingList: State.WaitingList): boolean => waitingList.orderFetched
);
export const showQtyPopupSelector = createSelector(
    rootSelector,
    (waitingList: State.WaitingList): boolean => waitingList.showQtyModal
);
export const selectedConfiguarationItemSelector = createSelector(
    rootSelector,
    (waitingList: State.WaitingList): any => waitingList.selectedConfiguarationItem
);
