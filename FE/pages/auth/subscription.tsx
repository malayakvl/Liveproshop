import FullLayout from '../../components/layout/FullLayout';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { providers, getSession, signIn } from 'next-auth/client';
import { Field, Formik, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { setRedirectAfterSubscription } from '../../redux/user';
import { createUserFromSubscriptionAction } from '../../redux/user';
import {
    userForFreeSelector,
    userSubscriptionSelector,
    redirectAfterSubscriptionSelector
} from '../../redux/user/selectors';
import { InputPassword, InputText } from '../../components/_form';
import { useRouter } from 'next/router';
import { PaymentMethodPlan } from '../../components/checkout';
import { addPyamentMethodFromSubscriptionActions } from '../../redux/user/actions';
import CardValidator from 'card-validator';

export default function Signup({
    planId,
    type,
    locale
}: {
    planId: number;
    type: string | null;
    locale: string;
}) {
    const dispatch = useDispatch();
    const t = useTranslations();
    const subscription = useSelector(userSubscriptionSelector);
    const { query } = useRouter();
    const forFree = useSelector(userForFreeSelector);
    const redirectAfter = useSelector(redirectAfterSubscriptionSelector);

    const [loginData, setLoginData] = useState<{ email: string; password: string }>();
    const [hideForm, setHideForm] = useState(false);

    useEffect(() => {
        if (redirectAfter) {
            dispatch(setRedirectAfterSubscription(false));
            signIn('credentials_login', {
                email: loginData?.email,
                password: loginData?.password,
                callbackUrl: `${window.location.origin}${
                    locale === 'fr' ? '' : `/${locale}`
                }/dashboard`
            });
        }
    }, [redirectAfter]);

    useEffect(() => {
        if (subscription) {
            if (subscription.status === 'trialing') {
                setHideForm(true);
            } else {
                setHideForm(true);
            }
        }
    }, [subscription]);

    const validationSchema = Yup.object().shape({
        first_name: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('You must enter your first name')),
        last_name: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('You must enter your family name')),
        email: Yup.string().email(t('Must be a valid email')).required(t('Required field')),
        acceptTerms: Yup.bool().oneOf([true], t('Accept Terms is required')),
        password: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('Required field'))
            .min(6, t('Password must be at least 6 characters')),
        password_confirmation: Yup.string()
            .required(t('Required field'))
            .oneOf([Yup.ref('password'), null], t('Passwords must match'))
    });

    const validationSchemaCard = Yup.object({
        card_number: Yup.string()
            .strict(true)
            .when('paymentMethod', {
                is: (val: string) => val === 'card',
                then: Yup.string()
                    .test(
                        'test-card-number',
                        t('Credit card number is invalid'),
                        (value) => CardValidator.number(value).isValid
                    ) // return true false based on validation
                    .required(t('Required field'))
                // otherwise: Yup.required(),
            }),
        card_expire_date: Yup.string()
            .strict(true)
            .when('paymentMethod', {
                is: (val: string) => val === 'card',
                then: Yup.string()
                    .test(
                        'test-card-exp',
                        t('Credit card expiration date is invalid'),
                        (value) => CardValidator.expirationDate(value).isValid
                    )
                    .required(t('Required field'))
            }),
        card_ccv: Yup.string()
            .strict(true)
            .when('paymentMethod', {
                is: (val: string) => val === 'card',
                then: Yup.string()
                    .test(
                        'test-card-ccv',
                        t('Credit card CCV is invalid'),
                        (value) => CardValidator.cvv(value).isValid
                    )
                    .required(t('Required field'))
            })
    });

    return (
        <div className="flex main-bg justify-center">
            <div>
                {/*{!hideForm && (*/}
                {!hideForm && (
                    <div className="mt-10 rounded-lg colored-shadow bg-white w-96 p-10 pb-24">
                        <div className="mb-8 font-bold text-3xl line-height-105percent">
                            {t('Please sign into your account')}
                        </div>
                        <Formik
                            enableReinitialize
                            initialValues={{
                                first_name: '',
                                last_name: '',
                                password: '',
                                password_confirmation: '',
                                email: '',
                                acceptTerms: false,
                                forFree: forFree ? 'yes' : 'no',
                                planId: planId
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                setLoginData({ email: values.email, password: values.password });
                                dispatch(createUserFromSubscriptionAction(values, planId, type));
                            }}>
                            {(props) => (
                                <form onSubmit={props.handleSubmit} className="mb-4">
                                    <InputText
                                        icon={'f-fname'}
                                        style={null}
                                        label={null}
                                        name={'first_name'}
                                        placeholder={t('Name')}
                                        props={props}
                                        tips={null}
                                    />
                                    <InputText
                                        icon={'f-lname'}
                                        style={null}
                                        label={null}
                                        name={'last_name'}
                                        placeholder={t('Surname')}
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

                                    <InputPassword
                                        style={null}
                                        icon={'f-password'}
                                        label={null}
                                        name={'password'}
                                        placeholder={'Password'}
                                        props={props}
                                    />

                                    <InputPassword
                                        style={null}
                                        icon={'f-password'}
                                        label={null}
                                        name={'password_confirmation'}
                                        placeholder={'Confirm Password'}
                                        props={props}
                                    />

                                    <div className="text-gray-450 flex items-center mb-5">
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
                                        className="error-el block"
                                    />
                                    <div className="mb-6">
                                        <button
                                            className="gradient-btn w-full px-3 py-4 text-white bg-indigo-500 rounded-md
                                    hover:bg-indigo-600
                                    focus:outline-none duration-100 ease-in-out">
                                            {t('Login')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                )}
                {hideForm && (
                    <div className="flex justify-center h-[630px]">
                        <div className="rounded-lg border shadow-xl mt-10 flex w-[1000px] bg-white px-20 py-14">
                            <div className="font-bold mt-[170px] pr-12 w-2/4">
                                <div className="text-2xl line-height-105percent mb-9 w-full">
                                    You will not be charged not, but in the end of your 30-day trial
                                    period
                                </div>
                            </div>

                            <div className="pl-12 border-l w-2/4">
                                <>
                                    <div className="flex mb-14">
                                        <div>
                                            <Formik
                                                // enableReinitialize
                                                initialValues={{
                                                    card_ccv: '',
                                                    card_expire_date: '',
                                                    card_number: ''
                                                }}
                                                validationSchema={validationSchemaCard}
                                                onSubmit={(values) => {
                                                    dispatch(
                                                        addPyamentMethodFromSubscriptionActions(
                                                            values
                                                        )
                                                    );
                                                    // actions.setSubmitting(false);
                                                }}>
                                                <Form>
                                                    <div className="flex flex-wrap justify-between">
                                                        <div className="flex-auto lg:flex-1">
                                                            <div className="text-2xl font-bold text-gray-350 mb-6">
                                                                {t('Add Payment Method')}
                                                            </div>
                                                            <PaymentMethodPlan />
                                                        </div>
                                                    </div>
                                                    <button className="gradient-btn mt-4">
                                                        {t('Add Card & Continue')}
                                                    </button>
                                                </Form>
                                            </Formik>
                                        </div>
                                    </div>
                                </>
                            </div>
                        </div>
                    </div>
                )}
                <div className="error-el">{query.message}</div>
            </div>
        </div>
    );
}

Signup.Layout = FullLayout;

export async function getServerSideProps(context: any) {
    const { req, locale } = context;
    const session = await getSession({ req });
    const planId = req.__NEXT_INIT_QUERY.planId ? req.__NEXT_INIT_QUERY.planId : null;
    const type = req.__NEXT_INIT_QUERY.type ? req.__NEXT_INIT_QUERY.type : null;

    if (session) {
        return {
            redirect: { destination: '/' }
        };
    }

    return {
        props: {
            providers: await providers(),
            locale: locale,
            planId,
            type,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
