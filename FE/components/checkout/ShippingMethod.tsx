/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormikContext, Field } from 'formik';
import { shippingMethodsCheckoutSelector } from '../../redux/checkout/selectors';
import { Radio } from './';
import { formatCurrency } from '../../lib/functions';

const ShippingMethod = ({ title, className }: { title: string; className: string }) => {
    const { setFieldValue }: any = useFormikContext();

    const shippingMethods = useSelector(shippingMethodsCheckoutSelector);

    useEffect(
        () => setFieldValue('shippingMethodId', String(shippingMethods[0]?.id ?? ''), false),
        [shippingMethods]
    );

    return !shippingMethods.length ? null : (
        <div className={className}>
            <div className="text-2xl font-bold text-gray-350 mb-6">{title}</div>
            <div role="group" aria-labelledby="shipping-method-radio-group">
                {shippingMethods.map((shippingMethod) => (
                    <Field
                        key={shippingMethod.id}
                        type="radio"
                        name="shippingMethodId"
                        value={String(shippingMethod.id)}
                        title={formatCurrency(shippingMethod.price)}
                        text={shippingMethod.name}
                        img={shippingMethod.image}
                        component={Radio}
                    />
                ))}
            </div>
        </div>
    );
};

export default ShippingMethod;
