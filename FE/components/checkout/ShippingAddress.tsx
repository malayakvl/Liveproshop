import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { useFormikContext } from 'formik';
import { useTranslations } from 'next-intl';
import { countriesSelector } from '../../redux/countries/selectors';
import {
    orderCheckoutSelector,
    firstShippingMethodCheckoutSelector,
    addressCheckoutSelector
} from '../../redux/checkout/selectors';
import { userSelector } from '../../redux/user/selectors';
import { fetchCountriesAction } from '../../redux/countries/actions';
import { fetchShippingMethodsByCountryCheckoutAction } from '../../redux/checkout';

import { prepareCountriesDropdown } from '../../lib/functions';
import { InputText } from '../_form';

const ShippingAddress = ({ locale }: { locale: string }) => {
    const t = useTranslations();
    const dispatch = useDispatch();

    const props = useFormikContext<any>();

    const countries = useSelector(countriesSelector);
    const order = useSelector(orderCheckoutSelector);
    const firstShippingMethod = useSelector(firstShippingMethodCheckoutSelector);
    const user = useSelector(userSelector);
    const address = useSelector(addressCheckoutSelector);

    const preparedCountriesDropdown = useMemo(
        () => prepareCountriesDropdown(countries, locale),
        [countries, locale]
    );

    useEffect(() => {
        dispatch(fetchCountriesAction());
    }, []);

    useEffect(() => {
        if (order && order.id) {
            props.values.first_name = order.buyer_first_name || props.values.first_name;
            props.values.last_name = order.buyer_last_name || props.values.last_name;
            props.values.phone = order.phone || props.values.phone;
            props.values.country_id = order.country_id || props.values.country_id;
            props.values.state = order.state || props.values.state;
            props.values.post_code = order.post_code || props.values.post_code;
            props.values.city = order.city || props.values.city;
            props.values.shipping_address = order.shipping_address || props.values.shipping_address;
        }
    }, [order]);

    useEffect(() => {
        if (user && user.id) {
            props.values.first_name = props.values.first_name || user.first_name;
            props.values.last_name = props.values.last_name || user.last_name;
            props.values.phone = props.values.phone || user.phone;
        }
    }, [user]);

    useEffect(() => {
        if (address && address.id) {
            props.values.country_id = props.values.country_id || address.country_id;
            props.values.post_code = props.values.post_code || address.post_code;
            props.values.state = props.values.state || address.state;
            props.values.city = props.values.city || address.city;
            props.values.shipping_address =
                props.values.shipping_address ||
                address.address_line_1 + ' ' + address.address_line_2;
        }
    }, [address]);

    useEffect(() => {
        if (firstShippingMethod && firstShippingMethod.id) {
            props.setFieldValue('shippingMethodId', String(firstShippingMethod.id), false);
        }
    }, [firstShippingMethod]);

    return (
        <div className="grid grid-cols-2 gap-2 lg:gap-4">
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
                icon={'f-phone'}
                style={'col-span-2'}
                label={null}
                name={'phone'}
                placeholder={t('Phone Number')}
                props={props}
                tips={null}
                onChange={(event) => {
                    event.target.value = event.target.value.replace(/[^\s\d+()-]+/gm, '');
                    props.handleChange(event);
                }}
            />

            <div className="">
                <Select
                    className={'form-control-dropdown mb-2'}
                    classNamePrefix={'inventory'}
                    placeholder={t('Country')}
                    name="country_id"
                    options={preparedCountriesDropdown}
                    value={preparedCountriesDropdown?.find(
                        (option: any) => option.value === props.values.country_id
                    )}
                    onChange={(selectedOption) => {
                        props.setFieldValue('country_id', selectedOption.value, false);
                        dispatch(
                            fetchShippingMethodsByCountryCheckoutAction(
                                order.id,
                                selectedOption.value
                            )
                        );
                    }}
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
                style={null}
                props={props}
                tips={null}
            />

            <InputText
                label={null}
                icon={'f-location'}
                // name={'address_line_1'}
                name={'shipping_address'}
                placeholder={t('Address Line 1')}
                style={'col-span-2'}
                props={props}
                tips={null}
            />

            {/* <InputText
                label={null}
                icon={'f-location'}
                name={'address_line_2'}
                placeholder={t('Address Line 2')}
                style={'col-span-2'}
                props={props}
                tips={null}
            /> */}

            {/* <div className="col-span-2">
                <Field
                    type="checkbox"
                    name="isEqualAddresses"
                    id="isEqualAddresses"
                    className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                />
                <label
                    htmlFor="isEqualAddresses"
                    className="ml-3 text-sm font-medium text-gray-700">
                    My shipping and billing address are the same
                </label>
            </div> */}
        </div>
    );
};

export default ShippingAddress;
