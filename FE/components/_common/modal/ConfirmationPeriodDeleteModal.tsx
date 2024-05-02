import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    deletePeriodPopupSelector,
    deletePeriodSelector,
    modalConfirmationPeriodDeleteMetaSelector
} from '../../../redux/layouts/selectors';
import {
    setModalConfirmationDeletePeriodMetaAction,
    hideshowPeriodPopupAction
} from '../../../redux/layouts';
import { ModalPeriodDelete } from '../../_common';
import { toggleModalPeriodDeleteConfirmation } from '../../../lib/functions';
import { useTranslations } from 'next-intl';
import moment from 'moment/moment';

const ConfirmationPeriodSetupModal: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const inputMeta = useSelector(modalConfirmationPeriodDeleteMetaSelector);
    const hideShowPeriodPopup = useSelector(deletePeriodPopupSelector);
    const [meta, setMeta] = useState<Layouts.ModalDeletePeriodMeta | null>(null);
    const periodDelete = useSelector(deletePeriodSelector);
    const t = useTranslations();

    const {
        title = `${
            t('Do you want to deactivate the period from ') +
            '' +
            moment(periodDelete?.free_shipping_from).format('DD/MM/YYYY') +
            ' - ' +
            moment(periodDelete?.free_shipping_to).format('DD/MM/YYYY') +
            ' ' +
            t(' for free shipping?')
        }`,
        submitButtonProps,
        onConfirm,
        onCancel
    } = meta || ({} as any);

    useEffect(() => {
        if (inputMeta) {
            toggleModalPeriodDeleteConfirmation();
            dispatch(hideshowPeriodPopupAction(false));
            return setMeta(inputMeta);
        }
        setTimeout(() => {
            setMeta(null);
        }, 500);
    }, [inputMeta]);

    const handleCancelBtnClick = useCallback(() => {
        dispatch(setModalConfirmationDeletePeriodMetaAction(null));
        toggleModalPeriodDeleteConfirmation();
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
                    toggleModalPeriodDeleteConfirmation();
                });
        },
        [onConfirm, handleCancelBtnClick]
    );

    return (
        <ModalPeriodDelete
            title={title}
            titleKey={title}
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

export default ConfirmationPeriodSetupModal;
