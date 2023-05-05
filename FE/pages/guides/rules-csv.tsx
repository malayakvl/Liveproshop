import Head from 'next/head';
import Image from 'next/image';
import { getSession } from 'next-auth/client';
import { useTranslations } from 'next-intl';

export default function Index() {
    const t = useTranslations();

    return (
        <>
            <Head>
                <title>
                    LiveProshop - {t('Guides')} - {t('rules_csv')}
                </title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-medium mt-10 text-xl max-w-4xl text-gray-350">
                <div className="flex border border-l-0 border-r-0 border-t-0 pb-2.5 mb-10">
                    <h2 className="dark-blue-header">
                        {t('Guides')} - {t('rules_csv')}
                    </h2>
                </div>
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
                    <h2 className="dark-blue-header">
                        {t('How to add variations to one product?')}
                    </h2>
                </div>
                <p className="text-xs">{t('In case your product has modifications')}</p>
                <div className="p-4 my-6 bg-gray-100 rounded-lg text-base text-gray-500">
                    <ol className="list-decimal list-inside">
                        <li>
                            {t(
                                'Fill in the fields from “Name” to “Publish” columns on the first row'
                            )}
                        </li>
                        <li>
                            {t(
                                'Go to the row below and enter all possible variations (size, price, color and quantity) that your product has'
                            )}
                        </li>
                    </ol>
                </div>
                <ul className="list-disc list-inside text-sm">
                    {t('For example, you have women skirt in different variations:')}
                    <li>{t('S/green that costs $50 and 2 items are available in stock')}</li>
                    <li>{t('M/green that costs $60 and 3 items are available in stock')}</li>
                    <li>{t('L/green that costs $70 and 4 items are available in stock')}</li>
                </ul>
                <div className="my-12 mb-6 text-center">
                    <Image src="/images/guides/rules-csv2.png" width={1395} height={282} />
                    <p className="text-[10px] italic">
                        {t('This is how this product should look like in the csv document')}
                    </p>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context: any) {
    const { locale } = context;
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: { destination: `/${locale === 'fr' ? '' : `${locale}/`}auth/signin` }
        };
    }

    return {
        props: {
            session,
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
