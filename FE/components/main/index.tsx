import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useState } from 'react';
import _ from 'lodash';
import { setModalCalendlyMetaAction } from '../../redux/layouts';
import { useDispatch } from 'react-redux';
import Try from '../try';

function Main() {
    const t = useTranslations();
    const [activeNumber, setActiveNumber] = useState(0);
    const dispatch = useDispatch();
    const changeFeedback = (num: number) => {
        setActiveNumber(num);
    };
    return (
        <>
            <div className="flex">
                <div className="w-full mt-[-20px] md:mt-auto md:w-1/2 lg:w-2/3  lg:pr-[65px] xl:pr-[125px]">
                    <span className="block mb-[20px] md:mb-auto text-gray-350">
                        {t('Welcome to')} <b>LiveProShop!</b>
                    </span>
                    <h1 className="page-heading">
                        {t(
                            'Reclaim your free time and boost your sales by +300% by automating your process!'
                        )}
                    </h1>
                    <span className="block mt-[20px] text-[14px] leading-[24px] text-gray-350 lg:text-[20px] lg:leading-[30px]">
                        {t('descr_recalm')}
                    </span>
                    <span className="text-[14px] leading-[22px] mt-[20px] lg:mt-[40px] block text-gray-350 lg:text-[20px] lg:leading-[30px]">
                        <b>{t('100+ people')}</b>{' '}
                        <span className="text-blue-350">
                            {t('started a free trial in the last 30 days')}
                        </span>
                    </span>
                    {/*<span className="text-[25px] mt-[30px] lg:mt-[50px] lg:text-[30px] font-medium block lg:mt-[60px] xl:mt-[90px] text-gray-350">*/}
                    <span className="text-[20px] mt-[30px] block lg:mt-[60px] md:text-[30px] xl:mt-[60px] text-gray-350 font-bold">
                        {t('It only takes 30 seconds to get started')}
                    </span>
                    <div className="mt-[20px] lg:mt-[28px] flex flex-col md:flex-row">
                        <Link href={'/auth/signup'}>
                            <a className="mb-[20px] md:mb-0 btn-big text-center md:inline-block">
                                <span className="text-[16px] md:text-[20px]">
                                    {t('Register for free')}
                                </span>
                            </a>
                        </Link>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                        <a
                            onClick={() => {
                                dispatch(setModalCalendlyMetaAction(true));
                            }}
                            className="cursor-pointer btn-big text-center md:inline-block md:ml-[75px]">
                            <span className="text-[16px] md:text-[20px]">
                                {t('Request a seles call')}
                            </span>
                        </a>
                    </div>
                </div>
                <div className="sm:hidden md:w-1/2 lg:w-1/3 md:inline-block">
                    <div className="relative">
                        <div className="msg-block"></div>
                        <div className="sitting-girl-block"></div>
                    </div>
                </div>
            </div>
            <div className="mt-[50px] md:flex lg:mt-[180px] xl:mt-[200px]">
                <div className="w-full md:w-1/3 lg:w-1/2 xl:w-1/2">
                    <div className="screen-example"></div>
                </div>
                <div className="w-full md:w-2/3 xl:w-1/2">
                    <span className="text-[14px] font-bold text-blue-350 lg:ml-[-55px]">
                        {t('Quick features view')}
                    </span>
                    <div className="md:pr-[135px] xl:pr-[220px] 2xl:pr-[280px] 2xl::pr-0 hand-big-bg lg:ml-[-55px]">
                        <h1 className="red-yellow-gradient-text text-[24px] leading-[32px] font-bold md:text-[48px] lg:text-[60px] main-hand-sub-1">
                            {t('Make order placement smoother')}
                        </h1>
                        <span className="text-blue-350 text-[16px] mt-[20px] mb-[20px] md:mb-auto block md:text-[18px] bg-none md:mt-[40px] font-medium main-hand-sub-2">
                            {t('place_order_descr')}
                        </span>
                        <div className="clear-both" />
                        <Link href={'/features'}>
                            <button className="white-shadow main-white-shadow w-full mt-[15px] md:mt-[28px] lg:mt-[43px] md:w-auto disabled-btn">
                                <span className="see-full-link-med-first inline-block">
                                    {t('See full list of features')}
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid gap-[32px] sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3  mt-[80px]">
                <div className="">
                    <Link href={'/features'}>
                        <div className="shadowed-block-tip tip tip-1 cursor-pointer">
                            <div className="pl-[75px] md:pl-[90px]">
                                <h4 className="text-gray-350 text-[16px] lg:text-[24px] font-bold">
                                    {t('tip_caption_1')}
                                </h4>
                                <span className="block mt-[10px] text-[14px] text-blue-350 leading-[24px] md:text-[16px]">
                                    {t('tips_1')}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="">
                    <Link href={'/features'}>
                        <div className="shadowed-block-tip tip tip-2 cursor-pointer">
                            <div className="pl-[75px] md:pl-[90px]">
                                <h4 className="text-gray-350 text-[16px] lg:text-[24px] font-bold">
                                    {t('tip_caption_2')}
                                </h4>
                                <span className="block mt-[10px] text-[14px] text-blue-350 leading-[24px] md:text-[16px]">
                                    {t('tips_2')}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="">
                    <Link href={'/features'}>
                        <div className="shadowed-block-tip tip tip-3 cursor-pointer">
                            <div className="pl-[75px] md:pl-[90px]">
                                <h4 className="text-gray-350 text-[16px] lg:text-[24px] font-bold">
                                    {t('tip_caption_3')}
                                </h4>
                                <span className="block mt-[10px] text-[14px] text-blue-350 leading-[24px] md:text-[16px]">
                                    {t('tips_3')}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="">
                    <Link href={'/features'}>
                        <div className="shadowed-block-tip tip tip-4 cursor-pointer">
                            <div className="pl-[75px] md:pl-[90px]">
                                <h4 className="text-gray-350 text-[16px] lg:text-[24px] font-bold">
                                    {t('tip_caption_4')}
                                </h4>
                                <span className="block mt-[10px] text-[14px] text-blue-350 leading-[24px] md:text-[16px]">
                                    {t('tips_4')}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="">
                    <Link href={'/features'}>
                        <div className="shadowed-block-tip tip tip-5 cursor-pointer">
                            <div className="pl-[75px] md:pl-[90px]">
                                <h4 className="text-gray-350 text-[16px] lg:text-[24px] font-bold">
                                    {t('tip_caption_5')}
                                </h4>
                                <span className="block mt-[10px] text-[14px] text-blue-350 leading-[24px] md:text-[16px]">
                                    {t('tips_5')}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="">
                    <Link href={'/features'}>
                        <div className="shadowed-block-tip tip tip-6 cursor-pointer">
                            <div className="pl-[75px] md:pl-[90px]">
                                <h4 className="text-gray-350 text-[16px] lg:text-[24px] font-bold">
                                    {t('tip_caption_6')}
                                </h4>
                                <span className="block mt-[10px] text-[14px] text-blue-350 leading-[24px] md:text-[16px]">
                                    {t('tips_6')}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="">
                    <Link href={'/features'}>
                        <div className="shadowed-block-tip tip tip-7 cursor-pointer">
                            <div className="pl-[75px] md:pl-[90px]">
                                <h4 className="text-gray-350 text-[16px] lg:text-[24px] font-bold">
                                    {t('tip_caption_7')}
                                </h4>
                                <span className="block mt-[10px] text-[14px] text-blue-350 leading-[24px] md:text-[16px]">
                                    {t('tips_7')}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="">
                    <Link href={'/features'}>
                        <div className="shadowed-block-tip tip tip-8 cursor-pointer">
                            <div className="pl-[75px] md:pl-[90px]">
                                <h4 className="text-gray-350 text-[16px] lg:text-[24px] font-bold">
                                    {t('tip_caption_8')}
                                </h4>
                                <span className="block mt-[10px] text-[14px] text-blue-350 leading-[24px] md:text-[16px]">
                                    {t('tips_8')}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="">
                    <div className="no-shadowed-block-tip tip p-0">
                        <div className="pl-[0px] xl:mt-[17%] text-center">
                            <Link href={'/features'}>
                                <button className="white-shadow md:w-auto disabled-btn min-h-[75px] md:min-h-[60px] bg-white min-w-[300px] lg:mt-[50px] lg:ml-0 lg:w-full">
                                    <a className="text-[18px] text-gray-50 see-full-link-1">
                                        <span className="see-full-link-med inline-block">
                                            {t('See full list of features')}
                                        </span>
                                    </a>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <span className="mt-[120px] block text-[14px] md:max-w-[90px] bordered text-blue-350 bg-none md:mt-[140px]  font-bold text-center">
                {t('Advantages')}
            </span>
            <h3 className="red-yellow-gradient-text text-[24px] leading-[32px] md:text-[60px] font-bold md:leading-[72px] mt-[0px]  mb-[60px] text-center w-full">
                {t('platform_advantage')}
            </h3>

            <div className="grid gap-[32px] sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-3  mt-[80px]">
                <div className="text-center d-tip-1">
                    <h5 className="text-[20px] w-full text-center font-bold text-gray-350 md:text-[24px]">
                        {t('increase_sales')}
                    </h5>
                    <span className="text-sm text-blue-350 text-center mt-3 block pl-[30px] pr-[30px] md:text-base md:pl-[10px] md:pr-[10px]">
                        {t('increase_sales_descr')}
                    </span>
                </div>

                <div className="text-center d-tip-2">
                    <h5 className="text-[20px] w-full text-center font-bold text-gray-350 md:text-[24px]">
                        {t('save_up')}
                    </h5>
                    <span className="text-sm text-blue-350 text-center mt-3 block pl-[30px] pr-[30px] md:text-base md:pl-[10px] md:pr-[10px]">
                        {t('save_up_descr')}
                    </span>
                </div>

                <div className="text-center d-tip-3">
                    <h5 className="text-[20px] w-full text-center font-bold text-gray-350 md:text-[24px]">
                        {t('dedicate_cap')}
                    </h5>
                    <span className="text-sm text-blue-350 text-center mt-3 block pl-[30px] pr-[30px] md:text-base md:pl-[10px] md:pr-[10px]">
                        {t('dedicate_cap_descr')}
                    </span>
                </div>
            </div>

            {/*=======================================================*/}
            {/*=================== ROCKET BLOCK ======================*/}
            {/*=======================================================*/}
            <div className="main-big-round-white mt-[80px] lg:mt-[160px] p-[40px] bg-white rocked-lady">
                <div className="icon-social-block-content">
                    <span className="font-bold text-blue-350 text-[14px]">{t('Integration')}</span>
                    <h2 className="red-yellow-gradient-text font-bold text-[24px] leading-[32px] md:text-[60px] md:leading-[72px] md:mt-[10px]">
                        {t('best_caption')}
                    </h2>
                    <span className="text-[16px] leading-[24px] block mt-[20px] text-blue-350 font-medium md:max-w-[640px] text-sys">
                        {t('best_descr')}
                    </span>
                    <div className="grid gap-[36px] grid-cols-2 xl:grid-cols-8 mt-[40px]">
                        <div className="mx-auto min-w-[95px]">
                            <span className="icon-socail-line icon-facebook block" />
                            <span className="block text-[14px] md:max-w-[90px] bordered md:text-[13px] text-gray-350 text-center xl:whitespace-nowrap mt-[14px] font-bold">
                                Facebook
                            </span>
                        </div>
                        <div className="mx-auto min-w-[95px]">
                            <span className="icon-socail-line icon-insta block" />
                            <span className="social-caption-main">Instagram</span>
                        </div>
                        <div className="mx-auto min-w-[95px]">
                            <span className="icon-socail-line icon-fb-mess block" />
                            <span className="social-caption-main">Messenger</span>
                        </div>
                        <div className="mx-auto min-w-[95px]">
                            <span className="icon-socail-line icon-multisafe block" />
                            <span className="social-caption-main">Multisafe Pay</span>
                        </div>
                        <div className="mx-auto min-w-[95px]">
                            <span className="icon-socail-line icon-shopify block" />
                            <span className="social-caption-main">Shopify</span>
                        </div>
                        <div className="mx-auto min-w-[95px]">
                            <span className="icon-socail-line icon-presta block" />
                            <span className="social-caption-main">Prestashop</span>
                        </div>
                        <div className="mx-auto min-w-[95px]">
                            <span className="icon-socail-line icon-stripe block" />
                            <span className="social-caption-main">Stripe</span>
                        </div>
                        <div className="mx-auto min-w-[95px]">
                            <span className="icon-socail-line icon-paypal block" />
                            <span className="social-caption-main">Paypal</span>
                        </div>
                    </div>
                </div>
            </div>

            {/*=======================================================*/}
            {/*=================== CUSTOMER STORIES ==================*/}
            {/*=======================================================*/}
            <span className="w-full text-center block font-bold text-blue-350 text-[14px]">
                {t('Customer stories')}
            </span>
            <h3 className="red-yellow-gradient-text font-bold text-[24px] leading-[32px] md:text-[60px] md:leading-[72px] text-center">
                {t('you_to_client')}
            </h3>
            <span className="text-blue-350 text-[16px] text-center block w-full mt-[15px]">
                {t('text_rocket_sub')}
            </span>

            <div className="mt-[40px] w-full block">
                <div className="thumb float-left"></div>
                <div className="lg:float-left">
                    {_.times(3, (i) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                        <div
                            key={i}
                            className={`testimon-block user-1 ${i == activeNumber ? 'active' : ''}`}
                            onClick={() => changeFeedback(i)}>
                            <div className={`photo photo-${i + 1}`}></div>
                            <div className="user-info">
                                <span className="user-name">{t(`arrayOfObjects.${i}.person`)}</span>
                                <span className="text">{t(`arrayOfObjects.${i}.boutique`)}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="testim-descript">
                    {_.times(3, (i) => (
                        <div className={` ${i == activeNumber ? '' : 'hidden'}`} key={i}>
                            <div className="header">{t(`arrayOfObjects.${i}.title`)}</div>
                            <div className="raiting"></div>
                            <div
                                className="descr"
                                dangerouslySetInnerHTML={{
                                    __html: t(`arrayOfObjects.${i}.text`)
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/*=======================================================*/}
            {/*====================== TRY FOR TODAY ==================*/}
            {/*=======================================================*/}
            <Try />
        </>
    );
}

export default Main;
