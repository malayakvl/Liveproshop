import { createAction } from 'redux-actions';
import { authHeader, toggleModalPopup } from '../../lib/functions';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;
import { paginationSelectorFactory } from '../layouts/selectors';
import { PaginationType } from '../../constants';
import queryString from 'query-string';
import { showLoaderAction } from '../layouts/actions';

export const fetchItemsAction: any = createAction(
    'orders/FETCH_WAITING_ITEMS',
    async () =>
        (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ count: any; items: any }> => {
            const state = getState();
            const { limit, offset, sort, column, query, filters } = paginationSelectorFactory(
                PaginationType.WAITING
            )(state);
            const queryFilter = JSON.stringify(filters);
            dispatch(showLoaderAction(true));
            return axios
                .get(
                    `${baseUrl}/orders/fetch-waiting-items?${queryString.stringify({
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
export const fetchFilerItems: any = createAction(
    'orders/FETCH_FILTER_ITEMS',
    async () =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ fileterData: any }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/orders/fetch-filters`, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            if (res.status) {
                dispatch(showLoaderAction(false));
            }
            return {
                fileterData: res.data.items
            };
        }
);

export const fetchItemAction: any = createAction(
    'orders/FETCH_ITEM',
    async (id: number) =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ item: Livesessions.DataItem }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/orders/${id}`, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            if (res.status) {
                dispatch(showLoaderAction(false));
                // dispatch(showItemAction(true));
            }
            return {
                item: res.data.item
            };
        }
);
export const runWatingAction: any = createAction(
    'orders/RUN_WAITING_LIST',
    async (sessionId: number, productConfigurationId: number) =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ item: Livesessions.DataItem }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.post(
                `${baseUrl}/order/run-wait-workflow`,
                { sessionId: sessionId, productConfigurationId: productConfigurationId },
                {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                }
            );
            if (res.status) {
                dispatch(showLoaderAction(false));
                dispatch(fetchItemsAction());
                // dispatch(showItemAction(true));
            }
            return {
                item: res.data.item
            };
        }
);
export const updateProductConfigQtyAction: any = createAction(
    'orders/UPDAE_PRODUCT_CONFIG_QTY',
    async (data: any) =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ item: Livesessions.DataItem }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.post(`${baseUrl}/order/update-config-qty`, data, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            if (res.status) {
                dispatch(showLoaderAction(false));
                dispatch(setupConfiguarationIdAction(null));
                dispatch(fetchItemsAction());
                dispatch(showPopupQtyAction(false));
                toggleModalPopup('.modal-wait-qty');
                // dispatch(showItemAction(true));
            }
            return {
                item: res.data.item
            };
        }
);

export const showPopupAction: any = createAction('orders/SHOW_POPUP');
export const showDateSelectorAction: any = createAction('orders/SHOW_DATE_POPUP');
export const setEmptyFormAction: any = createAction('orders/EMPTY_FORM');
export const showPopupQtyAction: any = createAction('waiting/SHOW_QTY_FORM');
export const setupConfiguarationIdAction: any = createAction('waiting/SETUP_CONFIG_QTY');
// export const showItemAction: any = createAction('orders/CHATBOT_SHOWITEM');
