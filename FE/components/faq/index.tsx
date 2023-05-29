import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { setModalCalendlyMetaAction } from '../../redux/layouts';

function Faq() {
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
            <div className="flex mt-[-30px]">
                <div className="w-full">
                    <div className="faq-bg">
                        <span className="block text-16px mb-[10px] md:text-[14px] text-gray-350 font-semibold md:ml-[5px]">
                            {t('Support')}
                        </span>
                        <h1 className="page-heading text-left md:mr-[300px] 2xl:mr-auto">
                            {t('Frequently asked questions')}
                        </h1>
                        <div className="block text-left mt-[20px] text-[20px] leading-[24px] text-gray-350 md:mr-[300px]  2xl:mr-auto lg:text-[30px] lg:leading-[25px]">
                            {t('Have some questions before you get started?')}
                        </div>
                    </div>
                    <div className="block text-left mt-[15px] text-[14px] leading-[24px] text-gray-350 md:mr-[300px] lg:text-[20px] lg:leading-[24px] max-w-[800px]">
                        {t('mes_1')}
                    </div>
                    <div className="faq-block">
                        {_.times(14, (i) => (
                            // <li key={i}>repeated 3 times</li>
                            <div className="faq-question-answer relative" key={i}>
                                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                                <h4
                                    className="question cursor-pointer"
                                    onClick={() => showAnswer(i)}>
                                    {t(`arrayOfObjects.${i}.question`)}
                                </h4>
                                <span
                                    className={`answer ${
                                        showMoreAnswer[i] ? 'inline-block' : 'hidden'
                                    }`}>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: t(`arrayOfObjects.${i}.answer`, {
                                                linkTariffs:
                                                    "<a class='text-red-800' target='_blank' href='" +
                                                    process.env.API_SITE_URL +
                                                    "/pricing'>",
                                                endLinkTariffs: '</a>',
                                                linkSignup:
                                                    "<a class='text-red-800' target='_blank' href='" +
                                                    process.env.API_SITE_URL +
                                                    "/auth/signup'>",
                                                endLinkSignup: '</a>',
                                                linkGuide:
                                                    "<a class='text-red-800' target='_blank' href='" +
                                                    process.env.API_SITE_URL +
                                                    "/guide'>",
                                                endLinkGuide: '</a>'
                                            })
                                        }}
                                    />
                                    {i === 8 && (
                                        <>
                                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                                            <span
                                                className="text-red-800 cursor-pointer"
                                                onClick={() => {
                                                    dispatch(setModalCalendlyMetaAction(true));
                                                }}>
                                                {' '}
                                                {t('link_meeting')}
                                            </span>
                                            <span>{t('text_after_link_meet')}</span>
                                        </>
                                    )}
                                </span>

                                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                                <span
                                    onClick={() => showAnswer(i)}
                                    className={`toggle-icon ${
                                        showMoreAnswer[i] ? 'toggle-close' : ''
                                    }`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Faq;
