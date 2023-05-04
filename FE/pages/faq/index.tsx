import Head from 'next/head';
import FullLayout from '../../components/layout/FullLayout';
import React from 'react';
import Faq from '../../components/faq';

export default function Index() {
    return (
        <div className="main-bg container xl:max-w-[1400px] mx-auto">
            <Head>
                <title>LiveProshop - FAQ</title>
                <meta name="description" content="LiveProshop portal" />
            </Head>

            <div className="main-layout">
                <Faq />
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
                ...require(`../../messages/${locale}.json`),
                ...require(`../../messages/faq/${locale}.json`)
            }
        }
    };
}
