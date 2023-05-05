import Head from 'next/head';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { fetchCheckoutAction, submitCheckoutAction } from '../../redux/checkout';
import { useDispatch, useSelector } from 'react-redux';
import { redirectMerchantUrlSelector } from '../../redux/checkout/selectors';
import { ShippingAddress, ShippingMethod, OrderSummary } from '../../components/checkout';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
// import CardValidator from 'card-validator';

export default function Index({ session, locale }: { session: any; locale: any }) {
    if (!session) return null;
    const t = useTranslations();

    const {
        query: { orderNumber }
    } = useRouter();

    const dispatch = useDispatch();

    const redirectMerchantUrl = useSelector(redirectMerchantUrlSelector);

    useEffect(() => {
        dispatch(fetchCheckoutAction(orderNumber));
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

        // card_number: Yup.string()
        //     .strict(true)
        //     .when('paymentMethod', {
        //         is: (val: string) => val === 'card',
        //         then: Yup.string()
        //             .test(
        //                 'test-card-number',
        //                 t('Credit card number is invalid'),
        //                 (value) => CardValidator.number(value).isValid
        //             ) // return true false based on validation
        //             .required(t('Required field'))
        //         // otherwise: Yup.required(),
        //     }),
        // card_expire_date: Yup.string()
        //     .strict(true)
        //     .when('paymentMethod', {
        //         is: (val: string) => val === 'card',
        //         then: Yup.string()
        //             .test(
        //                 'test-card-exp',
        //                 t('Credit card expiration date is invalid'),
        //                 (value) => CardValidator.expirationDate(value).isValid
        //             )
        //             .required(t('Required field'))
        //     }),
        // card_ccv: Yup.string()
        //     .strict(true)
        //     .when('paymentMethod', {
        //         is: (val: string) => val === 'card',
        //         then: Yup.string()
        //             .test(
        //                 'test-card-ccv',
        //                 t('Credit card CCV is invalid'),
        //                 (value) => CardValidator.cvv(value).isValid
        //             )
        //             .required(t('Required field'))
        //     })
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
                        <div className="flex flex-wrap justify-between">
                            <div className="flex-auto lg:flex-1">
                                <div className="white-shadow-medium bg-white rounded-lg p-3 lg:p-6 ml-4 lg:ml-8 mt-8">
                                    <div className="text-2xl font-bold text-gray-350 mb-6">
                                        {t('Shipping Address')}
                                    </div>
                                    <ShippingAddress locale={locale} />
                                </div>

                                <ShippingMethod
                                    title={t('Shipping  Method')}
                                    className="white-shadow-medium bg-white rounded-lg p-3 lg:p-6 ml-4 lg:ml-8 mt-10"
                                />

                                {/*<div className="white-shadow-medium bg-white rounded-lg p-3 lg:p-6 ml-4 lg:ml-8 mt-10">*/}
                                {/*    <div className="text-2xl font-bold text-gray-350 mb-6">*/}
                                {/*        {t('Payment  Method')}*/}
                                {/*    </div>*/}
                                {/*    <PaymentMethod />*/}
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
