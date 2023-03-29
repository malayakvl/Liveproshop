import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { paginationSelectorFactory } from '../../redux/layouts/selectors';
import { PaginationType } from '../../constants';
import { setPaginationAction } from '../../redux/layouts';
import { filterDataSelector } from '../../redux/buyers/selectors';

const FilterValues: React.FC<any> = () => {
    const dispatch = useDispatch();
    const t = useTranslations();

    const filterData = useSelector(filterDataSelector);
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.BUYERS)
    );

    const dataFetched = true;

    const handleCountryDelete = (dataId: number) => {
        dispatch(
            setPaginationAction({
                type: PaginationType.BUYERS,
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
                type: PaginationType.BUYERS,
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

    const handleBuyerNameDelete = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.BUYERS,
                modifier: {
                    filters: {
                        ...filters,
                        name: ''
                    },
                    offset: 0
                }
            })
        );
    };

    return (
        <>
            {dataFetched && (
                <div className="flex flex-wrap ml-8">
                    {filters?.name && (
                        <div className="filter-value">
                            {t('search_by', {
                                searchStr: filters.name
                            })}
                            <em role="presentation" onClick={handleBuyerNameDelete} />
                        </div>
                    )}
                    {filters?.total_amount[1] && (
                        <div className="filter-value">
                            {t('Spent')}: {filters.total_amount[0]} - {filters.total_amount[1]}{' '}
                            &euro;
                            <em role="presentation" onClick={handleTotalAmountDelete} />
                        </div>
                    )}
                    {/* {filters.payment_id.map((_item: any) => (
                        <div className="filter-value" key={_item}>
                            {filterData.payments.find((_r: any) => _r.id === _item).name}
                            <em role="presentation" onClick={() => handlePaymentDelete(_item)} />
                        </div>
                    ))} */}
                    {/* {filters.status.map((_item: any) => (
                        <div className="filter-value" key={_item}>
                            {t(_item)}
                            <em role="presentation" onClick={() => handleStatusDelete(_item)} />
                        </div>
                    ))} */}
                    {filters?.country_id.map((_item: any) => (
                        <div className="filter-value" key={_item}>
                            {filterData.countries.find((_r: any) => _r.id === _item).name}
                            <em role="presentation" onClick={() => handleCountryDelete(_item)} />
                        </div>
                    ))}
                    {/* {filters.shipping_id.map((_item: any) => (
                        <div className="filter-value" key={_item}>
                            {filterData.shippings.find((_r: any) => _r.id === _item).name}
                            <em role="presentation" onClick={() => handleShippingDelete(_item)} />
                        </div>
                    ))} */}
                </div>
            )}
        </>
    );
};

export default FilterValues;
