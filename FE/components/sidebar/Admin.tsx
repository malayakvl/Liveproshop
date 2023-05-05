import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Brand from './Brand';
import Pages from './Pages';
import { SidebarFull, SidebarShipping } from './admin/index';
import { useWindowSize } from '../../hooks';
import { sidebarCloseAction, toggleSidebarAction } from '../../redux/layouts';
import { useDispatch, useSelector } from 'react-redux';
import { isSidebarOpenSelector } from '../../redux/layouts/selectors';

const SidebarCustomers: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const isSidebarOpen = useSelector(isSidebarOpenSelector);
    const node = useRef<HTMLDivElement>(null);
    const { isMobile } = useWindowSize();
    let CurrentSidebar = SidebarFull;

    if (router.route.startsWith('/shipping')) {
        CurrentSidebar = SidebarShipping;
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    const handleClick = (e: any) => {
        if (node?.current?.contains(e.target) || node?.current === null) {
            return;
        }
        if (isMobile) {
            dispatch(sidebarCloseAction());
        }
    };

    return (
        <>
            <div
                className={`sidebar ${!isSidebarOpen ? 'sb-minimize' : ''} ${
                    isSidebarOpen && isMobile ? 'mobile-open' : ''
                }`}
                ref={node}>
                <Brand />
                <div className="overflow-y-auto overflow-x-hidden transparent-scrollbar-thumb rtl flex flex-col justify-between flex-grow">
                    <ul className="ltr">
                        <CurrentSidebar />
                    </ul>
                    <Pages />
                </div>

                <button
                    data-resize-button="true"
                    aria-expanded="true"
                    aria-label="Expand sidebar"
                    type="button"
                    className="sidebar-close-desktop"
                    onClick={() => dispatch(toggleSidebarAction())}>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        role="presentation"
                        className={isSidebarOpen ? '-rotate-180' : ''}>
                        <path
                            d="M10.294 9.698a.988.988 0 010-1.407 1.01 1.01 0 011.419 0l2.965 2.94a1.09 1.09 0 010 1.548l-2.955 2.93a1.01 1.01 0 01-1.42 0 .988.988 0 010-1.407l2.318-2.297-2.327-2.307z"
                            fill="currentColor"
                            fillRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </>
    );
};

export default SidebarCustomers;
