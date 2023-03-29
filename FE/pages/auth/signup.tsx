import FullLayout from '../../components/layout/FullLayout';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { providers, getSession } from 'next-auth/client';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import * as Yup from 'yup';
import { Field, Formik, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { inviteUserAction } from '../../redux/user/actions';
import { accountService } from '../../_services';
import { hideRegisterFormSelector } from '../../redux/user/selectors';

export default function Signup() {
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
            dispatch(inviteUserAction(values));
            actions.resetForm();
        }
    };

    return (
        <>
            <Head>
                <title>Amadeo CRM - Sign Up</title>
            </Head>

            <div className="flex justify-center md:h-[580px]">
                <Formik
                    enableReinitialize
                    initialValues={{ email: '', acceptTerms: false, role_id: '2' }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}>
                    {(props) => (
                        <form
                            onSubmit={props.handleSubmit}
                            className="flex-col w-full px-4 rounded-lg border shadow-xl mt-10 flex md:flex-row md:w-[1000px] bg-white md:px-20 py-14 md:mr-0 md:ml-0">
                            <div className="w-full font-bold mt-8 md:pr-12 md:w-2/4">
                                <div className="text-5xl line-height-105percent mb-9">
                                    {t('Sing up today!')}
                                </div>

                                <div className="mb-4 text-2xl line-height-105percent w-72">
                                    {t('registr_descr')}
                                </div>

                                <div className="font-normal mb-10 text-blue-350 w-60">
                                    {t('registr_descr_small')}
                                </div>

                                <Link href={'/auth/signin'}>
                                    <a className="font-bold text-orange-450">
                                        {t('have_account_descr')}
                                    </a>
                                </Link>
                            </div>

                            <div className="w-full md:pl-12 md:border-l md:w-2/4">
                                {!hideForm && (
                                    <>
                                        <div className="flex mb-14">
                                            <div className="w-16 leading-10 text-gray-200 font-bold text-5xl">
                                                1.
                                            </div>
                                            <div>
                                                <div className="font-bold mb-2.5">
                                                    {t('How would you like to Sign up as?')} :
                                                </div>
                                                <div className="text-gray-180 text-xs mb-4">
                                                    <Field
                                                        onClick={() => setRoleId(2)}
                                                        id="buyer-radio"
                                                        type="radio"
                                                        className="radio mr-2.5"
                                                        name="role_id"
                                                        value="1"
                                                    />
                                                    <label htmlFor="buyer-radio">
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
                                                    <label htmlFor="seller-radio">
                                                        {t('Seller')}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="w-16 leading-10 text-gray-200 font-bold text-5xl">
                                                2.
                                            </div>
                                            <div className="flex flex-col">
                                                <button
                                                    onClick={() => {
                                                        setIsFbClicked(true);
                                                    }}
                                                    className="image-btn bg-social-facebook text-white">
                                                    <Image
                                                        width={24}
                                                        height={24}
                                                        src="/images/social/facebook-solid.svg"
                                                        layout="fixed"
                                                        alt=""
                                                    />
                                                    <div className="text-[12px] md:text-sm  ml-2.5">
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
                                                        <span className="text-orange-450">
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
                                    <div className="grid content-center min-h-[400px]">
                                        <div className="mb-4 font-bold text-2xl line-height-105percent w-72 text-green-500">
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
