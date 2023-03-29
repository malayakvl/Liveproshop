import React, { Fragment, useEffect, useState } from 'react';
import { parseTranslation, toggleModalPopup } from '../../../lib/functions';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
    showChangeSubscriptionSelector,
    userSubscriptionSelector
} from '../../../redux/user/selectors';
import { showChangeSubscriptionFormAction } from '../../../redux/user';
import { updateSubscriptionAction } from '../../../redux/user/actions';
import Image from 'next/image';
import Head from 'next/head';

const ChangeSubscription: React.FC<any> = ({ locale }) => {
    const t = useTranslations();
    const dispatch = useDispatch();
    const showModal = useSelector(showChangeSubscriptionSelector);
    const subscriptionInfo = useSelector(userSubscriptionSelector);
    const [planId, setPlanId] = useState<any>('');
    const [selectedPlanDbId, setSelectedPlanDbId] = useState<any>(null);

    useEffect(() => {
        if (showModal) {
            toggleModalPopup('.modal-seller-change-subscription');
        }
    }, [dispatch, showModal]);

    const parsePlanValues = (plans: any) => {
        const selectedIndex = 5;
        return (
            <>
                {plans.map((option: any, index: number) => (
                    <Fragment key={option.plan.id}>
                        {option.plan.id === selectedPlanDbId && (
                            <>
                                {option.value ? (
                                    <Tick selected={index === selectedIndex} />
                                ) : (
                                    <Tick selected={index === selectedIndex} disabled />
                                )}
                            </>
                        )}
                    </Fragment>
                ))}
            </>
        );
    };

    const parseOptions = (data: any, locale: string) => {
        return (
            <>
                {data.map((data: any) => (
                    <Fragment key={data.option.id}>
                        <div className="space-x-0 lg:space-x-10 flex justify-between lg:justify-end items-stretch">
                            <div className="flex-grow mb-4 text-sm">
                                {parseTranslation(data.option, 'name', locale)}
                            </div>
                            {parsePlanValues(data.values)}
                        </div>
                    </Fragment>
                ))}
            </>
        );
    };

    const Tick = ({
        disabled,
        className,
        selected
    }: {
        disabled?: boolean;
        className?: string;
        selected?: boolean;
    }) => (
        <div
            className={`min-w-[4rem] lg:min-w-[14rem] lg:w-56 
            ${selected ? 'lg:border-l-2 lg:border-r-2 border-orange-450' : 'border-transparent'}
            ${className || ''}`}>
            {!disabled ? (
                <div className="w-4 h-4 lg:w-6 lg:h-6 relative mx-auto">
                    <Image src="/images/tick.svg" layout="fill" />
                </div>
            ) : (
                ' '
            )}
        </div>
    );

    return (
        <>
            <Head>
                <title>Amadeo CRM - {t('Change Plan')}</title>
            </Head>

            <div className="modal modal-seller-change-subscription opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center">
                <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" />
                <div className="modal-container bg-white w-12/12 md:max-w-screen-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                    <div
                        className="modal-content py-4 text-left px-6 overflow-auto"
                        style={{ maxHeight: '90vh' }}>
                        <div className="flex justify-between items-center pb-3">
                            <p className="text-2xl font-bold">{t('Change Plan')}</p>
                            <div
                                className="modal-close cursor-pointer z-50"
                                role="presentation"
                                onClick={() => {
                                    dispatch(showChangeSubscriptionFormAction(false));
                                    toggleModalPopup('.modal-seller-change-subscription');
                                }}>
                                <img
                                    src="/images/close-modal.svg"
                                    className="fill-current text-black"
                                    alt={''}
                                />
                            </div>
                        </div>

                        {/*Body*/}
                        {subscriptionInfo?.id && (
                            <div>
                                <div className="flex flex-col">
                                    {subscriptionInfo.defaultPayment && (
                                        <div className="max-w-[320px] flex">
                                            <select
                                                name="plan_id"
                                                style={{ width: '250px' }}
                                                value={planId}
                                                className="form-control w-full"
                                                onChange={(e) => {
                                                    setPlanId(e.target.value);
                                                    const filteredPlan =
                                                        subscriptionInfo.dbPlans.filter(
                                                            (_plan: any) =>
                                                                _plan.stripe_id === e.target.value
                                                        );
                                                    if (filteredPlan.length) {
                                                        setSelectedPlanDbId(filteredPlan[0].id);
                                                    } else {
                                                        setSelectedPlanDbId(null);
                                                    }
                                                }}>
                                                <option>Select Plan</option>
                                                {subscriptionInfo.dbPlans.map((plan: any) => (
                                                    <Fragment key={plan.stripe_id}>
                                                        {plan.stripe_id !==
                                                            subscriptionInfo.plan.id && (
                                                            <option value={plan.stripe_id}>
                                                                {plan.name}
                                                            </option>
                                                        )}
                                                    </Fragment>
                                                ))}
                                            </select>
                                            <button
                                                className="gradient-btn ml-4"
                                                onClick={() =>
                                                    dispatch(updateSubscriptionAction(planId))
                                                }>
                                                {t('Save')}
                                            </button>
                                        </div>
                                    )}
                                    {!subscriptionInfo?.defaultPayment && (
                                        <p>{t('Add and setup default payment first')}</p>
                                    )}
                                    {subscriptionInfo?.paymentPlanList?.values && selectedPlanDbId && (
                                        <Fragment>
                                            {subscriptionInfo.paymentPlanList.values.map(
                                                (values: any) => (
                                                    <Fragment key={values.group.id}>
                                                        <div className="space-x-0 lg:space-x-10 flex justify-between lg:justify-end items-stretch">
                                                            <div className="flex-grow font-bold text-2xl my-6 sm:mt-4">
                                                                {parseTranslation(
                                                                    values.group,
                                                                    'name',
                                                                    locale
                                                                )}
                                                            </div>
                                                            <div />

                                                            <div />

                                                            <div />
                                                        </div>
                                                        {parseOptions(values.values, locale)}
                                                    </Fragment>
                                                )
                                            )}
                                        </Fragment>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangeSubscription;

export async function getStaticProps({ locale }: any) {
    return {
        props: {
            messages: {
                ...require(`../../../messages/${locale}.json`)
            }
        }
    };
}
