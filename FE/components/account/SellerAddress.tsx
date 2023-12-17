import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { InputText } from '../_form';
import { prepareCountriesDropdown } from '../../lib/functions';
import { useState } from 'react';
import { saveAddressSellerAction } from '../../redux/profile';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { countriesSelector } from '../../redux/countries/selectors';
// import { userSelector } from '../../redux/user/selectors';

function SellerAddress({
    locale,
    address,
    country
}: {
    address: any;
    locale: string;
    country: any;
}) {
    const t = useTranslations();
    const dispatch = useDispatch();
    // console.log('CURRENT LOCALE', locale);
    const countries = useSelector(countriesSelector);
    let foundedCountry;
    if (address[4]) {
        foundedCountry = countries.find((item: any) => item.nicename === address[4].trimStart());
    } else {
        foundedCountry = { id: 1, nacename: 'France' };
    }

    const [selectedCountry, setSelectedCountry] = useState({
        label: foundedCountry.nicename ? foundedCountry.nicename : 'France',
        value: foundedCountry.id ? foundedCountry.id : 1
    });
    const addressTmp = {
        city: address[2] ? address[2] : '',
        state: '',
        post_code: address[3] ? address[3] : '',
        country_id: 1,
        address_line_1: address[0] ? address[0] : '',
        address_line_2: address[1] ? address[1] : ''
    };

    const preparedCountriesDropdown = prepareCountriesDropdown(countries, locale);

    const SubmitSchema = Yup.object().shape({
        country_id: Yup.string().required(t('Required field')),
        post_code: Yup.string().required(t('Required field')),
        // address_type: Yup.string().required(t('Required field')),
        city: Yup.string().required(t('Required field')),
        address_line_1: Yup.string().required(t('Required field'))
    });
    return (
        <Formik
            enableReinitialize
            initialValues={addressTmp}
            validationSchema={SubmitSchema}
            onSubmit={(values) => {
                values.country_id = selectedCountry.value;
                // values.address_type = selectedAddressType.value;
                dispatch(saveAddressSellerAction(values));
            }}>
            {(props) => (
                <form onSubmit={props.handleSubmit} className="mt-5">
                    {/*<>*/}
                    {/*    {Object.values(props.errors).map((error) => (*/}
                    {/*        // eslint-disable-next-line react/jsx-key*/}
                    {/*        <div>{error}</div>*/}
                    {/*    ))}*/}
                    {/*</>*/}
                    <div className="mb-4 lg:w-1/4">
                        <Select
                            className={'form-control-dropdown'}
                            classNamePrefix={'inventory'}
                            onChange={(value: any) => {
                                props.values['country_id'] = value.value;
                                setSelectedCountry(value);
                            }}
                            placeholder={t('Country')}
                            name="country_id"
                            value={selectedCountry}
                            options={preparedCountriesDropdown}
                        />
                    </div>

                    <InputText
                        name={'state'}
                        label={null}
                        icon={'f-location'}
                        placeholder={'State'}
                        style={'lg:w-1/4'}
                        props={props}
                        tips={null}
                    />

                    <InputText
                        label={null}
                        icon={'f-location'}
                        name={'post_code'}
                        placeholder={'Post Code'}
                        style={'lg:w-1/4'}
                        props={props}
                        tips={null}
                    />

                    {/*<div className="mb-4 lg:w-1/4">*/}
                    {/*    <Select*/}
                    {/*        className={'form-control-dropdown'}*/}
                    {/*        classNamePrefix={'inventory'}*/}
                    {/*        placeholder={t('Country')}*/}
                    {/*        name="country_id"*/}
                    {/*        options={addressTypeData}*/}
                    {/*        onChange={(value: any) => setSelectedAddressType(value)}*/}
                    {/*        value={selectedAddressType}*/}
                    {/*    />*/}
                    {/*</div>*/}

                    <InputText
                        label={null}
                        icon={'f-location'}
                        name={'city'}
                        placeholder={'City'}
                        style={'lg:w-1/4'}
                        props={props}
                        tips={null}
                    />

                    <InputText
                        label={null}
                        icon={'f-location'}
                        name={'address_line_1'}
                        placeholder={'Address Line 1'}
                        style={'lg:w-1/4'}
                        props={props}
                        tips={null}
                    />

                    <InputText
                        label={null}
                        icon={'f-location'}
                        name={'address_line_2'}
                        placeholder={'Address Line 2'}
                        style={'lg:w-1/4'}
                        props={props}
                        tips={null}
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

export default SellerAddress;
