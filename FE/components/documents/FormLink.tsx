import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { InputText } from '../_form';
import { itemSelector } from '../../redux/settings/selectors';

export interface ColourOption {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}

function FormLink() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const initialValues = useSelector(itemSelector);

    const SubmitSchema = Yup.object().shape({});
    return (
        <Formik
            enableReinitialize
            initialValues={{ initialValues }}
            validationSchema={SubmitSchema}
            onSubmit={(values) => {
                // console.log('Values', values);
                // dispatch(setIdentAction(false));
                // console.log('Selected Colors', selectedColors);
                // console.log('Selected Sizes', selectedSizes);
            }}>
            {(props) => {
                const { handleChange } = props;
                return (
                    <form onSubmit={props.handleSubmit} className="mt-5">
                        <div className="max-w-screen-md xl:max-w-screen-2xl xl:grid xl:grid-cols-2">
                            <div className="flex-col mb-4">
                                <InputText
                                    icon={null}
                                    label={'Link Privacy and Policy'}
                                    name={'privacy_link'}
                                    placeholder={'Link here'}
                                    style={null}
                                    props={props}
                                    tips={t('count_characters', { charNumber: 140 })}
                                    onChange={(event) => {
                                        event.target.value = event.target.value.trimStart();
                                        props.handleChange(event);
                                    }}
                                />
                            </div>
                            <div className="flex-col mb-4 ml-4">
                                <InputText
                                    icon={null}
                                    label={'Link Terms & Conditions'}
                                    name={'terms_link'}
                                    placeholder={'Link here'}
                                    style={null}
                                    props={props}
                                    tips={t('count_characters', { charNumber: 140 })}
                                    onChange={(event) => {
                                        event.target.value = event.target.value.trimStart();
                                        props.handleChange(event);
                                    }}
                                />
                            </div>
                            <div className="flex-col mb-4">
                                <InputText
                                    icon={null}
                                    label={'Link Delivery Terms'}
                                    name={'delivery_link'}
                                    placeholder={'Link here'}
                                    style={null}
                                    props={props}
                                    tips={t('count_characters', { charNumber: 140 })}
                                    onChange={(event) => {
                                        event.target.value = event.target.value.trimStart();
                                        props.handleChange(event);
                                    }}
                                />
                            </div>
                            <div className="flex-col mb-4 ml-4">
                                <InputText
                                    icon={null}
                                    label={'Link Return Policy'}
                                    name={'return_link'}
                                    placeholder={'Link here'}
                                    style={null}
                                    props={props}
                                    tips={t('count_characters', { charNumber: 140 })}
                                    onChange={(event) => {
                                        event.target.value = event.target.value.trimStart();
                                        props.handleChange(event);
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
}

export default FormLink;
