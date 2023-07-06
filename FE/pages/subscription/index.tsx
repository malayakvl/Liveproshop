import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    userSelector,
    userSubscriptionSelector,
    clientSecretSelector
} from '../../redux/user/selectors';
import { getSession } from 'next-auth/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { CheckoutForm } from '../../components/checkout';
import { planInfoSelector } from '../../redux/paymentPlans/selectors';
import Head from 'next/head';
import Link from 'next/link';
import { isDataLoadingSelector } from '../../redux/layouts/selectors';
import { paymentPlanInfoAction } from '../../redux/paymentPlans';
import { formatCurrency } from '../../lib/functions';
import { createExistUserSubscriptionAction } from '../../redux/user';
import Router, { useRouter } from 'next/router';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const stripeKey = publicRuntimeConfig.stripeKey;

const stripePromise = loadStripe(stripeKey);
console.log('here we are');
export default function Subscription({
    locale,
    planId,
    type
}: {
    locale: any;
    planId: number;
    type: string | null;
}) {
    const dispatch = useDispatch();
    const t = useTranslations();
    const { query } = useRouter();

    const user = useSelector(userSelector);
    console.log('here we are in continue subscription', user);
    const stripeClientSecret = useSelector(clientSecretSelector);
    const subscription = useSelector(userSubscriptionSelector);
    const planInfo = useSelector(planInfoSelector);

    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (!stripeClientSecret) {
            dispatch(paymentPlanInfoAction(planId));
        }
        // Create PaymentIntent and Plan Price as soon as the page loads
    }, []);

    useEffect(() => {
        // Create PaymentIntent and Plan Price as soon as the page loads
        if (user.email && !stripeClientSecret) {
            dispatch(createExistUserSubscriptionAction(user, planId, query.type));
        }
    }, [planId, user?.email, type]);

    useEffect(() => {
        if (subscription) {
            if (subscription.status === 'trialing') {
                Router.push(`/${locale === 'fr' ? '' : `${locale}/`}dashboard`);
            } else {
                setClientSecret(stripeClientSecret);
            }
        }
    }, [subscription]);

    const appearance: any = {
        theme: 'stripe',
        fontFamily: 'Montserrat',
        borderRadius: '8px',
        colorText: '#ccc'
    };
    const options: StripeElementsOptions = {
        clientSecret,
        appearance
    };

    return (
        <>
            <Head>
                <title>LiveProshop - Subscription</title>
            </Head>

            {clientSecret && (
                <div className="flex justify-center h-[680px]">
                    <div className="rounded-lg border shadow-xl mt-10 flex w-[1000px] bg-white px-20 py-14">
                        <div className="font-bold mt-8 pr-12 w-2/4">
                            <div className="text-2xl line-height-105percent mb-9 w-full">
                                {query.type !== 'trial' && (
                                    <>
                                        <span className="block mt-2 mb-4">
                                            {t('Selected plan')}: {planInfo.name}
                                        </span>
                                        <span className="block mt-2 mb-4">
                                            {t('Selected plan Price')}:{' '}
                                            {formatCurrency(planInfo.stripeInfo.unit_amount / 100)}
                                        </span>
                                        <span className="block mt-2 mb-4">{t('trial_notice')}</span>
                                    </>
                                )}
                                {query.type === 'trial' && (
                                    <span className="block mt-2 mb-4">{t('trial_notice')}</span>
                                )}
                            </div>
                            <Link href={'/pricing'}>
                                <a className="font-bold text-orange-450">{t('Back to Plans')}</a>
                            </Link>
                        </div>

                        <div className="pl-12 border-l w-2/4">
                            <>
                                <div className="flex mb-14">
                                    <div>
                                        {clientSecret !== '' && (
                                            <Elements options={options} stripe={stripePromise}>
                                                <CheckoutForm />
                                            </Elements>
                                        )}
                                    </div>
                                </div>
                            </>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export async function getServerSideProps(context: any) {
    const { req, locale } = context;
    const session = await getSession(context);
    const planId = req.__NEXT_INIT_QUERY.planId;
    const type = req.__NEXT_INIT_QUERY.type ? req.__NEXT_INIT_QUERY.type : null;

    return {
        props: {
            session,
            locale,
            planId,
            type,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}

// eslint-disable-next-line react/display-name
Subscription.Layout = ({ children }: { children: any }) => {
    const showLoader = useSelector(isDataLoadingSelector);
    return (
        <>
            {showLoader && (
                <div className="loader">
                    <div className="flex justify-center items-center w-full h-full">
                        <div
                            className="spinner-border animate-spin inline-block w-20 h-20 border-4 rounded-full"
                            role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
            {children}
        </>
    );
};
