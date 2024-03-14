import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { addUploadedReturnFile, removeUploadedReturnFile } from '../../redux/settings';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { itemSelector, uploadedReturnFilesSelector } from '../../redux/settings/selectors';
import getConfig from 'next/config';
import { userSelector } from '../../redux/user/selectors';
import { submitFormUploadAction } from '../../redux/settings/actions';
const { publicRuntimeConfig } = getConfig();
const replaceUrl = publicRuntimeConfig.localUrl;

const ReturnDocument: React.FC<any> = ({ title }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const returnDataFiles = useSelector(uploadedReturnFilesSelector);
    const settingsValues = useSelector(itemSelector);
    const user = useSelector(userSelector);
    const removeFile = () => {
        dispatch(removeUploadedReturnFile());
    };

    useEffect(() => {
        acceptedFiles.forEach((file: File) => {
            dispatch(addUploadedReturnFile(file));
        });
    }, [acceptedFiles]);

    useEffect(() => {
        if (returnDataFiles.length > 0) {
            const formData = new FormData();
            returnDataFiles.forEach((file: any) => {
                formData.append('returnPolicy', file);
            });
            dispatch(submitFormUploadAction(formData));
        }
    }, [returnDataFiles]);

    const showUploadedFile = () => {
        const regExpDelBrackets = /[({})]/g;
        const fullReplace = `${replaceUrl}uploads/users/${user.id}/`;

        return settingsValues.return_doc.replace(regExpDelBrackets, '').replace(fullReplace, '');
    };

    return (
        <>
            <h2 className="form-subtitle">{t(title)}</h2>
            <section className="drop-zone-container">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>{t('Drag_and_drop_files')}</p>
                </div>
                {(returnDataFiles.length > 0 || settingsValues.return_doc) && (
                    <aside>
                        <h4>Uploaded Files</h4>
                        <ul style={{ minWidth: '300px', marginLeft: '-10px' }}>
                            {returnDataFiles.map((_file: File) => (
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
                            {settingsValues.return_doc && (
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

export default ReturnDocument;
