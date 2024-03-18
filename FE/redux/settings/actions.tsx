import { createAction } from 'redux-actions';
import { authHeader } from '../../lib/functions';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;
import { setErrorToastAction, setSuccessToastAction } from '../layouts';
import { showLoaderAction } from '../layouts/actions';

export const submitFormAction: any = createAction(
    'settings/ADD_UPDATE_DATA',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/update-settings`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async (response) => {
                    if (response.data.success) {
                        dispatch(fetchFormAction());
                        dispatch(setSuccessToastAction('Record has been updated'));
                    } else dispatch(setErrorToastAction('Something went wrong'));

                    dispatch(showLoaderAction(false));
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.response.data.error));
                    dispatch(showLoaderAction(false));
                });
        }
);
export const submitFormLinkAction: any = createAction(
    'settings/ADD_UPDATE_LINK_DATA',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/update-link-settings`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async (response) => {
                    if (response.data.success) {
                        dispatch(fetchFormAction());
                        dispatch(setSuccessToastAction('Record has been updated'));
                    } else dispatch(setErrorToastAction('Something went wrong'));

                    dispatch(showLoaderAction(false));
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.response.data.error));
                    dispatch(showLoaderAction(false));
                });
        }
);
export const submitFormUploadAction: any = createAction(
    'settings/ADD_UPDATE_FILES_DATA',
    async (data: any) =>
        (dispatch: Type.Dispatch, getState: () => State.Root): Promise<void> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/update-file-settings`, data, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then(async (response) => {
                    if (response.data.success) {
                        // dispatch(fetchFormAction());
                        dispatch(setSuccessToastAction('Record has been updated'));
                    } else dispatch(setErrorToastAction('Something went wrong'));

                    dispatch(showLoaderAction(false));
                })
                .catch((e) => {
                    dispatch(setErrorToastAction(e.response.data.error));
                    dispatch(showLoaderAction(false));
                });
        }
);
export const fetchFormAction: any = createAction(
    'settings/FETCH_ITEM',
    async () =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ item: Settings.SettingItem }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/fetch-settings`, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            if (res.status) {
                dispatch(showLoaderAction(false));
            }
            return {
                item: res.data.item
            };
        }
);

export const removeUploadedPolicyFile: any = createAction(
    'settings/REMOVE_UPLOADED_POLICY_FILE',
    async () =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ item: Settings.SettingItem }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/remove-settings-file?type=privacy`, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            if (res.status) {
                dispatch(showLoaderAction(false));
                dispatch(fetchFormAction());
            }
            return {
                item: res.data.item
            };
        }
);
export const removeUploadedTermsAndCondFile: any = createAction(
    'settings/REMOVE_UPLOADED_TERMSCOND_FILE',
    async () =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ item: Settings.SettingItem }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/remove-settings-file?type=terms`, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            if (res.status) {
                dispatch(showLoaderAction(false));
                dispatch(fetchFormAction());
            }
            return {
                item: res.data.item
            };
        }
);
export const removeUploadedDeliveryFile: any = createAction(
    'settings/REMOVE_UPLOADEDDELIVERY_FILE',
    async () =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ item: Settings.SettingItem }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/remove-settings-file?type=delivery`, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            if (res.status) {
                dispatch(showLoaderAction(false));
                dispatch(fetchFormAction());
            }
            return {
                item: res.data.item
            };
        }
);
export const removeUploadedReturnFile: any = createAction(
    'settings/REMOVE_UPLOADED_RETURN_FILE',
    async () =>
        async (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ item: Settings.SettingItem }> => {
            const state = getState();
            dispatch(showLoaderAction(true));
            const res = await axios.get(`${baseUrl}/remove-settings-file?type=return`, {
                headers: {
                    ...authHeader(state.user.user.email)
                }
            });
            if (res.status) {
                dispatch(showLoaderAction(false));
                dispatch(fetchFormAction());
            }
            return {
                item: res.data.item
            };
        }
);

export const addUploadedPolicyFile: any = createAction('settings/ADD_UPLOADED_POLICY_FILE');
export const addUploadedTermsAndCondFile: any = createAction(
    'settings/ADD_UPLOADED_TERMSCOND_FILE'
);
export const addUploadedDeliveryFile: any = createAction('settings/ADD_UPLOADED_DELIVERY_FILE');
export const addUploadedReturnFile: any = createAction('settings/ADD_UPLOADED_RETURN_FILE');
