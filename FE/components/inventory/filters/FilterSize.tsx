import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../../redux/layouts/selectors';
import { PaginationType } from '../../../constants';
import { setPaginationAction } from '../../../redux/layouts';
import Image from 'next/image';
import { productAdditionalSelector } from '../../../redux/products/selectors';

const FilterSize: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.PRODUCTS)
    );
    const filterData = useSelector(productAdditionalSelector);
    const [sizeSelected, setSizeSelected] = useState<any>(filters.size_id);
    const [showBlock, setShowBlock] = useState<boolean>(true);

    const handleitemFilter = (e: any) => {
        if (e.target.checked) {
            setSizeSelected([...sizeSelected, parseInt(e.target.value)]);
            dispatch(
                setPaginationAction({
                    type: PaginationType.PRODUCTS,
                    modifier: {
                        filters: {
                            ...filters,
                            size_id: [...sizeSelected, parseInt(e.target.value)]
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
                            size_id: sizeSelected.filter(
                                (id: any) => id !== parseInt(e.target.value)
                            )
                        },
                        offset: 0
                    }
                })
            );
            setSizeSelected(sizeSelected.filter((id: any) => id !== parseInt(e.target.value)));
        }
    };

    return (
        <>
            {filterData.sizes.length > 0 && (
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
                                {t('Size')}
                            </span>
                        </div>
                        <div className="font-bold rounded-full text-center p-[2px] bg-green-250 text-xs h-5 w-5 text-white">
                            {filters.size_id.length}
                        </div>
                    </div>
                    <div className="mt-3 mb-4 pt-1 overflow-auto max-h-36 relative max-w-sm mx-auto">
                        {showBlock && (
                            <div className="flex flex-wrap">
                                {filterData.sizes.map((item: any) => (
                                    <div className="w-1/2" key={item.id}>
                                        <span className="block flex mb-2">
                                            <input
                                                type="checkbox"
                                                id={`size_${item.id}`}
                                                value={item.id}
                                                checked={filters.size_id.includes(item.id)}
                                                onChange={(e) => handleitemFilter(e)}
                                            />
                                            <label
                                                className="text-xs text-blue-350 ml-3 font-bold flex"
                                                htmlFor={`size_${item.name}`}>
                                                <span className="inline-block text-sm ml-2">
                                                    {item.name}
                                                </span>
                                            </label>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default FilterSize;
