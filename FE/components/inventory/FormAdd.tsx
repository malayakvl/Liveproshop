import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { Formik, FormikProps, useFormikContext } from 'formik';
import { InputHidden, InputSwitcher, InputText } from '../_form';
import { useDispatch, useSelector } from 'react-redux';
import ReactTags from 'react-tag-autocomplete';
import Select, { StylesConfig } from 'react-select';
import chroma from 'chroma-js';
import { prepareAdditionalDropdown } from '../../lib/functions';
import { prepareConfigValues, prepareAdditionalColorDropdown } from '../../lib/inventoryServices';
import {
    getIdentSelector,
    productAdditionalSelector,
    selectedAdditionalsSelector,
    tagSuggestionsSelector,
    uploadedFilesSelector
} from '../../redux/products/selectors';
import { findTagAction, setIdentAction, updateProductAction } from '../../redux/products/actions';
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';
import { InventoryPhotos, RenderSizes, RenderVariant } from './index';

const SunEditor = dynamic(() => import('suneditor-react'), {
    ssr: false
});

export interface ColourOption {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}

const colourStyles: StylesConfig<ColourOption, true> = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color);
        return {
            ...styles,
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                ? data.color
                : isFocused
                ? color.alpha(0.1).css()
                : undefined,
            color: isDisabled
                ? '#ccc'
                : isSelected
                ? chroma.contrast(color, 'white') > 2
                    ? 'white'
                    : 'black'
                : data.color,
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled
                    ? isSelected
                        ? data.color
                        : color.alpha(0.3).css()
                    : undefined
            }
        };
    },
    multiValue: (styles, { data }) => {
        const color = chroma(data.color);
        return {
            ...styles,
            backgroundColor: color.alpha(0.1).css()
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.color
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.color,
        ':hover': {
            backgroundColor: data.color,
            color: 'white'
        }
    })
};

