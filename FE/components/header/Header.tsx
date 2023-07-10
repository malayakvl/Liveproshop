import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/client';
import React, { useEffect, useRef, useState } from 'react';
import LangSwitcher from '../lang/Switcher';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { userSelector } from '../../redux/user/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { baseApiUrl } from '../../constants';
import { fetchLatestAction } from '../../redux/notifications';
import LoggedRight from './LoggedRight';
import LoggedRightMobile from './LoggedRightMobile';
import TextLeftMobile from './TextLeftMobile';

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
    const [showTextingMenu, setShowTestingMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const node = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(
        function () {
            if (user?.photo) {
                setUserPhoto(baseApiUrl + user?.photo);
            }
            if (user?.email !== undefined) {
                dispatch(fetchLatestAction());
            }
            if (window) {
                if (window.innerWidth < 768) {
                    setIsMobile(true);
                }
                const handleWindowResize = () => {
                    if (window.innerWidth < 768) {
                        setIsMobile(true);
                    } else {
                        setIsMobile(false);
                    }
                    console.log('Resize event', window.innerWidth);
                };
                window.addEventListener('resize', handleWindowResize);
                return () => {
                    window.removeEventListener('resize', handleWindowResize);
                };
            }
        },
        [user]
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    const handleClick = (e: any) => {
        // if (node?.current?.contains(e.target) || node?.current === null) {
        //     console.log('here');
        //     return;
        // }
        if (
            e.target.parentNode.classList.contains('profile-block') ||
            e.target.parentNode.classList.contains('profile-name') ||
            node?.current?.contains(e.target)
        ) {
            return;
        }
        setShowProfileMenu(false);
    };

    return (
        <header
            className={`w-full ${user?.email ? 'auth-header' : ''} ${
                router.pathname == '/' ||
                router.pathname == '/faq' ||
                router.pathname == '/pricing' ||
                router.pathname == '/full-guide' ||
                router.pathname == '/full-guide/livesession' ||
                router.pathname == '/full-guide/scenario' ||
                router.pathname == '/full-guide/rules' ||
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
                    <a className={`app-logo-f ${!user?.email ? 'app-logo-unreg' : ''}`} />
                </Link>

                <div>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <div
                        className="mobile-menu-button cursor-pointer"
                        onClick={() => {
                            setShowTestingMenu(!showTextingMenu);
                            // console.log('bla bla');
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
                    </div>
                    {!isMobile ? (
                        <>
                            <div
                                className="texting-menu"
                                style={{ display: showTextingMenu ? 'block' : 'none' }}>
                                <ul>
                                    <li>
                                        <Link href={'/features'}>
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a
                                                href=":;"
                                                // className="m-2 cursor-pointer hover:text-purple-400 drop-top-menu-item">
                                                className={`m-2 ${
                                                    router.pathname === '/features'
                                                        ? 'text-purple-400'
                                                        : ''
                                                } cursor-pointer hover:text-purple-400 drop-top-menu-item`}>
                                                {t('Features')}
                                            </a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={'/pricing'}>
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a
                                                href="javascript:void(0)"
                                                className={`m-2 ${
                                                    router.pathname === '/pricing'
                                                        ? 'text-purple-400'
                                                        : ''
                                                } cursor-pointer hover:text-purple-400 drop-top-menu-item`}>
                                                {t('Pricing')}
                                            </a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={'/case-studies'}>
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a
                                                href="javascript:void(0)"
                                                className={`m-2 ${
                                                    router.pathname === '/case-studies'
                                                        ? 'text-purple-400'
                                                        : ''
                                                } cursor-pointer hover:text-purple-400 drop-top-menu-item`}>
                                                {t('Case Studies')}
                                            </a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={'/faq'}>
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a
                                                href="javascript:void(0)"
                                                className={`m-2 ${
                                                    router.pathname === '/faq'
                                                        ? 'text-purple-400'
                                                        : ''
                                                } cursor-pointer hover:text-purple-400 drop-top-menu-item`}>
                                                {t('FAQ')}
                                            </a>
                                        </Link>
                                    </li>
                                    {/*<li>*/}
                                    {/*    <Link href={'/customer-story'}>*/}
                                    {/*        /!* eslint-disable-next-line jsx-a11y/anchor-is-valid *!/*/}
                                    {/*        <a*/}
                                    {/*            href="javascript:void(0)"*/}
                                    {/*            className="m-2 cursor-pointer hover:text-purple-400 drop-top-menu-item">*/}
                                    {/*            {t('Testimonials')}*/}
                                    {/*        </a>*/}
                                    {/*    </Link>*/}
                                    {/*</li>*/}
                                    <li>
                                        <Link href={'/contact-us'}>
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a
                                                href="javascript:void(0)"
                                                className={`m-2 ${
                                                    router.pathname === '/contact-us'
                                                        ? 'text-purple-400'
                                                        : ''
                                                } cursor-pointer hover:text-purple-400 drop-top-menu-item`}>
                                                {t('Contact Us')}
                                            </a>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <TextLeftMobile type={null} visible={showTextingMenu} />
                    )}
                </div>
                {/*<div style={{border: 'solid 1px'}}><LangSwitcher type="layout" /></div>*/}
                <div className="mt-[10px] right-header-block md:mt-auto">
                    {user?.email ? (
                        <>
                            {isMobile && <LoggedRightMobile type={'full'} />}
                            <div className={`${isMobile ? 'hidden' : ''} mt-4`}>
                                <LoggedRight />
                            </div>
                        </>
                    ) : (
                        <div className="unlogged-block">
                            <div className="hidden float:right layout-action-btns-block md:float-left md:inline-block">
                                <Link href={'/auth/signup'}>
                                    {/*<button className="sm:pl-0.5 sm:pr-0.5 md:w-auto gradient-btn max-h-[40px] pt-[7px] mr-[20px]">*/}
                                    <button className="sm:pl-0.5 sm:pr-0.5 md:w-auto gradient-btn max-h-[40px] pt-[7px] md:min-w-[195px]">
                                        <span className="inline-block">{t('Try for free')}!</span>
                                    </button>
                                </Link>
                            </div>
                            {!isMobile && <LangSwitcher type={null} />}
                            <span className="logout-btn login-btn-layout">
                                <Link href={'/auth/signin'}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a
                                        className="disabled-btn-small"
                                        href="javascript:void(0)"
                                        title={t('Login')}>
                                        {t('Login')}
                                        {/*<Image*/}
                                        {/*    className="mr-5"*/}
                                        {/*    src="/images/login-icon.svg"*/}
                                        {/*    width={24}*/}
                                        {/*    height={40}*/}
                                        {/*    alt={t('Logout')}*/}
                                        {/*/>*/}
                                    </a>
                                </Link>
                            </span>
                        </div>
                    )}
                </div>
                <div className="hidden right-header-block">
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
                                <button className="sm:pl-0.5 sm:pr-0.5 md:w-auto gradient-btn max-h-[40px] pt-[7px] mr-[20px]">
                                    <span className="inline-block">{t('Try for free')}!</span>
                                </button>
                            </Link>
                            {/*<LangSwitcher type="layout" />*/}
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
