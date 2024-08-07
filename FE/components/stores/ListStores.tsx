import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { DataTable } from '../../components/_common';
import { PaginationType } from '../../constants';
import { fetchStoresAction } from '../../redux/mystores';
// import { baseApiUrl } from '../../constants';
import { BanIcon } from '@heroicons/react/solid';
// import Image from 'next/image';
import { paginatedStoresSelector, storeCountSelector } from '../../redux/mystores/selectors';
import { showPopupAction } from '../../redux/livesessions';
import { setLiveSessionStoreAction } from '../../redux/livesessions/index';
import SchedulePopup from '../liveselling/SchedulePopup';

const ListStores: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const count = useSelector(storeCountSelector);
    const items = useSelector(paginatedStoresSelector);
    const [selectedStore, setSelectedStore] = useState(null);
    // const checkedIds = useSelector(checkedIdsSelector);

    const sendRequest = useCallback(() => {
        return dispatch(fetchStoresAction());
    }, [dispatch]);

    return (
        <>
            <div className="mt-7">
                <DataTable
                    paginationType={PaginationType.DASHBOARD}
                    totalAmount={count}
                    sendRequest={sendRequest}>
                    {items?.map((item: any) => (
                        <tr key={item.id}>
                            <td style={{ width: '50px' }}>
                                {item.picture && (
                                    <img
                                        src={item.picture}
                                        alt=""
                                        className="h-[50px] w-[50px] block rounded-full"
                                    />
                                )}
                                {!item.picture && (
                                    <div className="border rounded-lg w-[85px] h-[95px] block flex items-center text-center">
                                        <BanIcon
                                            width={30}
                                            height={30}
                                            className="m-auto text-gray-200"
                                        />
                                    </div>
                                )}
                            </td>
                            <td>{item.name}</td>
                            <td>{item.fan_count}</td>
                            <td
                                className="text-right whitespace-nowrap"
                                style={{ minWidth: '150px', textAlign: 'right' }}>
                                {item.synchronized ? (
                                    <button
                                        className="gradient-btn-small xl:ml-4 mt-4 md:mt-0 float-right"
                                        onClick={() => {
                                            dispatch(setLiveSessionStoreAction(item.id));
                                            dispatch(showPopupAction(true));
                                        }}>
                                        {t('Schedule new session')}
                                    </button>
                                ) : (
                                    <>not synchronized with Facebook or missing</>
                                )}
                            </td>
                            {/*<td*/}
                            {/*    className="text-right whitespace-nowrap"*/}
                            {/*    style={{ minWidth: '150px' }}>*/}
                            {/*    <button*/}
                            {/*        className="gradient-btn-small xl:ml-4 mt-4 md:mt-0"*/}
                            {/*        onClick={() => {*/}
                            {/*            dispatch(setLiveSessionStoreAction(item.id));*/}
                            {/*            dispatch(showPopupAction(true));*/}
                            {/*        }}>*/}
                            {/*        {t('Schedule new session')}*/}
                            {/*    </button>*/}
                            {/*</td>*/}
                        </tr>
                    ))}
                </DataTable>
                <SchedulePopup />
            </div>
        </>
    );
};

export default ListStores;
