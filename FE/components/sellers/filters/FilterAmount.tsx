import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../../redux/layouts/selectors';
import { PaginationType } from '../../../constants';
import { setPaginationAction } from '../../../redux/layouts';
import Image from 'next/image';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { filterDataSelector } from '../../../redux/sellers/selectors';
import { formatCurrency, isNumber } from '../../../lib/functions';

const FilterAmount: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.SELLERS)
    );
    const filterData = useSelector(filterDataSelector);
    const [showBlock, setShowBlock] = useState<boolean>(true);

    const [priceRange, setPriceRange] = useState(
        filters.total_amount[0] > 0 || filters.total_amount[1] > 0 ? filters.total_amount : [0, 0]
    );

    const onSliderPriceChange = (_value: any) => {
        setPriceRange(_value);
    };

    useEffect(() => {
        if (filters.total_amount.length === 0) {
            setPriceRange([0, 0]);
        } else {
            setPriceRange(filters.total_amount);
        }
    }, [filters.total_amount]);

    const changePriceDone = () => {
        if (isNumber(priceRange[0]) && isNumber(priceRange[1])) {
            if (priceRange[0] !== priceRange[1]) {
                dispatch(
                    setPaginationAction({
                        type: PaginationType.SELLERS,
                        modifier: {
                            filters: {
                                ...filters,
                                total_amount: priceRange
                            },
                            offset: 0
                        }
                    })
                );
            } else if (priceRange[0] === priceRange[1] && priceRange[0] === 0) {
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
            }
        }
    };

    const onSliderAfterChange = () => {
        changePriceDone();
    };

    const handleFocus = (e: any) => {
        e.target.select();
    };

    return (
        <div className="mb-4">
            <div
                role="presentation"
                className="flex justify-between mb-2 mt-3 cursor-pointer"
                onClick={() => setShowBlock(!showBlock)}>
                <div className="flex items-center">
                    <Image
                        width="10"
                        height="10"
                        src={'/images/lang-arrow.svg'}
                        className={showBlock ? 'rotate-180' : ''}
                    />
                    <span className="ml-2 text-xs font-bold text-blue-350">{t('Revenue')}</span>
                </div>
                <div className="text-sm font-thin text-gray-450">
                    {priceRange[0]} - {priceRange[1]} &euro;
                </div>
            </div>
            {showBlock && (
                <>
                    <div className="block ml-2">
                        <span className="filter-label" style={{ marginLeft: '-4px' }}>
                            {t('Revenue')}
                            <em className="float-right">
                                {priceRange[0]} - {filterData.amounts[1]}
                                &euro;
                            </em>
                        </span>
                        <Range
                            allowCross={false}
                            step={1}
                            min={0}
                            max={filterData.amounts[1]}
                            onChange={onSliderPriceChange}
                            onAfterChange={onSliderAfterChange}
                            value={priceRange}
                        />
                    </div>
                    <div className="flex mt-1">
                        <div className="w-1/2 mr-2">
                            <div className="mb-3 text-xs font-bold text-blue-350">
                                {t('Minimum')}
                            </div>
                            <input
                                className="w-full form-control"
                                type="text"
                                placeholder={formatCurrency(0)}
                                onChange={(e) => {
                                    onSliderPriceChange([
                                        e.target.value.replace(/[^0-9]/g, ''),
                                        priceRange[1]
                                    ]);
                                }}
                                onFocus={handleFocus}
                                onKeyUp={() => changePriceDone()}
                                value={priceRange[0]}
                            />
                        </div>
                        <div className="w-1/2">
                            <div className="mb-3 text-xs font-bold text-blue-350">
                                {t('Maximum')}
                            </div>
                            <input
                                className="w-full form-control"
                                type="text"
                                placeholder={formatCurrency(filterData.amounts[1])}
                                onChange={(e) => {
                                    onSliderPriceChange([
                                        priceRange[0],
                                        e.target.value.replace(/[^0-9]/g, '')
                                    ]);
                                }}
                                onFocus={handleFocus}
                                onKeyUp={() => changePriceDone()}
                                value={priceRange[1]}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FilterAmount;
