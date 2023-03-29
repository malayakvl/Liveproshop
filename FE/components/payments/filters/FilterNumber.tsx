import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../../redux/layouts/selectors';
import { PaginationType } from '../../../constants';
import { setPaginationAction } from '../../../redux/layouts';
import Image from 'next/image';

const FilterNumber: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.PAYMENTS)
    );
    const [numberSelected, setNumberSelected] = useState<any>(filters.order_number);
    const [showBlock, setShowBlock] = useState<boolean>(true);

    const clear = () => {
        setNumberSelected('');
        dispatch(
            setPaginationAction({
                type: PaginationType.PAYMENTS,
                modifier: {
                    filters: {
                        ...filters,
                        order_number: ''
                    },
                    offset: 0
                }
            })
        );
    };

    const handleFocus = (e: any) => {
        e.target.select();
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
                    <span className="ml-2 text-xs font-bold text-blue-350">
                        {t('order_number')}
                    </span>
                </div>
            </div>
            <div className="mt-3 mb-4 pt-1 overflow-auto max-h-36 relative max-w-sm mx-auto">
                {showBlock && (
                    <div className="relative">
                        <input
                            className="w-full form-control"
                            type="text"
                            placeholder={t('order_number')}
                            onChange={(e) => {
                                setNumberSelected(e.target.value);
                            }}
                            onKeyUp={() => {
                                dispatch(
                                    setPaginationAction({
                                        type: PaginationType.PAYMENTS,
                                        modifier: {
                                            filters: {
                                                ...filters,
                                                order_number: numberSelected
                                            },
                                            offset: 0
                                        }
                                    })
                                );
                            }}
                            onFocus={handleFocus}
                            value={numberSelected}
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

export default FilterNumber;
