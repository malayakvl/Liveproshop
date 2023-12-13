import Head from 'next/head';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { fetchCheckoutAction, submitCheckoutAction } from '../../redux/checkout';
import { useDispatch, useSelector } from 'react-redux';
import { orderCheckoutSelector, redirectMerchantUrlSelector } from '../../redux/checkout/selectors';
import { ShippingAddress, ShippingMethod, OrderSummary } from '../../components/checkout';
import {
    clearOrderByCommentAction,
    redirectCheckoutAction,
    setupReturnedUrlAction
} from '../../redux/orders';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { showEmailNoticeSelector } from '../../redux/layouts/selectors';
import Link from 'next/link';
// import CardValidator from 'card-validator';

export default function Index({ session, locale }: { session: any; locale: any }) {
    if (!session) return null;
    const t = useTranslations();
    const showEmailNotice = useSelector(showEmailNoticeSelector);
    // const showEmailNotice = true;
    const order = useSelector(orderCheckoutSelector) || {};

    const {
        query: { orderNumber }
    } = useRouter();

    const dispatch = useDispatch();

    const redirectMerchantUrl = useSelector(redirectMerchantUrlSelector);

    useEffect(() => {
        dispatch(fetchCheckoutAction(orderNumber));
        dispatch(clearOrderByCommentAction(null));
    }, []);

    useEffect(() => {
        if (redirectMerchantUrl) {
            window.location.href = redirectMerchantUrl;
        }
    }, [redirectMerchantUrl]);

    const validationSchema = Yup.object({
        first_name: Yup.string()
            .strict(true)
            // .trim(t('Cannot include leading and trailing spaces'))
            .required(t('You must enter your first name')),
        last_name: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('You must enter your family name')),
        country_id: Yup.number().required(t('You must select country')),
        post_code: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('Required field')),
        // state: Yup.string()
        //     .strict(true)
        //     .trim(t('Cannot include leading and trailing spaces'))
        //     .required(t('Required field'))
        //     .min(3, t('State must be at least 3 characters')),
        city: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('Required field'))
            .min(3, t('City must be at least 3 characters')),
        shipping_address: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('Required field'))
            .min(5, t('Address must be at least 5 characters')),
        // address_line_2: Yup.string()
        //     .strict(true)
        //     .trim(t('Cannot include leading and trailing spaces')),
        phone: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('You must enter your phone number'))
            .min(5, t('Phone must be at least 5 characters')),
        isAgreeTerms: Yup.bool().oneOf([true], 'The terms and conditions must be accepted.')
    });

    return (
        <>
            <Head>
                <title>LiveProshop - Checkout {orderNumber}</title>
            </Head>

            <div className="lg:white-shadow-medium bg-white rounded-lg pr-4 pb-4 lg:pr-8 lg:pb-8 lg:mr-4 mt-10">
                <div className="flex flex-wrap items-center">
                    <div className="text-3xl font-bold text-gray-350 p-4 lg:p-8 mr-4 lg:mr-8">
                        {t('lets_check_out')}
                    </div>

                    <div className="flex-1 p-4 lg:p-8">
                        <ol className="list-reset flex items-center text-gray-300 font-bold">
                            <li className="self-center flex-none mr-1 sd:mr-2 sd:pr-4 min-w-max h-1 background-gradient">
                                <div className="w-8 h-8 -mt-4 mr-2 sd:mr-4 rounded-full background-gradient shadow-2xl" />
                            </li>
                            <li className="bg-clip-text text-transparent background-gradient">
                                {t('Review your order')}
                            </li>

                            <li className="self-center flex-1 mx-2 sd:px-4 min-w-max h-1 bg-gray-300">
                                <div className="w-8 h-8 -mt-4 ml-auto mr-2 sd:mr-4 rounded-full bg-gray-300" />
                            </li>
                            <li>{t('Payment')}</li>

                            <li className="self-center flex-1 mx-2 sd:px-4 min-w-max h-1 bg-gray-300 hidden sm:block">
                                <div className="w-8 h-8 -mt-4 ml-auto mr-2 sd:mr-4 rounded-full bg-gray-300" />
                            </li>
                            <li className="hidden sm:block">{t('Order complete!')}</li>
                        </ol>
                    </div>
                </div>
                <Formik
                    // enableReinitialize
                    initialValues={{
                        // isEqualAddresses: true,
                        // paymentMethod: 'paypal',
                        isAgreeTerms: false
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        dispatch(submitCheckoutAction(values, orderNumber));
                        actions.setSubmitting(false);
                    }}>
                    <Form>
                        <div className="flex flex-wrap justify-between relative">
                            <div className="flex-auto lg:flex-1 relative">
                                {showEmailNotice && (
                                    <div>
                                        <div className="disabled-checkout-hover" />
                                        <div className="checkout-notice">
                                            <div className="p-[10px] items-center text-sm bg-gradient-to-r from-green-50 to-green-300 absolute rounded-lg left-[33%] top-[16px]">
                                                <div className="relative">
                                                    <i className="icon-warning" />
                                                    <span className="inline-block ml-[25px]">
                                                        Please add an email in your{' '}
                                                        <Link href={'/account'}>
                                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                                                            <a
                                                                className="ml-auto text-sm font-bold red-yellow-gradient-text"
                                                                onClick={() => {
                                                                    dispatch(
                                                                        setupReturnedUrlAction(
                                                                            `${
                                                                                locale == 'fr'
                                                                                    ? ''
                                                                                    : '/en'
                                                                            }/checkout/${
                                                                                order.order_number
                                                                            }`
                                                                        )
                                                                    );
                                                                    dispatch(
                                                                        redirectCheckoutAction(true)
                                                                    );
                                                                }}>
                                                                profile!
                                                            </a>
                                                        </Link>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="white-shadow-medium bg-white rounded-lg p-3 lg:p-6 ml-4 lg:ml-8 mt-8">
                                    <div className="text-2xl font-bold text-gray-350 mb-6">
                                        {t('Shipping Address')}
                                    </div>
                                    <ShippingAddress locale={locale} />
                                </div>
                                {order.order_items?.length && (
                                    <ShippingMethod
                                        title={t('Shipping  Method')}
                                        className="white-shadow-medium bg-white rounded-lg p-3 lg:p-6 ml-4 lg:ml-8 mt-10"
                                    />
                                )}

                                {/*<div className="white-shadow-medium bg-white rounded-lg p-3 lg:p-6 ml-4 lg:ml-8 mt-10">*/}
                                {/*    <div className="text-2xl font-bold text-gray-350 mb-6">*/}
                                {/*        {t('Payment  Method')}*/}
                                {/*    </div>*/}
                                {/*    <PaymentGuide />*/}
                                {/*</div>*/}
                            </div>

                            <div className="flex-auto lg:flex-1 white-shadow-medium bg-white rounded-lg p-3 lg:p-6 ml-4 lg:ml-8 mt-10 shadow-inner">
                                <div className="text-2xl font-bold text-gray-350 mb-6">
                                    {t('Order summary')}
                                </div>

                                <OrderSummary />
                            </div>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    );
}
export async function getServerSideProps(context: any) {
    const { locale } = context;
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: { destination: `/${locale === 'fr' ? '' : `${locale}/`}auth/signin` }
        };
    }

    return {
        props: {
            session,
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
