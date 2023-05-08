import React from 'react';
import { ModalProps } from 'react-bootstrap';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import { setModalCalendlyMetaAction } from '../../redux/layouts';
import { toggleCalendlyModalConfirmation } from '../../lib/functions';
import { InlineWidget } from 'react-calendly';

interface Props extends ModalProps {
    size?: 'sm' | 'lg' | 'xl';
    title?: string;
    titleKey?: string;
    backdrop?: true | false | 'static';
}

const ModalCalendly: React.FC<Props> = ({ ...props }) => {
    const t = useTranslations();
    const dispatch = useDispatch();

    return (
        <div
            className="modal opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center modal-calendly"
            {...props}>
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" />

            <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                {/*Add margin if you want to see some of the overlay behind the modal*/}
                <div className="modal-content py-4 text-left px-6">
                    {/*Title*/}
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">{t('About Liveproshop')}</p>
                        <div
                            role="presentation"
                            className="modal-close cursor-pointer z-50"
                            onClick={() => {
                                dispatch(setModalCalendlyMetaAction(null));
                                toggleCalendlyModalConfirmation();
                            }}>
                            <img
                                src="/images/close-modal.svg"
                                className="fill-current text-black"
                                alt={''}
                            />
                        </div>
                    </div>
                    {/*Body*/}
                    <InlineWidget url="https://calendly.com/victoriya-korogod/test" />
                </div>
            </div>
        </div>
    );
};

export default ModalCalendly;
