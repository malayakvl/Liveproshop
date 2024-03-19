import React from 'react';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
// import { useEffect } from 'react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
// import { uploadedFilesSelector } from '../../redux/products/selectors';
import { TermsAndCond, DeliveryTerms, Policy, ReturnPolicy } from './index';
import {
    uploadedDeliveryFilesSelector,
    uploadedPolicyFilesSelector,
    uploadedReturnFilesSelector,
    uploadedTermsFilesSelector
} from '../../redux/settings/selectors';
import { submitFormUploadAction } from '../../redux/settings/actions';

function FormUpload({ photos }: { photos: string[] }) {
    const t = useTranslations();
    const dispatch = useDispatch();
    const policyDataFiles = useSelector(uploadedPolicyFilesSelector);
    const termsDataFiles = useSelector(uploadedTermsFilesSelector);
    const deliveryDataFiles = useSelector(uploadedDeliveryFilesSelector);
    const returnDataFiles = useSelector(uploadedReturnFilesSelector);

    const SubmitSchema = Yup.object().shape({});
    return (
        <Formik
            enableReinitialize
            initialValues={{}}
            validationSchema={SubmitSchema}
            onSubmit={(values) => {
                // const formData = new FormData();
                // if (policyDataFiles.length) {
                //     policyDataFiles.forEach((file: any) => {
                //         formData.append('policy', file);
                //     });
                // }
                // if (termsDataFiles.length) {
                //     termsDataFiles.forEach((file: any) => {
                //         formData.append('terms', file);
                //     });
                // }
                // if (deliveryDataFiles.length) {
                //     deliveryDataFiles.forEach((file: any) => {
                //         formData.append('delivery', file);
                //     });
                // }
                // if (returnDataFiles.length) {
                //     returnDataFiles.forEach((file: any) => {
                //         formData.append('returnPolicy', file);
                //     });
                // }
                // dispatch(submitFormUploadAction(formData));
            }}>
            {(props) => {
                const { handleChange } = props;
                return (
                    <form onSubmit={props.handleSubmit} className="mt-5">
                        <div className="max-w-screen-md xl:max-w-screen-2xl xl:grid xl:grid-cols-2">
                            <div className="flex-col mb-4">
                                <Policy
                                    title={'Upload Privacy and Policy'}
                                    uploadedFiles={policyDataFiles}
                                />
                            </div>
                            <div className="flex-col mb-4 rigt-upload">
                                <TermsAndCond
                                    title={'Upload Terms & Conditions'}
                                    uploadedFiles={termsDataFiles}
                                />
                            </div>
                            <div className="flex-col mb-4">
                                <DeliveryTerms
                                    title={'Upload Delivery Terms'}
                                    uploadedFiles={deliveryDataFiles}
                                />
                            </div>
                            <div className="flex-col mb-4 rigt-upload">
                                <ReturnPolicy
                                    title={'Upload Return Policy'}
                                    uploadedFiles={returnDataFiles}
                                />
                            </div>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
}

export default FormUpload;
