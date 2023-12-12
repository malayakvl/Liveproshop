import { createAction } from 'redux-actions';
import { authHeader, toggleModalPopup } from '../../lib/functions';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;
import { setSuccessToastAction, setErrorToastAction } from '../layouts';
import { paginationSelectorFactory } from '../layouts/selectors';
import { PaginationType } from '../../constants';
import queryString from 'query-string';
import { showLoaderAction } from '../layouts/actions';
import { fetchCheckoutAction } from '../checkout';

export const submitFormAction: any = createAction(
    'orders/ADD_UPDATE_DATA',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            const isNew = data.id;
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/livesession`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async () => {
                    dispatch(
                        setSuccessToastAction(`Record has been ${isNew ? 'updated' : 'created'}`)
                    );
                    dispatch(setEmptyFormAction());
                    dispatch(fetchItemsAction());
                    dispatch(showPopupAction(false));
                    dispatch(showLoaderAction(false));
                    toggleModalPopup('.modal-schedule');
                });
        }
);
export const fetchItemsAction: any = createAction(
    'orders/FETCH_ITEMS',
    async () =>
        (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ count: any; items: any }> => {
            const state = getState();
            const { limit, offset, sort, column, query, filters } = paginationSelectorFactory(
                PaginationType.ORDERS
            )(state);
            const queryFilter = JSON.stringify(filters);
            dispatch(showLoaderAction(true));
            let orderCommentId;
            if (window.localStorage.getItem('order_comment_id')) {
                orderCommentId = window.localStorage.getItem('order_comment_id');
            }
            return axios
                .get(
                    `${baseUrl}/orders/fetch-items?${queryString.stringify({
                        limit,
                        offset,
                        sort,
                        column,
                        query,
                        queryFilter,
                        orderCommentId
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
export const bulkShippingAction: any = createAction(
    'products/BULK_SHIPPING',
    async () =>
        async (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(
                    `${baseUrl}/orders/bulk-shipping`,
                    { data: JSON.stringify(state.layouts.checkedIds) },
                    {
                        headers: {
                            ...authHeader(state.user.user.email)
                        }
                    }
                )
                .then(async () => {
                    dispatch(showLoaderAction(false));
                    dispatch(setSuccessToastAction('Products has been deleted'));
                    dispatch(fetchItemsAction());
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.message));
                    dispatch(showLoaderAction(false));
                });
        }
);
export const bulkDownloadAction: any = createAction(
    'products/BULK_DOWNLOAD',
    async () =>
        async (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            let countChecked = 0;
            if (state.layouts.checkedIds.length == 0) {
                dispatch(setErrorToastAction('Please select an order to be downloaded'));
            }
            state.layouts.checkedIds.forEach((id) => {
                if (state.orders.items.find((data) => data.id === id.id)?.status != 'new') {
                    countChecked++;
                }
            });
            if (countChecked == 0) {
                dispatch(setErrorToastAction('Please select an order to be downloaded'));
                dispatch(showLoaderAction(false));
            } else {
                return axios
                    .post(
                        `${baseUrl}/orders/bulk-download`,
                        { data: JSON.stringify(state.layouts.checkedIds) },
                        {
                            headers: {
                                ...authHeader(state.user.user.email)
                            }
                        }
                    )
                    .then(async (result) => {
                        dispatch(setAchiveNameAction(result.data.achive));
                        dispatch(showLoaderAction(false));
                        dispatch(setSuccessToastAction('Orders has been downloaded'));
                        dispatch(fetchItemsAction());
                    })
                    .catch((e) => {
                        dispatch(setErrorToastAction(e.message));
                        dispatch(showLoaderAction(false));
                    });
            }
        }
);
export const singleDownloadAction: any = createAction(
    'products/SINGLE_DOWNLOAD',
    async (orderNumber: any, locale: string) =>
        async (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(
                    `${baseUrl}/orders/single-download`,
                    { data: { orderNumber: orderNumber, locale: locale } },
                    {
                        headers: {
                            ...authHeader(state.user.user.email)
                        }
                    }
                )
                .then(async (result) => {
                    console.log('Result', result);
                    dispatch(setSingleFileNameAction(result.data.fileDownload));
                    dispatch(showLoaderAction(false));
                    dispatch(setSuccessToastAction('Orders has been downloaded'));
                    // dispatch(fetchItemsAction());
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.message));
                    dispatch(showLoaderAction(false));
                });
        }
);
export const bulkCancelAction: any = createAction(
    'orders/BULK_CANCEL',
    async () =>
        async (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(
                    `${baseUrl}/orders/bulk-cancel`,
                    { data: JSON.stringify(state.layouts.checkedIds) },
                    {
                        headers: {
                            ...authHeader(state.user.user.email)
                        }
                    }
                )
                .then(async () => {
                    dispatch(showLoaderAction(false));
                    dispatch(showCancelConfirmationModalAction(false));
                    dispatch(setSuccessToastAction('Orders has been refund'));
                    dispatch(fetchItemsAction());
                    toggleModalPopup('.modal-cancel-confirmation');
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.message));
                    dispatch(showLoaderAction(false));
                });
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

