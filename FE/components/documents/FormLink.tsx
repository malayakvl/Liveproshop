import React, { useState } from 'react';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { InputText } from '../_form';
import { itemSelector } from '../../redux/settings/selectors';
import { submitFormLinkAction } from '../../redux/settings/actions';

function FormLink() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const initialValues = useSelector(itemSelector);
    const [showErrorBlock, setShowErrorBlock] = useState(false);
    const [showMatchErrorBlock, setShowMatchErrorBlock] = useState(false);

    const SubmitSchema = Yup.object().shape({});

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={SubmitSchema}
            onSubmit={(values) => {
                setShowErrorBlock(false);
                setShowMatchErrorBlock(false);
                if (
                    !values.privacy_link &&
                    !values.terms_link &&
                    !values.delivery_link &&
                    !values.return_link
                ) {
                    setShowErrorBlock(true);
                } else {
                    const expression =
                        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
                    const regex = new RegExp(expression);
                    let hasErrors = false;
                    const fieldsName = [
                        'privacy_link',
                        'terms_link',
                        'delivery_link',
                        'return_link'
                    ];
                    fieldsName.forEach((_name) => {
                        if (values[_name]) {
                            if (!values[_name].match(regex)) {
                                setShowMatchErrorBlock(true);
                                hasErrors = true;
                            }
                        }
                    });
                    if (!hasErrors) {
                        dispatch(submitFormLinkAction(values));
                    }
                }
            }}>
            {(props) => {
                const { handleChange } = props;
                return (
                    <form onSubmit={props.handleSubmit} className="mt-5">
                        {showErrorBlock && (
                            <div className="alert-danger mb-6">
                                {t('Fill in at least one field')}
                            </div>
                        )}
                        {showMatchErrorBlock && (
                            <div className="alert-danger mb-6">
                                {t('Wrong url format for link')}
                            </div>
                        )}
                        <div className="max-w-screen-md xl:max-w-screen-2xl xl:grid xl:grid-cols-2">
                            <div className="flex-col mb-4">
                                <InputText
                                    icon={null}
                                    label={'Link Privacy and Policy'}
                                    name={'privacy_link'}
                                    placeholder={'Link here'}
                                    style={null}
                                    props={props}
                                    tips={t('count_characters', { charNumber: 340 })}
                                    onChange={(event) => {
                                        event.target.value = event.target.value.trimStart();
                                        props.handleChange(event);
                                        setShowErrorBlock(false);
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
                                    tips={t('count_characters', { charNumber: 340 })}
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
                                    tips={t('count_characters', { charNumber: 340 })}
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
                                    tips={t('count_characters', { charNumber: 340 })}
                                    onChange={(event) => {
                                        event.target.value = event.target.value.trimStart();
                                        props.handleChange(event);
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="gradient-btn">
                                {t('Save')}
                            </button>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
}

export default FormLink;
