import Image from 'next/image';
import React from 'react';
import { useTranslations } from 'next-intl';

interface PropsContent {
    locale: string;
}
const Rules: React.FC<PropsContent> = ({ locale }) => {
    const t = useTranslations();
    console.log(locale);
    return (
        <>
            <h2 className="dark-blue-header block mb-[20px]">
                Guides - Règles de remplissage des fichiers CSV
            </h2>
            <table className="table-auto text-sm">
                <thead>
                    <tr className="text-xs" style={{ borderBottom: 'solid 1px #EEF1F7' }}>
                        <th className="w-32 py-4">{t('Column')}</th>
                        <th>{t('Rule')}</th>
                        <th>{t('Mandatory')}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        style={{
                            borderBottom: 'solid 1px #EEF1F7'
                        }}>
                        <td className="font-bold">product_name</td>
                        <td className="py-4">{t('product_name')}</td>
                        <td>
                            <img
                                src="/images/icon-checked.svg"
                                width="20"
                                height="20"
                                className="mx-auto"
                                alt={t('Mandatory')}
                            />
                        </td>
                    </tr>
                    <tr
                        style={{
                            borderBottom: 'solid 1px #EEF1F7'
                        }}>
                        <td className="font-bold">description</td>
                        <td className="py-4">{t('description')}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="font-bold">hashtag</td>
                        <td className="py-4">
                            {t('hashtag')}
                            <p className="text-[10px] italic">{t('Example')}: #man, #sport</p>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="font-bold">style_value</td>
                        <td className="py-4">
                            {t('style_value')}
                            <p className="text-[10px] italic">{t('Example')}: casual, sport</p>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="font-bold">material_value</td>
                        <td className="py-4">
                            {t('material_value')}
                            <p className="text-[10px] italic">{t('Example')}: Cotton</p>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="font-bold">photos</td>
                        <td className="py-4">{t('photos')}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="font-bold">publish</td>
                        <td className="py-4">{t('publish')}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="font-bold">size</td>
                        <td className="py-4">
                            {t('size')}
                            <p className="text-[10px] italic">
                                {t('Example')}: S, M, L, XL {t('etc')}.
                            </p>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="font-bold">color</td>
                        <td className="py-4">
                            {t('color')}
                            <p className="text-[10px] italic">
                                {t('Example')}: Green, Blue, Red {t('etc')}.
                            </p>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="font-bold">price</td>
                        <td className="py-4">{t('price')}</td>
                        <td>
                            <img
                                src="/images/icon-checked.svg"
                                width="20"
                                height="20"
                                className="mx-auto"
                                alt={t('Mandatory')}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">quantity</td>
                        <td className="py-4">{t('quantity')}</td>
                        <td>
                            <img
                                src="/images/icon-checked.svg"
                                width="20"
                                height="20"
                                className="mx-auto"
                                alt={t('Mandatory')}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">sku</td>
                        <td className="py-4">{t('sku')}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div className="my-12 mb-10 text-center">
                <Image src="/images/guides/rules-csv1.png" width={1393} height={172} />
                <p className="text-[10px] italic">
                    {t(
                        'This is how the csv string should look like when all data was populated correctly'
                    )}
                </p>
            </div>
            <div className="flex border border-l-0 border-r-0 border-t-0 pb-2.5 mb-6">
                <h2 className="dark-blue-header block mb-[20px]">
                    {t('How to add variations to one product?')}
                </h2>
            </div>
        </>
    );
};
export default Rules;
