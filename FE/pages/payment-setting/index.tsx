import { getSession } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { InputText } from '../../components/_form';
import { itemSelector } from '../../redux/settings/selectors';
import { fetchFormAction } from '../../redux/settings';
import { showLoaderAction } from '../../redux/layouts/actions';
import { submitFormAction } from '../../redux/settings/actions';
import Head from 'next/head';
import { Multisafe } from '../../components/payments';

export default function PaymentSetting() {
    const t = useTranslations();
    const initialValues = useSelector(itemSelector);
    const dispatch = useDispatch();

    const [showForm, setShowForm] = useState(false);
    // const [selectedItem, setSelectedItem] = useState<any | null>();

    const validationSchema = Yup.object({
        // order_timer: Yup.number().required(t('Required field')),
        // type: Yup.string().required(t('Required field')),
        multisafe_api_key: Yup.string().required(t('Required field'))
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

    return (
        <>
            <Head>
                <title>LiveProshop - Payment Settings</title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-big">
                <div className="page-title">
                    <h1>{t('Settings')}</h1>
                </div>
            </div>
            {showForm && (
                <>
                    <div className="mt-10 block-white-8 white-shadow-big">
                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                dispatch(submitFormAction(values));
                            }}>
                            {(props) => {
                                return (
                                    <form className="w-full md:w-1/2" onSubmit={props.handleSubmit}>
                                        <InputText
                                            style={'w-full md:w-1/2'}
                                            icon={null}
                                            label={t('Multisafepay API')}
                                            name={'multisafe_api_key'}
                                            placeholder={'Multisafepay API'}
                                            props={props}
                                            tips={null}
                                        />
                                        <button type="submit" className="w-32 mt-8 gradient-btn">
                                            {t('Save')}
                                        </button>
                                    </form>
                                );
                            }}
                        </Formik>
                    </div>
                    <Multisafe />
                </>
            )}
            {/* <ConfirmDialog
                show={!!selectedItem}
                text={t('Are you sure you want to {status} {name} method?', {
                    status: selectedItem?.status ? t('disable') : t('enable'),
                    name: selectedItem?.name
                })}
                titleConfirm={t('Yes')}
                titleCancel={t('Cancel')}
                onConfirm={handlerConfirm}
                onClose={() => setSelectedItem(null)}
            /> */}
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
                ...require(`../../messages/${locale}.json`),
                ...require(`../../messages/multisafe/${locale}.json`)
            }
        }
    };
}
