import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { itemsCountSelector, paginatedItemsSelector } from '../../redux/payments/selectors';
import { PaginationType, baseApiUrl } from '../../constants';
import { DataTable } from '../_common';
import { fetchItemsAction } from '../../redux/payments';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '../../lib/functions';
import { checkIdsAction, initIdsAction } from '../../redux/layouts';
import { checkedIdsSelector } from '../../redux/layouts/selectors';
import { showCancelConfirmationModalAction } from '../../redux/orders';
import { bulkDownloadAction, bulkShippingAction } from '../../redux/orders/actions';

const userProfileImg =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const ListTransactions: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const items: Payments.DataItem[] = useSelector(paginatedItemsSelector);
    const count: number = useSelector(itemsCountSelector);
    const checkedIds = useSelector(checkedIdsSelector);

    // const [showMoreConfigs, setShowMoreConfigs] = useState<any>({});
    // const [filterOpen, setFilterOpen] = useState(false);

    const sendRequest = useCallback(() => {
        return dispatch(fetchItemsAction());
    }, [dispatch]);

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

    useEffect(() => {
        const setupChecked: any = [];
        items.forEach((item: any) => {
            setupChecked.push({ id: item.id, checked: false });
        });
        dispatch(initIdsAction(setupChecked));
    }, [items]);

    return (
        <div className="mt-7">
            <DataTable
                paginationType={PaginationType.PAYMENTS}
                totalAmount={count}
                sendStatusRequest={sendStatusRequest}
                sendRequest={sendRequest}>
                {items?.map((item) => (
                    <tr key={item.id}>
                        <td>
                            <input
                                className="float-checkbox cursor-pointer"
                                type="checkbox"
                                onChange={() => dispatch(checkIdsAction(item.id))}
                                value={item.id}
                                checked={
                                    checkedIds.find((data: any) => data.id === item.id)?.checked ||
                                    false
                                }
                            />
                        </td>
                        <td>
                            <div className="text-orange-450">{item.order_number}</div>
                        </td>
                        <td>{moment(item.created_at).format('DD/MM/YYYY')}</td>
                        {/* <td>
                            <div className="text-center text-orange-450">{item.payment_id}</div>
                        </td> */}

                        <td className="flex items-center">
                            <div className="relative w-7 h-7 mr-2">
                                <Image
                                    className="rounded-full"
                                    layout="fill"
                                    src={
                                        item.buyer_photo
                                            ? baseApiUrl + item.buyer_photo
                                            : userProfileImg
                                    }
                                />
                            </div>
                            {item.buyer_first_name}
                        </td>
                        <td className="text-center">
                            <div className="text-center">
                                <img
                                    width={46}
                                    height={32}
                                    src={`/images/payments/${
                                        item.payment_short_name || 'chargebee'
                                    }.svg`}
                                    // layout="fixed"
                                    alt={item.payment_name}
                                />
                            </div>
                        </td>
                        <td>
                            <div className="text-right">{formatCurrency(item.total_amount)}</div>
                        </td>
                        <td className="w-1">
                            <Link href={`${router.asPath}/transaction/${item.order_number}`}>
                                <a>
                                    <Image
                                        width={24}
                                        height={24}
                                        src="/images/dots.svg"
                                        layout="fixed"
                                        alt="Dots vertical"
                                    />
                                </a>
                            </Link>
                        </td>
                    </tr>
                ))}
            </DataTable>
        </div>
    );
};

export default ListTransactions;
