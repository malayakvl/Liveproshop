import Head from 'next/head';
import FullLayout from '../../../components/layout/FullLayout';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router, { useRouter } from 'next/router';
import { userSelector } from '../../../redux/user/selectors';
import { orderCommentIdSelector } from '../../../redux/orders/selectors';
import { setTmpFbCommentAction } from '../../../redux/orders';
import { setupOrderByCommentAction } from '../../../redux/orders';
import { setNativeBrowserAction } from '../../../redux/layouts';

export default function Index({ locale }: { locale: string }) {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const orderId = useSelector(orderCommentIdSelector);
    const [detectedBrowswer, setDetectedBrowser] = useState('');

    const {
        query: { comment_id }
    } = useRouter();

    useEffect(() => {
        if (typeof comment_id === 'string') {
            window.localStorage.setItem('orderCommentId', comment_id);
            const ua = navigator.userAgent || navigator.vendor;
            console.log('Navigator FB', ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1);
            setDetectedBrowser(
                `Navigator FB: ${ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1}`
            );
            dispatch(setNativeBrowserAction(ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1));

            dispatch(setTmpFbCommentAction(comment_id));
        }
        if (user?.email && user.role_id == 1) {
            setTimeout(() => {
                dispatch(
                    setupOrderByCommentAction(
                        window.localStorage.getItem('orderCommentId'),
                        user?.email
                    )
                );
            }, 2000);
        } else {
            setTimeout(() => {
                // window.location.href = `${locale == 'fr' ? '' : '/en'}/auth/signup`;
                Router.push(`${locale == 'fr' ? '' : '/en'}/auth/signup`);
            }, 2000);
        }
    }, []);

    return (
        <div className="main-bg container xl:max-w-[1400px] mx-auto">
            <Head>
                <title>LiveProshop - Order Connection</title>
                <meta name="description" content="LiveProshop portal" />
            </Head>

            <div className="main-layout">
                <div className="connect-page-status">
                    <div className="font-bold absolute top-[100px] left-[30%]">
                        {detectedBrowswer}
                    </div>
                </div>
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
                ...require(`../../../messages/${locale}.json`),
                ...require(`../../../messages/faq/${locale}.json`)
            }
        }
    };
}
