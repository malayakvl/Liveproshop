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
    'liveorders/ADD_UPDATE_DATA',
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
    'liveorders/FETCH_ITEMS',
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
                        items: res.data.items,
                        itemsStatuses: res.data.itemsStatuses
                    };
                });
        }
);
export const fetchLiveItemsAction: any = createAction(
    'liveorders/FETCH_LIVE_ITEMS',
    async () =>
        (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ count: any; liveItems: any }> => {
            const state = getState();
            const { limit, offset, sort, column, query, filters } = paginationSelectorFactory(
                PaginationType.LIVEORDERS
            )(state);
            const queryFilter = JSON.stringify(filters);
            dispatch(showLoaderAction(true));
            // let orderCommentId;
            // if (window.localStorage.getItem('order_comment_id')) {
            //     orderCommentId = window.localStorage.getItem('order_comment_id');
            // }
            return axios
                .get(
                    `${baseUrl}/orders/fetch-live-items?${queryString.stringify({
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
                    console.log(res.data.items);
                    return {
                        count: res.data.count,
                        liveItems: res.data.items,
                        itemsStatuses: res.data.itemsStatuses
                    };
                });
        }
);
export const fetchFilerItems: any = createAction(
    'liveorders/FETCH_FILTER_ITEMS',
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
                    dispatch(setSuccessToastAction('Products has been shipped'));
                    dispatch(showShippedConfirmationModalAction(false));
                    toggleModalPopup('.modal-shipped-confirmation');
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
    async (locale: string) =>
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
            const lng = locale;
            console.log('Current locale', locale);
            if (countChecked == 0) {
                dispatch(setErrorToastAction('Please select an order to be downloaded'));
                dispatch(showLoaderAction(false));
            } else {
                return axios
                    .post(
                        `${baseUrl}/orders/bulk-download?locale=${locale}`,
                        {
                            data: JSON.stringify(state.layouts.checkedIds),
                            locale: locale
                        },
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
    'liveorders/BULK_CANCEL',
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
    'liveorders/FETCH_ITEM',
    async (id: number) =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ item: Orders.DataItem }> => {
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

export const expireOrderAction: any = createAction(
    'liveorders/EXPIRE_ORDER',
    async (orderId: number) =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ fileterData: any }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/orders/expire?orderId=${orderId}`, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            window.location.reload();
            if (res.status) {
                dispatch(showLoaderAction(false));
            }
            return {
                fileterData: res.data.items
            };
        }
);
export const findSellersAction: any = createAction(
    'liveorders/FIND_SELLER_AUTOSUGGEST',
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
export const fetchUserOrderAction: any = createAction(
    'order/FETCH_USER_ORDER',
    async (email: string) => {
        console.log('USER EMAIL FOR CONNECT', email);
        return axios
            .get(
                `${baseUrl}/orders/connect-bycomment?user=${window.localStorage.getItem(
                    'user'
                )}&commentId=${window.localStorage.getItem(
                    'order_comment_id'
                )}&userFbEmail=${email}`,
                {
                    headers: {
                        ...authHeader(email)
                    }
                }
            )
            .then((res) => {
                // console.log('RETURNED DATA', res.data);
                // window.localStorage.removeItem('orderCommentId');
                res.data.user;
            })
            .catch((e) => console.log(e.message));
    }
);
export const setupOrderByCommentAction: any = createAction(
    'order/FETCH_USER_ORDER',
    async (commentId: string, email: string) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            return axios
                .get(`${baseUrl}/orders/find-order-by-comment?commentId=${commentId}`, {
                    headers: {
                        ...authHeader(email)
                    }
                })
                .then((res) => {
                    if (res.data.storeName) {
                        dispatch(setupConnectedStoreNameAction(res.data.storeName));
                    }
                    dispatch(setupConnectedOrderIdAction(res.data.orderNumber));
                    // dispatch(setupConnectedStoreNameAction(res.data.storeName));
                    res.data.orderNumber;
                })
                .catch((e) => console.log(e.message));
        }
);

export const fetchOrderTotalAmountAction: any = createAction(
    'liveorders/FETCH_ORDER_TOTAL_AMOUNT',
    async (orderNumber: number) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            return axios
                .get(`${baseUrl}/orders/fetch-total-amount?orderNumber=${orderNumber}`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then((res: any) => {
                    dispatch(setupOrderAmountAction(res.data.total_amount));
                    dispatch(showLoaderAction(false));
                });
        }
);
export const fetchOrderTotalAmountActionUpdated: any = createAction(
    'liveorders/FETCH_ORDER_TOTAL_AMOUNT_TIMER',
    async (orderNumber: number) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            return axios
                .get(`${baseUrl}/orders/fetch-total-amount?orderNumber=${orderNumber}`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then((res: any) => {
                    dispatch(setupOrderAmountUpdatedAction(res.data.total_amount));
                    dispatch(showLoaderAction(false));
                });
        }
);

export const setTmpFbCommentAction: any = createAction('liveorders/SET_TMPFB_ORDER_COMMENT');
export const setFbCommentAction: any = createAction('liveorders/SET_FB_ORDER_COMMENT');
export const clearBase64Action: any = createAction('liveorders/CLEAR_BASE_64');
export const showPopupAction: any = createAction('liveorders/SHOW_POPUP');
export const showDateSelectorAction: any = createAction('liveorders/SHOW_DATE_POPUP');
export const setEmptyFormAction: any = createAction('liveorders/EMPTY_FORM');
export const showCancelConfirmationModalAction: any = createAction(
    'liveorders/CANCEL_CONFIRMATION_ORDER'
);
export const showShippedConfirmationModalAction: any = createAction(
    'liveorders/SHIPPED_CONFIRMATION_ORDER'
);
export const setAchiveNameAction: any = createAction('liveorders/SET_ARCHIVE_NAME');
export const setSingleFileNameAction: any = createAction('liveorders/SET_DOWNLOAD_SINGLE_NAME');
// export const connectOrderAction: any = createAction('liveorders/CONNECT_ORDER_ACTION');
export const clearOrderByCommentAction: any = createAction('liveorders/CLEAR_COMMENT_ORDER_NUMBER');
export const clearWaitOrderByCommentAction: any = createAction(
    'liveorders/CLEAR_WAIT_COMMENT_ORDER_NUMBER'
);
export const setupReturnedUrlAction: any = createAction('liveorders/SETUP_RETURNED_URL');
export const redirectCheckoutAction: any = createAction('liveorders/REDIRECT_CHECKOUT_ACTION');
export const redirectOrderNumberAction: any = createAction('liveorders/REDIRECT_ORDER_NUMBER');
export const setupConnectedOrderIdAction: any = createAction('liveorders/SETUP_CONNECTED_ORDER_ID');
export const setupConnectedStoreNameAction: any = createAction('liveorders/SETUP_CONNECTED_STORE');
export const setGoogleDeepLinkAction: any = createAction('liveorders/SET_GOOGLE_DEEP_LINK');
export const setupOrderAmountAction: any = createAction('liveorders/SET_ORDER_AMOUNT');
export const setupOrderAmountUpdatedAction: any = createAction('liveorders/SET_ORDER_AMOUNT_TIMER');
export const reloadAfterCombineAction: any = createAction('liveorders/RELOAD_AFTER_COMBINE');
// export const fetchOrderTotalAmountAction: any = createAction('liveorders/FETCH_ORDER_TOTAL');
