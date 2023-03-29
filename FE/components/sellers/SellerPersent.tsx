import React, { useEffect } from 'react';
import { toggleModalPopup } from '../../lib/functions';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectedSellerSelector,
    sellerPrcentSelector,
    showPersentFormSelector
} from '../../redux/sellers/selectors';
import { showPersentFormAction } from '../../redux/sellers';
import * as Yup from 'yup';
import { InputText } from '../_form';
import { Formik } from 'formik';
import { updateSellerPercentAction } from '../../redux/sellers/actions';

const SellerPersent: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const showModal = useSelector(showPersentFormSelector);
    const selectedSeller = useSelector(selectedSellerSelector);
    const percent = useSelector(sellerPrcentSelector);
    useEffect(() => {
        if (showModal) {
            toggleModalPopup('.modal-seller-persent');
        }
    }, [dispatch, showModal]);

    const validationSchema = Yup.object().shape({
        transaction_percent: Yup.number()
    });

    return (
        <div className="modal modal-seller-persent opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" />
            <div className="modal-container bg-white w-12/12 md:max-w-screen-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <div
                    className="modal-content py-4 text-left px-6 overflow-auto"
                    style={{ maxHeight: '90vh' }}>
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">
                            {t('Transaction Percent')}: {selectedSeller}
                        </p>
                        <div
                            className="modal-close cursor-pointer z-50"
                            role="presentation"
                            onClick={() => {
                                dispatch(showPersentFormAction(false));
                                toggleModalPopup('.modal-seller-persent');
                            }}>
                            <img
                                src="/images/close-modal.svg"
                                className="fill-current text-black"
                                alt={''}
                            />
                        </div>
                    </div>

                    {/*Body*/}
                    <div>
                        <div className="flex">
                            <div className="flex justify-center">
                                <Formik
                                    enableReinitialize
                                    initialValues={{ transaction_percent: percent }}
                                    validationSchema={validationSchema}
                                    onSubmit={(values) => {
                                        const data: any = {
                                            email: selectedSeller,
                                            transaction_percent: values.transaction_percent
                                        };
                                        dispatch(updateSellerPercentAction(data));
                                    }}>
                                    {(props) => (
                                        <form onSubmit={props.handleSubmit} className="mb-4">
                                            <InputText
                                                style={null}
                                                icon={null}
                                                label={null}
                                                name={'transaction_percent'}
                                                placeholder={t('Transaction Percent')}
                                                props={props}
                                                tips={null}
                                            />

                                            <div className="mb-6">
                                                <button
                                                    className="gradient-btn w-full px-3 py-4 text-white bg-indigo-500 rounded-md
                                    hover:bg-indigo-600
                                    focus:outline-none duration-100 ease-in-out">
                                                    {t('Change')}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerPersent;
