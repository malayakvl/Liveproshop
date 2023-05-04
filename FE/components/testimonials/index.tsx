import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import _ from 'lodash';
import Link from "next/link";


function Testimonials() {
    const t = useTranslations();
    const [showMoreAnswer, setShowMoreAnswer] = useState<any>({});

    return (
        <>
            <div className="flex">
                <div className="w-full">
                    <div className="dotted-bg md:flex">
                        <div className="header-t-block">
                            <h1 className="page-heading text-left">Sabrina</h1>
                            <span className="block text-gray-350 text-[36px] leading-[44px] font-bold mt-[16px]">
                                Lalylook Boutique
                            </span>
                            <span className="mb-[15px] mt-[24px] text-[14px] leading-[24px] block text-gray-350 md:text-[30px] md:leading-[38px] mdd:mt-[48px]">
                                “The more money I make, the more articles I can buy and thus obtain
                                better prices from my providers.”
                            </span>
                        </div>
                        <div className="user-photo"></div>
                    </div>
                    <div className="clear-both" />
                    <div className="testimonial-container">
                        <div className="flex items-end">
                            <div className="">
                                <div className="big-boy-profile"></div>
                            </div>
                            <div>
                                <div className="blue-message">
                                    Sabrina, can you tell us about your activity?
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end mt-20">
                            <div className="gray-message">
                                <p>
                                    My name is Sabrina, I have been an entrepreneur for 7 years. I
                                    retook the family shop “Lalylook boutique” where I work with my
                                    mother.
                                </p>
                                <p>
                                    Our company used to be opened only 6 months a year due to
                                    saisonality as our shop is on sea side.
                                </p>
                            </div>
                            <div className="">
                                <div className="big-girl-profile"></div>
                            </div>
                        </div>

                        <div className="flex items-end mt-20">
                            <div className="">
                                <div className="big-boy-profile small-profile"></div>
                            </div>
                            <div>
                                <div className="blue-message">
                                    When and why did you start doing Facebook lives?
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end mt-20">
                            <div className="gray-message">
                                Things were getting tougher and tougher each year. We were looking
                                for a side income and started doing Facebook lives in April 2019.
                            </div>
                            <div className="">
                                <div className="big-girl-profile small-profile"></div>
                            </div>
                        </div>

                        <div className="flex items-end mt-20">
                            <div className="">
                                <div className="big-boy-profile small-profile"></div>
                            </div>
                            <div>
                                <div className="blue-message">
                                    How was the beginning?
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end mt-20">
                            <div className="gray-message">
                                <p>
                                    In winter 2019 / early 2020, the pandemic and lock-down made our
                                    business skyrocket. Our clients, and people in general quickly
                                    adopted new buying habits.
                                </p>
                                <p>
                                    Even after the lockdown was over, we still could maintain our
                                    still could maintain our rhythm.
                                </p>
                                <p>But eventually you only have 7 days a week and 24h a day.</p>
                            </div>
                            <div className="">
                                <div className="big-girl-profile small-profile"></div>
                            </div>
                        </div>

                        <div className="flex items-end mt-20">
                            <div className="">
                                <div className="big-boy-profile small-profile"></div>
                            </div>
                            <div>
                                <div className="blue-message">What happened?</div>
                            </div>
                        </div>
                        <div className="flex items-end mt-20">
                            <div className="gray-message">
                                We realized that all the small process accumulation was
                                time-consuming. I had very little time to rest, see my friends or
                                take care of my family. I was exhausted.
                            </div>
                            <div className="">
                                <div className="big-girl-profile small-profile"></div>
                            </div>
                        </div>

                        <div className="flex items-end mt-20">
                            <div className="">
                                <div className="big-boy-profile small-profile"></div>
                            </div>
                            <div>
                                <div className="blue-message">How did you got to that point?</div>
                            </div>
                        </div>
                        <div className="flex items-end mt-20">
                            <div className="gray-message">
                                <p>
                                    Well, we had no dedicated software nor any computer knowledge…
                                </p>
                                <p>
                                    So we started looking for a simple and intuitive solution that
                                    would fit our need and activity. And this is when we discovered
                                    Live Pro Shop.
                                </p>
                                <p>
                                    To be honest, I was skeptical at first, but, upon insistence
                                    from my mother, still accepted to give it a try.
                                </p>
                            </div>
                            <div className="">
                                <div className="big-girl-profile small-profile"></div>
                            </div>
                        </div>

                        <div className="flex items-end mt-20">
                            <div className="">
                                <div className="big-boy-profile small-profile"></div>
                            </div>
                            <div>
                                <div className="blue-message">How did the experience go?</div>
                            </div>
                        </div>
                        <div className="flex items-end mt-20">
                            <div className="gray-message">
                                <p>We have been using Live Pro Shop for a few months now.</p>
                                <p>I was amazed by the changes it provided:</p>
                                <p>Signing up is simple</p>
                                <p>
                                    No more time wasted making modifications, generating invoices or
                                    follow-ups
                                </p>
                                <p>I sell much more</p>
                                <p>I keep selling even when I am not on camera</p>
                                <p>
                                    The saved time was invested in tying bonds with my community and
                                    working on social media
                                </p>
                                <p>
                                    The more money I make, the more articles I can buy and thus
                                    obtain better prices from my providers. That means best prices
                                    for my clients.
                                </p>
                                <p>And happy clients are the key to a successful business.</p>
                                <p>It has been a game changer.</p>
                            </div>
                            <div className="">
                                <div className="big-girl-profile small-profile"></div>
                            </div>
                        </div>

                    </div>

                    {/*=======================================================*/}
                    {/*====================== TRY FOR TODAY ==================*/}
                    {/*=======================================================*/}
                    <div className="clear-both" />
                    <h3 className="red-yellow-gradient-text mt-[30px] font-bold text-[24px] leading-[32px] md:text-[60px] md:leading-[72px] text-center md:mt-[80px]">
                        {t('Try it for free today!')}
                    </h3>
                    <h4 className="text-gray-350 leading-[38px] text-[30px] w-full text-center font-medium mt-[24px]">
                        {t('It only takes 30 seconds to get started')}.
                    </h4>
                    <div className="w-full mt-[40px] text-center mb-[100px]">
                        <Link href={'/'}>
                            <a className="btn-big md:mr-[20px] block mb-[10px] md:mb-auto md:inline-block  lg:mr-[84px]">
                                <span className="text-[20px] inline-block min-w-[220px]">
                                    {t('Register now!')}
                                </span>
                            </a>
                        </Link>
                        <Link href={'/'}>
                            <a className="btn-big md:ml-[20px] block md:inline-block lg:ml-[84px]">
                                <span className="text-[20px] inline-block min-w-[220px]">{t('I want to know more!')}</span>
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Testimonials;


