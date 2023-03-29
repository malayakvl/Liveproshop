import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
    FilterPayment,
    FilterAmount,
    FilterNumber,
    FilterDate,
    FilterSeller,
    FilterDateRange
} from './index';
import { fetchFilerItems } from '../../redux/payments';
import { userSelector } from '../../redux/user/selectors';
import { setPaginationAction } from '../../redux/layouts';
import { OrderStatus, PaginationType } from '../../constants';

interface Props {
    handleHideFilter: () => void;
    filterOpen: boolean;
}

const Filters: React.FC<Props> = ({ handleHideFilter, filterOpen }) => {
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
                type: PaginationType.PAYMENTS,
                modifier: {
                    filters: {
                        order_number: '',
                        shipping_id: [],
                        country_id: [],
                        payment_id: [],
                        status: [OrderStatus.PAYED],
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
        // <div
        //     className="right-8 -top-14 bg-white absolute md:right-36 w-80 p-6 shadow-xl rounded-3xl filters"
        //     ref={node}>
        <div
            className={`${
                filterOpen ? '' : 'w-0 p-0'
            } fixed top-0 right-0 overflow-y-scroll fill-screen bg-white w-80 p-6 shadow-xl filters border min-h-screen max-h-screen`}
            ref={node}>
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

                {user.role_id === 3 && <FilterSeller />}

                <FilterDate />

                <FilterDateRange />

                <FilterAmount />

                <FilterPayment />
            </div>
        </div>
    );
};

export default Filters;
