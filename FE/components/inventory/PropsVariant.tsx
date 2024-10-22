import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { InputText } from '../_form';
import { useDispatch, useSelector } from 'react-redux';
import { setIdentAction } from '../../redux/products';

const RenderVariant: React.FC<any> = ({ colors, sizes, props, additional, errors, locale }) => {
    const t = useTranslations();
    const [checkedVariant, setCheckedVariant] = useState('');
    const [showError, setShowError] = useState(false);
    const dispatch = useDispatch();
    const price = props.values[`configurePrice_${checkedVariant}`];
    const qty = props.values[`configureQty_${checkedVariant}`];
    const [newCheckedVariant, setNewCheckedVariat] = useState('');
    const dataConfiguration = [];
    // let tmpVariants: any[] = [];

    const setupIdent = (variants: any[]) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const tPrice = document.getElementById(
            `tconfigurePrice_${newCheckedVariant.replace('.', '_')}`
        ).textContent;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const tQty = document.getElementById(
            `tconfigureQty_${newCheckedVariant.replace('.', '_')}`
        ).textContent;
        if (colors.length === 0 || sizes.length === 0) {
            setShowError(true);
        } else {
            let textPrice: string | number;
            if (newCheckedVariant) {
                const fieldName = `tconfigurePrice_${newCheckedVariant.replace('.', '_')}`;
                const dataVariantsTmp: {
                    price: string | null;
                    qty: string | null;
                    sku: string;
                    color_id: any;
                    size_id: any;
                }[] = [];
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // textPrice = parseFloat(document.getElementById(fieldName).textContent);
                // const priceText = document.getElementById(`tconfigurePrice`);
                variants.forEach((attr: any) => {
                    console.log('filed price name', `configurePrice_${attr.color}_${attr.size}`);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    document.getElementById(
                        `tconfigurePrice_${attr.color}_${attr.size.replace('.', '_')}`
                    ).textContent = tPrice;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    document.getElementById(
                        `tconfigureQty_${attr.color}_${attr.size.replace('.', '_')}`
                    ).textContent = tQty;
                    props.values[`configurePrice_${attr.color}_${attr.size}`] = price;
                    props.values[`configureQty_${attr.color}_${attr.size}`] = qty;
                    dataVariantsTmp.push({
                        price: tPrice,
                        qty: tQty,
                        sku: '',
                        color_id: attr.color,
                        size_id: attr.size
                    });
                });
                console.log(dataVariantsTmp);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                document.getElementById('props_variants').textContent =
                    JSON.stringify(dataVariantsTmp);
            }
        }
        dispatch(setIdentAction(false));
    };

    dispatch(setIdentAction(false));

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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (
        <div className="overflow-x-scroll md:overflow-x-visible">
            {(_colors.length > 0 || _sizes.length > 0) && (
                <table className="min-w-full float-table mt-3 mb-3">
                    <thead>
                        <tr>
                            <th colSpan={5}>
                                {locale == 'en' ? (
                                    // eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                    <a
                                        title={`1) Put the price and quantity values in the row.
    2) Put the checkmark into the checkbox
    3) Click the "Replace all values with selected" button and these values will be applied to all product variations`}
                                        className="float-left action-dublicate action cursor-pointer bg-green-250 text-white"
                                        onClick={() => {
                                            setupIdent(attrs);
                                            setTimeout(() => {
                                                setupIdent(attrs);
                                            }, 50);
                                        }}>
                                        <span>{t('Replace all values with selected')}</span>
                                    </a>
                                ) : (
                                    // eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                    <a
                                        title={`1) Placez les valeurs de prix et de quantité
    2) Cochez la case de référence
    3) Cliquez sur le bouton "Remplacer toutes les valeurs par celles sélectionnées" et ces valeurs seront appliquées à toutes les variations de produits`}
                                        className="float-left action-dublicate action cursor-pointer bg-green-250 text-white"
                                        onClick={() => {
                                            setupIdent(attrs);
                                            setTimeout(() => {
                                                setupIdent(attrs);
                                            }, 50);
                                        }}>
                                        <span>{t('Replace all values with selected')}</span>
                                    </a>
                                )}
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events */}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {attrs.map((attr: any, index) => (
                            <tr key={index}>
                                <td style={{ paddingTop: 0 }}>
                                    <input
                                        type="checkbox"
                                        onChange={(el) => {
                                            if (checkedVariant == '') {
                                                setNewCheckedVariat(`${attr.color}_${attr.size}`);
                                                setCheckedVariant(`${attr.color}_${attr.size}`);
                                            } else setCheckedVariant(``);
                                        }}
                                        checked={checkedVariant == `${attr.color}_${attr.size}`}
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
                                    <div className="relative">
                                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                        <label className="control-label">{t('Price')}</label>
                                        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                                        <div
                                            className={`textLikeInput`}
                                            id={`tconfigurePrice_${attr.color}_${attr.size.replace(
                                                '.',
                                                '_'
                                            )}`}
                                            onBlur={(e) => {
                                                let textPriceFieldUpValue = '';
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                textPriceFieldUpValue = document.getElementById(
                                                    `tconfigurePrice_${
                                                        attr.color
                                                    }_${attr.size.replace('.', '_')}`
                                                ).textContent;
                                                props.setFieldValue(
                                                    `configurePrice_${
                                                        attr.color
                                                    }_${attr.size.replace('.', '_')}`,
                                                    textPriceFieldUpValue
                                                );

                                                console.log('Value field', textPriceFieldUpValue);
                                            }}
                                            contentEditable>
                                            {
                                                props.values[
                                                    `configurePrice_${
                                                        attr.color
                                                    }_${attr.size.replace('.', '_')}`
                                                ]
                                            }
                                        </div>
                                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                                        <div
                                            className="input-close cursor-pointer new-delete"
                                            onClick={() => {
                                                console.log('TUT');
                                                props.values[
                                                    `configurePrice_${
                                                        attr.color
                                                    }_${attr.size.replace('.', '_')}`
                                                ] = '';
                                                props.setFieldValue(
                                                    `configurePrice_${
                                                        attr.color
                                                    }_${attr.size.replace('.', '_')}`,
                                                    ''
                                                );
                                            }}
                                        />
                                        <div className="hidden">
                                            <InputText
                                                icon={null}
                                                label={t('Price')}
                                                name={`configurePrice_${
                                                    attr.color
                                                }_${attr.size.replace('.', '_')}`}
                                                placeholder={'Price'}
                                                style={'w-[100px]'}
                                                props={props}
                                                tips={null}
                                            />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                        <label className="control-label">{t('Quantity')}</label>
                                        <div
                                            className={`textLikeInput`}
                                            id={`tconfigureQty_${attr.color}_${attr.size.replace(
                                                '.',
                                                '_'
                                            )}`}
                                            onBlur={(e) => {
                                                let textQtyFieldUpValue = '';
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                textQtyFieldUpValue = document.getElementById(
                                                    `tconfigurePrice_${
                                                        attr.color
                                                    }_${attr.size.replace('.', '_')}`
                                                ).textContent;
                                                props.setFieldValue(
                                                    `configurePrice_${
                                                        attr.color
                                                    }_${attr.size.replace('.', '_')}`,
                                                    textQtyFieldUpValue
                                                );

                                                console.log('Value field', textQtyFieldUpValue);
                                            }}
                                            contentEditable>
                                            {
                                                props.values[
                                                    `configureQty_${attr.color}_${attr.size.replace(
                                                        '.',
                                                        '_'
                                                    )}`
                                                ]
                                            }
                                        </div>
                                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                                        <div
                                            className="input-close cursor-pointer new-delete"
                                            onClick={() => {
                                                props.setFieldValue(
                                                    `configureQty_${attr.color}_${attr.size.replace(
                                                        '.',
                                                        '_'
                                                    )}`,
                                                    ''
                                                );
                                            }}
                                        />
                                        <div className="hidden">
                                            <InputText
                                                icon={null}
                                                label={t('Quantity')}
                                                name={`configureQty_${
                                                    attr.color
                                                }_${attr.size.replace('.', '_')}`}
                                                placeholder={'Quantity'}
                                                style={'w-[100px]'}
                                                props={props}
                                                tips={null}
                                            />
                                        </div>
                                    </div>
                                    <InputText
                                        icon={null}
                                        label={t('SKU')}
                                        name={`configureSKU_${attr.color}_${attr.size.replace(
                                            '.',
                                            '_'
                                        )}`}
                                        placeholder={'SKU'}
                                        style={'w-full max-w-[170px]'}
                                        props={props}
                                        tips={null}
                                    />
                                    <div className="relative w-full">
                                        {/*{!props[`configurePrice_${attr.color}_${attr.size}`] && (*/}
                                        {/*    <span*/}
                                        {/*        className="config-error"*/}
                                        {/*        id={`error_${attr.color}_${attr.size}`}>*/}
                                        {/*        {!props.values[*/}
                                        {/*            `configurePrice_${attr.color}_${attr.size}`*/}
                                        {/*            ] && props.isSubmitting*/}
                                        {/*            ? 'Price, Quantity are mandatory fields'*/}
                                        {/*            : ''}*/}
                                        {/*    </span>*/}
                                        {/*)}*/}
                                        {errors.length > 0 && (
                                            <span className="config-error">
                                                {errors.find(
                                                    (_element: string) =>
                                                        _element ==
                                                        `error_${attr.color}_${attr.size}`
                                                )
                                                    ? 'Price, Quantity are mandatory fields'
                                                    : ''}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <div id="props_variants" className="hidden" />
                    </tfoot>
                </table>
            )}
            <section className={showError ? `modal` : 'hidden'}>
                <article className="modal-content p-lg-4">
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <div className="varianModalClose" onClick={() => setShowError(false)}>
                        X
                    </div>
                    <main className="modal-mainContents">
                        <p className="p-3 ">
                            {t('You need to chose at least one colour and size')}
                        </p>
                    </main>
                </article>
            </section>
        </div>
    );
};

export default RenderVariant;
