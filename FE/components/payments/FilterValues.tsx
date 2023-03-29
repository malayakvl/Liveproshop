import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { paginationSelectorFactory } from '../../redux/layouts/selectors';
import { PaginationType } from '../../constants';
import { setPaginationAction } from '../../redux/layouts';
import { filterDataSelector } from '../../redux/payments/selectors';

const FilterValues: React.FC<any> = () => {
    const dispatch = useDispatch();
    const t = useTranslations();

    const filterData = useSelector(filterDataSelector);
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.PAYMENTS)
    );

    const dataFetched = true;

    const handlePaymentDelete = (dataId: number) => {
        dispatch(
            setPaginationAction({
                type: PaginationType.PAYMENTS,
                modifier: {
                    filters: {
                        ...filters,
                        payment_id: filters.payment_id.filter((id: any) => id !== dataId)
                    },
                    offset: 0
                }
            })
        );
    };

    const handleTotalAmountDelete = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.PAYMENTS,
                modifier: {
                    filters: {
                        ...filters,
                        total_amount: []
                    },
                    offset: 0
                }
            })
        );
    };

    const handleOrderNumberDelete = () => {
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

    const handlePeriodDelete = () => {
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
            {dataFetched && (
                <div className="flex flex-wrap">
                    {filters.order_number && (
                        <div className="filter-value">
                            {t('search_by', {
                                searchStr: filters.order_number
                            })}
                            <em role="presentation" onClick={handleOrderNumberDelete} />
                        </div>
                    )}
                    {filters.total_amount[1] && (
                        <div className="filter-value">
                            {t('Spent')}: {filters.total_amount[0]} - {filters.total_amount[1]}{' '}
                            &euro;
                            <em role="presentation" onClick={handleTotalAmountDelete} />
                        </div>
                    )}
                    {filters.payment_id.map((_item: any) => (
                        <div className="filter-value" key={_item}>
                            {filterData.payments.find((_r: any) => _r.id === _item).name}
                            <em role="presentation" onClick={() => handlePaymentDelete(_item)} />
                        </div>
                    ))}
                    {filters.created_at[1] && (
                        <div className="filter-value">
                            {t('Period')}: {filters.created_at[0]} - {filters.created_at[1]}
                            <em role="presentation" onClick={handlePeriodDelete} />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default FilterValues;
