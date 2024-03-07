import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Formik } from 'formik';
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
import { TermsAndCond, DeliveryTerms, Policy, ReturnPolicy } from './index';

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

function ProductForm({ locale, photos }: { locale: string; photos: string[] }) {
    const t = useTranslations();
    const dispatch = useDispatch();

    const additionalProps = useSelector(productAdditionalSelector);
    const additionalSelectedProps = useSelector(selectedAdditionalsSelector);
    const searchTagSuggestions = useSelector(tagSuggestionsSelector);
    const uploadedFiles = useSelector(uploadedFilesSelector);
    const isIdent = useSelector(getIdentSelector);

    const [editorContent, setEditorContent] = useState('');
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState<any[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<any>(null);
    const [tags, setTags] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isBusy, setIsBusy] = useState(false);
    const [showSizeTable, setShowSizeTable] = useState(false);
    const [errorConfigured, setErrorConfigured] = useState<any[]>([]);

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
        setSelectedColors(selectedOption);
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
        }
        showSizeHandler();
    };
    const removeSizeHandler = (id: number) => {
        setSelectedSizes(selectedSizes.filter((v: any) => v.value !== id));
    };
    const clearSizeHandler = () => {
        setSelectedSizes([]);
    };
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
    return (
        <Formik
            enableReinitialize
            initialValues={{}}
            validationSchema={SubmitSchema}
            onSubmit={(values) => {
                // console.log('Values', values);
                dispatch(setIdentAction(false));
                // console.log('Selected Colors', selectedColors);
                // console.log('Selected Sizes', selectedSizes);
                setErrorConfigured([]);
                if (!isIdent) {
                    const formData = new FormData();
                    if (uploadedFiles.length) {
                        uploadedFiles.forEach((file: any) => {
                            formData.append('photos[]', file);
                        });
                    }
                    // dispatch(updateProductAction(formData, values.id));
                }
            }}>
            {(props) => {
                const { handleChange } = props;
                const onChangeConfigured = (e: any) => {
                    setSelectedColors([]);
                    setSelectedSizes([]);
                    return handleChange(e);
                };
                return (
                    <form onSubmit={props.handleSubmit} className="mt-5">
                        <div className="max-w-screen-md xl:max-w-screen-2xl xl:grid xl:grid-cols-2">
                            <div className="flex-col mb-4">
                                <Policy
                                    title={'Upload Privacy and Policy'}
                                    uploadedFiles={uploadedFiles}
                                    photos={photos}
                                    productData={{}}
                                />
                            </div>
                            <div className="flex-col mb-4 ml-4">
                                <TermsAndCond
                                    title={'Upload Terms & Conditions'}
                                    uploadedFiles={uploadedFiles}
                                    photos={photos}
                                    productData={{}}
                                />
                            </div>
                            <div className="flex-col mb-4 ml-4">
                                <DeliveryTerms
                                    title={'Upload Delivery Terms'}
                                    uploadedFiles={uploadedFiles}
                                    photos={photos}
                                    productData={{}}
                                />
                            </div>
                            <div className="flex-col mb-4 ml-4">
                                <ReturnPolicy
                                    title={'Upload Return Policy'}
                                    uploadedFiles={uploadedFiles}
                                    photos={photos}
                                    productData={{}}
                                />
                            </div>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
}

export default ProductForm;
