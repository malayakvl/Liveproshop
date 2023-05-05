import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
    achiveNameSelector,
    itemsCountSelector,
    paginatedItemsSelector
} from '../../redux/orders/selectors';
import { PaginationType } from '../../constants';
import { DataTable } from '../_common';
import {
    clearBase64Action,
    fetchItemsAction,
    showCancelConfirmationModalAction,
    showDateSelectorAction
} from '../../redux/orders';
import moment from 'moment';
import Image from 'next/image';
import { baseApiUrl } from '../../constants';
import { checkIdsAction, initIdsAction } from '../../redux/layouts';
import { useTranslations } from 'next-intl';
import { Filters, FilterValues, ListItems, CancelConfirmation } from './index';
import { checkedIdsSelector, paginationSelectorFactory } from '../../redux/layouts/selectors';
// import { DateRangePicker } from 'react-date-range';
// import 'react-date-range/dist/styles.css'; // main css file
// import 'react-date-range/dist/theme/default.css';
import { formatCurrency, parseTranslation } from '../../lib/functions';
import { userSelector } from '../../redux/user/selectors';
import { bulkShippingAction, bulkDownloadAction } from '../../redux/orders/actions';

const userProfileImg =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

type Props = {
    locale: string;
};

const ListOrders: React.FC<Props> = ({ locale }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const items = useSelector(paginatedItemsSelector);
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
                return dispatch(bulkShippingAction());
            } else if (status === 'cancel') {
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

    return (
        <div className="mt-7">
            <div className="flex border border-l-0 border-r-0 border-t-0 pb-5 mb-10 relative">
                <h2 className="dark-blue-header">
                    {t('Orders')}
                    <span className="text-gray-180 font-normal text-sm"> {count} items</span>
                </h2>
                <Filters
                    handleHideFilter={handleHideFilter}
                    locale={locale}
                    filterOpen={filterOpen}
                />
                <button
                    onClick={() => {
                        if (filterOpen) {
                            dispatch(showDateSelectorAction(false));
                        }
                        setFilterOpen(!filterOpen);
                    }}
                    className="absolute top-0 right-0 flex items-center text-sm border rounded-lg px-4 py-1">
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
                            {user.role_id === 2 && (
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
                            )}
                            <td style={{ width: '50px' }}>
                                <i
                                    role="presentation"
                                    className="icon-tbl-triangle cursor-pointer"
                                    style={{ marginTop: '5px' }}
                                    onClick={() => handleShowMore(item.id)}
                                />
                            </td>
                            <td className="order-number">
                                {user.role_id === 2 && (
                                    <Link href={`/orders/${item.order_number}?locale=${locale}`}>
                                        <a>{item.order_number}</a>
                                    </Link>
                                )}
                                {user.role_id === 1 && item.status === 'new' && (
                                    <Link href={`/checkout/${item.order_number}`}>
                                        <a>{item.order_number}</a>
                                    </Link>
                                )}
                                {user.role_id === 1 && item.status !== 'new' && (
                                    <Link href={`/orders/${item.order_number}`}>
                                        <a>{item.order_number}</a>
                                    </Link>
                                )}
                            </td>
                            <td className="order-status">
                                <span className={item.status}>{t(item.status)}</span>
                            </td>
                            <td className="order-date">
                                {moment(item.created_at).format('DD/MM/YYYY')}
                            </td>
                            <td>
                                <div className="flex">
                                    <div className="user-photo">
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
                                    <span className="pl-3">{item.buyer_first_name}</span>
                                </div>
                            </td>
                            <td>{parseTranslation(item.country_json, 'name', locale)}</td>
                            <td>
                                {/*{baseApiUrl + item.shipping_image}*/}
                                {item.shipping_image && (
                                    <Image
                                        src={baseApiUrl + item.shipping_image}
                                        width={36}
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
                                {item.order_items.length}x{' '}
                                <span className="red-yellow-gradient-text">product (s)</span>
                            </td>
                            <td>{formatCurrency(item.total_amount)}</td>
                        </tr>
                        <tr className={!showMoreConfigs[item.id] ? 'hidden' : ''}>
                            <td />
                            <td colSpan={10} style={{ borderLeft: 'solid 1px red' }}>
                                <ListItems items={item.order_items} orderId={item.order_number} />
                            </td>
                        </tr>
                    </Fragment>
                ))}
            </DataTable>
            <CancelConfirmation />
            <a
                href={achiveName}
                className=""
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
