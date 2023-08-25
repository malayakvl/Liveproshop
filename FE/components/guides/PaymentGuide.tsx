import Image from 'next/image';
import React from 'react';
import { useTranslations } from 'next-intl';

// interface PropsContent {
//     locale: string;
// }
const PaymentGuide: React.FC = () => {
    const t = useTranslations();

    return (
        <div className="max-w-[835px]">
            <h2 className="dark-blue-header block mb-[10px]">
                {t('How to enable/disable a payment method?')}
            </h2>
            {/*How to Facebook and Livesession*/}
            <span className="text-gray-350 text-[16px] leading-[24px] md:text-[20px] md:leading-[30px] font-medium">
                {t('payment_guide_text_1')}
            </span>
            <div className="my-12 mb-[10px] text-center">
                <Image src="/images/guides/payment-pic-1.svg" width={803} height={396} />
            </div>
            <div className="rounded-gray-block">
                <h2 className="dark-blue-header mb-4 text-[18px]">{t('Remarque!')}</h2>
                <div className="text-base font-medium text-gray-550">
                    {t('payment_guide_text_2')}
                </div>
            </div>
            <h2 className="dark-blue-header block mb-[10px] mt-[86px]" id="transactions-review">
                {t('How to review transactions of your shopper?')}
            </h2>
            <span className="text-gray-350 text-[16px] leading-[24px] md:text-[20px] md:leading-[30px] font-medium">
                {t('payment_guide_text_3')}
            </span>
            <div className="my-12 mb-[10px] text-center">
                <Image src="/images/guides/payment-pic-2.svg" width={815} height={312} />
            </div>
            <span className="text-gray-350 text-[16px] leading-[24px] md:text-[20px] md:leading-[30px] font-medium">
                {t('payment_guide_text_4')}
            </span>
            <div className="my-12 mb-[10px] text-center">
                <Image src="/images/guides/payment-pic-3.svg" width={803} height={275} />
            </div>
            <div className="my-12 mb-[10px] text-center">
                <Image src="/images/guides/payment-pic-4.svg" width={803} height={524} />
            </div>
            <h2 className="dark-blue-header block mb-[10px] mt-[46px]" id="download-invoices">
                {t('How to download invoices?')}
            </h2>
            <div className="font-medium">
                <span className="text-[16px] leading-[24px] md:text-[20px] text-gray-350 block mb-[15px]">
                    {t('download_text_1')}
                </span>
                <ul className="text-[16px] leading-[24px] md:text-[20px] text-gray-350 list-disc ml-[15px]">
                    <li>{t('download_text_2')}</li>
                </ul>
            </div>
            <div className="my-12 mb-[10px] text-center">
                <Image src="/images/guides/payment-pic-5.svg" width={803} height={448} />
            </div>
            <div className="font-medium">
                <ul className="text-[16px] leading-[24px] md:text-[20px] text-gray-350 list-disc ml-[15px]">
                    <li>{t('download_text_3')}</li>
                </ul>
            </div>
            <div className="my-12 mb-[10px] text-center">
                <Image src="/images/guides/payment-pic-6.svg" width={803} height={401} />
            </div>

            <h2 className="dark-blue-header block mb-[10px] mt-[46px]" id="filter-transactions">
                {t('How to filter your transactions?')}
            </h2>
            <div className="font-medium">
                <span className="text-[16px] leading-[24px] md:text-[20px] text-gray-350 block mb-[15px]">
                    {t('filter_text_1')}
                </span>
            </div>
            <div className="my-12 mb-[10px] text-center">
                <Image src="/images/guides/payment-pic-7.svg" width={803} height={483} />
            </div>
            <div className="font-medium">
                <span className="text-[16px] leading-[24px] md:text-[20px] text-gray-350 block mb-[15px]">
                    {t('filter_text_2')}
                </span>
            </div>
            <div className="my-12 mb-[10px] text-center">
                <Image src="/images/guides/payment-pic-8.svg" width={666} height={834} />
            </div>
        </div>
    );
};
export default PaymentGuide;
