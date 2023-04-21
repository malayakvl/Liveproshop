import React, { Fragment } from 'react';
import { getSession } from 'next-auth/client';
import { useTranslations } from 'next-intl';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Address, Profile, Password } from '../../components/account';
import { useDispatch, useSelector } from 'react-redux';
import { profileSelector } from '../../redux/profile/selectors';
import { fetchProfileAction } from '../../redux/profile';
import { userSelector } from '../../redux/user/selectors';

function Account({ locale, reqActiveTab }: { locale: string; reqActiveTab: string | null }) {
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState(reqActiveTab ? reqActiveTab : 'profile');
    const [subTitle, setSubTitle] = useState(t('Personal Information'));

    const dispatch = useDispatch();

    const profileData = useSelector(profileSelector);
    const user = useSelector(userSelector);

    useEffect(() => {
        if (user.email) {
            dispatch(fetchProfileAction());
        }
    }, [user?.email]);

    const handleTabClick = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        setActiveTab(target.id);
        switch (target.id) {
            case 'profile':
                setSubTitle(t('Personal Information'));
                break;
            case 'addresses':
                setSubTitle(t('Addresses'));
                break;
            case 'password':
                setSubTitle(t('Password'));
                break;
        }
    };

    return (
        <>
            <Head>
                <title>LiveProshop - Personal Information</title>
                <meta name="description" content="Generated by create next app" />
            </Head>

            <div className="page-title">
                <h1>{subTitle}</h1>
            </div>
            <div className="block-white-8 mr-10 white-shadow-medium mt-10">
                <div className="block">
                    <nav className="float-tabs">
                        <button
                            id="profile"
                            onClick={handleTabClick}
                            className={`tabs ${activeTab === 'profile' ? 'active' : ''}`}>
                            {t('Personal Information')}
                        </button>
                        {profileData.role_id === 2 && (
                            <button
                                id="addresses"
                                onClick={handleTabClick}
                                className={`tabs ${activeTab === 'addresses' ? 'active' : ''}`}>
                                {t('Addresses')}
                            </button>
                        )}
                        <button
                            id="password"
                            onClick={handleTabClick}
                            className={`tabs ${activeTab === 'password' ? 'active' : ''}`}>
                            {t('Password')}
                        </button>
                    </nav>
                </div>
                <div className="tabs-content">
                    <div className={`w-full ${activeTab !== 'profile' ? 'hidden' : ''}`}>
                        {profileData.email && <Profile />}
                    </div>
                    <div className={`w-full ${activeTab !== 'addresses' ? 'hidden' : ''}`}>
                        {profileData.role_id === 2 && (
                            <Fragment>
                                <Address address={profileData.address} locale={locale} />
                            </Fragment>
                        )}
                    </div>
                    <div className={`w-full md:w-96 ${activeTab !== 'password' ? 'hidden' : ''}`}>
                        <Password />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Account;

export async function getServerSideProps(context: any) {
    const { req, locale } = context;
    const session = await getSession({ req });
    const activeTab = req.__NEXT_INIT_QUERY.activeTab;

    if (!session) {
        return {
            redirect: { destination: `/${locale === 'fr' ? '' : `${locale}/`}auth/signin` }
        };
    }

    return {
        props: {
            session: session,
            locale: locale,
            reqActiveTab: activeTab || null,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
