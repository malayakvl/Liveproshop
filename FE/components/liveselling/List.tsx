import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { itemsCountSelector, paginatedItemsSelector } from '../../redux/livesessions/selectors';
import { PaginationType } from '../../constants';
import { DataTable } from '../_common';
import { fetchItemsAction } from '../../redux/livesessions';
import { stopSessionAction } from '../../redux/livesessions/actions';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { itemSelector } from '../../redux/settings/selectors';

const ListMessages: React.FC = () => {
    const dispatch = useDispatch();
    const items = useSelector(paginatedItemsSelector);
    const count = useSelector(itemsCountSelector);
    const settingsValues = useSelector(itemSelector);

    const t = useTranslations();

    const [closedSessions, setClosedSession] = useState<number[]>([]);
    const sendRequest = useCallback(() => {
        return dispatch(fetchItemsAction());
    }, [dispatch]);

    return (
        <div className="mt-7">
            <DataTable
                paginationType={PaginationType.LIVESESSIONS}
                totalAmount={count}
                sendRequest={sendRequest}>
                {items?.map((item: any) => (
                    <tr key={item.id}>
                        <td style={{ minWidth: '150px' }}>
                            {moment(item.event_date).format('DD.MM.YYYY')}
                        </td>
                        <td style={{ minWidth: '150px' }}>{item.event_time}</td>
                        <td style={{ minWidth: '150px' }}>
                            {item.order_timer
                                ? item.order_timer.days
                                    ? `${item.order_timer.days} day(s)`
                                    : `${
                                          item.order_timer.hours
                                              ? 'hour(s)'
                                              : `${item.order_timer.minutes} minute(s)`
                                      } `
                                : ''}
                        </td>
                        <td>
                            {item.status != 'closed' && !closedSessions.includes(item.id) && (
                                <span title="Close" role="presentation" className={item.status}>
                                    {t(item.status)}
                                </span>
                            )}
                            {item.status == 'live' && !closedSessions.includes(item.id) && (
                                <span
                                    title="Close"
                                    onClick={() => {
                                        dispatch(stopSessionAction(item.id));
                                        setClosedSession([...closedSessions, item.id]);
                                    }}
                                    role="presentation"
                                    className="live-close">
                                    {t('Close')}
                                </span>
                            )}

                            {(item.status === 'closed' || closedSessions.includes(item.id)) && (
                                <span className="closed">{t('Closed')}</span>
                            )}
                        </td>
                        <td>{item.store_name}</td>
                        {/*<td>{item.user_cnt ? item.user_cnt : '-'}</td>*/}
                    </tr>
                ))}
            </DataTable>
        </div>
    );
};

export default ListMessages;
