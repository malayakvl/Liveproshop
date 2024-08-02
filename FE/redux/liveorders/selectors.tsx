import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.liveorders,
    (liveorders: State.Liveorders): State.Liveorders => liveorders
);

export const paginatedItemsSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.items
);
export const liveItemsSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.liveItems
);
export const itemsCountSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): number => liveorders.count
);
export const itemSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.item
);
export const showPopupSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): boolean => liveorders.showPopup
);
export const filterDataSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.fileterData
);
export const showDatePopupSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): boolean => liveorders.showDateSelector
);
export const orderFetchedSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): boolean => liveorders.orderFetched
);
export const orderFileNameFetchedSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): string => liveorders.fileName
);
export const orderBase64DataSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): string | null => liveorders.base64Data
);
export const tagSellersSuggestionsSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.tagSellersSuggestions
);
export const cancelConfirmationModalSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.showCancelPopup
);
export const shippedConfirmationModalSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.showShippedPopup
);
export const achiveNameSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.achiveName
);
export const singleDowloadFileSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.downloadFileName
);
export const orderCommentIdSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.commentIdOrder
);
export const orderNumberSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.connectedOrderNumber
);
export const storeNameSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.storeName
);
export const orderTmpCommentIdSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.tmpCommentOrderId
);
export const orderNumberConnectedSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.connectedOrderNumber
);
export const redirectCheckoutSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.redirectCheckout
);
export const returnedUrlSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.orderReturnedUrl
);
export const itemsStatusesSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.itemsStatuses
);
export const googleDeepLinkSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.googleBrowserLink
);
export const prevOrderAmountSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.prevOrderAmount
);
export const timerOrderAmountSelector = createSelector(
    rootSelector,
    (liveorders: State.Liveorders): any => liveorders.currOrderAmount
);
