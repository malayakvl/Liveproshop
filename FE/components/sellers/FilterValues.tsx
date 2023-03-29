import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { paginationSelectorFactory } from '../../redux/layouts/selectors';
import { PaginationType } from '../../constants';
import { setPaginationAction } from '../../redux/layouts';
import { filterDataSelector } from '../../redux/sellers/selectors';

const FilterValues: React.FC<any> = () => {
    const dispatch = useDispatch();
    const t = useTranslations();

    const filterData = useSelector(filterDataSelector);
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.SELLERS)
    );

    const dataFetched = true;

    const handleBuyersDelete = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.SELLERS,
                modifier: {
                    filters: {
                        ...filters,
                        total_buyers: []
                    },
                    offset: 0
                }
            })
        );
    };

    const handleSessionsDelete = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.SELLERS,
                modifier: {
                    filters: {
                        ...filters,
                        total_sessions: []
                    },
                    offset: 0
                }
            })
        );
    };

    const handleOrdersDelete = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.SELLERS,
                modifier: {
                    filters: {
                        ...filters,
                        total_orders: []
                    },
                    offset: 0
                }
            })
        );
    };

    const handleCountryDelete = (dataId: number) => {
        dispatch(
            setPaginationAction({
                type: PaginationType.SELLERS,
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

    const handleTotalAmountDelete = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.SELLERS,
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
                type: PaginationType.SELLERS,
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
                    {filters.total_amount[1] && (
                        <div className="filter-value">
                            {t('Spent')}: {filters.total_amount[0]} - {filters.total_amount[1]}{' '}
                            &euro;
                            <em role="presentation" onClick={() => handleTotalAmountDelete()} />
                        </div>
                    )}
                    {filters.total_orders[1] && (
                        <div className="filter-value">
                            {t('Orders')}: {filters.total_orders[0]} - {filters.total_orders[1]}
                            <em role="presentation" onClick={() => handleOrdersDelete()} />
                        </div>
                    )}
                    {filters.total_sessions[1] && (
                        <div className="filter-value">
                            {t('Sessions')}: {filters.total_sessions[0]} -{' '}
                            {filters.total_sessions[1]}
                            <em role="presentation" onClick={() => handleSessionsDelete()} />
                        </div>
                    )}
                    {filters.total_buyers[1] && (
                        <div className="filter-value">
                            {t('Shoppers')}: {filters.total_buyers[0]} - {filters.total_buyers[1]}
                            <em role="presentation" onClick={() => handleBuyersDelete()} />
                        </div>
                    )}
                    {filters.created_at[1] && (
                        <div className="filter-value">
                            {t('Period')}: {filters.created_at[0]} - {filters.created_at[1]}
                            <em role="presentation" onClick={() => handlePeriodDelete()} />
                        </div>
                    )}
                    {filters.country_id.map((_item: any) => (
                        <div className="filter-value" key={_item}>
                            {filterData.countries.find((_r: any) => _r.id === _item).name}
                            <em role="presentation" onClick={() => handleCountryDelete(_item)} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default FilterValues;
