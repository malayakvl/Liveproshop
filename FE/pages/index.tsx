import Head from 'next/head';
import FullLayout from '../components/layout/FullLayout';
import { getSession } from 'next-auth/client';
import Main from '../components/main/index';

export default function Home() {
    return (
        <div className="main-bg container xl:max-w-[1400px] mx-auto">
            <Head>
                <title>LiveProshop</title>
                <meta name="description" content="LiveProshop portal" />
            </Head>

            <div className="main-layout">
                <Main />
            </div>
        </div>
    );
}
Home.Layout = FullLayout;

export async function getServerSideProps(context: any) {
    const { req, locale } = context;
    const session = await getSession({ req });

    if (session) {
        return {
            redirect: { destination: `/${locale === 'fr' ? '' : `${locale}/`}dashboard` }
        };
    } else {
        return {
            props: {
                messages: {
                    ...require(`../messages/main/${locale}.json`),
                    ...require(`../messages/${locale}.json`)
                }
            }
        };
    }
}
