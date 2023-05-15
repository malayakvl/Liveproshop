// import Image from 'next/image';
import InputTextDisabled from '../../components/_form/InputTextDisabled';
import { Formik } from 'formik';
import { InputText } from '../_form';
import { TogglePassword } from '../_form';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import getConfig from 'next/config';
import { signIn } from 'next-auth/client';
import { prepareCountriesDropdown } from '../../lib/functions';
import { useEffect, useMemo } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { countriesSelector } from '../../redux/countries/selectors';
import { fetchCountriesAction } from '../../redux/countries/actions';
import { showLoaderAction } from '../../redux/layouts/actions';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/auth`;

export default function SellerRegistration({
    email,
    locale = ''
}: {
    email: any;
    locale?: string;
}) {
    const t = useTranslations();
    const dispatch = useDispatch();
    const countries = useSelector(countriesSelector);

    const preparedCountriesDropdown = useMemo(
        () => prepareCountriesDropdown(countries, locale),
        [countries]
    );

    useEffect(() => {
        dispatch(fetchCountriesAction());
    }, []);

    const validationSchema = Yup.object().shape({
        first_name: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('You must enter your first name')),
        last_name: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('You must enter your family name')),
        country_id: Yup.number().required(t('You must select country')),
        post_code: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('Required field')),
        // state: Yup.string()
        //     .strict(true)
        //     .trim(t('Cannot include leading and trailing spaces'))
        //     .required(t('Required field'))
        //     .min(3, t('State must be at least 3 characters')),
        city: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('Required field'))
            .min(3, t('City must be at least 3 characters')),
        address_line_1: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('Required field'))
            .min(5, t('Address must be at least 5 characters')),
        address_line_2: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces')),
        company_name: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces')),
        identification_number: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces')),
        vat: Yup.string().strict(true).trim(t('Cannot include leading and trailing spaces')),
        phone: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('You must enter your phone number'))
            .min(5, t('Phone must be at least 5 characters')),
        password: Yup.string()
            .strict(true)
            .trim(t('Cannot include leading and trailing spaces'))
            .required(t('Required field'))
            .min(6, t('Password must be at least 6 characters')),
        password_confirmation: Yup.string()
            .required(t('Required field'))
            .oneOf([Yup.ref('password'), null], t('Passwords must match'))
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
                    callbackUrl: `${window.location.origin}/account/plan`
                });
            });
        });
    };
    return (
        <Formik
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={{ email, country_id: undefined }}
            onSubmit={onSubmit}>
            {(props) => (
                <form onSubmit={props.handleSubmit}>
                    <div className="w-96 md:w-full px-6 md:px-12 py-14 my-10 rounded-lg colored-shadow flex flex-col md:flex-row md:flex-rowjustify-center md:w-[996px] bg-white">
                        <div className="pt-5 md:pr-4 md:min-w-[400px] md:border-r">
                            <div className="flex mb-4 items-center">
                                <div className="mr-2.5 font-bold text-3xl line-height-105percent md:mr-0 md:w-full w-60 text-checked">
                                    {t('Your email has been verified!')}
                                </div>
                            </div>

                            <InputTextDisabled name="email" icon="f-email" props={props} />

                            <div className="mb-3 mt-9 text-blue-350 text-sm">
                                {t('Almost there, please')}
                            </div>
                            <div className="mb-10 md:mb-0 text-3xl line-height-105percent font-bold">
                                {t('Complete your profile')}
                            </div>
                        </div>
                        <div className="md:ml-8 w-full">
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
                                icon={'f-company'}
                                style={null}
                                label={null}
                                name={'company_name'}
                                placeholder={t('Company Name')}
                                props={props}
                                tips={null}
                            />
                            <InputText
                                icon={'f-company-id'}
                                style={'w-1/2'}
                                label={null}
                                name={'identification_number'}
                                placeholder={t('Company ID')}
                                props={props}
                                tips={null}
                            />
                            <InputText
                                icon={'f-vat'}
                                style={'w-1/2'}
                                label={null}
                                name={'vat'}
                                placeholder={t('Vat')}
                                props={props}
                                tips={null}
                            />
                            <div className="mb-4">
                                <Select
                                    className={'form-control-dropdown mb-0'}
                                    classNamePrefix={'inventory'}
                                    placeholder={t('Country')}
                                    name="country_id"
                                    options={preparedCountriesDropdown}
                                    value={preparedCountriesDropdown?.find(
                                        (option: any) => option.value === props.values.country_id
                                    )}
                                    onChange={(selectedOption) =>
                                        props.setFieldValue('country_id', selectedOption.value)
                                    }
                                />
                                {props.errors.country_id && (
                                    <div className="error-el">{props.errors.country_id}</div>
                                )}
                            </div>
                            <InputText
                                name={'state'}
                                label={null}
                                icon={'f-location'}
                                placeholder={t('State')}
                                style={null}
                                props={props}
                                tips={null}
                            />

                            <InputText
                                label={null}
                                icon={'f-location'}
                                name={'city'}
                                placeholder={t('City')}
                                style={null}
                                props={props}
                                tips={null}
                            />
                            <InputText
                                label={null}
                                icon={'f-location'}
                                name={'post_code'}
                                placeholder={t('Post Code')}
                                style={'w-1/2'}
                                props={props}
                                tips={null}
                            />
                            <InputText
                                label={null}
                                icon={'f-location'}
                                name={'address_line_1'}
                                placeholder={t('Address Line 1')}
                                style={null}
                                props={props}
                                tips={null}
                            />
                            <InputText
                                label={null}
                                icon={'f-location'}
                                name={'address_line_2'}
                                placeholder={t('Address Line 2')}
                                style={null}
                                props={props}
                                tips={null}
                            />
                            <InputText
                                icon={'f-phone'}
                                style={null}
                                label={null}
                                name={'phone'}
                                placeholder={t('Phone Number')}
                                props={props}
                                tips={null}
                                onChange={(event) => {
                                    event.target.value = event.target.value.replace(
                                        /[^\s\d+()-]+/gm,
                                        ''
                                    );
                                    props.handleChange(event);
                                }}
                            />
                            <TogglePassword
                                icon={'f-key'}
                                style={null}
                                label={null}
                                name={'password'}
                                placeholder={t('Password')}
                                props={props}
                            />
                            <TogglePassword
                                icon={'f-key'}
                                style={'mb-9'}
                                label={null}
                                name={'password_confirmation'}
                                placeholder={t('Confirm password')}
                                props={props}
                            />
                            <div className="border-t pt-9">
                                <button
                                    type="submit"
                                    className="uppercase pt-9 gradient-btn w-full">
                                    {t('Continue')}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
}

export async function getServerSideProps(context: any) {
    const { locale } = context;

    return {
        props: {
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
