import FullLayout from '../../components/layout/FullLayout';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { providers, getSession } from 'next-auth/client';
import Head from 'next/head';
import Link from 'next/link';
import * as Yup from 'yup';
import { Field, Formik, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
    inviteUserAction,
    setOrderCommentAction,
    setWaitOrderIdAction
} from '../../redux/user/actions';
import { accountService } from '../../_services';
import { hideRegisterFormSelector, userForFreeSelector } from '../../redux/user/selectors';
import { orderTmpCommentIdSelector } from '../../redux/orders/selectors';
import { nativeBrowserSelector, openRealBrowserSelector } from '../../redux/layouts/selectors';
import { setOpenRealBrowserAction } from '../../redux/layouts';

export default function Signup({ locale }: { locale: string }) {
    const dispatch = useDispatch();
    const tmpCommentOrderId = useSelector(orderTmpCommentIdSelector);
    const hideFormSelector = useSelector(hideRegisterFormSelector);
    const forFree = useSelector(userForFreeSelector);
    const nativeBrowser = useSelector(nativeBrowserSelector);
    const openRealBrowser = useSelector(openRealBrowserSelector);
    type FormData = {
        email: string;
        acceptTerms: boolean;
        role_id: '1' | '2';
        forFree: any;
    };

    const t = useTranslations();
    const [roleId, setRoleId] = useState(1);
    const [isFbClicked, setIsFbClicked] = useState(false);
    const [hideForm, setHideForm] = useState(false);
    const [commentId, setCommentId] = useState('');
    const [_, setCommentTmpId] = useState('');
    const [showSellerRadio, setShowSellerRadio] = useState(true);

    const validationSchema = Yup.object().shape({
        email: !isFbClicked
            ? Yup.string().email(t('Must be a valid email')).required(t('Required field'))
            : Yup.string(),
        acceptTerms: Yup.bool().oneOf([true], t('Accept Terms is required'))
    });

    useEffect(() => {
        setHideForm(hideFormSelector);
    }, [hideFormSelector]);

    useEffect(() => {
        const urlParams = window.location.search.substring(1);
        const dataParams = urlParams.split('&');
        const commentStr = dataParams[0].split('=');
        console.log('here', window.localStorage.getItem('orderCommentId'));
        console.log('here', window.localStorage.getItem('orderWaitCommentId'));
        // const commentId = commentStr[1];
        if (
            window.localStorage.getItem('orderCommentId') ||
            window.localStorage.getItem('orderWaitCommentId')
        ) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (window.localStorage.getItem('orderCommentId')) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setCommentId(window.localStorage.getItem('orderCommentId'));
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setCommentId(window.localStorage.getItem('orderWaitCommentId'));
            }

            setShowSellerRadio(false);
            setRoleId(1);
        }
        if (commentStr[1]) {
            setCommentId(commentStr[1]);
            setShowSellerRadio(false);
            setRoleId(1);
        }
    }, [typeof window !== 'undefined']);

    useEffect(() => {
        if (tmpCommentOrderId) {
            setCommentTmpId(tmpCommentOrderId);
            setRoleId(1);
        }
    }, [tmpCommentOrderId]);

    useEffect(() => {
        if (nativeBrowser) {
            dispatch(setOpenRealBrowserAction(true));
            const a = window.document.createElement('a');
            a.target = '_blank';
            a.href = 'https://google.com';
            const e = window.document.createEvent('MouseEvents');
            e.initMouseEvent(
                'click',
                true,
                true,
                window,
                0,
                0,
                0,
                0,
                0,
                false,
                false,
                false,
                false,
                0,
                null
            );
            a.dispatchEvent(e);
        }
    }, [nativeBrowser]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof window !== 'undefined') {
        // Client-side-only code
        const urlParams = window.location.search.substring(1);
        const dataParams = urlParams.split('&');
        const commentStr = dataParams[0].split('=');
        if (commentStr[0] == 'comment_id' && commentStr[1]) {
            dispatch(setOrderCommentAction(commentStr[1]));
            window.localStorage.setItem('order_comment_id', commentStr[1]);
        }

        if (commentStr[0] == 'order_id' && commentStr[1]) {
            dispatch(setWaitOrderIdAction(commentStr[1]));
            window.localStorage.setItem('order_wait_id', commentStr[1]);
        }
        if (window.localStorage.getItem('orderCommentId')) {
            // console.log(commentStr[1]);
            const orderIdStorage = window.localStorage.getItem('orderCommentId');
            dispatch(setOrderCommentAction(orderIdStorage));
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.localStorage.setItem('order_comment_id', orderIdStorage);
        }
        if (window.localStorage.getItem('orderWaitCommentId')) {
            // console.log(commentStr[1]);
            const orderIdStorage = window.localStorage.getItem('orderWaitCommentId');
            dispatch(setOrderCommentAction(orderIdStorage));
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.localStorage.setItem('order_comment_id', orderIdStorage);
        }
    }

    const onSubmit = (values: FormData, actions: any) => {
        if (isFbClicked) {
            let parseCommentId;
            if (typeof window !== 'undefined') {
                // Client-side-only code
                const urlParams = window.location.search.substring(1);
                const dataParams = urlParams.split('&');
                const commentStr = dataParams[0].split('=');
                parseCommentId = commentStr[1];
            }
            accountService.registerFB(`${roleId}_${locale}_${forFree ? 1 : 0}_${parseCommentId}`);
        } else {
            // setup value from selector
            values['forFree'] = forFree;
            dispatch(inviteUserAction(values, locale));
            actions.resetForm();
        }
    };

    console.log('Comment ID', commentId);

    return (
        <>
            <Head>
                <title>LiveProshop - Sign Up</title>
            </Head>

            <div className="flex main-bg justify-center md:h-[620px]">
                <Formik
                    enableReinitialize
                    initialValues={{
                        email: '',
                        acceptTerms: false,
                        role_id: typeof window !== 'undefined' ? '1' : '2',
                        forFree: false
                    }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}>
                    {(props) => (
                        <form
                            onSubmit={props.handleSubmit}
                            className={`sign-up-form colored-shadow ${
                                showSellerRadio ? '' : 'sign-up-fb'
                            }`}>
                            <div className="mt-0 w-full font-bold md:mt-0 md:pr-8 md:w-2/4 md:flex md:flex-col md:justify-center">
                                <div className="text-3xl md:text-4xl mb-9 text-gray-600">
                                    {t('Sign up today!')}
                                </div>
                                {nativeBrowser && (
                                    <div className="alert-warning mb-6 block">
                                        It looks like you are using the Facebook in-app browser. For
                                        better experience, please open this link in your default
                                        browser.
                                    </div>
                                )}
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
                                                        onClick={() => {
                                                            setRoleId(1);
                                                        }}
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
                                                <div
                                                    className={`text-gray-180 text-xs ${
                                                        showSellerRadio ? '' : 'hidden'
                                                    }`}>
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
                                                    className={`text-center border-b my-5 ${
                                                        showSellerRadio && roleId != 1
                                                            ? ''
                                                            : 'hidden'
                                                    }`}>
                                                    <span className="bg-white px-6">{t('or')}</span>
                                                </div>
                                                <div
                                                    className={`relative ${
                                                        showSellerRadio && roleId != 1
                                                            ? ''
                                                            : 'hidden'
                                                    }`}>
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
                                                            <Link href={'/terms-and-conditions'}>
                                                                <a
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="rainbow-gradient-text">
                                                                    {' '}
                                                                    {t('terms of use')}
                                                                </a>
                                                            </Link>
                                                            {/*<a*/}
                                                            {/*    href="https://liveproshop.com/terms-and-conditions"*/}
                                                            {/*    target="_blank"*/}
                                                            {/*    rel="noreferrer">*/}
                                                            {/*    {t('terms of use')}*/}
                                                            {/*</a>*/}
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
                                                    className={`gradient-btn w-full mt-4 ${
                                                        showSellerRadio ? '' : 'hidden'
                                                    }`}>
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
