import { getSession } from 'next-auth/client';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { InputSwitcher, InputText } from '../../components/_form';
import { itemSelector } from '../../redux/settings/selectors';
import { fetchFormAction } from '../../redux/settings';
import { showLoaderAction } from '../../redux/layouts/actions';
import { submitFormAction } from '../../redux/settings/actions';
import ConfirmDialog from '../../components/_common/ConfirmDialog';
import Head from 'next/head';
import Image from 'next/image';
import moment from 'moment/moment';
import { DateRangePicker } from 'react-date-range';
import { showDateSelectorAction } from '../../redux/dashboard';
import { showDatePopupSelector } from '../../redux/dashboard/selectors';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

export default function Index() {
    const t = useTranslations();
    const initialValues = useSelector(itemSelector);
    const dispatch = useDispatch();

    const [showForm, setShowForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | null>();
    const [state, setState] = useState<any>([
        {
            startDate: moment().subtract(1, 'month').toDate(),
            endDate: moment().toDate(),
            key: 'selection'
        }
    ]);
    const showDatePopup = useSelector(showDatePopupSelector);
    const validationSchema = Yup.object({
        free_shipping_timer: Yup.number().when('free_shipping_status', {
            is: true,
            then: Yup.number().required(t('Required field'))
        })
    });

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
        dispatch(showLoaderAction(true));
        dispatch(fetchFormAction());
    }, []);

    useEffect(() => {
        if (initialValues?.user_id > 0) {
            setShowForm(true);
            dispatch(showLoaderAction(false));
        }
    }, [initialValues]);

    const handlerConfirm = useCallback(() => {
        if (!selectedItem) return;
        dispatch(submitFormAction(selectedItem));
        setSelectedItem(null);
    }, [selectedItem]);

    return (
        <>
            <Head>
                <title>LiveProshop - Settings - Free shipping window</title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-big">
                <div className="page-title">
                    <h1>{t('Settings')}</h1>
                </div>
                <div className="text-gray-400">{t('setting_window')}</div>
            </div>
            {showForm && (
                <div className="mt-10 block-white-8 white-shadow-big">
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            if (values.free_shipping_status !== initialValues.free_shipping_status)
                                setSelectedItem(values);
                            else dispatch(submitFormAction(values));
                        }}>
                        {(props) => {
                            return (
                                <form className="w-full md:w-1/2" onSubmit={props.handleSubmit}>
                                    <div className="mt-8 font-bold text-gray-350 text-lg mb-8 border-gray-200">
                                        {t('Free Shipping Window')}
                                    </div>
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
                                                value={``}
                                            />
                                        </span>
                                    </div>

                                    <div className="flex mt-1">
                                        <div className="w-1/2 mr-2">
                                            <div className="mb-3 text-xs font-bold text-blue-350">
                                                {t('From')}
                                            </div>
                                            <input
                                                className="w-full form-control"
                                                type="text"
                                                placeholder={''}
                                                value={''}
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <div className="mb-3 text-xs font-bold text-blue-350">
                                                {t('To')}
                                            </div>
                                            <input
                                                className="w-full form-control"
                                                type="text"
                                                placeholder={''}
                                                value={''}
                                            />
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
                                    <button
                                        type="submit"
                                        className="w-32 mt-8 gradient-btn"
                                        disabled={!props.dirty}>
                                        {t('Save')}
                                    </button>
                                </form>
                            );
                        }}
                    </Formik>
                </div>
            )}
            <ConfirmDialog
                show={!!selectedItem}
                text={t('Are you sure you want to {status} {name} method?', {
                    status: selectedItem?.free_shipping_status ? t('enable') : t('disable'),
                    name: t('Free Shipping Window')
                })}
                titleConfirm={t('Yes')}
                titleCancel={t('Cancel')}
                onConfirm={handlerConfirm}
                onClose={() => setSelectedItem(null)}
            />
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
