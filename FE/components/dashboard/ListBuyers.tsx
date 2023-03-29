import React, { Fragment } from 'react';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '../../lib/functions';

const ListBuyers: React.FC<{ buyers: Buyers.DataItem[] }> = ({ buyers }) => {
    const t = useTranslations();

    return (
        <div className="overflow-x-scroll">
            <table className="min-w-full float-table text-left">
                <thead>
                    <tr>
                        <th>{t('ID')}</th>
                        <th>{t('Shoppers')}</th>
                        <th>{t('Orders')}</th>
                        <th>{t('Total Spent')}</th>
                        <th>{t('Country')}</th>
                    </tr>
                </thead>

                <tbody className="bg-white">
                    {buyers?.map((item: any) => (
                        <Fragment key={item.buyer_id}>
                            <tr>
                                <td className="red-yellow-gradient-text">{item.buyer_id}</td>
                                <td>{item.buyer_first_name}</td>
                                <td>{item.total_count}</td>
                                <td>{formatCurrency(item.total_amount)}</td>
                                <td>
                                    {item.country_iso && (
                                        <img
                                            src={`/images/flags/${item.country_iso.toLowerCase()}.svg`}
                                            className="fill-current text-black align-center"
                                            alt={item.country_name}
                                        />
                                    )}
                                </td>
                            </tr>
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListBuyers;
