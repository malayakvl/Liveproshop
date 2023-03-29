import React, { useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAction, setUserAction } from '../../redux/user';
import { userSelector } from '../../redux/user/selectors';

export default function MainLayout({ children }: { children: any }) {
    const [session] = useSession();
    const dispatch = useDispatch();
    const user = useSelector(userSelector);

    useEffect(
        function () {
            if (session?.user?.email && !window.localStorage.getItem('user')) {
                dispatch(fetchUserAction(session.user.email));
            } else {
                const localUser = JSON.parse(window.localStorage.getItem('user') || '{}');
                if (session?.user?.email !== localUser.email) {
                    window.localStorage.setItem('user', JSON.stringify({}));
                    dispatch(fetchUserAction(session?.user?.email));
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
        </div>
    );
}
