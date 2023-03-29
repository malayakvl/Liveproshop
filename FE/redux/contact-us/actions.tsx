import { createAction } from 'redux-actions';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;
import { setErrorToastAction, setSuccessToastAction } from '../layouts';
import { showLoaderAction } from '../layouts/actions';

export const submitFormAction: any = createAction(
    'contact-us/SEND-MESSAGE',
    async (data: any) =>
        (dispatch: Type.Dispatch): Promise<void> => {
            dispatch(showLoaderAction(true));
            return axios
                .post(`${baseUrl}/contact-us?locale=${data.locale}`, data.form)
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
