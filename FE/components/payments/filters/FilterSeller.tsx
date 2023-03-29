import React, { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { paginationSelectorFactory } from '../../../redux/layouts/selectors';
import { PaginationType } from '../../../constants';
import Image from 'next/image';
import ReactTags from 'react-tag-autocomplete';
import { findSellersAction } from '../../../redux/orders';
import { tagSellersSuggestionsSelector } from '../../../redux/orders/selectors';
import { setPaginationAction } from '../../../redux/layouts';

const FilterNumber: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.PAYMENTS)
    );
    const searchTagSuggestions = useSelector(tagSellersSuggestionsSelector);
    const [showBlock, setShowBlock] = useState<boolean>(true);
    const [tags, setTags] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isBusy, setIsBusy] = useState(false);
    const onDelete = useCallback(
        (tagIndex: number) => {
            const _sellers = tags.filter((_, i) => i !== tagIndex);
            setTags(tags.filter((_, i) => i !== tagIndex));
            dispatch(
                setPaginationAction({
                    type: PaginationType.PAYMENTS,
                    modifier: {
                        filters: {
                            ...filters,
                            seller_id: _sellers.map((v: any) => v.id)
                        },
                        offset: 0
                    }
                })
            );
        },
        [tags]
    );
    const onAddition = useCallback(
        (newTag) => {
            const _sellers = [...tags, newTag];
            setTags([...tags, newTag]);
            dispatch(
                setPaginationAction({
                    type: PaginationType.PAYMENTS,
                    modifier: {
                        filters: {
                            ...filters,
                            seller_id: _sellers.map((v: any) => v.id)
                        },
                        offset: 0
                    }
                })
            );
        },
        [tags]
    );
    const onInput = (query: string) => {
        if (!isBusy) {
            setIsBusy(true);
            dispatch(findSellersAction(query));
        }
    };
    useEffect(() => {
        setSuggestions(searchTagSuggestions);
        setIsBusy(false);
    }, [searchTagSuggestions]);

    return (
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
                    <span className="ml-2 text-xs font-bold text-blue-350">{t('Seller')}</span>
                </div>
            </div>
            <div className="mt-3 mb-4 pt-1 max-h-36 relative max-w-sm mx-auto">
                {showBlock && (
                    <div className="relative">
                        <div className="mb-4">
                            <label className="control-label">{t('Search')}</label>
                            <div className="relative">
                                {/*<em className="input-tips">{t('Select one')}</em>*/}
                                <ReactTags
                                    placeholderText={t('Search')}
                                    tags={tags}
                                    allowNew={false}
                                    suggestions={suggestions}
                                    onDelete={onDelete}
                                    onAddition={onAddition}
                                    onInput={onInput}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default FilterNumber;
