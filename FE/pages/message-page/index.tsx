import Head from 'next/head';
import FullLayout from '../../components/layout/FullLayout';
import React, { useEffect, useState } from 'react';
import Features from '../../components/features';
import FBMessanger from '../../components/messanger';

export default function Index() {
    const [showMess, setShowMess] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMess(true);
        }, 7000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="main-bg container xl:max-w-[1400px] mx-auto">
            <Head>
                <title>LiveProshop - Features</title>
                <meta name="description" content="LiveProshop portal" />
            </Head>

            <div className="main-layout layout-fb">{showMess && <FBMessanger locale={'en'} />}</div>
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
                ...require(`../../messages/feature/${locale}.json`),
                ...require(`../../messages/main/${locale}.json`)
            }
        }
    };
}
