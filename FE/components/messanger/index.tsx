import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { setModalCalendlyMetaAction } from '../../redux/layouts';

function FBMessanger({ locale }: { locale: string }) {
    const t = useTranslations();
    const [showMoreAnswer, setShowMoreAnswer] = useState<any>({});
    const dispatch = useDispatch();
    // const node = useRef<HTMLDivElement>(null);
    const showAnswer = (num: number) => {
        const nextCheckedItems = { ...showMoreAnswer };
        nextCheckedItems[num] = !nextCheckedItems[num];
        setShowMoreAnswer(nextCheckedItems);
    };
    return (
        <>
            <section className="message message-comp">
                <div className="center">
                    <div className="grid-message">
                        <div className="message-who"></div>
                        <div className="clear-both" />
                        <div className="col-message-received relative">
                            <div className="live-pro" />
                            <div className="message-received ml-[40px]">
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <p>
                                    You can find your order at this link{' '}
                                    <a
                                        href="https://liveproshop.com"
                                        style={{ color: 'blue' }}
                                        target="_blank"
                                        rel="noreferrer">
                                        LP 16082023-3
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div className="col-message-sent">
                            <div className="message-sent">
                                <p>Tnks, got it</p>
                            </div>
                        </div>
                    </div>
                    <div className="message-box" style={{ marginTop: '280px' }}>
                        <div className="message-send-field"></div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default FBMessanger;
