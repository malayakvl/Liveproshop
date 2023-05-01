import { createAction } from 'redux-actions';
import { authHeader } from '../../lib/functions';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;
import { setSuccessToastAction } from '../layouts';
import { paginationSelectorFactory } from '../layouts/selectors';
import { PaginationType } from '../../constants';
import queryString from 'query-string';
import { showLoaderAction } from '../layouts/actions';

export const submitMethodsStatusesAction: any = createAction(
    'payments/CHANGE_METHODS_STATUSES',
    (methods: Payments.PaymentMethod[]) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .patch(
                    `${baseUrl}/payments/change-methods-statuses`,
                    { methods },
                    {
                        headers: {
                            ...authHeader(state.user.user.email)
                        }
                    }
                )
                .then(() => {
                    dispatch(showLoaderAction(false));
                    dispatch(setSuccessToastAction('Payment methods saved'));
                    dispatch(fetchMethodsAction());
                });
        }
);

export const fetchItemsAction: any = createAction(
    'payments/FETCH_ITEMS',
    async () =>
        (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ count: number; items: Payments.DataItem[] }> => {
            const state = getState();
            const { limit, offset, sort, column, query, filters } = paginationSelectorFactory(
                PaginationType.PAYMENTS
            )(state);
            const queryFilter = JSON.stringify(filters);
            dispatch(showLoaderAction(true));
            return axios
                .get(
                    `${baseUrl}/payments/fetch-items?${queryString.stringify({
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

export const fetchItemAction: any = createAction(
    'payments/FETCH_ITEM_DETAILED',
    async (orderNumber: string) =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ item: Payments.DataItemDetailed }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(
                `${baseUrl}/payments/fetch-item?${queryString.stringify({
                    orderNumber
                })}`,
                {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                }
            );
            if (res.status) {
                dispatch(showLoaderAction(false));
            }
            return {
                item: res.data.item
            };
        }
);

export const fetchMethodsAction: any = createAction(
    'payments/FETCH_METHODS',
    async () =>
        (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ methods: Payments.PaymentMethod[] }> => {
            const state = getState();
            return axios
                .get(`${baseUrl}/payments/fetch-methods`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then((res: any) => {
                    return {
                        methods: res.data.methods
                    };
                });
        }
);

export const fetchFilerItems: any = createAction(
    'payments/FETCH_FILTER_ITEMS',
    async () =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ fileterData: any }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/payments/fetch-filters`, {
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

export const showPopupAction: any = createAction('payments/SHOW_POPUP');
export const setEmptyFormAction: any = createAction('payments/EMPTY_FORM');
export const showDateSelectorAction: any = createAction('payments/SHOW_DATE_POPUP');
export const initIdsAction: any = createAction('payments/INIT_IDS');
export const checkIdsAction: any = createAction('payments/CHECK_IDS');
export const checkAllIdsAction: any = createAction('payments/CHECK_ALL_IDS');
export const uncheckAllIdsAction: any = createAction('payments/UNCHECK_ALL_IDS');
