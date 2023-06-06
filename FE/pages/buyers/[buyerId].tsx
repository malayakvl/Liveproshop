import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import { useTranslations } from 'next-intl';
import { itemSelector } from '../../redux/buyers/selectors';
import { fetchItemAction } from '../../redux/buyers';

import { InfoBuyers, BuyerDetailsPanel, ListOrders } from '../../components/buyer';

export default function Buyers({ session }: { session: any }) {
    if (!session) return <></>;
    const t = useTranslations();
    const dispatch = useDispatch();

    const item: Buyers.DataItem = useSelector(itemSelector);

    const {
        query: { buyerId }
    } = useRouter();

    useEffect(() => {
        dispatch(fetchItemAction(buyerId));
    }, []);

    return (
        <>
            <Head>
                <title>LiveProshop - Shoppers - Shopper</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/images/logo-1.svg" />
            </Head>

            <div className="block-white-8 mr-10 white-shadow-big">
                <InfoBuyers />
            </div>

            <div className="block-white-8 white-shadow-medium mt-8 flex">
                <div className="flex flex-col w-full">
                    <div className="flex justify-between mb-8 font-bold text-gray-350 text-lg py-4 border-b border-gray-200">
                        {t('Shopper details')}

                        {/* <a
                            href={`/api/download-invoice/${buyerId}`}
                            className="flex px-5 py-3 rounded-lg text-base min-w-max align-middle border shadow-lg"
                            rel="noreferrer">
                            <Image width="20" height="18" src={'/images/download.svg'} />
                            <span className="pl-4 pt-px">{t('Download Invoice from emmisor')}</span>
                        </a> */}
                    </div>

                    <div className="flex w-full">
                        <div className="w-1/2 text-center hidden xl:block">
                            {/* <Image
                                width="280"
                                height="237"
                                src={'/images/card-american-express.svg'}
                            /> */}
                        </div>
                        <BuyerDetailsPanel item={item} />
                    </div>

                    <div className="mb-1 font-bold text-gray-350 text-lg py-4 border-b border-gray-200">
                        {t('Orders')}
                    </div>
                    <ListOrders orders={item?.order_items} />
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
