import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/client';
import React, { useEffect, useRef, useState } from 'react';
// import { Menu, Transition } from '@headlessui/react';
import LangSwitcher from '../lang/Switcher';
// import { useRouter } from 'next/router';
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

const LoggedRight: React.FC<Props> = ({ isNonPage }) => {
    // const [showProfileMenu, setShowProfileMenu] = useState(false);
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    // const node = useRef<HTMLDivElement>(null);
    const t = useTranslations();
    // const [session] = useSession();
    const [userPhoto, setUserPhoto] = useState(userProfileImg);
    // const router = useRouter();
    // const [showTextingMenu, setShowTestingMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const node = useRef<HTMLDivElement>(null);

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
        <>
            <div className={`relative float-left`}>
                <div
                    className="profile-block inline-block cursor-pointer"
                    role="presentation"
                    onClick={() => {
                        setShowProfileMenu(!showProfileMenu);
                    }}>
                    <span className="mt-1 inline-block">
                        <Image
                            src={userPhoto}
                            width={24}
                            height={24}
                            className="rounded-full cursor-pointer"
                            alt=""
                        />
                    </span>
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
                    <div className="profile-menu shadow-2xl" ref={node}>
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
                                            onClick={() => setShowProfileMenu(!showProfileMenu)}>
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
                            <li>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a
                                    role="presentation"
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                    <i className="help" />
                                    <span className="s-caption">{t('Help')}</span>
                                </a>
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
            <div className="float-left ml-7">
                <LangSwitcher type={null} />
            </div>
            <span className="float-left ml-7 mt-1">
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
        </>
    );
};

export default LoggedRight;
