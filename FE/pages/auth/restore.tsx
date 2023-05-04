import { getSession } from 'next-auth/client';
import { useTranslations } from 'next-intl';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { restorePasswordAction, setValidEmailStatusAction } from '../../redux/profile';
import { InputText } from '../../components/_form';
import { useDispatch, useSelector } from 'react-redux';
import { validEmailSelector } from '../../redux/profile/selectors';
import { useEffect } from 'react';
import FullLayout from '../../components/layout/FullLayout';
import Head from 'next/head';
import Image from 'next/image';
import { setSuccessToastAction, setErrorToastAction } from '../../redux/layouts';

function Restore({ locale }: { locale: string }) {
    const t = useTranslations();
    const dispatch = useDispatch();
    const validEmail = useSelector(validEmailSelector);

    useEffect(() => {
        if (validEmail === 'yes') {
            dispatch(setSuccessToastAction(t(`Check your email`)));
            // alertService.success(t(`Check your email`), { keepAfterRouteChange: true });
        } else if (validEmail && validEmail !== 'yes') {
            dispatch(setErrorToastAction(t(`No registered email`)));
            // alertService.error(t(`No registered email`), { keepAfterRouteChange: true });
        }
        dispatch(setValidEmailStatusAction(null));
    }, [dispatch, locale, validEmail, t]);

    const SubmitSchema = Yup.object().shape({
        email: Yup.string().email(t('Must be a valid email')).required(t('Required field'))
    });

    return (
        <>
            <Head>
                <title>LiveProshop - Restore Password</title>
            </Head>

            <div className="flex justify-center">
                <div className="rounded-lg border shadow-xl mt-10 bg-white w-96 p-10 pb-16">
                    <div className="flex">
                        <div className="font-bold text-3xl line-height-105percent mb-2">
                            Forgot your Password?
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

                    <div className="text-sm mb-10">
                        No problem! just write your associated email and we will send you a recovery
                        link.
                    </div>

                    <Formik
                        initialValues={{ email: '' }}
                        validationSchema={SubmitSchema}
                        onSubmit={(values) => {
                            dispatch(restorePasswordAction(values, locale));
                        }}>
                        {(props) =>
                            validEmail === 'yes' ? (
                                <div className="mb-4 font-bold text-2xl line-height-105percent text-green-500">
                                    {t('We send you recovery link, please check your mailbox')}
                                </div>
                            ) : (
                                <form onSubmit={props.handleSubmit}>
                                    <InputText
                                        style={null}
                                        icon={'f-email'}
                                        label={null}
                                        name={'email'}
                                        placeholder={'Email'}
                                        props={props}
                                        tips={null}
                                    />

                                    <button
                                        type="submit"
                                        disabled={props.isSubmitting}
                                        className="mt-6 gradient-btn w-full">
                                        Send me a Recovery Link
                                    </button>
                                </form>
                            )
                        }
                    </Formik>
                </div>
            </div>
        </>
    );
}
Restore.Layout = FullLayout;

export default Restore;

export async function getServerSideProps(context: any) {
    const { req, locale } = context;
    const session = await getSession({ req });
    if (session) {
        return {
            redirect: { destination: `/${locale === 'fr' ? '' : locale}` }
        };
    }
    return {
        props: {
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
