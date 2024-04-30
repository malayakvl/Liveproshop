import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    addUploadedPolicyFile,
    removeUploadedPolicyFile,
    removeUploadedTermsAndCondFile
} from '../../redux/settings';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { itemSelector, uploadedPolicyFilesSelector } from '../../redux/settings/selectors';
import { submitFormUploadAction } from '../../redux/settings/actions';
import getConfig from 'next/config';
import { userSelector } from '../../redux/user/selectors';
const { publicRuntimeConfig } = getConfig();
const replaceUrl = publicRuntimeConfig.localUrl;

const PolicyDocument: React.FC<any> = ({ title }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const policyDataFiles = useSelector(uploadedPolicyFilesSelector);
    const settingsValues = useSelector(itemSelector);
    const user = useSelector(userSelector);

    const removeFile = (type = '', ext = '') => {
        dispatch(removeUploadedPolicyFile(type, ext));
    };

    const showUploadedFileExt = () => {
        const regExpDelBrackets = /[({})]/g;
        const fullReplace = `policy.`;
        return settingsValues.terms_doc.replace(regExpDelBrackets, '').replace(fullReplace, '');
    };

    useEffect(() => {
        acceptedFiles.forEach((file: File) => {
            dispatch(addUploadedPolicyFile(file));
        });
    }, [acceptedFiles]);

    useEffect(() => {
        if (policyDataFiles.length > 0) {
            const formData = new FormData();
            policyDataFiles.forEach((file: any) => {
                formData.append('policy', file);
            });
            dispatch(submitFormUploadAction(formData, 'policy'));
        }
    }, [policyDataFiles]);

    return (
        <>
            <h2 className="form-subtitle">{t(title)}</h2>
            <section className="drop-zone-container">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>{t('Drag_and_drop_files')}</p>
                </div>
                {(policyDataFiles.length > 0 || settingsValues.privacy_doc) && (
                    <aside>
                        <h4>Uploaded Files</h4>
                        <ul style={{ minWidth: '300px', marginLeft: '-10px' }}>
                            {policyDataFiles.map((_file: File) => (
                                <li
                                    key={_file.lastModified}
                                    style={{
                                        minWidth: '300px',
                                        background: '#d5efca',
                                        display: 'block'
                                    }}>
                                    <span style={{ minWidth: '300px' }}>
                                        New: policy.
                                        {_file.name.substr(_file.name.lastIndexOf('.') + 1)}
                                    </span>{' '}
                                    <i
                                        className="close"
                                        role="presentation"
                                        onClick={() => {
                                            removeFile(
                                                'tmp',
                                                _file.name.substr(_file.name.lastIndexOf('.') + 1)
                                            );
                                        }}
                                    />
                                </li>
                            ))}
                            {settingsValues.privacy_doc && (
                                <li
                                    key="ex_policy"
                                    style={{
                                        minWidth: '300px',
                                        background: '#e7ebf3',
                                        display: 'block'
                                    }}>
                                    <span style={{ minWidth: '300px' }}>
                                        {settingsValues.privacy_doc}{' '}
                                    </span>
                                    <i
                                        className="close"
                                        role="presentation"
                                        onClick={() => {
                                            removeFile('old', showUploadedFileExt());
                                        }}
                                    />
                                </li>
                            )}
                        </ul>
                    </aside>
                )}
            </section>
        </>
    );
};

export default PolicyDocument;
