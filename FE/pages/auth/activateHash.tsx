import { signIn } from 'next-auth/client';
import { useEffect } from 'react';
import FullLayout from '../../components/layout/FullLayout';

export default function ActivateHash({ locale, hash }: { locale: string; hash: string }) {
    useEffect(() => {
        if (hash) {
            signIn('credentials_hash', {
                hash: hash,
                callbackUrl: `${window.location.origin}${
                    locale === 'fr' ? '' : `/${locale}`
                }/restore/password`
            });
        }
    }, [locale, hash]);
    return (
        <div className="px-4">
            <div className="bg-white mx-auto max-w-3xl rounded-lg my-16 p-8">
                Wait untill data loading
            </div>
        </div>
    );
}
ActivateHash.Layout = FullLayout;

export async function getServerSideProps(context: any) {
    const { req, locale } = context;
    const hash = req.__NEXT_INIT_QUERY.hash;

    if (!hash) {
        return {
            redirect: { destination: `/${locale === 'fr' ? '' : `${locale}/`}auth/signin` }
        };
    }

    return {
        props: {
            locale: locale,
            hash: hash,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
