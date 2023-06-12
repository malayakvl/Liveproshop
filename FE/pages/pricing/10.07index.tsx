import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Router from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clientSecretSelector, userSelector } from '../../redux/user/selectors';
import { session } from 'next-auth/client';
import { showLoaderAction } from '../../redux/layouts/actions';
import { fetchFormAction, requestDemoAction } from '../../redux/paymentPlans';
import { itemsSelector } from '../../redux/paymentPlans/selectors';
import { formatCurrency, parseTranslation } from '../../lib/functions';
import FullLayout from '../../components/layout/FullLayout';
import { skipExistUserSubscriptionAction } from '../../redux/user';
import { InputText } from '../../components/_form';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

type PriceProps = {
    planId: number;
    name: string;
    price: number;
    desc: string;
    sale: number;
    buttonText: string;
    imageSrc: string;
    disabled?: boolean;
    selected: boolean;
    onClick: any;
    session: any;
};

const PriceHeading = ({
    planId,
    name,
    price,
    desc,
    sale,
    buttonText,
    imageSrc,
    disabled,
    selected
}: PriceProps) => {
    const t = useTranslations();
    const user = useSelector(userSelector);
    return (
        <div>
            <div className="w-full h-32 lg:h-[90px] relative mx-auto">
                <div className="">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img src={imageSrc} width={70} height={71} className="mx-auto" />
                </div>
            </div>
            <div className="price-plan-name">
                {name}
                {name === 'Business' && <div className="most-popular">{t('Most popular')}</div>}
            </div>
            <div className="md:h-[100px] lg:h-[45px] price-description">{desc}</div>
            <div className="flex h-[40px] text-center">
                <div className="price-plan w-[40%]">{price}</div>
                <div className="inline-block align-middle per-month">euros /month</div>
                <div className="clear-both" />
            </div>
            <div className="block h-[15px]">
                {sale > 0 && <div className="price-percent">{sale}% of sale</div>}
            </div>
            <div className="md:mx-[12px]">
                <button
                    onClick={() => {
                        if (user?.email) {
                            Router.push(`/subscription?planId=${planId}`);
                        } else {
                            Router.push(`/auth/subscription?planId=${planId}`);
                        }
                    }}
                    className={`${
                        disabled ? 'disabled-btn' : 'gradient-btn'
                    } w-full mt-7 justify-self-end`}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default function Pricing({ locale }: { locale: any }) {
    const t = useTranslations();
    const [selected, setSelected] = useState('business');
    const dispatch = useDispatch();
    const plans = useSelector(itemsSelector);
    const user = useSelector(userSelector);
    // const [showTrial, setShowTrial] = useState(true);
    const stripeClientSecret = useSelector(clientSecretSelector);

    const [success, setSuccess] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email(t('Must be a valid email')).required(t('Required field'))
    });

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
        // if (user.email) {
        //     if (user.status) {
        //         setShowTrial(false);
        //     }
        // }
    }, [user?.email]);

    useEffect(() => {
        if (stripeClientSecret) {
            Router.push(`/subscription?type=trial&planId=1`);
        }
    }, [stripeClientSecret]);

    const Tick = ({
        disabled,
        className,
        selected
    }: {
        disabled?: boolean;
        className?: string;
        selected?: boolean;
    }) => (
        <div
            className={`min-w-[4rem] lg:min-w-[14rem] lg:w-64 
            ${selected ? 'lg:border-l-2 lg:border-r-2 border-orange-450' : 'border-transparent'}
            ${className || ''}`}>
            {!disabled ? (
                <div className="w-4 h-4 lg:w-6 lg:h-6 relative mx-auto">
                    <Image src="/images/plans/tick.svg" layout="fill" />
                </div>
            ) : (
                ' '
            )}
        </div>
    );

    const parseOptionsTickOld = (data: any, selected: string, indx: number, plans: any) => {
        console.log(data);
        return (
            <div style={{ background: 'lightblue' }} className="option-row">
                Haha
            </div>
        )
        // if (data[0]) {
        //     return (
        //         <div style={{ background: 'lightblue' }} className="option-row">
        //             <div className="price-name-heading" />
        //             {data[0].values.map((_data: any) => (
        //                 <Fragment key={_data}>
        //                     <div className="option-row relative">
        //                         {_data.values[0].value && (
        //                             <div className="tick-block">
        //                                 <div className="option-tick" />
        //                             </div>
        //                         )}
        //                     </div>
        //                 </Fragment>
        //             ))}
        //         </div>
        //     );
        // } else {
        //     console.log('Plan Data', data);
        //     console.log(indx);
        //     return (
        //         <div style={{ background: 'lightblue' }} className="option-row">
        //             <div className="price-name-heading">{indx}</div>
        //         </div>
        //     )
        // }
        // const selectedIndex = selected === 'basic' ? 0 : selected === 'business' ? 1 : 2;
        // return (
        //     <>
        //         {/*{data.map((data: any) => (*/}
        //         {/*    <Fragment key={data.option.id}>*/}
        //         {/*        <div className="option-row">*/}
        //         {/*            +*/}
        //         {/*        </div>*/}
        //         {/*    </Fragment>*/}
        //         {/*))}*/}
        //     </>
        // );
    };

    const renderTickByValues = (data: any, planId: number) => {
        console.log('renderValuesTick', data);
        return (
            <>
                {data.map((_data: any) => (
                    <Fragment key={_data}>
                        <div className="option-row relative">
                            {_data.values[planId].value && (
                                <div className="tick-block">
                                    <div className="option-tick" />
                                </div>
                            )}
                        </div>
                    </Fragment>
                ))}
            </>
        );
    };

    const renderValuesTick = (data: any, key: number, planId: number) => {
        return (
            <>
                <div
                    style={{ background: 'lightblue' }}
                    className={`price-name-heading ${key > 0 ? 'price-name-heading-1 ' : ''}`}>
                    &nbsp;
                </div>
                {renderTickByValues(data, planId)}
            </>
        );
    };

    const parseOptionsTick = (data: any, selected: string, indx: number, plans: any) => {
        if (data[0]) {
            return (
                <div style={{ background: 'lightblue' }} className="option-row">
                    <div className="price-name-heading" />
                    {data[0].values.map((_data: any) => (
                        <Fragment key={_data}>
                            <div className="option-row relative">
                                {_data.values[0].value && (
                                    <div className="tick-block">
                                        <div className="option-tick" />
                                    </div>
                                )}
                            </div>
                        </Fragment>
                    ))}
                </div>
            );
        } else {
            // console.log('Plan Data', data);
            // console.log(indx);
            return (
                <div style={{ background: 'lightblue' }} className="option-row">
                    <div className="price-name-heading">{indx}</div>
                </div>
            );
        }
        // const selectedIndex = selected === 'basic' ? 0 : selected === 'business' ? 1 : 2;
        return (
            <>
                {/*{data.map((data: any) => (*/}
                {/*    <Fragment key={data.option.id}>*/}
                {/*        <div className="option-row">*/}
                {/*            +*/}
                {/*        </div>*/}
                {/*    </Fragment>*/}
                {/*))}*/}
            </>
        );
    };

    const parsePlanValues = (plans: any) => {
        const selectedIndex = selected === 'basic' ? 0 : selected === 'business' ? 1 : 2;
        return (
            <>
                {plans.map((option: any, index: number) => (
                    <Fragment key={option.plan.id}>
                        {option.value ? (
                            <Tick selected={index === selectedIndex} />
                        ) : (
                            <Tick selected={index === selectedIndex} disabled />
                        )}
                    </Fragment>
                ))}
            </>
        );
    };

    const parseOptionsNew = (data: any, locale: string) => {
        return (
            <>
                {data.map((data: any) => (
                    <Fragment key={data.option.id}>
                        <div className="option-row">
                            <div className="option-value">
                                {parseTranslation(data.option, 'name', locale)}
                            </div>
                        </div>
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

            <div className="hidden main-bg container xl:max-w-[1400px] mx-auto">
                <div className="text-center lg:mt-[40px] lg:mb-[20px]">
                    <div className="text-xs font-bold text-gray-350">{t('Pricing_And_Plans')}</div>
                    <div className="pl-[20px] pr-[20px] mb-3 font-bold text-4xl text-gray-350">
                        {t('Pricing that fits your size')}
                    </div>
                    <div className="pl-[20px] pr-[20px] text-gray-350">
                        {t('Pricing built for businesses of all sizes')}{' '}
                        <b>{t("Always know what you'll pay")}</b>
                    </div>
                </div>
            </div>

            <div className="mt-[30px] container relative mx-auto border-red-900 xl:max-w-[1400px]">
                <div className="flex">
                    <div className="w-1/2 md:w-2/3">
                        <span className="block text-16px mb-[10px] md:text-[14px] text-gray-350 font-semibold md:ml-[5px]">{t('Pricing & Plans')}</span>
                        <h1 className="page-heading md:pr-[100px]">
                            {t('Pricing that fits your size')}
                        </h1>
                        <div className="text-pricing mt-[10px]">
                            Pricing built for businesses of all sizes.
                            <span className="font-bold block mt-[5px]">
                                Always know what you’ll pay.
                            </span>
                            <span className="mt-[30px] block">
                                <Link href={'/'}>
                                    <a className="btn-big md:mr-[20px] block mb-[10px] md:mb-auto md:inline-block  lg:mr-[84px] text-center">
                                        <span className="text-[16px] inline-block min-w-[220px]">
                                            {t('Try for free!')}
                                        </span>
                                    </a>
                                </Link>
                            </span>
                        </div>
                    </div>
                    <div className="w-1/2 md:w-1/3">
                        <div className="sitting-boy" />
                    </div>
                </div>

                <div className="hidden mx-auto mt-[100px] mb-[40px]">
                    <div className="flex w-full flex-col md:flex-row">
                        {/*PLANS OPTION DESCRIPTIONS*/}
                        <div className="hidden md:w-[40%] md:block description-column">
                            <div className="block-fixed-height-heading" />
                            <Fragment>
                                {plans.values.map((values: any, key: number) => (
                                    <div key={key}>
                                        <div
                                            key={values.group}
                                            className={`price-name-heading ${
                                                key > 0 ? 'price-name-heading-1' : ''
                                            } `}>
                                            {parseTranslation(values.group, 'name', locale)}
                                        </div>
                                        {parseOptionsNew(values.values, locale)}
                                    </div>
                                ))}
                            </Fragment>
                        </div>
                        {/*FIRST PLAN OPTIONS*/}
                        <div className="md:w-[25%] non-gradiend-block">
                            <div className="block-fixed-height-heading">
                                <PriceHeading
                                    planId={1}
                                    onClick={() => setSelected('basic')}
                                    name={t('Basic')}
                                    selected={selected === 'basic'}
                                    price={49}
                                    desc={t(
                                        'Best for live retailers that are small or starting out'
                                    )}
                                    sale={0}
                                    session={session}
                                    buttonText="Select"
                                    imageSrc={'/images/plans/box.svg'}
                                />
                            </div>
                            <Fragment>
                                {plans.values.map((values: any, key: number) => (
                                    <>{renderValuesTick(values.values, key, 0)}</>
                                ))}
                            </Fragment>
                        </div>
                        {/*SECOND PLAN OPTIONS*/}
                        <div className="md:w-[25%]  gradient-block">
                            <div className="block-fixed-height-heading">
                                <PriceHeading
                                    planId={2}
                                    onClick={() => setSelected('basic')}
                                    name={t('Business')}
                                    selected={selected === 'business'}
                                    price={99}
                                    desc={t(
                                        'Best for live retailers selling more than 5,000€ monthly'
                                    )}
                                    sale={5}
                                    session={session}
                                    buttonText="Select"
                                    imageSrc={'/images/plans/store.svg'}
                                />
                            </div>
                            <Fragment>
                                {plans.values.map((values: any, key: number) => (
                                    <>{renderValuesTick(values.values, key, 1)}</>
                                ))}
                            </Fragment>
                        </div>
                        {/*THIRD PLAN OPTIONS*/}
                        <div className="md:w-[25%] non-gradiend-block">
                            <div className="block-fixed-height-heading">
                                <PriceHeading
                                    planId={3}
                                    onClick={() => setSelected('platinum')}
                                    name={t('Platinum')}
                                    selected={selected === 'basic'}
                                    price={139}
                                    desc={t('Best for retailers with sales over 50,000€ monthly')}
                                    sale={0}
                                    session={session}
                                    buttonText="Select"
                                    imageSrc={'/images/plans/bag.svg'}
                                />
                            </div>
                            <Fragment>
                                {plans.values.map((values: any, key: number) => (
                                    <>{renderValuesTick(values.values, key, 2)}</>
                                ))}
                            </Fragment>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-gray-350 container mx-auto border-red-900">
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

                {success ? (
                    <div className="mt-8 mb-16 font-bold text-2xl text-center text-green-500 hidden">
                        {t('Your request has been sent')}
                    </div>
                ) : (
                    <Formik
                        initialValues={{}}
                        validationSchema={validationSchema}
                        onSubmit={handlerSubmit}>
                        {(props) => (
                            <Form className="flex flex-wrap justify-center align-middle lg:flex-nowrap lg:max-w-2xl mt-8 mb-16 mx-auto hidden">
                                <InputText
                                    style={'h-14 text-lg w-full'}
                                    icon={'f-email'}
                                    label={null}
                                    name={'email'}
                                    placeholder={t('holder_email')}
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
            // session,
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}

Pricing.Layout = FullLayout;
