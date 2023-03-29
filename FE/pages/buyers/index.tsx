import { getSession } from 'next-auth/client';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { InfoBuyers, ListBuyers, Filters, FilterValues } from '../../components/buyer';
import { paginationSelectorFactory } from '../../redux/layouts/selectors';
import { PaginationType } from '../../constants';
import Head from 'next/head';
import Image from 'next/image';
import { useCallback, useState } from 'react';

export default function Buyers({ session, locale }: { session: any; locale: any }) {
    if (!session) return <></>;
    const t = useTranslations();

    const [filterOpen, setFilterOpen] = useState(false);

    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.BUYERS)
    );

    const handleHideFilter = useCallback(() => {
        setFilterOpen(false);
    }, []);

    return (
        <>
            <Head>
                <title>Amadeo CRM - Shoppers</title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-big mb-8">
                <InfoBuyers />
            </div>

            <div className="block-white-8 white-shadow-big">
                <div className="mb-14 relative">
                    <FilterValues />

                    {/*{filterOpen && <Filters handleHideFilter={handleHideFilter} locale={locale} />}*/}
                    <Filters
                        handleHideFilter={handleHideFilter}
                        locale={locale}
                        filterOpen={filterOpen}
                    />

                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="absolute top-0 right-0 flex items-center text-sm border rounded-lg px-4 py-1">
                        <Image width={16} height={16} src={'/images/filter.svg'} />
                        <div className="font-medium text-gray-400 ml-2">{t('Filters')}</div>
                        <div className="ml-2 font-bold rounded-full p-[2px] text-center bg-gray-400 text-xs h-5 w-5 text-white">
                            {+!!filters.name +
                                +!!filters.total_amount.length +
                                filters.country_id.length}
                        </div>
                    </button>
                </div>

                <ListBuyers locale={locale} />
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
