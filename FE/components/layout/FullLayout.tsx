import Header from '../header/Header';
import React from 'react';
import Footer from '../footer/Footer';
import { useSelector } from 'react-redux';
import { isDataLoadingSelector } from '../../redux/layouts/selectors';
import { useRouter } from 'next/router';

export default function FullLayout({ children }: { children: any }) {
    const showLoader = useSelector(isDataLoadingSelector);
    const router = useRouter();

    return (
        <>
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
            <Header />
            <div
                className={`min-h-[750px] ${
                    router.pathname == '/' ||
                    router.pathname == '/pricing' ||
                    router.pathname == '/plans' ||
                    router.pathname == '/customer-story' ||
                    router.pathname == '/features' ||
                    router.pathname == '/faq' ||
                    router.pathname == '/about-us' ||
                    router.pathname == '/terms-and-conditions' ||
                    router.pathname == '/auth/signin' ||
                    router.pathname == '/auth/restore' ||
                    router.pathname == '/auth/restore/password' ||
                    router.pathname == '/auth/signup' ||
                    router.pathname == '/auth/registration' ||
                    router.pathname == '/contact-us' ||
                    router.pathname == '/privacy'
                        ? 'bg-white'
                        : 'bg-gray-150'
                } text-black dark:text-white`}>
                {children}
            </div>
            <Footer />
        </>
    );
}
