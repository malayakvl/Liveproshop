import React, { Fragment } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { baseApiUrl } from '../../constants';
import moment from 'moment';
import { formatCurrency } from '../../lib/functions';
// import { ListOrdersItems } from './';

// const userProfileImg =
//     'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const ListOrders: React.FC<{ orders: Buyers.OrderDataItem[]; className?: string }> = ({
    orders,
    className
}) => {
    const t = useTranslations();

    // const [showMoreConfigs, setShowMoreConfigs] = useState<any>({});

    // const handleShowMore = (orderId: number) => {
    //     const nextCheckedItems = { ...showMoreConfigs };
    //     nextCheckedItems[orderId] = !nextCheckedItems[orderId];
    //     setShowMoreConfigs(nextCheckedItems);
    // };

    return (
        <table className={'w-11/12 float-table text-xs mx-auto ' + className}>
            <thead>
                <tr>
                    {/* <th /> */}
                    <th>
                        <i className="icon-tbl-order" />
                    </th>
                    <th>
                        <i className="icon-tbl-status" />
                    </th>
                    <th>
                        <i className="icon-tbl-date" />
                    </th>
                    {/* <th>
                        <i className="icon-tbl-users" />
                    </th>
                    <th>
                        <i className="icon-tbl-country" />
                    </th> */}
                    <th>
                        <i className="icon-tbl-sh-cart" />
                    </th>
                    <th>
                        <i className="icon-tbl-card" />
                    </th>
                    <th>{t('Products')}</th>
                    <th className="text-right">{t('Total')}</th>
                </tr>
            </thead>

            <tbody>
                {orders?.map((item) => (
                    <Fragment key={item.id}>
                        <tr>
                            {/* <td>
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
                            </td> */}
                            {/* <td style={{ width: '50px' }}>
                                <i
                                    role="presentation"
                                    className="icon-tbl-triangle cursor-pointer"
                                    style={{ marginTop: '5px' }}
                                    onClick={() => handleShowMore(item.id)}
                                />
                            </td> */}
                            <td className="order-number">
                                <Link href={`/orders/${item.order_number}`}>
                                    <a>{item.order_number}</a>
                                </Link>
                            </td>
                            <td className="order-status">
                                <span className={item.status}>{item.status}</span>
                            </td>
                            <td className="order-date">
                                {moment(item.created_at).format('DD/MM/YYYY')}
                            </td>
                            {/* <td>
                                <div className="flex">
                                    <Image
                                        src={
                                            item.buyer_photo
                                                ? baseApiUrl + item.buyer_photo
                                                : userProfileImg
                                        }
                                        width={24}
                                        height={24}
                                        className="rounded-full cursor-pointer"
                                        alt="shopper photo"
                                    />
                                    <span className="pl-3">{item.buyer_first_name}</span>
                                </div>
                            </td>
                            <td>
                                {item.flag_name && (
                                    <img
                                        src={`/images/flags/${item.flag_name.toLowerCase()}.svg`}
                                        className="fill-current text-black"
                                        alt={''}
                                    />
                                )}
                            </td> */}
                            <td>
                                {item.shipping_image && (
                                    <Image
                                        src={baseApiUrl + item.shipping_image}
                                        width={36}
                                        height={24}
                                        className=""
                                        alt="shipping"
                                    />
                                )}
                            </td>
                            <td>
                                <img
                                    src="/images/payments/maestro.svg"
                                    className="fill-current text-black"
                                    alt={'payments'}
                                />
                            </td>
                            <td className="order-date">
                                {item.order_items_count}x{' '}
                                <span className="red-yellow-gradient-text">product (s)</span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                {formatCurrency(item.total_amount)}
                            </td>
                        </tr>
                        {/* <tr className={!showMoreConfigs[item.id] ? 'hidden' : ''}>
                            <td />
                            <td colSpan={10}>
                                <ListOrdersItems items={item.order_items} />
                            </td>
                        </tr> */}
                    </Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default ListOrders;
