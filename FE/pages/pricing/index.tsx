import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Router from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clientSecretSelector, userSelector } from '../../redux/user/selectors';
import { session } from 'next-auth/client';
import { showLoaderAction } from '../../redux/layouts/actions';
import { fetchFormAction, requestDemoAction } from '../../redux/paymentPlans';
import { itemsSelector } from '../../redux/paymentPlans/selectors';
import { formatCurrency, parseTranslation } from '../../lib/functions';
import FullLayout from '../../components/layout/FullLayout';
import { skipExistUserSubscriptionAction } from '../../redux/user';
import { InputText } from '../../components/_form';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

type PriceProps = {
    planId: number;
    name: string;
    price: number;
    desc: string;
    sale: number;
    buttonText: string;
    imageSrc: string;
    disabled?: boolean;
    selected: boolean;
    onClick: any;
    session: any;
};

const Price = ({
    planId,
    name,
    price,
    desc,
    sale,
    buttonText,
    imageSrc,
    disabled,
    selected
}: PriceProps) => {
    const t = useTranslations();
    const user = useSelector(userSelector);
    return (
        <div
            className={`lg:w-56 p-2 lg:p-4 flex flex-col border-2 lg:border-b-0 ${
                selected ? 'rounded-xl lg:rounded-b-none border-orange-450' : 'border-transparent'
            }`}>
            <div className="w-full h-32 lg:h-64 relative mx-auto">
                <Image src={imageSrc} layout="fill" className="object-contain object-center" />
            </div>
            <div className="font-bold text-xl mb-2 flex flex-wrap items-center justify-center lg:justify-between">
                {name}
                {name === 'Business' && (
                    <div className="text-[10px] border border-orange-450 rounded-lg p-1 text-orange-450">
                        {t('Most popular')}
                    </div>
                )}
            </div>
            <div className="h-full text-sm">{desc}</div>
            <div className="text-2xl lg:text-4xl font-bold min-h-[6rem]">
                {formatCurrency(price)}
                <span className="text-base"> /month</span>
                {sale > 0 && <div className="text-xs font-bold">{sale}% of sale</div>}
            </div>

            <button
                onClick={() => {
                    if (user?.email) {
                        Router.push(`/subscription?planId=${planId}`);
                    } else {
                        Router.push(`/auth/subscription?planId=${planId}`);
                    }
                }}
                className={`${
                    disabled ? 'disabled-btn' : 'gradient-btn'
                } w-full mt-7 justify-self-end`}>
                {buttonText}
            </button>

            {/*<button*/}
            {/*    onClick={() => {*/}
            {/*        if (user?.email) {*/}
            {/*            Router.push(`/subscription?planId=${planId}&type=trial`);*/}
            {/*        } else {*/}
            {/*            Router.push(`/auth/subscription?planId=${planId}&type=trial`);*/}
            {/*        }*/}
            {/*    }}*/}
            {/*    className={`${*/}
            {/*        disabled ? 'disabled-btn' : 'gradient-btn'*/}
            {/*    } w-full mt-7 justify-self-end`}>*/}
            {/*    {t('Select Trial')}*/}
            {/*</button>*/}
        </div>
    );
};

