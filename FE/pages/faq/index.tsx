import Head from 'next/head';
import FullLayout from '../../components/layout/FullLayout';
import React, { useState } from 'react';
import Faq from '../../components/faq';
import Link from 'next/link';
import { Form, Formik } from 'formik';
import { InputText } from '../../components/_form';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { requestDemoAction } from '../../redux/paymentPlans';
import { useDispatch } from 'react-redux';
import { setModalCalendlyMetaAction } from '../../redux/layouts';

export default function Index({ locale }: { locale: string }) {
    const t = useTranslations();
    const [success, setSuccess] = useState(false);
    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        email: Yup.string().email(t('Must be a valid email')).required(t('Required field'))
    });

    const handlerSubmit = (values: unknown) => {
        dispatch(
            requestDemoAction({
                form: values,
                successMessage: t('Your request has been sent'),
                locale,
                callback: setSuccess
            })
        );
    };
    return (
        <div className="main-bg container xl:max-w-[1400px] mx-auto">
            <Head>
                <title>LiveProshop - FAQ</title>
                <meta name="description" content="LiveProshop portal" />
            </Head>

            <div className="main-layout">
                <Faq locale={locale} />
                {/*FORM BLOCK*/}
                <div className="text-gray-350 mx-auto border-red-900">
                    <div className="clear-both" />
                    <h3 className="red-yellow-gradient-text mt-[30px] font-bold text-[24px] leading-[32px] md:text-[60px] md:leading-[72px] text-center md:mt-[80px]">
                        {t('Try it for free today!')}
                    </h3>
                    <h4 className="text-gray-350 leading-[38px] text-[30px] w-full text-center font-medium mt-[24px]">
                        {t('It only takes 30 seconds to get started')}.
                    </h4>
                    <div className="w-full mt-[40px] text-center mb-[100px]">
                        <Link href={'/auth/signup'}>
                            <a className="btn-big md:mr-[20px] block mb-[10px] md:mb-auto md:inline-block  lg:mr-[84px]">
                                <span className="text-[20px] inline-block min-w-[220px]">
                                    {t('Register now!')}
                                </span>
                            </a>
                        </Link>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                        <a
                            onClick={() => {
                                dispatch(setModalCalendlyMetaAction(true));
                            }}
                            className="cursor-pointer btn-big text-center md:inline-block md:ml-[75px]">
                            <span className="text-[16px] md:text-[20px]">
                                {t('Request a seles call')}
                            </span>
                        </a>
                    </div>

                    {success ? (
                        <div className="mt-8 mb-16 font-bold text-2xl text-center text-green-500 hidden">
                            {t('Your request has been sent')}
                        </div>
                    ) : (
                        <Formik
                            initialValues={{}}
                            validationSchema={validationSchema}
                            onSubmit={handlerSubmit}>
                            {(props) => (
                                <Form className="flex flex-wrap justify-center align-middle lg:flex-nowrap lg:max-w-2xl mt-8 mb-16 mx-auto hidden">
                                    <InputText
                                        style={'h-14 text-lg w-full'}
                                        icon={'f-email'}
                                        label={null}
                                        name={'email'}
                                        placeholder={t('holder_email')}
                                        props={props}
                                        tips={null}
                                    />

                                    <div className="mb-6 min-w-max w-full lg:w-auto ">
                                        <button className="lg:ml-5 lg:mt-0 w-full gradient-btn hover:bg-indigo-600 focus:outline-none duration-100 ease-in-out">
                                            <span className="text-lg">{t('Request a demo')}</span>
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            </div>
        </div>
    );
}
Index.Layout = FullLayout;

export async function getServerSideProps(context: any) {
    const { locale } = context;

    return {
        props: {
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`),
                ...require(`../../messages/faq/${locale}.json`)
            }
        }
    };
}
