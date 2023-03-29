import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
    FilterPayment,
    FilterStatus,
    FilterAmount,
    FilterCountry,
    FilterDelivery,
    FilterNumber,
    FilterDate,
    FilterSeller,
    FilterDateRange
} from './index';
import { fetchFilerItems } from '../../redux/orders';
import { userSelector } from '../../redux/user/selectors';
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
    const user = useSelector(userSelector);
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
                type: PaginationType.ORDERS,
                modifier: {
                    filters: {
                        order_number: '',
                        shipping_id: [],
                        country_id: [],
                        payment_id: [],
                        status: [],
                        total_amount: [],
                        created_at: [],
                        seller_id: []
                    },
                    offset: 0
                }
            })
        );
    };

    return (
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
                <FilterNumber />

                <FilterDate />

                <FilterDateRange />

                {user.role_id === 3 && <FilterSeller />}

                <FilterAmount />

                <FilterStatus />

                <FilterPayment />

                <FilterCountry locale={locale} />

                <FilterDelivery />
            </div>
        </div>
    );
};

export default Filters;