function ProductFormAdd({
    locale,
    productData,
    photos,
    publish
}: {
    locale: string;
    productData: Products.Product;
    photos: string[];
    publish: boolean;
}) {
    const t = useTranslations();
    const dispatch = useDispatch();
    const additionalProps = useSelector(productAdditionalSelector);
    const additionalSelectedProps = useSelector(selectedAdditionalsSelector);
    const searchTagSuggestions = useSelector(tagSuggestionsSelector);
    const uploadedFiles = useSelector(uploadedFilesSelector);
    const isIdent = useSelector(getIdentSelector);

    console.log('PUBLISH', publish);

    const [editorContent, setEditorContent] = useState('');
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState<any[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<any>(null);
    const [tags, setTags] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isBusy, setIsBusy] = useState(false);
    const [showSizeTable, setShowSizeTable] = useState(false);
    const [errorConfigured, setErrorConfigured] = useState<any[]>([]);
    const [dataPublish, setDataPublish] = useState(publish);
    const [formValues, setFormValues] = useState({});
    const [active, setActive] = useState(false);
    const [x, setX] = useState(true);
    // const { setFieldValue }: any = useFormikContext();

    // console.log('FORM VALUES', formValues);

    // const formRef = useRef<FormikProps>();
    const formRef = React.useRef<FormikProps<any>>(null);
    const [publishTmp, setPublishTmp] = useState<boolean>(false);

    const onDelete = useCallback(
        (tagIndex: number) => {
            setTags(tags.filter((_, i) => i !== tagIndex));
        },
        [tags]
    );

    const onAddition = useCallback(
        (newTag) => {
            setTags([...tags, newTag]);
        },
        [tags]
    );

    const onInput = (query: string) => {
        if (!isBusy) {
            setIsBusy(true);
            dispatch(findTagAction(query));
        }
    };
    useEffect(() => {
        setSuggestions(searchTagSuggestions);
        setIsBusy(false);
    }, [searchTagSuggestions]);

    useEffect(() => {
        setSelectedSizes(additionalSelectedProps.sizes);
        setSelectedColors(additionalSelectedProps.colors);
        setSelectedMaterials(additionalSelectedProps.materials);
        setTags(additionalSelectedProps.tags);
        setEditorContent('');
    }, [additionalSelectedProps]);

    const handleChangeEditor = (content: any) => {
        setEditorContent(content);
    };
    const handleChangeMaterials = (selectedOption: any) => {
        setSelectedMaterials(selectedOption);
    };
    const handleChangeColor = (selectedOption: any) => {
        const formValues = formRef?.current?.values;
        setSelectedColors(selectedOption);
        if (selectedOption.length > 0) {
            selectedOption.forEach(function (_color: any) {
                selectedSizes.forEach(function (_size: any) {
                    formRef.current?.setFieldValue(
                        `configurePrice_${_color.label}_${_size.label}`,
                        formValues[`configurePrice_${_color.label}_${_size.label}`]
                            ? formValues[`configurePrice_${_color.label}_${_size.label}`]
                            : ''
                    );
                    formRef.current?.setFieldValue(
                        `configureQty_${_color.label}_${_size.label}`,
                        formValues[`configureQty_${_color.label}_${_size.label}`]
                            ? formValues[`configureQty_${_color.label}_${_size.label}`]
                            : ''
                    );
                    formRef.current?.setFieldValue(
                        `configureSKU_${_color.label}_${_size.label}`,
                        formValues[`configureSKU_${_color.label}_${_size.label}`]
                            ? formValues[`configureSKU_${_color.label}_${_size.label}`]
                            : ''
                    );
                });
            });
        }
    };

    const handleChangeSize = (selectedOption: any, configured: boolean) => {
        if (!configured) {
            setSelectedSizes(selectedOption);
        } else {
            const _sizes: any = selectedSizes;
            // setSelectedSizes([]);
            if (!_sizes.find((v: any) => v.value === selectedOption.value)) {
                setSelectedSizes([...selectedSizes, selectedOption]);
            }
            const formValues = formRef?.current?.values;
            selectedColors.forEach(function (_color: any) {
                selectedSizes.forEach(function (_size: any) {
                    formRef.current?.setFieldValue(
                        `configurePrice_${_color.label}_${_size.label}`,
                        formValues[`configurePrice_${_color.label}_${_size.label}`]
                            ? formValues[`configurePrice_${_color.label}_${_size.label}`]
                            : ''
                    );
                    formRef.current?.setFieldValue(
                        `configureQty_${_color.label}_${_size.label}`,
                        formValues[`configureQty_${_color.label}_${_size.label}`]
                            ? formValues[`configureQty_${_color.label}_${_size.label}`]
                            : ''
                    );
                    formRef.current?.setFieldValue(
                        `configureSKU_${_color.label}_${_size.label}`,
                        formValues[`configureSKU_${_color.label}_${_size.label}`]
                            ? formValues[`configureSKU_${_color.label}_${_size.label}`]
                            : ''
                    );
                });
            });
        }
        showSizeHandler();
    };
    const removeSizeHandler = (id: number) => {
        setSelectedSizes(selectedSizes.filter((v: any) => v.value !== id));
    };
    const clearSizeHandler = () => {
        setSelectedSizes([]);
    };

    const [, set] = useState();
    const showSizeHandler = () => {
        setShowSizeTable(!showSizeTable);
    };

    const SubmitSchema = Yup.object().shape({
        name: Yup.string()
            .max(140, t('Must be less characters', { charNumber: 140 }))
            .required(t('Required field')),
        // description: Yup.string().required(t('Required field')),
        price: Yup.number().when('configured', {
            is: false,
            then: Yup.number().required(t('Required field')).min(0)
            // otherwise: Yup.number().min(0)
        }),
        quantity: Yup.number().when('configured', {
            is: false,
            then: Yup.number().required(t('Required field')).min(0)
            // otherwise: Yup.number().min(0)
        }),
        color: Yup.string().when('configured', {
            is: true,
            then:
                selectedSizes?.length === 0 && selectedColors?.length === 0
                    ? Yup.string().required(t('Select color or size'))
                    : Yup.string()
        }),
        size: Yup.string().when('configured', {
            is: true,
            then:
                selectedSizes?.length === 0 && selectedColors?.length === 0
                    ? Yup.string().required(t('Select color or size'))
                    : Yup.string()
        })
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (
        <Formik
            enableReinitialize
            initialValues={productData.product}
            validationSchema={SubmitSchema}
            innerRef={formRef}
            onSubmit={(values) => {
                dispatch(setIdentAction(false));
                let errorConfig = false;
                const tmpError: any[] = [];
                setErrorConfigured([]);
                // let tmpError: string[] = [];
                if (values['configured']) {
                    selectedColors.forEach((_color: any) => {
                        selectedSizes.forEach((_size: any) => {
                            if (
                                !values[`configurePrice_${_color['label']}_${_size['label']}`] ||
                                !values[`configureQty_${_color['label']}_${_size['label']}`]
                            ) {
                                errorConfig = true;
                                tmpError.push(`error_${_color['label']}_${_size['label']}`);
                            }
                        });
                    });
                }
                if (tmpError.length > 0) {
                    setErrorConfigured(tmpError);
                }
                // console.log('Error Config', errorConfig);

                if (!isIdent && !errorConfig) {
                    const formData = new FormData();
                    Object.keys(values).forEach((key: string) => {
                        if (!['material_id', 'tags', 'description', publish].includes(key)) {
                            formData.append(key, (values as any)[key]);
                        }
                    });
                    formData.append('description', editorContent);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    formData.append('isPublish', x);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (active === 'true') {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        formData.append('publishCheckbox', 1);
                    } else {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        formData.append('publishCheckbox', 0);
                    }
                    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // // @ts-ignore
                    // formData.append('publishCheckbox', dataPublish);

                    formData.append('description', '');
                    formData.append('tags', JSON.stringify(tags));
                    formData.append(
                        'configurations',
                        JSON.stringify(prepareConfigValues(values, selectedColors, selectedSizes))
                    );
                    formData.append('materials', JSON.stringify(selectedMaterials));
                    formData.append('colors', JSON.stringify(selectedColors));
                    formData.append('sizes', JSON.stringify(selectedSizes));
                    formData.append(
                        'material_id',
                        (selectedMaterials as any)?.length
                            ? (selectedMaterials[0] as any).value
                            : (selectedMaterials as any).value || null
                    );
                    if (uploadedFiles.length) {
                        uploadedFiles.forEach((file: any) => {
                            formData.append('photos[]', file);
                        });
                    }
                    console.log('FORM DATA', formData);
                    dispatch(updateProductAction(formData, values.id));
                }
            }}>
            {(props) => {
                const { handleChange } = props;
                const onChangeConfigured = (e: any) => {
                    setSelectedColors([]);
                    setSelectedSizes([]);
                    return handleChange(e);
                };
                // const onChangeStatusPublish = (e: any) => {
                //     props.values['isPublish'] = !props.values['isPublish'];
                //     setDataPublish(!props.values['isPublish']);
                //     return handleChange(e);
                // };
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return (
                    <form onSubmit={props.handleSubmit} className="mt-5">
                        <div
                            className="max-w-screen-md xl:max-w-screen-2xl xl:grid xl:grid-cols-2"
                            style={{ paddingBottom: '100px' }}>
                            <div className="flex-col mb-4">
                                <InventoryPhotos
                                    uploadedFiles={uploadedFiles}
                                    photos={photos}
                                    productData={productData}
                                />
                            </div>
                            <div className="xl:ml-4">
                                <h2 className="form-subtitle">{t('Product details')}</h2>
                                <InputText
                                    icon={null}
                                    label={'Product Name'}
                                    name={'name'}
                                    placeholder={'Product Name'}
                                    style={null}
                                    props={props}
                                    tips={t('count_characters', { charNumber: 140 })}
                                    onChange={(event) => {
                                        event.target.value = event.target.value.trimStart();
                                        props.handleChange(event);
                                    }}
                                />
                                <div className="mb-4">
                                    <label className="control-label" htmlFor={'description'}>
                                        {t('Product Description')}
                                    </label>
                                    <SunEditor
                                        name={'description'}
                                        setDefaultStyle="font-family: Montserrat; font-size: 14px;"
                                        placeholder={t('Product Description')}
                                        defaultValue={props.values.description || editorContent}
                                        setContents={props.values.description}
                                        setOptions={{ height: '250' }}
                                        onChange={handleChangeEditor}
                                    />
                                    {editorContent.replace(/(&nbsp;|<([^>]+)>)/gi, '').length ===
                                        0 && (
                                        <div className="error-el">
                                            {props.errors['description']}
                                        </div>
                                    )}
                                </div>

                                {/*<InputSwitcher*/}
                                {/*    label={'Active'}*/}
                                {/*    name={'active'}*/}
                                {/*    style={null}*/}
                                {/*    props={props}*/}
                                {/*    onChange={props.handleChange}*/}
                                {/*/>*/}
                                <InputSwitcher
                                    label={'Configured'}
                                    name={'configured'}
                                    style={null}
                                    props={props}
                                    onChange={onChangeConfigured}
                                />

                                <div className="mb-4">
                                    <label className="control-label">{t('Hashtag')}</label>
                                    <div className="relative">
                                        <em className="input-tips">{t('Select one')}</em>
                                        <ReactTags
                                            tags={tags}
                                            allowNew={true}
                                            suggestions={suggestions}
                                            onDelete={onDelete}
                                            onAddition={onAddition}
                                            onInput={onInput}
                                        />
                                    </div>
                                </div>

                                {!props.values.configured && (
                                    <>
                                        <InputText
                                            icon={null}
                                            label={'SKU'}
                                            name={'sku'}
                                            placeholder={'SKU'}
                                            style={null}
                                            props={props}
                                            tips={t('count_characters', { charNumber: 5 })}
                                            onChange={(event) => {
                                                event.target.value = event.target.value.trimStart();
                                                props.handleChange(event);
                                            }}
                                        />

                                        <InputText
                                            icon={null}
                                            label={'Product Price'}
                                            name={'price'}
                                            placeholder={'Product Price'}
                                            style={null}
                                            props={props}
                                            tips={t('Select one')}
                                        />

                                        <InputText
                                            icon={null}
                                            label={'Quantity'}
                                            name={'quantity'}
                                            placeholder={'Quantity'}
                                            style={null}
                                            props={props}
                                            tips={t('Select one')}
                                            onChange={(event) => {
                                                let num = Math.round(+event.target.value);
                                                num = Math.abs(num);
                                                if (!Number.isInteger(num)) num = 0;
                                                event.target.value = String(num);
                                                props.handleChange(event);
                                            }}
                                        />
                                    </>
                                )}
                                <div className="mb-4">
                                    <label className="control-label">{t('Size')}</label>
                                    <div className="relative">
                                        <em
                                            className="input-tips underline"
                                            role="presentation"
                                            // onClick={() => setShowSizeTable(!showSizeTable)}
                                        >
                                            {t('Select one')}
                                        </em>
                                        {
                                            <RenderSizes
                                                sizes={selectedSizes}
                                                configured={props.values.configured}
                                                removeSizeHandler={removeSizeHandler}
                                                showSizeHandler={showSizeHandler}
                                                clearSizeHandler={clearSizeHandler}
                                            />
                                        }
                                        {showSizeTable && (
                                            <table className="text-[10px] absolute bg-white left-0 top-[40px] z-50">
                                                <tbody>
                                                    {additionalProps.sizesTable.map(
                                                        (size: any, index: number) => (
                                                            <tr key={index}>
                                                                {[1, 2, 3, 4, 5, 6, 7].map(
                                                                    (num: number) => (
                                                                        <Fragment
                                                                            key={`${size.id}_${num}`}>
                                                                            {size[
                                                                                `name_${num}`
                                                                            ] && (
                                                                                <td
                                                                                    role="presentation"
                                                                                    className="border p-2 cursor-pointer"
                                                                                    onClick={() =>
                                                                                        handleChangeSize(
                                                                                            {
                                                                                                value: size[
                                                                                                    `id_${num}`
                                                                                                ],
                                                                                                label: size[
                                                                                                    `name_${num}`
                                                                                                ]
                                                                                            },
                                                                                            props
                                                                                                .values
                                                                                                .configured
                                                                                        )
                                                                                    }>
                                                                                    {
                                                                                        size[
                                                                                            `name_${num}`
                                                                                        ]
                                                                                    }
                                                                                </td>
                                                                            )}
                                                                            {!size[
                                                                                `name_${num}`
                                                                            ] && (
                                                                                <td className="border p-2" />
                                                                            )}
                                                                        </Fragment>
                                                                    )
                                                                )}
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                        {props.errors['size'] &&
                                            selectedColors.length === 0 &&
                                            selectedSizes.length === 0 && (
                                                <div className="error-el">
                                                    {props.errors['size']}
                                                </div>
                                            )}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="control-label">{t('Material')}</label>
                                    <div className="relative">
                                        <em className="input-tips">{t('Select one')}</em>
                                        <Select
                                            isClearable={true}
                                            className={'form-control-dropdown'}
                                            classNamePrefix={'inventory'}
                                            options={prepareAdditionalDropdown(
                                                additionalProps.materials,
                                                locale
                                            )}
                                            value={selectedMaterials}
                                            onChange={handleChangeMaterials}
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="control-label">{t('Color')}</label>
                                    <div className="relative">
                                        <em className="input-tips">{t('Select one')}</em>
                                        <Select
                                            isMulti={props.values.configured}
                                            isClearable={true}
                                            className={'form-control-dropdown'}
                                            classNamePrefix={'inventory-color'}
                                            options={prepareAdditionalColorDropdown(
                                                additionalProps.colors,
                                                locale
                                            )}
                                            value={selectedColors}
                                            styles={colourStyles}
                                            onChange={handleChangeColor}
                                        />
                                        {props.errors['color'] &&
                                            selectedColors.length === 0 &&
                                            selectedSizes.length === 0 && (
                                                <div className="error-el">
                                                    {props.errors['color']}
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {props.values.configured && (
                                    <>
                                        <RenderVariant
                                            colors={selectedColors}
                                            sizes={selectedSizes}
                                            props={props}
                                            additional={additionalProps}
                                            errors={errorConfigured}
                                            locale={locale}
                                        />
                                    </>
                                )}
                                <div className="mb-4">
                                    <label className="control-label">{t('Active')}</label>
                                    {/*<div className="radio">*/}
                                    {/*    <label>*/}
                                    {/*        <input*/}
                                    {/*            type="radio"*/}
                                    {/*            value="option1"*/}
                                    {/*            onClick={() => {*/}
                                    {/*                setActive(!productData.product.publish);*/}
                                    {/*            }}*/}
                                    {/*            checked={productData.product.publish}*/}
                                    {/*        />*/}
                                    {/*    </label>*/}
                                    {/*</div>*/}
                                    <input type="checkbox" checked={x} onChange={() => setX(!x)} />
                                    {/*<input type="checkbox" checked={x} onChange={soldCheckbox}/>*/}
                                </div>
                                {/*<div className="mb-4">*/}
                                {/*    <label className="control-label">*/}
                                {/*    {t('Active')}*/}
                                {/*    </label>*/}
                                {/*    <input*/}
                                {/*        type="checkbox"*/}
                                {/*        checked={!dataPublish}*/}
                                {/*        onChange={(el) => {*/}
                                {/*            setDataPublish(!el.target.checked);*/}
                                {/*            setActive(!el.target.checked);*/}
                                {/*            console.log('handle change checkbox', active);*/}
                                {/*        }}*/}
                                {/*    />*/}
                                {/*</div>*/}

                                <button type="submit" className="gradient-btn">
                                    {props.values.id ? t('Update Product') : t('Add a Product')}
                                </button>
                            </div>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
}

export default ProductFormAdd;
