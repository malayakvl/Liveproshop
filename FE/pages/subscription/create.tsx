import FullLayout from '../../components/layout/FullLayout';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { providers, getSession, signIn } from 'next-auth/client';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { redirectAfterSubscriptionSelector, userSelector } from '../../redux/user/selectors';
import { useRouter } from 'next/router';
import { PaymentMethodPlan } from '../../components/checkout';
import { addPyamentMethodFromRegisterActions } from '../../redux/user/actions';
import CardValidator from 'card-validator';

export default function ExistSubscription({ locale }: { locale: string }) {
    const dispatch = useDispatch();
    const t = useTranslations();
    const { query } = useRouter();
    const user = useSelector(userSelector);

    const [loginData, setLoginData] = useState<{ email: string; password: string }>();
    const redirectAfter = useSelector(redirectAfterSubscriptionSelector);
    const selectedPlanId = query.planId;

    useEffect(() => {
        if (redirectAfter && user) {
            signIn('credentials_login', {
                email: loginData?.email,
                password: loginData?.password,
                callbackUrl: `${window.location.origin}${
                    locale === 'fr' ? '' : `/${locale}`
                }/dashboard`
            });
        }
    }, [redirectAfter]);

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
            <div className="flex justify-center h-[630px]">
                <div className="rounded-lg border shadow-xl mt-10 flex w-[1000px] bg-white px-20 py-14">
                    <div className="font-bold mt-[170px] pr-12 w-2/4">
                        <div className="text-2xl line-height-105percent mb-9 w-full">
                            {t(
                                'You will not be charged not, but in the end of your 30-day trial period'
                            )}
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
                                        onSubmit={(values, actions) => {
                                            dispatch(
                                                addPyamentMethodFromRegisterActions(
                                                    values,
                                                    selectedPlanId,
                                                    locale
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
            {/*<div className="flex justify-center h-[680px]">*/}
            {/*    <div className="rounded-lg border shadow-xl mt-10 flex w-[1000px] bg-white px-20 py-14">*/}
            {/*        <div className="font-bold mt-8 pr-12 w-2/4">*/}
            {/*            <div className="text-2xl line-height-105percent mb-9 w-full">*/}
            {/*                You will not be charged not, but in the end of your 30-day trial*/}
            {/*                period*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="pl-12 border-l w-2/4">*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}

ExistSubscription.Layout = FullLayout;

export async function getServerSideProps(context: any) {
    const { req, locale } = context;
    const session = await getSession({ req });
    const planId = req.__NEXT_INIT_QUERY.planId ? req.__NEXT_INIT_QUERY.planId : null;
    const type = req.__NEXT_INIT_QUERY.type ? req.__NEXT_INIT_QUERY.type : null;

    // if (session) {
    //     return {
    //         redirect: { destination: '/' }
    //     };
    // }

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
