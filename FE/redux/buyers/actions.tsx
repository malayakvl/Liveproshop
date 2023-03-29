import { createAction } from 'redux-actions';
import { authHeader } from '../../lib/functions';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;
// import { setSuccessToastAction } from '../layouts';
import { paginationSelectorFactory } from '../layouts/selectors';
import { PaginationType } from '../../constants';
import queryString from 'query-string';
import { showLoaderAction } from '../layouts/actions';

export const fetchItemsAction: any = createAction(
    'buyers/FETCH_ITEMS',
    async () =>
        (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ count: number; items: Buyers.DataItem[] }> => {
            const state = getState();
            const { limit, offset, sort, column, query, filters } = paginationSelectorFactory(
                PaginationType.BUYERS
            )(state);
            // console.log('buyers filters = ', filters);
            const queryFilter = JSON.stringify(filters);
            dispatch(showLoaderAction(true));
            return axios
                .get(
                    `${baseUrl}/buyers/fetch-items?${queryString.stringify({
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
    'buyers/FETCH_ITEM',
    async (buyerId: string) =>
        (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ item: Buyers.DataItem }> => {
            const state = getState();
            const filters = { buyer_id: [+buyerId] };
            const queryFilter = JSON.stringify(filters);
            dispatch(showLoaderAction(true));
            return axios
                .get(
                    `${baseUrl}/buyers/fetch-item?${queryString.stringify({
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
                        item: res.data.item
                    };
                });
        }
);

// export const fetchOrdersAction: any = createAction(
//     'buyers/FETCH_ORDERS_DETAILED',
//     async () =>
//         async (dispatch: Type.Dispatch, getState: () => State.Root): Promise<{ orders: any }> => {
//             const state = getState();
//             const { limit, offset, sort, column, query, filters } = paginationSelectorFactory(
//                 PaginationType.ORDERS
//             )(state);
//             const queryFilter = JSON.stringify(filters);

//             dispatch(showLoaderAction(true));

//             const response = await axios.get(
//                 `${baseUrl}/orders/fetch-items?${queryString.stringify({
//                     limit,
//                     offset,
//                     sort,
//                     column,
//                     query,
//                     queryFilter
//                 })}`,
//                 {
//                     headers: {
//                         ...authHeader(state.user.user.email)
//                     }
//                 }
//             );

//             dispatch(showLoaderAction(false));
//             const res: any = {
//                 orders: {}
//             };

//             for (const order of response.data.items as Orders.DataItem[]) {
//                 if (!Array.isArray(res.orders[order.buyer_id])) {
//                     res.orders[order.buyer_id] = [];
//                 }
//                 res.orders[order.buyer_id].push(order);
//             }
//             return res;
//         }
// );

export const fetchFilerItems: any = createAction(
    'buyers/FETCH_FILTER_ITEMS',
    async () =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ fileterData: any }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/buyers/fetch-filters`, {
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
export const findSellersAction: any = createAction(
    'orders/FIND_SELLER_AUTOSUGGEST',
    async (query: string) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            return axios
                .get(`${baseUrl}/users/find-seller?searchStr=${query}`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then((res: any) => res.data.result);
        }
);
export const findBuyersAction: any = createAction(
    'orders/FIND_BUYER_AUTOSUGGEST',
    async (query: string) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            return axios
                .get(`${baseUrl}/users/find-buyer?searchStr=${query}`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then((res: any) => res.data.result);
        }
);

export const showPopupAction: any = createAction('buyers/SHOW_POPUP');
export const showDateSelectorAction: any = createAction('buyers/SHOW_DATE_POPUP');
