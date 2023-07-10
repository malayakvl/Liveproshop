import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setActivePageAction } from '../../../redux/layouts/actions';
import { useSelector } from 'react-redux';
import { userSelector } from '../../../redux/user/selectors';
import { useRouter } from 'next/router';

const SidebarShipping = function () {
    const t = useTranslations();
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const router = useRouter();

    const currRoute = router.route.substring(1);

    return (
        <>
            <li
                className="go-back"
                role="presentation"
                onClick={() => {
                    dispatch(
                        setActivePageAction({
                            type: 'settings',
                            modifier: ''
                        })
                    );
                }}>
                <Link href={'/dashboard'}>
                    <a>
                        <span>{t('Go Back')}</span>
                    </a>
                </Link>
            </li>

            <li className={`submenu ${currRoute === 'settings' ? 'active' : ''}`}>
                <Link href={'/settings'}>
                    <a>
                        <i className="text-blue-350 text-base font-bold tracking-wide truncate cursor-pointer" />
                        <span className="s-caption">{t('Cart duration')}</span>
                    </a>
                </Link>
            </li>

            <li
                className={`submenu ${
                    currRoute === 'settings/free-shipping-threshold' ? 'active' : ''
                }`}>
                <Link href={'/settings/free-shipping-threshold'}>
                    <a>
                        <i className="text-blue-350 text-base font-bold tracking-wide truncate cursor-pointer" />
                        <span className="s-caption" style={{ whiteSpace: 'normal' }}>
                            {t('Free shipping threshold')}
                        </span>
                    </a>
                </Link>
            </li>

            <li
                className={`submenu ${
                    currRoute === 'settings/free-shipping-window' ? 'active' : ''
                }`}>
                <Link href={'/settings/free-shipping-window'}>
                    <a>
                        <i className="text-blue-350 text-base font-bold tracking-wide truncate cursor-pointer" />
                        <span className="s-caption" style={{ whiteSpace: 'normal' }}>
                            {t('Free Shipping Window')}
                        </span>
                    </a>
                </Link>
            </li>

            <li className={`submenu ${currRoute === 'shipping/list' ? 'active' : ''}`}>
                <Link href={'/shipping/list'}>
                    <a>
                        <i className="text-blue-350 text-base font-bold tracking-wide truncate cursor-pointer" />
                        <span className="s-caption" style={{ whiteSpace: 'normal' }}>
                            {t('Shipping methods')}
                        </span>
                    </a>
                </Link>
            </li>
            {user.role_id === 3 && (
                <li className={`submenu ${currRoute === 'shipping/add-method' ? 'active' : ''}`}>
                    <Link href={'/shipping/add-method'}>
                        <a>
                            <i className="text-blue-350 text-base font-bold tracking-wide truncate cursor-pointer" />
                            <span className="s-caption">{t('Add Method')}</span>
                        </a>
                    </Link>
                </li>
            )}
        </>
    );
};

export default SidebarShipping;
