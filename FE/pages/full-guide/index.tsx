import Head from 'next/head';
import FullLayout from '../../components/layout/FullLayout';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LeftMenu, LivesessionRules, ScenarioRules, TextRules } from '../../components/guides';

export default function Index({ locale }: { locale: string }) {
    const t = useTranslations();
    const [layoutActive, setLayoutActive] = useState('session');

    return (
        <div className="main-bg container xl:max-w-[1400px] mx-auto">
            <Head>
                <title>LiveProshop - Guide</title>
                <meta name="description" content="LiveProshop portal" />
            </Head>

            <div className="main-layout">
                <div className="block mb-[40px] text-[16px] md:text-[18px] font-bold text-gray-350">
                    {t('guide_heading')}
                </div>
                <div className="md:flex">
                    <LeftMenu />
                    <div className="guide-right">
                        <div
                            className={`livesession-content ${
                                layoutActive !== 'session' ? 'hidden' : ''
                            }`}>
                            <LivesessionRules />
                        </div>
                        <div
                            className={`livesession-content ${
                                layoutActive !== 'scenario' ? 'hidden' : 'block'
                            }`}>
                            <ScenarioRules locale={locale} />
                        </div>
                        <div
                            className={`livesession-content ${
                                layoutActive !== 'rules' ? 'hidden' : 'block'
                            }`}>
                            <TextRules locale={locale} />
                        </div>
                        <div
                            className={`livesession-content ${
                                layoutActive !== 'addproduct' ? 'hidden' : ''
                            }`}>
                            {/*<InventoryAdd />*/}
                        </div>
                        <div className={`payment ${layoutActive !== 'payment' ? 'hidden' : ''}`}>
                            {/*<InventoryAdd />*/}
                        </div>
                    </div>
                </div>
                <div className="clear-both" />
            </div>
        </div>
    );
}
Index.Layout = FullLayout;

export async function getServerSideProps(context: any) {
    const { locale } = context;
    return {
        props: {
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
