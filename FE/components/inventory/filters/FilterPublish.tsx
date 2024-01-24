import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../../redux/layouts/selectors';
import { PaginationType } from '../../../constants';
import { setPaginationAction } from '../../../redux/layouts';
import Image from 'next/image';

const FilterPublish: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.PRODUCTS)
    );
    // const [publish, setSearchSelected] = useState<any>(filters.publish);
    const [showBlock, setShowBlock] = useState<boolean>(true);

    const handleChangeFilter = (e: any) => {
        if (e.target.checked) {
            dispatch(
                setPaginationAction({
                    type: PaginationType.PRODUCTS,
                    modifier: {
                        filters: {
                            ...filters,
                            publish: true
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
                            publish: null
                        },
                        offset: 0
                    }
                })
            );
        }
    };

    const clear = () => {
        // setSearchSelected('');
        dispatch(
            setPaginationAction({
                type: PaginationType.PRODUCTS,
                modifier: {
                    filters: {
                        ...filters,
                        publish: null
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
                        {t('Published products')}
                    </span>
                </div>
            </div>
            <div className="mt-3 mb-4 pt-1 overflow-auto max-h-36 relative max-w-sm mx-auto">
                {showBlock && (
                    <div className="w-1/2">
                        <span className="flex mb-2">
                            <input
                                type="checkbox"
                                id={`publish`}
                                value={1}
                                checked={filters.publish}
                                onChange={(e) => handleChangeFilter(e)}
                            />
                            <label
                                className="text-xs text-blue-350 ml-3 font-bold flex"
                                htmlFor={`publish`}>
                                <span className="inline-block text-sm ml-2">{t('Yes')}</span>
                            </label>
                        </span>
                    </div>
                )}
            </div>
        </>
    );
};

export default FilterPublish;
