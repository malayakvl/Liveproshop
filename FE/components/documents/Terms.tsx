import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    addUploadedTermsAndCondFile,
    removeUploadedPolicyFile,
    removeUploadedTermsAndCondFile
} from '../../redux/settings';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { itemSelector, uploadedTermsFilesSelector } from '../../redux/settings/selectors';
import { submitFormUploadAction } from '../../redux/settings/actions';
import { userSelector } from '../../redux/user/selectors';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const replaceUrl = publicRuntimeConfig.localUrl;

const TermsDocument: React.FC<any> = ({ title }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const termsAndCondDataFiles = useSelector(uploadedTermsFilesSelector);
    const settingsValues = useSelector(itemSelector);
    const user = useSelector(userSelector);

    const removeFile = (type = '', ext = '') => {
        dispatch(removeUploadedTermsAndCondFile(type, ext));
    };

    const showUploadedFileExt = () => {
        const regExpDelBrackets = /[({})]/g;
        const fullReplace = `terms.`;
        return settingsValues.terms_doc.replace(regExpDelBrackets, '').replace(fullReplace, '');
    };

    useEffect(() => {
        acceptedFiles.forEach((file: File) => {
            dispatch(addUploadedTermsAndCondFile(file));
        });
    }, [acceptedFiles]);

    useEffect(() => {
        if (termsAndCondDataFiles.length > 0) {
            const formData = new FormData();
            termsAndCondDataFiles.forEach((file: any) => {
                formData.append('terms', file);
            });
            dispatch(submitFormUploadAction(formData, 'terms'));
        }
    }, [termsAndCondDataFiles]);

    const showUploadedFile = () => {
        const regExpDelBrackets = /[({})]/g;
        const fullReplace = `${replaceUrl}uploads/users/${user.id}/`;
        return settingsValues.terms_doc.replace(regExpDelBrackets, '').replace(fullReplace, '');
    };

    return (
        <>
            <h2 className="form-subtitle">{t(title)}</h2>
            <section className="drop-zone-container">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>{t('Drag_and_drop_files')}</p>
                </div>
                {(termsAndCondDataFiles.length > 0 || settingsValues.terms_doc) && (
                    <aside>
                        <h4>Uploaded Files</h4>
                        <ul style={{ minWidth: '300px', marginLeft: '-10px' }}>
                            {termsAndCondDataFiles.map((_file: File) => (
                                <li
                                    key={_file.lastModified}
                                    style={{
                                        minWidth: '300px',
                                        background: '#d5efca',
                                        display: 'block'
                                    }}>
                                    <span style={{ minWidth: '300px' }}>
                                        New: terms.
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
                            {settingsValues.terms_doc && (
                                <li
                                    key="ex_policy"
                                    style={{
                                        minWidth: '300px',
                                        background: '#e7ebf3',
                                        display: 'block'
                                    }}>
                                    <span style={{ minWidth: '300px' }}>
                                        {settingsValues.terms_doc}{' '}
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

export default TermsDocument;
