import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../redux/layouts/selectors';
import { PaginationType } from '../../constants';
import { setPaginationAction } from '../../redux/layouts';
import Image from 'next/image';

const FilterStatus: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.PAYMENTS)
    );
    const [statusSelected, setStatusSelected] = useState<any>(filters.status);
    const [showBlock, setShowBlock] = useState<boolean>(true);
    const filterStatuses = ['new', 'payed', 'overdue'];

    const handleStatusFilter = (e: any) => {
        if (e.target.checked) {
            setStatusSelected([...statusSelected, e.target.value]);
            dispatch(
                setPaginationAction({
                    type: PaginationType.PAYMENTS,
                    modifier: {
                        filters: {
                            ...filters,
                            status: [...statusSelected, e.target.value]
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
                            status: statusSelected.filter((id: any) => id !== e.target.value)
                        },
                        offset: 0
                    }
                })
            );
            setStatusSelected(statusSelected.filter((id: any) => id !== e.target.value));
        }
    };

    return (
        <>
            <div
                role="presentation"
                className="flex justify-between mb-3 cursor-pointer border-b pb-3"
                onClick={() => setShowBlock(!showBlock)}>
                <div className="flex items-center">
                    <Image width="10" height="10" src={'/images/lang-arrow.svg'} />
                    <span className="ml-2 text-xs font-bold text-blue-350">{t('Status')}</span>
                </div>
                <div className="font-bold rounded-full text-center p-[2px] bg-green-250 text-xs h-5 w-5 text-white">
                    {filters.status.length}
                </div>
            </div>
            <div className="mb-4">
                {showBlock && (
                    <>
                        {filterStatuses.map((status) => (
                            <span className="block" key={status}>
                                <input
                                    type="checkbox"
                                    id={`status_${status}`}
                                    value={status}
                                    checked={filters.status.includes(status)}
                                    onChange={(e) => handleStatusFilter(e)}
                                />
                                <label
                                    className="text-xs text-blue-350 ml-3 font-bold"
                                    htmlFor={`status_${status}`}>
                                    {status}
                                </label>
                            </span>
                        ))}
                    </>
                )}
            </div>
        </>
    );
};

export default FilterStatus;
