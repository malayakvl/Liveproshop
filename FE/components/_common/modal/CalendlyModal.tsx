import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modalCalendlyMetaSelector } from '../../../redux/layouts/selectors';
import { setModalCalendlyMetaAction } from '../../../redux/layouts';
import { toggleCalendlyModalConfirmation } from '../../../lib/functions';
import ModalCalendly from '../ModalCalendly';

const CalendlyModal: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const inputMeta = useSelector(modalCalendlyMetaSelector);
    const [meta, setMeta] = useState<Layouts.ModalConfirmationMeta | null>(null);
    const { title = '', titleKey = 'Do you want to delete', onCancel } = meta || ({} as any);

    useEffect(() => {
        if (inputMeta) {
            toggleCalendlyModalConfirmation();
            return setMeta(inputMeta);
        }
        setTimeout(() => {
            setMeta(null);
        }, 500);
    }, [inputMeta]);

    const handleCancelBtnClick = useCallback(() => {
        dispatch(setModalCalendlyMetaAction(null));
        toggleCalendlyModalConfirmation();
    }, [dispatch]);

    // const handleSubmitBtnClick = useCallback(
    //     (event: React.SyntheticEvent) => {
    //         event.preventDefault();
    //         if (!onConfirm) return;
    //         setIsLoading(true);
    //         onConfirm()
    //             .then(handleCancelBtnClick)
    //             .finally(() => {
    //                 setIsLoading(false);
    //                 toggleCalendlyModalConfirmation();
    //             });
    //     },
    //     [onConfirm, handleCancelBtnClick]
    // );

    return <ModalCalendly />;
};

export default CalendlyModal;
