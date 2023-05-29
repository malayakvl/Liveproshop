import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import { setModalCalendlyMetaAction } from '../../redux/layouts';
import { useDispatch } from 'react-redux';

function Try() {
    const t = useTranslations();
    const dispatch = useDispatch();
    return (
        <>
            <div className="clear-both" />
            <h3 className="red-yellow-gradient-text mt-[30px] font-bold text-[28px] leading-[32px] md:text-[48px] md:leading-[72px] text-center md:mt-[50px]">
                {t('Try it for free today!')}
            </h3>
            <h4 className="text-gray-350 mt-[10px] text-[14px] leading-[38px] md:text-[30px] w-full text-center font-medium md:mt-[0px]">
                {t('It only takes 30 seconds to get started')}
            </h4>
            <div className="w-full mt-[20px] md:mt-[40px] text-center mb-[50px]">
                <Link href={'/auth/signup'}>
                    <a className="btn-big md:mr-[20px] block mb-[15px] md:mb-auto md:inline-block  lg:mr-[84px]">
                        <span className="text-[16px] inline-block min-w-[220px] md:text-[20px] ">
                            {t('Register now!')}
                        </span>
                    </a>
                </Link>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div
                    className="md:inline-block cursor-pointer"
                    onClick={() => {
                        dispatch(setModalCalendlyMetaAction(true));
                    }}>
                    <a className="btn-big md:ml-[20px] block md:inline-block lg:ml-[84px]">
                        <span className="text-[16px] inline-block min-w-[220px] md:text-[20px] ">
                            {t('I want to know more!')}
                        </span>
                    </a>
                </div>
            </div>
        </>
    );
}

export default Try;
