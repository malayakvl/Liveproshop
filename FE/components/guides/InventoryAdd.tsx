import Image from 'next/image';
import React from 'react';
import { useTranslations } from 'next-intl';

// interface PropsContent {
//     locale: string;
// }
const InventoryAdd: React.FC = () => {
    const t = useTranslations();

    return (
        <>
            <h2 className="dark-blue-header block mb-[10px]">{t('guide_head_inventory')}</h2>
            {/*How to Facebook and Livesession*/}
            <span className="text-gray-350 text-[16px] leading-[24px] md:text-[20px] md:leading-[30px] font-medium">
                {t(`guide_prod_1`)}
            </span>
            <div className="my-12 mb-[30px] md:mb-[96px]">
                <Image src="/images/guides/add-prod-pic-1.svg" width={795} height={147} />
            </div>
            <div className="text-gray-350 block text-[16px] leading-[24px] mb-[40px] md:text-[20px] md:leading-[30px] md:mb-[60px] font-medium">
                {t(`guide_prod_2`)}
            </div>
            <h2 className="dark-blue-header block mb-[10px]">{t('guide_head_creation')}</h2>
            <div className="font-medium">
                <span className="text-[16px] leading-[24px] md:text-[20px] text-gray-350 block mb-[15px]">
                    {t('There are two types of the product:')}
                </span>
                <ul className="text-[16px] leading-[24px] md:text-[20px] text-gray-350 list-disc ml-[15px]">
                    <li>{t('simple')}</li>
                    <li>{t('configured')}</li>
                </ul>
            </div>
            <h3 className="text-gray-350 block mb-[10px] text-[24px] mt-[30px] font-bold">
                {t('Simple product')}
            </h3>
            <div className="text-[16px] leading-[24px] md:text-[20px] text-gray-350 max-w-[800px] font-medium">
                <p className="block mb-[15px]">
                    {t('A simple product may have only one colour and size.')}
                </p>
                <p>{t('inorder_text')}</p>
            </div>
            <div className="my-12 mb-18">
                <Image src="/images/guides/prod-pic-2.svg" width={815} height={312} />
            </div>
            <h3 className="text-gray-350 block mb-[10px] text-[24px] mt-[30px] font-bold">
                {t('Configured product')}
            </h3>
            <div className="text-[16px] leading-[24px] md:text-[20px] text-gray-350 max-w-[800px] font-medium">
                <p className="block mb-[15px]">{t('configured_text_1')}</p>
                <p>{t('configured_text_2')}</p>
            </div>
            <div className="my-12 mb-[26px]">
                <Image src="/images/guides/prod-pic-3.svg" width={815} height={312} />
            </div>
            <div className="text-[16px] leading-[24px] md:text-[20px] text-gray-350 max-w-[800px] font-medium">
                {t('configured_text_3')}
            </div>
            <div className="my-12 mb-[15px]">
                <Image src="/images/guides/prod-pic-4.svg" width={815} height={312} />
            </div>
            <div className="text-[16px] leading-[24px] md:text-[20px] text-gray-350 max-w-[800px] font-medium">
                <p className="block max-w-[800px]">{t('configured_text_5')}</p>
                <p className="block max-w-[800px] mt-[20px]">{t('configured_text_6')}</p>
            </div>
            <div className="my-12 mb-[15px]">
                <Image src="/images/guides/prod-pic-5.svg" width={815} height={312} />
            </div>
            <div className="rounded-gray-block">
                <h2 className="dark-blue-header mb-4 text-[18px]">{t('Remarque!')}</h2>
                <div className="text-base font-medium text-gray-550">{t('configured_text_6')}</div>
            </div>
            <div className="text-[16px] leading-[24px] mb-[40px] md:text-[20px] text-gray-350 max-w-[800px] font-medium mt-[20px] md:mb-[96px]">
                <p className="block max-w-[800px]">{t('configured_text_7')}</p>
            </div>
            <h3 className="text-gray-350 block mb-[10px] text-[24px] font-bold">
                {t('Publish toggle')}
            </h3>
            <div className="text-[16px] leading-[24px] md:text-[20px] text-gray-350 max-w-[800px] font-medium">
                <p className="block mb-[15px]">{t('publish_toggle_text_1')}</p>
            </div>
            <div className="my-12 mb-[15px]">
                <Image src="/images/guides/prod-pic-6.svg" width={815} height={312} />
            </div>
            <div className="text-[16px] leading-[24px] md:text-[20px] text-gray-350 max-w-[800px] font-medium">
                <p className="block max-w-[800px]">{t('publish_toggle_text_2')}</p>
            </div>
            <div className="my-12 mb-[15px]">
                <Image src="/images/guides/prod-pic-8.svg" width={815} height={312} />
            </div>
        </>
    );
};
export default InventoryAdd;
