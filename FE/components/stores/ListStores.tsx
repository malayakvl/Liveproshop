import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { DataTable, ButtonTableAction } from '../../components/_common';
import { PaginationType } from '../../constants';
import {
    checkedIdsSelector,
    paginationSelectorFactory,
    switchHeaderSelector
} from '../../redux/layouts/selectors';
import { checkIdsAction } from '../../redux/layouts';
import { fetchStoresAction } from '../../redux/mystores/actions';
import { baseApiUrl } from '../../constants';
import { BanIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import { paginatedStoresSelector, storeCountSelector } from '../../redux/mystores/selectors';

const ListStores: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const count = useSelector(storeCountSelector);
    const items = useSelector(paginatedStoresSelector);
    const checkedIds = useSelector(checkedIdsSelector);

    const sendRequest = useCallback(() => {
        return dispatch(fetchStoresAction());
    }, [dispatch]);

    // useEffect(() => {
    //     const setupChecked: any = [];
    //     items.forEach((item: any) => {
    //         setupChecked.push({ id: item.id, checked: false });
    //     });
    // }, [items]);

    return (
        <>
            <div className="mt-7">
                <div className="flex border border-l-0 border-r-0 border-t-0 pb-5 mb-10 relative">
                    <h2 className="dark-blue-header">
                        {t('My Stores')}
                        <span className="text-gray-180 font-normal text-sm"> {count} items</span>
                    </h2>
                </div>
                <DataTable
                    paginationType={PaginationType.MYSTORES}
                    totalAmount={count}
                    sendRequest={sendRequest}>
                    {items?.map((item: any) => (
                        <tr key={item.id}>
                            <td className="dropdown-action">
                                <input
                                    className="float-checkbox"
                                    type="checkbox"
                                    onChange={() => dispatch(checkIdsAction(item.id))}
                                    value={item.id}
                                    checked={
                                        checkedIds.find((data: any) => data.id === item.id)
                                            ?.checked || false
                                    }
                                />
                            </td>
                            <td style={{ width: '150px' }}>
                                {item.picture && (
                                    <img
                                        src={item.picture}
                                        alt=""
                                        className="object-scale-down h-[95px] w-[85px] rounded-lg border p-1.5"
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
                            <td
                                className="text-right whitespace-nowrap"
                                style={{ minWidth: '150px' }}>
                                {/*<ButtonTableAction*/}
                                {/*    dataId={String(item.id)}*/}
                                {/*    localeKey="Edit"*/}
                                {/*    className={'btn-edit'}*/}
                                {/*    onClick={handleEditBtnClick}*/}
                                {/*/>*/}
                                {/*<ButtonTableAction*/}
                                {/*    dataId={String(item.id)}*/}
                                {/*    onClick={handleDuplicateBtnClick}*/}
                                {/*    localeKey="Duplicate"*/}
                                {/*    className={'btn-copy'}*/}
                                {/*/>*/}
                                {/*<ButtonTableAction*/}
                                {/*    dataId={String(item.id)}*/}
                                {/*    onClick={handleDeleteBtnClick}*/}
                                {/*    localeKey="Delete"*/}
                                {/*    className={'btn-delete'}*/}
                                {/*/>*/}
                            </td>
                        </tr>
                    ))}
                </DataTable>
            </div>
        </>
    );
};

export default ListStores;
