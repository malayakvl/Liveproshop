import { createSelector } from 'reselect';

// ------------------------------------
// Selectors
// ------------------------------------
const rootSelector = createSelector(
    (state: State.Root) => state.chatbot,
    (chatbot: State.Chatbot): State.Chatbot => chatbot
);

export const paginatedItemsSelector = createSelector(
    rootSelector,
    (chatbot: State.Chatbot): any => chatbot.items
);
export const itemsCountSelector = createSelector(
    rootSelector,
    (chatbot: State.Chatbot): number => chatbot.count
);
export const itemsSystemSelector = createSelector(
    rootSelector,
    (chatbot: State.Chatbot): any => chatbot.itemsSystem
);
export const itemSelector = createSelector(
    rootSelector,
    (chatbot: State.Chatbot): any => chatbot.item
);
export const showFormSelector = createSelector(
    rootSelector,
    (chatbot: State.Chatbot): any => chatbot.showForm
);
export const showedItemsSelector = createSelector(
    rootSelector,
    (chatbot: State.Chatbot): any => chatbot.showedItems
);
export const switcherStatusChangeSelector = createSelector(
    rootSelector,
    (chatbot: State.Chatbot): any => chatbot.changeActiveStatus
);
export const liveActiveSessionsSelector = createSelector(
    rootSelector,
    (chatbot: State.Chatbot): any => chatbot.liveSessions
);
