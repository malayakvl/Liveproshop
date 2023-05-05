import { createAction } from 'redux-actions';
import axios from 'axios';
import getConfig from 'next/config';
import { authHeader, toggleModalPopup } from '../../lib/functions';
import { setErrorToastAction, setSuccessToastAction, showLoaderAction } from '../layouts/actions';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;
const authUrl = `${publicRuntimeConfig.apiUrl}/auth`;

export const fetchUserAction: any = createAction('profile/FETCH_USER', async (email: string) => {
    return axios
        .get(`${baseUrl}/profile`, {
            headers: {
                ...authHeader(email)
            }
        })
        .then((res) => res.data.user)
        .catch((e) => console.log(e.message));
});
export const inviteUserAction: any = createAction(
    'user/INVITE_USER',
    async (data: any, locale: string) =>
        (dispatch: Type.Dispatch): Promise<void> => {
            dispatch(showLoaderAction(true));
            return axios
                .post(`${authUrl}/invite?locale=${locale}`, data)
                .then(async () => {
                    dispatch(setSuccessToastAction(`Check confirmation link in your mailbox`));
                    dispatch(showLoaderAction(false));
                    dispatch(hideRegisterFormAction(true));
                })
                .catch((e) => {
                    // console.log('ERRROR', e.response);
                    dispatch(setErrorToastAction(e.response.data.message));
                    dispatch(showLoaderAction(false));
                });
        }
);
export const syncFbAction: any = createAction(
    'user/SYNC_FB',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/fb-authenticate`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async () => {
                    dispatch(setSuccessToastAction(`Sync success`));
                    dispatch(showLoaderAction(false));
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(`Sync fail`));
                    dispatch(showLoaderAction(false));
                    console.log(e.message);
                });
        }
);

export const createUserFromSubscriptionAction: any = createAction(
    'user/SUBSCRIPTION',
    async (data: any, planId: number, type: string | null) =>
        async (
            dispatch: Type.Dispatch
        ): Promise<{ subscription: any; clientSecret: string | null }> => {
            // const state = getState();
            dispatch(showLoaderAction(true));
            try {
                const res = await axios.post(
                    `${baseUrl}/subscription`,
                    { userData: data, planId: planId, type: type },
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                if (res.status) {
                    dispatch(showLoaderAction(false));
                }
                return {
                    subscription: res.data.subscription,
                    clientSecret: res.data.clientSecret
                };
            } catch (e) {
                dispatch(showLoaderAction(false));
                dispatch(setErrorToastAction(`Email present`));
                return {
                    clientSecret: null,
                    subscription: undefined
                };
            }
        }
);

export const skipExistUserSubscriptionAction: any = createAction(
    'user/SKIP_EXIST_USER_SUBSCRIPTION',
    async (redirectUrl: string, locale: string) =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ subscription: any; clientSecret: string }> => {
            dispatch(showLoaderAction(true));
            const state = getState();
            const res = await axios.post(
                `${baseUrl}/skip-exist-user-subscription`,
                { locale: locale },
                {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                }
            );
            if (res.status) {
                dispatch(showLoaderAction(false));
            }
            if (res.data.subscription.status === 'trialing') {
                window.localStorage.removeItem('user');
                window.localStorage.setItem('user', JSON.stringify(res.data.user));
                dispatch(setUserAction(res.data.user));
                window.location.href = redirectUrl;
            }
            return {
                subscription: res.data.subscription,
                clientSecret: res.data.clientSecret
            };
        }
);

export const createExistUserSubscriptionAction: any = createAction(
    'user/EXIST_USER_SUBSCRIPTION',
    async (data: any, planId: number, type: string | null) =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ subscription: any; clientSecret: string }> => {
            dispatch(showLoaderAction(true));
            const state = getState();
            const res = await axios.post(
                `${baseUrl}/exist-user-subscription`,
                { user: data, planId: planId, type: type },
                {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                }
            );
            if (res.status) {
                dispatch(showLoaderAction(false));
            }
            if (res.data.subscription.status === 'trialing') {
                window.localStorage.removeItem('user');
                window.localStorage.setItem('user', JSON.stringify(res.data.user));
                dispatch(setUserAction(res.data.user));
            }
            return {
                subscription: res.data.subscription,
                clientSecret: res.data.clientSecret
            };
        }
);

export const checkPaymentStatusAction: any = createAction(
    'user/CHECK_PAYMENT_STATUS',
    async (
            paymentIntent: string,
            paymentIntentSecret: string,
            planId: number,
            type: string | null
        ) =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ paymentIntent: any; user?: User.User }> => {
            dispatch(showLoaderAction(true));
            const state = getState();
            try {
                const res = await axios.post(
                    `${baseUrl}/check-payment-status?planId=${planId}`,
                    { paymentIntent, paymentIntentSecret, planId, type },
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                if (res.status) {
                    dispatch(showLoaderAction(false));
                }
                return {
                    paymentIntent: res.data.paymentIntent,
                    user: { ...state.user.user, ...res.data.user }
                };
            } catch (e) {
                dispatch(showLoaderAction(false));
                dispatch(setErrorToastAction(`Status of payment not confirmed`));
                return {
                    paymentIntent: null
                };
            }
        }
);

export const fetchUserSubscriptionAction: any = createAction(
    'user/SUBSCRIPTION_INFO',
    async () =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<{ subscription: any }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .get(`${baseUrl}/profile/subscription`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then((res: any) => {
                    dispatch(showLoaderAction(false));
                    return {
                        subscription: res.data.subscription
                    };
                })
                .catch(() => {
                    dispatch(showLoaderAction(false));
                    return {
                        subscription: null
                    };
                });
        }
);
export const unsubscribeAction: any = createAction(
    'user/UNSUBSCRIPTION',
    async () =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .get(`${baseUrl}/profile/unsubscription`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(() => {
                    dispatch(setSuccessToastAction('Response was sent successfully'));
                    dispatch(showLoaderAction(false));
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.response.data.error));
                    dispatch(showLoaderAction(false));
                });
        }
);
export const updateSubscriptionAction: any = createAction(
    'user/UPDATE_SUBSCRIPTION_PLAN',
    async (planId: string) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(
                    `${baseUrl}/profile/update-subscription-plan`,
                    { planId: planId },
                    {
                        headers: {
                            ...authHeader(state.user.user.email)
                        }
                    }
                )
                .then(() => {
                    dispatch(setSuccessToastAction('Response was sent successfully'));
                    dispatch(showChangeSubscriptionFormAction(false));
                    dispatch(fetchUserSubscriptionAction());
                    dispatch(showLoaderAction(false));
                    toggleModalPopup('.modal-seller-change-subscription');
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.response.data.error));
                    dispatch(showLoaderAction(false));
                });
        }
);
export const addPyamentMethodActions: any = createAction(
    'user/ADD_PAYMENT_METHOD',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/profile/add-payment-method`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(() => {
                    dispatch(setSuccessToastAction('Response was sent successfully'));
                    dispatch(fetchUserSubscriptionAction());
                    dispatch(showLoaderAction(false));
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.response.data.error));
                    dispatch(showLoaderAction(false));
                });
        }
);
export const stripeDefaultPaymentAction: any = createAction(
    'user/CHANGE_DEFAULT_PAYMENT',
    async (paymentId: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(
                    `${baseUrl}/profile/default-payment-method`,
                    { paymentId: paymentId },
                    {
                        headers: {
                            ...authHeader(state.user.user.email)
                        }
                    }
                )
                .then(() => {
                    dispatch(setSuccessToastAction('Response was sent successfully'));
                    dispatch(fetchUserSubscriptionAction());
                    dispatch(showLoaderAction(false));
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.response.data.error));
                    dispatch(showLoaderAction(false));
                });
        }
);
export const stripeDeletetPaymentAction: any = createAction(
    'user/DELETE_PAYMENT',
    async (paymentId: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(
                    `${baseUrl}/profile/delete-payment-method`,
                    { paymentId: paymentId },
                    {
                        headers: {
                            ...authHeader(state.user.user.email)
                        }
                    }
                )
                .then(() => {
                    dispatch(setSuccessToastAction('Response was sent successfully'));
                    dispatch(fetchUserSubscriptionAction());
                    dispatch(showLoaderAction(false));
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.response.data.error));
                    dispatch(showLoaderAction(false));
                });
        }
);
export const generateInvoiceStripeAction: any = createAction(
    'user/GENERATE_STRIPE_INVOICE',
    async () =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .get(`${baseUrl}/profile/generate-stripe-invoice`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(() => {
                    dispatch(setSuccessToastAction('Response was sent successfully'));
                    // dispatch(fetchUserSubscriptionAction());
                    dispatch(showLoaderAction(false));
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.response.data.error));
                    dispatch(showLoaderAction(false));
                });
        }
);

export const setUserAction: any = createAction('user/SET_USER');
export const hideRegisterFormAction: any = createAction('user/HIDE_REGISTER_FORM');
export const showChangeSubscriptionFormAction: any = createAction('user/CHANGE_SUBSCRIPTION_FORM');
