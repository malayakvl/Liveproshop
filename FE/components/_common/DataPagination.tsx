import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPaginationAction } from '../../redux/layouts';
import { paginationSelectorFactory } from '../../redux/layouts/selectors';
import { RawPagination } from '../../components/_common';
import { useTranslations } from 'next-intl';

interface Props {
    paginationType: Type.PaginationType;
    totalAmount: number;
    sendRequest: () => Promise<void>;
}

const DataPagination: React.FC<Props> = ({ paginationType, totalAmount, sendRequest }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { limit, sort, column, offset, query }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(paginationType)
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sendRequest().finally(() => setLoading(false));
    }, [limit, offset, sort, column, query]); // eslint-disable-line

    const setPage = useCallback(
        (currentPage) => {
            dispatch(
                setPaginationAction({
                    type: paginationType,
                    modifier: { offset: limit * currentPage.selected }
                })
            );
        },
        [paginationType, limit, dispatch]
    );

    const setLimit = useCallback(
        (event: React.SyntheticEvent): void => {
            const limit = Number((event.target as HTMLSelectElement).value);
            dispatch(setPaginationAction({ type: paginationType, modifier: { limit, offset: 0 } }));
        },
        [paginationType, dispatch]
    );

    return (
        <>
            {!loading && (
                <div className="flex justify-between w-full">
                    <div>
                        {totalAmount / limit > 1 && (
                            <select value={limit} onChange={setLimit} className="form-control">
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        )}
                    </div>
                    {totalAmount / limit > 1 && (
                        <RawPagination
                            forcePage={offset && offset / limit}
                            pageCount={Math.ceil(totalAmount / limit)}
                            onPageChange={setPage}
                        />
                    )}
                    <div className="pagination-total">
                        {Boolean(totalAmount) && (
                            <div className="dataTables_info" role="status">
                                {t('Showing')} {offset + 1} {t('to')}{' '}
                                {offset + limit > totalAmount ? totalAmount : offset + limit} of{' '}
                                {totalAmount} {t('entries')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default DataPagination;
