import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
// import { Menu, Transition } from '@headlessui/react';
import LangSwitcher from '../lang/Switcher';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { userSelector } from '../../redux/user/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { baseApiUrl } from '../../constants';
import { fetchLatestAction } from '../../redux/notifications';
// import BrandMobile from "../sidebar/BrandMobile";
// import { toggleSidebarAction } from '../../redux/layouts';

const userProfileImg =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

interface Props {
    isNonPage?: boolean | null;
}

const Header: React.FC<Props> = ({ isNonPage }) => {
    // const [showProfileMenu, setShowProfileMenu] = useState(false);
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    // const node = useRef<HTMLDivElement>(null);
    const t = useTranslations();
    // const [session] = useSession();
    const [userPhoto, setUserPhoto] = useState(userProfileImg);
    const router = useRouter();

    useEffect(
        function () {
            if (user?.photo) {
                setUserPhoto(baseApiUrl + user?.photo);
            }
            if (user?.email !== undefined) {
                dispatch(fetchLatestAction());
            }
        },
        [user]
    );

    return (
        <header
            className={`w-full ${
                router.pathname == '/' ||
                router.pathname == '/faq' ||
                router.pathname == '/features' ||
                router.pathname == '/plans' ||
                router.pathname == '/privacy' ||
                router.pathname == '/about-us' ||
                router.pathname == '/terms-and-conditions' ||
                router.pathname == '/customer-story' ||
                router.pathname == '/auth/signin' ||
                router.pathname == '/auth/restore' ||
                router.pathname == '/contact-us' ||
                router.pathname == '/auth/registration' ||
                router.pathname == '/auth/restore/password' ||
                router.pathname == '/auth/signup' ||
                isNonPage
                    ? 'mb-10 md:mb-5 shadow-lg'
                    : ''
            }`}>
            <div className="container relative mx-auto layout-header xl:max-w-[1400px]">
                <Link href={'/'}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                    <a className="app-logo-f" />
                </Link>

                <div>
                    <div className="mobile-menu-button">
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
                    </div>
                    <div className="texting-menu">
                        <ul>
                            <li>
                                <Link href={'/customer-story'}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a
                                        href="javascript:void(0)"
                                        className="m-2 cursor-pointer hover:text-purple-400 drop-top-menu-item">
                                        {t('Testimonials')}
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={'/features'}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a
                                        href="javascript:void(0)"
                                        className="m-2 cursor-pointer hover:text-purple-400 drop-top-menu-item">
                                        {t('Features')}
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={'/plans'}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a
                                        href="javascript:void(0)"
                                        className="m-2 cursor-pointer hover:text-purple-400 drop-top-menu-item">
                                        {t('Pricing')}
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={'/faq'}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a
                                        href="javascript:void(0)"
                                        className="m-2 cursor-pointer hover:text-purple-400 drop-top-menu-item">
                                        {t('Case Studies')}
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={'/contact-us'}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a
                                        href="javascript:void(0)"
                                        className="m-2 cursor-pointer hover:text-purple-400 drop-top-menu-item">
                                        {t('Contact Us')}
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="right-header-block">
                    {user?.email ? (
                        <div className="profile-block profile-block-layout">
                            <div className="float-left h-[32px]">
                                <Image
                                    src={userPhoto}
                                    width={32}
                                    height={32}
                                    className="rounded-full cursor-pointer profile-img"
                                    alt=""
                                />
                            </div>
                            <span className="profile-name mt-[-4px] float-left border-1 border-black">
                                {user ? user.first_name : ''}
                                <span className="text-blue-350 pl-2 inline-block min-w-max">
                                    ID: {user?.id}
                                </span>
                                <em>{user?.company_name || t('No Company Name')}</em>
                            </span>
                        </div>
                    ) : (
                        <div className="layout-action-btns-block">
                            <Link href={'/auth/signup'}>
                                <button className="sm:pl-0.5 sm:pr-0.5 md:w-auto gradient-btn max-h-[40px] pt-[7px]">
                                    <span className="inline-block">{t('Try for free')}!</span>
                                </button>
                            </Link>
                            {/*<Link href={'/auth/signin'}>*/}
                            {/*    <button className="white-shadow md:w-auto disabled-btn max-h-[40px]">*/}
                            {/*        <span className="inline-block">Login</span>*/}
                            {/*    </button>*/}
                            {/*</Link>*/}
                        </div>
                    )}
                    <LangSwitcher type="layout" />
                    {user?.email ? (
                        <span className="logout-btn logout-btn-layout">
                            <a
                                href="/api/auth/signout"
                                title={t('Logout')}
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.localStorage.removeItem('user');
                                    signOut();
                                }}>
                                <Image
                                    className="mr-5"
                                    src="/images/icon-logout.svg"
                                    width={14}
                                    height={20}
                                    alt={t('Logout')}
                                />
                            </a>
                        </span>
                    ) : (
                        <span className="logout-btn login-btn-layout">
                            <Link href={'/auth/signin'}>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a href="javascript:void(0)" title={t('Login')}>
                                    <Image
                                        className="mr-5"
                                        src="/images/login-icon.svg"
                                        width={24}
                                        height={40}
                                        alt={t('Logout')}
                                    />
                                </a>
                            </Link>
                        </span>
                    )}
                </div>
                <div className="clear-both" />
            </div>
        </header>
    );
};

export default Header;
