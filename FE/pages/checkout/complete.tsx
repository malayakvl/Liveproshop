import Head from 'next/head';
import { getSession } from 'next-auth/client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Index({ session }: { session: any }) {
    if (!session) return null;
    const t = useTranslations();

    return (
        <>
            <Head>
                <title>LiveProshop - Checkout Complete</title>
            </Head>

            <div className="max-w-screen-xl min-h-[calc(100vh-10rem)] lg:white-shadow-medium bg-white rounded-lg p-4 pb-4 lg:p-8 lg:pb-8 lg:mr-4 mt-10">
                <div className="flex flex-wrap items-center ">
                    <div className="text-3xl font-bold text-gray-350 p-4 lg:p-8 mr-4 lg:mr-8">
                        {t('Let’s check you out!')}
                    </div>

                    <div className="flex-1 p-4 lg:p-8">
                        <ol className="list-reset flex items-center text-gray-300 font-bold">
                            <li className="self-center flex-none mr-1 sd:mr-2 sd:pr-4 min-w-max h-1 bg-gray-300 hidden sm:block">
                                <div className="w-8 h-8 -mt-4 mr-2 sd:mr-4 rounded-full bg-gray-300 shadow-2xl"></div>
                            </li>
                            <li className="hidden sm:block">{t('Review your order')}</li>

                            <li className="self-center flex-1 mx-2 sd:px-4 min-w-max h-1 bg-gray-300">
                                <div className="w-8 h-8 -mt-4 ml-auto mr-2 sd:mr-4 rounded-full bg-gray-300"></div>
                            </li>
                            <li>{t('Payment')}</li>

                            <li className="self-center flex-1 mx-2 sd:px-4 min-w-max h-1 background-gradient">
                                <div className="w-8 h-8 -mt-4 ml-auto mr-2 sd:mr-4 rounded-full background-gradient"></div>
                            </li>
                            <li className="bg-clip-text text-transparent background-gradient">
                                {t('Order complete!')}
                            </li>
                        </ol>
                    </div>
                </div>

                <div className="flex justify-center pt-16 max-w-screen-lg m-auto">
                    <div className="w-32 lg:w-52 relative mx-auto hidden lg:block">
                        <Image
                            src="/images/female-celebrate.png"
                            layout="fill"
                            className="object-contain object-center"
                        />
                    </div>

                    <div className="text-center">
                        <div className="h-32 lg:h-52 relative mx-auto">
                            <Image
                                src="/images/box.png"
                                layout="fill"
                                className="object-contain object-center"
                            />
                        </div>
                        <div className="leading-8 md:leading-9 lg:leading-[3.5rem] mt-4 bg-clip-text text-transparent background-gradient text-3xl md:text-4xl lg:text-6xl font-bold">
                            {t('Your order is complete!')}
                        </div>
                        <div className="mt-4 leading-6 md:leading-7 lg:leading-8 text-xl md:text-2xl lg:text-3xl text-gray-350">
                            {t(
                                'You’ll receive a confirmation e-mail with your order details soon!'
                            )}
                        </div>
                    </div>

                    <div className="w-32 lg:w-52 relative mx-auto hidden lg:block">
                        <Image
                            src="/images/male-celebrate.png"
                            layout="fill"
                            className="object-contain object-center"
                        />
                    </div>
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
