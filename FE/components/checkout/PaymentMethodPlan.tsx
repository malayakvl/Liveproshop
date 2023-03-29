/* eslint-disable jsx-a11y/label-has-associated-control */
import { Field } from 'formik';
import { useTranslations } from 'next-intl';
import { RadioCreditCard } from './';

const PaymentMethodPlan = () => {
    const t = useTranslations();

    return (
        <div role="group" aria-labelledby="shipping-method-radio-group">
            <Field
                type="radio"
                name="paymentMethod"
                value="card"
                title={t('Credit card')}
                component={RadioCreditCard}
            />

            <div className="flex space-x-2 sm:space-x-4 mt-8 text-gray-350 font-bold">
                <div className="flex-none">
                    <img width="50" height="50" src="/images/padlock.png" alt="Padlock" />
                </div>

                <div>
                    {t(
                        'We protect your payment information using encryption to provide bank-level security'
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodPlan;
