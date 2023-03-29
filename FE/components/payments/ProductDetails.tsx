import React from 'react';
import { useTranslations } from 'next-intl';
import { baseApiUrl } from '../../constants';
import { BanIcon } from '@heroicons/react/solid';
import { formatCurrency } from '../../lib/functions';

const ProductDetails: React.FC<{ product: any; className: string }> = ({ product, className }) => {
    const t = useTranslations();

    return (
        <table className={'w-11/12 float-table text-xs mx-auto ' + className}>
            <thead>
                <tr>
                    <th className="text-left">{t('Photo')}</th>
                    <th className="text-left">{t('Reference | Name | Description')}</th>
                    <th className="text-left inventory-color sorting_disabled" />
                    <th className="text-left inventory-size sorting_disabled" />
                    <th className="text-left inventory-qty sorting_disabled" />
                    <th className="text-center inventory-price sorting_disabled">{t('Price')}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ width: '150px' }}>
                        {product.previewphoto && (
                            <img
                                width={85}
                                height={95}
                                src={
                                    /(http(s?)):\/\//i.test(product.previewphoto)
                                        ? product.previewphoto
                                        : `${baseApiUrl}/${product.previewphoto}`
                                }
                                alt="Product preview"
                                className="object-scale-down h-[95px] w-[85px] rounded-lg border p-1.5"
                            />
                        )}
                        {!product.previewphoto && (
                            <div className="border rounded-lg w-[85px] h-[95px] block flex items-center text-center">
                                <BanIcon width={30} height={30} className="m-auto text-gray-200" />
                            </div>
                        )}
                    </td>
                    <td>
                        <span className="text-gray-180 text-sm">Ref.</span>{' '}
                        <span className="text-blue-350">{product.product_id}</span> <br />
                        {product.description && (
                            <div
                                className="text-blue-350 mt-4 block font-normal text-sm"
                                dangerouslySetInnerHTML={{
                                    __html: `${product.description.substring(0, 250)} ...`
                                }}
                            />
                        )}
                    </td>
                    <td>
                        <div
                            className="rounded-full w-3 h-3 inline-block mr-1"
                            style={{
                                backgroundColor: `${product.color_code}`
                            }}
                            title={product.color_name + ' ' + product.color_code}
                        />
                    </td>
                    <td className="whitespace-nowrap">{product.size_name}</td>
                    <td style={{ textAlign: 'center' }}>{product.quantity}</td>
                    <td style={{ textAlign: 'center' }}>{formatCurrency(product.price)}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default ProductDetails;
