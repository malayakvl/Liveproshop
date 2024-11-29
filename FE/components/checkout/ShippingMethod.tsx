/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext, Field } from 'formik';
import {
    addressCheckoutSelector,
    orderCheckoutSelector,
    shippingMethodsCheckoutSelector
} from '../../redux/checkout/selectors';
import { Radio } from './';
import { formatCurrency } from '../../lib/functions';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/`;
import { showEmailNoticeSelector } from '../../redux/layouts/selectors';
import { userSelector } from '../../redux/user/selectors';
import { fetchShippingMethodsByCountryCheckoutAction } from '../../redux/checkout';

const ShippingMethod = ({ title, className }: { title: string; className: string }) => {
    const { setFieldValue }: any = useFormikContext();
    const user = useSelector(userSelector);
    const order = useSelector(orderCheckoutSelector) || {};
    const dispatch = useDispatch();

    const shippingMethods = useSelector(shippingMethodsCheckoutSelector);
    const address = useSelector(addressCheckoutSelector);

    // console.log('SHIPPING METHODS', shippingMethods);
    // console.log('USER', user);
    const showEmailNotice = useSelector(showEmailNoticeSelector);
    // const showEmailNotice = true;
    if (shippingMethods.length === 0 && address.country_id) {
        dispatch(fetchShippingMethodsByCountryCheckoutAction(order.id, address.country_id));
    }

    useEffect(() => {
        if (shippingMethods.length > 0) {
            setFieldValue(
                'shippingMethodId',
                String(address.shipping_id || shippingMethods[0]?.id),
                false
            );
        }
    }, [shippingMethods]);

    return !shippingMethods.length ? null : (
        <div className={className}>
            <div className="">
                <div className="text-2xl font-bold text-gray-350 mb-6">
                    {title}
                </div>
                <div role="group" aria-labelledby="shipping-method-radio-group">
                    {shippingMethods.map((shippingMethod) => (
                        <Field
                            key={shippingMethod.id}
                            type="radio"
                            name="shippingMethodId"
                            value={String(shippingMethod.id)}
                            title={formatCurrency(shippingMethod.price)}
                            text={shippingMethod.name}
                            img={baseUrl + shippingMethod.image}
                            component={Radio}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShippingMethod;
