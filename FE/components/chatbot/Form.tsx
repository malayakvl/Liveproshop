import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { Formik } from 'formik';
import ReactTags from 'react-tag-autocomplete';
import { InputText, InputTextarea } from '../_form';
import { useDispatch, useSelector } from 'react-redux';
import { itemSelector } from '../../redux/chatbot/selectors';
import { setEmptyFormAction, showFormAction } from '../../redux/chatbot';
import { submitFormAction } from '../../redux/chatbot/actions';
import { findProductsAction } from '../../redux/products';
import { tagSuggestionsSelector } from '../../redux/products/selectors';

function ChatbotForm() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const item = useSelector(itemSelector);
    const searchTagSuggestions = useSelector(tagSuggestionsSelector);

    const [tags, setTags] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isBusy, setIsBusy] = useState(false);

    const onDelete = useCallback(
        (tagIndex: number) => {
            setTags(tags.filter((_, i) => i !== tagIndex));
        },
        [tags]
    );
    const onAddition = useCallback(
        (newTag) => {
            setTags([newTag]);
        },
        [tags]
    );
    const onInput = (query: string) => {
        if (!isBusy) {
            setIsBusy(true);
            dispatch(findProductsAction(query));
        }
    };
    useEffect(() => {
        setSuggestions(searchTagSuggestions);
        setIsBusy(false);
    }, [searchTagSuggestions]);

    useEffect(() => {
        if (item.product) {
            setTags(item.product);
        }
    }, [item]);

    const SubmitSchema = Yup.object().shape({
        name: Yup.string()
            .max(140, t('Must be less characters', { charNumber: 140 }))
            .required(t('Required field')),
        keywords: Yup.string()
            .max(255, t('Must be less characters', { charNumber: 255 }))
            .required(t('Required field')),
        message_fr: Yup.string().required(t('Required field')),
        message_en: Yup.string().required(t('Required field')),
        discount: Yup.number().max(100),
        answer_count: Yup.number()
    });
    return (
        <>
            <h2 className="dark-blue-header w-full pl-2">{t('Create a new reply')}</h2>
            <Formik
                enableReinitialize
                initialValues={item}
                validationSchema={SubmitSchema}
                onSubmit={(values) => {
                    if (tags.length) {
                        values.product = tags;
                    }
                    dispatch(submitFormAction(values));
                }}>
                {(props) => {
                    return (
                        <form onSubmit={props.handleSubmit} className="mt-5">
                            <div className="w-full pl-2 pr-2">
                                <div>
                                    <InputText
                                        icon={null}
                                        label={'Name (unique)'}
                                        name={'name'}
                                        placeholder={'Product Name'}
                                        style={null}
                                        props={props}
                                        tips={t('count_characters', { charNumber: 140 })}
                                    />

                                    <InputText
                                        icon={null}
                                        label={'Trigger Words'}
                                        name={'keywords'}
                                        placeholder={'Trigger Words'}
                                        style={null}
                                        props={props}
                                        tips={t('count_characters', { charNumber: 255 })}
                                    />

                                    <InputText
                                        icon={null}
                                        label={'Max Answer Count'}
                                        name={'answer_count'}
                                        placeholder={'Max Answer Count'}
                                        style={'max-w-[300px]'}
                                        props={props}
                                        tips={null}
                                    />

                                    <div className="mb-4">
                                        <label className="control-label">
                                            {t('Select Product')}
                                        </label>
                                        <div className="relative">
                                            <em className="input-tips">{t('Select one')}</em>
                                            <ReactTags
                                                placeholderText={t('Select Product')}
                                                tags={tags}
                                                allowNew={false}
                                                suggestions={suggestions}
                                                onDelete={onDelete}
                                                onAddition={onAddition}
                                                onInput={onInput}
                                            />
                                        </div>
                                    </div>
                                    <InputText
                                        icon={null}
                                        label={'Discount (%)'}
                                        name={'discount'}
                                        placeholder={'Discount (%)'}
                                        style={'max-w-[300px]'}
                                        props={props}
                                        tips={null}
                                    />

                                    <div className="clear-both mt-7">
                                        <i className="trans-fr" />
                                        <div
                                            className="float-left ml-5 mb-5"
                                            style={{ width: 'calc(100% - 60px)' }}>
                                            <InputTextarea
                                                icon={null}
                                                label={null}
                                                name={'message_fr'}
                                                placeholder={'Missing Message'}
                                                style={null}
                                                props={props}
                                            />
                                        </div>
                                    </div>
                                    <div className="clear-both mt-7">
                                        <i className="trans-en" />
                                        <div
                                            className="float-left ml-5 mb-5"
                                            style={{ width: 'calc(100% - 60px)' }}>
                                            <InputTextarea
                                                icon={null}
                                                label={null}
                                                name={'message_en'}
                                                placeholder={'Missing Message'}
                                                style={null}
                                                props={props}
                                            />
                                        </div>
                                    </div>
                                    <div className="float-right">
                                        <button
                                            type="button"
                                            className="cancel mr-4"
                                            onClick={() => {
                                                dispatch(setEmptyFormAction());
                                                dispatch(showFormAction(false));
                                            }}>
                                            {t('Cancel')}
                                        </button>
                                        <button type="submit" className="gradient-btn">
                                            {t('Save')}
                                        </button>
                                    </div>
                                    <div className="clear-both" />
                                </div>
                            </div>
                        </form>
                    );
                }}
            </Formik>
        </>
    );
}

export default ChatbotForm;
