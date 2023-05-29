import { useTranslations } from 'next-intl';
import React from 'react';
import Link from 'next/link';
import Try from '../../components/try';

function Features() {
    const t = useTranslations();
    return (
        <>
            <div className="flex mb-[-90px] md:mb-auto mt-[-30px]">
                <div className="w-full dotted-bg">
                    <div>
                        <div className="md:float-left">
                            <span className="block text-16px mb-[10px] md:text-[14px] text-gray-350 font-semibold md:ml-[5px]">
                                {t('Learn more about our')}
                            </span>
                            <h1 className="page-heading-features text-left">{t('Key Features')}</h1>
                            <span className="block text-gray-350 text-16px leading-[24px] md:text-[36px] md:leading-[44px] font-bold mt-[16px] md:max-w-[675px]">
                                {t('title_feature')}
                            </span>
                            <span className="block font-medium text-gray-350 mb-[15px] mt-[14px] text-[14px] leading-[24px] md:text-[30px] md:leading-[38px] md:mt-[30px] md:max-w-[670px]">
                                {t('text_features')}
                            </span>
                            <div className="mt-[45px]">
                                <Link href={'/auth/signup'}>
                                    <button className="w-full md:w-auto btn-big md:mr-[20px] block mb-[15px] md:mb-auto md:inline-block lg:mr-[84px]">
                                        <span className="inline-block md:text-[20px]">
                                            {t('Try for free')}!
                                        </span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="feature-phone-photo" />
                    </div>
                    <div className="clear-both" />
                    <div className="mt-0 md:mt-[70px]">
                        <div className="feature-comp"></div>
                        <div>
                            <div className="flex-row md:flex md:flex-col">
                                <div className="md:flex md:flex-row">
                                    <div className="w-full mb-[30px] md:w-1/2 lg:mr-[30px]">
                                        <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold md:pr-[20px]">
                                            {t('Forget about cart abandonement')}
                                        </h4>
                                        <div className="text-blue-350 text-[16px] font-medium leading-[24px] mt-[16px]">
                                            {t('text_1')}
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold">
                                            {t('Customize cart expiration')}
                                        </h4>
                                        <div className="text-blue-350 text-[16px] font-medium leading-[24px] mt-[16px] mr-[20px]">
                                            {t('text_2')}
                                        </div>
                                    </div>
                                </div>
                                <div className="md:flex md:flex-row mt-[40px]">
                                    <div className="w-full mb-[30px] md:w-1/2 lg:mr-[30px]">
                                        <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold md:pr-[20px]">
                                            {t('Choose the free shipping fees threshold')}
                                        </h4>
                                        <div className="text-blue-350 text-[16px] font-medium leading-[24px] mt-[16px]">
                                            {t('text_7')}
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold">
                                            {t('Automatic invoicing')}
                                        </h4>
                                        <div className="text-blue-350 text-[16px] font-medium leading-[24px] mt-[16px] mr-[20px]">
                                            {t('text_8')}
                                        </div>
                                    </div>
                                </div>
                                <div className="clear-both" />
                            </div>
                        </div>
                    </div>
                    <div className="clear-both" />
                    <div className="mt-[70px] flex flex-col md:mt-[140px] md:flex-row">
                        <div className="order-2 mt-[-100px] w-full md:order-1 md:mt-[-10px] md:w-3/5">
                            {/*<div className="w-full mb-[30px] md:w-1/2 lg:mr-[30px]">*/}
                            <div className="md:flex md:flex-row mt-[40px]">
                                <div className="w-full mb-[30px] md:w-1/2 lg:mr-[30px]">
                                    <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold">
                                        {t('Live Inventory management')}
                                    </h4>
                                    <div className="text-blue-350 text-[16px] font-medium leading-[24px] mt-[16px] mr-[20px]">
                                        {t('text_3')}
                                    </div>
                                </div>
                                <div className="w-full mb-[30px] md:w-1/2 lg:mr-[30px]">
                                    <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold">
                                        {t('Maximize the average')}
                                    </h4>
                                    <div className="text-blue-350 text-[16px] font-medium leading-[24px] mt-[16px] mr-[20px]">
                                        {t('text_4')}
                                    </div>
                                </div>
                            </div>
                            <div className="md:flex md:flex-row mt-[40px]">
                                {/*<div className="flex flex-row mt-[40px]">*/}
                                <div className="w-full mb-[30px] md:w-1/2 lg:mr-[30px]">
                                    <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold">
                                        {t('Extended shipping and payment methods')}
                                    </h4>
                                    <div className="text-blue-350 text-[16px] font-medium leading-[24px] mt-[16px] mr-[20px]">
                                        {t('text_5')}
                                    </div>
                                </div>
                                <div className="w-full mb-[30px] md:w-1/2 lg:mr-[30px]">
                                    <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold">
                                        {t('Waiting list')}
                                    </h4>
                                    <div className="text-blue-350 text-[16px] font-medium leading-[24px] mt-[16px] mr-[20px]">
                                        {t('text_6')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 w-full md:order-2 md:w-2/5 feature-screen-photo"></div>
                    </div>
                    {/*=======================================================*/}
                    {/*====================== TRY FOR TODAY ==================*/}
                    {/*=======================================================*/}
                    <div className="">
                        <Try />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Features;
