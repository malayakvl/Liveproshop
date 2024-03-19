import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { addUploadedDeliveryFile, removeUploadedDeliveryFile } from '../../redux/settings';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { itemSelector, uploadedDeliveryFilesSelector } from '../../redux/settings/selectors';
import getConfig from 'next/config';
import { userSelector } from '../../redux/user/selectors';
import { submitFormUploadAction } from '../../redux/settings/actions';
const { publicRuntimeConfig } = getConfig();
const replaceUrl = publicRuntimeConfig.localUrl;

const DeliveryDocument: React.FC<any> = ({ title }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const deliveryDataFiles = useSelector(uploadedDeliveryFilesSelector);
    const settingsValues = useSelector(itemSelector);
    const user = useSelector(userSelector);
    const removeFile = (type = '', ext = '') => {
        dispatch(removeUploadedDeliveryFile(type, ext));
    };

    const showUploadedFileExt = () => {
        const regExpDelBrackets = /[({})]/g;
        const fullReplace = `delivery.`;
        return settingsValues.delivery_doc.replace(regExpDelBrackets, '').replace(fullReplace, '');
    };

    useEffect(() => {
        acceptedFiles.forEach((file: File) => {
            dispatch(addUploadedDeliveryFile(file));
        });
    }, [acceptedFiles]);

    useEffect(() => {
        if (deliveryDataFiles.length > 0) {
            const formData = new FormData();
            deliveryDataFiles.forEach((file: any) => {
                formData.append('delivery', file);
            });
            // dispatch(submitFormUploadAction(formData));
            dispatch(submitFormUploadAction(formData, 'delivery'));
        }
    }, [deliveryDataFiles]);

    const showUploadedFile = () => {
        const regExpDelBrackets = /[({})]/g;
        const fullReplace = `${replaceUrl}uploads/users/${user.id}/`;

        return settingsValues.delivery_doc.replace(regExpDelBrackets, '').replace(fullReplace, '');
    };

    return (
        <>
            <h2 className="form-subtitle">{t(title)}</h2>
            <section className="drop-zone-container">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>{t('Drag_and_drop_files')}</p>
                </div>
                {(deliveryDataFiles.length > 0 || settingsValues.delivery_doc) && (
                    <aside>
                        <h4>Uploaded Files</h4>
                        <ul style={{ minWidth: '300px', marginLeft: '-10px' }}>
                            {deliveryDataFiles.map((_file: File) => (
                                <li
                                    key={_file.lastModified}
                                    style={{
                                        minWidth: '300px',
                                        background: '#d5efca',
                                        display: 'block'
                                    }}>
                                    <span style={{ minWidth: '300px' }}>
                                        New: delivery.
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
                            {settingsValues.delivery_doc && (
                                <li
                                    key="ex_policy"
                                    style={{
                                        minWidth: '300px',
                                        background: '#e7ebf3',
                                        display: 'block'
                                    }}>
                                    <span style={{ minWidth: '300px' }}>
                                        {settingsValues.delivery_doc}{' '}
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

export default DeliveryDocument;
