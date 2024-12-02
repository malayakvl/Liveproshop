import { useTranslations } from 'next-intl';
import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMethodsAction, submitMethodsStatusesAction } from '../../redux/payments/actions';
import { methodsSelector } from '../../redux/payments/selectors';

const PaymentMethods: React.FC = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const methods: Payments.PaymentMethod[] = useSelector(methodsSelector);

    const [paymentMethods, setPaymentMethods] = useState<Payments.PaymentMethod[]>([]);

    useEffect(() => {
        dispatch(fetchMethodsAction());
    }, []);

    useEffect(() => {
        setPaymentMethods(methods.map((obj) => ({ ...obj })));
    }, [methods]);

    const handlerOnSave = useCallback(() => {
        const changedPaymentMethods = paymentMethods.filter(
            (method) =>
                method.status !==
                methods.find((item) => item.payment_id === method.payment_id)?.status
        );
        dispatch(submitMethodsStatusesAction(changedPaymentMethods));
    }, [paymentMethods]);

    return (
        <div className="text-sm text-gray-500 mt-4 min-w-max">
            {paymentMethods?.map((paymentMethod) => (
                <div key={paymentMethod.payment_id} className="flex space-x-2 items-center mb-2">
                    <div className="flex-none h-auto mr-2">
                        {paymentMethod?.name && (
                            <div
                                className={`pyment-method-icon ${paymentMethod?.name
                                    .replace(' ', '')
                                    .toLowerCase()}`}></div>
                        )}
                    </div>
                    <div className="flex-grow h-auto">{paymentMethod.name}</div>
                    {/*<div className="flex-none text-right">*/}
                    {/*    <label className="flex items-center cursor-pointer relative text-size">*/}
                    {/*        <input*/}
                    {/*            type="checkbox"*/}
                    {/*            className="sr-only"*/}
                    {/*            checked={paymentMethod.status}*/}
                    {/*            onChange={() => {*/}
                    {/*                paymentMethod.status = !paymentMethod.status;*/}
                    {/*                setPaymentMethods([...paymentMethods]);*/}
                    {/*            }}*/}
                    {/*        />*/}
                    {/*        <div className="toggle-bg bg-gray-200 border border-gray-200 rounded-full dark:bg-gray-700 dark:border-gray-600 w-11 h-6 shadow-inner" />*/}
                    {/*    </label>*/}
                    {/*</div>*/}
                </div>
            ))}

            <button onClick={handlerOnSave} className="w-full mt-8 gradient-btn">
                {t('Save changes')}
            </button>
        </div>
    );
};

export default PaymentMethods;
