import { useState } from 'react';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { InputText, InputTextarea } from '../../components/_form';
import { userSelector } from '../../redux/user/selectors';
import { sendMessage } from '../../redux/support/actions';
import { setSuccessToastAction } from '../../redux/layouts';
import { getSession } from 'next-auth/client';
import Head from 'next/head';

export default function Support({ locale }: { locale: string }) {
    const t = useTranslations();
    const user = useSelector(userSelector);
    const dispatch = useDispatch();

    const [success, setSuccess] = useState(false);

    const initialValues = {
        email: user.email,
        message: ''
    };
    const validationSchema = Yup.object({
        email: Yup.string().required(t('Required field')).email(t('Must be a valid email')),
        message: Yup.string()
            .min(50, t('Your request should have at least 50 characters'))
            .required(t('Required field'))
    });

    return (
        <>
            <Head>
                <title>Amadeo CRM - {t('Support')}</title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-big">
                <div className="page-title">
                    <h1>{t('Support')}</h1>
                </div>
                <div className="text-gray-400">{t('support_descr')}</div>
            </div>

            <div className="mt-10 block-white-8 white-shadow-big">
                <div className="font-bold text-gray-350 text-lg mb-8 border-gray-200">
                    {t('How can I help you ?')}
                </div>
                {success ? (
                    <div className="mb-4 font-bold text-2xl line-height-105percent w-72 text-green-500">
                        {t('Your message has been sent to support!')}
                    </div>
                ) : (
                    <Formik
                        enableReinitialize
                        onSubmit={(values) =>
                            dispatch(sendMessage(values, locale))
                                .then(
                                    dispatch(
                                        setSuccessToastAction(
                                            t('Your message has been sent to support!')
                                        )
                                    )
                                )
                                .then(() => setSuccess(true))
                        }
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        render={(props) => (
                            <form className="w-full md:w-1/2" onSubmit={props.handleSubmit}>
                                <InputText
                                    icon={null}
                                    placeholder="user@domain.com"
                                    props={props}
                                    label={t('Email to respond')}
                                    tips={null}
                                    name={'email'}
                                    style=""
                                />

                                <InputTextarea
                                    props={props}
                                    label={t('Describe the issue')}
                                    icon={null}
                                    placeholder={'Something happend...'}
                                    name="message"
                                    style=""
                                />
                                <button type="submit" className="w-32 mt-8 gradient-btn">
                                    {t('Send')}
                                </button>
                            </form>
                        )}
                    />
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
