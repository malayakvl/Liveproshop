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
import LangSwitcher from '../lang/Switcher';
import BrandMobile from '../sidebar/BrandMobile';

const userProfileImg =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const SidebarHeader: React.FC = () => {
    const t = useTranslations();
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [userPhoto, setUserPhoto] = useState(userProfileImg);
    const node = useRef<HTMLDivElement>(null);
    // const { isMobile } = useWindowSize();

    useEffect(
        function () {
            if (user.photo) {
                setUserPhoto(baseApiUrl + user.photo);
            }
            if (user.email !== undefined) {
                dispatch(fetchLatestAction());
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

    // const handleClick = (e: any) => {
    //     console.log(e.target);
    //     if (node?.current?.contains(e.target) || node?.current === null) {
    //         console.log('here profile menu 2');
    //         setShowProfileMenu(false);
    //         return;
    //     }
    //     if (
    //         e.target.parentNode.classList.contains('profile-block') ||
    //         e.target.parentNode.classList.contains('profile-name') ||
    //         node?.current?.contains(e.target)
    //     ) {
    //         console.log('here profile menu 1');
    //         return;
    //     }
    //     setShowProfileMenu(false);
    // };
    const handleClick = (e: any) => {
        if (
            e.target.classList.contains('profile-img') ||
            e.target.classList.contains('s-caption')
        ) {
            return;
        }
        setShowProfileMenu(false);
    };

    return (
        <div className="shadow-lg max-h-[50px] md:pb-0 md:pr-0 md:shadow-none md:flex md:pr-4 items-center align-middle">
            <div className="w-full flex items-center lg:justify-end lg:pr-[40px]">
                {/* <NoticeCounter delay={120000} /> */}
                <BrandMobile />
                {/*<span className="divider" />*/}
                <div className="mt-[-43px] md:mt-0 relative md:mr-[30px] md:mt-auto">
                    <div
                        ref={node}
                        className="absolute top-[-20px] min-w-[30px] right-[-120px] md:static profile-block inline-block cursor-pointer"
                        role="presentation"
                        onClick={() => {
                            setShowProfileMenu(!showProfileMenu);
                        }}>
                        <Image
                            src={userPhoto}
                            width={24}
                            height={24}
                            className="rounded-full cursor-pointer profile-img"
                            alt=""
                        />

                        <span className="profile-name">
                            {user.first_name || user.last_name ? user.first_name : user.email}
                            <span className="text-blue-350 pl-2 inline-block min-w-max">
                                ID: {user.id}
                            </span>
                            <em>{user.company_name || t('No Company Name')}</em>
                        </span>
                    </div>
                    {/* Profile dropdown */}
                    {showProfileMenu && (
                        <div className="profile-menu drop-shadow-2xl" ref={node}>
                            <div className="corner" />
                            <ul>
                                <li>
                                    <Link href="/account">
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a
                                            role="presentation"
                                            onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                            <i className="profile" />
                                            <span className="s-caption">{t('Profile')}</span>
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
                                                <span className="s-caption">{t('My Plan')}</span>
                                            </a>
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <Link href="/payment-setting">
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a
                                            role="presentation"
                                            onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                            <i className="settings-pay" />
                                            <span
                                                className="s-caption"
                                                style={{ whiteSpace: 'normal' }}>
                                                {t('My payment settings')}
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link href="/notifications">
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                {/*
                                        <a
                                            role="presentation"
                                            onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                            <i className="bell" />
                                            <span className="s-caption">{t('Notification')}</span>
                                        </a>
                                    </Link>
                                </li> */}
                                <li>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <Link href="/support">
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a
                                            role="presentation"
                                            onClick={() => setShowProfileMenu(!showProfileMenu)}>
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
                    )}
                </div>
                <LangSwitcher />
                {/*<span className="divider" />*/}
                <span className="hidden mt-[8px] absolute top-[0px] right-[10px] ms:ml-3 min-w-max md:right-0 md:inline-block">
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
            </div>
        </div>
    );
};

export default SidebarHeader;

export async function getStaticProps({ locale }: any) {
    return {
        props: {
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
