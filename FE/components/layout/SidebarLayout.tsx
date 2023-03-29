import { SidebarCustomer, SidebarBuyer, SidebarAdmin } from '../sidebar/index';
import SidebarHeader from '../header/SidebarHeader';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../redux/user/selectors';
import { isDataLoadingSelector, isSidebarOpenSelector } from '../../redux/layouts/selectors';
import { toggleSidebarAction } from '../../redux/layouts';
import Router from 'next/router';

export default function SidebarLayout({ children }: { children: any }) {
    const user = useSelector(userSelector);
    const showLoader = useSelector(isDataLoadingSelector);
    const dispatch = useDispatch();
    const isSidebarOpen = useSelector(isSidebarOpenSelector);
    // const { isMobile } = useWindowSize();

    useEffect(() => {
        if (user.subscription_expired) {
            if (user.status === 'incomplete') {
                Router.push(`/subscription?planId=${user.plan_id}`);
            } else {
                Router.push(`/pricing`);
            }
        }
    }, [user?.email]);

    return (
        <div className="relative min-h-screen">
            {showLoader && (
                <div className="loader">
                    <div className="flex justify-center items-center w-full h-full">
                        <div
                            className="spinner-border animate-spin inline-block w-20 h-20 border-4 rounded-full"
                            role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
            {user.role_id === 1 && <SidebarBuyer />}
            {user.role_id === 2 && <SidebarCustomer />}
            {user.role_id === 3 && <SidebarAdmin />}
            <div
                className={`relative h-full mt-4 md:mt-8 md:mb-10 ${
                    !isSidebarOpen ? 'md:ml-8' : 'md:ml-64'
                } md:pl-4 md:mr-8`}>
                <div className="absolute top-3 left-4 md:hidden flex items-center">
                    <button
                        className="outline-none mobile-menu-button"
                        onClick={() => dispatch(toggleSidebarAction())}>
                        <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                <SidebarHeader />
                <div className="mt-10">{children}</div>
            </div>
        </div>
    );
}
