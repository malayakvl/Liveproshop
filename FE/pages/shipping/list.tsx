import { useCallback, useEffect, useState } from 'react';
import { DataTable } from '../../components/_common';
import { PaginationType } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import {
    changeShippingStatus,
    changeShippingStatuses,
    fetchShippingsAction
    // setThresholdAction
} from '../../redux/shipping/actions';
import { shippingsSelector } from '../../redux/shipping/selectors';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { baseApiUrl, UserRole } from '../../constants';
import { useRouter } from 'next/router';
import {
    checkAllIdsAction,
    checkIdsAction,
    initIdsAction,
    setSuccessToastAction,
    uncheckAllIdsAction
} from '../../redux/layouts';
import { checkedIdsSelector } from '../../redux/layouts/selectors';
// import { ErrorMessage, Field, Formik } from 'formik';
// import { Form } from 'react-bootstrap';
import { userSelector } from '../../redux/user/selectors';
// import axios from 'axios';
import { formatCurrency, parseTranslation } from '../../lib/functions';
// import getConfig from 'next/config';
// import * as Yup from 'yup';
import { getSession } from 'next-auth/client';
import ConfirmDialog from '../../components/_common/ConfirmDialog';
import Head from 'next/head';

// const { publicRuntimeConfig } = getConfig();
// const url = `${publicRuntimeConfig.apiUrl}/api/shipping`;

