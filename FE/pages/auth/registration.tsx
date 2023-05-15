import React from 'react';
import Head from 'next/head';
import FullLayout from '../../components/layout/FullLayout';
import getConfig from 'next/config';
import BuyerRegistration from '../../components/form/BuyerRegistration';
import SellerRegistration from '../../components/form/SellerRegistration';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/auth`;

function Registration({ locale, invitation }: { locale: string; invitation: any }) {
    let Form = <></>;
    if (invitation.role_id === 1) {
        Form = <BuyerRegistration email={invitation.email} locale={locale} />;
    }

    if (invitation.role_id === 2) {
        Form = <SellerRegistration email={invitation.email} locale={locale} />;
    }

    return (
        <>
            <Head>
                <title>LiveProshop - Registration</title>
            </Head>

            <div className="flex main-bg justify-center">{Form}</div>
        </>
    );
}
Registration.Layout = FullLayout;

export default Registration;

export async function getServerSideProps(context: any) {
    const {
        query: { hash },
        locale
    } = context;
    const res = await fetch(`${baseUrl}/invitation/${hash}`);
    if (res.status !== 200) {
        return {
            redirect: { destination: '/' }
        };
    }

    const json = await res.json();
    if (!json.active) {
        return {
            locale,
            invitation: json,
            redirect: { destination: '/' }
        };
    }
    return {
        props: {
            locale,
            invitation: json,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
    // console.log(locale, json);

    // return {
    //     props: { invitation: json, locale: locale }
    // };
}
