import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import NoticeCounter from './NoticeCounter';
import { fetchLatestAction } from '../../redux/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'next-auth/client';
import { userSelector } from '../../redux/user/selectors';
import { useTranslations } from 'next-intl';
import { baseApiUrl } from '../../constants';
import LangSwitcherInline from '../lang/SwitcherInline';
// import LangSwitcher from '../lang/Switcher';
// import LoggedRight from "./LoggedRight";

const userProfileImg =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

interface Props {
    type: string | null;
}

const LoggedRightMobile: React.FC<Props> = (type) => {
    const t = useTranslations();
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [userPhoto, setUserPhoto] = useState(userProfileImg);
    const node = useRef<HTMLDivElement>(null);
    // const [windowWidth, setWindowWidth] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [toggleSideClass, setToggleSideClass] = useState('left-side-close');

    console.log('Type', type.type);

    useEffect(
        function () {
            if (user.photo) {
                setUserPhoto(baseApiUrl + user.photo);
            }
            if (user.email !== undefined) {
                dispatch(fetchLatestAction());
            }
            if (window) {
                console.log(window.innerWidth);
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

    const toggleSidebar = () => {
        setToggleSideClass(
            toggleSideClass !== 'left-side-open' ? 'left-side-open' : 'left-side-close'
        );
    };

    return (
        <>
            {isMobile && (
                <div style={{ height: '30px' }}>
                    <div className="app-logo app-logo-mob" />
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <div
                        className={`md:hidden dotted-menu cursor-pointer border-red-50 ${
                            type?.type == 'full' ? 'float-right mr-[12px]' : ''
                        }`}
                        onClick={() => toggleSidebar()}
                    />
                    <nav
                        id="sidenav-2"
                        className={`${toggleSideClass} fixed left-0 top-0 z-[1035] h-screen overflow-hidden md:h-[90px]`}>
                        <div className="sm:text-[16px]">
                            <span className="mobile-spacer" />
                            <div className="md:relative md:mr-[30px]">
                                <div
                                    ref={node}
                                    className="absolute
                                            top-[5px] left-[20px]
                                            md:top-[0px] min-w-[32px]
                                            right-[-50px]  md:right-[-120px] md:static
                                            profile-block inline-block cursor-pointer"
                                    role="presentation"
                                    onClick={() => {
                                        setShowProfileMenu(!showProfileMenu);
                                    }}>
                                    <div className="float-left">
                                        <Image
                                            src={userPhoto}
                                            width={32}
                                            height={32}
                                            className="rounded-full cursor-pointer profile-img"
                                            alt=""
                                        />
                                    </div>
                                    <div className="">
                                        <span className="profile-name profile-name-mobile mt-[-4px] float-left">
                                            {user.first_name || user.last_name
                                                ? user.first_name
                                                : user.email}
                                            <span className="text-[16px] text-blue-350 pl-2 inline-block min-w-max">
                                                ID: {user.id}
                                            </span>
                                            <em className="red-yellow-gradient-text text-[20px]">
                                                {user.company_name || t('No Company Name')}
                                            </em>
                                        </span>
                                    </div>
                                </div>
                                {/* Profile dropdown */}
                                <div
                                    className={`profile-menu ${
                                        isMobile ? 'profile-menu-mobile' : ''
                                    } md:drop-shadow-2xl`}
                                    ref={node}>
                                    <div className="md:corner" />
                                    <ul>
                                        <li>
                                            <Link href="/account">
                                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                <a
                                                    role="presentation"
                                                    onClick={() =>
                                                        setShowProfileMenu(!showProfileMenu)
                                                    }>
                                                    <i className="profile" />
                                                    <span className="s-caption">
                                                        {t('Profile')}
                                                    </span>
                                                </a>
                                            </Link>
                                        </li>
                                        {user.role_id === 2 && (
                                            <li>
                                                <Link href="/account/plan">
                                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                    <a
                                                        role="presentation"
                                                        onClick={() =>
                                                            setShowProfileMenu(!showProfileMenu)
                                                        }>
                                                        <i className="plan" />
                                                        <span className="s-caption">
                                                            {t('My Plan')}
                                                        </span>
                                                    </a>
                                                </Link>
                                            </li>
                                        )}
                                        <li>
                                            <Link href="/payment-setting">
                                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                <a
                                                    role="presentation"
                                                    onClick={() =>
                                                        setShowProfileMenu(!showProfileMenu)
                                                    }>
                                                    <i className="settings-pay" />
                                                    <span
                                                        className="s-caption"
                                                        style={{ whiteSpace: 'normal' }}>
                                                        {t('My payment settings')}
                                                    </span>
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <Link href="/support">
                                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                <a
                                                    role="presentation"
                                                    onClick={() =>
                                                        setShowProfileMenu(!showProfileMenu)
                                                    }>
                                                    <i className="help" />
                                                    <span className="s-caption">{t('Help')}</span>
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <a
                                                href="/api/auth/signout"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.localStorage.removeItem('user');
                                                    signOut();
                                                }}>
                                                <i className="exit" />
                                                <span className="s-caption">{t('Logout')}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="language-mobile">
                                <LangSwitcherInline />
                            </div>

                            {/*<span className="hidden mt-[5px] absolute top-[-3px] right-[16px] ms:ml-3 min-w-max md:right-0 md:inline-block md:mt-[5px]">*/}
                            {/*    <a*/}
                            {/*        href="/api/auth/signout"*/}
                            {/*        title={t('Logout')}*/}
                            {/*        onClick={(e) => {*/}
                            {/*            e.preventDefault();*/}
                            {/*            window.localStorage.removeItem('user');*/}
                            {/*            signOut();*/}
                            {/*        }}>*/}
                            {/*        <Image*/}
                            {/*            className="mr-5"*/}
                            {/*            src="/images/exit.svg"*/}
                            {/*            // src="/images/icon-logout.svg"*/}
                            {/*            width={14}*/}
                            {/*            height={20}*/}
                            {/*            alt={t('Logout')}*/}
                            {/*        />*/}
                            {/*    </a>*/}
                            {/*</span>*/}
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
};

export default LoggedRightMobile;

export async function getStaticProps({ locale }: any) {
    return {
        props: {
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
