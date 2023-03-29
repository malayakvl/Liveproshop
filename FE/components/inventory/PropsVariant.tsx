import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { InputText } from '../_form';
import { useDispatch } from 'react-redux';
import { setIdentAction } from '../../redux/products';

const RenderVariant: React.FC<any> = ({ colors, sizes, props, additional }) => {
    const t = useTranslations();
    const [checkedVariant, setCheckedVariant] = useState('');
    const dispatch = useDispatch();
    const setupIdent = (variants: any[]) => {
        dispatch(setIdentAction(true));
        if (checkedVariant) {
            const price = props.values[`configurePrice_${checkedVariant}`];
            const qty = props.values[`configureQty_${checkedVariant}`];
            variants.forEach((attr: any) => {
                if (checkedVariant != `${attr.color}_${attr.size}`) {
                    props.values[`configurePrice_${attr.color}_${attr.size}`] = price;
                    props.values[`configureQty_${attr.color}_${attr.size}`] = qty;
                }
            });
        }
    };

    const _colors: any[] = [];
    const _sizes: any[] = [];
    let tmpColors = [];
    if (colors.length === undefined) {
        tmpColors.push(colors);
    } else {
        tmpColors = colors;
    }
    tmpColors.forEach((_color: any) => {
        _colors.push(_color.label);
    });
    let tmpSizes = [];
    if (sizes.length === undefined) {
        tmpSizes.push(sizes);
    } else {
        tmpSizes = sizes;
    }
    tmpSizes.forEach((_size: any) => {
        _sizes.push(_size.label);
    });

    const attributes = {
        color: _colors.length > 0 ? _colors : ['none'],
        size: _sizes.length > 0 ? _sizes : ['none']
    };
    let attrs: any[] = [];
    for (const [attr, values] of Object.entries(attributes)) {
        attrs.push(values.map((v: any) => ({ [attr]: v })));
    }
    attrs = attrs.reduce((a, b) => a.flatMap((d: any) => b.map((e: any) => ({ ...d, ...e }))));
    return (
        <div className="overflow-x-scroll md:overflow-x-visible">
            {(_colors.length > 0 || _sizes.length > 0) && (
                <table className="min-w-full float-table mt-3 mb-3">
                    <thead>
                        <tr>
                            <th colSpan={5}>
                                <button
                                    className="float-left action-dublicate action cursor-pointer"
                                    onClick={() => setupIdent(attrs)}>
                                    <span>Replace all values with selected</span>
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {attrs.map((attr: any, index) => (
                            <tr key={index}>
                                <td style={{ paddingTop: 0 }}>
                                    <input
                                        type="checkbox"
                                        onChange={() =>
                                            setCheckedVariant(`${attr.color}_${attr.size}`)
                                        }
                                    />
                                </td>
                                <td className="sm:whitespace-nowrap" style={{ paddingTop: 2 }}>
                                    {attr.size !== 'none' ? attr.size : ''}
                                    {attr.color !== 'none' && attr.size !== 'none' ? ' / ' : ''}
                                    <span
                                        style={{
                                            color: attr.color
                                                ? additional.colors.find(
                                                      (color: any) => color.name === attr.color
                                                  )?.code || ''
                                                : ''
                                        }}>
                                        {attr.color !== 'none' ? attr.color : ''}
                                    </span>
                                </td>
                                <td className="flex flex-wrap justify-between">
                                    <InputText
                                        icon={null}
                                        label={t('Price')}
                                        name={`configurePrice_${attr.color}_${attr.size}`}
                                        placeholder={'Price'}
                                        style={'w-[100px]'}
                                        props={props}
                                        tips={null}
                                    />
                                    {/* </td>
                                <td> */}
                                    <InputText
                                        icon={null}
                                        label={t('Quantity')}
                                        name={`configureQty_${attr.color}_${attr.size}`}
                                        placeholder={'Quantity'}
                                        style={'w-[100px]'}
                                        props={props}
                                        tips={null}
                                    />
                                    {/* </td>
                                <td> */}
                                    <InputText
                                        icon={null}
                                        label={t('SKU')}
                                        name={`configureSKU_${attr.color}_${attr.size}`}
                                        placeholder={'SKU'}
                                        style={'w-full max-w-[170px]'}
                                        props={props}
                                        tips={null}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RenderVariant;
