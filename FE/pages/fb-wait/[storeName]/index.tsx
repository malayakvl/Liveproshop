import Head from 'next/head';
import FullLayout from '../../../components/layout/FullLayout';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router, { useRouter } from 'next/router';
import { userSelector } from '../../../redux/user/selectors';
import { orderCommentIdSelector } from '../../../redux/orders/selectors';
import { setTmpFbCommentAction } from '../../../redux/orders';
import { setupOrderByCommentAction } from '../../../redux/orders';

export default function Index({ locale }: { locale: string }) {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const orderId = useSelector(orderCommentIdSelector);

    const {
        query: { comment_id }
    } = useRouter();

    useEffect(() => {
        console.log('here', comment_id);
        if (typeof comment_id === 'string') {
            window.localStorage.setItem('orderWaitCommentId', comment_id);
            dispatch(setTmpFbCommentAction(comment_id));
        }
        if (user?.email && user.role_id == 1) {
            setTimeout(() => {
                dispatch(
                    setupOrderByCommentAction(
                        window.localStorage.getItem('orderWaitCommentId'),
                        user?.email
                    )
                );
            }, 2000);
        } else {
            setTimeout(() => {
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
                <div className="connect-page-status"></div>
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
