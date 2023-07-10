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

export default function Index() {
    const t = useTranslations();
    const initialValues = useSelector(itemSelector);
    const dispatch = useDispatch();

    const [showForm, setShowForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | null>();

    const validationSchema = Yup.object({
        free_shipping_timer: Yup.number().when('free_shipping_status', {
            is: true,
            then: Yup.number().required(t('Required field'))
        })
    });

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
                                    {/* <div className="font-bold text-gray-350 text-lg mb-8 border-gray-200">
                                        {t('Live session Settings')}
                                    </div>
                                    <div className="flex">
                                        <div className="max-w-[100px]">
                                            <InputText
                                                icon={null}
                                                label={'Duration Cart'}
                                                name={'order_timer'}
                                                placeholder={'num_day_hour'}
                                                style={null}
                                                props={props}
                                                tips={null}
                                            />
                                        </div>
                                        <div className="ml-2">
                                            <InputSelect
                                                options={[
                                                    { id: 'h', name: 'Hour(s)' },
                                                    { id: 'd', name: 'Day(s)' }
                                                ]}
                                                label={'Type Interval'}
                                                name={'type'}
                                                style={null}
                                                props={props}
                                            />
                                        </div>
                                    </div> */}
                                    <div className="mt-8 font-bold text-gray-350 text-lg mb-8 border-gray-200">
                                        {t('Free Shipping Window')}
                                    </div>
                                    <InputSwitcher
                                        label={'Free Shipping'}
                                        name={'free_shipping_status'}
                                        style={null}
                                        props={props}
                                    />
                                    <div className="max-w-[300px]">
                                        <InputText
                                            icon={null}
                                            label={'Free Shipping Hour(s)'}
                                            name={'free_shipping_timer'}
                                            placeholder={'Free Shipping Hour(s)'}
                                            style={null}
                                            props={props}
                                            tips={null}
                                        />
                                    </div>
                                    {/* <InputText
                                        style={'w-1/2'}
                                        icon={null}
                                        label={t('Multisafepay API')}
                                        name={'multisafe_api_key'}
                                        placeholder={'Multisafepay API'}
                                        props={props}
                                        tips={null}
                                    /> */}
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
