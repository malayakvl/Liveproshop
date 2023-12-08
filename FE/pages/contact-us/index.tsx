import { useState } from 'react';
import { getSession } from 'next-auth/client';
import { useDispatch } from 'react-redux';
import { useTranslations } from 'next-intl';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { InputText, InputTextarea } from '../../components/_form';
import { submitFormAction } from '../../redux/contact-us/actions';
import FullLayout from '../../components/layout/FullLayout';
import Head from 'next/head';

function ContactUs({ locale }: { locale: string }) {
    const t = useTranslations();
    const dispatch = useDispatch();

    const [success, setSuccess] = useState(false);

    const SubmitSchema = Yup.object().shape({
        name: Yup.string().required(t('Required field')),
        email: Yup.string().email(t('Must be a valid email')).required(t('Required field')),
        message: Yup.string().required(t('Required field'))
    });

    const handlerSubmit = (values: unknown) => {
        dispatch(
            submitFormAction({
                form: values,
                successMessage: t('Your request has been sent'),
                locale,
                callback: setSuccess
            })
        );
    };

    return (
        <>
            <Head>
                <title>LiveProshop - {t('Contact Us')}</title>
            </Head>

            <div className="flex main-bg justify-center">
                <div className="mt-10 rounded-lg colored-shadow bg-white w-96 p-10">
                    <div className="mb-8 font-bold text-3xl line-height-105percent">
                        {t('Contact Us')}
                    </div>
                    {success ? (
                        <div className="mb-4 font-bold text-2xl line-height-105percent w-72 text-green-500">
                            {t('Your request has been sent')}
                        </div>
                    ) : (
                        <Formik
                            initialValues={{}}
                            validationSchema={SubmitSchema}
                            onSubmit={handlerSubmit}>
                            {(props) => (
                                <Form className="mb-4">
                                    <InputText
                                        icon={'f-fname'}
                                        style={null}
                                        label={null}
                                        name={'name'}
                                        placeholder={t('Name')}
                                        props={props}
                                        tips={null}
                                    />

                                    <InputText
                                        style={null}
                                        icon={'f-email'}
                                        label={null}
                                        name={'email'}
                                        placeholder={'Email'}
                                        props={props}
                                        tips={null}
                                    />

                                    <InputTextarea
                                        props={props}
                                        label={null}
                                        icon={'f-message'}
                                        placeholder={t('Message')}
                                        name="message"
                                        style=""
                                    />

                                    <div className="mb-6">
                                        <button
                                            className="gradient-btn w-full px-3 py-4 text-white bg-indigo-500 rounded-md
                                    hover:bg-indigo-600
                                    focus:outline-none duration-100 ease-in-out">
                                            {t('Send')}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            </div>
        </>
    );
}
ContactUs.Layout = FullLayout;

export default ContactUs;

export async function getServerSideProps(context: any) {
    const { req, locale } = context;
    const session = await getSession({ req });
    if (session) {
        return {
            redirect: { destination: `/${locale === 'fr' ? '' : locale}` }
        };
    }
    return {
        props: {
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
