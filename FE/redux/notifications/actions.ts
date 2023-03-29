import { createAction } from 'redux-actions';
import { authHeader } from '../../lib/functions';
import queryString from 'query-string';
import { paginationSelectorFactory } from '../layouts/selectors';
import { PaginationType } from '../../constants';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;

export const fetchLatestAction: any = createAction(
    'notifications/FETCH_LATEST_NOTIFICATIONS',
    async () =>
        (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ cntNew: any; notificationsLatest: any }> => {
            const state = getState();
            return axios
                .get(`${baseUrl}/new-notice`, {
                    headers: {
                        ...authHeader(state.user.user.email)
                    }
                })
                .then((res: any) => ({
                    cntNew: res.data.count,
                    notificationsLatest: res.data.items
                }));
        }
);

export const fetchNotificationsAction: any = createAction(
    'notifications/FETCH_NOTIFICATIONS',
    async () =>
        (
            dispatch: Type.Dispatch,
            getState: () => State.Root
        ): Promise<{ count: any; items: any }> => {
            const state = getState();
            const { limit, offset, sort, column, query } = paginationSelectorFactory(
                PaginationType.NOTIFICATIONS
            )(state);
            return axios
                .get(
                    `${baseUrl}/fetch-notifications?${queryString.stringify({
                        limit,
                        offset,
                        sort,
                        column,
                        query
                    })}`,
                    {
                        headers: {
                            ...authHeader(state.user.user.email)
                        }
                    }
                )
                .then((res: any) => ({
                    count: res.data.count,
                    items: res.data.items
                }));
        }
);
