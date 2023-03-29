import { ProductForm } from './index';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productItemSelector } from '../../redux/products/selectors';
import { prepareAdditionalDropdown, prepareTagsDropdown } from '../../lib/functions';
import { prepareAdditionalColorDropdown } from '../../lib/inventoryServices';
import { setSelectedAdditionalAction } from '../../redux/products';

interface PropsProduct {
    locale: string;
}

const EditProduct: React.FC<PropsProduct> = ({ locale }) => {
    const dispatch = useDispatch();
    const productData = useSelector(productItemSelector);
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        if (Object.keys(productData.product).length > 0) {
            const _sizes: any = prepareAdditionalDropdown(
                productData.product.selectedSizes,
                locale
            );
            const _colors: any = prepareAdditionalColorDropdown(
                productData.product.selectedColors,
                locale
            );
            const _materials: any = prepareAdditionalDropdown(
                productData.product.selectedMaterials,
                locale
            );
            const _tags: any = prepareTagsDropdown(productData.product.selectedTags, locale);
            dispatch(
                setSelectedAdditionalAction({
                    colors: _colors,
                    sizes: _sizes,
                    materials: _materials,
                    tags: _tags
                })
            );
            if (productData.product.configured) {
                productData.configurations.forEach((configuration: any) => {
                    const conf = configuration.configuration;
                    let index;
                    if (conf.color_id && conf.size_id) {
                        index = `${_colors.find((v: any) => v.value === conf.color_id).label}_${
                            _sizes.find((v: any) => v.value === conf.size_id).label
                        }`;
                    } else if (!conf.color_id && conf.size_id) {
                        index = `none_${_sizes.find((v: any) => v.value === conf.size_id).label}`;
                    } else if (conf.color_id && !conf.size_id) {
                        index = `${_colors.find((v: any) => v.value === conf.color_id).label}_none`;
                    }
                    productData.product[`configurePrice_${index}`] = configuration.price;
                    productData.product[`configureQty_${index}`] = configuration.quantity;
                    productData.product[`configureSKU_${index}`] = configuration.sku || '';
                });
            }
            setDataFetched(true);
        }
    }, [dispatch, productData]);

    return (
        <>
            {dataFetched && (
                <ProductForm
                    locale={locale}
                    productData={productData}
                    photos={productData.product.photos || []}
                />
            )}
        </>
    );
};

export default EditProduct;
