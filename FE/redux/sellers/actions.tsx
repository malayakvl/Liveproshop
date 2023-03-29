import { createAction } from 'redux-actions';
import { authHeader, toggleModalPopup } from '../../lib/functions';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;
import { paginationSelectorFactory } from '../layouts/selectors';
import { PaginationType } from '../../constants';
import queryString from 'query-string';
import { setErrorToastAction, setSuccessToastAction, showLoaderAction } from '../layouts/actions';

export const fetchItemsAction: any = createAction(
    'sellers/FETCH_ITEMS',
    async () =>
        (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ count: any; items: any }> => {
            const state = getState();
            const { limit, offset, sort, column, query, filters } = paginationSelectorFactory(
                PaginationType.SELLERS
            )(state);
            const queryFilter = JSON.stringify(filters);
            dispatch(showLoaderAction(true));
            return axios
                .get(
                    `${baseUrl}/sellers/fetch-items?${queryString.stringify({
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
export const fetchHistoryAction: any = createAction(
    'sellers/FETCH_HISTORY_ITEMS',
    async (emailSeller: string) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<{ itemsHistory: any }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .get(`${baseUrl}/sellers/history?emailSeller=${emailSeller}`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then((res: any) => {
                    dispatch(showLoaderAction(false));
                    return {
                        itemsHistory: res.data.items
                    };
                })
                .catch(() => {
                    dispatch(showLoaderAction(false));
                    return {
                        itemsHistory: []
                    };
                });
        }
);
export const fetchFilerItems: any = createAction(
    'sellers/FETCH_FILTER_ITEMS',
    async () =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ fileterData: any }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/sellers/fetch-filters`, {
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
export const updateSellerPercentAction: any = createAction(
    'seller/UPDATE_PERCENT',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/sellers/update-percent`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async () => {
                    dispatch(showLoaderAction(false));
                    dispatch(fetchItemsAction());
                    dispatch(showPersentFormAction(false));
                    dispatch(setSuccessToastAction(`Profile has been updated`));
                    toggleModalPopup('.modal-seller-persent');
                })
                .catch((e: any) => {
                    dispatch(showLoaderAction(false));
                    dispatch(setErrorToastAction(e.message));
                });
        }
);
export const unsubscribeSellerAction: any = createAction(
    'seller/UNSUBSCRIBE_SELLER',
    async () =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            const selectedSeller = state.sellers.selectedSeller;
            dispatch(showLoaderAction(true));
            return axios
                .post(
                    `${baseUrl}/sellers/unsubscribe`,
                    { seller: selectedSeller },
                    {
                        headers: {
                            ...authHeader(state.user.user.email)
                        }
                    }
                )
                .then(async () => {
                    dispatch(showLoaderAction(false));
                    dispatch(fetchItemsAction());
                    dispatch(showUnsubscribeConfirmFormAction(false));
                    dispatch(setSuccessToastAction(`Seller has been unsubscribed`));
                    // toggleModalPopup('.modal-seller-confirm-unsubscribe');
                })
                .catch((e: any) => {
                    dispatch(showLoaderAction(false));
                    dispatch(setErrorToastAction(e.message));
                });
        }
);

export const showPopupAction: any = createAction('sellers/SHOW_POPUP');
export const showDateSelectorAction: any = createAction('sellers/SHOW_DATE_POPUP');
export const showLoginFormAction: any = createAction('sellers/SHOW_LOGIN_FORM');
export const showPersentFormAction: any = createAction('sellers/SHOW_PERSENT_FORM');
export const showPersentConfirmFormAction: any = createAction('sellers/SHOW_PERSENT_CONFIRM_MODAL');
export const showUnsubscribeConfirmFormAction: any = createAction('sellers/SHOW_UNSUBSCRIBE_MODAL');
export const setSelectedSellerAction: any = createAction('sellers/SET_SELECTED_SELLER');
export const setSellerPercentAction: any = createAction('sellers/SET_PERCENT');
export const showSellerPercentHistoryAction: any = createAction('sellers/SELLER_PERSENT_HISTORY');
