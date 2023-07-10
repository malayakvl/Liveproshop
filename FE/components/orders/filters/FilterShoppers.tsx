import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../../redux/layouts/selectors';
import { PaginationType } from '../../../constants';
import { setPaginationAction } from '../../../redux/layouts';
import Image from 'next/image';
import { filterDataSelector } from '../../../redux/orders/selectors';
import { parseTranslation } from '../../../lib/functions';

type Props = {
    locale: string;
};

const FilterShoppers: React.FC<Props> = ({ locale }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.ORDERS)
    );
    const filterData = useSelector(filterDataSelector);
    const [byerSelected, setByerSelected] = useState<any>(filters.country_id);
    const [showBlock, setShowBlock] = useState<boolean>(true);

    const handleitemFilter = (e: any) => {
        if (e.target.checked) {
            setByerSelected([...byerSelected, parseInt(e.target.value)]);
            dispatch(
                setPaginationAction({
                    type: PaginationType.ORDERS,
                    modifier: {
                        filters: {
                            ...filters,
                            shopper_id: [...byerSelected, parseInt(e.target.value)]
                        },
                        offset: 0
                    }
                })
            );
        } else {
            dispatch(
                setPaginationAction({
                    type: PaginationType.ORDERS,
                    modifier: {
                        filters: {
                            ...filters,
                            shopper_id: byerSelected.filter(
                                (id: any) => id !== parseInt(e.target.value)
                            )
                        },
                        offset: 0
                    }
                })
            );
            setByerSelected(byerSelected.filter((id: any) => id !== parseInt(e.target.value)));
        }
    };

    return (
        <>
            {filterData?.buyers?.length && (
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
                                {t('Shoppers')}
                            </span>
                        </div>
                        <div className="font-bold rounded-full text-center p-[2px] bg-green-250 text-xs h-5 w-5 text-white">
                            {byerSelected.length}
                        </div>
                    </div>
                    <div className="mt-3 mb-4 pt-1 overflow-auto max-h-36 relative max-w-sm mx-auto">
                        {showBlock && (
                            <>
                                {filterData.buyers.map((item: any) => (
                                    <span className="flex mb-2" key={item.buyer_id}>
                                        <input
                                            type="checkbox"
                                            id={`byer_${item.buyer_id}`}
                                            value={item.buyer_id}
                                            // checked={filters.country_id.includes(item.id)}
                                            onChange={(e) => handleitemFilter(e)}
                                        />
                                        <label
                                            className="text-xs text-blue-350 ml-3 font-bold flex"
                                            htmlFor={`buyer_${item.buyer_id}`}>
                                            {/*<Image*/}
                                            {/*    width="40"*/}
                                            {/*    height="24"*/}
                                            {/*    src={`/images/flags/${item.iso.toLowerCase()}.svg`}*/}
                                            {/*/>*/}
                                            <span className="inline-block text-sm ml-2">
                                                {item.buyer_first_name}
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

export default FilterShoppers;
