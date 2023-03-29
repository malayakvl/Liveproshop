import Head from 'next/head';
import { getSession } from 'next-auth/client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector, userSubscriptionSelector } from '../../../redux/user/selectors';
import { fetchUserSubscriptionAction, showChangeSubscriptionFormAction } from '../../../redux/user';
import {
    unsubscribeAction,
    addPyamentMethodActions,
    stripeDeletetPaymentAction
} from '../../../redux/user/actions';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import ChangeSubscription from './ChangeSubscription';
import { PaymentMethodPlan } from '../../../components/checkout';
import { fetchStripeProductAction } from '../../../redux/paymentPlans';
import { stripeDefaultPaymentAction } from '../../../redux/user/actions';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import CardValidator from 'card-validator';

export default function Index({ session, locale }: { session: any; locale: string }) {
    if (!session) return <></>;
    const dispatch = useDispatch();
    const t = useTranslations();

    const user = useSelector(userSelector);
    const subscriptionInfo = useSelector(userSubscriptionSelector);

    useEffect(() => {
        // Create PaymentIntent and Plan Price as soon as the page loads
        if (user?.email) {
            dispatch(fetchUserSubscriptionAction());
        }
        dispatch(fetchStripeProductAction());
    }, [user?.email]);

    const preparePeriod = () => {
        if (subscriptionInfo.trial_end && subscriptionInfo.status != 'active') {
            return `
                    ${moment.unix(subscriptionInfo.trial_start).format('DD-MM-YYYY')} - ${moment
                .unix(subscriptionInfo.trial_end)
                .format('DD.MM.YYYY')}
                  `;
            // tr.appendChild(createTD(`<span class="days w3-center w3-block">${dayLeft}</span>`));
        } else {
            return `
                    ${moment
                        .unix(subscriptionInfo.current_period_start)
                        .format('DD.MM.YYYY')} - ${moment
                .unix(subscriptionInfo.current_period_end)
                .format('DD.MM.YYYY')}
                    
                `;
        }
    };

    const prepareDayLeft = () => {
        let dDiff = 0;
        const start = moment.unix(subscriptionInfo.current_period_end);
        const end = moment();
        const dayLeft = moment.duration(start.diff(end)).asDays().toFixed(0);
        if (subscriptionInfo.trial_end && subscriptionInfo.status != 'active') {
            return dayLeft;
        } else {
            const a = moment();
            const b = moment(moment.unix(subscriptionInfo.current_period_end).format('YYYY-MM-DD'));
            dDiff = b.diff(a, 'days');
            return dDiff < 0 ? `expired ${-dDiff} days ago` : dDiff;
        }
    };

    const validationSchema = Yup.object({
        card_number: Yup.string()
            .strict(true)
            .when('paymentMethod', {
                is: (val: string) => val === 'card',
                then: Yup.string()
                    .test(
                        'test-card-number',
                        t('Credit card number is invalid'),
                        (value) => CardValidator.number(value).isValid
                    ) // return true false based on validation
                    .required(t('Required field'))
                // otherwise: Yup.required(),
            }),
        card_expire_date: Yup.string()
            .strict(true)
            .when('paymentMethod', {
                is: (val: string) => val === 'card',
                then: Yup.string()
                    .test(
                        'test-card-exp',
                        t('Credit card expiration date is invalid'),
                        (value) => CardValidator.expirationDate(value).isValid
                    )
                    .required(t('Required field'))
            }),
        card_ccv: Yup.string()
            .strict(true)
            .when('paymentMethod', {
                is: (val: string) => val === 'card',
                then: Yup.string()
                    .test(
                        'test-card-ccv',
                        t('Credit card CCV is invalid'),
                        (value) => CardValidator.cvv(value).isValid
                    )
                    .required(t('Required field'))
            })
    });

    return (
        <>
            <Head>
                <title>Amadeo CRM - Subscription Plan</title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-big">
                <div className="page-title">
                    <h1>Subscription Plan</h1>
                    <div className="clear-both" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="white-shadow-medium bg-white rounded-lg p-3 lg:p-6 mt-10">
                    <div className="flex flex-wrap justify-between">
                        <div className="flex-auto lg:flex-1">
                            <div className="text-2xl font-bold text-gray-350 mb-6">
                                {t('Exist Payment Method')}
                            </div>
                            {subscriptionInfo && (
                                <table className="w-full float-table">
                                    <tbody>
                                        {subscriptionInfo.paymentMethods.map((method: any) => (
                                            <tr key={method.id} className="py-2">
                                                <td>
                                                    ****{method.card.last4}
                                                    {method.card.brand}
                                                </td>
                                                <td>
                                                    {method.card.exp_month}/{method.card.exp_year}
                                                </td>
                                                <td
                                                    style={{
                                                        paddingTop: '10px',
                                                        paddingBottom: '10px'
                                                    }}>
                                                    {method.id !==
                                                        subscriptionInfo.defaultPayment && (
                                                        <span
                                                            className=" cursor-pointer gradient-btn-small whitespace-nowrap"
                                                            role="presentation"
                                                            onClick={() =>
                                                                dispatch(
                                                                    stripeDefaultPaymentAction(
                                                                        method.id
                                                                    )
                                                                )
                                                            }>
                                                            {t('Setup Default')}
                                                        </span>
                                                    )}
                                                    {method.id ===
                                                        subscriptionInfo.defaultPayment && (
                                                        <span>Default</span>
                                                    )}
                                                </td>
                                                <td
                                                    style={{
                                                        paddingTop: '10px',
                                                        paddingBottom: '10px'
                                                    }}>
                                                    {method.id !==
                                                        subscriptionInfo.defaultPayment && (
                                                        <span
                                                            className="cursor-pointer disabled-btn-small"
                                                            role="presentation"
                                                            onClick={() =>
                                                                dispatch(
                                                                    stripeDeletetPaymentAction(
                                                                        method.id
                                                                    )
                                                                )
                                                            }>
                                                            Delete
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
                <div className="white-shadow-medium bg-white rounded-lg p-3 lg:p-6 mt-10 ">
                    <Formik
                        // enableReinitialize
                        initialValues={{
                            card_ccv: '',
                            card_expire_date: '',
                            card_number: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, actions) => {
                            // dispatch(submitCheckoutAction(values, orderNumber));
                            dispatch(addPyamentMethodActions(values));
                            actions.setSubmitting(false);
                        }}>
                        <Form>
                            <div className="flex flex-wrap justify-between">
                                <div className="flex-auto lg:flex-1">
                                    <div className="text-2xl font-bold text-gray-350 mb-6">
                                        {t('Add Payment Method')}
                                    </div>
                                    <PaymentMethodPlan />
                                </div>
                            </div>
                            <button className="gradient-btn mt-4">{t('Add Card')}</button>
                        </Form>
                    </Formik>
                </div>
            </div>
            <div className="mt-10 block-white-8 white-shadow-big pb-[50px]">
                {subscriptionInfo ? (
                    <div className="overflow-x-scroll">
                        <table className="w-full float-table">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>{t('Name')}</th>
                                    <th>{t('Status')}</th>
                                    <th>{t('Created')}</th>
                                    <th>{t('Period')}</th>
                                    <th>{t('Days left')}</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {subscriptionInfo.DBName}
                                        <br />
                                        <a
                                            className="cursor-pointer text-xs gradient-btn-small block max-w-max"
                                            href={subscriptionInfo.invoicePdf}
                                            target="_blank"
                                            rel="noreferrer">
                                            {t('Download Invoice')}
                                        </a>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`${subscriptionInfo.status}-subscription`}>
                                            {subscriptionInfo.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {moment.unix(subscriptionInfo.created).format('DD.MM.YYYY')}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{preparePeriod()}</td>
                                    <td style={{ textAlign: 'center' }}>{prepareDayLeft()}</td>
                                    <td>
                                        <span
                                            className="cursor-pointer gradient-btn-small block max-w-max"
                                            role="presentation"
                                            onClick={() =>
                                                dispatch(showChangeSubscriptionFormAction(true))
                                            }>
                                            {t('Change Plan')}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span
                                            role="presentation"
                                            className="cursor-pointer border border-gray-300 text-gray-300 py-1.5 rounded-lg px-1"
                                            onClick={() => {
                                                dispatch(unsubscribeAction());
                                            }}>
                                            {t('Unsubscribe')}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>{t('No Payment info yet')}</p>
                )}
            </div>
            <ChangeSubscription locale={locale} />
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
                ...require(`../../../messages/${locale}.json`)
            }
        }
    };
}
