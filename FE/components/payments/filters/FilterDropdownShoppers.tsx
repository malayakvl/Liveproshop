import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../../redux/layouts/selectors';
import { PaginationType } from '../../../constants';
import { setPaginationAction } from '../../../redux/layouts';
import Image from 'next/image';
import { filterDataSelector } from '../../../redux/payments/selectors';
import { MultiSelect } from 'react-multi-select-component';

type Props = {
    locale: string;
};

const FilterDropdownShoppers: React.FC<Props> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.PAYMENTS)
    );

    const [selectedTest, setSelectedTest] = useState([]);

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

    useEffect(() => {
        const _tmBuyer: any[] = [];
        if (selectedTest.length > 0) {
            selectedTest.forEach((option: any) => {
                _tmBuyer.push(option.value);
            });
            setByerSelected(_tmBuyer);
            dispatch(
                setPaginationAction({
                    type: PaginationType.PAYMENTS,
                    modifier: {
                        filters: {
                            ...filters,
                            shopper_id: _tmBuyer
                        },
                        offset: 0
                    }
                })
            );
        } else {
            setByerSelected([]);
            dispatch(
                setPaginationAction({
                    type: PaginationType.PAYMENTS,
                    modifier: {
                        filters: {
                            ...filters,
                            shopper_id: []
                        },
                        offset: 0
                    }
                })
            );
        }
    }, [selectedTest]);

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
                    <div className="mt-0 mb-4 pt-1 overflow-auto max-h-36 max-w-sm mx-auto min-h-[150px]">
                        {showBlock && (
                            <>
                                <MultiSelect
                                    options={options}
                                    value={selectedTest}
                                    onChange={setSelectedTest}
                                    labelledBy="Select"
                                />

                                {/*<MultiselectDropdown*/}
                                {/*    noOptionsText={''}*/}
                                {/*    items={options}*/}
                                {/*    getOptionLabel={getOptionLabel}*/}
                                {/*    // getOptionDisabled={null}*/}
                                {/*    selectedValues={selectedOptions}*/}
                                {/*    label="Select complex values"*/}
                                {/*    placeholder="Placeholder for textbox"*/}
                                {/*    selectAllLabel="Select all"*/}
                                {/*    onToggleOption={handleToggleOption}*/}
                                {/*    onClearOptions={handleClearOptions}*/}
                                {/*    onSelectAll={handleSelectAll}*/}
                                {/*/>*/}
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default FilterDropdownShoppers;
