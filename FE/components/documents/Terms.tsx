import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { addUploadedTermsAndCondFile, removeUploadedTermsAndCondFile } from '../../redux/settings';
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

    const removeFile = () => {
        dispatch(removeUploadedTermsAndCondFile());
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
                                <li key={_file.lastModified} style={{ minWidth: '300px' }}>
                                    <span>{_file.name}</span> <em>{_file.size} bytes</em>{' '}
                                    <i
                                        className="close"
                                        role="presentation"
                                        onClick={() => {
                                            removeFile();
                                        }}
                                    />
                                </li>
                            ))}
                            {settingsValues.terms_doc && !termsAndCondDataFiles.length && (
                                <li key="ex_policy" style={{ minWidth: '300px' }}>
                                    <span>{showUploadedFile()}</span>
                                    <i
                                        className="close"
                                        role="presentation"
                                        onClick={() => {
                                            removeFile();
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
