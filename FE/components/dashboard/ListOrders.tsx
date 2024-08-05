import React, { Fragment } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { formatCurrency, parseTranslation } from '../../lib/functions';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/user/selectors';

const ListOrders: React.FC<{ orders: Orders.DataItem[]; locale: string }> = ({
    orders,
    locale
}) => {
    const t = useTranslations();
    const user = useSelector(userSelector);

    return (
        <div className="overflow-x-scroll scroll-horizontal">
            <table className="min-w-full float-table text-left">
                <thead>
                    <tr>
                        <th>{t('ID')}</th>
                        <th />
                        <th>{t('Status')}</th>
                        <th>{t('Date')}</th>
                        <th>{t('Shoppers')}</th>
                        <th>{t('Country')}</th>
                        <th className="text-right">{t('Product')}</th>
                        <th className="text-right">{t('Total')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {orders?.map((item) => (
                        <Fragment key={item.id}>
                            <tr>
                                {/*<td className="red-yellow-gradient-text">*/}
                                {/*    <Link href={`/orders/${item.order_number}`}>*/}
                                {/*        <a>{item.order_number}</a>*/}
                                {/*    </Link>*/}
                                {/*</td>*/}
                                <td
                                    className={`${
                                        user.role_id === 2 && item.status_waiting
                                            ? ''
                                            : 'order-number'
                                    }`}>
                                    {user.role_id === 2 && !item.status_waiting && (
                                        <>
                                            <Link
                                                href={`/orders/${item.order_number}?locale=${locale}`}>
                                                <a>{item.order_number}</a>
                                            </Link>
                                        </>
                                    )}
                                    {user.role_id === 2 && item.status_waiting && (
                                        <span
                                            className="f-12 number-waiting"
                                            style={{ color: 'black !important' }}>
                                            {item.order_number}
                                        </span>
                                    )}
                                    {user.role_id === 1 && item.status === 'new' && (
                                        <>
                                            <Link href={`/checkout/${item.order_number}`}>
                                                <a>{item.order_number}</a>
                                            </Link>
                                        </>
                                    )}
                                    {user.role_id === 1 && item.status !== 'new' && (
                                        <Link href={`/orders/${item.order_number}`}>
                                            <a>{item.order_number}</a>
                                        </Link>
                                    )}
                                </td>
                                {user.role_id === 1 &&
                                    item.status === 'new' &&
                                    item.total_amount != 0 && (
                                        <td
                                            style={{
                                                paddingTop: 0,
                                                paddingBottom: 0,
                                                maxWidth: '70px'
                                            }}>
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
                                {user.role_id === 1 &&
                                    item.status !== 'new' &&
                                    item.total_amount != 0 && (
                                        <td
                                            style={{
                                                paddingTop: 0,
                                                paddingBottom: 0,
                                                maxWidth: '70px'
                                            }}
                                        />
                                    )}
                                <td>
                                    <span className={item.status}>{t(item.status)}</span>
                                </td>
                                <td>{moment(item.created_at).format('DD/MM/YYYY')}</td>
                                <td>
                                    <div className="float-left">
                                        <div className="flex flex-row">
                                            <div
                                                className="user-photo-1"
                                                style={{ marginLeft: '0' }}></div>
                                            <div className="pl-3">{item.buyer_first_name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{parseTranslation(item.country_json, 'name', locale)}</td>
                                <td style={{ minWidth: '150px' }}>
                                    <div className="text-right">
                                        {item.order_items?.length ? item.order_items?.length : 0}x{' '}
                                        <span className="red-yellow-gradient-text">
                                            {t('product (s)')}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="text-right">
                                        {formatCurrency(
                                            parseFloat(String(item.total_amount)) -
                                                parseFloat(
                                                    item.refund_amount ? item.refund_amount : 0
                                                ) +
                                                parseFloat(String(item.shipping_amount))
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListOrders;
