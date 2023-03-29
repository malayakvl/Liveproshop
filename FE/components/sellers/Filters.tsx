import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import {
    FilterAmount,
    FilterCountry,
    FilterDate,
    FilterBuyersCnt,
    FilterOrdersCnt,
    FilterSessionsCnt,
    FilterSeller,
    FilterDateRange
} from './index';
import { fetchFilerItems } from '../../redux/sellers';
import { setPaginationAction } from '../../redux/layouts';
import { PaginationType } from '../../constants';

interface Props {
    handleHideFilter: () => void;
    locale: string;
    filterOpen: boolean;
}

const Filters: React.FC<Props> = ({ handleHideFilter, locale, filterOpen }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const node = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(fetchFilerItems());

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    const handleClick = (e: any) => {
        if (node?.current?.contains(e.target)) {
            return;
        }
        handleHideFilter();
    };

    const reset = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.SELLERS,
                modifier: {
                    filters: {
                        country_id: [],
                        total_orders: [],
                        total_sessions: [],
                        total_buyers: [],
                        total_amount: [],
                        seller_id: [],
                        created_at: []
                    },
                    offset: 0
                }
            })
        );
    };

    return (
        // <div
        //     className="right-8 -top-14 bg-white absolute md:right-36 w-80 p-6 shadow-xl rounded-3xl filters"
        //     ref={node}>
        <div
            className={`${
                filterOpen ? '' : 'w-0 p-0'
            } fixed top-0 right-0 overflow-y-scroll fill-screen bg-white w-80 p-6 shadow-xl filters border min-h-screen max-h-screen`}
            ref={node}>
            <button
                className={`${filterOpen ? '' : 'hidden'} filter-close-desktop`}
                onClick={handleHideFilter}>
                <svg width="24" height="24" viewBox="0 0 24 24" role="presentation" className="">
                    <path
                        d="M10.294 9.698a.988.988 0 010-1.407 1.01 1.01 0 011.419 0l2.965 2.94a1.09 1.09 0 010 1.548l-2.955 2.93a1.01 1.01 0 01-1.42 0 .988.988 0 010-1.407l2.318-2.297-2.327-2.307z"
                        fill="currentColor"
                        fillRule="evenodd"></path>
                </svg>
            </button>
            <div className="pb-3 border-b flex justify-between mb-4">
                <div className="text-gray-350 font-bold text-xl">{t('Filters')}</div>
                <span
                    className="float-right text-sm mt-1.5 text-gray-350 presentaion cursor-pointer"
                    role="presentation"
                    onClick={() => reset()}>
                    {t('Reset')}
                </span>
            </div>
            <div>
                <FilterDate />

                <FilterDateRange />

                <FilterAmount />

                <FilterSeller />

                <FilterOrdersCnt />

                <FilterBuyersCnt />

                <FilterSessionsCnt />

                <FilterCountry locale={locale} />
            </div>
        </div>
    );
};

export default Filters;