export const fetchOrderPdfAction: any = createAction(
    'orders/FETCH_ORDER_PDF',
    async (id: string, locale: string) =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ orderFetched: boolean; fileName: string; base64Data: string }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/create-order/${id}/${locale}`, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            if (res.status) {
                dispatch(showLoaderAction(false));
                // dispatch(showItemAction(true));
            }
            return {
                orderFetched: true,
                fileName: res.data.fileName,
                base64Data: res.data.filebase64
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
export const connectOrderAction: any = createAction(
    'orders/CONNECT_ORDER_ACTION',
    async () =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            return axios
                .get(`${baseUrl}/orders/connect-action?messageId=11111`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then((res: any) => res.data.result);
        }
);
export const fetchUserOrderAction: any = createAction(
    'order/FETCH_USER_ORDER',
    async (email: string) => {
        return axios
            .get(
                `${baseUrl}/orders/connect-bycomment?user=${window.localStorage.getItem(
                    'user'
                )}commentId=${window.localStorage.getItem('order_comment_id')}`,
                {
                    headers: {
                        ...authHeader(email)
                    }
                }
            )
            .then((res) => res.data.user)
            .catch((e) => console.log(e.message));
    }
);
export const setupOrderByCommentAction: any = createAction(
    'order/FETCH_USER_ORDER',
    async (commentId: string, email: string) => {
        return axios
            .get(`${baseUrl}/orders/find-order-by-comment?commentId=${commentId}`, {
                headers: {
                    ...authHeader(email)
                }
            })
            .then((res) => res.data.orderNumber)
            .catch((e) => console.log(e.message));
    }
);
export const removeItemOrderAction: any = createAction(
    'orders/REMOVE_ITEM_ACTION',
    async (itemId: number, orderNumber: string) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            return axios
                .get(`${baseUrl}/orders/remove-item-order?orderItemId=${itemId}`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then((res: any) => {
                    dispatch(fetchCheckoutAction(orderNumber));
                });
        }
);
export const minusItemOrderAction: any = createAction(
    'orders/MINUS_ITEM_ACTION',
    async (itemId: number, orderNumber: string) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            return axios
                .get(`${baseUrl}/orders/minus-item-order?orderItemId=${itemId}`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then((res: any) => {
                    dispatch(fetchCheckoutAction(orderNumber));
                });
        }
);

// export const demoveItemOrderAction: any = createAction(
//     'order/REMOVE_ITEM_ACTION',
//     async (itemId: number, email: string) => {
//         return axios
//             .get(`${baseUrl}/orders/remove-item-order?orderItemId=${itemId}`, {
//                 headers: {
//                     ...authHeader(email)
//                 }
//             })
//             .then((res) => {
//                 // window.location.reload();
//                 dispatch(fetchCheckoutAction(orderNumber));
//             })
//             .catch((e) => console.log(e.message));
//     }
// );

export const setTmpFbCommentAction: any = createAction('orders/SET_TMPFB_ORDER_COMMENT');
export const setFbCommentAction: any = createAction('orders/SET_FB_ORDER_COMMENT');
export const clearBase64Action: any = createAction('orders/CLEAR_BASE_64');
export const showPopupAction: any = createAction('orders/SHOW_POPUP');
export const showDateSelectorAction: any = createAction('orders/SHOW_DATE_POPUP');
export const setEmptyFormAction: any = createAction('orders/EMPTY_FORM');
export const showCancelConfirmationModalAction: any = createAction(
    'orders/CANCEL_CONFIRMATION_ORDER'
);
export const setAchiveNameAction: any = createAction('orders/SET_ARCHIVE_NAME');
export const setSingleFileNameAction: any = createAction('orders/SET_DOWNLOAD_SINGLE_NAME');
// export const connectOrderAction: any = createAction('orders/CONNECT_ORDER_ACTION');
