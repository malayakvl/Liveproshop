import React, { useEffect } from 'react';
import { toggleModalPopup } from '../../lib/functions';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectedSellerSelector,
    showPersentHistoryFormSelector,
    itemsHistorySelector
} from '../../redux/sellers/selectors';
import { showSellerPercentHistoryAction } from '../../redux/sellers';
import { fetchHistoryAction } from '../../redux/sellers/actions';
import moment from 'moment';

const SellerPersentHistory: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const showModal = useSelector(showPersentHistoryFormSelector);
    const selectedSeller = useSelector(selectedSellerSelector);
    const items = useSelector(itemsHistorySelector);

    useEffect(() => {
        if (showModal) {
            toggleModalPopup('.modal-seller-persent-history');
        }
    }, [dispatch, showModal]);

    useEffect(() => {
        if (selectedSeller) {
            dispatch(fetchHistoryAction(selectedSeller));
        }
    }, [selectedSeller]);

    return (
        <div className="modal modal-seller-persent-history opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" />
            <div className="modal-container bg-white w-12/12 md:max-w-screen-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <div
                    className="modal-close cursor-pointer z-50 ml-auto w-6"
                    role="presentation"
                    onClick={() => {
                        dispatch(showSellerPercentHistoryAction(false));
                        toggleModalPopup('.modal-seller-persent-history');
                    }}>
                    <img
                        src="/images/close-modal.svg"
                        className="fill-current text-black"
                        alt={''}
                    />
                </div>
                <div
                    className="modal-content pb-4 text-left px-6 overflow-auto"
                    style={{ maxHeight: '90vh' }}>
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">
                            {t('Transaction history')}: {selectedSeller}
                        </p>
                    </div>

                    {/*Body*/}
                    <div>
                        <div className="flex">
                            <div className="flex justify-center">
                                {items.length > 0 && (
                                    <table className="float-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Prev value</th>
                                                <th>Next value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item: any) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        {moment(item.created_at).format(
                                                            'DD.MM.YYYY HH:mm'
                                                        )}
                                                    </td>
                                                    <td>{item.percent_prev}%</td>
                                                    <td>{item.percent_next}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                {items.length === 0 && (
                                    <p className="text-base">{t('No history yet')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerPersentHistory;
