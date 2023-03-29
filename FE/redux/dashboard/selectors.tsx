import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.dashboard,
    (dashboard: State.Dashboard): State.Dashboard => dashboard
);

export const paginatedItemsSelector = createSelector(
    rootSelector,
    (dashboard: State.Dashboard): Pick<Dashboard.Root, 'orders' | 'buyers' | 'totals'> => ({
        orders: dashboard.orders,
        buyers: dashboard.buyers,
        totals: dashboard.totals
    })
);
// export const itemsCountSelector = createSelector(
//     rootSelector,
//     (dashboard: State.Dashboard): number => dashboard.count
// );
// export const itemSelector = createSelector(
//     rootSelector,
//     (dashboard: State.Dashboard): any => dashboard.item
// );
export const showPopupSelector = createSelector(
    rootSelector,
    (dashboard: State.Dashboard): boolean => dashboard.showPopup
);
export const filterDataSelector = createSelector(
    rootSelector,
    (dashboard: State.Dashboard): any => dashboard.fileterData
);
export const showDatePopupSelector = createSelector(
    rootSelector,
    (dashboard: State.Dashboard): boolean => dashboard.showDateSelector
);
