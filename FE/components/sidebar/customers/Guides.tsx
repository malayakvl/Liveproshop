import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setActivePageAction } from '../../../redux/layouts/actions';
import { useRouter } from 'next/router';

const SidebarGuides = function () {
    const t = useTranslations();
    const dispatch = useDispatch();
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
                            type: 'guides',
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

            <li className={`submenu ${currRoute === 'guides/liveselling' ? 'active' : ''}`}>
                <Link href={'./liveselling'}>
                    <a>
                        <i className="text-blue-350 text-base font-bold tracking-wide truncate cursor-pointer" />
                        <span className="s-caption">{t('Live Selling')}</span>
                    </a>
                </Link>
            </li>

            <li className={`submenu ${currRoute === 'guides/rules-csv' ? 'active' : ''}`}>
                <Link href={'./rules-csv'}>
                    <a>
                        <i className="text-blue-350 text-base font-bold tracking-wide truncate cursor-pointer" />
                        <span className="s-caption" style={{ whiteSpace: 'normal' }}>
                            {t('rules_csv')}
                        </span>
                    </a>
                </Link>
            </li>
        </>
    );
};

export default SidebarGuides;
