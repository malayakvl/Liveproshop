import { useTranslations } from 'next-intl';
import React from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setModalCalendlyMetaAction } from '../../redux/layouts';

function Testimonials() {
    const t = useTranslations();
    const dispatch = useDispatch();
    return (
        <>
            <div className="flex">
                <div className="w-full">
                    <div className="dotted-bg md:flex">
                        <div className="header-t-block">
                            <span className="text-gray-350 text-[16px] font-bold md:text-[14px]">
                                {t('Customer stories')}
                            </span>
                            <h1 className="page-heading text-[28px] md:text-[58px] text-left">
                                Sabrina
                            </h1>
                            <span className="block text-gray-350 text-[16px] mt-[0px] md:text-[36px] leading-[44px] font-bold md:mt-[16px]">
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a
                                    href="https://www.facebook.com/LALYLOOKBOUTIQUE"
                                    target="_blank"
                                    rel="noreferrer">
                                    Lalylook Boutique
                                </a>
                            </span>
                            <span className="mb-[15px] mt-[24px] text-[14px] leading-[24px] block text-gray-350 md:text-[30px] md:leading-[38px] mdd:mt-[48px]">
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
                            <div className="gray-message">{t('testima_1')}</div>
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
                            <div className="gray-message">{t('testima_2')}</div>
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
                            <div className="gray-message">{t('testima_3')}</div>
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
                            <div className="gray-message">{t('testima_4')}</div>
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
                            <div className="gray-message">!{t('testima_5')}</div>
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
                            <div className="gray-message">{t('testima_6')}</div>
                            <div className="">
                                <div className="big-girl-profile small-profile"></div>
                            </div>
                        </div>
                    </div>

                    {/*=======================================================*/}
                    {/*====================== TRY FOR TODAY ==================*/}
                    {/*=======================================================*/}
                    <div className="clear-both" />
                    <h3 className="red-yellow-gradient-text mt-[30px] font-bold text-[28px] leading-[32px] md:text-[48px] md:leading-[72px] text-center md:mt-[50px]">
                        {t('Try it for free today!')}
                    </h3>
                    <h4 className="text-gray-350 mt-[10px] text-[14px] leading-[38px] md:text-[30px] w-full text-center font-medium md:mt-[0px]">
                        {t('It only takes 30 seconds to get started')}.
                    </h4>
                    <div className="w-full mt-[20px] md:mt-[40px] text-center mb-[100px]">
                        <Link href={'/auth/signup'}>
                            <a className="btn-big md:mr-[20px] block mb-[15px] md:mb-auto md:inline-block  lg:mr-[84px]">
                                <span className="text-[20px] inline-block min-w-[220px]">
                                    {t('Register now!')}
                                </span>
                            </a>
                        </Link>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                        <div
                            className="md:inline-block cursor-pointer"
                            onClick={() => {
                                dispatch(setModalCalendlyMetaAction(true));
                            }}>
                            <a className="btn-big md:ml-[20px] block md:inline-block lg:ml-[84px]">
                                <span className="text-[20px] inline-block min-w-[220px]">
                                    {t('I want to know more!')}
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Testimonials;
