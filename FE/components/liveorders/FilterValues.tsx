import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { paginationSelectorFactory } from '../../redux/layouts/selectors';
import { PaginationType } from '../../constants';
import { setPaginationAction } from '../../redux/layouts';
import { filterDataSelector } from '../../redux/orders/selectors';

const FilterValues: React.FC<any> = () => {
    const dispatch = useDispatch();
    const t = useTranslations();

    const filterData = useSelector(filterDataSelector);
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.ORDERS)
    );

    const dataFetched = true;

    const handleStatusDelete = (status: string) => {
        dispatch(
            setPaginationAction({
                type: PaginationType.ORDERS,
                modifier: {
                    filters: {
                        ...filters,
                        status: filters.status.filter((id: any) => id !== status)
                    },
                    offset: 0
                }
            })
        );
    };

    const handlePaymentDelete = (dataId: number) => {
        dispatch(
            setPaginationAction({
                type: PaginationType.ORDERS,
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

    const handleCountryDelete = (dataId: number) => {
        dispatch(
            setPaginationAction({
                type: PaginationType.ORDERS,
                modifier: {
                    filters: {
                        ...filters,
                        country_id: filters.country_id.filter((id: any) => id !== dataId)
                    },
                    offset: 0
                }
            })
        );
    };

    const handleShippingDelete = (dataId: number) => {
        dispatch(
            setPaginationAction({
                type: PaginationType.ORDERS,
                modifier: {
                    filters: {
                        ...filters,
                        shipping_id: filters.shipping_id.filter((id: any) => id !== dataId)
                    },
                    offset: 0
                }
            })
        );
    };

    const handleTotalAmountDelete = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.ORDERS,
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

    const handlePeriodDelete = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.ORDERS,
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

    const handleOrderNumberDelete = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.ORDERS,
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

    return (
        <>
            {dataFetched && (
                <div className="flex flex-wrap">
                    {filters.order_number && (
                        <div className="filter-value">
                            {t('search_by', {
                                searchStr: filters.order_number
                            })}
                            <em role="presentation" onClick={() => handleOrderNumberDelete()} />
                        </div>
                    )}
                    {filters.total_amount[1] && (
                        <div className="filter-value">
                            {t('Spent')}: {filters.total_amount[0]} - {filters.total_amount[1]}{' '}
                            &euro;
                            <em role="presentation" onClick={() => handleTotalAmountDelete()} />
                        </div>
                    )}
                    {filters.status.map((_item: any) => (
                        <div className="filter-value" key={_item}>
                            {t(_item)}
                            <em role="presentation" onClick={() => handleStatusDelete(_item)} />
                        </div>
                    ))}
                    {filters.payment_id.map((_item: any) => (
                        <div className="filter-value" key={_item}>
                            {filterData.payments.find((_r: any) => _r.id === _item).name}
                            <em role="presentation" onClick={() => handlePaymentDelete(_item)} />
                        </div>
                    ))}
                    {filters.country_id.map((_item: any) => (
                        <div className="filter-value" key={_item}>
                            {filterData.countries.find((_r: any) => _r.id === _item).name}
                            <em role="presentation" onClick={() => handleCountryDelete(_item)} />
                        </div>
                    ))}
                    {filters.shipping_id.map((_item: any) => (
                        <div className="filter-value" key={_item}>
                            {filterData.shippings.find((_r: any) => _r.id === _item).name}
                            <em role="presentation" onClick={() => handleShippingDelete(_item)} />
                        </div>
                    ))}
                    {filters.created_at[1] && (
                        <div className="filter-value">
                            {t('Period')}: {filters.created_at[0]} - {filters.created_at[1]}
                            <em role="presentation" onClick={() => handlePeriodDelete()} />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default FilterValues;
