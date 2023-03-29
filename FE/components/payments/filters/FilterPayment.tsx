import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../../redux/layouts/selectors';
import { filterDataSelector } from '../../../redux/payments/selectors';
import { PaginationType } from '../../../constants';
import { setPaginationAction } from '../../../redux/layouts';
import Image from 'next/image';

const FilterPayment: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.PAYMENTS)
    );
    const filterData = useSelector(filterDataSelector);
    const [paymentSelected, setPaymentSelected] = useState<any>(filters.payment_id);
    const [showBlock, setShowBlock] = useState<boolean>(true);

    const handleitemFilter = (e: any) => {
        if (e.target.checked) {
            setPaymentSelected([...paymentSelected, parseInt(e.target.value)]);
            dispatch(
                setPaginationAction({
                    type: PaginationType.PAYMENTS,
                    modifier: {
                        filters: {
                            ...filters,
                            payment_id: [...paymentSelected, parseInt(e.target.value)]
                        },
                        offset: 0
                    }
                })
            );
        } else {
            dispatch(
                setPaginationAction({
                    type: PaginationType.PAYMENTS,
                    modifier: {
                        filters: {
                            ...filters,
                            payment_id: paymentSelected.filter(
                                (id: any) => id !== parseInt(e.target.value)
                            )
                        },
                        offset: 0
                    }
                })
            );
            setPaymentSelected(
                paymentSelected.filter((id: any) => id !== parseInt(e.target.value))
            );
        }
    };

    return (
        <>
            {filterData.payments.length > 0 && (
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
                                {t('Payments')}
                            </span>
                        </div>
                        <div className="font-bold rounded-full text-center p-[2px] bg-green-250 text-xs h-5 w-5 text-white">
                            {filters.payment_id.length}
                        </div>
                    </div>
                    <div className="mt-3 mb-2 pt-1 overflow-auto max-h-36 relative max-w-sm mx-auto">
                        {showBlock && (
                            <>
                                {filterData.payments.map((item: any) => (
                                    <span className="flex mb-2" key={item.id}>
                                        <input
                                            type="checkbox"
                                            id={`payment_${item.id}`}
                                            value={item.id}
                                            checked={filters.payment_id.includes(item.id)}
                                            onChange={(e) => handleitemFilter(e)}
                                        />
                                        <label
                                            className="text-xs text-blue-350 ml-3 font-bold flex"
                                            htmlFor={`payment_${item.name}`}>
                                            <Image
                                                width="40"
                                                height="24"
                                                src={`/images/payments/${item.short_name}.svg`}
                                            />
                                            <span className="inline-block text-sm ml-2">
                                                {item.name}
                                            </span>
                                        </label>
                                    </span>
                                ))}
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default FilterPayment;
