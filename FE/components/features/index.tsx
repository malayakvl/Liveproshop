import { useTranslations } from 'next-intl';
import React from 'react';
import Link from 'next/link';
import Try from '../../components/try';

function Features() {
    const t = useTranslations();
    return (
        <>
            <div className="flex mb-[-90px] md:mb-auto mt-[50px]">
                <div className="w-full dotted-bg">
                    <div className="w-full flex">
                        <div className="md:float-left w-2/3">
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
                        <div className="feature-phone-photo flex w-1/3" />
                    </div>
                    <div className="clear-both" />
                    <div className="flex flex-col md:flex-row md:mt-[120px]">
                        <div className="w-full md:w-2/5">
                            <div className="feature-comp-new"></div>
                        </div>
                        <div className="w-full md:w-3/5">
                            <div className="flex flex-col xl:flex-row md:mb-[40px]">
                                <div className="w-full mb-[20px]">
                                    <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold md:pr-[20px]">
                                        {t('Forget about cart abandonement')}
                                    </h4>
                                    <div className="text-blue-350 text-[14px] md:text-[16px] font-medium leading-[24px] mt-[16px] lg:pr-[20px]">
                                        {t('text_1')}
                                    </div>
                                </div>
                                <div className="w-full mb-[20px]">
                                    <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold">
                                        {t('Customize cart expiration')}
                                    </h4>
                                    <div className="text-blue-350 text-[14px] md:text-[16px] font-medium leading-[24px] mt-[16px] mr-[20px]">
                                        {t('text_2')}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col xl:flex-row">
                                <div className="w-full mb-[20px]">
                                    <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold md:pr-[20px]">
                                        {t('Choose the free shipping fees threshold')}
                                    </h4>
                                    <div className="text-blue-350 text-[14px] md:text-[16px] font-medium leading-[24px] mt-[16px] lg:pr-[20px]">
                                        {t('text_7')}
                                    </div>
                                </div>
                                <div className="w-full mb-[20px]">
                                    <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold">
                                        {t('Automatic invoicing')}
                                    </h4>
                                    <div className="text-blue-350 text-[14px] md:text-[16px] font-medium leading-[24px] mt-[16px] mr-[20px]">
                                        {t('text_8')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="clear-both" />
                    <div className="flex flex-col md:flex-row second-dotted-bg">
                        <div className="w-full md:w-3/5 lg:mt-[100px]">
                            <div className="flex flex-col xl:flex-row md:mb-[40px]">
                                <div className="w-full mb-[20px]">
                                    <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold">
                                        {t('Live Inventory management')}
                                    </h4>
                                    <div className="text-blue-350 text-[14px] md:text-[16px] font-medium leading-[24px] mt-[16px] mr-[20px] lg:pr-[20px]">
                                        {t('text_3')}
                                    </div>
                                </div>
                                <div className="w-full mb-[20px]">
                                    <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold">
                                        {t('Maximize the average')}
                                    </h4>
                                    <div className="text-blue-350 text-[14px] md:text-[16px] font-medium leading-[24px] mt-[16px] mr-[20px]">
                                        {t('text_4')}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col xl:flex-row">
                                <div className="w-full mb-[20px]">
                                    <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold">
                                        {t('Extended shipping and payment methods')}
                                    </h4>
                                    <div className="text-blue-350 text-[14px] md:text-[16px] font-medium leading-[24px] mt-[16px] lg:pr-[20px]">
                                        {t('text_5')}
                                    </div>
                                </div>
                                <div className="w-full mb-[20px]">
                                    <h4 className="text-[18px] md:text-[24px] text-gray-350 font-bold">
                                        {t('Waiting list')}
                                    </h4>
                                    <div className="text-blue-350 text-[14px] md:text-[16px] font-medium leading-[24px] mt-[16px]">
                                        {t('text_6')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-2/5 lg:mt-[100px]">
                            <div className="feature-screen-photo-new"></div>
                        </div>
                    </div>
                    {/*=======================================================*/}
                    {/*====================== TRY FOR TODAY ==================*/}
                    {/*=======================================================*/}
                    <div className="md:mt-[-100px]">
                        <Try />
                    </div>
                    <div className="clear-both h-[70px] md:hidden"></div>
                </div>
            </div>
        </>
    );
}

export default Features;
