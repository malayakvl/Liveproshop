import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    deletePeriodPopupSelector,
    deletePeriodSelector,
    modalConfirmationPeriodMetaSelector
} from '../../../redux/layouts/selectors';
import {
    setModalConfirmationPeriodMetaAction,
    hideshowPeriodPopupAction
} from '../../../redux/layouts';
import { ModalPeriod } from '../../_common';
import { toggleModalPeriodConfirmation } from '../../../lib/functions';
import { useTranslations } from 'next-intl';
import moment from 'moment/moment';

const ConfirmationPeriodModal: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const inputMeta = useSelector(modalConfirmationPeriodMetaSelector);
    const hideShowPeriodPopup = useSelector(deletePeriodPopupSelector);
    const [meta, setMeta] = useState<Layouts.ModalPeriodMeta | null>(null);
    const periodDelete = useSelector(deletePeriodSelector);
    const t = useTranslations();

    const {
        title = `${
            t('Do you want to delete period') +
            '' +
            moment(periodDelete?.free_shipping_from).format('DD/MM/YYYY') +
            ' - ' +
            moment(periodDelete?.free_shipping_to).format('DD/MM/YYYY') +
            ' ' +
            t('for free shipping?')
        }`,
        submitButtonProps,
        onConfirm,
        onCancel
    } = meta || ({} as any);

    useEffect(() => {
        console.log('Hideeeeee', hideShowPeriodPopup);
        if (inputMeta || hideShowPeriodPopup) {
            toggleModalPeriodConfirmation();
            dispatch(hideshowPeriodPopupAction(false));
            return setMeta(inputMeta);
        }
        setTimeout(() => {
            setMeta(null);
        }, 500);
    }, [inputMeta]);

    const handleCancelBtnClick = useCallback(() => {
        dispatch(setModalConfirmationPeriodMetaAction(null));
        toggleModalPeriodConfirmation();
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
                    toggleModalPeriodConfirmation();
                });
        },
        [onConfirm, handleCancelBtnClick]
    );

    return (
        <ModalPeriod
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

export default ConfirmationPeriodModal;
