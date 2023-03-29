import { ProductForm } from './index';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEmptyProductAction } from '../../redux/products/actions';
import { productItemSelector } from '../../redux/products/selectors';

interface PropsProduct {
    locale: string;
}

const AddProduct: React.FC<PropsProduct> = ({ locale }) => {
    const dispatch = useDispatch();
    const productData = useSelector(productItemSelector);

    useEffect(() => {
        dispatch(setEmptyProductAction());
    }, []);

    return (
        <>
            <ProductForm locale={locale} productData={productData} photos={[]} />
        </>
    );
};

export default AddProduct;
