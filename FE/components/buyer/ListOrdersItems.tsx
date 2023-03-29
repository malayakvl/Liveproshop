import React from 'react';
import { baseApiUrl } from '../../constants';
import { BanIcon } from '@heroicons/react/solid';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '../../lib/functions';

const ListItems: React.FC<any> = ({ items }) => {
    const t = useTranslations();
    return (
        <>
            <table className="w-full">
                <thead>
                    {/* <tr>
                        <th
                            colSpan={6}
                            style={{ borderBottom: 'solid 1px #EEF1F7' }}
                            className="pb-4">
                            <div className="text-[18px] text-bold text-gray-350">
                                Products in order{' '}
                                <span className="red-yellow-gradient-text">{orderId}</span>
                            </div>
                        </th>
                    </tr> */}
                    <tr>
                        <th className="text-left">{t('Photo')}</th>
                        <th className="text-left">{t('Reference | Name | Description')}</th>
                        <th className="text-left inventory-color sorting_disabled" />
                        <th className="text-left inventory-size sorting_disabled" />
                        <th className="text-left inventory-qty sorting_disabled" />
                        <th className="text-left inventory-price sorting_disabled">{t('Price')}</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.map((item: any, num: number) => (
                        <tr key={num}>
                            <td style={{ width: '150px' }}>
                                {item.previewphoto && (
                                    <img
                                        src={
                                            /(http(s?)):\/\//i.test(item.previewphoto)
                                                ? item.previewphoto
                                                : `${baseApiUrl}/${item.previewphoto}`
                                        }
                                        alt=""
                                        className="object-scale-down h-[95px] w-[85px] rounded-lg border p-1.5"
                                    />
                                )}
                                {!item.previewphoto && (
                                    <div className="border rounded-lg w-[85px] h-[95px] block flex items-center text-center">
                                        <BanIcon
                                            width={30}
                                            height={30}
                                            className="m-auto text-gray-200"
                                        />
                                    </div>
                                )}
                            </td>
                            <td>
                                <span className="text-gray-180 text-sm">Ref.</span>{' '}
                                <span className="text-blue-350">{item.product_id}</span> <br />
                                <span className="text-[18px] red-yellow-gradient-text">
                                    {item.name}
                                </span>
                                <br />
                                {item.description && (
                                    <div
                                        className="text-blue-350 mt-4 block font-normal text-sm"
                                        dangerouslySetInnerHTML={{
                                            __html: `${item.description.substring(0, 250)} ...`
                                        }}
                                    />
                                )}
                            </td>
                            <td>
                                <div
                                    className="rounded-full w-3 h-3 inline-block mr-1"
                                    style={{
                                        backgroundColor: `${item.color_code}`
                                    }}
                                />
                            </td>
                            <td className="whitespace-nowrap">{item.size_name}</td>
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
