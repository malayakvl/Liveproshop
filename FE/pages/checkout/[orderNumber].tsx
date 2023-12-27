import Head from 'next/head';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
    fetchCheckoutAction,
    fetchShippingMethodsByCountryCheckoutAction,
    submitCheckoutAction
} from '../../redux/checkout';
import { useDispatch, useSelector } from 'react-redux';
import {
    addressCheckoutSelector,
    orderCheckoutSelector,
    redirectMerchantUrlSelector, shippingMethodsCheckoutSelector
} from '../../redux/checkout/selectors';
import { ShippingAddress, ShippingMethod, OrderSummary } from '../../components/checkout';
import {
    clearOrderByCommentAction,
    redirectCheckoutAction,
    redirectOrderNumberAction,
    setupReturnedUrlAction
} from '../../redux/orders';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { showEmailNoticeSelector } from '../../redux/layouts/selectors';
import Link from 'next/link';
import { userSelector } from '../../redux/user/selectors';
import { showEmailNotificationAction } from '../../redux/layouts';
import shippingMethod from "../../components/checkout/ShippingMethod";
// import CardValidator from 'card-validator';

export default function Index({ session, locale }: { session: any; locale: any }) {
    if (!session) return null;
    const t = useTranslations();
    const showEmailNotice = useSelector(showEmailNoticeSelector);
    const user = useSelector(userSelector);
    // const showEmailNotice = true;
    const order = useSelector(orderCheckoutSelector) || {};
    const {
        query: { orderNumber }
    } = useRouter();
    const dispatch = useDispatch();
    const redirectMerchantUrl = useSelector(redirectMerchantUrlSelector);
    const address = useSelector(addressCheckoutSelector);
    const shippingMethods = useSelector(shippingMethodsCheckoutSelector);

    const validateEmail = (email: string) => {
        if (!email) {
            return false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            return false;
        }

        return true;
    };

    useEffect(() => {
        if (validateEmail(user.email_real) && !validateEmail(user.email)) {
            dispatch(showEmailNotificationAction(false));
        } else {
            dispatch(redirectOrderNumberAction(orderNumber));
        }
        dispatch(fetchCheckoutAction(orderNumber));
        dispatch(clearOrderByCommentAction(null));
        window.localStorage.removeItem('orderCommentId');
    }, [user.email]);

    useEffect(() => {
        if (address?.country_id && order?.id) {
            if (shippingMethods.length == 0) {
                console.log('COUNTRY', address.country_id);
                dispatch(fetchShippingMethodsByCountryCheckoutAction(order.id, address.country_id));
            }
        }
        // if (address.country_id)
        // dispatch(fetchShippingMethodsByCountryCheckoutAction(order.id, address.country_id));
        // if (shippingMethods.length > 0) {
        //     setFieldValue('shippingMethodId', String(shippingMethods[0]?.id ?? ''), false);
        // } else if (address.country_id && shippingMethods.length === 0) {
        //     console.log(address.country_id, shippingMethods.length);
        //     // dispatch(fetchShippingMethodsByCountryCheckoutAction(order.id, address.country_id));
        // }
    }, [address?.country_id]);

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
                        <ol className="list-reset flex flex-col text-gray-300 font-bold md:hidden">
                            <li className="">
                                <div className="w-8 h-8 -mt-4 mr-2 sd:mr-4 rounded-full background-gradient shadow-2xl" />
                            </li>
                            <li className="inline w-[300px] mt-[-30px] ml-[40px] text-transparent rainbow-gradient-text">
                                {t('Review your order')}
                            </li>
                            <li className="mt-[35px]">
                                <div className="w-8 h-8 -mt-4 mr-2 sd:mr-4 rounded-full bg-gray-300" />
                            </li>
                            <li className="inline w-[300px] mt-[-30px] ml-[40px]">
                                {t('Payment')}
                            </li>
                            <li className="mt-[35px]">
                                <div className="w-8 h-8 -mt-4 mr-2 sd:mr-4 rounded-full bg-gray-300" />
                            </li>
                            <li className="inline w-[300px] mt-[-30px] ml-[40px]">
                                {t('Order complete!')}
                            </li>
                        </ol>
                        <ol className="hidden list-reset md:flex items-center text-gray-300 font-bold">
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
                        dispatch(submitCheckoutAction(values, orderNumber, locale));
                        actions.setSubmitting(false);
                    }}>
                    <Form>
                        <div className="flex flex-wrap justify-between">
                            <div className="flex-auto lg:flex-1 relative" id="checkoutAddress">
                                <div className="relative">
                                    <div
                                        className={`email-notice ${
                                            !showEmailNotice ? 'hidden' : ''
                                        }`}>
                                        {t('Please add an email in your')} &nbsp;
                                        <Link href={'/account'}>
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                                            <a
                                                className="ml-auto text-sm font-bold text-purple-250"
                                                onClick={() => {
                                                    dispatch(
                                                        setupReturnedUrlAction(
                                                            `${
                                                                locale == 'fr' ? '' : '/en'
                                                            }/checkout/${order.order_number}`
                                                        )
                                                    );
                                                    dispatch(redirectCheckoutAction(true));
                                                }}>
                                                {t('profile!')}
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                                <div
                                    className={`mt-3 white-shadow-medium bg-white rounded-lg p-3 lg:p-6 ml-4 lg:ml-8 md:mt-8 ${
                                        showEmailNotice ? 'disabled-content' : ''
                                    }`}>
                                    <div className="">
                                        <div className="text-2xl font-bold text-gray-350 mb-6">
                                            {t('Shipping Address')}
                                        </div>
                                        <ShippingAddress locale={locale} />
                                    </div>
                                </div>
                                {order.order_items?.length && (
                                    <>
                                        <ShippingMethod
                                            title={t('Shipping  Method')}
                                            className={`white-shadow-medium bg-white rounded-lg p-3 lg:p-6 ml-4 lg:ml-8 mt-10 ${
                                                showEmailNotice ? 'disabled-content' : ''
                                            }`}
                                        />
                                    </>
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