export default function List({ locale }: { locale: string }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const items = useSelector(shippingsSelector);
    const checkedIds = useSelector(checkedIdsSelector);
    const t = useTranslations();
    const user = useSelector(userSelector);
    // const [threshold, setThreshold] = useState();
    const [dropDowns, setDropDowns] = useState<Array<boolean>>([]);

    const [selectedItem, setSelectedItem] = useState<Shipping | null>();

    const sendRequest = useCallback(
        () => user.email && dispatch(fetchShippingsAction()),
        [dispatch, user.email]
    );

    const handlerConfirm = useCallback(() => {
        if (!selectedItem) return;

        dispatch(checkIdsAction(selectedItem.id));
        selectedItem.status = !selectedItem.status;

        dispatch(changeShippingStatus(selectedItem.id, selectedItem.status));
        dispatch(
            setSuccessToastAction(
                t('Status of the shipping {name} is changed', { name: selectedItem.name })
            )
        );
        setSelectedItem(null);
    }, [dispatch, selectedItem]);

    useEffect(() => {
        if (!items) return;

        const setupChecked: any = [];
        items.forEach((item: Shipping) => {
            setupChecked.push({
                id: item.id,
                checked:
                    user?.role_id === UserRole.ADMIN
                        ? item.status
                        : item.status__customer_disabled_shipping
            });
        });
        dispatch(initIdsAction(setupChecked));
        setDropDowns(items.map(() => false));
    }, [items]);

    // useEffect(() => {
    //     if (!user.email) return;

    //     axios
    //         .get(`${url}/threshold`, {
    //             headers: {
    //                 ...authHeader(user.email)
    //             }
    //         })
    //         .then((result) => {
    //             setThreshold(result.data.threshold);
    //         });
    // }, [user.email]);

    if (!user.email) return null;

    return (
        <>
            <Head>
                <title>LiveProshop - Settings - Shipping methods</title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-big">
                <div className="page-title">
                    <h1>{t('Shipping')}</h1>
                </div>
                <div className="text-gray-400">
                    {t('setting_shipping')}
                    <div className="clear-both" />
                    <span className="italic block mt-2">{t('shipping_contact_us')}</span>
                </div>
            </div>

            <div className="md:flex mt-10 block-white-8 white-shadow-big">
                {/* {user.role_id !== 3 && (
                    <div className="w-full md:w-64 p-4 bg-gray-100 rounded-lg shadow-inner">
                        <div className="font-bold text-gray-350 text-lg pb-4 border-b border-gray-200">
                            {t('Free shipping')}
                        </div>
                        <div className="text-sm text-gray-500 mt-12">{t('shipping_threshold')}</div>
                        <Formik
                            onSubmit={(values) => {
                                dispatch(setThresholdAction(values));
                                dispatch(
                                    setSuccessToastAction(
                                        t(`Threshold has been saved: ${values.threshold}`)
                                    )
                                );
                            }}
                            initialValues={{ threshold }}
                            validationSchema={Yup.object().shape({
                                threshold: Yup.number().typeError('Must be number')
                            })}
                            render={(props) => (
                                <Form onSubmit={props.handleSubmit}>
                                    <Field
                                        name="threshold"
                                        className="w-full p-2.5 shadow-inner rounded-lg border-2 text-gray-350 font-bold mt-6"
                                    />
                                    <div className="error-el">
                                        <ErrorMessage name="threshold" />
                                    </div>
                                    <button type="submit" className="w-full mt-8 gradient-btn">
                                        {t('Save changes')}
                                    </button>
                                </Form>
                            )}
                        />
                    </div>
                )} */}

                <div className="md:flex-1">
                    <div className="mb-8 font-bold text-gray-350 text-lg py-4 border-b border-gray-200">
                        {t('Shipping methods')}
                    </div>
                    <DataTable
                        hidePaginationBar={true}
                        hideBulk={true}
                        paginationType={PaginationType.SHIPPING}
                        totalAmount={items?.length}
                        switcherOnClick={(status: boolean) => {
                            if (status) {
                                dispatch(changeShippingStatuses(true));
                                dispatch(checkAllIdsAction(items));
                            } else {
                                dispatch(changeShippingStatuses(false));
                                dispatch(uncheckAllIdsAction(items));
                            }

                            dispatch(
                                setSuccessToastAction(
                                    t(`Statuses have been changed for all shippings`)
                                )
                            );
                        }}
                        sendRequest={sendRequest}
                        sendDeleteRequest={() => new Promise(() => null)}
                        sendCopyRequest={() => new Promise(() => null)}>
                        {items?.map((item: Shipping, index: number) => (
                            <tr key={item.id}>
                                <td>
                                    <button
                                        onClick={() => {
                                            dropDowns[index] = !dropDowns[index];
                                            setDropDowns([...dropDowns]);
                                        }}>
                                        {dropDowns[index] ? (
                                            <>
                                                <Image
                                                    className="rotate-90 transform"
                                                    width="12"
                                                    height="14"
                                                    src={`/images/action-arrow-orange.svg`}
                                                />
                                            </>
                                        ) : (
                                            <Image
                                                width="12"
                                                height="14"
                                                src={`/images/action-arrow.svg`}
                                            />
                                        )}
                                    </button>
                                </td>

                                <td>
                                    <div className="text-center">{index + 1}</div>
                                </td>
                                <td className="break-all" style={{ minWidth: '150px' }}>
                                    {item.name}
                                </td>

                                <td className="flex justify-center">
                                    <Image
                                        src={`${baseApiUrl}/${item.image}`}
                                        width={50}
                                        height={50}
                                    />
                                </td>

                                <td>
                                    <label className="flex items-center cursor-pointer relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            value={`switcher_${item.id}`}
                                            checked={
                                                checkedIds.find((data: any) => data.id === item.id)
                                                    ?.checked || false
                                            }
                                            onChange={() => setSelectedItem(item)}
                                        />
                                        <div className="toggle-bg bg-gray-200 border border-gray-200 rounded-full dark:bg-gray-700 dark:border-gray-600" />
                                    </label>
                                </td>
                                {user.role_id !== 3 && (
                                    <td className="text-center">
                                        {item.countries.length > 0 ? (
                                            <>
                                                {dropDowns[index] ? (
                                                    item.countries.map((country) => {
                                                        return (
                                                            <div
                                                                key={country.id}
                                                                className="flex mb-1">
                                                                {/*<Image*/}
                                                                {/*    width="34"*/}
                                                                {/*    height="24"*/}
                                                                {/*    src={`/images/flags/${country.iso.toLowerCase()}.svg`}*/}
                                                                {/*/>*/}
                                                                {country.iso}
                                                                <div className="ml-auto">
                                                                    {country.price}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="flex mb-1">
                                                        {/*<Image*/}
                                                        {/*    width="34"*/}
                                                        {/*    height="24"*/}
                                                        {/*    src={`/images/flags/${item.countries[0].iso.toLowerCase()}.svg`}*/}
                                                        {/*/>*/}
                                                        <div className="ml-auto">
                                                            <span className="inline-block mr-2">
                                                                {parseTranslation(
                                                                    item.countries[0].country_name,
                                                                    'name',
                                                                    locale
                                                                )}
                                                            </span>
                                                            {formatCurrency(
                                                                item.countries[0].price
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-gray-400 text-sm">
                                                {t('Empty')}
                                            </div>
                                        )}
                                    </td>
                                )}

                                <td>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push(`/shipping/edit-method/${item.id}`);
                                        }}
                                        className="ml-auto block">
                                        <Image
                                            width={24}
                                            height={24}
                                            src="/images/dots.svg"
                                            layout="fixed"
                                            alt=""
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </DataTable>
                </div>
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
