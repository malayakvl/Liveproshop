import React, { Fragment } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { itemsCountSelector } from '../../../redux/waitingList/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { sidebarCloseAction } from '../../../redux/layouts';
import { useWindowSize } from '../../../hooks';

const SidebarFull: React.FC = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const countWaiting = useSelector(itemsCountSelector);
    const router = useRouter();
    const currRoute = router.route.substring(1);
    const { isMobile } = useWindowSize();

    const closeMenu = () => {
        if (isMobile) {
            dispatch(sidebarCloseAction());
        }
    };

    return (
        <Fragment>
            <li
                role="presentation"
                className={currRoute === 'dashboard' ? 'active' : ''}
                onClick={() => closeMenu()}>
                <Link href={'/dashboard'}>
                    <a>
                        <i className="dashboard" />
                        <span className="s-caption">{t('Dashboard')}</span>
                    </a>
                </Link>
            </li>
            <li
                role="presentation"
                className={currRoute === 'liveselling' ? 'active' : ''}
                onClick={() => closeMenu()}>
                <Link href={'/liveselling'}>
                    <a>
                        <i className="selling" />
                        <span className="s-caption">{t('Live Selling')}</span>
                    </a>
                </Link>
            </li>
            <li role="presentation" onClick={() => closeMenu()}>
                <Link href={'/inventory'}>
                    <a>
                        <i className="inventory" />
                        <span className="s-caption">{t('Inventory')}</span>
                    </a>
                </Link>
            </li>
            <li
                role="presentation"
                className={currRoute === 'chatbot' ? 'active' : ''}
                onClick={() => closeMenu()}>
                <Link href={'/chatbot'}>
                    <a>
                        <i className="chatbot" />
                        <span className="s-caption">{t('Chatbot')}</span>
                    </a>
                </Link>
            </li>
            <li role="presentation" className="separator-line">
                <div className="separator" />
            </li>
            <li
                role="presentation"
                className={currRoute === 'orders' ? 'active' : ''}
                onClick={() => closeMenu()}>
                <Link href={'/orders'}>
                    <a>
                        <i className="order" />
                        <span className="s-caption">{t('Orders')}</span>
                    </a>
                </Link>
            </li>
            <li
                role="presentation"
                className={currRoute === 'waiting-list' ? 'active' : ''}
                onClick={() => closeMenu()}>
                <Link href={'/waiting-list'}>
                    <a>
                        <i className="waiting-list" />
                        <span className="s-caption">{t('Waiting List')}</span>
                        {countWaiting > 0 && <em>{countWaiting}</em>}
                    </a>
                </Link>
            </li>
            <li role="presentation" onClick={() => closeMenu()}>
                <Link href={'/shipping/list'}>
                    <a>
                        <i className="shipping" />
                        <span className="s-caption">{t('Settings')}</span>
                        {/*<em>10</em>*/}
                    </a>
                </Link>
            </li>
            <li
                role="presentation"
                className={currRoute === 'buyers' ? 'active' : ''}
                onClick={() => closeMenu()}>
                <Link href={'/buyers'}>
                    <a>
                        <i className="buyers" />
                        <span className="s-caption">{t('Shoppers')}</span>
                    </a>
                </Link>
            </li>
            <li
                role="presentation"
                className={currRoute === 'payments' ? 'active' : ''}
                onClick={() => closeMenu()}>
                <Link href={'/payments'}>
                    <a>
                        <i className="payments" />
                        <span className="s-caption">{t('Payments')}</span>
                    </a>
                </Link>
            </li>
            <li
                role="presentation"
                className={currRoute === 'support' ? 'active' : ''}
                onClick={() => closeMenu()}>
                <Link href={'/support'}>
                    <a>
                        <i className="support" />
                        <span className="s-caption">{t('Support')}</span>
                    </a>
                </Link>
            </li>
            <li
                role="presentation"
                className={currRoute === 'guides' ? 'active' : ''}
                onClick={() => closeMenu()}>
                <Link href={'/guides/liveselling'}>
                    <a>
                        <i className="support" />
                        <span className="s-caption">{t('Guides')}</span>
                    </a>
                </Link>
            </li>
        </Fragment>
    );
};

export default SidebarFull;
