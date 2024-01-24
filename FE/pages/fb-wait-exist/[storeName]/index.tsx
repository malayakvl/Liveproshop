import Head from 'next/head';
import FullLayout from '../../../components/layout/FullLayout';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router, { useRouter } from 'next/router';
// import { setFbCommentAction, findOrderByCommentAction } from '../../../redux/orders';
import { userSelector } from '../../../redux/user/selectors';
// import {findOrderByCommentUnregAction} from "../../../redux/orders/actions";
// import { useNavigate } from 'react-router-dom';
import { orderCommentIdSelector } from '../../../redux/orders/selectors';
import { setTmpFbCommentAction } from '../../../redux/orders';
import { setupExistOrderByCommentAction } from '../../../redux/orders';

export default function Index({ locale }: { locale: string }) {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const orderId = useSelector(orderCommentIdSelector);
    // const navigate = useNavigate();
    // http://localhost:3000/en/fb-order/ahead-fashion?comment_id=372155932034821_1183669132590892

    const {
        query: { order_id }
    } = useRouter();

    useEffect(() => {
        console.log('Order Id', order_id);
        console.log('Type of', typeof order_id === 'string');
        if (typeof order_id === 'string') {
            window.localStorage.setItem('orderWaitCommentId', order_id);
            dispatch(setTmpFbCommentAction(order_id));
        }
        if (user?.email && user.role_id == 1) {
            setTimeout(() => {
                dispatch(setupExistOrderByCommentAction(order_id, user?.email));
            }, 2000);
            // window.location.href = `${locale == 'fr' ? '' : '/en'}/about-us`;
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
