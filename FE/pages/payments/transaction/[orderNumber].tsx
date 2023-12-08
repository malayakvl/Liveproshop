import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import {
    PaymentInfo,
    ListProductsBought,
    TransactionDetailsPanel
} from '../../../components/payments';
import { fetchItemAction } from '../../../redux/payments';
import { itemSelector } from '../../../redux/payments/selectors';
import { singleDownloadAction } from '../../../redux/orders/actions';
import { singleDowloadFileSelector } from '../../../redux/orders/selectors';

export default function Payments({ session, locale }: { session: any; locale: string }) {
    if (!session) return <></>;
    const t = useTranslations();
    const dispatch = useDispatch();
    const fileDownload = useSelector(singleDowloadFileSelector);
    const achiveRefname = useRef(null);

    const item: Payments.DataItemDetailed = useSelector(itemSelector);

    const {
        query: { orderNumber }
    } = useRouter();

    useEffect(() => {
        dispatch(fetchItemAction(orderNumber));
    }, []);

    useEffect(() => {
        if (fileDownload) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            achiveRefname?.current.click();
        }
    }, [fileDownload]);

    return (
        <>
            <Head>
                <title>LiveProshop - Payment {orderNumber}</title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-big max-w-screen-xl">
                <PaymentInfo />
            </div>

            <div className="block-white-8 white-shadow-medium mt-8 flex max-w-screen-xl">
                <div className="flex flex-col w-full">
                    <div className="md:flex justify-between mb-8 font-bold text-gray-350 text-lg py-4 border-b border-gray-200">
                        <div>
                            <div className="float-left mr-2">
                                <Link href={`/payments`}>
                                    <a className="view-back">{t('Back')}</a>
                                </Link>
                            </div>
                            <div className="float-left">{t('Transaction details')}</div>
                        </div>

                        {/*<a*/}
                        {/*    href={`/api/download-invoice/${orderNumber}?lang=${locale}`}*/}
                        {/*    className="gradient-btn mt-4 md:mt-0 flex px-5 py-3 rounded-lg text-base max-w-max align-middle border shadow-lg"*/}
                        {/*    rel="noreferrer">*/}
                        {/*    <Image width="20" height="18" src={'/images/download.svg'} />*/}
                        {/*    <span className="pl-4 pt-px">{t('Download Invoice')}</span>*/}
                        {/*</a>*/}
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a
                            onClick={() => dispatch(singleDownloadAction(orderNumber, locale))}
                            href="javascript:;"
                            className="gradient-btn"
                            rel="noreferrer">
                            {/*<Image width="20" height="18" src={'/images/download.svg'} />*/}
                            <span className="   pt-px">{t('Download Invoice')}</span>
                        </a>
                    </div>

                    <div className="overflow-x-scroll flex w-full">
                        <div className="w-1/2 text-center hidden xl:block">
                            <Image
                                width="280"
                                height="237"
                                src={'/images/card-american-express.svg'}
                            />
                        </div>
                        <TransactionDetailsPanel item={item} />
                    </div>

                    <div className="mb-1 font-bold text-gray-350 text-lg py-4 border-b border-gray-200">
                        {t('Transaction bought')}
                    </div>

                    <ListProductsBought item={item} />
                </div>
                <a
                    href={fileDownload}
                    className="hidden"
                    target="_blank"
                    download
                    ref={achiveRefname}
                    rel="noreferrer">
                    Download file
                </a>
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
                ...require(`../../../messages/${locale}.json`)
            }
        }
    };
}
