import React, { useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../../redux/layouts/selectors';
import { PaginationType } from '../../../constants';
import { setPaginationAction } from '../../../redux/layouts';
import { showDateSelectorAction } from '../../../redux/payments';
import { showDatePopupSelector } from '../../../redux/payments/selectors';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const FilterDateRange: React.FC<any> = () => {
    // const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.PAYMENTS)
    );
    const showDatePopup = useSelector(showDatePopupSelector);
    // const [showBlock, setShowBlock] = useState<boolean>(true);

    const [state, setState] = useState<any>([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);

    return (
        <>
            {showDatePopup && (
                <div className="filters-calendar">
                    <DateRangePicker
                        onChange={(item) => {
                            // console.log(item.selection);
                            setState([item.selection]);
                        }}
                        // showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={1}
                        ranges={state}
                        direction="horizontal"
                    />
                    <div className="w-full px-2 py-2 text-right">
                        <span
                            role="presentation"
                            onClick={() => {
                                dispatch(
                                    setPaginationAction({
                                        type: PaginationType.PAYMENTS,
                                        modifier: {
                                            filters: {
                                                ...filters,
                                                created_at: [
                                                    moment(state[0].startDate).format('YYYY-MM-DD'),
                                                    moment(state[0].endDate).format('YYYY-MM-DD')
                                                ]
                                            },
                                            offset: 0
                                        }
                                    })
                                );
                                dispatch(showDateSelectorAction(false));
                            }}
                            className="bg-blue-400 hover:bg-blue-500 text-white
                                            text-xs font-bold py-1 px-1.5 cursor-pointer
                                            rounded mr-3.5 mb-4">
                            Apply
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default FilterDateRange;
