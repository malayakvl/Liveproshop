import React, { useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAction, setUserAction } from '../../redux/user';
import { userSelector } from '../../redux/user/selectors';
import CookieConsent from 'react-cookie-consent';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { fetchUserOrderAction } from '../../redux/orders/actions';

export default function MainLayout({ children }: { children: any }) {
    const [session] = useSession();
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const t = useTranslations();

    useEffect(
        function () {
            if (session?.user?.email && !window.localStorage.getItem('user')) {
                console.log('PIZDA');
                dispatch(fetchUserAction(session.user.email));
                if (window.localStorage.getItem('order_comment_id')) {
                    dispatch(
                        fetchUserOrderAction(
                            session?.user.email,
                            window.localStorage.getItem('order_comment_id')
                        )
                    );
                }
            } else {
                const localUser = JSON.parse(window.localStorage.getItem('user') || '{}');
                // console.log('SESSION EMAIL', session?.user?.email);
                // console.log('LOCAL EMAIL', localUser.email);
                if (session?.user?.email !== localUser.email) {
                    // WTF я не помню зачем я ето делала
                    // window.localStorage.setItem('user', JSON.stringify({}));
                    if (session?.user?.email !== undefined) {
                        dispatch(fetchUserAction(session?.user?.email));
                    }
                    // session?.user?.email = localUser.email;
                    // if (session?.user?.email) {
                    //     session.user.email = localUser.email;
                    // }
                    // console.log(localUser.email);
                    // dispatch(fetchUserAction(localUser.email));
                    // dispatch(fetchUserAction(session?.user?.email));
                    if (window.localStorage.getItem('orderCommentId')) {
                        // dispatch(
                        //     fetchUserOrderAction(
                        //         session?.user?.email,
                        //         window.localStorage.getItem('orderCommentId')
                        //     )
                        // );
                        // dispatch(
                        //     fetchUserOrderAction(
                        //         localUser.email,
                        //         window.localStorage.getItem('orderCommentId')
                        //     )
                        // );
                    }
                } else {
                    dispatch(
                        setUserAction(JSON.parse(window.localStorage.getItem('user') || '{}'))
                    );
                }
            }
        },
        [dispatch, session?.user?.email]
    );

    useEffect(
        function () {
            if (user && Object.keys(user).length) {
                const storeUser = window.localStorage.getItem('user')
                    ? JSON.parse(window.localStorage.getItem('user') || '')
                    : {};
                if (storeUser.id !== user.id || storeUser.status !== user.status) {
                    window.localStorage.setItem('user', JSON.stringify(user));
                }
            }
        },
        [dispatch, user]
    );

    return (
        <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased text-black">
            {children}
            <CookieConsent
                location="top"
                buttonText={t('Accept Cookies')}
                declineButtonText={t('Decline Cookes')}
                cookieName="myAwesomeCookieName2"
                style={{ background: '#FFF' }}
                buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
                buttonWrapperClasses={'cookies-btn-block'}
                enableDeclineButton
                expires={150}>
                <div className="cookie-text">
                    <span>
                        {t('cookie_text')}
                        <em>
                            <Link href={'/privacy'}>
                                <a className="red-yellow-gradient-text" target="_blank">
                                    {t('cookie_policy_link')}
                                </a>
                            </Link>
                        </em>
                    </span>
                </div>
                {/*<span style={{ fontSize: '10px' }}>This bit of text is smaller :O</span>*/}
            </CookieConsent>
        </div>
    );
}
