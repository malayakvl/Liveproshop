/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { useFormikContext, Field, ErrorMessage } from 'formik';
import { formatCurrency } from '../../lib/functions';
import { baseApiUrl, OrderStatus } from '../../constants';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const siteUrl = publicRuntimeConfig.siteUrl;
import {
    orderCheckoutSelector,
    shippingMethodsCheckoutSelector,
    waitItemsSelector
} from '../../redux/checkout/selectors';
import { removeItemOrderAction, minusItemOrderAction } from '../../redux/orders/actions';
import { useRouter } from 'next/router';
import { showEmailNoticeSelector } from '../../redux/layouts/selectors';

const OrderSummary = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const {
        values: { shippingMethodId }
    } = useFormikContext();
    const {
        query: { orderNumber }
    } = useRouter();

    const order = useSelector(orderCheckoutSelector) || {};
    const waitItems = useSelector(waitItemsSelector);

    const showEmailNotice = useSelector(showEmailNoticeSelector);
    // const showEmailNotice = true;

    const shippingMethods = useSelector(shippingMethodsCheckoutSelector);
    const selectedShippingMethod = useMemo(
        () => shippingMethods?.filter((item) => item.id === +shippingMethodId)[0],
        [shippingMethodId]
    );

    const recalculateTotal = (dataOrder: any) => {
        let totalOrder = 0;
        if (dataOrder.total_amount > 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            totalOrder += parseInt(order.total_amount);
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            totalOrder += parseInt(order.order_amount * 1.2);
        }
        // totalOrder = totalOrder.toFixed();
        if (selectedShippingMethod?.price) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            totalOrder += parseInt(selectedShippingMethod.price);
        }
        return formatCurrency(totalOrder);
    };

    useEffect(() => {
        recalculateTotal(order);
        if (order?.order_items) {
            order.order_items.sort((a: any, b: any) => (a.id > b.id ? 1 : -1));
        }
        // console.log(order.order_items.sort(compare));
    }, [order]);

    const removeItemOrder = (itemId: number) => {
        dispatch(removeItemOrderAction(itemId, orderNumber));
    };
    const munusQtyItemOrder = (itemId: number) => {
        dispatch(minusItemOrderAction(itemId));
    };

    const recalculateVat = (total: any, shipping: any) => {
        let vatAmount = 0;
        let totalAmount = 0;
        // (parseInt(order.order_amount) + 10) - ((parseInt(order.order_amount) + 10)/1.2)
        totalAmount = parseFloat(total) + parseFloat(shipping);
        vatAmount = (parseFloat(total) + parseFloat(shipping)) / 1.2;

        return formatCurrency(totalAmount - vatAmount);
    };
    console.log(order.order_items);

    return (
        <>
            {!order.order_items?.length && (
                <div className="relative">
                    <span className="empty-card"></span>
                    <span className="inline-block absolute top-[7px] left-[50px]">
                        {t('Your cart is empty')}
                    </span>
                </div>
            )}
            {order.order_items?.length && (
                <>
                    {waitItems.length > 0 && (
                        <div className="alert-success mb-5">
                            <p className="inbline-block mb-2">
                                The number of items added to your cart reflects stock availability
                            </p>
                            {waitItems.map((_waitProduct: any, key: number) => (
                                <div key={`item_wait_${_waitProduct.id}_${key}`}>
                                    {_waitProduct.configuration.name}&nbsp;
                                    {`# ${_waitProduct.configuration.sku}`}&nbsp;
                                    {_waitProduct.configuration.color_name}&nbsp;
                                    {`${t('quantity_wait')} ${_waitProduct.quantity}`}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="text-gray-350 font-normal text-lg">
                        {order.order_items?.length} {t('items in Cart')}
                    </div>
                    {order.order_items?.map((product: any, key: number) => (
                        <div
                            id={`item_${product.id}_${key}`}
                            key={product.id}
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
                                <span className="text-gray-350 text-sm font-bold">
                                    Ref. {product.sku}
                                </span>{' '}
                                {order.order_items?.length && (
                                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                    <span
                                        className="absolute right-[65px] cursor-pointer"
                                        onClick={() => {
                                            removeItemOrder(product.id);
                                        }}>
                                        <span className="delete-item-card" />
                                    </span>
                                )}
                                <span className="text-blue-350 text-sm">{product.product_id}</span>
                                <div className="text-gray-350 my-1 font-normal text-lg">
                                    {product.name}
                                </div>
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
                                    <div>
                                        <div className="inline-block relative">
                                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                                            {product.quantity > 1 ? (
                                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                                <span
                                                    className={`qty-minus cursor-pointer ${
                                                        product.quantity == 1 ? 'disabled' : ''
                                                    }`}
                                                    onClick={() => munusQtyItemOrder(product.id)}
                                                />
                                            ) : (
                                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                                <span className={`qty-minus disabled`} />
                                            )}
                                        </div>
                                        <span className="product-qty-input">
                                            {product.quantity}
                                        </span>
                                        <span className="inline-block ml-2">
                                            {formatCurrency(product.price)}
                                        </span>
                                    </div>
                                    <span className="hidden">
                                        {product.quantity} x {formatCurrency(product.price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {selectedShippingMethod && order.freeShipping != 1 ? (
                        <div className="flex justify-between my-2 text-gray-350 text-[18px] text-right">
                            {t('Shipping')}
                            <span className="inline-block ml-4 font-bold min-w-[3rem]">
                                {formatCurrency(selectedShippingMethod.price)}
                            </span>
                        </div>
                    ) : (
                        <div className="flex justify-between my-2 text-gray-350 text-[18px] text-right">
                            {t('Shipping')}
                            <span className="inline-block ml-4 font-bold min-w-[3rem]">
                                {formatCurrency(0)}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-350 text-[18px] text-right mt-6">
                        VAT (20%)
                        <span className="inline-block ml-4 font-bold min-w-[3rem]">
                            {recalculateVat(
                                order.total_amount,
                                selectedShippingMethod?.price ? selectedShippingMethod?.price : 0
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between my-6 py-6 text-gray-350 text-[30px] font-bold text-right border-t border-gray-200">
                        {t('Order total')}:
                        <span className="inline-block ml-4 font-bold min-w-[5rem]">
                            {recalculateTotal(order)}
                        </span>
                    </div>
                    <div className="col-span-2 my-6">
                        <Field
                            type="checkbox"
                            name="isAgreeTerms"
                            id="isAgreeTerms"
                            className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                        />
                        <label
                            htmlFor="isAgreeTerms"
                            className="ml-3 text-sm font-medium text-gray-700">
                            {t('I’ve read and agree with the')}{' '}
                            <a
                                href={`${siteUrl}/terms-and-conditions`}
                                target="_blank"
                                className="red-yellow-gradient-text"
                                rel="noreferrer">
                                {t('Terms of Service')}
                            </a>{' '}
                            and{' '}
                            <a
                                className="red-yellow-gradient-text"
                                href={`${siteUrl}/privacy`}
                                target="_blank"
                                rel="noreferrer">
                                {t('Privacy Terms')}
                            </a>
                            .
                        </label>
                        <ErrorMessage name="isAgreeTerms" component="div" className="error-el" />
                    </div>
                    {!showEmailNotice ? (
                        <button
                            type="submit"
                            disabled={order.status === OrderStatus.PAYED}
                            className={`uppercase my-4 gradient-btn w-full ${
                                showEmailNotice ? 'disabled-content' : ''
                            }`}>
                            <div className="inline-block relative">
                                <i className="card-icon-white" />
                            </div>
                            {order.status === OrderStatus.PAYED ? t('payed') : t('Pay')}{' '}
                            {recalculateTotal(order)}
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={true}
                            className={`uppercase my-4 gradient-btn w-full opacity-25`}>
                            <div className="inline-block relative">
                                <i className="card-icon-white" />
                            </div>
                            {order.status === OrderStatus.PAYED ? t('payed') : t('Pay')}{' '}
                            {recalculateTotal(order)}
                        </button>
                    )}
                </>
            )}
        </>
    );
};

export default OrderSummary;