export default function Pricing({ locale }: { locale: any }) {
    const t = useTranslations();
    const [selected, setSelected] = useState('business');
    const dispatch = useDispatch();
    const plans = useSelector(itemsSelector);
    const user = useSelector(userSelector);
    const [showTrial, setShowTrial] = useState(true);
    const stripeClientSecret = useSelector(clientSecretSelector);

    const [success, setSuccess] = useState(false);

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

    useEffect(() => {
        dispatch(showLoaderAction(true));
        dispatch(fetchFormAction());
    }, []);

    useEffect(() => {
        if (user.email) {
            if (user.status) {
                setShowTrial(false);
            }
        }
    }, [user?.email]);

    useEffect(() => {
        if (stripeClientSecret) {
            Router.push(`/subscription?type=trial&planId=1`);
        }
    }, [stripeClientSecret]);

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

    const parsePlanValues = (plans: any) => {
        const selectedIndex = selected === 'basic' ? 0 : selected === 'business' ? 1 : 2;
        return (
            <>
                {plans.map((option: any, index: number) => (
                    <Fragment key={option.plan.id}>
                        {option.value ? (
                            <Tick selected={index === selectedIndex} />
                        ) : (
                            <Tick selected={index === selectedIndex} disabled />
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
                            <div className="flex-grow mb-4">
                                {parseTranslation(data.option, 'name', locale)}
                            </div>
                            {parsePlanValues(
                                data.values
                                // data.option.id,
                                // parseTranslation(data.option, 'name', locale)
                            )}
                        </div>
                    </Fragment>
                ))}
            </>
        );
    };

    return (
        <>
            <Head>
                <title>LiveProshop - Pricing</title>
            </Head>

            <div className="text-gray-350 font-medium max-w-[1440px] mx-auto px-5 my-12 lg:my-16">
                <div className="text-center">
                    <div className="text-xs font-bold">{t('Pricing_And_Plans')}</div>
                    <div className="mb-3 font-bold text-4xl">
                        {t('Pricing that fits your size')}
                    </div>
                    <div>
                        {t('Pricing built for businesses of all sizes.')}{' '}
                        <b>{t("Always know what you'll pay.")}</b>
                    </div>
                </div>

                <div className="underline text-center mt-8 lg:mt-10">
                    {showTrial && (
                        <Fragment>
                            {user?.email && (
                                <span
                                    className="cursor-pointer"
                                    role="presentation"
                                    onClick={() => {
                                        dispatch(
                                            skipExistUserSubscriptionAction(
                                                `${window.location.origin}/dashboard`,
                                                locale
                                            )
                                        );
                                    }}>
                                    {t('Skip for now')}
                                </span>
                            )}
                            {!user?.email && (
                                <Link href="/auth/signup">
                                    <a>{t('Skip for now')}</a>
                                </Link>
                            )}
                        </Fragment>
                    )}
                </div>

                <div className="lg:space-x-10 flex justify-end items-stretch text-center lg:text-left mt-8 lg:mt-10">
                    <Price
                        planId={1}
                        onClick={() => setSelected('basic')}
                        name={t('Basic')}
                        selected={selected === 'basic'}
                        price={49}
                        desc={t('Best for live retailers that are small or starting out')}
                        sale={0}
                        session={session}
                        buttonText="Select"
                        imageSrc={'/images/box.png'}
                    />
                    <Price
                        planId={2}
                        onClick={() => setSelected('business')}
                        name={t('Business')}
                        selected={selected === 'business'}
                        price={99}
                        desc={t('Best for live retailers selling more than 5,000€ monthly')}
                        session={session}
                        sale={5}
                        buttonText="Select"
                        imageSrc={'/images/store.png'}
                    />
                    <Price
                        planId={3}
                        onClick={() => false}
                        selected={selected === 'platinum'}
                        disabled
                        name={t('Platinum')}
                        price={139}
                        session={session}
                        buttonText="Soon"
                        desc={t('Best for retailers with sales over 50,000€ monthly')}
                        sale={3}
                        imageSrc={'/images/briefcase.png'}
                    />
                </div>

                <div className="text-xs lg:text-sm">
                    {plans.values.map((values: any) => (
                        <Fragment key={values.group.id}>
                            <div className="space-x-0 lg:space-x-10 flex justify-between lg:justify-end items-stretch">
                                <div className="flex-grow font-bold text-2xl my-6 sm:mt-4">
                                    {parseTranslation(values.group, 'name', locale)}
                                </div>
                                <div
                                    className={`min-w-[4rem] sm:min-w-[14rem] sm:w-56 relative p-3 sm:hidden ${
                                        selected === 'basic'
                                            ? 'sm:border-l-2 sm:border-r-2 border-orange-450'
                                            : 'border-transparent'
                                    }`}>
                                    <Image
                                        src={'/images/box.png'}
                                        layout="responsive"
                                        width="36"
                                        height="36"
                                        className="object-contain object-center"
                                    />
                                </div>

                                <div
                                    className={`min-w-[4rem] sm:min-w-[14rem] sm:w-56 p-3 relative sm:hidden ${
                                        selected === 'business'
                                            ? 'sm:border-l-2 sm:border-r-2 border-orange-450'
                                            : 'border-transparent'
                                    }`}>
                                    <Image
                                        src={'/images/store.png'}
                                        layout="responsive"
                                        width="36"
                                        height="36"
                                        className="object-contain object-center"
                                    />
                                </div>

                                <div
                                    className={`min-w-[4rem] sm:min-w-[14rem] sm:w-56 p-3 relative sm:hidden ${
                                        selected === 'platinum'
                                            ? 'sm:border-l-2 sm:border-r-2 border-orange-450'
                                            : 'border-transparent'
                                    }`}>
                                    <Image
                                        src={'/images/briefcase.png'}
                                        layout="responsive"
                                        width="36"
                                        height="36"
                                        className="object-contain object-center"
                                    />
                                </div>
                                <Tick
                                    disabled
                                    selected={selected === 'basic'}
                                    className="hidden sm:block"
                                />
                                <Tick
                                    disabled
                                    selected={selected === 'business'}
                                    className="hidden sm:block"
                                />
                                <Tick
                                    disabled
                                    selected={selected === 'platinum'}
                                    className="hidden sm:block"
                                />
                            </div>
                            {parseOptions(values.values, locale)}
                        </Fragment>
                    ))}

                    <div className="space-x-0 lg:space-x-10 flex justify-between lg:justify-end items-stretch">
                        <div className="flex-grow font-bold text-2xl mb-4 lg:mt-8 mt-0">{''}</div>

                        <div
                            className={`min-w-[4rem] lg:min-w-[14rem] lg:w-56 w-3 ${
                                selected === 'basic'
                                    ? 'lg:border-2 lg:border-t-0 lg:rounded-b-xl border-orange-450'
                                    : 'border-transparent'
                            }`}
                        />

                        <div
                            className={`min-w-[4rem] lg:min-w-[14rem] lg:w-56 w-3 ${
                                selected === 'business'
                                    ? 'lg:border-2 lg:border-t-0 lg:rounded-b-xl border-orange-450'
                                    : 'border-transparent'
                            }`}
                        />

                        <div
                            className={`min-w-[4rem] lg:min-w-[14rem] lg:w-56 w-3 ${
                                selected === 'platinum'
                                    ? 'lg:border-2 lg:border-t-0 lg:rounded-b-xl border-orange-450'
                                    : 'border-transparent'
                            }`}
                        />
                    </div>
                </div>

                <div className="">
                    <div className="space-x-10 flex" />
                </div>

                <div className="mt-16 lg:mt-28 text-center">
                    <div className="text-xs font-bold">{t('Support')}</div>
                    <div className="mb-3 font-bold text-4xl">{t('Frequently asked questions')}</div>
                    <div>
                        {t(
                            'Have some questions before you get started? Check out our FAQ below. If you still have questions, book a call with one of our experts'
                        )}
                    </div>
                </div>

                <div className="w-full mt-12 lg:mt-16 mb-20 lg:mb-28 grid grid-cols-1 gap-x-2 gap-y-12 md:grid-cols-2 lg:gap-x-4 lg:gap-y-16 lg:grid-cols-3">
                    <div>
                        <div className="font-bold mb-6 text-lg">
                            {t('What is the differens between plans ?')}
                        </div>
                        <div className="text-blue-350 text-base">
                            {t(
                                'The differences between the two plans are:The monthly cost and commission rate. The Basic Plan is $49/month + 5% of sales, and the Business Plan is $149/month + 3% of sales.'
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold mb-6 text-lg">
                            {t(
                                'Does CommentSold integrate with Shopify/How does the Shopify integration work?'
                            )}
                        </div>
                        <div className="text-blue-350 text-base">
                            {t(
                                'The Shopify Integration allows you to have the same products & inventory on both Shopify & CommentSold. If you sell on one platform, it’ll update the inventory on the other platform as well.'
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold mb-6 text-lg">
                            {t('How do I cancel my account')}
                        </div>
                        <div className="text-blue-350 text-base">
                            {t(
                                'You will need to log into your CommentSold dashboard and submit a formal request through chat with our Customer Success Team by clicking the green icon in the bottom right.'
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold mb-6 text-lg">
                            {t('How does the free trial work?')}
                        </div>
                        <div className="text-blue-350 text-base">
                            {t(
                                'The trial period will give you access to all CommentSold features for 30 days before charging for the plan you choose when you register. You can cancel at any time before then to avoid the charge. (This does not include the transaction fees)'
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold mb-6 text-lg">
                            {t('I’m just starting my business - Which plan should I get?')}
                        </div>
                        <div className="text-blue-350 text-base">
                            {t(
                                'We recommend the Basic Plan if you are just starting your business, which is $49/month + 5% of sales. If you end up growing your business you can always change to the Business Plan at any time.'
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold mb-6 text-lg">
                            {t(
                                'Do you integrate with other website providers (Wix, Square Online, GoDaddy, etc)'
                            )}
                        </div>
                        <div className="text-blue-350 text-base">
                            {t(
                                'CommentSold does not integrate with other website hosts. However, all of our plans come with customizable website called the CommentSold Webstore.'
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold mb-6 text-lg">
                            {t('Is CommentSold available in Canada?')}
                        </div>
                        <div className="text-blue-350 text-base">
                            {t(
                                'At this time, CommentSold does not offer services outside of the United States. However, we do plan to expand outside of the US in the future, so stay tuned! If you’d like to follow along with CommentSold updates to see when we expand to Canada, you can subscribe to our Company blog or follow us on Facebook.'
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold mb-6 text-lg">
                            {t('Do you integrate with a POS system?')}
                        </div>
                        <div className="text-blue-350 text-base">
                            {t(
                                'We do not currently integrate with a POS system. However, we are working towards this!  If you’d like to follow along with CommentSold updates, you can subscribe to our Company blog or follow us on Facebook.We do integrate with Shopify. Shopify has the integration for some POS systems, which makes it a great workaround in the meantime.'
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold mb-6 text-lg">
                            {t('How does the Facebook integration work?')}
                        </div>
                        <div className="text-blue-350 text-base">
                            {t(
                                'The Facebook integration will allow you to sell directly on Facebook through social media comments. Once your customer registers, all they have to do is comment sold + the identifier number, our system will pick it up. The software will send them an email or Facebook Messenger message where they can view their cart and check out.'
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <div className="font-bold text-5xl">{t('Try it for free today!')}</div>
                    <div className="font-semibold text-3xl">
                        {t('It only takes 30 second to get started')}
                    </div>
                </div>
                {success ? (
                    <div className="mt-8 mb-16 font-bold text-2xl text-center text-green-500">
                        {t('Your request has been sent')}
                    </div>
                ) : (
                    <Formik
                        initialValues={{}}
                        validationSchema={validationSchema}
                        onSubmit={handlerSubmit}>
                        {(props) => (
                            <Form className="flex flex-wrap justify-center align-middle lg:flex-nowrap lg:max-w-2xl mt-8 mb-16 mx-auto">
                                <InputText
                                    style={'h-14 text-lg w-full'}
                                    icon={'f-email'}
                                    label={null}
                                    name={'email'}
                                    placeholder={t('Enter contact email')}
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
        </>
    );
}

{
    /* <input
            className="form-control i-email icon-close h-14"
            placeholder={t('Enter contact email')}
            type="text"
        />
        <button className="lg:ml-5 gradient-btn h-14 w-full lg:max-w-max mt-4 lg:mt-0">
            <span className="text-lg">{t('Demandez use demo')}</span>
        </button> */
}
{
    /* </div> */
}
export async function getServerSideProps(context: any) {
    const { locale } = context;
    // const session = await getSession(context);

    // if (!session) {
    //     return {
    //         redirect: { destination: `/${locale === 'fr' ? '' : `${locale}/`}auth/signin` }
    //     };
    // }

    return {
        props: {
            // session,
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}

Pricing.Layout = FullLayout;

// Pricing.Layout = ({ children }: { children: any }) => {
//     const user = useSelector(userSelector);
//     const [session] = useSession();
//     console.log('USER SESSION', session);
//     console.log('USER ', user);
//     return children;
// };
