import React, { useEffect, useState } from 'react';
// import { baseApiUrl } from '../../constants';
import { useDropzone } from 'react-dropzone';
import { addUploadedTermsAndCondFile, removeUploadedTermsAndCondFile } from '../../redux/settings';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { uploadedTermsFilesSelector } from '../../redux/settings/selectors';

const TermsDocument: React.FC<any> = ({ title, productData, photos }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const [productPhotos, setProductPhotos] = useState(photos);
    const termsAndCondDataFiles = useSelector(uploadedTermsFilesSelector);
    const removeFile = (file: File) => {
        dispatch(removeUploadedTermsAndCondFile(file));
    };

    useEffect(() => {
        acceptedFiles.forEach((file: File) => {
            dispatch(addUploadedTermsAndCondFile(file));
        });
    }, [acceptedFiles]);

    useEffect(() => {
        // setProductPhotos(photos);
    }, [photos]);

    const removeProductFile = (file: string) => {
        let _photos = productPhotos;
        _photos = _photos.filter((_file: string) => _file !== file);
        dispatch(removeUploadedTermsAndCondFile(file, productData.product.id));
        setProductPhotos(_photos);
    };

    return (
        <>
            <h2 className="form-subtitle">{t(title)}</h2>
            <section className="drop-zone-container">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>{t('Drag_and_drop_files')}</p>
                </div>
                {termsAndCondDataFiles.length > 0 && (
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
                                            removeFile(_file);
                                        }}
                                    />
                                </li>
                            ))}
                            {/*{productPhotos.map(*/}
                            {/*    (_file: string, _index: React.Key | null | undefined) => (*/}
                            {/*        <li key={_index}>*/}
                            {/*            <img*/}
                            {/*                src={*/}
                            {/*                    /(http(s?)):\/\//i.test(_file)*/}
                            {/*                        ? _file*/}
                            {/*                        : `${baseApiUrl}/${_file}`*/}
                            {/*                }*/}
                            {/*                alt=""*/}
                            {/*                className="object-cover h-[85px]"*/}
                            {/*            />*/}
                            {/*            <span>{_file}</span> <em>&nbsp;</em>{' '}*/}
                            {/*            <i*/}
                            {/*                className="close"*/}
                            {/*                role="presentation"*/}
                            {/*                onClick={() => {*/}
                            {/*                    removeProductFile(_file);*/}
                            {/*                }}*/}
                            {/*            />*/}
                            {/*        </li>*/}
                            {/*    )*/}
                            {/*)}*/}
                        </ul>
                    </aside>
                )}
            </section>
        </>
    );
};

export default TermsDocument;
