import React, { useEffect, useRef, useState } from 'react';
import { fetchLatestAction } from '../../redux/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../redux/user/selectors';
import { baseApiUrl } from '../../constants';
import LoggedRight from './LoggedRight';
import LoggedRightMobile from './LoggedRightMobile';
import { showEmailNoticeSelector } from '../../redux/layouts/selectors';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const userProfileImg =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const SidebarHeader: React.FC = () => {
    const t = useTranslations();
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [userPhoto, setUserPhoto] = useState(userProfileImg);
    const node = useRef<HTMLDivElement>(null);
    // const [windowWidth, setWindowWidth] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [toggleSideClass, setToggleSideClass] = useState('left-side-close');
    const showEmailNotice = useSelector(showEmailNoticeSelector);

    useEffect(
        function () {
            if (user.photo) {
                setUserPhoto(baseApiUrl + user.photo);
            }
            if (user.email !== undefined) {
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
                };
                window.addEventListener('resize', handleWindowResize);
                return () => {
                    window.removeEventListener('resize', handleWindowResize);
                };
            }
        },
        [user]
    );

    return (
        <div className="shadow-lg pr-4 pb-5 md:pb-0 md:pr-0 md:shadow-none md:flex items-center align-middle">
            <div className="hidden md:flex w-full sm:w-1/2 md:w-3/5 lg:w-3/5 xl:w-3/5 items-center" />
            {showEmailNotice && (
                <div className="p-[10px] items-center block-worning absolute rounded-lg text-center md:min-w-[480px]">
                    <div className="relative">
                        {/*<i className="icon-warning" style={{ marginTop: '12px' }} />*/}
                        <span className="inline-block mx-[10px]">
                            <span className="text-[20px] font-bold ">
                                {t('Please add an email in your')}
                            </span>
                            <Link href={'/account'}>
                                <a className="ml-auto text-sm font-bold text-black text-[20px] underline">
                                    {t('profile')}
                                </a>
                            </Link>
                        </span>
                    </div>
                </div>
            )}
            <div className="w-full sm:w-1/2 md:w-2/5 lg:w-2/5 xl:w-2/5 flex items-center justify-end">
                {isMobile && <LoggedRightMobile type={null} />}
                {/*not collapsed header*/}
                <div className={`${isMobile ? 'hidden' : ''} mt-4`}>
                    <LoggedRight />
                </div>
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
