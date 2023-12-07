import Head from 'next/head';
import FullLayout from '../../../components/layout/FullLayout';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
// import { setFbCommentAction, findOrderByCommentAction } from '../../../redux/orders';
import { userSelector } from '../../../redux/user/selectors';
// import {findOrderByCommentUnregAction} from "../../../redux/orders/actions";
// import { useNavigate } from 'react-router-dom';
import { orderCommentIdSelector } from '../../../redux/orders/selectors';
// import {findOrderByCommentAction} from "../../../redux/orders";

export default function Index({ locale }: { locale: string }) {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const orderId = useSelector(orderCommentIdSelector);
    // const navigate = useNavigate();

    const {
        query: { comment_id }
    } = useRouter();

    useEffect(() => {
        if (typeof comment_id === 'string') {
            window.localStorage.setItem('orderCommentId', comment_id);
            // dispatch(findOrderByCommentAction(comment_id));
        }
        if (user?.email && user.role_id == 1) {
            // dispatch(
            //     findOrderByCommentAction(window.localStorage.getItem('orderCommentId'), user?.email)
            // );
            // window.location.href = `${locale == 'fr' ? '' : '/en'}/orders`;
        } else {
            window.location.href = `${locale == 'fr' ? '' : '/en'}/auth/signup`;
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
