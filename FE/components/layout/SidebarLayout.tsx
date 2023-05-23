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
    // const isMobileDevice = useSelector(isMobileDeviceSelector);
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
                className={`relative ml-0 h-full mt-2 pb-2 md:mt-0 md:mb-10 md:pl-4 md:mr-8 ${
                    !isSidebarOpen ? 'side-margin' : 'side-with-sidebar'
                }`}>
                <div className="absolute md:hidden flex items-center">
                    <button
                        className="outline-none mobile-menu-button"
                        onClick={() => {
                            dispatch(toggleSidebarAction());
                        }}>
                        <svg
                            width="24"
                            height="40"
                            viewBox="0 0 24 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3 15C3 14.4477 3.44772 14 4 14H20C20.5523 14 21 14.4477 21 15C21 15.5523 20.5523 16 20 16H4C3.44772 16 3 15.5523 3 15ZM3 20C3 19.4477 3.44772 19 4 19H14C14.5523 19 15 19.4477 15 20C15 20.5523 14.5523 21 14 21H4C3.44772 21 3 20.5523 3 20ZM4 24C3.44772 24 3 24.4477 3 25C3 25.5523 3.44772 26 4 26H8C8.55228 26 9 25.5523 9 25C9 24.4477 8.55228 24 8 24H4Z"
                                fill="#4F5B84"
                            />
                        </svg>
                    </button>
                </div>

                <SidebarHeader />
                <div className="mt-6">{children}</div>
            </div>
        </div>
    );
}
