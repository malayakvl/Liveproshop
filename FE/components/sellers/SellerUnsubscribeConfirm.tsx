import React, { useEffect } from 'react';
import { toggleModalPopup } from '../../lib/functions';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { showUnsubscribeConfirmFormSelector } from '../../redux/sellers/selectors';
import { unsubscribeSellerAction } from '../../redux/sellers/actions';
import { showUnsubscribeConfirmFormAction } from '../../redux/sellers';

const showUnsubscribeConfirmForm: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const showModal = useSelector(showUnsubscribeConfirmFormSelector);

    useEffect(() => {
        if (showModal) {
            toggleModalPopup('.modal-seller-confirm-unsubscribe');
        }
    }, [dispatch, showModal]);

    return (
        <div className="modal modal-seller-confirm-unsubscribe opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" />
            <div className="modal-container bg-white w-12/12 md:max-w-screen-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <div
                    className="modal-content py-4 text-left px-6 overflow-auto"
                    style={{ maxHeight: '90vh' }}>
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold" />
                        <div
                            className="modal-close cursor-pointer z-50"
                            role="presentation"
                            onClick={() => {
                                dispatch(showUnsubscribeConfirmFormAction(false));
                                toggleModalPopup('.modal-seller-confirm-unsubscribe');
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
                        <p className="text-xl font-bold px-5 pb-5">
                            {t('Are you sure you want unsubscribe seller?')}
                        </p>
                        <div className="flex">
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    className="cancel mr-2.5"
                                    onClick={() => {
                                        dispatch(showUnsubscribeConfirmFormAction(false));
                                        toggleModalPopup('.modal-seller-confirm-unsubscribe');
                                    }}>
                                    {t('Cancel')}
                                </button>
                                <button
                                    className="gradient-btn"
                                    onClick={() => {
                                        dispatch(showUnsubscribeConfirmFormAction(false));
                                        toggleModalPopup('.modal-seller-confirm-unsubscribe');
                                        dispatch(unsubscribeSellerAction());
                                    }}>
                                    {t('Yes')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default showUnsubscribeConfirmForm;
