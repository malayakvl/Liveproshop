import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/client';
import { useDispatch, useSelector } from 'react-redux';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { useRouter } from 'next/router';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// import { baseApiUrl } from '../../../constants';
import {
    orderFetchedSelector,
    // orderFileNameFetchedSelector,
    orderBase64DataSelector
} from '../../../redux/orders/selectors';
import { clearBase64Action, fetchOrderPdfAction } from '../../../redux/orders';
import { showLoaderAction } from '../../../redux/layouts/actions';
import Head from 'next/head';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const base64toBlob = (data: string) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    const out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'application/pdf' });
};

export default function Index() {
    // const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const dispatch = useDispatch();
    const orderFetched: boolean = useSelector(orderFetchedSelector);
    // const fileName: string = useSelector(orderFileNameFetchedSelector);
    const base64Data: string | null = useSelector(orderBase64DataSelector);

    const [url, setUrl] = useState('');
    const [blobData, setBlobData] = useState<any>(null);

    const {
        query: { orderNumber }
    } = useRouter();

    useEffect(() => {
        dispatch(showLoaderAction(true));
        dispatch(fetchOrderPdfAction(orderNumber));
    }, []);

    // useEffect(() => {
    //     if (orderFetched) {
    //         const blob = base64toBlob(`data:application/pdf;base64,${base64Data}`);
    //         setUrl(URL.createObjectURL(blob));
    //         dispatch(showLoaderAction(false));
    //     }
    // }, [orderFetched]);

    useEffect(() => {
        if (orderFetched && base64Data) {
            setBlobData(base64toBlob(`data:application/pdf;base64,${base64Data}`));
        }
        if (blobData) {
            setUrl(URL.createObjectURL(blobData));
            dispatch(showLoaderAction(false));
            dispatch(clearBase64Action(null));
        }
    }, [orderFetched, base64Data]);

    useEffect(() => {
        if (blobData) {
            setUrl(URL.createObjectURL(blobData));
            dispatch(showLoaderAction(false));
        }
    }, [blobData]);

    return (
        <>
            <Head>
                <title>LiveProshop - Order {orderNumber}</title>
            </Head>

            {orderFetched && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.js">
                    <div style={{ height: '750px' }}>
                        <Viewer
                            fileUrl={url}
                            // plugins={[defaultLayoutPluginInstance]}
                        />
                    </div>
                </Worker>
            )}
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
