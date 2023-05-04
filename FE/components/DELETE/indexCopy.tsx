import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Main1() {
    const t = useTranslations();
    const dispatch = useDispatch();

    return (
        <>
            <div className="flex">
                <div className="w-full lg:w-2/3 lg:pr-[65px]">
                    <h1 className="page-heading">
                        {t(
                            'Reclaim your free time and boost your sales by +300% by automating your process!'
                        )}
                    </h1>
                    <span className="block mt-[20px] text-[14px] leading-[24px] text-gray-350 lg:text-[20px] lg:leading-[30px]">
                        {t('descr_recalm')}
                    </span>
                    <span className="text-[14px] leading-[22px] mt-[20px] lg:mt-[40px] block text-gray-350 lg:text-[20px] lg:leading-[30px]">
                        <b>{t('100+ people')}</b> {t('started a free trial in the last 30 days')}
                    </span>
                    <span className="text-[25px] mt-[30px] lg:mt-[50px] lg:text-[30px] font-medium block lg:mt-[120px] text-gray-350">
                        {t('It only takes 30 seconds to get started')}
                    </span>
                    <div className="mt-[20px] lg:mt-[28px] flex flex-col md:flex-row">
                        <Link href={'/'}>
                            <a className="mb-[20px] btn-big text-center md:inline-block md:w-1/3 text-[22px]">
                                <span className="text-[20px]">{t('Register for free')}</span>
                            </a>
                        </Link>
                        <Link href={'/'}>
                            <a className="btn-big text-center md:inline-block text-[22px] md:w-1/3 lg:ml-[30px]">
                                <span className="text-[20px]">{t('Request a seles call')}</span>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="sm:hidden md:w-1/3 md:inline-block">
                    <div className="relative">
                        <div className="msg-block"></div>
                        <div className="sitting-girl-block"></div>
                    </div>
                </div>
            </div>
            <div className="mt-[50px] lg:flex lg:mt-[260px]">
                <div className="w-full lg:w-1/2">
                    <div className="screen-example"></div>
                </div>
                <div className="w-full lg:w-1/2">
                    Quick features view
                    <div className="lg:pr-[330px] hand-big-bg">
                        <h1 className="red-yellow-gradient-text text-[24px] leading-[32px] font-bold lg:text-[60px] lg:leading-[72px]">
                            Make order placement smoother
                        </h1>
                        <span className="text-blue-350 font-[18px] leading-[28px] font-medium block mt-[30px]">
                            With Live Pro shop, a mere comment is enough for a client to place an
                            order and live a great shopping experience
                        </span>
                        <div className="clear-both" />
                        <Link href={'/'}>
                            <button className="white-shadow mt-[48px] md:w-auto disabled-btn max-h-[40px]">
                                <a className="">See full list of features</a>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row mt-[80px] lg:mt-[160px]">
                <div className="w-full md:w-1/3">
                    <div className="shadowed-block-tip tip tip-1">
                        <div className="pl-[90px]">
                            <h4 className="text-gray-350 text-[24px] font-bold">
                                Leave behind cart abandonment
                            </h4>
                            <span className="block mt-[10px] text-[16px] leading-[16px] text-gray-350 leading-[24px]">
                                If clients do not proceed to checkout on time, the order is not
                                processed and the products are iimmediately available again for
                                other users.
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 md:ml-[32px] md:mr-[32px]">
                    <div className="shadowed-block-tip tip tip-2">
                        <div className="pl-[90px]">
                            <h4 className="text-gray-350 text-[24px] font-bold">
                                Decide how long the cart remains valid
                            </h4>
                            <span className="block mt-[10px] text-gray-350 text-[16px] leading-[24px]">
                                Set an expiration time and maximixe customer impulse-buying.
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 md:ml-[32px] md:mr-[32px]">
                    <div className="shadowed-block-tip tip tip-3">
                        <div className="pl-[90px]">
                            <h4 className="text-gray-350 text-[24px] font-bold">
                                Set the free shipping threshold
                            </h4>
                            <span className="block mt-[10px] text-gray-350 text-[16px] leading-[24px]">
                                Establish the amount users have to reach in order to qualify for
                                free shipping.
                            </span>
                        </div>
                    </div>
                </div>
                {/*<div className="w-1/3">*/}
                {/*    <div className="shadowed-block-tip tip tip-3">*/}
                {/*        <div className="lg:pl-[90px]">*/}
                {/*            <h4 className="text-gray-350 text-[24px] font-bold">*/}
                {/*                Set the free shipping threshold*/}
                {/*            </h4>*/}
                {/*            <span className="block mt-[10px] text-gray-350 text-[16px] leading-[24px]">*/}
                {/*                Establish the amount users have to reach in order to qualify for*/}
                {/*                free shipping.*/}
                {/*            </span>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
            {/*SECOND BLOCK BOXES*/}
            <div className="flex flex-col md:flex-row lg:mt-[48px]">
                <div className="w-full md:w-1/3 md:ml-[32px] md:mr-[32px]">
                    <div className="shadowed-block-tip tip tip-4">
                        <div className="pl-[90px]">
                            <h4 className="text-gray-350 text-[24px] font-bold">
                                Pay only once shipping fees
                            </h4>
                            <span className="block mt-[10px] text-gray-350 text-[16px] leading-[24px]">
                                And enable them to add more articles with no extra shipping costs
                                until the shipping starts.
                            </span>
                        </div>
                    </div>
                </div>
                {/*<div className="w-1/3">*/}
                {/*    <div className="shadowed-block-tip tip tip-4">*/}
                {/*        <div className="lg:pl-[90px]">*/}
                {/*            <h4 className="text-gray-350 text-[24px] font-bold">*/}
                {/*                Pay only once shipping fees*/}
                {/*            </h4>*/}
                {/*            <span className="block mt-[10px] text-gray-350 text-[16px] leading-[24px]">*/}
                {/*                And enable them to add more articles with no extra shipping costs*/}
                {/*                until the shipping starts.*/}
                {/*            </span>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}




                {/*<div className="w-1/3 ml-[32px] mr-[32px]">*/}
                {/*    <div className="shadowed-block-tip tip tip-5">*/}
                {/*        <div className="lg:pl-[90px]">*/}
                {/*            <h4 className="text-gray-350 text-[24px] font-bold">*/}
                {/*                Automatic*/}
                {/*                <br /> invoicing*/}
                {/*            </h4>*/}
                {/*            <span className="block mt-[10px] text-gray-350 text-[16px] leading-[24px]">*/}
                {/*                Set an expiration time and maximixe customer impulse-buying.*/}
                {/*            </span>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="w-1/3">*/}
                {/*    <div className="shadowed-block-tip tip tip-6">*/}
                {/*        <div className="lg:pl-[90px]">*/}
                {/*            <h4 className="text-gray-350 text-[24px] font-bold">*/}
                {/*                Real-time inventory and stock management*/}
                {/*            </h4>*/}
                {/*            <span className="block mt-[10px] text-gray-350 text-[16px] leading-[24px]">*/}
                {/*                Establish the amount users have to reach in order to qualify for*/}
                {/*                free shipping.*/}
                {/*            </span>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
            {/*THIRD BLOCK BOXES*/}
            <div className="flex flex-row mt-[48px]">
                <div className="w-1/3">
                    <div className="shadowed-block-tip tip tip-7">
                        <div className="lg:pl-[90px]">
                            <h4 className="text-gray-350 text-[24px] font-bold">
                                Shipping and payment methods flexibility
                            </h4>
                            <span className="block mt-[10px] text-gray-350 text-[16px] leading-[24px]">
                                Adapt yourself to different shipping and payment methods according
                                to client needs.
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-1/3 ml-[32px] mr-[32px]">
                    <div className="shadowed-block-tip tip tip-8">
                        <div className="lg:pl-[90px]">
                            <h4 className="text-gray-350 text-[24px] font-bold">
                                Create a waiting list
                            </h4>
                            <span className="block mt-[10px] text-gray-350 text-[16px] leading-[24px]">
                                Set an expiration time and maximixe customer impulse-buying.
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-1/3">
                    <Link href={'/'}>
                        <button className="white-shadow mt-[48px] md:w-auto disabled-btn max-h-[40px] bg-white min-h-[60px] min-w-[320px] lg:mt-[100px] lg:ml-[85px]">
                            <a className="text-[20px] text-gray-50 see-full-link ml-[-25px]">
                                See full list of features
                            </a>
                        </button>
                    </Link>
                </div>
            </div>

            <h3 className="red-yellow-gradient-text text-[60px] font-bold leading-[72px] mt-[60px] mb-[60px] text-center w-full">
                Discover our platform`s advantages
            </h3>
            <div className="flex">
                <div className="w-1/3 text-center d-tip-1">
                    <h5 className="text-[24px] w-full text-center font-bold text-gray-350">
                        Increase sales 300+%
                    </h5>
                    <span className="text-blue-350 pl-20 pr-20 text-center mt-3 block">
                        With a sales system as intuitive as Live Pro Shop, it`s possible!
                    </span>
                </div>
                <div className="w-1/3 text-center d-tip-2">
                    <h5 className="text-[24px] w-full text-center font-bold text-gray-350">
                        Save up to 3 hours
                    </h5>
                    <span className="text-blue-350 pl-20 pr-20 text-center mt-3 block">
                        An intense live with many sales involves hours of repitive administrative
                        management. Automate the process and forget about those long hours.
                    </span>
                </div>
                <div className="w-1/3 text-center d-tip-3">
                    <h5 className="text-[24px] w-full text-center font-bold text-gray-350">
                        70% or the users could dedicate more time to their community
                    </h5>
                    <span className="text-blue-350 pl-20 pr-20 text-center mt-3 block">
                        And the other 30% spent the whole time for themselves and their family.
                    </span>
                </div>
            </div>
            <div className="main-big-round-white mt-[160px] p-[40px] bg-white rocked-lady">
                <div className="pl-[585px]">
                    <h2 className="red-yellow-gradient-text text-[60px] font-bold leading-[72px]">
                        Best of all, Live Pro Shop works with all your favorite sites!
                    </h2>
                    <span className="font-medium text-[16px] leading-[24px] block mt-[20px] text-blue-350">
                        Live pro shop gathers the best partners to increase revenue and strengthen
                        customer loyalty through live video sales.
                    </span>
                    <ul className="mt-[48px]">
                        <li className="inline-block pl-2 pr-2">
                            <span className="icon-socail-line icon-facebook block" />
                            <span className="block text-[14px] text-gray-350 font-bold">
                                Facebook
                            </span>
                        </li>
                        <li className="inline-block pl-2 pr-2">
                            <span className="icon-socail-line icon-insta block" />
                            <span className="block text-[14px] text-gray-350 font-bold">
                                Instagram
                            </span>
                        </li>
                        <li className="inline-block pl-2 pr-2">
                            <span className="icon-socail-line icon-fb-mess block" />
                            <span className="block text-[14px] text-gray-350 font-bold">
                                Messenger
                            </span>
                        </li>
                        <li className="inline-block pl-2 pr-2">
                            <span className="icon-socail-line icon-multisafe block" />
                            <span className="block text-[14px] text-gray-350 font-bold">
                                Multisafe Pay
                            </span>
                        </li>
                        <li className="inline-block pl-2 pr-2">
                            <span className="icon-socail-line icon-presta block" />
                            <span className="block text-[14px] text-gray-350 font-bold">
                                Prestashop
                            </span>
                        </li>
                        <li className="inline-block pl-2 pr-2">
                            <span className="icon-socail-line icon-shopify block" />
                            <span className="block text-[14px] text-gray-350 font-bold">
                                Shopify
                            </span>
                        </li>
                        <li className="inline-block pl-2 pr-2">
                            <span className="icon-socail-line icon-stripe block" />
                            <span className="block text-[14px] text-gray-350 font-bold">
                                Stripe
                            </span>
                        </li>
                        <li className="inline-block pl-2 pr-2">
                            <span className="icon-socail-line icon-paypal block" />
                            <span className="block text-[14px] text-gray-350 font-bold">
                                Paypal
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="clear-both" />
            <span className="w-full text-center block font-bold text-blue-350">
                Customer stories
            </span>
            <h3 className="red-yellow-gradient-text text-[60px] font-bold leading-[72px] w-full text-center">
                You too, be like our clients
            </h3>
            <span className="w-full text-center block font-bold text-blue-350 mt-[20px]">
                See how Live Pro Shop tools help companies run their business
            </span>
            <div className="mt-[40px] w-full block">
                <div className="thumb float-left"></div>
                <div className="float-left">
                    <div className="testimon-block user-1 active">
                        <div className="photo photo-1"></div>
                        <div className="user-info">
                            <span className="user-name">Sabrina M.</span>
                            <span className="text">Lalylook Boutique</span>
                        </div>
                    </div>
                    <div className="testimon-block user-1">
                        <div className="photo photo-2"></div>
                        <div className="user-info">
                            <span className="user-name">Sabrina M.</span>
                            <span className="text">Lalylook Boutique</span>
                        </div>
                    </div>
                    <div className="testimon-block user-1">
                        <div className="photo photo-3"></div>
                        <div className="user-info">
                            <span className="user-name">Sabrina M.</span>
                            <span className="text">Lalylook Boutique</span>
                        </div>
                    </div>
                </div>
                <div className="testim-descript">
                    <div className="header">
                        Perfect tool for business owner that utilizes live streaming for retail
                        sales
                    </div>
                    <div className="raiting"></div>
                    <div className="descr">
                        <p>
                            I love all the features of LiveProShop, but my favorite is that my
                            customers have access and control to their cart. They can see what
                            they've ordered.
                        </p>
                        <p>
                            Being able to up load products quickly, check customers purchase
                            history, tracking my sales, inventory break down and so much more...
                        </p>
                        <p>
                            It has completely revolutionized the way that we do are selling and it's
                            all very simple to use.
                        </p>
                    </div>
                </div>
            </div>
            <div className="clear-both" />
            <h3 className="red-yellow-gradient-text text-[60px] font-bold leading-[72px] w-full text-center mt-[96px]">
                Try it for free today!
            </h3>
            <h4 className="text-gray-350 leading-[38px] text-[30px] w-full text-center font-medium mt-[24px]">
                It only takes 30 seconds to get started.
            </h4>
            <div className="w-full mt-[40px] text-center mb-[200px]">
                <Link href={'/'}>
                    <a className="btn-big lg:mr-[84px]">
                        <span className="text-[20px] inline-block min-w-[220px]">
                            Register now!
                        </span>
                    </a>
                </Link>
                <Link href={'/'}>
                    <a className="btn-big lg:ml-[84px]">
                        <span className="text-[20px] inline-block min-w-[220px]">I want to know more!</span>
                    </a>
                </Link>
            </div>
        </>
    );
}

export default Main;
