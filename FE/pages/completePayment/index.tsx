import FullLayout from '../../components/layout/FullLayout';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { providers, signIn } from 'next-auth/client';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { checkPaymentStatusAction } from '../../redux/user';
import { paymentIntentSelector } from '../../redux/user/selectors';

export default function CompletePayment({
    paymentIntent,
    setupIntentSecret,
    setupIntent,
    planId,
    type
}: {
    paymentIntent: any;
    setupIntentSecret: string;
    setupIntent: string;
    planId: number;
    type: string | null;
}) {
    const dispatch = useDispatch();
    const t = useTranslations();
    const { query } = useRouter();
    // const user = useSelector(userSelector);
    const stripePaymentIntent = useSelector(paymentIntentSelector);

    useEffect(() => {
        // dispatch(checkPaymentStatusAction(paymentIntent, paymentIntentSecret));
        dispatch(checkPaymentStatusAction(setupIntent, setupIntentSecret, planId, type));
    }, [paymentIntent]);

    useEffect(() => {
        if (stripePaymentIntent) {
            signIn('credentials_subscription_login', {
                email: stripePaymentIntent?.email,
                seller_email: stripePaymentIntent?.email,
                callbackUrl: `${window.location.origin}/dashboard`
            });

            // if (!user?.email) {
            //     signIn('credentials_subscription_login', {
            //         email: stripePaymentIntent?.email,
            //         seller_email: stripePaymentIntent?.email,
            //         callbackUrl: `${window.location.origin}/dashboard`
            //     });
            // } else {
            //     signIn('credentials_subscription_login', {
            //         email: stripePaymentIntent?.email,
            //         seller_email: stripePaymentIntent?.email,
            //         callbackUrl: `${window.location.origin}/dashboard`
            //     });
            // }
        }
    }, [stripePaymentIntent?.email]);

    return (
        <div className="flex justify-center">
            <div className="mt-10 rounded-lg bg-white w-96 p-10 pb-24">
                <div className="mb-8 font-bold text-3xl line-height-105percent">
                    {t('Payment Confirmation')}
                </div>
                <div className="error-el">{query.message}</div>
            </div>
        </div>
    );
}

CompletePayment.Layout = FullLayout;

export async function getServerSideProps(context: any) {
    const { req, locale } = context;
    // const session = await getSession({ req });
    const paymentIntentSecret = req.__NEXT_INIT_QUERY.payment_intent_client_secret
        ? req.__NEXT_INIT_QUERY.payment_intent_client_secret
        : null;
    const paymentIntent = req.__NEXT_INIT_QUERY.payment_intent
        ? req.__NEXT_INIT_QUERY.payment_intent
        : null;
    const setupIntent = req.__NEXT_INIT_QUERY.setup_intent
        ? req.__NEXT_INIT_QUERY.setup_intent
        : null;
    const setupIntentSecret = req.__NEXT_INIT_QUERY.setup_intent_client_secret
        ? req.__NEXT_INIT_QUERY.setup_intent_client_secret
        : null;
    const planId = req.__NEXT_INIT_QUERY.planId ? req.__NEXT_INIT_QUERY.planId : null;
    const type = req.__NEXT_INIT_QUERY.type ? req.__NEXT_INIT_QUERY.type : null;
    return {
        props: {
            providers: await providers(),
            locale: locale,
            paymentIntentSecret,
            paymentIntent,
            setupIntentSecret,
            setupIntent,
            planId,
            type,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
