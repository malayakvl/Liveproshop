import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import { FilterAmount, FilterNumber, FilterDate } from './index';
import { fetchFilerItems } from '../../redux/orders';

const Filters: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilerItems());
    }, []);

    return (
        <div className="-top-14 bg-white absolute right-36 w-80 p-6 shadow-xl rounded-3xl filters">
            <div className="pb-3 border-b flex justify-between mb-4">
                <div className="text-gray-350 font-bold text-xl">{t('Filters')}</div>
            </div>
            <div>
                <FilterNumber />

                <FilterDate />

                <FilterAmount />
            </div>
        </div>
    );
};

export default Filters;
