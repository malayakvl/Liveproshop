import { useTranslations } from 'next-intl';

const InfoBuyers: React.FC = () => {
    const t = useTranslations();

    return (
        <>
            <div className="page-title clear-right">
                <h1>{t('Shoppers')}</h1>
            </div>
            <div className="text-gray-400">
                {t('Shoppers section provides merchant information about his shoppers')}
            </div>
        </>
    );
};
export default InfoBuyers;
