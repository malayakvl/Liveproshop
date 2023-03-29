import { createAction } from 'redux-actions';
import { authHeader } from '../../lib/functions';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;
import { setErrorToastAction, setSuccessToastAction } from '../layouts';
import { showLoaderAction } from '../layouts/actions';

export const submitFormAction: any = createAction(
    'payment-plans/ADD_UPDATE_DATA',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/payment-plans`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async () => {
                    dispatch(setSuccessToastAction('Record has been updated'));
                    dispatch(showLoaderAction(false));
                    dispatch(fetchFormAction());
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.response.data.error));
                    dispatch(showLoaderAction(false));
                });
        }
);

export const fetchStripeProductAction: any = createAction(
    'payment-plans/FETCH_STRIPE_ITEMS',
    async () =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ stripeItems: any }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/payment-stripe-plans`, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            if (res.status) {
                dispatch(showLoaderAction(false));
            }
            return {
                stripeItems: res.data.items
            };
        }
);
export const fetchFormAction: any = createAction(
    'payment-plans/FETCH_ITEMS',
    async () =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ items: any; settings: any }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/payment-plans`, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            if (res.status) {
                dispatch(showLoaderAction(false));
            }
            return {
                items: res.data.items,
                settings: res.data.settings
            };
        }
);
export const stripePaymentIntentAction: any = createAction(
    'stripe/FETCH_SECRET',
    async () =>
        async (dispatch: Type.Dispatch): Promise<{ clientSecret: string }> => {
            dispatch(showLoaderAction(true));
            const data = { items: [{ plan: 'prod_LJxk2nWsHvt13X' }] };
            const res = await axios.post(`${baseUrl}/create-payment-intent`, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.status) {
                dispatch(showLoaderAction(false));
            }
            return {
                clientSecret: res.data.clientSecret
            };
        }
);
export const syncStripeParameterAction: any = createAction(
    'stripe/SYNC_STRIPE',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/sync-stripe`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async () => {
                    dispatch(setSuccessToastAction(`Data was successfully sync with stripe`));
                })
                .catch((error) => {
                    dispatch(
                        setErrorToastAction(
                            error.response.data.message ||
                                error.request ||
                                error.message ||
                                'Sync fail'
                        )
                    );
                })
                .finally(() => dispatch(showLoaderAction(false)));
        }
);

export const paymentPlanInfoAction: any = createAction(
    'stripe/FETCH_PLAN_INFO',
    async (planId: number) =>
        async (dispatch: Type.Dispatch): Promise<{ planInfo: any }> => {
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/get-plan-info?planId=${planId}`);
            if (res.status) {
                dispatch(showLoaderAction(false));
            }
            return {
                planInfo: res.data.planInfo
            };
        }
);

export const requestDemoAction: any = createAction(
    'pricing/SEND-REQUEST-DEMO',
    async (data: any) =>
        (dispatch: Type.Dispatch): Promise<void> => {
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/request-demo?locale=${data.locale}`, data.form)
                .then(async (response: any) => {
                    const callback = data.callback;
                    if (typeof callback === 'function' && response.data.success) callback(true);
                    dispatch(setSuccessToastAction(data.successMessage));
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.response.data.message || e.response.data.error));
                })
                .finally(() => {
                    dispatch(showLoaderAction(false));
                });
        }
);
