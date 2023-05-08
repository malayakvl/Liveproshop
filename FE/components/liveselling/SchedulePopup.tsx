import React, { useEffect, useState } from 'react';
import { toggleModalPopup } from '../../lib/functions';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { showPopupSelector } from '../../redux/livesessions/selectors';
import { userSelector } from '../../redux/user/selectors';
import { showPopupAction } from '../../redux/livesessions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'rc-slider/assets/index.css';
import moment from 'moment';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { submitFormAction } from '../../redux/livesessions/actions';
import InputMask from 'react-input-mask';
import Link from 'next/link';

const SchedulePopup: React.FC<any> = () => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const showModal = useSelector(showPopupSelector);
    // const {
    //     plan_options: { feature_fb_schedule }
    // } = useSelector(userSelector);

    const feature_fb_schedule = useSelector(userSelector)?.plan_options?.feature_fb_schedule;

    // const scenarios = useSelector(scenariosSelector);
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(moment().format('HH:mm'));
    // const [selectedScenarios, setSelectedScenarios] = useState<number[]>([]);

    useEffect(() => {
        if (showModal) {
            toggleModalPopup('.modal-schedule');
        }
    }, [dispatch, showModal]);

    // const updateScenarios = (id: number) => {
    //     const _scenarios = selectedScenarios;
    //     if (_scenarios.includes(id)) {
    //         const index = _scenarios.findIndex((v: any) => v === id);
    //         if (index >= 0) {
    //             _scenarios.splice(index, 1);
    //         }
    //     } else {
    //         _scenarios.push(id);
    //     }
    //     setSelectedScenarios(_scenarios);
    // };
    const SubmitSchema = Yup.object().shape({
        // cart_duration: Yup.number().required(t('Required field')),
        // type: Yup.string().required(t('Required field'))
    });

    return (
        <div className="modal modal-schedule opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" />
            <div className="modal-container bg-white w-12/12 md:max-w-screen-sm mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <div
                    className="modal-content py-4 text-left px-6 overflow-auto"
                    style={{ maxHeight: '90vh' }}>
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">{t('New Live Session')}</p>
                        <div
                            className="modal-close cursor-pointer z-50"
                            role="presentation"
                            onClick={() => {
                                dispatch(showPopupAction(false));
                                toggleModalPopup('.modal-schedule');
                            }}>
                            <img
                                src="/images/close-modal.svg"
                                className="fill-current text-black"
                                alt={''}
                            />
                        </div>
                    </div>

                    {/*Body*/}
                    <div>
                        <div className="flex">
                            {feature_fb_schedule ? (
                                <Formik
                                    initialValues={{ cart_duration: '', type: '' }}
                                    validationSchema={SubmitSchema}
                                    onSubmit={(values, { resetForm }) => {
                                        const sessionData: any = {};
                                        sessionData.event_date =
                                            moment(startDate).format('YYYY-MM-DD');
                                        // sessionData.event_time = moment(startTime).format('HH:mm');
                                        sessionData.event_time = startTime;
                                        // sessionData.scenarios = selectedScenarios;
                                        if ((values as any).id) {
                                            sessionData.id = (values as any).id;
                                        }
                                        sessionData.cart_duration = (values as any).cart_duration;
                                        sessionData.type = (values as any).type;
                                        dispatch(submitFormAction(sessionData));
                                        resetForm();
                                    }}>
                                    {(props) => {
                                        return (
                                            <form onSubmit={props.handleSubmit}>
                                                <div className="grid grid-cols-1">
                                                    <div>
                                                        <span className="block text-gray-350 text-[18px] font-bold mb-5">
                                                            Choose a date
                                                        </span>
                                                        <div className="flex">
                                                            <div className="mb-4">
                                                                <label className="control-label">
                                                                    {t('Date')}
                                                                </label>
                                                                <DatePicker
                                                                    className="form-control date-input"
                                                                    selected={startDate}
                                                                    onChange={(date: any) => {
                                                                        if (moment(date).isValid())
                                                                            setStartDate(date);
                                                                    }}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    minDate={new Date()}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="mb-4 ml-5">
                                                                <label className="control-label">
                                                                    {t('Time Start')}
                                                                </label>
                                                                <div>
                                                                    <InputMask
                                                                        style={{ width: '100px' }}
                                                                        className="form-control"
                                                                        mask={[
                                                                            /[0-2]/,
                                                                            startTime[0] === '2'
                                                                                ? /[0-3]/
                                                                                : /[0-9]/,
                                                                            ':',
                                                                            /[0-5]/,
                                                                            /[0-9]/
                                                                        ]}
                                                                        maskPlaceholder="00:00"
                                                                        onChange={(e) =>
                                                                            setStartTime(
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        onFocus={(e) =>
                                                                            e.target.select()
                                                                        }
                                                                        value={startTime}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-center">
                                                    <button
                                                        type="button"
                                                        className="cancel mr-2.5"
                                                        onClick={() => {
                                                            dispatch(showPopupAction(false));
                                                            toggleModalPopup('.modal-schedule');
                                                            props.resetForm();
                                                        }}>
                                                        {t('Cancel')}
                                                    </button>
                                                    <button className="gradient-btn">
                                                        {t('Save')}
                                                    </button>
                                                </div>
                                            </form>
                                        );
                                    }}
                                </Formik>
                            ) : (
                                <div>
                                    <p className="mb-4">{t('liveselling_warning')}</p>
                                    <Link href="/FE/DELETE/pricing">Pricing & Plans</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePopup;
