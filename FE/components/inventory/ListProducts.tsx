import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { DataTable, ButtonTableAction } from '../../components/_common';
import { PaginationType } from '../../constants';
import {
    checkedIdsSelector,
    paginationSelectorFactory,
    switchHeaderSelector
} from '../../redux/layouts/selectors';
import { checkIdsAction, initIdsAction } from '../../redux/layouts';
import {
    paginatedProductsSelector,
    productsCountSelector,
    copyIdsSelector
} from '../../redux/products/selectors';
import {
    fetchProductsAction,
    bulkDeleteAction,
    bulkCopyAction,
    fetchProductAction,
    deleteProductAction,
    copyProductAction
} from '../../redux/products/actions';
import { baseApiUrl } from '../../constants';
import { setModalConfirmationMetaAction } from '../../redux/layouts';
import { BanIcon } from '@heroicons/react/solid';
import { setActivePageAction } from '../../redux/layouts/actions';
import Image from 'next/image';
import { Filters, FilterValues } from './index';
import { formatCurrency } from '../../lib/functions';

const ListProducts: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const count = useSelector(productsCountSelector);
    const copyIds = useSelector(copyIdsSelector);
    const items = useSelector(paginatedProductsSelector);
    const checkedIds = useSelector(checkedIdsSelector);
    const switchAllHeader = useSelector(switchHeaderSelector);
    const [showMoreConfigs, setShowMoreConfigs] = useState<any>({});

    const [filterOpen, setFilterOpen] = useState(false);
    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.PRODUCTS)
    );

    const sendRequest = useCallback(() => {
        return dispatch(fetchProductsAction());
    }, [dispatch]);

    const sendDeleteRequest = useCallback(() => {
        return dispatch(bulkDeleteAction());
    }, [dispatch]);

    const sendCopyRequest = useCallback(() => {
        return dispatch(bulkCopyAction());
    }, [dispatch]);

    useEffect(() => {
        if (switchAllHeader) {
            const nextCheckedItems = { ...showMoreConfigs };
            items.forEach((item: Products.ProductItem) => {
                nextCheckedItems[item.id] = true;
            });
            setShowMoreConfigs(nextCheckedItems);
        } else {
            setShowMoreConfigs({});
        }
        // const nextCheckedItems = { ...showMoreConfigs };
    }, [switchAllHeader]);

    useEffect(() => {
        const setupChecked: any = [];
        items.forEach((item: Products.ProductItem) => {
            setupChecked.push({ id: item.id, checked: false });
        });
        dispatch(initIdsAction(setupChecked));
    }, [items]);

    const handleDuplicateBtnClick = useCallback(
        (event: React.SyntheticEvent): void => {
            const id = Number(event.currentTarget.getAttribute('data-id'));
            dispatch(copyProductAction(id));
        },
        [dispatch]
    );

    const handleDeleteBtnClick = useCallback(
        (event: React.SyntheticEvent): void => {
            const id = Number(event.currentTarget.getAttribute('data-id'));
            dispatch(
                setModalConfirmationMetaAction({
                    onConfirm: async () => dispatch(deleteProductAction(id)).then(sendRequest)
                })
            );
        },
        [dispatch, sendRequest]
    );
    const handleEditBtnClick = useCallback(
        (event: React.SyntheticEvent): void => {
            const id = Number(event.currentTarget.getAttribute('data-id'));
            // dispatch(setActiveTabAction('edit'));
            dispatch(
                setActivePageAction({
                    type: 'inventory',
                    modifier: 'edit'
                })
            );
            dispatch(fetchProductAction(id));
        },
        [items, dispatch]
    );

    const handleShowMore = (productId: number) => {
        const nextCheckedItems = { ...showMoreConfigs };
        nextCheckedItems[productId] = !nextCheckedItems[productId];
        setShowMoreConfigs(nextCheckedItems);
    };

    const renderConfigurationColors = (configuration: any, productId: number) => {
        return (
            <table className="table-configuration w-full">
                <tbody>
                    {configuration.map((config: any, i: number) => (
                        <tr
                            key={config.color_code}
                            className={i > 0 && !showMoreConfigs[productId] ? 'hidden' : ''}>
                            <td style={{ textAlign: 'center', width: '25px' }}>
                                <div
                                    className="rounded-full w-3 h-3 inline-block mr-1"
                                    style={{ backgroundColor: `${config.color_code}` }}
                                />
                            </td>
                            <td style={{ padding: '0' }}>
                                <table className="w-full">
                                    <tbody>
                                        {config.configuration.map((_config: any) => (
                                            <tr key={_config.size_name}>
                                                <td style={{ textAlign: 'center', width: '70px' }}>
                                                    {_config.size_name}
                                                </td>
                                                <td style={{ textAlign: 'center', width: '100px' }}>
                                                    {_config.quantity}
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {formatCurrency(_config.price)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const handleHideFilter = useCallback(() => {
        setFilterOpen(false);
    }, []);

    return (
        <>
            <div className="mt-7">
                <div className="flex border border-l-0 border-r-0 border-t-0 pb-5 mb-10 relative">
                    <h2 className="dark-blue-header">
                        {t('Products')}
                        <span className="text-gray-180 font-normal text-sm"> {count} items</span>
                    </h2>
                    {/*{filterOpen && <Filters />}*/}
                    <Filters filterOpen={filterOpen} handleHideFilter={handleHideFilter} />
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="absolute top-0 right-0 flex items-center text-sm border rounded-lg px-4 py-1">
                        <Image width={16} height={16} src={'/images/filter.svg'} />
                        <div className="font-medium text-gray-400 ml-2">{t('Filters')}</div>
                        <div className="ml-2 font-bold rounded-full p-[2px] text-center bg-gray-400 text-xs h-5 w-5 text-white">
                            {filters.color_id.length +
                                filters.size_id.length +
                                !!filters.price.length +
                                !!filters.quantity.length +
                                (filters.product_name ? 1 : 0)}
                        </div>
                    </button>
                </div>
                <div className="mb-5">
                    <FilterValues />
                </div>
                <DataTable
                    paginationType={PaginationType.PRODUCTS}
                    totalAmount={count}
                    sendRequest={sendRequest}
                    sendDeleteRequest={sendDeleteRequest}
                    sendCopyRequest={sendCopyRequest}>
                    {items?.map((item: any) => (
                        <tr key={item.id} className={copyIds.includes(item.id) ? 'copied-row' : ''}>
                            <td className="dropdown-action">
                                <input
                                    className="float-checkbox"
                                    type="checkbox"
                                    onChange={() => dispatch(checkIdsAction(item.id))}
                                    value={item.id}
                                    checked={
                                        checkedIds.find((data: any) => data.id === item.id)
                                            ?.checked || false
                                    }
                                />
                            </td>
                            <td className="toggler-action">
                                <button
                                    className="dropdown-toggler"
                                    style={{ marginRight: '25px' }}
                                    onClick={() => handleShowMore(item.id)}
                                />
                            </td>
                            {/*<td style>*/}
                            {/*    <button*/}
                            {/*        className="dropdown-toggler"*/}
                            {/*        onClick={() => handleShowMore(item.id)}*/}
                            {/*    />*/}
                            {/*</td>*/}
                            <td style={{ width: '150px' }}>
                                {item.previewphoto && (
                                    <img
                                        src={
                                            /(http(s?)):\/\//i.test(item.previewphoto)
                                                ? item.previewphoto
                                                : `${baseApiUrl}/${item.previewphoto}`
                                        }
                                        alt=""
                                        className="object-scale-down h-[95px] w-[85px] rounded-lg border p-1.5"
                                    />
                                )}
                                {!item.previewphoto && (
                                    <div className="border rounded-lg w-[85px] h-[95px] block flex items-center text-center">
                                        <BanIcon
                                            width={30}
                                            height={30}
                                            className="m-auto text-gray-200"
                                        />
                                    </div>
                                )}
                            </td>
                            <td>
                                <span className="text-gray-180 text-sm">Ref.</span>{' '}
                                <span className="text-blue-350">{item.id}</span> <br />
                                <span className="text-[18px]">{item.name}</span>
                                <br />
                                {item.description && (
                                    <div
                                        className={`${
                                            !showMoreConfigs[item.id] ? 'hidden' : 'block'
                                        }`}>
                                        <div
                                            className="text-blue-350 mt-4 block font-normal text-sm"
                                            dangerouslySetInnerHTML={{
                                                __html: `${item.description.substring(0, 250)} ...`
                                            }}
                                        />{' '}
                                    </div>
                                )}
                            </td>
                            <td className="w-[300px]" colSpan={4} style={{ padding: '0' }}>
                                {renderConfigurationColors(item.configuration, item.id)}
                            </td>
                            <td
                                className="text-right whitespace-nowrap"
                                style={{ minWidth: '150px' }}>
                                <ButtonTableAction
                                    dataId={String(item.id)}
                                    localeKey="Edit"
                                    className={'btn-edit'}
                                    onClick={handleEditBtnClick}
                                />
                                <ButtonTableAction
                                    dataId={String(item.id)}
                                    onClick={handleDuplicateBtnClick}
                                    localeKey="Duplicate"
                                    className={'btn-copy'}
                                />
                                <ButtonTableAction
                                    dataId={String(item.id)}
                                    onClick={handleDeleteBtnClick}
                                    localeKey="Delete"
                                    className={'btn-delete'}
                                />
                            </td>
                        </tr>
                    ))}
                </DataTable>
            </div>
        </>
    );
};

export default ListProducts;
