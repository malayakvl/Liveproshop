import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modalConfirmationMetaSelector } from '../../../redux/layouts/selectors';
import { setModalConfirmationMetaAction } from '../../../redux/layouts';
import { Modal } from '../../_common';
import { toggleModalConfirmation } from '../../../lib/functions';

const ConfirmationModal: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const inputMeta = useSelector(modalConfirmationMetaSelector);
    const [meta, setMeta] = useState<Layouts.ModalConfirmationMeta | null>(null);
    const {
        title = '',
        titleKey = 'Do you want to delete',
        submitButtonProps,
        onConfirm,
        onCancel
    } = meta || ({} as any);

    useEffect(() => {
        if (inputMeta) {
            toggleModalConfirmation();
            return setMeta(inputMeta);
        }
        setTimeout(() => {
            setMeta(null);
        }, 500);
    }, [inputMeta]);

    const handleCancelBtnClick = useCallback(() => {
        dispatch(setModalConfirmationMetaAction(null));
        toggleModalConfirmation();
    }, [dispatch]);

    const handleSubmitBtnClick = useCallback(
        (event: React.SyntheticEvent) => {
            event.preventDefault();
            if (!onConfirm) return;
            setIsLoading(true);
            onConfirm()
                .then(handleCancelBtnClick)
                .finally(() => {
                    setIsLoading(false);
                    toggleModalConfirmation();
                });
        },
        [onConfirm, handleCancelBtnClick]
    );

    return (
        <Modal
            title={title}
            titleKey={titleKey}
            cancelButtonProps={{
                disabled: isLoading,
                onClick: onCancel
                    ? () => onCancel().then(handleCancelBtnClick)
                    : handleCancelBtnClick
            }}
            submitButtonProps={{
                isLoading,
                iconClassName: submitButtonProps?.iconClassName || 'far fa-trash-alt',
                localeKey: submitButtonProps?.localeKey || 'Delete',
                className: submitButtonProps?.className || 'danger',
                onClick: handleSubmitBtnClick
            }}
        />
    );
};

export default ConfirmationModal;
