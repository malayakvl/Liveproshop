import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

export default function LeftMenu() {
    const t = useTranslations();
    const router = useRouter();
    const prefix = router.pathname.replace('full-guide/', '');

    return (
        <div className="guide-left">
            <div className="guide-menu">
                <div className="">
                    <span className="block text-left text-[18px] text-gray-350 md:text-[20px] font-bold mb-[10px] md:text-center">
                        {t('Table of contents')}
                    </span>
                    <ul className="">
                        <li className="mb-[10px]">
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                            <span
                                onClick={() => {
                                    router.push('/full-guide/livesession');
                                    // setLayoutActive('session');
                                }}
                                className={`cursor-pointer text-link${
                                    prefix === '/livesession' ? '-active' : ''
                                }`}>
                                {t('How to schedule a new live session?')}
                            </span>
                            <ul
                                className={`submenu none ${
                                    prefix === '/livesession' ? 'block' : 'hide-submenu'
                                }`}>
                                <li>
                                    <a href="#session-comment">{t('Comment arrêter le live?')}</a>
                                </li>
                                <li>
                                    <a href="#session-remarque">{t('Remarque!')}</a>
                                </li>
                            </ul>
                        </li>
                        <li className="mb-[10px]">
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                            <span
                                onClick={() => {
                                    router.push('/full-guide/scenario');
                                    // setLayoutActive('scenario');
                                }}
                                className={`cursor-pointer text-link${
                                    prefix === '/scenario' ? '-active' : ''
                                }`}>
                                {t('What is a Scenario?')}
                            </span>
                            <ul
                                className={`submenu none ${
                                    prefix === '/scenario' ? 'block' : 'hide-submenu'
                                }`}>
                                <li>
                                    <a href="#default-scenario">{t('Default Scenarios')}</a>
                                </li>
                                <li>
                                    <a href="#custom-scenario">{t('Custom Scenarios')}</a>
                                </li>
                                <li>
                                    <a href="#rule-scenario">{t('Rules')}</a>
                                </li>
                            </ul>
                        </li>
                        <li className="mb-[10px]">
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                            <span
                                onClick={() => {
                                    router.push('/full-guide/rules');
                                }}
                                className={`cursor-pointer text-link${
                                    prefix === '/rules' ? '-active' : ''
                                }`}>
                                {t('rules_csv')}
                            </span>
                        </li>
                    </ul>
                    <div className="clear-both" />
                </div>
            </div>
        </div>
    );
}
