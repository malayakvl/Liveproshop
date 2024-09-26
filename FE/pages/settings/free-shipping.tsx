import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setThresholdAction } from '../../redux/shipping/actions';
import { useTranslations } from 'next-intl';
import {
    setModalConfirmationDeletePeriodMetaAction,
    setModalConfirmationSetupPeriodMetaAction,
    setupPeriodAction,
    setPeriodDeleteValuesActions,
    setErrorToastAction
} from '../../redux/layouts';
import { clearShippingPeriodAction } from '../../redux/shipping/actions';
import { ErrorMessage, Field, Formik } from 'formik';
import { Form } from 'react-bootstrap';
import { userSelector } from '../../redux/user/selectors';
import axios from 'axios';
import { authHeader, toggleModalPeriodSetupConfirmation } from '../../lib/functions';
import getConfig from 'next/config';
import * as Yup from 'yup';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import Image from 'next/image';
import { showDatePopupSelector } from '../../redux/dashboard/selectors';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

import 'react-datepicker/dist/react-datepicker.css';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';
import { InputText } from '../../components/_form';

const { publicRuntimeConfig } = getConfig();
const url = `${publicRuntimeConfig.apiUrl}/api/shipping`;

export default function ShippingThreshold() {
    const dispatch = useDispatch();
    const t = useTranslations();
    const user = useSelector(userSelector);
    const [threshold, setThreshold] = useState('');
    const [period, setPeriod] = useState({ free_shipping_from: null, free_shipping_to: null });
    const showDatePopup = useSelector(showDatePopupSelector);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [timeFrom, setTimeFrom] = useState(moment());
    const [timeTo, setTimeTo] = useState(moment());
    const [calendarPeriod, setCalendarPeriod] = useState<any>(null);

    const SP = (dateRange: any) => {
        const st = moment(dateRange[0]).format('YYYY-MM-DD');
        const ed = moment(dateRange[1]).format('YYYY-MM-DD');
        const pd = {
            startDate: st,
            endDate: ed
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setCalendarPeriod(pd);
        dispatch(setupPeriodAction(pd));
        // dispatch(
        //     setModalConfirmationSetupPeriodMetaAction({
        //         onConfirm: async () => {
        //             toggleModalPeriodSetupConfirmation();
        //         }
        //     })
        // );
    };

    const handleValueChangeFrom = (value: any) => {
        setTimeFrom(value);
    };

    const handleValueChangeTo = (value: any) => {
        setTimeTo(value);
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
            </div>

            <div className="md:flex mt-10 block-white-8 white-shadow-big">
                {user.role_id !== 3 && (
                    <div className="w-full">
                        <Formik
                            onSubmit={(values) => {
                                console.log(values);
                                dispatch(
                                    setupPeriodAction({
                                        startDate: calendarPeriod.startDate,
                                        endDate: calendarPeriod.endDate,
                                        startTime: moment(timeFrom).format('HH:mm'),
                                        endTime: moment(timeTo).format('HH:mm'),
                                        threshold: values.threshold
                                    })
                                );
                                dispatch(
                                    setModalConfirmationSetupPeriodMetaAction({
                                        onConfirm: async () => {
                                            toggleModalPeriodSetupConfirmation();
                                        }
                                    })
                                );
                                if (
                                    !calendarPeriod &&
                                    !period.free_shipping_from &&
                                    !period.free_shipping_to
                                ) {
                                    dispatch(setErrorToastAction('Please setup period'));
                                } else {
                                    if (!values.threshold) {
                                        console.log(11);
                                    }
                                    // const formData = {
                                    //     threshold: values.threshold,
                                    //     timeFromNew: moment(timeFrom).format('HH:mm:ss'),
                                    //     timeToNew: moment(timeFrom).format('HH:mm:ss')
                                    // };
                                    // dispatch(setThresholdAction(formData));
                                }
                            }}
                            enableReinitialize
                            initialValues={{ threshold }}
                            validationSchema={Yup.object().shape({
                                threshold: Yup.number().typeError('Must be number')
                            })}
                            render={(props) => (
                                <Form onSubmit={props.handleSubmit}>
                                    <div className="w-full md:w-2/5 p-4 float-left threshold-block">
                                        <div className="font-bold text-gray-350 text-lg pb-4 border-b border-gray-200">
                                            {t('Free shipping threshold')}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-6 mb-3">
                                            {t('settings_theshold')}
                                        </div>
                                        {/*<div style={{ maxWidth: '150px' }}>*/}
                                        {/*    <InputText*/}
                                        {/*        icon={'f-threshold'}*/}
                                        {/*        style={'field-threshold'}*/}
                                        {/*        label={null}*/}
                                        {/*        name={'threshold'}*/}
                                        {/*        placeholder={null}*/}
                                        {/*        props={props}*/}
                                        {/*        tips={null}*/}
                                        {/*    />*/}
                                        {/*</div>*/}
                                        <Field
                                            name="threshold"
                                            className="f-threshold form-control font-control-icon max-w-[150px] float-left mt-4"
                                        />
                                        {/*<span className="float-left mt-[23px] ml-[15px] font-bold rainbow-gradient-text">*/}
                                        {/*    &euro;*/}
                                        {/*</span>*/}
                                        <div className="error-el">
                                            <ErrorMessage name="threshold" />
                                        </div>
                                    </div>
                                    <div className="w-full md:w-3/5 p-4 float-left">
                                        <div className="font-bold text-gray-350 text-lg pb-4 border-b border-gray-200">
                                            {t('Free Shipping Period')}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-6">
                                            {t('setting_window')}
                                        </div>
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
                                                    }}
                                                    onChange={(update) => {
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-ignore
                                                        setDateRange(update);
                                                    }}
                                                    isClearable={true}
                                                />
                                            </div>
                                            <div className="inline-block ml-6">
                                                <TimePicker
                                                    className={`form-control-picker`}
                                                    format={'HH:mm:ss'}
                                                    name="time_from"
                                                    value={timeFrom}
                                                    onChange={handleValueChangeFrom}
                                                />
                                                <TimePicker
                                                    format={'HH:mm:ss'}
                                                    className={`form-control-picker ml-4`}
                                                    name="time_to"
                                                    value={timeTo}
                                                    onChange={handleValueChangeTo}
                                                />
                                            </div>
                                        </div>
                                        {period?.free_shipping_from && period?.free_shipping_to && (
                                            <div className="block text-[14px] font-bold mt-[20px]">
                                                <ul className="inline-block">
                                                    <li className="float-left">
                                                        <span className="inline-block mt-[2px] text-gray-350">
                                                            {moment(period.free_shipping_from)
                                                                .add('-3', 'hours')
                                                                .format('DD/MM/YYYY HH:mm')}
                                                            {' - '}
                                                            {moment(period.free_shipping_to)
                                                                .add('-3', 'hours')
                                                                .format('DD/MM/YYYY HH:mm')}
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
                                    </div>
                                    <div className="float-right">
                                        <button
                                            type="submit"
                                            className="w-full mt-8 gradient-btn float-left max-w-[300px]">
                                            {t('Save changes')}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        />
                        <div className="clear-both" />
                    </div>
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
