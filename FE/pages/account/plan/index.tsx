import Head from 'next/head';
import { getSession } from 'next-auth/client';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector, userSubscriptionSelector } from '../../../redux/user/selectors';
import { fetchUserSubscriptionAction, showChangeSubscriptionFormAction } from '../../../redux/user';
import { unsubscribeAction, addPyamentMethodActions } from '../../../redux/user/actions';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import ChangeSubscription from './ChangeSubscription';
import { PaymentMethodPlan } from '../../../components/checkout';
import { fetchStripeProductAction } from '../../../redux/paymentPlans';
import { stripeDefaultPaymentAction } from '../../../redux/user/actions';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import CardValidator from 'card-validator';
import ConfirmDialog from '../../../components/_common/ConfirmDialog';

export default function Index({ session, locale }: { session: any; locale: string }) {
    if (!session) return <></>;
    const dispatch = useDispatch();
    const t = useTranslations();
    const [hideBtn, setHideBtn] = useState(false);
    const user = useSelector(userSelector);
    const subscriptionInfo = useSelector(userSubscriptionSelector);
    const [selectedItem, setSelectedItem] = useState<any | null>();

    useEffect(() => {
        // Create PaymentIntent and Plan Price as soon as the page loads
        if (user?.email) {
            dispatch(fetchUserSubscriptionAction());
        }
        dispatch(fetchStripeProductAction());
    }, [user?.email]);

    useEffect(() => {
        // Create PaymentIntent and Plan Price as soon as the page loads
        if (subscriptionInfo?.is_fake) {
            setHideBtn(false);
        }
    }, [subscriptionInfo]);

    const handlerConfirmCancel = useCallback(() => {
        if (!selectedItem) return;
        dispatch(unsubscribeAction(true));
        setSelectedItem(null);
    }, [selectedItem]);

    const preparePeriodFake = () => {
        return `
                    ${moment(subscriptionInfo.period_start).format('DD.MM.YYYY')} - ${moment(
            subscriptionInfo.period_end
        ).format('DD.MM.YYYY')}
                `;
    };

    const prepareDayLeftFake = () => {
        let dDiff = 0;
        const start = moment(subscriptionInfo.period_end);
        const end = moment();
        const dayLeft = moment.duration(start.diff(end)).asDays().toFixed(0);
        if (subscriptionInfo.is_fake) {
            return dayLeft;
        } else {
            const a = moment();
            const b = moment(moment.unix(subscriptionInfo.current_period_end).format('YYYY-MM-DD'));
            dDiff = b.diff(a, 'days');
            return dDiff < 0 ? `expired ${-dDiff} days ago` : dDiff;
        }
    };

    console.log(subscriptionInfo);

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

    console.log(subscriptionInfo);

    return (
        <>
            <Head>
                <title>LiveProshop - Subscription Plan</title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-big">
                <div className="page-title">
                    <h1>{t('Subscription Plan')}</h1>
                    <div className="clear-both" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="white-shadow-medium bg-white rounded-lg p-3 lg:p-6 mt-10">
                    <div className="flex flex-wrap justify-between">
                        {subscriptionInfo && (
                            <div className="flex-auto lg:flex-1">
                                <div className="text-2xl font-bold text-gray-350 mb-6">
                                    {t('Exist Payment Method')}
                                </div>
                                <table className="w-full float-table">
                                    <tbody>
                                        {subscriptionInfo.paymentMethods.map((method: any) => (
                                            <tr key={method.id}>
                                                <td>
                                                    ****{method.card.last4} {method.card.brand}
                                                </td>
                                                <td>
                                                    {method.card.exp_month}/{method.card.exp_year}
                                                </td>
                                                <td
                                                    style={{
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
                                {!subscriptionInfo.is_fake && (
                                    <tr>
                                        <td>
                                            {t(subscriptionInfo.dbUserPlan.name)}
                                            {subscriptionInfo.upgradet_at && (
                                                <em
                                                    className={`block text-[12px] max-w-[300px] text-${
                                                        subscriptionInfo.nameUpgrade != 'Cancel'
                                                            ? 'green-250'
                                                            : 'orange-450'
                                                    } font-bold`}
                                                    style={{ fontStyle: 'normal' }}>
                                                    {subscriptionInfo.upgradet_at && (
                                                        <>
                                                            {subscriptionInfo.nameUpgrade !=
                                                            'Cancel' ? (
                                                                <>
                                                                    {t('upgrade_subcription_msg', {
                                                                        dayCount:
                                                                            subscriptionInfo.daysLeft,
                                                                        planName:
                                                                            subscriptionInfo
                                                                                .dbUserPlan.name
                                                                    })}
                                                                    &nbsp;
                                                                    {t(
                                                                        subscriptionInfo.nameUpgrade
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {t('cancel_subcription_msg', {
                                                                        dayCount:
                                                                            subscriptionInfo.daysLeft,
                                                                        planName:
                                                                            subscriptionInfo
                                                                                .dbUserPlan.name
                                                                    })}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </em>
                                            )}
                                            <a
                                                className="cursor-pointer text-xs gradient-btn-small block max-w-max mt-5"
                                                href={subscriptionInfo.invoicePdf}
                                                target="_blank"
                                                rel="noreferrer">
                                                {t('Download Invoice')}
                                            </a>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span
                                                className={`${subscriptionInfo.status}-subscription`}>
                                                {t(subscriptionInfo.status)}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {subscriptionInfo.viewCreate}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {moment
                                                .unix(subscriptionInfo.current_period_start)
                                                .format('MM/DD/YYYY')}
                                            {' - '}
                                            {moment
                                                .unix(subscriptionInfo.current_period_end)
                                                .format('MM/DD/YYYY')}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {subscriptionInfo.daysLeft}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span
                                                className="cursor-pointer gradient-btn-small inline-block max-w-max"
                                                role="presentation"
                                                onClick={() =>
                                                    dispatch(showChangeSubscriptionFormAction(true))
                                                }>
                                                {t('Change Plan')}
                                            </span>
                                            <span
                                                className="cursor-pointer disabled-btn-small inline-block ml-4"
                                                role="presentation"
                                                onClick={() => {
                                                    setSelectedItem(!selectedItem);
                                                    // dispatch(unsubscribeAction(true))
                                                }}>
                                                {t('Cancel')}
                                            </span>
                                        </td>
                                    </tr>
                                )}
                                {subscriptionInfo.is_fake && (
                                    <tr>
                                        <td>
                                            {subscriptionInfo.customer_id.indexOf('us_')
                                                ? subscriptionInfo.plan_id == 2
                                                    ? t('Business')
                                                    : subscriptionInfo.plan_id == 1
                                                    ? t('Basic')
                                                    : t('Platinum')
                                                : t('Try for free')}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`trial-subscription`}>
                                                {/*{t('trial subscription')} <br />*/}
                                                {subscriptionInfo.plan_id == 2
                                                    ? t('Business')
                                                    : subscriptionInfo.plan_id == 1
                                                    ? t('Basic')
                                                    : t('Platinum')}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {moment(subscriptionInfo.created_at).format(
                                                'DD.MM.YYYY'
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {preparePeriodFake()}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {prepareDayLeftFake()}
                                        </td>
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
                                        <td style={{ textAlign: 'center' }}>&nbsp;</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>{t('No Payment info yet')}</p>
                )}
            </div>
            {subscriptionInfo?.id && <ChangeSubscription locale={locale} />}
            <ConfirmDialog
                show={!!selectedItem}
                text={t('Are you sure you want to cancel subscription?', {
                    status: selectedItem ? t('enable') : t('disable'),
                    name: t('Cancel Subscription')
                })}
                titleConfirm={t('Yes')}
                titleCancel={t('Cancel')}
                onConfirm={handlerConfirmCancel}
                onClose={() => setSelectedItem(null)}
            />
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
