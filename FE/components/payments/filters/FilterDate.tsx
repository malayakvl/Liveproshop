import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../../redux/layouts/selectors';
import { PaginationType } from '../../../constants';
import { setPaginationAction } from '../../../redux/layouts';
import Image from 'next/image';
import { showDateSelectorAction } from '../../../redux/payments';
import { showDatePopupSelector } from '../../../redux/payments/selectors';

const FilterDate: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.PAYMENTS)
    );
    const showDatePopup = useSelector(showDatePopupSelector);
    const [showBlock, setShowBlock] = useState<boolean>(true);

    const clear = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.PAYMENTS,
                modifier: {
                    filters: {
                        ...filters,
                        created_at: []
                    },
                    offset: 0
                }
            })
        );
    };

    return (
        <>
            <div
                role="presentation"
                className="flex justify-between cursor-pointer border-b pb-3"
                onClick={() => setShowBlock(!showBlock)}>
                <div className="flex items-center">
                    <Image
                        width="10"
                        height="10"
                        src={'/images/lang-arrow.svg'}
                        className={showBlock ? 'rotate-180' : ''}
                    />
                    <span className="ml-2 text-xs font-bold text-blue-350">{t('Date')}</span>
                </div>
            </div>
            <div className="mt-3 mb-4 pt-1 overflow-auto max-h-36 relative max-w-sm mx-auto">
                {showBlock && (
                    <div className="relative">
                        <input
                            className="w-full form-control"
                            type="text"
                            placeholder={t('Date')}
                            readOnly={true}
                            onClick={() => {
                                dispatch(showDateSelectorAction(!showDatePopup));
                            }}
                            value={
                                filters.created_at.length > 0
                                    ? `${moment(filters.created_at[0]).format(
                                          'DD/MM/YYYY'
                                      )} - ${moment(filters.created_at[1]).format('DD/MM/YYYY')}`
                                    : ''
                            }
                        />

                        <i
                            role="presentation"
                            className="input-close cursor-pointer"
                            onClick={() => clear()}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default FilterDate;
