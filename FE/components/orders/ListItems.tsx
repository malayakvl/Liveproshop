import React from 'react';
import { baseApiUrl } from '../../constants';
import { BanIcon } from '@heroicons/react/solid';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '../../lib/functions';
import moment from 'moment';
import { OrderCounter } from '../liveorders';

const ListItems: React.FC<any> = ({ items, orderId, status, expireAt }) => {
    const t = useTranslations();

    console.log(expireAt);
    return (
        <>
            <div className="md:hidden mt-[20px] flex">
                {items?.map((item: any, num: number) => (
                    <>
                        <div className="pt-[5px]">
                            {item.previewphoto && (
                                <img
                                    src={
                                        /(http(s?)):\/\//i.test(item.previewphoto)
                                            ? item.previewphoto
                                            : `${baseApiUrl}${item.previewphoto}`
                                    }
                                    alt=""
                                    className="product-photo tbl-product-photo"
                                />
                            )}
                            {!item.previewphoto && (
                                <div className="border rounded-lg w-[95px] h-[100px] flex items-center text-center">
                                    <BanIcon
                                        width={30}
                                        height={30}
                                        className="m-auto text-gray-200"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="ml-4">
                            <span className="text-gray-180 text-sm text-[14px]">Ref.</span>{' '}
                            <span className="text-blue-350 font-bold text-[16px]">
                                {item.product_id}
                            </span>{' '}
                            <br />
                            <span className="text-[16px] red-yellow-gradient-text font-bold">
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
                            <table className="w-full order-item-tbl">
                                <thead>
                                    <tr>
                                        <th className="text-left inventory-color sorting_disabled" />
                                        <th className="text-left inventory-size sorting_disabled" />
                                        <th className="text-left inventory-qty sorting_disabled" />
                                        <th className="text-left inventory-price pt-[10px] text-[14px] color-blue-350 font-bold">
                                            {t('Price')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
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
                                </tbody>
                            </table>
                        </div>
                    </>
                ))}
            </div>
            <div className="hidden md:inline-block ">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th
                                colSpan={6}
                                style={{ borderBottom: 'solid 1px #EEF1F7' }}
                                className="pb-4">
                                <div className="text-[18px] text-bold text-gray-350">
                                    <div className="float-left">
                                        {t('Products in order')}&nbsp;
                                        <span className="red-yellow-gradient-text">{orderId}</span>
                                        {/*{moment(expireAt).add(-3, 'hours').format('HH:mm:ss')}*/}
                                    </div>
                                    {status == 'new' && (
                                        <OrderCounter
                                            endDate={
                                                expireAt
                                                    ? moment(expireAt).add(0, 'hours')
                                                    : moment()
                                            }
                                        />
                                    )}
                                </div>
                            </th>
                        </tr>
                        <tr>
                            <th className="text-left">{t('Photo')}</th>
                            <th className="text-left">{t('Reference | Name | Description')}</th>
                            <th className="text-left inventory-color sorting_disabled" />
                            <th className="text-left inventory-size sorting_disabled" />
                            <th className="text-left inventory-qty sorting_disabled" />
                            <th className="text-left inventory-price sorting_disabled">
                                {t('Price')}
                            </th>
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
                                            className="product-photo"
                                        />
                                    )}
                                    {!item.previewphoto && (
                                        <div className="border rounded-lg w-[85px] h-[95px] flex items-center text-center">
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
                                        className="rounded-full w-3 h-3 inline-block ml-[5px] mt-[7px]"
                                        style={{
                                            backgroundColor: `${item.color_code}`
                                        }}
                                    />
                                </td>
                                <td className="whitespace-nowrap" style={{ textAlign: 'center' }}>{item.size_name}</td>
                                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                <td>{formatCurrency(item.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListItems;
