import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setThresholdAction } from '../../redux/shipping/actions';
import { useTranslations } from 'next-intl';
import { setSuccessToastAction } from '../../redux/layouts';
import { ErrorMessage, Field, Formik } from 'formik';
import { Form } from 'react-bootstrap';
import { userSelector } from '../../redux/user/selectors';
import axios from 'axios';
import { authHeader } from '../../lib/functions';
import getConfig from 'next/config';
import * as Yup from 'yup';
import { getSession } from 'next-auth/client';
import Head from 'next/head';

const { publicRuntimeConfig } = getConfig();
const url = `${publicRuntimeConfig.apiUrl}/api/shipping`;

export default function ShippingThreshold() {
    const dispatch = useDispatch();
    const t = useTranslations();
    const user = useSelector(userSelector);
    const [threshold, setThreshold] = useState('');

    useEffect(() => {
        if (!user.email) return;

        axios
            .get(`${url}/threshold`, {
                headers: {
                    ...authHeader(user.email)
                }
            })
            .then((result) => setThreshold(result.data.threshold));
    }, [user.email]);

    if (!user.email) return null;

    return (
        <>
            <Head>
                <title>Amadeo CRM - Settings - Free shipping threshold</title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-big">
                <div className="page-title">
                    <h1>{t('Settings')}</h1>
                </div>
                <div className="text-gray-400">{t('settings_descr')}</div>
            </div>

            <div className="md:flex mt-10 block-white-8 white-shadow-big">
                {user.role_id !== 3 && (
                    <div className="w-full md:w-72 p-4 bg-gray-100 rounded-lg shadow-inner">
                        <div className="font-bold text-gray-350 text-lg pb-4 border-b border-gray-200">
                            {t('Free shipping')}
                        </div>
                        <div className="text-sm text-gray-500 mt-12">{t('shipping_threshold')}</div>
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
                                        className="w-full p-2.5 shadow-inner rounded-lg border-2 text-gray-350 font-bold mt-6"
                                    />
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
