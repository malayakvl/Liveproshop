import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
    achiveNameSelector,
    itemsCountSelector,
    itemsStatusesSelector,
    paginatedItemsSelector
} from '../../redux/orders/selectors';
import { PaginationType } from '../../constants';
import { DataTable, DropdownPdfAction, DropdownStatusAction } from '../_common';
import {
    clearBase64Action,
    fetchItemsAction,
    showCancelConfirmationModalAction,
    showShippedConfirmationModalAction,
    showDateSelectorAction
} from '../../redux/orders';
import moment from 'moment';
import Image from 'next/image';
import { baseApiUrl } from '../../constants';
import { checkIdsAction, initIdsAction } from '../../redux/layouts';
import { useTranslations } from 'next-intl';
import { Filters, FilterValues, ListItems, CancelConfirmation, ShippedConfirmation } from './index';
import { checkedIdsSelector, paginationSelectorFactory } from '../../redux/layouts/selectors';
import { formatCurrency, parseTranslation } from '../../lib/functions';
import { userSelector } from '../../redux/user/selectors';
import { bulkDownloadAction } from '../../redux/orders/actions';
import Router from 'next/router';

const userProfileImg =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

type Props = {
    locale: string;
};

const ListOrders: React.FC<Props> = ({ locale }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const items = useSelector(paginatedItemsSelector);
    const itemsStatuses = useSelector(itemsStatusesSelector);
    const count = useSelector(itemsCountSelector);
    const checkedIds = useSelector(checkedIdsSelector);
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.ORDERS)
    );
    const user = useSelector(userSelector);
    const achiveName = useSelector(achiveNameSelector);
    const achiveRefname = useRef(null);

    const [showMoreConfigs, setShowMoreConfigs] = useState<any>({});
    const [filterOpen, setFilterOpen] = useState(false);

    const sendRequest = useCallback(() => {
        return dispatch(fetchItemsAction());
    }, [dispatch]);

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
                return dispatch(bulkDownloadAction());
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

    const displayOrderStatuses = (id: number) => {
        // let orderStatus;
        // eslint-disable-next-line prefer-const
        // console.log(itemsStatuses);
        const orderStatus = itemsStatuses.find((_item: any) => _item.id === id);
        // let resultStatuses = '';
        const dataStatuses: any[] = [];
        if (orderStatus?.statuses?.length > 0) {
            orderStatus?.statuses?.map((_status: any) => {
                // resultStatuses += `${_status.status}<br/>`;
                dataStatuses.push(
                    t(_status.status) +
                        ' ' +
                        moment(_status.created_at).format('DD/MM/YYYY H:mm:ss')
                );
            });
        }

        return dataStatuses;
    };
    // console.log('ITEMS', items);

    return (
        <div className="mt-7">
            <>
                <div className="flex border border-l-0 border-r-0 border-t-0 pb-5 mb-10 relative">
                    <h2 className="dark-blue-header mt-[75px] md:mt-auto">
                        {t('Orders')}
                        <span className="text-gray-180 font-normal text-sm"> {count} items</span>
                    </h2>
                    <Filters
                        handleHideFilter={handleHideFilter}
                        locale={locale}
                        filterOpen={filterOpen}
                    />
                    <div className="">
                        <button
                            // style={{ right: '0px', top: '20px' }}
                            className={`gradient-btn btn-download-orders`}
                            onClick={() => dispatch(bulkDownloadAction())}>
                            <div className="font-medium text-white ml-2 mr-2 py-[3px]">
                                {t('Download Orders')}
                            </div>
                        </button>
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
                                    filters.status.length +
                                    filters.seller_id.length +
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
                    paginationType={PaginationType.ORDERS}
                    sendStatusRequest={sendStatusRequest}
                    totalAmount={count}
                    sendRequest={sendRequest}>
                    {items?.map((item: any) => (
                        <Fragment key={item.id}>
                            <tr>
                                <td>
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
                                        user.role_id === 1 && item.status_waiting
                                            ? ''
                                            : 'order-number'
                                    }`}>
                                    {user.role_id === 1 && !item.status_waiting && (
                                        <>
                                            <Link
                                                href={`/orders/${item.order_number}?locale=${locale}`}>
                                                <a>{item.order_number}</a>
                                            </Link>
                                        </>
                                    )}
                                    {user.role_id === 1 && item.status_waiting && (
                                        <span
                                            className="f-12 number-waiting"
                                            style={{ color: 'black !important' }}>
                                            {item.order_number}
                                        </span>
                                    )}
                                    {user.role_id === 2 && item.status === 'new' && (
                                        <>
                                            <Link href={`/checkout/${item.order_number}`}>
                                                <a>{item.order_number}</a>
                                            </Link>
                                        </>
                                    )}
                                    {user.role_id === 2 && item.status !== 'new' && (
                                        <Link href={`/orders/${item.order_number}`}>
                                            <a>{item.order_number}</a>
                                        </Link>
                                    )}
                                </td>
                                <td className="order-status">
                                    <div className="flex flex-row items-center justify-center">
                                        {!item.status_waiting ? (
                                            <span className={`order-status ${item.status}`}>
                                                {t(item.status)}
                                            </span>
                                        ) : (
                                            <span className={`order-status waiting`}>
                                                {t('waiting')}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <span className="inline-block w-[20px] h-[20px]">
                                        {item.status != 'new' && item.status != 'waiting' && (
                                            <div className="status-dropdown">
                                                <DropdownStatusAction
                                                    onChange={(v: any) => {
                                                        console.log('222');
                                                    }}
                                                    options={displayOrderStatuses(item.id)}
                                                />
                                            </div>
                                        )}
                                    </span>
                                </td>
                                <td>
                                    {item.status == 'payed' && (
                                        <Link
                                            href={`/orders/${item.order_number}?locale=${locale}`}>
                                            <span className="f-pdf inline-block mt-[3px]" />
                                        </Link>
                                    )}
                                    {item.status == 'canceled' && (
                                        <div className="invoice-dropdown">
                                            <DropdownPdfAction
                                                onChange={(v: any) => {
                                                    const type =
                                                        v === 'invoice pdf' ? 'invoice' : 'refund';
                                                    Router.push(
                                                        `/orders/${item.order_number}?locale=${locale}&type=${type}`
                                                    );
                                                }}
                                                options={['invoice pdf', 'refund pdf']}
                                            />
                                        </div>
                                    )}
                                </td>
                                <td className="order-date">
                                    {moment(item.created_at).format('DD/MM/YYYY')}
                                </td>
                                <td className="">
                                    <div className="float-left">
                                        <div className="flex flex-row">
                                            <div className="user-photo" style={{ marginLeft: '0' }}>
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
                                <td>{parseTranslation(item.country_json, 'name', locale)}</td>
                                <td>
                                    {/*{baseApiUrl + item.shipping_image}*/}
                                    {item.shipping_image && (
                                        <Image
                                            src={baseApiUrl + item.shipping_image}
                                            width={24}
                                            height={24}
                                            className=""
                                            alt=""
                                        />
                                    )}
                                </td>
                                <td>
                                    <img
                                        src="/images/payments/maestro.svg"
                                        className="fill-current text-black"
                                        alt={''}
                                    />
                                </td>
                                <td style={{ minWidth: '150px' }}>
                                    {item.order_items?.length ? item.order_items?.length : 0}x{' '}
                                    <span className="red-yellow-gradient-text">product (s)</span>
                                </td>
                                {/*<td>{item.name}</td>*/}
                                {/*<td>*/}
                                {/*    {formatCurrency(*/}
                                {/*        item.shipping_amount ? item.shipping_amount : 0*/}
                                {/*    )}{' '}*/}
                                {/*    / {formatCurrency(item.refund_amount ? item.refund_amount : 0)}*/}
                                {/*</td>*/}
                                <td>
                                    {formatCurrency(
                                        item.total_amount
                                            ? item.total_amount - item.refund_amount
                                            : item.order_amount
                                    )}
                                </td>

                                {user.role_id === 1 &&
                                    item.status === 'new' &&
                                    item.total_amount != 0 && (
                                        <td style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            {!item.status_waiting && (
                                                <Link
                                                    href={`/checkout/${item.order_number}?storeName=${item.name}`}>
                                                    <div
                                                        className="gradient-btn-small cursor-pointer"
                                                        style={{
                                                            paddingTop: '3px',
                                                            paddingBottom: '3px',
                                                            minWidth: '60px'
                                                        }}>
                                                        <span className="text-white bg-none font-bold">
                                                            {t('Pay')}
                                                        </span>
                                                    </div>
                                                </Link>
                                            )}
                                        </td>
                                    )}
                            </tr>
                            <tr className={!showMoreConfigs[item.id] ? 'hidden' : ''}>
                                <td />
                                <td colSpan={10} style={{ borderLeft: 'solid 1px red' }}>
                                    <ListItems
                                        items={item.order_items}
                                        orderId={item.order_number}
                                    />
                                </td>
                            </tr>
                        </Fragment>
                    ))}
                </DataTable>
            </>
            <CancelConfirmation />
            <ShippedConfirmation />
            <a
                href={achiveName}
                className="hidden"
                target="_blank"
                download
                ref={achiveRefname}
                rel="noreferrer">
                Download achive
            </a>
        </div>
    );
};

export default ListOrders;
