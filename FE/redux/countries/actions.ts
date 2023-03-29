import { createAction } from 'redux-actions';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;
import { authHeader } from '../../lib/functions';
import axios from 'axios';

export const fetchCountriesAction: any = createAction(
    'profile/FETCH_COUNTRIES',
    async () => async (dispatch: Type.Dispatch, getState: () => State.Root) => {
        const state = getState();
        const res = await axios.get(`${baseUrl}/countries`, {
            headers: {
                ...authHeader(state.user.user.email)
            }
        });

        return res.data.countries;
    }
);
