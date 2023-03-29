import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useTranslations } from 'next-intl';
import { showLoaderAction } from '../../redux/layouts/actions';
import { useDispatch } from 'react-redux';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
const { publicRuntimeConfig } = getConfig();
const siteUrl = publicRuntimeConfig.siteUrl;

const CheckoutUnregisteredForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const t = useTranslations();
    const dispatch = useDispatch();
    const { query } = useRouter();

    const handleSubmitPayment = async (event: any) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
        //
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        dispatch(showLoaderAction(true));
        // const result = await stripe.confirmPayment({
        //     //`Elements` instance that was used to create the Payment Element
        //     elements,
        //     confirmParams: {
        //         return_url: `${siteUrl}/completePayment`
        //     }
        // });
        const result = await stripe.confirmSetup({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: `${siteUrl}/completePayment?planId=${query.planId}&type=${query.type}`
            }
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            dispatch(showLoaderAction(false));
        }
    };

    return (
        <form onSubmit={handleSubmitPayment}>
            <PaymentElement />
            {/*<CardElement />*/}
            <button disabled={!stripe} className="gradient-btn w-full mt-4">
                {t('Confirm Payment')}
            </button>
        </form>
    );
};

export default CheckoutUnregisteredForm;
