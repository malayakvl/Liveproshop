import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import Image from 'next/image';
import Router from 'next/router';
import FullLayout from '../../../components/layout/FullLayout';
import { TogglePassword } from '../../../components/_form';
import { useDispatch, useSelector } from 'react-redux';
import { changePasswordInvitationAction } from '../../../redux/profile';
import { isPasswordChangedSelector } from '../../../redux/profile/selectors';

export default function Password({ hash, locale }: { hash: string; locale: string }) {
    const t = useTranslations();
    const dispatch = useDispatch();
    const isPasswordChanged = useSelector(isPasswordChangedSelector);

    useEffect(() => {
        if (isPasswordChanged) {
            Router.push(`/${locale === 'fr' ? '' : `${locale}/`}auth/signin`);
        }
    }, [isPasswordChanged]);

    const SubmitSchema = Yup.object().shape({
        password: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('Required field'))
            .min(6, t('Password must be at least 6 characters')),
        password_confirmation: Yup.string()
            .required(t('Required field'))
            .oneOf([Yup.ref('password'), null], t('Passwords must match'))
    });

    return (
        <>
            <Head>
                <title>Amadeo CRM - Restore Password</title>
            </Head>

            <div className="flex justify-center">
                <div className="rounded-lg border shadow-xl mt-10 bg-white w-96 p-10 pb-16">
                    <div className="flex">
                        <div className="font-bold text-3xl line-height-105percent mb-2">
                            Restore Password
                        </div>
                        <Image
                            className=""
                            width={64}
                            height={64}
                            src="/images/keys.svg"
                            layout="fixed"
                            alt=""
                        />
                    </div>

                    <div className="text-sm mb-10">{t('Please, type new password')}</div>

                    <Formik
                        enableReinitialize
                        initialValues={{}}
                        validationSchema={SubmitSchema}
                        onSubmit={(values) =>
                            dispatch(changePasswordInvitationAction({ ...values, hash }))
                        }>
                        {(props) => (
                            <form onSubmit={props.handleSubmit} className="mt-5 w-full">
                                <TogglePassword
                                    label={null}
                                    icon={'f-key'}
                                    name={'password'}
                                    placeholder={'New Password'}
                                    style=""
                                    props={props}
                                />

                                <TogglePassword
                                    label={null}
                                    icon={'f-key'}
                                    name={'password_confirmation'}
                                    placeholder={'Confirm Password'}
                                    style=""
                                    props={props}
                                />
                                <div className="mt-10 mb-7 block border border-gray-180 border-b-0" />
                                <button type="submit" className="gradient-btn">
                                    {t('Save')}
                                </button>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
}

Password.Layout = FullLayout;

export async function getServerSideProps(context: any) {
    const { req, locale } = context;
    const hash = req.__NEXT_INIT_QUERY.hash;

    return {
        props: {
            messages: {
                ...require(`../../../messages/${locale}.json`)
            },
            locale,
            hash
        }
    };
}
