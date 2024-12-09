// import { useTranslations } from 'next-intl';
import Image from 'next/image';
import moment from 'moment';
import { baseApiUrl } from '../../constants';
import { formatCurrency } from '../../lib/functions';
import { useTranslations } from 'next-intl';
import React from 'react';

const userProfileImg =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const TransactionDetailsPanel: React.FC<{ item: Payments.DataItemDetailed }> = ({ item }) => {
    const t = useTranslations();
    return (
        <div className="flex flex-col min-w-[35rem] min-h-max mb-4 font-bold text-gray-350 text-lg p-6 rounded-md shadow-inner bg-gray-100 w-full xl:w-auto">
            <div className="text-gray-350 flex justify-between">
                <div className=" text-1xl">
                    {t('Date')}
                    <span className="ml-4 font-normal text-blue-400">
                        {moment(item?.created_at).format('DD/MM/YYYY')}
                    </span>
                </div>
                <div className="mt-3 text-xs text-green-400 bg-green-100 border border-green-400 rounded-lg py-0 px-2">
                    {t('payed')}
                </div>
            </div>

            <div className="text-gray-350 text-4xl flex justify-between min-w-max">
                ID # {item?.order_number}
                <span className="ml-14">{formatCurrency(item?.total_amount)}</span>
            </div>

            <div className="flex my-7 min-w-max">
                <div className="relative w-20 h-20">
                    <Image
                        className="rounded-full"
                        layout="fill"
                        src={item?.buyer_photo ? baseApiUrl + item.buyer_photo : userProfileImg}
                    />
                </div>
                <div className="ml-7 pt-4">
                    <div>{item?.buyer_first_name}</div>
                    {/* <div className="font-normal text-sm mt-1">Screen Name</div> */}
                    <div className="font-medium text-xs text-orange-450">{item?.buyer_email}</div>
                </div>
            </div>

            <div className="flex w-full text-center">
                <div className="w-16">
                    <Image width="14" height="12" src={'/images/icon-tbl-card.svg'} />
                </div>
                <div className="w-16">
                    <Image width="14" height="12" src={'/images/icon-shipping.svg'} />
                </div>
                <div className="w-16 mr-6">
                    <Image width="14" height="12" src={'/images/icon-tbl-country.svg'} />
                </div>
                <div>
                    <Image width="10" height="12" src={'/images/icon-tbl-location.svg'} />
                </div>
            </div>
            <div className="flex w-full text-center">
                <div className="w-16">
                    {item?.payment_method && (
                        <div
                            className={`pyment-method-icon ${item.payment_method.toLowerCase()}`}></div>
                    )}
                </div>
                <div className="w-16">
                    <Image
                        width="24"
                        height="24"
                        src={
                            item?.shipping_image
                                ? baseApiUrl + item.shipping_image
                                : '/images/deliveries/dhl.svg'
                        }
                    />
                </div>
                <div className="w-16 mr-6">{item?.flag_name}</div>
                <div className="text-[12px]">{item?.shipping_address}</div>
            </div>
        </div>
    );
};

export default TransactionDetailsPanel;
