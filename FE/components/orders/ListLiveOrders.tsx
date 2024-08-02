import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    achiveNameSelector,
    itemsCountSelector,
    itemsStatusesSelector,
    liveItemsSelector
} from '../../redux/liveorders/selectors';
import { PaginationType } from '../../constants';
import { DataTable } from '../_common';
import {
    clearBase64Action,
    fetchLiveItemsAction,
    showCancelConfirmationModalAction,
    showShippedConfirmationModalAction,
    showDateSelectorAction
} from '../../redux/liveorders';
import moment from 'moment';
import Image from 'next/image';
import { baseApiUrl } from '../../constants';
import { initIdsAction } from '../../redux/layouts';
import { useTranslations } from 'next-intl';
import { Filters, FilterValues, ListLiveItems } from './index';
import { paginationSelectorFactory } from '../../redux/layouts/selectors';
import { formatCurrency } from '../../lib/functions';
import { userSelector } from '../../redux/user/selectors';
import { bulkDownloadAction } from '../../redux/liveorders/actions';

const userProfileImg =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

type Props = {
    locale: string;
};

const ListLiveOrders: React.FC<Props> = ({ locale }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const items = useSelector(liveItemsSelector);
    const [_, setTime] = useState(new Date());
    const count = useSelector(itemsCountSelector);
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.LIVEORDERS)
    );
    const user = useSelector(userSelector);
    const achiveName = useSelector(achiveNameSelector);
    const achiveRefname = useRef(null);

    const [showMoreConfigs, setShowMoreConfigs] = useState<any>({});
    const [filterOpen, setFilterOpen] = useState(false);

    const sendRequest = useCallback(() => {
        return dispatch(fetchLiveItemsAction());
    }, [dispatch]);

    useEffect(() => {
        const interval = setInterval(() => {
            // dispatch(fetchLiveItemsAction());
            window.location.reload();
            setTime(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const setupChecked: any = [];
        items.forEach((item: any) => {
            setupChecked.push({ id: item.id, checked: false });
        });
        dispatch(initIdsAction(setupChecked));
        dispatch(clearBase64Action(null));
    }, [items]);

    useEffect(() => {
        if (achiveName) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            achiveRefname?.current.click();
        }
    }, [achiveName]);

    const sendStatusRequest = useCallback(
        (status: string) => {
            if (status === 'shipped') {
                return dispatch(showShippedConfirmationModalAction(true));
            } else if (status === 'cancel' || status === 'refund') {
                return dispatch(showCancelConfirmationModalAction(true));
            } else {
                return dispatch(bulkDownloadAction(locale));
            }
        },
        [dispatch]
    );

    const handleShowMore = (orderId: number) => {
        const nextCheckedItems = { ...showMoreConfigs };
        nextCheckedItems[orderId] = !nextCheckedItems[orderId];
        setShowMoreConfigs(nextCheckedItems);
    };

    const handleHideFilter = useCallback(() => {
        setFilterOpen(false);
        // dispatch(showDateSelectorAction(false));
    }, []);

    return (
        <div className="mt-7">
            <>
                <div className="flex border border-l-0 border-r-0 border-t-0 pb-5 mb-10 relative">
                    <h2 className="dark-blue-header mt-[75px] md:mt-auto">
                        {t('Live Orders')}
                        <span className="text-gray-180 font-normal text-sm"> {count} items</span>
                    </h2>
                    <Filters
                        handleHideFilter={handleHideFilter}
                        locale={locale}
                        filterOpen={filterOpen}
                    />
                    <div className="">
                        <button
                            onClick={() => {
                                if (filterOpen) {
                                    dispatch(showDateSelectorAction(false));
                                }
                                setFilterOpen(!filterOpen);
                            }}
                            className="absolute top-[-40px] md:top-0 right-0 flex items-center text-sm border rounded-lg px-4 py-1.5">
                            <Image width={16} height={16} src={'/images/filter.svg'} />
                            <div className="font-medium text-gray-400 ml-2">{t('Filters')}</div>
                            <div className="ml-2 font-bold rounded-full p-[2px] text-center bg-gray-400 text-xs h-5 w-5 text-white">
                                {filters.country_id.length +
                                    filters.payment_id.length +
                                    !!filters.total_amount.length +
                                    !!filters.created_at.length +
                                    filters.country_id.length}
                            </div>
                        </button>
                    </div>
                </div>

                <div className="mb-5">
                    <FilterValues />
                </div>
                <DataTable
                    paginationType={PaginationType.LIVEORDERS}
                    sendStatusRequest={sendStatusRequest}
                    totalAmount={count}
                    sendRequest={sendRequest}>
                    {items?.map((item: any) => (
                        <Fragment key={item.id}>
                            <tr>
                                <td style={{ width: '50px' }}>
                                    <i
                                        role="presentation"
                                        className="icon-tbl-triangle cursor-pointer"
                                        style={{ marginTop: '5px' }}
                                        onClick={() => handleShowMore(item.id)}
                                    />
                                </td>
                                <td
                                    className={`${
                                        user.role_id === 2 && item.status_waiting
                                            ? ''
                                            : 'order-number'
                                    }`}>
                                    {item.order_number}
                                </td>
                                <td className="order-date">
                                    {moment(item.created_at).format('DD/MM/YYYY')}
                                </td>
                                <td className="">
                                    <div className="float-left">
                                        <div className="flex flex-row">
                                            <div
                                                className="user-photo-1"
                                                style={{ marginLeft: '0' }}>
                                                <Image
                                                    src={
                                                        item.buyer_photo
                                                            ? baseApiUrl + item.buyer_photo
                                                            : userProfileImg
                                                    }
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full cursor-pointer"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="pl-3">
                                                {item.buyer_first_name} {item.buyer_last_name}
                                            </div>
                                            {/*<span className="absolute pt-[17px] font-[9px] store-style">*/}
                                            {/*    {item.name}*/}
                                            {/*</span>*/}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ minWidth: '150px' }}>
                                    {item.order_items?.length ? item.order_items?.length : 0}x{' '}
                                    <span className="red-yellow-gradient-text">product (s)</span>
                                </td>
                                <td>
                                    {formatCurrency(
                                        parseFloat(item.total_amount) -
                                            parseFloat(
                                                item.refund_amount ? item.refund_amount : 0
                                            ) +
                                            parseFloat(
                                                item.shipping_amount ? item.shipping_amount : 0
                                            )
                                    )}
                                </td>
                            </tr>
                            <tr className={!showMoreConfigs[item.id] ? 'hidden' : ''}>
                                <td />
                                <td colSpan={10} style={{ borderLeft: 'solid 1px red' }}>
                                    <ListLiveItems
                                        items={item.order_items}
                                        expireAt={item.expire_order_at}
                                    />
                                </td>
                            </tr>
                            {/*<tr>*/}
                            {/*    <td style={{ width: '50px' }}>*/}
                            {/*        <i*/}
                            {/*            role="presentation"*/}
                            {/*            className="icon-tbl-triangle cursor-pointer"*/}
                            {/*            style={{ marginTop: '5px' }}*/}
                            {/*            onClick={() => handleShowMore(item.id)}*/}
                            {/*        />*/}
                            {/*    </td>*/}
                            {/*    <td*/}
                            {/*        className={`${*/}
                            {/*            user.role_id === 2 && item.status_waiting*/}
                            {/*                ? ''*/}
                            {/*                : 'order-number'*/}
                            {/*        }`}>*/}
                            {/*        {item.order_number}*/}
                            {/*    </td>*/}
                            {/*    <td className="order-date">*/}
                            {/*        {moment(item.created_at).format('DD/MM/YYYY')}*/}
                            {/*    </td>*/}
                            {/*    <td></td>*/}
                            {/*    <td className="">*/}
                            {/*        <div className="float-left">*/}
                            {/*            <div className="flex flex-row">*/}
                            {/*                <div*/}
                            {/*                    className="user-photo-1"*/}
                            {/*                    style={{ marginLeft: '0' }}>*/}
                            {/*                    <Image*/}
                            {/*                        src={*/}
                            {/*                            item.buyer_photo*/}
                            {/*                                ? baseApiUrl + item.buyer_photo*/}
                            {/*                                : userProfileImg*/}
                            {/*                        }*/}
                            {/*                        width={24}*/}
                            {/*                        height={24}*/}
                            {/*                        className="rounded-full cursor-pointer"*/}
                            {/*                        alt=""*/}
                            {/*                    />*/}
                            {/*                </div>*/}
                            {/*                <div className="pl-3">*/}
                            {/*                    {item.buyer_first_name} {item.buyer_last_name}*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </td>*/}
                            {/*    <td style={{ minWidth: '150px' }}>*/}
                            {/*        {item.order_items?.length ? item.order_items?.length : 0}x{' '}*/}
                            {/*        <span className="red-yellow-gradient-text">product (s)</span>*/}
                            {/*    </td>*/}
                            {/*    <td>*/}
                            {/*        {formatCurrency(*/}
                            {/*            parseFloat(item.total_amount) -*/}
                            {/*                parseFloat(*/}
                            {/*                    item.refund_amount ? item.refund_amount : 0*/}
                            {/*                ) +*/}
                            {/*                parseFloat(*/}
                            {/*                    item.shipping_amount ? item.shipping_amount : 0*/}
                            {/*                )*/}
                            {/*        )}*/}
                            {/*    </td>*/}
                            {/*</tr>*/}
                            {/*<tr className={!showMoreConfigs[item.id] ? 'hidden' : ''}>*/}
                            {/*    <td />*/}
                            {/*    <td colSpan={10} style={{ borderLeft: 'solid 1px red' }}>*/}
                            {/*        <ListLiveItems*/}
                            {/*            items={item.order_items}*/}
                            {/*            expireAt={item.expire_order_at}*/}
                            {/*        />*/}
                            {/*    </td>*/}
                            {/*</tr>*/}
                        </Fragment>
                    ))}
                </DataTable>
            </>
        </div>
    );
};

export default ListLiveOrders;
