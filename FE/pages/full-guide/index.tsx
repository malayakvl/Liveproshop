import Head from 'next/head';
// import Link from 'next/link';
// import Image from 'next/image';
// import { getSession } from 'next-auth/client';
import FullLayout from '../../components/layout/FullLayout';
import React, { useState } from 'react';
// import { useTranslations } from 'next-intl';
// import { LivesessionRules, ScenarioRules } from '../../components/guides';
// import { history } from 'react-router';
// import { history } from '../../_helpers/history';
// import { useRouter } from 'next/router';
import { LeftMenu, LivesessionRules, ScenarioRules, TextRules } from '../../components/guides';

export default function Index({ locale }: { locale: string }) {
    // const t = useTranslations();
    const [layoutActive, setLayoutActive] = useState('session');
    // const router = useRouter();

    return (
        <div className="main-bg container xl:max-w-[1400px] mx-auto">
            <Head>
                <title>LiveProshop - Guide</title>
                <meta name="description" content="LiveProshop portal" />
            </Head>

            <div className="main-layout">
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
