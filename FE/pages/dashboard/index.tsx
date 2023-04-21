import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Router from 'next/router';
import { getSession } from 'next-auth/client';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { paginatedItemsSelector, showDatePopupSelector } from '../../redux/dashboard/selectors';
import { paginationSelectorFactory } from '../../redux/layouts/selectors';
import { userSelector } from '../../redux/user/selectors';
import { fetchItemsAction, showDateSelectorAction, showPopupAction } from '../../redux/dashboard';
import { setPaginationAction } from '../../redux/layouts';
import { PaginationType } from '../../constants';
import { ListOrders, ListBuyers, Totals } from '../../components/dashboard';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

export default function Index({ session, locale }: { session: any; locale: string }) {
    if (!session) return <></>;
    const t = useTranslations();
    const dispatch = useDispatch();
    const [state, setState] = useState<any>([
        {
            startDate: moment().subtract(1, 'month').toDate(),
            endDate: moment().toDate(),
            key: 'selection'
        }
    ]);
    const showDatePopup = useSelector(showDatePopupSelector);

    const { filters }: Layouts.Pagination = useSelector(
        paginationSelectorFactory(PaginationType.DASHBOARD)
    );
    const data = useSelector(paginatedItemsSelector);
    const user = useSelector(userSelector);

    const reverseDatePopup = useCallback(
        (event) => {
            if (event.target?.name === 'inputDate') {
                dispatch(showDateSelectorAction(!showDatePopup));
            } else if (showDatePopup) {
                dispatch(showDateSelectorAction(false));
            }
        },
        [showDatePopup]
    );

    useEffect(() => {
        if (user.id) {
            dispatch(
                setPaginationAction({
                    type: PaginationType.DASHBOARD,
                    modifier: {
                        filters: {
                            ...filters,
                            created_at: [
                                moment(state[0].startDate).format('YYYY-MM-DD'),
                                moment(state[0].endDate).format('YYYY-MM-DD')
                            ]
                        }
                    }
                })
            );
            dispatch(fetchItemsAction());
            dispatch(showDateSelectorAction(false));
        }
    }, [state, user]);

    return (
        <>
            <Head>
                <title>LiveProshop - Dashboard</title>
                <meta name="description" content="Generated by create next app" />
            </Head>

            <div className="page-title" onClick={reverseDatePopup}>     {/* eslint-disable-line */}
                <h1 className="dashboard">
                    {(user.first_name || user.first_name) && t('Welcome back!')}
                    <span>
                        {user.first_name && user.first_name} {user.last_name && user.last_name}
                    </span>
                </h1>
                {user.role_id === 2 && (
                    <button
                        className="mb-4 ml-4 md:mb-0 md:ml-0 btn-big md:float-right mt-4"
                        onClick={() => {
                            dispatch(showPopupAction(true));
                            Router.push('/liveselling');
                        }}>
                        {t('Schedule new session')}
                    </button>
                )}
            </div>

            <div className="block-white-4 mr-10" onClick={reverseDatePopup}>    {/* eslint-disable-line */}
                <div className="flex flex-row flex-wrap w-full">
                    <Totals totals={data.totals} roleId={user.role_id} />

                    <div className="w-1/2 flex flex-col md:w-full lg:w-1/4 xl:w-2/5 justify-center align-middle pl-4 border-l">
                        <span className="font-bold text-sm text-blue-350">{t('Period')}</span>
                        <div className="p-3 flex">
                            <Image src="/images/calendar.svg" width={20} height={18} />
                            <span className="font-bold text-sm text-blue-350 ml-2">
                                <input
                                    name="inputDate"
                                    className="w-full form-control"
                                    type="text"
                                    placeholder={t('Date')}
                                    readOnly={true}
                                    onClick={reverseDatePopup}
                                    value={
                                        filters.created_at.length > 0
                                            ? `${moment(filters.created_at[0]).format(
                                                  'DD/MM/YYYY'
                                              )} - ${moment(filters.created_at[1]).format(
                                                  'DD/MM/YYYY'
                                              )}`
                                            : ''
                                    }
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {showDatePopup && (
                <div
                    id="divDate"
                    className="dashbord-filter absolute shadow-xl rounded-3xl"
                    style={{ zIndex: 10 }}>
                    <DateRangePicker
                        // editableDateInputs={true}
                        onChange={(item) => setState([item.selection])}
                        moveRangeOnFirstSelection={false}
                        months={1}
                        ranges={state}
                        direction="horizontal"
                    />
                </div>
            )}

            <div className="block-white-4 mr-10" onClick={reverseDatePopup}>   {/* eslint-disable-line */}
                <div className="font-bold text-gray-350 text-base pb-4 mt-8 mb-2 border border-t-0 border-l-0 border-r-0">
                    {t('Orders')}{' '}
                    <span className="text-sm text-gray-180 font-normal">
                        (Last {data.orders?.length} items)
                    </span>
                    <Link href={'/orders'}>
                        <a className="view-all float-right mr-4">{t('See all')}</a>
                    </Link>
                </div>
                <div>
                    <ListOrders orders={data.orders} locale={locale} />
                </div>
            </div>

            {(user.role_id !== 1) && (<div className="block-white-4 mr-10" onClick={reverseDatePopup}>   {/* eslint-disable-line */}
                    <div className="font-bold text-gray-350 text-base pb-4 mt-8 mb-2 border border-t-0 border-l-0 border-r-0">
                        {t('Clients')}{' '}
                        <span className="text-sm text-gray-180 font-normal">
                            (Last {data.buyers?.length} items)
                        </span>
                        <Link href={'/buyers'}>
                            <a className="view-all float-right mr-4">{t('See all')}</a>
                        </Link>
                    </div>
                    <div>
                        <ListBuyers buyers={data.buyers} />
                    </div>
                </div>
            )}
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
