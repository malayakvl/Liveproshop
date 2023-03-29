import { createAction } from 'redux-actions';

// ------------------------------------
// Actions
// ------------------------------------
export const setSwitchToggleAction: any = createAction('layouts/SWITCH_HEADER_TOGGLE');

export const setSwitchHeaderAction: any = createAction('layouts/SWITCH_HEADER_ACTION');

export const setCheckedAction: any = createAction('layouts/SET_CHECKED');

export const setPaginationAction: any = createAction('layouts/SET_PAGINATION');

export const setCheckedIdsAction: any = createAction('layouts/SET_CHECKED_IDS');

export const initIdsAction: any = createAction('layouts/INIT_IDS');

export const checkIdsAction: any = createAction('layouts/CHECK_IDS');

export const checkAllIdsAction: any = createAction('layouts/CHECK_ALL_IDS');

export const uncheckAllIdsAction: any = createAction('layouts/UNCHECK_ALL_IDS');

export const toggleSidebarAction: any = createAction('layouts/TOGGLE_SIDEBAR');

export const closeSidebarAction: any = createAction('layouts/CLOSE_SIDEBAR');

export const showLoaderAction: any = createAction('layouts/SHOW_LOADER_ACTION');

export const setErrorToastAction: any = createAction('layouts/SET_ERROR_TOAST');

export const setSuccessToastAction: any = createAction('layouts/SET_SUCCESS_TOAST');

export const setInfoToastAction: any = createAction('layouts/SET_INFO_TOAST');

export const deleteToastAction: any = createAction('layouts/DELETE_TOAST');

export const setActivePageAction: any = createAction('layouts/SET_ACTIVE_TAB');

export const sidebarCloseAction: any = createAction('layouts/CLOSE_SIDEBAR');

export const setModalConfirmationMetaAction: any = createAction(
    'layouts/SET_MODAL_DELETE_CONFIRMATION'
);
