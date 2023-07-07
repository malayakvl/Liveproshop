import React, { useEffect, useRef, useState } from 'react';
import { fetchLatestAction } from '../../redux/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../redux/user/selectors';
import { baseApiUrl } from '../../constants';
import LoggedRight from './LoggedRight';
import LoggedRightMobile from './LoggedRightMobile';

const userProfileImg =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const SidebarHeader: React.FC = () => {
    // const t = useTranslations();
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [userPhoto, setUserPhoto] = useState(userProfileImg);
    const node = useRef<HTMLDivElement>(null);
    // const [windowWidth, setWindowWidth] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [toggleSideClass, setToggleSideClass] = useState('left-side-close');

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
            {/*</div>*/}
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
