import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

const Sync: React.FC<any> = () => {
    const t = useTranslations();
    // const dispatch = useDispatch();

    const [shopName, setShopName] = useState<string>('');

    const syncShopify = () => {
        const urlShopify = `https://${shopName}.myshopify.com/admin/oauth/authorize?client_id=61825057ea3598ecc43399cffd5890cd&scope=read_products&redirect_uri=http://localhost:3000/sync&state=querty&grant_options[]=per-user`;
        window.location.assign(urlShopify);

        return {
            redirect: { destination: `https://${shopName}.myshopify.com/admin/oauth/authorize` }
        };
    };

    return (
        <>
            <h2 className="filters-caption">{t('Shopify Sync')}</h2>
            <div className="mb-4 w-full">
                <label htmlFor="website-admin" className="control-label">
                    {t('Shopify Shop')}
                </label>
                <div className="flex">
                    <span className="inline-flex items-center px-2.5 text-xs text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300">
                        https://
                    </span>
                    <input
                        type="text"
                        id="website-admin"
                        defaultValue={shopName}
                        className="rounded-none text-xs bg-gray-50 border border-gray-300 text-gray-900 border-r-0"
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="Bonnie Green"
                    />
                    <span className="inline-flex items-center px-2.5 text-xs text-gray-900 bg-gray-200 rounded-l-0 rounded-r-lg border border-gray-300">
                        .myshopify.com
                    </span>
                </div>
            </div>
            <div>
                <button className="gradient-btn" onClick={syncShopify}>
                    {t('Connect Shopify')}
                </button>
            </div>
        </>
    );
};

export default Sync;
