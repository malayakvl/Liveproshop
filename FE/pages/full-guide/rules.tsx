import Head from 'next/head';
import FullLayout from '../../components/layout/FullLayout';
import React, { useState } from 'react';
import { LeftMenu, TextRules } from '../../components/guides';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

export default function Rules({ locale }: { locale: string }) {
    const t = useTranslations();
    const router = useRouter();

    return (
        <div className="main-bg container xl:max-w-[1400px] mx-auto">
            <Head>
                <title>LiveProshop - Guide</title>
                <meta name="description" content="LiveProshop portal" />
            </Head>

            <div className="main-layout">
                <div className="block mb-[40px] text-[18px] font-bold text-gray-350">
                    {t('csv_head_guide')}
                </div>
                <div className="md:flex">
                    <LeftMenu />
                    <div className="guide-right">
                        <TextRules locale={locale} />
                    </div>
                </div>
                <div className="clear-both" />
            </div>
        </div>
    );
}
Rules.Layout = FullLayout;

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
