/* eslint-disable jsx-a11y/label-has-associated-control */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { useFormikContext, Field, ErrorMessage } from 'formik';
import { formatCurrency } from '../../lib/functions';
import { baseApiUrl, OrderStatus } from '../../constants';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const siteUrl = publicRuntimeConfig.siteUrl;
import {
    orderCheckoutSelector,
    shippingMethodsCheckoutSelector
} from '../../redux/checkout/selectors';

const OrderSummary = () => {
    const t = useTranslations();

    const {
        values: { shippingMethodId }
    } = useFormikContext();

    const order = useSelector(orderCheckoutSelector) || {};

    const shippingMethods = useSelector(shippingMethodsCheckoutSelector);
    const selectedShippingMethod = useMemo(
        () => shippingMethods?.filter((item) => item.id === +shippingMethodId)[0],
        [shippingMethodId]
    );

    const reaclculateTotal = (dataOrder: any) => {
        let totalOrder = 0;
        if (dataOrder.total_amount > 0) {
            totalOrder += order.total_amount;
        } else {
            totalOrder += order.order_amount * 1.2;
        }
        // totalOrder = totalOrder.toFixed();
        if (selectedShippingMethod?.price) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            totalOrder += parseInt(selectedShippingMethod.price);
        }
        return formatCurrency(totalOrder);
    };

    return (
        <>
            <div className="text-gray-350 font-normal text-lg">
                {order.order_items?.length} items in Cart
            </div>
            {order.order_items?.map((product: any) => (
                <div
                    key={product.product_id}
                    className="flex space-x-4 pb-12 my-12 border-b border-gray-200">
                    <img
                        width={85}
                        height={95}
                        src={
                            /(http(s?)):\/\//i.test(product.previewphoto)
                                ? product.previewphoto
                                : `${baseApiUrl}/${product.previewphoto}`
                        }
                        alt="Product preview"
                        className="product-photo"
                    />
                    <div className="flex-auto">
                        <span className="text-gray-350 text-sm font-bold">Ref. {product.sku}</span>{' '}
                        <span className="text-blue-350 text-sm">{product.product_id}</span>
                        <div className="text-gray-350 my-1 font-normal text-lg">{product.name}</div>
                        <div className="product-size">
                            {t('checkout_color')}:{' '}
                            <span className="font-bold">{product.color_name}</span>,{' '}
                            {t('checkout_size')}:{' '}
                            <span className="font-bold">{product.size_name}</span>
                        </div>
                        {product.description && (
                            <div
                                className="text-gray-350 font-normal text-sm hidden"
                                dangerouslySetInnerHTML={{
                                    __html: `${product.description.substring(0, 250)} ...`
                                }}
                            />
                        )}
                        <div className="text-lg text-right text-gray-350 font-bold mt-3">
                            {product.quantity} x {formatCurrency(product.price)}
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex justify-between text-gray-350 text-lg text-right -mt-6">
                VAT (20%)
                <span className="inline-block ml-4 font-bold min-w-[3rem]">
                    {formatCurrency(+order.order_amount * 0.2)}
                </span>
            </div>

            {selectedShippingMethod && (
                <div className="flex justify-between my-2 text-gray-350 text-lg text-right">
                    Shipping
                    <span className="inline-block ml-4 font-bold min-w-[3rem]">
                        {formatCurrency(selectedShippingMethod.price)}
                    </span>
                </div>
            )}

            <div className="flex justify-between my-6 py-6 text-gray-350 text-2xl text-right border-t border-gray-200">
                {t('Order total')}:
                <span className="inline-block ml-4 font-bold min-w-[5rem]">
                    {reaclculateTotal(order)}
                    {/*{formatCurrency(*/}
                    {/*    +(order.total_amount ? order.total_amount : (order.order_amount * 1.2 + (selectedShippingMethod?.price ? selectedShippingMethod?.price : 0)))*/}
                    {/*)}*/}
                </span>
            </div>

            <div className="col-span-2 my-6">
                <Field
                    type="checkbox"
                    name="isAgreeTerms"
                    id="isAgreeTerms"
                    className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="isAgreeTerms" className="ml-3 text-sm font-medium text-gray-700">
                    I’ve read and agree with the{' '}
                    <a
                        href={`${siteUrl}/terms-and-conditions`}
                        target="_blank"
                        className="red-yellow-gradient-text"
                        rel="noreferrer">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                        className="red-yellow-gradient-text"
                        href={`${siteUrl}/privacy`}
                        target="_blank"
                        rel="noreferrer">
                        Privacy Terms
                    </a>
                    .
                </label>
                <ErrorMessage name="isAgreeTerms" component="div" className="error-el" />
            </div>
            <button
                type="submit"
                disabled={order.status === OrderStatus.PAYED}
                className="uppercase my-4 gradient-btn w-full">
                {order.status === OrderStatus.PAYED ? t('payed') : t('Pay')}{' '}
                {reaclculateTotal(order)}
                {/*{order.status === OrderStatus.PAYED*/}
                {/*    ? t('payed').toLocaleUpperCase() +*/}
                {/*      ' ' +*/}
                {/*      formatCurrency(*/}
                {/*          +order.total_amount ? order.total_amount : order.order_amount * 1.2*/}
                {/*      )*/}
                {/*    : t('Pay') + ' ' + { reaclculateTotal(order) }}*/}
            </button>
        </>
    );
};

export default OrderSummary;
