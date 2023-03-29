import { createAction } from 'redux-actions';
import { authHeader, toggleModalConfirmation } from '../../lib/functions';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;
import { setErrorToastAction, setSuccessToastAction } from '../layouts';
import { paginationSelectorFactory } from '../layouts/selectors';
import { PaginationType } from '../../constants';
import queryString from 'query-string';
import { showLoaderAction } from '../layouts/actions';

export const submitFormAction: any = createAction(
    'chatbot/ADD_UPDATE_DATA',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            const isNew = data.id;
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/chatbot`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async () => {
                    dispatch(
                        setSuccessToastAction(
                            isNew ? 'Scenario has been update' : 'Record has been created'
                        )
                    );
                    dispatch(fetchDataAction('users'));
                    dispatch(setEmptyFormAction());
                    dispatch(showFormAction(false));
                    dispatch(showLoaderAction(false));
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.response.data.error));
                    dispatch(showLoaderAction(false));
                });
        }
);
export const submitDefaultFormAction: any = createAction(
    'chatbot/ADD_UPDATE_DEFAULT_DATA',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            const isNew = data.id;
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/chatbot-default`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async () => {
                    dispatch(
                        setSuccessToastAction(
                            isNew ? 'Record has been update' : 'Record has been created'
                        )
                    );
                    // dispatch(fetchDataAction('users'));
                    // dispatch(setEmptyFormAction());
                    dispatch(showFormAction(false));
                    dispatch(showLoaderAction(false));
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.response.data.error));
                    dispatch(showLoaderAction(false));
                });
        }
);

export const fetchDataAction: any = createAction(
    'chatbot/FETCH_ITEMS',
    async (type: string) =>
        (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ count: any; items: any }> => {
            const state = getState();
            const { limit, offset, sort, column, query, filters } = paginationSelectorFactory(
                PaginationType.CHATBOT
            )(state);
            const queryFilter = JSON.stringify(type === 'system' ? { type: 'system' } : filters);
            dispatch(showLoaderAction(true));
            return axios
                .get(
                    `${baseUrl}/fetch-chatbot-messages?type=${type}&${queryString.stringify({
                        limit,
                        offset,
                        sort,
                        column,
                        query,
                        queryFilter
                    })}`,
                    {
                        headers: {
                            ...authHeader(state.user.user.email)
                        }
                    }
                )
                .then((res: any) => {
                    dispatch(showLoaderAction(false));
                    return {
                        count: res.data.count,
                        items: res.data.items
                    };
                });
        }
);
export const fetchDataSystemAction: any = createAction(
    'chatbot/FETCH_SYSTEM_ITEMS',
    async () =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<{ itemsSystem: any }> => {
            const state = getState();
            const { limit, offset, sort, column, query } = paginationSelectorFactory(
                PaginationType.CHATBOT
            )(state);
            const queryFilter = JSON.stringify({ type: 'system' });
            dispatch(showLoaderAction(true));
            return axios
                .get(
                    `${baseUrl}/fetch-chatbot-default-messages?${queryString.stringify({
                        limit,
                        offset,
                        sort,
                        column,
                        query,
                        queryFilter
                    })}`,
                    {
                        headers: {
                            ...authHeader(state.user.user.email)
                        }
                    }
                )
                .then((res: any) => {
                    dispatch(showLoaderAction(false));
                    return {
                        itemsSystem: res.data.items
                    };
                });
        }
);
export const fetchFormAction: any = createAction(
    'chatbot/FETCH_ITEM',
    async (id: number) =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ item: Products.Product }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/fetch-chatbot-message/${id}`, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            if (res.status) {
                dispatch(showLoaderAction(false));
                dispatch(showFormAction(true));
            }
            return {
                item: res.data.item
            };
        }
);
export const deleteAction: any = createAction(
    'chatbot/DELETE_RECORD',
    async (id: number) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .delete(`${baseUrl}/chatbot/delete/${id}`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async () => {
                    dispatch(showLoaderAction(false));
                    await dispatch(fetchDataAction('users'));
                    dispatch(setSuccessToastAction('Record has been deleted'));
                    toggleModalConfirmation();
                });
        }
);
export const bulkDeleteAction: any = createAction(
    'chatbot/BULK_DELETE',
    async () =>
        async (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(
                    `${baseUrl}/chatbot/bulk-delete`,
                    { data: JSON.stringify(state.layouts.checkedIds) },
                    {
                        headers: {
                            ...authHeader(state.user.user.email)
                        }
                    }
                )
                .then(async () => {
                    dispatch(showLoaderAction(false));
                    dispatch(setSuccessToastAction('Records has been deleted'));
                    await dispatch(fetchDataAction());
                });
        }
);
export const changeActiveAction: any = createAction(
    'chatbot/CHANGE_ACTIVE',
    async (id: number) =>
        async (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .get(`${baseUrl}/chatbot/change-active/${id}`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async () => {
                    dispatch(showLoaderAction(false));
                    dispatch(setSuccessToastAction('Records has been updated'));
                });
        }
);
export const changeActiveAllAction: any = createAction(
    'chatbot/CHANGE_ACTIVE_FOR_ALL',
    async (status: boolean) =>
        async (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .get(`${baseUrl}/chatbot/change-active-all?status=${status}`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async () => {
                    dispatch(showLoaderAction(false));
                    dispatch(switchChangeStatusAction(true));
                    dispatch(
                        setSuccessToastAction(
                            status ? 'Scenario has been update' : 'Records has been updated'
                        )
                    );
                });
        }
);
// for traning section methods
export const fetchCurrentSessionAction: any = createAction(
    'chatbot/FETCH_SESSIONS',
    async () =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<{ liveSessions: any }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .get(`${baseUrl}/fetch-active-sessions`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then((res: any) => {
                    dispatch(showLoaderAction(false));
                    return {
                        // liveSessions: res.data.items
                        liveSessions: res.data.result
                    };
                });
        }
);
export const saveMessageAction: any = createAction(
    'livesession_message/SAVE_MESSAGES',
    async (sessionId: number, data: any) =>
        (dispatch: Type.Dispatch): Promise<void> => {
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/add-live-messages?sessionId=${sessionId}`, data)
                .then(() => {
                    dispatch(showLoaderAction(false));
                });
        }
);

export const switchChangeStatusAction: any = createAction('chatbot/CHATBOT_CHANGE_SWITCHER');
export const showFormAction: any = createAction('chatbot/CHATBOT_SHOWFORM');
export const setEmptyFormAction: any = createAction('chatbot/EMPTY_FORM');
export const showItemAction: any = createAction('chatbot/CHATBOT_SHOWITEM');
