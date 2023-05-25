import { useTranslations } from 'next-intl';
import React from 'react';
import Link from 'next/link';

function Features() {
    const t = useTranslations();

    return (
        <>
            <div className="flex lg:mt-[50px]">
                <div className="w-full">
                    <div className="dotted-bg md:flex">
                        <div className="header-t-block">
                            <h1 className="page-heading text-left">{t('Key Features')}</h1>
                            <span className="block text-gray-350 text-[36px] leading-[44px] font-bold mt-[16px]">
                                {t('title_feature')}
                            </span>
                            <span className="mb-[15px] mt-[24px] text-[14px] leading-[24px] block text-gray-350 md:text-[30px] md:leading-[38px] mdd:mt-[48px]">
                                {t('text_features')}
                            </span>
                            <div className="mt-[40px]">
                                <Link href={'/auth/signup'}>
                                    <button className="sm:pl-0.5 sm:pr-0.5 w-[60%] md:w-auto gradient-btn max-h-[40px] pt-[7px]">
                                        <span className="inline-block">{t('Try for free')}!</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="feature-photo"></div>
                    </div>
                    <div className="clear-both" />

                    <div className="dotted-bg md:flex">
                        <div className="feature-comp"></div>
                        <div className="flex flex-col">
                            <div className="flex flex-row">
                                <div className="w-1/2 lg:mr-[30px]">
                                    <h4 className="text-[24px] text-gray-350 font-bold">
                                        {t('Forget about cart abandonement')}
                                    </h4>
                                    <div className="text-blue-350 text-[16px] leading-[24px] mt-[16px]">
                                        {t('text_1')}
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <h4 className="text-[24px] text-gray-350 font-bold">
                                        {t('Customize cart expiration')}
                                    </h4>
                                    <div className="text-blue-350 text-[16px] leading-[24px] mt-[16px] mr-[20px]">
                                        {t('text_2')}
                                    </div>
                                </div>
                            </div>
                            <div className="clear-both" />
                        </div>
                    </div>

                    <div className="dotted-bg md:flex">
                        <div className="flex flex-col">
                            <div className="flex flex-row">
                                <div className="w-1/2">
                                    <h4 className="text-[24px] text-gray-350 font-bold">
                                        {t('Live Inventory management')}
                                    </h4>
                                    <div className="text-blue-350 text-[16px] leading-[24px] mt-[16px]">
                                        {t('text_3')}
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <h4 className="text-[24px] text-gray-350 font-bold">
                                        {t('Maximize the average')}
                                    </h4>
                                    <div className="text-blue-350 text-[16px] leading-[24px] mt-[16px] mr-[20px]">
                                        {t('text_4')}
                                    </div>
                                </div>
                            </div>
                            <div className="clear-both" />
                            <div className="flex flex-row mt-[40px]">
                                <div className="w-1/2">
                                    <h4 className="text-[24px] text-gray-350 font-bold">
                                        {t('Extended shipping and payment methods')}
                                    </h4>
                                    <div className="text-blue-350 text-[16px] leading-[24px] mt-[16px] mr-[20px]">
                                        {t('text_5')}
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <h4 className="text-[24px] text-gray-350 font-bold">
                                        {t('Waiting list')}
                                    </h4>
                                    <div className="text-blue-350 text-[16px] leading-[24px] mt-[16px] mr-[20px]">
                                        {t('text_6')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="feature-phone-photo xl:pl-[430px]"></div>
                    </div>

                    {/*=======================================================*/}
                    {/*====================== TRY FOR TODAY ==================*/}
                    {/*=======================================================*/}
                    <div className="clear-both" />
                    <h3 className="red-yellow-gradient-text mt-[30px] font-bold text-[24px] leading-[32px] md:text-[60px] md:leading-[72px] text-center md:mt-[80px]">
                        {t('Try it for free today!')}
                    </h3>
                    <h4 className="text-gray-350 leading-[38px] text-[30px] w-full text-center font-medium mt-[24px]">
                        {t('It only takes 30 seconds to get started')}.
                    </h4>
                    <div className="w-full mt-[40px] text-center mb-[100px]">
                        <Link href={'/'}>
                            <a className="btn-big md:mr-[20px] block mb-[10px] md:mb-auto md:inline-block  lg:mr-[84px]">
                                <span className="text-[20px] inline-block min-w-[220px]">
                                    {t('Register now!')}
                                </span>
                            </a>
                        </Link>
                        <Link href={'/'}>
                            <a className="btn-big md:ml-[20px] block md:inline-block lg:ml-[84px]">
                                <span className="text-[20px] inline-block min-w-[220px]">
                                    {t('I want to know more!')}
                                </span>
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Features;
