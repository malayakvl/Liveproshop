import { useTranslations } from 'next-intl';
import React from 'react';
import Try from '../try';

function Testimonials() {
    const t = useTranslations();
    return (
        <>
            <div className="flex mt-[-30px]">
                <div className="w-full">
                    <div className="dotted-bg md:flex">
                        <div className="header-t-block">
                            <span className="block text-16px mb-[10px] md:text-[14px] text-gray-350 font-semibold md:ml-[5px]">
                                {t('Customer stories')}
                            </span>
                            <h1 className="text-left text-[28px] page-heading-story">Sabrina</h1>
                            <span className="block text-gray-350 text-[16px] mt-[0px] md:text-[36px] leading-[44px] font-bold md:mt-[16px]">
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a
                                    href="https://www.facebook.com/LALYLOOKBOUTIQUE"
                                    target="_blank"
                                    rel="noreferrer">
                                    Lalylook Boutique
                                </a>
                            </span>
                            <span className="mb-[15px] mt-[24px] text-[14px] leading-[24px] block text-gray-350 md:text-[30px] md:leading-[38px] md:mt-[48px]">
                                {t('testim_subtitle')}
                            </span>
                        </div>
                        <div className="user-photo"></div>
                    </div>
                    <div className="clear-both" />
                    <div className="testimonial-container">
                        <div className="flex items-end">
                            <div className="">
                                <div className="big-boy-profile"></div>
                            </div>
                            <div>
                                <div className="blue-message">
                                    <span className="hand-msg">{t('testimq_1')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end mt-10">
                            <div
                                className="gray-message"
                                dangerouslySetInnerHTML={{
                                    __html: t('testima_1')
                                }}
                            />
                            <div className="">
                                <div className="big-girl-profile"></div>
                            </div>
                        </div>

                        <div className="flex items-end mt-10">
                            <div className="">
                                <div className="big-boy-profile small-profile"></div>
                            </div>
                            <div>
                                <div className="blue-message">{t('testimq_2')}</div>
                            </div>
                        </div>
                        <div className="flex items-end mt-10">
                            <div
                                className="gray-message"
                                dangerouslySetInnerHTML={{
                                    __html: t('testima_2')
                                }}
                            />
                            <div className="">
                                <div className="big-girl-profile small-profile"></div>
                            </div>
                        </div>

                        <div className="flex items-end mt-10">
                            <div className="">
                                <div className="big-boy-profile small-profile"></div>
                            </div>
                            <div>
                                <div className="blue-message">{t('testimq_3')}</div>
                            </div>
                        </div>
                        <div className="flex items-end mt-10">
                            <div
                                className="gray-message"
                                dangerouslySetInnerHTML={{
                                    __html: t('testima_3')
                                }}
                            />
                            <div className="">
                                <div className="big-girl-profile small-profile"></div>
                            </div>
                        </div>

                        <div className="flex items-end mt-10">
                            <div className="">
                                <div className="big-boy-profile small-profile"></div>
                            </div>
                            <div>
                                <div className="blue-message">{t('testimq_4')}</div>
                            </div>
                        </div>
                        <div className="flex items-end mt-10">
                            <div
                                className="gray-message"
                                dangerouslySetInnerHTML={{
                                    __html: t('testima_4')
                                }}
                            />
                            <div className="">
                                <div className="big-girl-profile small-profile"></div>
                            </div>
                        </div>

                        <div className="flex items-end mt-10">
                            <div className="">
                                <div className="big-boy-profile small-profile"></div>
                            </div>
                            <div>
                                <div className="blue-message">{t('testimq_5')}</div>
                            </div>
                        </div>
                        <div className="flex items-end mt-10">
                            <div
                                className="gray-message"
                                dangerouslySetInnerHTML={{
                                    __html: t('testima_5')
                                }}
                            />
                            <div className="">
                                <div className="big-girl-profile small-profile"></div>
                            </div>
                        </div>

                        <div className="flex items-end mt-10">
                            <div className="">
                                <div className="big-boy-profile small-profile"></div>
                            </div>
                            <div>
                                <div className="blue-message">{t('testimq_6')}</div>
                            </div>
                        </div>
                        <div className="flex items-end mt-10">
                            <div
                                className="gray-message"
                                dangerouslySetInnerHTML={{
                                    __html: t('testima_6')
                                }}
                            />
                            <div className="">
                                <div className="big-girl-profile small-profile"></div>
                            </div>
                        </div>
                    </div>

                    {/*=======================================================*/}
                    {/*====================== TRY FOR TODAY ==================*/}
                    {/*=======================================================*/}
                    <Try />
                </div>
            </div>
        </>
    );
}

export default Testimonials;
