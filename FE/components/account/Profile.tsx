import * as Yup from 'yup';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useCallback } from 'react';
import { Formik } from 'formik';
import { InputText } from '../_form';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profilePhotoSelector, profileSelector } from '../../redux/profile/selectors';
import { fetchProfileAction, updateProfileAction } from '../../redux/profile';
import { baseApiUrl } from '../../constants';
import { userSelector } from '../../redux/user/selectors';
import { fetchCountriesAction } from '../../redux/countries/actions';
import { setModalConfirmationMetaAction } from '../../redux/layouts';
import { setPhotoAction } from '../../redux/profile/actions';
import { redirectCheckoutSelector, returnedUrlSelector } from '../../redux/orders/selectors';
import { useRouter } from 'next/router';

function Profile() {
    const t = useTranslations();
    const dispatch = useDispatch();
    const profileData = useSelector(profileSelector);
    const profilePhotoFromSelector = useSelector(profilePhotoSelector);
    const user = useSelector(userSelector);
    const filePickerRef = useRef<HTMLInputElement>(null);
    const [imagePost, setImagePost] = useState<File>();
    const [isNewPhoto, setIsNewPhoto] = useState(false);
    const redirectToCheckout = useSelector(redirectCheckoutSelector);
    const orderReturnedUrl = useSelector(returnedUrlSelector);
    const router = useRouter();

    useEffect(() => {
        if (user.email) {
            dispatch(fetchProfileAction());
            dispatch(fetchCountriesAction());
        }
    }, [user?.email]);

    const addImageToPost = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!filePickerRef.current?.files?.length) return;
        setImagePost(filePickerRef.current.files[0]);
        setIsNewPhoto(true);
    };

    useEffect(() => {
        // console.log('here we are update photo', imagePost);
        dispatch(setPhotoAction(imagePost));
    }, [imagePost]);

    const handlerSubmit = useCallback(
        (values: Profile.Profile, photo: any) => {
            const formData = new FormData();
            // let count = 0;

            Object.keys(values).forEach((key: string) => {
                if ((values as any)[key] !== (profileData as any)[key]) {
                    formData.append(key, (values as any)[key]);
                    // count++;
                }
            });

            if (imagePost || photo) {
                formData.append('photo', imagePost || photo);
            }

            // if (count) dispatch(updateProfileAction(formData));
            dispatch(updateProfileAction(formData));
            if (redirectToCheckout) {
                // router.push(orderReturnedUrl);
                window.location.href = orderReturnedUrl;
                // router.push(orderReturnedUrl);
            }
        },
        [dispatch]
    );

    const validateEmail = (email: string) => {
        if (!email) {
            return false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            return false;
        }

        return true;
    };

    let SubmitSchema;
    if (user.role_id == 2) {
        SubmitSchema = Yup.object().shape({
            email: Yup.string()
                .trim(t('Cannot include leading and trailing spaces'))
                .min(3, t('Must be at least 3 characters'))
                .email(t('Must be a valid email'))
                .strict(true)
                .required(t('You must enter your email')),
            email_real: Yup.string()
                .trim(t('Cannot include leading and trailing spaces'))
                .min(3, t('Must be at least 3 characters'))
                .email(t('Must be a valid email'))
                .strict(true)
                .required(t('You must enter your email')),
            last_name: Yup.string()
                .strict(true)
                .trim(t('Cannot include leading and trailing spaces'))
                .required(t('You must enter your family name')),
            first_name: Yup.string()
                .strict(true)
                .trim(t('Cannot include leading and trailing spaces'))
                .required(t('You must enter your first name')),
            identification_number: Yup.string()
                .trim(t('Cannot include leading and trailing spaces'))
                .strict(true)
                .min(3, t('Must be at least 3 characters'))
                .required(t('You must enter your tax-ID')),
            company_name: Yup.string()
                .strict(true)
                .min(3, t('Must be at least 3 characters'))
                .trim(t('Cannot include leading and trailing spaces')),
            phone: Yup.string()
                .strict(true)
                .trim(t('Cannot include leading and trailing spaces'))
                .required(t('You must enter your phone number'))
                .min(5, t('Phone must be at least 5 characters')),
            vat: Yup.string()
                .min(3, t('Must be at least 3 characters'))
                .strict(true)
                .trim(t('Cannot include leading and trailing spaces'))
        });
    } else {
        // register throw FB be didn't get user email
        SubmitSchema = Yup.object().shape({
            email: Yup.string()
                .trim(t('Cannot include leading and trailing spaces'))
                .min(3, t('Must be at least 3 characters'))
                .strict(true)
                .required(t('You must enter your email')),
            email_real: Yup.string()
                .trim(t('Cannot include leading and trailing spaces'))
                .min(3, t('Must be at least 3 characters'))
                .email(t('Must be a valid email'))
                .strict(true)
                .required(t('You must enter your email')),
            last_name: Yup.string()
                .strict(true)
                .trim(t('Cannot include leading and trailing spaces'))
                .required(t('You must enter your family name')),
            first_name: Yup.string()
                .strict(true)
                .trim(t('Cannot include leading and trailing spaces'))
                .required(t('You must enter your first name')),
            phone: Yup.string()
                .strict(true)
                .trim(t('Cannot include leading and trailing spaces'))
                .required(t('You must enter your phone number'))
                .min(5, t('Phone must be at least 5 characters'))
        });
    }

    return (
        <Formik
            enableReinitialize
            initialValues={profileData}
            validationSchema={SubmitSchema}
            onSubmit={(values: Profile.Profile) => {
                const keyEmail = 'email';
                const photo = profilePhotoFromSelector;
                console.log(values);
                if (values[keyEmail] !== profileData[keyEmail]) {
                    dispatch(
                        setModalConfirmationMetaAction({
                            titleKey: t('Are you sure want to change email?'),
                            submitButtonProps: { localeKey: t('Save') },
                            onConfirm: async () => handlerSubmit(values, photo),
                            onCancel: async () => {
                                values[keyEmail] = profileData[keyEmail];
                                handlerSubmit(values, photo);
                            }
                        })
                    );
                } else {
                    handlerSubmit(values, photo);
                }
            }}>
            {(props) => (
                <form onSubmit={props.handleSubmit} className="mt-5">
                    <div className="float-left mb-4 mt-4 lg:w-1/4 mr-[20px]">
                        <div className="rounded-full w-[160px] h-[160px] bg-gray-180 relative">
                            {imagePost && (
                                <img
                                    alt=""
                                    className="rounded-full w-[160px] h-[160px] object-cover"
                                    src={URL.createObjectURL(imagePost)}
                                />
                            )}
                            {profileData.photo && !isNewPhoto && (
                                <img
                                    alt=""
                                    className="rounded-full w-[160px] h-[160px] object-cover"
                                    src={baseApiUrl + profileData.photo}
                                />
                            )}
                            <div className="absolute right-0 bottom-0 cursor-pointer">
                                <Image
                                    role="presentation"
                                    src="/images/profile-upload.svg"
                                    onClick={() => filePickerRef.current?.click()}
                                    width={46}
                                    height={46}
                                    layout="fixed"
                                />
                                <input
                                    ref={filePickerRef}
                                    type="file"
                                    onChange={addImageToPost}
                                    hidden
                                />
                            </div>
                        </div>
                        <div className="text-base text-gray-350 font-bold ml-10 w-[180px]">
                            {t('Update your Profile picture:')}
                            <span className="block text-sm text-gray-350 font-medium mt-6">
                                {t('You can use jpg or png, photo file formats')}
                            </span>
                        </div>
                    </div>
                    <div className="float-left ml-[20px] min-w-[300px]">
                        {user.role_id == 1 && !validateEmail(user.email) ? (
                            <>
                                <InputText
                                    disabled={true}
                                    icon={'f-facebook'}
                                    label={null}
                                    name={'email'}
                                    placeholder={t('FB account ID')}
                                    style={'lg:w-full'}
                                    props={props}
                                    tips={null}
                                />
                                <InputText
                                    disabled={validateEmail(props.values['email_real'])}
                                    icon={'f-email'}
                                    label={null}
                                    name={'email_real'}
                                    placeholder={t('Email Address')}
                                    style={'lg:w-full'}
                                    props={props}
                                    tips={null}
                                />
                            </>
                        ) : (
                            <>
                                <InputText
                                    disabled={validateEmail(props.values['email'])}
                                    icon={'f-email'}
                                    label={null}
                                    name={'email'}
                                    placeholder={t('Email Address')}
                                    style={'lg:w-full'}
                                    props={props}
                                    tips={null}
                                />
                                <div className="hidden">
                                    <InputText
                                        icon={null}
                                        label={null}
                                        name={'email_real'}
                                        placeholder={t('Email Address')}
                                        style={'lg:w-full'}
                                        props={props}
                                        tips={null}
                                    />
                                </div>
                            </>
                        )}

                        <InputText
                            icon={'f-fname'}
                            label={null}
                            name={'first_name'}
                            placeholder={t('Name')}
                            style={'lg:w-full'}
                            props={props}
                            tips={null}
                        />

                        <InputText
                            icon={'f-lname'}
                            label={null}
                            name={'last_name'}
                            placeholder={'Surname'}
                            style={'lg:w-full'}
                            props={props}
                            tips={null}
                        />
                        {user.role_id === 2 && (
                            <InputText
                                icon={'f-company'}
                                label={null}
                                name={'company_name'}
                                placeholder={'Company Name'}
                                style={'lg:w-full'}
                                props={props}
                                tips={null}
                            />
                        )}
                        {user.role_id === 2 && (
                            <InputText
                                icon={'f-company-id'}
                                label={null}
                                name={'identification_number'}
                                placeholder={'Company ID'}
                                style={'lg:w-full'}
                                props={props}
                                tips={null}
                            />
                        )}
                        {user.role_id === 2 && (
                            <InputText
                                icon={'f-vat'}
                                label={null}
                                name={'vat'}
                                placeholder={'VAT (If applicable)'}
                                style={'lg:w-1/2'}
                                props={props}
                                tips={null}
                            />
                        )}

                        <InputText
                            icon={'f-phone'}
                            label={null}
                            name={'phone'}
                            placeholder={'Phone Number'}
                            style={'lg:w-full'}
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

                        <div className="mt-10 mb-7 block border border-gray-180 border-b-0" />
                        <button type="submit" className="gradient-btn">
                            {t('Save')}
                        </button>
                    </div>
                </form>
            )}
        </Formik>
    );
}

export default Profile;
