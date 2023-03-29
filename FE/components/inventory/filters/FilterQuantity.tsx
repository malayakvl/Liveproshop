import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../../redux/layouts/selectors';
import { PaginationType } from '../../../constants';
import { setPaginationAction } from '../../../redux/layouts';
import Image from 'next/image';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { productAdditionalSelector } from '../../../redux/products/selectors';
import { isNumber } from '../../../lib/functions';
import { useDebouncedCallback } from 'use-debounce';

const FilterQuantity: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.PRODUCTS)
    );
    const filterData: Products.Root['additional'] = useSelector(productAdditionalSelector);
    const [showBlock, setShowBlock] = useState<boolean>(true);

    const [quantityRange, setQuantityRange] = useState<number[]>([]);

    useEffect(() => {
        if (filters.quantity.length === 0) {
            setQuantityRange([filterData.qtyRange.min, filterData.qtyRange.max]);
        } else {
            setQuantityRange(filters.quantity);
        }
    }, [filters.quantity, filterData.qtyRange]);

    const onSliderPriceChange = (_value: any) => {
        setQuantityRange(_value);
    };

    const changePriceDone = () => {
        if (
            quantityRange[0] == filterData.qtyRange.min &&
            quantityRange[1] == filterData.qtyRange.max
        ) {
            dispatch(
                setPaginationAction({
                    type: PaginationType.PRODUCTS,
                    modifier: {
                        filters: {
                            ...filters,
                            quantity: []
                        },
                        offset: 0
                    }
                })
            );
        } else {
            dispatch(
                setPaginationAction({
                    type: PaginationType.PRODUCTS,
                    modifier: {
                        filters: {
                            ...filters,
                            quantity: quantityRange
                        },
                        offset: 0
                    }
                })
            );
        }
    };

    const onSliderAfterChange = () => {
        changePriceDone();
    };

    const handleFocus = (e: any) => {
        e.target.select();
    };

    const debouncedChangePriceDone = useDebouncedCallback(() => {
        quantityRange[0] = isNumber(quantityRange[0]) ? +quantityRange[0] : filterData.qtyRange.min;
        quantityRange[1] = isNumber(quantityRange[1]) ? +quantityRange[1] : filterData.qtyRange.max;

        if (quantityRange[0] > filterData.qtyRange.max) quantityRange[0] = filterData.qtyRange.max;
        if (quantityRange[1] < filterData.qtyRange.min) quantityRange[1] = filterData.qtyRange.min;

        if (quantityRange[0] > quantityRange[1]) quantityRange[1] = quantityRange[0];

        changePriceDone();
    }, 1000);

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
                    <span className="ml-2 text-xs font-bold text-blue-350">{t('Quantity')}</span>
                </div>
                <div className="text-sm font-thin text-gray-450">
                    {quantityRange[0]} - {quantityRange[1]}
                </div>
            </div>
            {showBlock && (
                <>
                    <div className="block ml-2">
                        <span className="filter-label" style={{ marginLeft: '-4px' }}>
                            {t('Quantity')}
                            <em className="float-right">
                                {filterData.qtyRange.min} - {filterData.qtyRange.max}
                            </em>
                        </span>
                        <Range
                            allowCross={false}
                            step={1}
                            min={filterData.qtyRange.min}
                            max={filterData.qtyRange.max}
                            onChange={onSliderPriceChange}
                            onAfterChange={onSliderAfterChange}
                            value={quantityRange}
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
                                placeholder={String(filterData.qtyRange.min)}
                                onChange={(e) => {
                                    onSliderPriceChange([
                                        e.target.value.replace(/[^0-9]/g, ''),
                                        quantityRange[1]
                                    ]);
                                    debouncedChangePriceDone();
                                }}
                                onFocus={handleFocus}
                                value={quantityRange[0]}
                            />
                        </div>
                        <div className="w-1/2">
                            <div className="mb-3 text-xs font-bold text-blue-350">
                                {t('Maximum')}
                            </div>
                            <input
                                className="w-full form-control"
                                type="text"
                                placeholder={`${filterData.qtyRange.max}`}
                                onChange={(e) => {
                                    onSliderPriceChange([
                                        quantityRange[0],
                                        e.target.value.replace(/[^0-9]/g, '')
                                    ]);
                                    debouncedChangePriceDone();
                                }}
                                onFocus={handleFocus}
                                value={quantityRange[1]}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FilterQuantity;
