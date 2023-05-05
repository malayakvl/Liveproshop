import React, { Fragment } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { baseApiUrl } from '../../constants';
import { formatCurrency, parseTranslation } from '../../lib/functions';

const userProfileImg =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const ListOrders: React.FC<{ orders: Orders.DataItem[]; locale: string }> = ({
    orders,
    locale
}) => {
    const t = useTranslations();

    return (
        <div className="overflow-x-scroll">
            <table className="min-w-full float-table text-left">
                <thead>
                    <tr>
                        <th>{t('ID')}</th>
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
                                <td className="red-yellow-gradient-text">
                                    <Link href={`/orders/${item.order_number}`}>
                                        <a>{item.order_number}</a>
                                    </Link>
                                </td>
                                <td>
                                    <span className={item.status}>{t(item.status)}</span>
                                </td>
                                <td>{moment(item.created_at).format('DD/MM/YYYY')}</td>
                                {/*<td>{item.buyer_first_name}</td>*/}
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
                                                alt="shopper"
                                            />
                                        </div>
                                        <span className="pl-3">{item.buyer_first_name}</span>
                                    </div>
                                </td>
                                <td>
                                    {parseTranslation(item.country_json, 'name', locale)}
                                    {/*{item.flag_name && (*/}
                                    {/*    <img*/}
                                    {/*        src={`/images/flags/${item.flag_name.toLowerCase()}.svg`}*/}
                                    {/*        className="fill-current text-black"*/}
                                    {/*        alt={item.flag_name}*/}
                                    {/*    />*/}
                                    {/*)}*/}
                                </td>
                                <td style={{ minWidth: '150px' }}>
                                    <div className="text-right">
                                        {item.order_items.length}x{' '}
                                        <span className="red-yellow-gradient-text">
                                            {t('product (s)')}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="text-right">
                                        {formatCurrency(item.total_amount)}
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
