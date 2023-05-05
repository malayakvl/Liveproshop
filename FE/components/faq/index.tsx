import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import _ from 'lodash';

function Faq() {
    const t = useTranslations();
    const [showMoreAnswer, setShowMoreAnswer] = useState<any>({});

    const showAnswer = (num: number) => {
        const nextCheckedItems = { ...showMoreAnswer };
        nextCheckedItems[num] = !nextCheckedItems[num];
        setShowMoreAnswer(nextCheckedItems);
    };

    return (
        <>
            <div className="flex">
                <div className="w-full">
                    <h1 className="page-heading text-center">{t('Frequently asked questions')}</h1>
                    <div className="block text-center mt-[20px] text-[14px] leading-[24px] text-gray-350 lg:text-[20px] lg:leading-[30px]">
                        {t('Have some questions before you get started?')}
                    </div>
                    <div className="block text-center mt-[20px] text-[12px] leading-[24px] text-gray-350 lg:text-[18px] lg:leading-[24px]">
                        {t('mes_1')}
                    </div>
                    <div className="faq-block">
                        {_.times(13, (i) => (
                            // <li key={i}>repeated 3 times</li>
                            <div className="faq-question-answer relative" key={i}>
                                <h4 className="question">{t(`arrayOfObjects.${i}.question`)}</h4>
                                <span
                                    className={`answer ${
                                        showMoreAnswer[i] ? 'inline-block' : 'hidden'
                                    }`}
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
                                            endLinkSignup: '</a>'
                                        })
                                    }}
                                />
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
