import Head from 'next/head';
import FullLayout from '../../components/layout/FullLayout';
import React, { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { itemsSelector } from '../../redux/paymentPlans/selectors';
import { clientSecretSelector, userSelector } from '../../redux/user/selectors';
import * as Yup from 'yup';
import { showLoaderAction } from '../../redux/layouts/actions';
import { fetchFormAction, requestDemoAction } from '../../redux/paymentPlans';
import { parseTranslation } from '../../lib/functions';
import { Form, Formik } from 'formik';
import { InputText } from '../../components/_form';
import Router from 'next/router';

export default function Index({ locale }: { locale: any }) {
    const t = useTranslations();
    // const [selected, setSelected] = useState('business');
    const dispatch = useDispatch();
    const plans = useSelector(itemsSelector);
    const user = useSelector(userSelector);
    // const [showTrial, setShowTrial] = useState(true);
    const stripeClientSecret = useSelector(clientSecretSelector);

    const [success, setSuccess] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email(t('Must be a valid email')).required(t('Required field'))
    });
    const plansPrice = [49, 99, 139];

    const handlerSubmit = (values: unknown) => {
        dispatch(
            requestDemoAction({
                form: values,
                successMessage: t('Your request has been sent'),
                locale,
                callback: setSuccess
            })
        );
    };

    useEffect(() => {
        dispatch(showLoaderAction(true));
        dispatch(fetchFormAction());
    }, []);

    useEffect(() => {
        if (user.email) {
            // if (user.status) {
            //     setShowTrial(false);
            // }
        }
    }, [user?.email]);

    useEffect(() => {
        if (stripeClientSecret) {
            Router.push(`/subscription?type=trial&planId=1`);
        }
    }, [stripeClientSecret]);

    const parseOptions = (planData: any, locale: string, num: number) => {
        return (
            <>
                {planData.map((data: any) => (
                    <Fragment key={data.option.id}>
                        <li className="flex text-sm mb-1">
                            {planData[num].values[num].value ? (
                                <img
                                    src="/images/plans/check-green.svg"
                                    className="green-tips"
                                    alt=""
                                />
                            ) : (
                                <img
                                    src="/images/plans/check-gray.svg"
                                    className="green-tips"
                                    alt=""
                                />
                            )}
                            <span
                                className={`ml-3 text-left ${
                                    !planData[num].values[num].value ? 'text-gray-500' : ''
                                }`}>
                                {t(parseTranslation(data.option, 'name', locale))}
                            </span>
                        </li>
                    </Fragment>
                ))}
            </>
        );
    };

    const parsePlanValues = (num: number, locale: string) => {
        return (
            <>
                {plans.values.map((option: any, index: number) => (
                    <Fragment key={index}>
                        <span className="block font-bold mt-3 mb-2 uppercase">
                            {t(option.group.name)}
                        </span>
                        <ul className="mb-7 font-medium mt-4">
                            {parseOptions(option.values, locale, num)}
                        </ul>
                    </Fragment>
                ))}
            </>
        );
    };
    return (
        <>
            <Head>
                <title>LiveProshop - Pricing</title>
            </Head>
            <div className="main-bg container xl:max-w-[1400px] mx-auto">
                <div className="text-center lg:mt-[40px] lg:mb-[20px]">
                    <div className="text-xs font-bold">{t('Pricing_And_Plans')}</div>
                    <div className="pl-[20px] pr-[20px] mb-3 font-bold text-4xl">
                        {t('Pricing that fits your size')}
                    </div>
                    <div className="pl-[20px] pr-[20px]">
                        {t('Pricing built for businesses of all sizes')}{' '}
                        <b>{t("Always know what you'll pay")}</b>
                    </div>
                </div>
                <div className="mx-auto md:max-w-[1200px] text-center">
                    <div
                        className="mx-auto pt-10 pb-8 px-8 min-h-[200px] max-w-[72rem] flex-row"
                        style={{ maxWidth: '72rem' }}>
                        <div className="md:flex sm:flex-col justify-between items-center lg:items-start lg:flex-row">
                            {/*FIRST PLAN BLOCK*/}
                            <div className="mb-[40px] w-full left-plan flex-1 mt-8 p-8 order-2 bg-white shadow-xl rounded-3xl sm:w-96 lg:w-full lg:order-1 lg:rounded-r-none plan-basic">
                                <div className="">
                                    <div className="flex items-center">
                                        <Image
                                            src="/images/plans/box-base.svg"
                                            width={120}
                                            height={121}
                                            className="object-contain object-center plan-box-img"
                                        />
                                        <div className="ml-0">
                                            <span className="block text-2xl font-semibold text-left">
                                                {plans.header.length > 0 &&
                                                    t(plans.header[0]?.name)}
                                            </span>
                                            <span>
                                                <span className="euro-sign">&euro;</span>
                                                <span className="text-5xl font-bold rainbow-gradient-text">
                                                    {plansPrice[0]}
                                                </span>
                                            </span>
                                            <span className="font-base font-bold">
                                                / {t('month')}
                                            </span>
                                        </div>
                                    </div>
                                    {/*<div className="clear-both" />*/}
                                    <span className="text-sm mb-3 mt-2 leading-[18px] block">
                                        {t(
                                            'Best for live retailers that are small or starting out'
                                        )}
                                    </span>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a
                                        href=":;"
                                        onClick={() => {
                                            if (user?.email) {
                                                Router.push(
                                                    `/subscription?planId=${plans.header[0].id}`
                                                );
                                            } else {
                                                Router.push(
                                                    `/auth/subscription?planId=${plans.header[0].id}`
                                                );
                                            }
                                        }}
                                        className="flex justify-center items-center bg-indigo-600 rounded-xl py-6 px-4 text-center text-white text-2xl gradient-btn mt-5 mb-5">
                                        {t('Choose Plan')}
                                        <img
                                            src="https://res.cloudinary.com/williamsondesign/arrow-right.svg"
                                            className="ml-2"
                                            alt=""
                                        />
                                    </a>
                                </div>
                                {parsePlanValues(0, locale)}
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a
                                    href="javascript:;"
                                    className="flex justify-center items-center bg-indigo-600 rounded-xl py-6 px-4 text-center text-white text-2xl gradient-btn">
                                    {t('Choose Plan')}
                                    <img
                                        src="https://res.cloudinary.com/williamsondesign/arrow-right.svg"
                                        className="ml-2"
                                        alt=""
                                    />
                                </a>
                            </div>
                            {/*SECOND PLAN BLOCK*/}
                            <div
                                className="mb-[40px] w-full flex-1 p-8 order-1 shadow-xl rounded-3xl border-red-yellow-gradient
                                        bg-white sm:w-96 lg:w-full lg:order-2 lg:mt-0 border-orange-450 border-2">
                                <div className="mb-8 pb-8 flex items-center">
                                    <div>
                                        <div className="flex items-center">
                                            <Image
                                                src="/images/plans/box-business.svg"
                                                width={120}
                                                height={121}
                                                className="object-contain object-center plan-box-img"
                                            />
                                            <div className="ml-0">
                                                <span className="block text-2xl font-semibold text-left relative">
                                                    {plans.header.length > 0 &&
                                                        plans.header[1]?.name}
                                                    <span
                                                        className="top-[35px] left-[80px] p-[5px] text-[10px] border border-orange-450 rounded-lg
                                                        lg:p-1 text-orange-450 absolute lg:top-[35px] lg:left-[70px] whitespace-nowrap">
                                                        {t('Most popular')}
                                                    </span>
                                                </span>
                                                <span>
                                                    <span className="euro-sign">&euro;</span>
                                                    <span className="text-5xl font-bold rainbow-gradient-text">
                                                        {plansPrice[1]}
                                                    </span>
                                                </span>
                                                <span className="font-base font-bold">
                                                    / {t('month')}
                                                </span>
                                                <span className="sm:block text-xs font-bold text-left lg:mt-[-15px]">
                                                    5% {t('of sale')}
                                                </span>
                                            </div>
                                        </div>
                                        {/*<div className="clear-both" />*/}
                                        <span className="text-sm mb-3 mt-2 leading-[18px] block">
                                            {t(
                                                'Best for live retailers selling more than 5,000€ monthly'
                                            )}
                                        </span>
                                        <a
                                            href="#/"
                                            className="flex justify-center items-center bg-indigo-600 rounded-xl py-6 px-4 text-center text-white text-2xl gradient-btn mt-5 mb-5">
                                            {t('Choose Plan')}
                                            <img
                                                src="https://res.cloudinary.com/williamsondesign/arrow-right.svg"
                                                className="ml-2"
                                                alt=""
                                            />
                                        </a>
                                        {parsePlanValues(1, locale)}
                                    </div>
                                </div>
                                <a
                                    href="#/"
                                    className="flex justify-center items-center bg-indigo-600 rounded-xl py-6 px-4 text-center text-white text-2xl gradient-btn">
                                    {t('Choose Plan')}
                                    <img
                                        src="https://res.cloudinary.com/williamsondesign/arrow-right.svg"
                                        className="ml-2"
                                        alt=""
                                    />
                                </a>
                            </div>
                            {/*THIRD PLAN BLOCK*/}
                            <div className="mb-[40px] w-full flex-1 mt-8 p-8 order-3 bg-white shadow-xl rounded-3xl sm:w-96 lg:w-full lg:order-3 lg:rounded-l-none plan-basic">
                                <div className="flex items-center">
                                    <div>
                                        <div className="flex items-center">
                                            <Image
                                                src="/images/plans/box-platinum.svg"
                                                width={120}
                                                height={121}
                                                className="object-contain object-center plan-box-img"
                                            />
                                            <div className="ml-0">
                                                <span className="block text-2xl font-semibold text-left">
                                                    {plans.header.length > 0 &&
                                                        t(plans.header[2]?.name)}
                                                </span>
                                                <span>
                                                    <span className="euro-sign">&euro;</span>
                                                    <span className="text-5xl font-bold rainbow-gradient-text">
                                                        {plansPrice[2]}
                                                    </span>
                                                </span>
                                                <span className="font-base font-bold">
                                                    / {t('month')}
                                                </span>
                                                <span className="sm:block text-xs font-bold text-left lg:mt-[-15px]">
                                                    3% {t('of sale')}
                                                </span>
                                            </div>
                                        </div>
                                        {/*<div className="clear-both" />*/}
                                        <span className="text-sm mb-3 mt-2 leading-[18px] block">
                                            {t(
                                                'Best for live retailers selling more than 5,000€ monthly'
                                            )}
                                        </span>
                                        <a
                                            href="#/"
                                            className="flex justify-center items-center bg-indigo-600 rounded-xl py-6 px-4 text-center text-white text-2xl gradient-btn mt-5 mb-5">
                                            {t('Choose Plan')}
                                            <img
                                                src="https://res.cloudinary.com/williamsondesign/arrow-right.svg"
                                                className="ml-2"
                                                alt=""
                                            />
                                        </a>
                                        {parsePlanValues(2, locale)}
                                        <a
                                            href="#/"
                                            className="flex justify-center items-center bg-indigo-600 rounded-xl py-6 px-4 text-center text-white text-2xl gradient-btn">
                                            {t('Choose Plan')}
                                            <img
                                                src="https://res.cloudinary.com/williamsondesign/arrow-right.svg"
                                                className="ml-2"
                                                alt=""
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<div className="hidden mt-16 lg:mt-8 text-center">*/}
                {/*    <div className="text-xs font-bold">{t('Support')}</div>*/}
                {/*    <div className="mb-3 font-bold text-4xl">{t('Frequently asked questions')}</div>*/}
                {/*    <div>{t('question_before_started')}</div>*/}
                {/*</div>*/}

                {/*<div className="hidden w-full mt-12 lg:mt-16 mb-20 lg:mb-28 grid grid-cols-1 gap-x-2 gap-y-12 md:grid-cols-2 lg:gap-x-16 lg:gap-y-16 lg:grid-cols-3 ">*/}
                {/*    <div>*/}
                {/*        <div className="font-bold mb-6 text-lg">*/}
                {/*            {t('What is the differens between plans?')}*/}
                {/*        </div>*/}
                {/*        <div className="text-gray-350 text-sm">{t('tips_text_1')}</div>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <div className="font-bold mb-6 text-lg">*/}
                {/*            {t(*/}
                {/*                'Does CommentSold integrate with Shopify/How does the Shopify integration work?'*/}
                {/*            )}*/}
                {/*        </div>*/}
                {/*        <div className="text-gray-350 text-sm">{t('tips_text_2')}</div>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <div className="font-bold mb-6 text-lg">*/}
                {/*            {t('How do I cancel my account')}*/}
                {/*        </div>*/}
                {/*        <div className="text-gray-350 text-sm">{t('tips_text_3')}</div>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <div className="font-bold mb-6 text-lg">*/}
                {/*            {t('How does the free trial work?')}*/}
                {/*        </div>*/}
                {/*        <div className="text-gray-350 text-sm">{t('tips_text_4')}</div>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <div className="font-bold mb-6 text-lg">{t('Which plan should I get')}</div>*/}
                {/*        <div className="text-gray-350 text-sm">{t('tips_text_5')}</div>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <div className="font-bold mb-6 text-lg">{t('Do integrate')}</div>*/}
                {/*        <div className="text-gray-350 text-sm">{t('tips_text_6')}</div>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <div className="font-bold mb-6 text-lg">*/}
                {/*            {t('Is CommentSold available in Canada?')}*/}
                {/*        </div>*/}
                {/*        <div className="text-gray-350 text-sm">{t('tips_text_7')}</div>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <div className="font-bold mb-6 text-lg">*/}
                {/*            {t('Do you integrate with a POS system?')}*/}
                {/*        </div>*/}
                {/*        <div className="text-gray-350 text-sm">{t('tips_text_8')}</div>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <div className="font-bold mb-6 text-lg">*/}
                {/*            {t('How does the Facebook integration work?')}*/}
                {/*        </div>*/}
                {/*        <div className="text-gray-350 text-sm">{t('tips_text_9')}</div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="text-center">
                    <div className="font-bold text-5xl">{t('Try it for free today!')}</div>
                    <div className="font-semibold text-3xl">
                        {t('It only takes 30 second to get started')}
                    </div>
                </div>

                {success ? (
                    <div className="mt-8 mb-16 font-bold text-2xl text-center text-green-500">
                        {t('Your request has been sent')}
                    </div>
                ) : (
                    <Formik
                        initialValues={{}}
                        validationSchema={validationSchema}
                        onSubmit={handlerSubmit}>
                        {(props) => (
                            <Form className="flex flex-wrap justify-center align-middle lg:flex-nowrap lg:max-w-2xl mt-8 mb-16 mx-auto">
                                <InputText
                                    style={'h-14 text-lg w-full'}
                                    icon={'f-email'}
                                    label={null}
                                    name={'email'}
                                    placeholder={t('Enter Email')}
                                    props={props}
                                    tips={null}
                                />

                                <div className="mb-6 min-w-max w-full lg:w-auto ">
                                    <button className="lg:ml-5 lg:mt-0 w-full gradient-btn hover:bg-indigo-600 focus:outline-none duration-100 ease-in-out">
                                        <span className="text-lg">{t('Request a demo')}</span>
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
            </div>
        </>
    );
}
Index.Layout = FullLayout;

export async function getServerSideProps(context: any) {
    const { locale } = context;

    return {
        props: {
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`),
                ...require(`../../messages/pricing/${locale}.json`),
                ...require(`../../messages/textpricing/${locale}.json`)
            }
        }
    };
}
