import React from 'react';
import { ModalProps } from 'react-bootstrap';
import { Button } from '../../components/_common';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import { setModalConfirmationMetaAction } from '../../redux/layouts';
import { toggleModalConfirmation } from '../../lib/functions';

interface Props extends ModalProps {
    size?: 'sm' | 'lg' | 'xl';
    title?: string;
    titleKey?: string;
    backdrop?: true | false | 'static';
    children?: React.ReactElement;
    customButton?: React.ReactElement;
    cancelButtonProps: {
        disabled?: boolean;
        localeKey?: string;
        onClick: (event: React.SyntheticEvent) => void;
    };
    submitButtonProps?: {
        className?: 'danger';
        disabled?: boolean;
        isLoading?: boolean;
        localeKey: string;
        iconClassName?: string;
        onClick: (event: React.SyntheticEvent) => void;
    };
}

const Modal: React.FC<Props> = ({
    title = '',
    titleKey,
    children,
    customButton,
    cancelButtonProps,
    submitButtonProps,
    ...props
}) => {
    const t = useTranslations();
    const dispatch = useDispatch();

    return (
        <div
            className="modal opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center modal-confirmation"
            {...props}>
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" />

            <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                {/*Add margin if you want to see some of the overlay behind the modal*/}
                <div className="modal-content py-4 text-left px-6">
                    {/*Title*/}
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">{title || (titleKey && t(titleKey))}</p>
                        <div
                            role="presentation"
                            className="modal-close cursor-pointer z-50"
                            onClick={() => {
                                dispatch(setModalConfirmationMetaAction(null));
                                toggleModalConfirmation();
                            }}>
                            <img
                                src="/images/close-modal.svg"
                                className="fill-current text-black"
                                alt={''}
                            />
                        </div>
                    </div>
                    {/*Body*/}
                    {children && <>{children}</>}
                    {customButton}
                    {submitButtonProps && (
                        <Button
                            {...submitButtonProps}
                            iconClassName={submitButtonProps.iconClassName || 'fa fa-check'}
                        />
                    )}
                    <Button
                        className="cancel ml-3"
                        iconClassName="fas fa-times"
                        {...cancelButtonProps}
                        localeKey={cancelButtonProps.localeKey || 'Cancel'}
                    />
                </div>
            </div>
        </div>
    );
};

export default Modal;
