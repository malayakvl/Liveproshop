import { useTranslations } from 'next-intl';
import * as Yup from 'yup';
import { TogglePassword } from '../_form';
import { Formik } from 'formik';
import { getSession } from 'next-auth/client';
import { useDispatch } from 'react-redux';
import { changePasswordAction } from '../../redux/profile';

export default function Password() {
    const t = useTranslations();
    const dispatch = useDispatch();

    const SubmitSchema = Yup.object().shape({
        password: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('Required field'))
            .min(6, t('Password must be at least 6 characters')),
        password_confirmation: Yup.string()
            .required(t('Required field'))
            .oneOf([Yup.ref('password'), null], t('Passwords must match'))
    });
    return (
        <Formik
            enableReinitialize
            initialValues={{}}
            validationSchema={SubmitSchema}
            onSubmit={(values) => {
                dispatch(changePasswordAction(values));
            }}>
            {(props) => (
                <form onSubmit={props.handleSubmit} className="mt-5 w-full">
                    {/*<TogglePassword name={'old_password'} label={'Current Password'} props={props}  />*/}

                    <TogglePassword
                        label={null}
                        icon={'f-key'}
                        name={'password'}
                        placeholder={'New Password'}
                        style=""
                        props={props}
                    />

                    <TogglePassword
                        label={null}
                        icon={'f-key'}
                        name={'password_confirmation'}
                        placeholder={'Confirm Password'}
                        style=""
                        props={props}
                    />
                    <div className="mt-10 mb-7 block border border-gray-180 border-b-0" />
                    <button type="submit" className="gradient-btn">
                        {t('Save')}
                    </button>
                </form>
            )}
        </Formik>
    );
}

export async function getServerSideProps(context: any) {
    const { req, locale } = context;
    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: { destination: `/${locale === 'fr' ? '' : `${locale}/`}auth/signin` }
        };
    }

    return {
        props: {
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
