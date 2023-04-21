//Selectors
import { shippingSelector } from '../../../redux/shipping/selectors';
import { countriesSelector } from '../../../redux/countries/selectors';
//Actions
import {
    deleteShippingAction,
    updateShippingAction,
    fetchShippingAction,
    saveShippingAction
} from '../../../redux/shipping/actions';
//Hooks
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//Other
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { InputText } from '../../../components/_form';
import * as Yup from 'yup';
import Head from 'next/head';
import Image from 'next/image';
import { baseApiUrl } from '../../../constants';
import { fetchCountriesAction } from '../../../redux/countries/actions';
import { userSelector } from '../../../redux/user/selectors';
import { getSession } from 'next-auth/client';
import { setErrorToastAction } from '../../../redux/layouts';

export default function EditMethod() {
    const t = useTranslations();
    const router = useRouter();
    const dispatch = useDispatch();
    const countries = useSelector(countriesSelector);
    const shipping = useSelector(shippingSelector);
    const id = router.query.id;
    const user = useSelector(userSelector);
    const deleteCallback = () => {
        const sure = confirm(t('Are you sure ?'));

        if (sure) {
            dispatch(deleteShippingAction(id)).then(router.push('/shipping/list'));
        }
    };

    useEffect(() => {
        dispatch(fetchCountriesAction());
    }, []);

    useEffect(() => {
        if (!id || !user.email) return;
        dispatch(fetchShippingAction(id));
    }, [id, user]);

    if (!shipping || shipping.id != id) {
        return <></>;
    }

    return (
        <>
            <Head>
                <title>
                    LiveProshop - {t('Edit Shipping Method')} - {shipping.name}
                </title>
            </Head>

            <div className="page-title">
                <h1>{t('Edit Shipping Method')}</h1>
            </div>
            <div className="flex mt-10">
                {user.role_id === 3 ? (
                    <Formik
                        enableReinitialize
                        initialValues={{ name: shipping.name, logo: '' }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string()
                                .strict(true)
                                .trim('Name cannot include leading and trailing spaces')
                                .min(3, t('Must be more characters'))
                                .max(20, t('Must be less characters'))
                                .required(t('Required field'))
                        })}
                        onSubmit={(values) => {
                            const formData = new FormData();

                            formData.append('logo', values.logo);
                            formData.append('name', values.name);

                            dispatch(updateShippingAction(id, formData)).then(() =>
                                router.push('/shipping/list')
                            );
                        }}
                        render={(props) => (
                            <form
                                onSubmit={props.handleSubmit}
                                className="p-4 bg-gray-100 rounded-lg shadow-inner mb-6">
                                <label className="text-xs text-blue-350 font-bold">
                                    {t('Method name')}
                                    <InputText
                                        style="mt-4 w-52"
                                        icon={null}
                                        label={null}
                                        name={'name'}
                                        placeholder={'Method Name'}
                                        props={props}
                                        tips={null}
                                    />
                                </label>
                                <label className="block text-xs text-blue-350 font-bold">
                                    <div>{t('Method image')}</div>
                                    <div className="mt-4">
                                        <Image
                                            src={`${baseApiUrl}/${shipping.image}`}
                                            width={60}
                                            height={60}
                                        />
                                    </div>
                                    <input
                                        className="mt-4 w-52"
                                        name="logo"
                                        type="file"
                                        onChange={(event) => {
                                            props.setFieldValue(
                                                'logo',
                                                event.currentTarget.files?.[0]
                                            );
                                        }}
                                    />
                                </label>
                                <button className="mt-8 gradient-btn w-full" type="submit">
                                    {t('Save')}
                                </button>
                                <button
                                    onClick={deleteCallback}
                                    type="button"
                                    className="mt-1 gradient-btn">
                                    {t('Delete')}
                                </button>
                            </form>
                        )}
                    />
                ) : (
                    <div className="ml-8 w-full p-4 bg-gray-100 rounded-lg shadow-inner">
                        <div className="mb-4 font-bold text-gray-350 text-lg py-4 border-b border-gray-200">
                            {t('Apply Countries')}
                        </div>

                        <Formik
                            validationSchema={Yup.object().shape({
                                countries: Yup.array().of(
                                    Yup.object().shape({
                                        id: Yup.number().required(t('Required field')),
                                        price: Yup.number()
                                            .required(t('Required field'))
                                            .test('len', t('Must be less characters'), (item) => {
                                                if (!item) {
                                                    return true;
                                                }

                                                return item?.toString().length < 10;
                                            })
                                            .test(
                                                'is_positive',
                                                'The number must be positive',
                                                (value) => value !== undefined && value > 0
                                            )
                                            .typeError('Price must be number')
                                    })
                                )
                            })}
                            initialValues={{ countries: shipping.countries }}
                            onSubmit={(values) => {
                                let dublicate = false;
                                values.countries.forEach((country: any, index: number) => {
                                    values.countries.forEach((_country: any, _index: number) => {
                                        if (_country.id == country.id && _index !== index) {
                                            dublicate = true;
                                        }
                                    });
                                });

                                if (dublicate) {
                                    dispatch(
                                        setErrorToastAction(
                                            t(`Please remove dublicates from the list`)
                                        )
                                    );
                                    return;
                                }

                                dispatch(saveShippingAction(id, values.countries)).then(() =>
                                    router.push('/shipping/list')
                                );
                            }}
                            render={({ values }) => (
                                <Form>
                                    <FieldArray
                                        name="countries"
                                        render={(arrayHelpers) => (
                                            <div>
                                                {values.countries.map(
                                                    (country: any, index: number) => (
                                                        <div key={index}>
                                                            <div className="w-full my-4 flex items-center justify-start md:w-1/2">
                                                                <div className="w-full">
                                                                    <Field
                                                                        className="form-control"
                                                                        as="select"
                                                                        name={`countries.${index}.id`}>
                                                                        <option value="">
                                                                            ...
                                                                        </option>
                                                                        {countries.map(
                                                                            (country: any) => (
                                                                                <option
                                                                                    key={country.id}
                                                                                    value={
                                                                                        country.id
                                                                                    }>
                                                                                    {
                                                                                        country.nicename
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </Field>
                                                                    <div className="error-el">
                                                                        <ErrorMessage
                                                                            name={`countries.${index}.id`}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <Field
                                                                        className="form-control"
                                                                        name={`countries.${index}.price`}
                                                                        placeholder={'Price'}
                                                                        value={country.price}
                                                                    />
                                                                    <div className="error-el">
                                                                        <ErrorMessage
                                                                            name={`countries.${index}.price`}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        arrayHelpers.remove(index)
                                                                    }
                                                                    className="ml-4 disabled-btn">
                                                                    {t('Delete')}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        arrayHelpers.push({ id: '', price: '' })
                                                    }
                                                    className="gradient-btn">
                                                    {t('Add')}
                                                </button>
                                            </div>
                                        )}
                                    />
                                    {values.countries.length > 0 && (
                                        <button type="submit" className="mt-8 gradient-btn">
                                            {t('Save')}
                                        </button>
                                    )}
                                </Form>
                            )}
                        />
                    </div>
                )}
            </div>
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
                ...require(`../../../messages/${locale}.json`)
            }
        }
    };
}
