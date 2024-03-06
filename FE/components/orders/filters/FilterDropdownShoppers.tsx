import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../../redux/layouts/selectors';
import { PaginationType } from '../../../constants';
import { setPaginationAction } from '../../../redux/layouts';
import Image from 'next/image';
import MultiselectDropdown from '../../_form/MultiselectDropdown';
import { filterDataSelector } from '../../../redux/orders/selectors';

type Props = {
    locale: string;
};

const FilterDropdownShoppers: React.FC<Props> = ({ locale }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.ORDERS)
    );

    // const options = [
    //     { label: 'foo', value: 'foo' },
    //     { label: 'bar', value: 'bar' },
    //     { label: 'jar', value: 'jar' },
    //     { label: 'nar', value: 'nar' },
    //     { label: 'mar', value: 'mar' },
    //     { label: 'far', value: 'far' }
    // ];
    // const options: any[] = [];

    const [selectedOptions, setSelectedOptions] = useState([]);
    const getOptionLabel = (option: any) => `${option.label}`;
    // const getOptionDisabled = (option: any) => option.value === 'foo';
    // const handleToggleOption = (selectedOptions: any) => setSelectedOptions(selectedOptions);
    const handleClearOptions = () => setSelectedOptions([]);
    const handleSelectAll = (isSelected: any) => {
        if (isSelected) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setSelectedOptions(options);
        } else {
            handleClearOptions();
        }
    };
    const filterData = useSelector(filterDataSelector);
    const [byerSelected, setByerSelected] = useState<any>(filters.country_id);
    const [showBlock, setShowBlock] = useState<boolean>(true);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const tmpOptions: any[] = [];
        if (filterData?.buyers) {
            filterData.buyers.map((item: any) => {
                tmpOptions.push({ label: item.buyer_first_name, value: item.buyer_id });
            });
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setOptions(tmpOptions);
    }, [filterData]);

    const handleToggleOption = (option: any) => {
        console.log('AAAAAA', option);
        if (option.length > 0) {
            setByerSelected([...byerSelected, parseInt(option[0].value)]);
            dispatch(
                setPaginationAction({
                    type: PaginationType.ORDERS,
                    modifier: {
                        filters: {
                            ...filters,
                            shopper_id: [...byerSelected, parseInt(option[0].value)]
                        },
                        offset: 0
                    }
                })
            );
        }
        // if (e.target.checked) {
        //     setByerSelected([...byerSelected, parseInt(e.target.value)]);
        //     dispatch(
        //         setPaginationAction({
        //             type: PaginationType.ORDERS,
        //             modifier: {
        //                 filters: {
        //                     ...filters,
        //                     shopper_id: [...byerSelected, parseInt(e.target.value)]
        //                 },
        //                 offset: 0
        //             }
        //         })
        //     );
        // } else {
        //     dispatch(
        //         setPaginationAction({
        //             type: PaginationType.ORDERS,
        //             modifier: {
        //                 filters: {
        //                     ...filters,
        //                     shopper_id: byerSelected.filter(
        //                         (id: any) => id !== parseInt(e.target.value)
        //                     )
        //                 },
        //                 offset: 0
        //             }
        //         })
        //     );
        //     setByerSelected(byerSelected.filter((id: any) => id !== parseInt(e.target.value)));
        // }
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
                    <div className="mt-0 mb-4 pt-1 overflow-auto max-h-36 relative max-w-sm mx-auto">
                        {showBlock && (
                            <>
                                <MultiselectDropdown
                                    noOptionsText={''}
                                    items={options}
                                    getOptionLabel={getOptionLabel}
                                    // getOptionDisabled={null}
                                    selectedValues={selectedOptions}
                                    label="Select complex values"
                                    placeholder="Placeholder for textbox"
                                    selectAllLabel="Select all"
                                    onToggleOption={handleToggleOption}
                                    onClearOptions={handleClearOptions}
                                    onSelectAll={handleSelectAll}
                                />
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default FilterDropdownShoppers;
