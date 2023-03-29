import React from 'react';
import { baseApiUrl } from '../../constants';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { formatCurrency } from '../../lib/functions';

const ListItems: React.FC<any> = ({ items, productId, userProfileImg }) => {
    const t = useTranslations();
    return (
        <>
            <table className="w-full">
                <thead>
                    <tr>
                        <th
                            colSpan={7}
                            style={{ borderBottom: 'solid 1px #EEF1F7' }}
                            className="pb-4">
                            <div className="text-[18px] text-bold text-gray-350">
                                {t('Shoppers in waiting for product Ref.')}{' '}
                                <span className="red-yellow-gradient-text">{productId}</span>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th className="text-left">{t('Photo')}</th>
                        <th className="text-left inventory-qty sorting_disabled" />
                        <th className="text-left inventory-price sorting_disabled">{t('Price')}</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.map((item: any, num: number) => (
                        <tr key={num}>
                            <td>
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
                                        alt=""
                                    />
                                    <span className="pl-3">{item.buyer_first_name}</span>
                                </div>
                            </td>
                            <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                            <td>{formatCurrency(item.price)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default ListItems;
