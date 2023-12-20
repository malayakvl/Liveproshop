import { createAction } from 'redux-actions';
import axios from 'axios';
import { authHeader } from '../../lib/functions';
import {
    setSuccessToastAction,
    setErrorToastAction,
    showEmailNotificationAction
} from '../layouts';
import { setUserAction } from '../user/';
import { showLoaderAction } from '../layouts/actions';
import { baseApiUrl } from '../../constants';
import { redirectOrderNumberAction } from '../orders';
// import { redirectCheckoutAction } from "../orders";
const baseUrl = `${baseApiUrl}/api`;
const baseAuthUrl = `${baseApiUrl}/auth`;
// const siteUrl = `${baseUrl}/auth`;

export const fetchProfileAction: any = createAction(
    'profile/FETCH_PROFILE',
    async () =>
        async (dispatch: Type.Dispatch, getState: () => State.Root): Promise<{ profile: any }> => {
            const state = getState();
            const res = await axios.get(`${baseUrl}/profile`, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            return {
                profile: res.data
            };
        }
);
export const updateProfileAction: any = createAction(
    'profile/UPDATE_PROFILE',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            const redirectOrderNUmber = state.orders.redirectOrderNumber;
            return axios
                .post(`${baseUrl}/profile`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async (res) => {
                    // window.localStorage.removeItem('user');
                    window.localStorage.setItem('user', JSON.stringify(res.data.user));
                    window.localStorage.setItem('updatedEmail', 'yes');
                    dispatch(setUserAction(res.data.user));
                    dispatch(showEmailNotificationAction(false));
                    // alert(JSON.stringify(res.data.user));
                    // window.location.reload();
                    // alert(JSON.stringify(res.data.user));
                    // alert(redirectReturned);
                    // console.log(res.data.user);
                    dispatch(setSuccessToastAction(`Profile has been updated`));
                    if (redirectOrderNUmber) {
                        dispatch(redirectOrderNumberAction(null));
                        window.location.href = `/en/checkout/${redirectOrderNUmber}`;
                    }
                    // if (redirectReturned) {
                    //     window.location.href = redirectReturned;
                    // }
                    // dispatch(redirectCheckoutAction());
                });
        }
);

export const changePasswordAction: any = createAction(
    'profile/CHANGE_PASSWORD',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            return axios
                .post(`${baseUrl}/changePassword`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async () => {
                    dispatch(setSuccessToastAction(`Password has been updated`));
                });
        }
);

export const changePasswordInvitationAction: any = createAction(
    'profile/CHANGE_PASSWORD_INVITATION',
    (data: any) =>
        async (dispatch: Type.Dispatch): Promise<any> => {
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseAuthUrl}/changePassword`, data)
                .then(({ data: { success, message } }) => {
                    if (success) {
                        dispatch(setSuccessToastAction('Password has been updated'));
                        return true;
                    } else if (message) {
                        dispatch(setErrorToastAction(message));
                    }
                })
                .catch((error) => {
                    dispatch(
                        setErrorToastAction(
                            error.response.data.message ||
                                error.request ||
                                error.message ||
                                'Error restore password'
                        )
                    );
                })
                .finally(() => dispatch(showLoaderAction(false)));
        }
);

export const restorePasswordAction: any = createAction(
    'profile/RESTORE_PASSWORD',
    (data: any, locale: string) =>
        async (dispatch: Type.Dispatch): Promise<any> => {
            dispatch(showLoaderAction(true));
            const res = await fetch(`${baseAuthUrl}/restorePassword?locale=${locale}`, {
                method: 'post',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            const resp = await res.json();
            dispatch(showLoaderAction(false));
            if (res.ok && resp.status) {
                return 'yes';
            } else {
                return resp.error.message ? resp.error.message : resp.error;
            }
        }
);

export const saveAddressAction: any = createAction(
    'assetModels/ADD_ADDRESS',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            const isNew = data.id;
            return axios
                .post(`${baseUrl}/address`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async () => {
                    dispatch(
                        setSuccessToastAction(`Address has been ${isNew ? 'updated' : 'created'}`)
                    );
                });
        }
);
export const saveAddressSellerAction: any = createAction(
    'assetModels/SAVE_SELLER_ADDRESS',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            const isNew = data.id;
            return axios
                .post(`${baseUrl}/address-seller`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async () => {
                    dispatch(
                        setSuccessToastAction(`Address has been ${isNew ? 'updated' : 'created'}`)
                    );
                });
        }
);

export const setPhotoAction: any = createAction('profile/SET_PROFILE_PHOTO');
export const setAddressAction: any = createAction('addresses/SET_ADDRESS');

export const setValidEmailStatusAction: any = createAction('profile/SET_VALID_STATUS');
