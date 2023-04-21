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

const userProfileImg =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const SidebarHeader: React.FC = () => {
    const t = useTranslations();
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [userPhoto, setUserPhoto] = useState(userProfileImg);
    const node = useRef<HTMLDivElement>(null);

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
        <div className="pr-4 pb-5 md:pb-0 md:pr-0 md:shadow-none md:flex items-center align-middle">
            <div className="hidden md:flex w-full sm:w-1/2 md:w-3/5 lg:w-3/5 xl:w-3/5 items-center">
                {/* <form>
                    <div className="relative">
                        <input className="form-control" placeholder="Click to Search" />
                        <i className="input-close" />
                    </div>
                </form> */}
            </div>
            <div className="w-full sm:w-1/2 md:w-2/5 lg:w-2/5 xl:w-2/5 flex items-center justify-end">
                {/* <NoticeCounter delay={120000} /> */}

                {/*<span className="divider" />*/}
                <div className="relative ml-7">
                    <div
                        className="profile-block inline-block cursor-pointer"
                        role="presentation"
                        onClick={() => {
                            setShowProfileMenu(!showProfileMenu);
                        }}>
                        <Image
                            src={userPhoto}
                            width={24}
                            height={24}
                            className="rounded-full cursor-pointer"
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
                        <div className="profile-menu" ref={node}>
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
                <span className="mt-1 ml-3 min-w-max">
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
