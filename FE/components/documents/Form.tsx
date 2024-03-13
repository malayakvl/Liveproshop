import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { uploadedFilesSelector } from '../../redux/products/selectors';
import { TermsAndCond, DeliveryTerms, Policy, ReturnPolicy } from './index';

export interface ColourOption {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}

function FormUpload({ photos }: { photos: string[] }) {
    const t = useTranslations();
    const dispatch = useDispatch();

    const uploadedFiles = useSelector(uploadedFilesSelector);

    const [tags, setTags] = useState<any[]>([]);
    const [isBusy, setIsBusy] = useState(false);

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

    const SubmitSchema = Yup.object().shape({});
    return (
        <Formik
            enableReinitialize
            initialValues={{}}
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

export default FormUpload;
