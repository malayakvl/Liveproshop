import axios from 'axios';
import { createAction } from 'redux-actions';
import { authHeader } from '../../lib/functions';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const url = `${publicRuntimeConfig.apiUrl}/api/support`;
const actionName = (name: string) => `SUPPORT/${name}`;

export const sendMessage: any = createAction(
    actionName('SEND_MESSAGE'),
    (values: { email: string; message: string }, locale: string) =>
        async (dispatch: Type.Dispatch, getState: () => State.Root) => {
            const state = getState();

            await axios.post(
                `${url}/send-message?locale=${locale}`,
                { ...values },
                {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                }
            );
        }
);
