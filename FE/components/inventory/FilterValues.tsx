import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { productAdditionalSelector } from '../../redux/products/selectors';
import { prepareAdditionalDropdown } from '../../lib/functions';
import { paginationSelectorFactory } from '../../redux/layouts/selectors';
import { PaginationType } from '../../constants';
import { setPaginationAction } from '../../redux/layouts';

const FilterValues: React.FC<any> = (locale: string) => {
    const dispatch = useDispatch();
    const t = useTranslations();

    const additionalProps = useSelector(productAdditionalSelector);
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.PRODUCTS)
    );

    const [dataFetched, setDataFetched] = useState(false);
    const [filterAdditionals, setFilterAdditionals] = useState({});

    useEffect(() => {
        setFilterAdditionals({
            colors: prepareAdditionalDropdown(additionalProps.colors, locale),
            sizes: prepareAdditionalDropdown(additionalProps.sizes, locale)
        });
        setDataFetched(true);
    }, [additionalProps]);

    const handleColorDelete = (colorId: number) => {
        const colors = filters.color_id;
        dispatch(
            setPaginationAction({
                type: PaginationType.PRODUCTS,
                modifier: {
                    filters: {
                        ...filters,
                        color_id: colors.filter((id: any) => id !== colorId)
                    },
                    offset: 0
                }
            })
        );
    };

    const handleSizeDelete = (sizeId: number) => {
        const sizes = filters.size_id;
        dispatch(
            setPaginationAction({
                type: PaginationType.PRODUCTS,
                modifier: {
                    filters: {
                        ...filters,
                        size_id: sizes.filter((id: any) => id !== sizeId)
                    },
                    offset: 0
                }
            })
        );
    };

    const handlePriceDelete = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.PRODUCTS,
                modifier: {
                    filters: {
                        ...filters,
                        price: []
                    },
                    offset: 0
                }
            })
        );
    };

    const handleQtyDelete = () => {
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
    };

    const handleNameDelete = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.PRODUCTS,
                modifier: {
                    filters: {
                        ...filters,
                        product_name: ''
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
                    {filters.product_name && (
                        <div className="filter-value">
                            {t('search_by', {
                                searchStr: filters.product_name
                            })}
                            <em role="presentation" onClick={() => handleNameDelete()} />
                        </div>
                    )}
                    {filters.color_id.map((_color: any) => (
                        <div className="filter-value" key={_color}>
                            {
                                (filterAdditionals as any).colors.find(
                                    (color: any) => color.value === _color
                                )?.label
                            }
                            <em role="presentation" onClick={() => handleColorDelete(_color)} />
                        </div>
                    ))}
                    {filters.size_id.map((_size: any) => (
                        <div className="filter-value" key={_size}>
                            {
                                (filterAdditionals as any).sizes.find(
                                    (size: any) => size.value === _size
                                )?.label
                            }
                            <em role="presentation" onClick={() => handleSizeDelete(_size)} />
                        </div>
                    ))}
                    {(filters.price[0] > 0 || filters.price[1] > 0) && (
                        <div className="filter-value">
                            {t('price_between', {
                                min: filters.price[0],
                                max: filters.price[1],
                                currency: '€'
                            })}
                            <em role="presentation" onClick={() => handlePriceDelete()} />
                        </div>
                    )}
                    {(filters.quantity[0] > 0 || filters.quantity[1] > 0) && (
                        <div className="filter-value">
                            {t('qty_between', {
                                min: filters.quantity[0],
                                max: filters.quantity[1]
                            })}
                            <em role="presentation" onClick={() => handleQtyDelete()} />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default FilterValues;
