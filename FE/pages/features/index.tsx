import Head from 'next/head';
import { getSession } from 'next-auth/client';
// import { useTranslations } from 'next-intl';
import FullLayout from '../../components/layout/FullLayout';
import React from 'react';
import Features from '../../components/features';

export default function Index() {
    // const t = useTranslations();

    return (
        <div className="main-bg container xl:max-w-[1400px] mx-auto">
            <Head>
                <title>LiveProshop - Features</title>
                <meta name="description" content="LiveProshop portal" />
            </Head>

            <div className="main-layout">
                <Features />
            </div>
        </div>
    );
}
Index.Layout = FullLayout;

export async function getServerSideProps(context: any) {
    const { locale } = context;
    const session = await getSession(context);

    return {
        props: {
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`),
                ...require(`../../messages/main/${locale}.json`)
            }
        }
    };
}
