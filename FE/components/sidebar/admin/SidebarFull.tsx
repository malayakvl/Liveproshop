import React, { Fragment } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { sidebarCloseAction } from '../../../redux/layouts';
import { useDispatch } from 'react-redux';
import { useWindowSize } from '../../../hooks';

const SidebarFull: React.FC = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const router = useRouter();
    const currRoute = router.route.substring(1);
    // const node = useRef<HTMLDivElement>(null);
    const { isMobile } = useWindowSize();

    // const closeMenu = () => {
    //     if (isMobile) {
    //         dispatch(sidebarCloseAction());
    //     }
    // };
    // useEffect(() => {
    //     document.addEventListener('mousedown', handleClick);
    //
    //     return () => {
    //         document.removeEventListener('mousedown', handleClick);
    //     };
    // }, []);

    // const handleClick = (e: any) => {
    //     if (node?.current?.contains(e.target) || node?.current === null) {
    //         return;
    //     }
    //     if (isMobile) {
    //         dispatch(sidebarCloseAction());
    //     }
    // };

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
                className={currRoute === 'chatbot' ? 'active' : ''}
                onClick={() => closeMenu()}>
                <Link href={'/chatbot'}>
                    <a>
                        <i className="chatbot" />
                        <span className="s-caption">{t('Chatbot')}</span>
                    </a>
                </Link>
            </li>
            <li>
                <div className="separator" />
            </li>
            <li
                role="presentation"
                className={currRoute === 'sellers' ? 'active' : ''}
                onClick={() => closeMenu()}>
                <Link href={'/sellers'}>
                    <a>
                        <i className="buyers" />
                        <span className="s-caption">{t('Sellers')}</span>
                    </a>
                </Link>
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
            <li role="presentation" onClick={() => closeMenu()}>
                <Link href={'/shipping/list'}>
                    <a>
                        <i className="shipping" />
                        <span className="s-caption">{t('Shipping')}</span>
                        <em>10</em>
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
            <li role="presentation" onClick={() => closeMenu()}>
                <Link href={'/buyers'}>
                    <a>
                        <i className="buyers" />
                        <span className="s-caption">{t('Shoppers')}</span>
                    </a>
                </Link>
            </li>
            <li role="presentation" onClick={() => closeMenu()}>
                <Link href={'/payment-plans'}>
                    <a>
                        <i className="payment-plans" />
                        <span className="s-caption">{t('Payment Plans')}</span>
                    </a>
                </Link>
            </li>
        </Fragment>
    );
};

export default SidebarFull;
