import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Brand from './Brand';
import Pages from './Pages';
import { useDispatch, useSelector } from 'react-redux';
import { isSidebarOpenSelector } from '../../redux/layouts/selectors';
import { useWindowSize } from '../../hooks';
import { sidebarCloseAction, toggleSidebarAction } from '../../redux/layouts';

const SidebarBuyer: React.FC = () => {
    const t = useTranslations();
    const isSidebarOpen = useSelector(isSidebarOpenSelector);
    const dispatch = useDispatch();
    const node = useRef<HTMLDivElement>(null);
    const { isMobile } = useWindowSize();

    const handleClick = (e: any) => {
        if (node?.current?.contains(e.target) || node?.current === null) {
            return;
        }
        if (isMobile) {
            dispatch(sidebarCloseAction());
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

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
                        <li className="active">
                            <Link href={'/dashboard'}>
                                <a>
                                    <i className="dashboard" />
                                    <span className="s-caption">Dashboard</span>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/orders'}>
                                <a>
                                    <i className="order" />
                                    <span className="s-caption">{t('Orders')}</span>
                                </a>
                            </Link>
                        </li>
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

export default SidebarBuyer;
