import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.notifications,
    (notifications: State.Notifications): State.Notifications => notifications
);

export const cntNewSelector = createSelector(
    rootSelector,
    (notifications: State.Notifications): any => notifications.cntNew
);

export const latestNoticeSelector = createSelector(
    rootSelector,
    (notifications: State.Notifications): any => notifications.notificationsLatest
);

export const paginatedNoticeSelector = createSelector(
    rootSelector,
    (notifications: State.Notifications): any => notifications.items
);

export const notififcationsCountSelector = createSelector(
    rootSelector,
    (notifications: State.Notifications): number => notifications.count
);
