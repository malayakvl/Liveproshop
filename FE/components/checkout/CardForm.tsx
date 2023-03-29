import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useTranslations } from 'next-intl';
import { showLoaderAction } from '../../redux/layouts/actions';
import { useDispatch } from 'react-redux';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const siteUrl = publicRuntimeConfig.siteUrl;

const CardForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const t = useTranslations();
    const dispatch = useDispatch();

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
        const result = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: `${siteUrl}/completePayment`
            }
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
        }
    };
    return (
        <form onSubmit={handleSubmitPayment}>
            <CardElement />
            <button disabled={!stripe} className="gradient-btn mt-4">
                {t('Add Card')}
            </button>
        </form>
    );
};

export default CardForm;
// http://localhost:3000/complete?payment_intent=pi_3KfSI7DBSh7ykoyW1gVE9PYB&payment_intent_client_secret=pi_3KfSI7DBSh7ykoyW1gVE9PYB_secret_4TEHqYGEFBgtZhKMADW9cf3vn&redirect_status=succeeded
