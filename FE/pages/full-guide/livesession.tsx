import Head from 'next/head';
import FullLayout from '../../components/layout/FullLayout';
import React, { useState } from 'react';
import { LeftMenu, LivesessionRules } from '../../components/guides';
import { useTranslations } from 'next-intl';
// import { useRouter } from 'next/router';

export default function Livesession() {
    const t = useTranslations();
    // const [layoutActive, setLayoutActive] = useState('session');
    // const router = useRouter();

    return (
        <div className="main-bg container xl:max-w-[1400px] mx-auto">
            <Head>
                <title>LiveProshop - Guide</title>
                <meta name="description" content="LiveProshop portal" />
            </Head>

            <div className="main-layout">
                <div className="block mb-[40px] text-[18px] font-bold text-gray-350">
                    !!{t('guide_heading')}
                </div>
                <div className="md:flex">
                    <LeftMenu />
                    <div className="guide-right">
                        <LivesessionRules />
                    </div>
                </div>
                <div className="clear-both" />
            </div>
        </div>
    );
}
Livesession.Layout = FullLayout;

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
