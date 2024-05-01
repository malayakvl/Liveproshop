import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShippingPeriodAction, setThresholdAction } from '../../redux/shipping/actions';
import { useTranslations } from 'next-intl';
import {
    setModalConfirmationDeletePeriodMetaAction,
    setModalConfirmationSetupPeriodMetaAction,
    setSuccessToastAction,
    setupPeriodAction,
    setPeriodDeleteValuesActions
} from '../../redux/layouts';
import { clearShippingPeriodAction } from '../../redux/shipping/actions';
import { ErrorMessage, Field, Formik } from 'formik';
import { Form } from 'react-bootstrap';
import { userSelector } from '../../redux/user/selectors';
import axios from 'axios';
import { authHeader } from '../../lib/functions';
import getConfig from 'next/config';
import * as Yup from 'yup';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import Image from 'next/image';
import { showDateSelectorAction } from '../../redux/dashboard';
import { showDatePopupSelector } from '../../redux/dashboard/selectors';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';

const { publicRuntimeConfig } = getConfig();
const url = `${publicRuntimeConfig.apiUrl}/api/shipping`;

export default function ShippingThreshold() {
    const dispatch = useDispatch();
    const t = useTranslations();
    const user = useSelector(userSelector);
    const [threshold, setThreshold] = useState('');
    const [period, setPeriod] = useState({ free_shipping_from: null, free_shipping_to: null });
    const showDatePopup = useSelector(showDatePopupSelector);
    const [state, setState] = useState<any>([
        {
            startDate: moment().subtract(1, 'month').toDate(),
            endDate: moment().toDate(),
            key: 'selection'
        }
    ]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const SP = (dateRange: any) => {
        const st = moment(dateRange[0]).format('YYYY-MM-DD');
        const ed = moment(dateRange[1]).format('YYYY-MM-DD');
        const pd = {
            startDate: st,
            endDate: ed
        };
        dispatch(setupPeriodAction(pd));
        dispatch(
            setModalConfirmationSetupPeriodMetaAction({
                onConfirm: async () => {
                    dispatch(setShippingPeriodAction(pd));
                }
            })
        );
    };

    useEffect(() => {
        if (!user.email) return;

        axios
            .get(`${url}/threshold`, {
                headers: {
                    ...authHeader(user.email)
                }
            })
            .then((result) => {
                setThreshold(result.data.threshold);
                dispatch(setPeriodDeleteValuesActions(result.data.period));
                setPeriod(result.data.period);
            });
    }, [user.email]);

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

    if (!user.email) return null;

    return (
        <>
            <Head>
                <title>LiveProshop - Settings - Free shipping threshold</title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-big">
                <div className="page-title">
                    <h1>{t('Settings')}</h1>
                </div>
                {/*<div className="text-gray-400">{t('settings_theshold')}</div>*/}
                {/*<div className="text-gray-400">{t('setting_window')}</div>*/}
            </div>

            <div className="md:flex mt-10 block-white-8 white-shadow-big">
                {user.role_id !== 3 && (
                    <>
                        <div className="w-full md:w-96 p-4 bg-gray-100 rounded-lg shadow-inner">
                            <div className="font-bold text-gray-350 text-lg pb-4 border-b border-gray-200">
                                {t('Free shipping')}
                            </div>
                            <div className="text-sm text-gray-500 mt-6">
                                {t('settings_theshold')}
                            </div>
                            <Formik
                                onSubmit={(values) => {
                                    dispatch(setThresholdAction(values));
                                    dispatch(
                                        setSuccessToastAction(
                                            t(`Threshold has been saved: ${values.threshold}`)
                                        )
                                    );
                                }}
                                enableReinitialize
                                initialValues={{ threshold }}
                                validationSchema={Yup.object().shape({
                                    threshold: Yup.number().typeError('Must be number')
                                })}
                                render={(props) => (
                                    <Form onSubmit={props.handleSubmit}>
                                        <Field
                                            name="threshold"
                                            className="form-control max-w-[150px] float-left mt-4"
                                        />
                                        <span className="float-left mt-[23px] ml-[15px] font-bold rainbow-gradient-text">
                                            &euro;
                                        </span>
                                        <div className="error-el">
                                            <ErrorMessage name="threshold" />
                                        </div>
                                        <button type="submit" className="w-full mt-8 gradient-btn">
                                            {t('Save changes')}
                                        </button>
                                    </Form>
                                )}
                            />
                        </div>
                        <div className="w-full md:w-96 p-4 bg-gray-100 rounded-lg shadow-inner ml-10">
                            <div className="font-bold text-gray-350 text-lg pb-4 border-b border-gray-200">
                                {t('Free Shipping Window')}
                            </div>
                            <div className="text-sm text-gray-500 mt-6">{t('setting_window')}</div>

                            <Formik
                                onSubmit={(values) => {
                                    dispatch(setThresholdAction(values));
                                    dispatch(
                                        setSuccessToastAction(
                                            t(`Threshold has been saved: ${values.threshold}`)
                                        )
                                    );
                                }}
                                enableReinitialize
                                initialValues={{ threshold }}
                                validationSchema={Yup.object().shape({
                                    threshold: Yup.number().typeError('Must be number')
                                })}
                                render={(props) => (
                                    <Form onSubmit={props.handleSubmit}>
                                        <div className="mt-4">
                                            <Image
                                                src="/images/calendar.svg"
                                                width={20}
                                                height={18}
                                            />
                                            <div className="ml-2 inline-block">
                                                <DatePicker
                                                    selectsRange={true}
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    onCalendarClose={() => {
                                                        const r = dateRange;
                                                        SP(r);
                                                        // const p = {
                                                        //     free_shipping_from: '',
                                                        //     free_shipping_to: ''
                                                        // };
                                                        // dispatch(setupPeriodAction({
                                                        //     free_shipping_from: moment(
                                                        //         dateRange[0]
                                                        //     ).format('YYYY-MM-DD'),
                                                        //     free_shipping_to: moment(
                                                        //         dateRange[1]
                                                        //     ).format('YYYY-MM-DD')
                                                        // }));
                                                        // dispatch(
                                                        //     setModalConfirmationSetupPeriodMetaAction(
                                                        //         {
                                                        //             onConfirm: async () => {
                                                        //                 dispatch(
                                                        //                     setShippingPeriodAction(
                                                        //                         {startDate:moment(dateRange[0]).format('YYYY-MM-DD'), endDate:moment(dateRange[1]).format('YYYY-MM-DD')}
                                                        //                     )
                                                        //                 );
                                                        //             }
                                                        //         }
                                                        //     )
                                                        // );
                                                    }}
                                                    onSelect={() => {
                                                        console.log('onselect');
                                                    }}
                                                    onChange={(update) => {
                                                        console.log(update);
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-ignore
                                                        setDateRange(update);
                                                    }}
                                                    isClearable={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="p-3  hidden">
                                            <Image
                                                src="/images/calendar.svg"
                                                width={20}
                                                height={18}
                                            />
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
                                            <div className="relative">
                                                {showDatePopup && (
                                                    <div
                                                        id="divDate"
                                                        className="dashbord-filter absolute shadow-xl rounded-3xl"
                                                        style={{ zIndex: 10 }}>
                                                        <DateRangePicker
                                                            // editableDateInputs={true}
                                                            onChange={(item) => {
                                                                dispatch(
                                                                    showDateSelectorAction(
                                                                        !showDatePopup
                                                                    )
                                                                );
                                                                dispatch(
                                                                    setShippingPeriodAction(
                                                                        item.selection
                                                                    )
                                                                );
                                                                setState([item.selection]);
                                                            }}
                                                            moveRangeOnFirstSelection={false}
                                                            months={1}
                                                            ranges={state}
                                                            direction="horizontal"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {period.free_shipping_from && period.free_shipping_to && (
                                            <div className="block text-[14px] font-bold mt-[20px]">
                                                <ul className="inline-block">
                                                    <li className="float-left">
                                                        <span className="inline-block mt-[2px] text-gray-350">
                                                            {moment(
                                                                period.free_shipping_from
                                                            ).format('DD/MM/YYYY')}
                                                            {' - '}
                                                            {moment(period.free_shipping_to).format(
                                                                'DD/MM/YYYY'
                                                            )}
                                                        </span>
                                                    </li>
                                                    <li className="float-left">
                                                        {/* eslint-disable-next-line jsx-a11y/anchor-has-content,jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events */}
                                                        <a
                                                            href="javascript:void(0)"
                                                            className="delete-period"
                                                            onClick={() => {
                                                                dispatch(
                                                                    setModalConfirmationDeletePeriodMetaAction(
                                                                        {
                                                                            onConfirm: async () => {
                                                                                dispatch(
                                                                                    clearShippingPeriodAction()
                                                                                );
                                                                            }
                                                                        }
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                        <button type="submit" className="w-full mt-8 gradient-btn">
                                            {t('Save changes')}
                                        </button>
                                    </Form>
                                )}
                            />
                        </div>
                    </>
                )}
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
