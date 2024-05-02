import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    deletePeriodPopupSelector,
    modalConfirmationPeriodSetupMetaSelector,
    setupPeriodSelector
} from '../../../redux/layouts/selectors';
import {
    setModalConfirmationSetupPeriodMetaAction,
    hideshowPeriodPopupAction
} from '../../../redux/layouts';
import { toggleModalPeriodSetupConfirmation } from '../../../lib/functions';
import { useTranslations } from 'next-intl';
import moment from 'moment/moment';
import ModalPeriodSetup from '../ModalPeriodSetup';

const ConfirmationPeriodSetupModal: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const inputMeta = useSelector(modalConfirmationPeriodSetupMetaSelector);
    const hideShowPeriodPopup = useSelector(deletePeriodPopupSelector);
    const [meta, setMeta] = useState<Layouts.ModalConfirmPeriodMeta | null>(null);
    const periodSetup = useSelector(setupPeriodSelector);
    const t = useTranslations();

    const {
        title = `${
            t('Do you want to set the period from ') +
            '' +
            moment(periodSetup?.startDate).format('DD/MM/YYYY') +
            ' - ' +
            moment(periodSetup?.endDate).format('DD/MM/YYYY') +
            ' ' +
            t(' for free shipping?')
        }`,
        submitButtonProps,
        onConfirm,
        onCancel
    } = meta || ({} as any);

    useEffect(() => {
        if (inputMeta) {
            toggleModalPeriodSetupConfirmation();
            dispatch(hideshowPeriodPopupAction(false));
            return setMeta(inputMeta);
        }
        setTimeout(() => {
            setMeta(null);
        }, 500);
    }, [inputMeta]);

    const handleCancelBtnClick = useCallback(() => {
        dispatch(setModalConfirmationSetupPeriodMetaAction(null));
        toggleModalPeriodSetupConfirmation();
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
                    console.log('on confirm');
                    toggleModalPeriodSetupConfirmation();
                });
        },
        [onConfirm, handleCancelBtnClick]
    );

    return (
        <ModalPeriodSetup
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
                localeKey: submitButtonProps?.localeKey || 'Set the period',
                className: submitButtonProps?.className || 'agree',
                onClick: handleSubmitBtnClick
            }}
        />
    );
};

export default ConfirmationPeriodSetupModal;
