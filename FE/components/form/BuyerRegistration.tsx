import { Formik } from 'formik';
import Image from 'next/image';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { TogglePassword } from '../_form';
import InputTextDisabled from '../_form/InputTextDisabled';
import getConfig from 'next/config';
import { signIn } from 'next-auth/client';
import { showLoaderAction } from '../../redux/layouts/actions';
import { useDispatch } from 'react-redux';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/auth`;

export default function BuyerRegistration({ email, locale }: { email: string; locale: string }) {
    const t = useTranslations();
    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('Required field'))
            .min(6, t('Password must be at least 6 characters')),
        password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            t('Passwords must match')
        )
    });

    const onSubmit = (values: any) => {
        dispatch(showLoaderAction(true));
        fetch(`${baseUrl}/register?locale=${locale}`, {
            method: 'POST',
            body: JSON.stringify(values),
            headers: { 'Content-Type': 'application/json' }
        }).then((r) => {
            r.json().then(() => {
                signIn('credentials_login', {
                    email: values.email,
                    password: values.password,
                    callbackUrl: `${window.location.origin}/account`
                });
            });
        });
    };

    return (
        <div className="mt-10 rounded-lg border shadow-xl bg-white w-96 p-10 pb-10">
            <div className="flex items-center mb-4">
                <div className="mr-2.5 font-bold text-3xl line-height-105percent w-60">
                    {t('Your email has been verified!')}
                </div>
                <Image src="/images/tick.svg" width="52" height="40" layout="fixed" />
            </div>

            <Formik
                enableReinitialize
                initialValues={{ email }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}>
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <InputTextDisabled name="email" icon="f-email" props={props} />

                        <div className="mt-8 mb-5 font-xs text-sm text-blue-350">
                            {t('Please create a Password')}
                        </div>

                        <TogglePassword
                            icon={'f-key'}
                            style={null}
                            label={null}
                            name={'password'}
                            placeholder={'Password'}
                            props={props}
                        />
                        <TogglePassword
                            icon={'f-key'}
                            style={null}
                            label={null}
                            name={'password_confirmation'}
                            placeholder={'Confirm password'}
                            props={props}
                        />
                        <div className="border-t pt-9">
                            <button type="submit" className="uppercase pt-9 gradient-btn w-full">
                                {t('Continue')}
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
}
