import Head from 'next/head';
import { getSession } from 'next-auth/client';
import React from 'react';

export default function Index({ session }: { session: any }) {
    if (!session) return <></>;

    return (
        <>
            <Head>
                <title>LiveProshop - Test</title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-big">
                <div className="page-title">
                    <h1>Training section</h1>
                    <div className="clear-both" />
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context: any) {
    const { locale } = context;
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: { destination: `/${locale === 'fr' ? '' : `${locale}/`}auth/signin` }
        };
    }

    return {
        props: {
            session,
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
