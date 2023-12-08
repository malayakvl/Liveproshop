import Head from 'next/head';
import { getSession } from 'next-auth/client';
import React, { useEffect, Fragment, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckIcon, BanIcon } from '@heroicons/react/solid';
import { showLoaderAction } from '../../redux/layouts/actions';
import { fetchFormAction, fetchStripeProductAction } from '../../redux/paymentPlans';
import { useDispatch, useSelector } from 'react-redux';
import {
    itemsSelector,
    settingsSelector,
    stripeItemsSelector
} from '../../redux/paymentPlans/selectors';
import { parseTranslation } from '../../lib/functions';
import { submitFormAction, syncStripeParameterAction } from '../../redux/paymentPlans/actions';
import ConfirmDialog from '../../components/_common/ConfirmDialog';
import { InputSelect, InputText } from '../../components/_form';
import { Formik } from 'formik';
import * as Yup from 'yup';

export default function Index({ session, locale }: { session: any; locale: any }) {
    if (!session) return <></>;
    const t = useTranslations();
    const dispatch = useDispatch();
    const plans = useSelector(itemsSelector);
    const stripeProducts = useSelector(stripeItemsSelector);
    const settings = useSelector(settingsSelector);

    const [selectedItem, setSelectedItem] = useState<any | null>();
    const [stripeInitData, setStripeInitData] = useState({});
    const [priceDropDown, setPriceDropDown] = useState([]);

    useEffect(() => {
        dispatch(showLoaderAction(true));
        dispatch(fetchFormAction());
        dispatch(fetchStripeProductAction());
    }, []);

    useEffect(() => {
        dispatch(showLoaderAction(false));
        const initValues: any = {};
        if (settings) {
            plans.header.forEach((plan: any) => {
                initValues[`plan_stripe_${plan.id}`] = plan.stripe_id;
            });
            initValues['trial_period'] = settings.trial_period;
            initValues['multisafe_api_key'] = settings.multisafe_api_key;
            initValues['multisafe_account'] = settings.multisafe_account;
            initValues['support_email'] = settings.support_email;
            setStripeInitData(initValues);
        }
    }, [plans?.header?.length, settings]);

    useEffect(() => {
        if (stripeProducts) {
            const priceSelect: any = [];
            stripeProducts.forEach((product: any) => {
                priceSelect.push({ id: product.price[0].id, name: product.name });
            });
            setPriceDropDown(priceSelect);
        }
    }, [stripeProducts]);

    const changeStatus = (planId: number, optionId: number, optionName: any, status: boolean) => {
        setSelectedItem({ status: status, name: optionName, planId: planId, optionId: optionId });
        // dispatch(submitFormAction({ optionId: optionId, planId: planId }));
    };

    const parsePlanValues = (plans: any, optionId: number, optionName: string) => {
        return (
            <>
                {plans.map((option: any) => (
                    <td key={option.plan.id}>
                        <div
                            className="plan-status"
                            role="presentation"
                            onClick={() =>
                                changeStatus(option.plan.id, optionId, optionName, option.value)
                            }>
                            {option.value ? (
                                <CheckIcon width={20} height={20} />
                            ) : (
                                <BanIcon width={20} height={20} />
                            )}
                        </div>
                    </td>
                ))}
            </>
        );
    };

    const parseOptions = (data: any, locale: string) => {
        return (
            <>
                {data.map((data: any) => (
                    <Fragment key={data.option.id}>
                        <tr>
                            <td>{parseTranslation(data.option, 'name', locale)}</td>
                            {parsePlanValues(
                                data.values,
                                data.option.id,
                                parseTranslation(data.option, 'name', locale)
                            )}
                        </tr>
                    </Fragment>
                ))}
            </>
        );
    };

    const handlerConfirm = useCallback(() => {
        if (!selectedItem) return;

        dispatch(
            submitFormAction({ optionId: selectedItem.optionId, planId: selectedItem.planId })
        );
        setSelectedItem(null);
    }, [dispatch, selectedItem]);

    const parseStripeProduct = (planId: number, props: any) => {
        return (
            <>
                <InputSelect
                    options={priceDropDown}
                    label={null}
                    name={`plan_stripe_${planId}`}
                    style={null}
                    props={props}
                />
            </>
        );
    };

    const SubmitSchema = Yup.object().shape({
        trial_period: Yup.number(),
        multisafe_api_key: Yup.string().required(t('Required field')),
        multisafe_account: Yup.string().required(t('Required field')),
        support_email: Yup.string().email(t('Must be a valid email')).required(t('Required field'))
    });

    return (
        <>
            <Head>
                <title>LiveProshop - Payment Plans</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/images/logo-1.svg" />
            </Head>

            <div className="block-white-8 white-shadow-big">
                <div className="page-title">
                    <h1>{t('Payment Plans')}</h1>
                </div>
            </div>
            <div className="block-white-8 mr-10 white-shadow-medium mt-10">
                {plans?.header.length > 0 && stripeProducts && (
                    <div className="w-full md:w-1/2">
                        <Formik
                            enableReinitialize
                            initialValues={stripeInitData}
                            validationSchema={SubmitSchema}
                            onSubmit={(values) => {
                                dispatch(syncStripeParameterAction(values));
                            }}>
                            {(props) => (
                                <form onSubmit={props.handleSubmit} className="mb-4">
                                    <InputText
                                        style={'w-[150px]'}
                                        icon={null}
                                        label={t('Trial period')}
                                        name={'trial_period'}
                                        placeholder={'Trial period'}
                                        props={props}
                                        tips={null}
                                    />

                                    <InputText
                                        style={'w-1/2'}
                                        icon={null}
                                        label={t('Multisafepay API')}
                                        name={'multisafe_api_key'}
                                        placeholder={'Multisafepay API'}
                                        props={props}
                                        tips={null}
                                    />
                                    <InputText
                                        style={'w-1/2'}
                                        icon={null}
                                        label={t('Multisafepay Account')}
                                        name={'multisafe_account'}
                                        placeholder={'Multisafepay Account'}
                                        props={props}
                                        tips={null}
                                    />
                                    <InputText
                                        style={'w-1/2'}
                                        icon={null}
                                        label={t('Support_email')}
                                        name={'support_email'}
                                        placeholder={'Support_email'}
                                        props={props}
                                        tips={null}
                                    />

                                    <table className="float-table w-full md:w-1/2 mt-4">
                                        <tbody>
                                            {plans.header.map((header: any) => (
                                                <tr key={header.id}>
                                                    <td>{header.name}</td>
                                                    <td>{parseStripeProduct(header.id, props)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="mt-6">
                                        <button
                                            className="gradient-btn px-3 py-4 text-white bg-indigo-500 rounded-md
                                    hover:bg-indigo-600
                                    focus:outline-none duration-100 ease-in-out">
                                            {t('Save')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                        <div className="mb-4">
                            {/*<label className="control-label" htmlFor="trial_period">*/}
                            {/*    {t('Tial period')}*/}
                            {/*</label>*/}
                            {/*<div className="relative">*/}
                            {/*    <input*/}
                            {/*        className="form-control"*/}
                            {/*        placeholder={t('Tial period')}*/}
                            {/*        type="text"*/}
                            {/*        onFocus={handleFocus}*/}
                            {/*        onChange={(e) => console.log(e.target.value)}*/}
                            {/*        // value={inputValue || ''}*/}
                            {/*        value={20}*/}
                            {/*        name="trial_period"*/}
                            {/*    />*/}
                            {/*</div>*/}
                        </div>
                        <div className="overflow-x-scroll">
                            <table className="w-full float-table">
                                <thead>
                                    <tr>
                                        <th />
                                        {plans.header.map((header: any) => (
                                            <th key={header.id}>{header.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {plans.values.map((values: any) => (
                                        <Fragment key={values.group.id}>
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="bg-gray-300"
                                                    style={{ paddingLeft: '8px' }}>
                                                    {parseTranslation(values.group, 'name', locale)}
                                                </td>
                                            </tr>
                                            {parseOptions(values.values, locale)}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <ConfirmDialog
                show={!!selectedItem}
                text={t('Are you sure you want to {status} {name} method?', {
                    status: selectedItem?.status ? t('disable') : t('enable'),
                    name: selectedItem?.name
                })}
                titleConfirm={t('Yes')}
                titleCancel={t('Cancel')}
                onConfirm={handlerConfirm}
                onClose={() => setSelectedItem(null)}
            />
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
