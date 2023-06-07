import React, { useEffect, useRef, useState } from 'react';
// import Image from 'next/image';
import Link from 'next/link';
// import NoticeCounter from './NoticeCounter';
import { fetchLatestAction } from '../../redux/notifications';
import { useDispatch, useSelector } from 'react-redux';
// import { signOut } from 'next-auth/client';
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
    visible: boolean;
}

const TextLeftMobile: React.FC<Props> = (type) => {
    const t = useTranslations();
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [userPhoto, setUserPhoto] = useState(userProfileImg);
    const node = useRef<HTMLDivElement>(null);
    // const [windowWidth, setWindowWidth] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    // const [toggleSideClass, setToggleSideClass] = useState('left-side-close');

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

    // const toggleSidebar = () => {
    //     setToggleSideClass(
    //         toggleSideClass !== 'left-side-open' ? 'left-side-open' : 'left-side-close'
    //     );
    // };

    return (
        <>
            <nav
                id="sidenav-right"
                className={`right-side ${
                    type.visible ? 'right-side-open' : 'right-side-close'
                } fixed left-0 top-0 z-[1035] h-screen overflow-hidden`}>
                <div className="float-right">
                    <LangSwitcherInline />
                    <Link href={'/auth/signup'}>
                        <button className="mt-[40px] sm:pl-0.5 sm:pr-0.5 md:w-auto gradient-btn max-h-[40px] pt-[7px] mr-[12px]">
                            <span className="inline-block">{t('Try for free')}!</span>
                        </button>
                    </Link>
                </div>
                <div className="sm:text-[16px]">
                    <ul>
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
                            <Link href={'/customer-story'}>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a
                                    href="javascript:void(0)"
                                    className="m-2 cursor-pointer hover:text-purple-400 drop-top-menu-item">
                                    {t('Case Studies')}
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/faq'}>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a
                                    href="javascript:void(0)"
                                    className="m-2 cursor-pointer hover:text-purple-400 drop-top-menu-item">
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
                                    className="m-2 cursor-pointer hover:text-purple-400 drop-top-menu-item">
                                    {t('Contact Us')}
                                </a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
            {/*{isMobile && type.visible && (*/}
            {/*    <nav*/}
            {/*        id="sidenav-right"*/}
            {/*        className={`right-side ${*/}
            {/*            type.visible ? 'right-side-open' : 'left-side-open'*/}
            {/*        } fixed left-0 top-0 z-[1035] h-screen overflow-hidden`}>*/}
            {/*        <div className="sm:text-[16px]">Text Menu Coming Here</div>*/}
            {/*    </nav>*/}
            {/*)}*/}
        </>
    );
};

export default TextLeftMobile;

export async function getStaticProps({ locale }: any) {
    return {
        props: {
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
