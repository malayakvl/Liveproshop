import FullLayout from '../../components/layout/FullLayout';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { providers, getSession } from 'next-auth/client';
import Head from 'next/head';
import Link from 'next/link';
import * as Yup from 'yup';
import { Field, Formik, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { inviteUserAction } from '../../redux/user/actions';
import { accountService } from '../../_services';
import { hideRegisterFormSelector } from '../../redux/user/selectors';

export default function Signup({ locale }: { locale: string }) {
    const dispatch = useDispatch();
    const hideFormSelector = useSelector(hideRegisterFormSelector);
    type FormData = {
        email: string;
        acceptTerms: boolean;
        role_id: '1' | '2';
    };

    const t = useTranslations();
    const [roleId, setRoleId] = useState(1);
    const [isFbClicked, setIsFbClicked] = useState(false);
    const [hideForm, setHideForm] = useState(false);

    const validationSchema = Yup.object().shape({
        email: !isFbClicked
            ? Yup.string().email(t('Must be a valid email')).required(t('Required field'))
            : Yup.string(),
        acceptTerms: Yup.bool().oneOf([true], t('Accept Terms is required'))
    });

    useEffect(() => {
        setHideForm(hideFormSelector);
    }, [hideFormSelector]);

    const onSubmit = (values: FormData, actions: any) => {
        if (isFbClicked) {
            accountService.registerFB(roleId);
        } else {
            dispatch(inviteUserAction(values, locale));
            actions.resetForm();
        }
    };

    return (
        <>
            <Head>
                <title>LiveProshop - Sign Up</title>
            </Head>

            <div className="flex main-bg justify-center md:h-[620px]">
                <Formik
                    enableReinitialize
                    initialValues={{ email: '', acceptTerms: false, role_id: '2' }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}>
                    {(props) => (
                        <form
                            onSubmit={props.handleSubmit}
                            className="w-80 mb-5 p-8 flex-col rounded-lg colored-shadow mt-10 flex md:flex-row md:w-[1000px] bg-white md:px-10 md:py-10 md:mr-0 md:ml-0">
                            <div className="mt-0 w-full font-bold md:mt-8 md:pr-8 md:w-2/4 md:flex md:flex-col md:justify-center">
                                <div className="text-3xl md:text-4xl mb-9 text-gray-600">
                                    {t('Sign up today!')}
                                </div>

                                <div className="mb-6 text-xl line-height-105percent text-gray-600">
                                    {t('registr_descr')}
                                </div>
                                <div className="mb-6 text-sm line-height-105percent text-gray-600 italic">
                                    {t('You can cancel at any time before to avoid the charge')}
                                </div>

                                <div className="font-normal mb-6 text-blue-350 hidden">
                                    {t('registr_descr_small')}
                                </div>

                                <Link href={'/auth/signin'}>
                                    <a className="font-bold red-yellow-gradient-text mb-8 block">
                                        {t('have_account_descr')}
                                    </a>
                                </Link>
                            </div>

                            <div className="w-full md:pl-12 md:border-l md:w-2/4">
                                {!hideForm && (
                                    <>
                                        <div className="flex mb-10">
                                            <div className="w-12 leading-10 text-gray-200 font-bold text-4xl">
                                                1.
                                            </div>
                                            <div>
                                                <div className="font-bold mb-2.5">
                                                    {t('How would you like to Sign up as?')} :
                                                </div>
                                                <div className="text-gray-180 text-xs mb-2">
                                                    <Field
                                                        onClick={() => setRoleId(2)}
                                                        id="buyer-radio"
                                                        type="radio"
                                                        className="radio mr-2.5"
                                                        name="role_id"
                                                        value="1"
                                                    />
                                                    <label
                                                        htmlFor="buyer-radio"
                                                        className="text-blue-350 font-bold">
                                                        {t('Shopper')}
                                                    </label>
                                                </div>
                                                <div className="text-gray-180 text-xs">
                                                    <Field
                                                        onClick={() => setRoleId(2)}
                                                        id="seller-radio"
                                                        type="radio"
                                                        className="radio mr-2.5"
                                                        name="role_id"
                                                        value="2"
                                                    />
                                                    <label
                                                        htmlFor="seller-radio"
                                                        className="text-blue-350 font-bold">
                                                        {t('Seller')}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="w-12 leading-10 text-gray-200 font-bold text-4xl">
                                                2.
                                            </div>
                                            <div className="flex flex-col">
                                                <button
                                                    onClick={() => {
                                                        setIsFbClicked(true);
                                                    }}
                                                    className="image-btn bg-social-facebook text-white">
                                                    <div className="text-[12px] md:text-sm w-full text-center bg-facebook-btn">
                                                        {t('Continue with Facebook')}
                                                    </div>
                                                </button>
                                                <div
                                                    style={{ lineHeight: '0.1em' }}
                                                    className="text-center border-b my-5">
                                                    <span className="bg-white px-6">{t('or')}</span>
                                                </div>
                                                <div className="relative">
                                                    <i className="f-icon f-email" />

                                                    <input
                                                        className="form-control-icon"
                                                        placeholder={t('Email')}
                                                        type="text"
                                                        onClick={() => setIsFbClicked(false)}
                                                        onChange={(event) => {
                                                            event.target.value =
                                                                event.target.value.trim();
                                                            props.handleChange(event);
                                                        }}
                                                        // value={inputValue || ''}
                                                        value={props.values['email']}
                                                        name="email"
                                                    />
                                                    <i
                                                        role="presentation"
                                                        className="input-close cursor-pointer"
                                                        onClick={() =>
                                                            props.setFieldValue('email', '')
                                                        }
                                                    />
                                                    {props.errors.email && (
                                                        <div className="error-el">
                                                            {props.errors.email}
                                                        </div>
                                                    )}
                                                </div>
                                                <div
                                                    style={{ lineHeight: '0.1em' }}
                                                    className="text-center border-b my-5"
                                                />
                                                <div>
                                                    <Field
                                                        id="acceptTerms"
                                                        name="acceptTerms"
                                                        className="text-green-250 w-5 h-5 border-2 rounded mr-2.5"
                                                        type="checkbox"
                                                    />
                                                    <label
                                                        htmlFor="acceptTerms"
                                                        className="text-xs font-medium">
                                                        {t('I have read and accept the')}{' '}
                                                        <span className="rainbow-gradient-text">
                                                            <a
                                                                href="https://www.liveproshop.com/terms-and-conditions"
                                                                target="_blank"
                                                                rel="noreferrer">
                                                                {t('terms of use')}
                                                            </a>
                                                        </span>
                                                    </label>
                                                </div>

                                                <ErrorMessage
                                                    name="acceptTerms"
                                                    component="div"
                                                    className="error-el"
                                                />

                                                <button
                                                    type="submit"
                                                    className="gradient-btn w-full mt-4">
                                                    {t('Sign up')}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {hideForm && (
                                    <div className="grid content-center md:min-h-[400px]">
                                        <div className="mb-4 font-bold text-2xl line-height-105percent text-green-500">
                                            {t(
                                                'We send you confirmation link, please check your mailbox'
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </>
    );
}

Signup.Layout = FullLayout;

export async function getServerSideProps(context: any) {
    const { req, locale } = context;
    const session = await getSession({ req });

    if (session) {
        return {
            redirect: { destination: '/' }
        };
    }

    return {
        props: {
            providers: await providers(),
            locale: locale,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
