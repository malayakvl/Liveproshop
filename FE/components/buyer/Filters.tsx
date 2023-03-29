import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { FilterAmount, FilterName, FilterCountry, FilterBuyer } from './';
import { fetchFilerItems } from '../../redux/buyers';
import { setPaginationAction } from '../../redux/layouts';
import { PaginationType } from '../../constants';
import { FilterSeller } from '../buyer';
import { userSelector } from '../../redux/user/selectors';

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

    const reset = () => {
        dispatch(
            setPaginationAction({
                type: PaginationType.BUYERS,
                modifier: {
                    filters: {
                        name: '',
                        country_id: [],
                        total_amount: []
                    },
                    offset: 0
                }
            })
        );
    };

    const handleClick = (e: any) => {
        if (node?.current?.contains(e.target)) {
            return;
        }
        handleHideFilter();
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
                <FilterName />

                <FilterAmount />

                {user.role_id === 3 && <FilterSeller />}

                {user.role_id === 3 && <FilterBuyer />}

                <FilterCountry locale={locale} />
            </div>
        </div>
    );
};

export default Filters;
