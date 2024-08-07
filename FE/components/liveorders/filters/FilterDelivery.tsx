import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../../redux/layouts/selectors';
import { baseApiUrl, PaginationType } from '../../../constants';
import { setPaginationAction } from '../../../redux/layouts';
import Image from 'next/image';
import { filterDataSelector } from '../../../redux/orders/selectors';

const FilterDelivery: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.ORDERS)
    );
    const filterData = useSelector(filterDataSelector);
    const [countrySelected, setCountrySelected] = useState<any>(filters.payment_id);
    const [showBlock, setShowBlock] = useState<boolean>(true);

    const handleitemFilter = (e: any) => {
        if (e.target.checked) {
            setCountrySelected([...countrySelected, parseInt(e.target.value)]);
            dispatch(
                setPaginationAction({
                    type: PaginationType.ORDERS,
                    modifier: {
                        filters: {
                            ...filters,
                            shipping_id: [...countrySelected, parseInt(e.target.value)]
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
                            shipping_id: countrySelected.filter(
                                (id: any) => id !== parseInt(e.target.value)
                            )
                        },
                        offset: 0
                    }
                })
            );
            setCountrySelected(
                countrySelected.filter((id: any) => id !== parseInt(e.target.value))
            );
        }
    };

    return (
        <>
            {filterData.shippings.length > 0 && (
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
                                {t('Delivery')}
                            </span>
                        </div>
                        <div className="font-bold rounded-full text-center p-[2px] bg-green-250 text-xs h-5 w-5 text-white">
                            {filters.shipping_id.length}
                        </div>
                    </div>
                    <div className="mt-3 mb-4 pt-1 overflow-auto max-h-36 relative max-w-sm mx-auto">
                        {showBlock && (
                            <>
                                {filterData.shippings.map((item: any) => (
                                    <span className="block flex mb-2" key={item.id}>
                                        <input
                                            type="checkbox"
                                            id={`delivery_${item.id}`}
                                            value={item.id}
                                            checked={filters.shipping_id.includes(item.id)}
                                            onChange={(e) => handleitemFilter(e)}
                                        />
                                        <label
                                            className="text-xs text-blue-350 ml-3 font-bold flex"
                                            htmlFor={`delivery_${item.name}`}>
                                            <Image
                                                src={baseApiUrl + item.image}
                                                width={36}
                                                height={24}
                                                className=""
                                                alt=""
                                            />
                                            <span className="inline-block text-sm ml-2">
                                                {item.name}
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

export default FilterDelivery;
