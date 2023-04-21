import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import LangSwitcher from '../lang/Switcher';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

const userProfileImg =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const Header: React.FC = () => {
    const [session] = useSession();
    const router = useRouter();
    const t = useTranslations();

    return (
        <header>
            <nav className="px-4 py-5 bg-white flex flex-wrap items-center justify-between md:px-32">
                <div className="cursor-pointer">
                    <Link href={'/'}>
                        <a className="app-logo">
                            {/*<Image src="/images/logo-mobile.svg" width="238" height="40" alt="" />*/}
                        </a>
                    </Link>
                </div>

                <Menu as="div" className="relative w-full lg:hidden z-10">
                    <Menu.Button className="absolute top-[-47px]">
                        <Image src="/images/menu.svg" width="24" height="40" alt="" />
                        {/*<svg*/}
                        {/*    xmlns="http://www.w3.org/2000/svg"*/}
                        {/*    id="menu-button"*/}
                        {/*    className="h-6 w-6 cursor-pointer block"*/}
                        {/*    fill="none"*/}
                        {/*    viewBox="0 0 24 24"*/}
                        {/*    stroke="currentColor">*/}
                        {/*    <path*/}
                        {/*        strokeLinecap="round"*/}
                        {/*        strokeLinejoin="round"*/}
                        {/*        strokeWidth="2"*/}
                        {/*        d="M4 6h16M4 12h16M4 18h16"*/}
                        {/*    />*/}
                        {/*</svg>*/}
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items className="absolute left-0 top-[-10px] w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-1 flex flex-col font-bold text-sm">
                            <Link href={'/'}>
                                <Menu.Item
                                    as="a"
                                    className="m-2 cursor-pointer hover:text-purple-400 drop-top-menu-item">
                                    {t('Features')}
                                </Menu.Item>
                            </Link>
                            <Link href={'/pricing'}>
                                <Menu.Item
                                    as="a"
                                    className={`m-2 cursor-pointer drop-top-menu-item ${
                                        router.pathname == '/pricing'
                                            ? 'text-purple-400'
                                            : 'hover:text-purple-400'
                                    }`}>
                                    {t('Pricing')}
                                </Menu.Item>
                            </Link>
                            <Link href={'/'}>
                                <Menu.Item
                                    as="a"
                                    className="drop-top-menu-item m-2 cursor-pointer hover:text-purple-400 uppercase">
                                    Faq
                                </Menu.Item>
                            </Link>
                            <Link href={'/'}>
                                <Menu.Item
                                    as="a"
                                    className="drop-top-menu-item m-2 cursor-pointer hover:text-purple-400">
                                    {t('Case Studies')}
                                </Menu.Item>
                            </Link>

                            <Link href={'/contact-us'}>
                                <Menu.Item
                                    as="a"
                                    className={`drop-top-menu-item m-2 cursor-pointer ${
                                        router.pathname == '/contact-us'
                                            ? 'text-purple-400'
                                            : 'hover:text-purple-400'
                                    }`}>
                                    {t('Contact Us')}
                                </Menu.Item>
                            </Link>
                        </Menu.Items>
                    </Transition>
                </Menu>

                <div
                    className="hidden lg:flex flex-wrap justify-center justify-items-end flex-auto mx-2 xl:mx-4 2xl:mx-7 my-4 lg:my-0 font-bold text-sm"
                    id="menu">
                    <Link href={'/'}>
                        <a className="m-2 xl:mx-4 2xl:mx-7 hover:text-purple-400">Features</a>
                    </Link>

                    <Link href={'/pricing'}>
                        <a
                            className={`m-2 xl:mx-4 2xl:mx-7 ${
                                router.pathname == '/pricing'
                                    ? 'text-purple-400'
                                    : 'hover:text-purple-400'
                            }`}>
                            Pricing
                        </a>
                    </Link>

                    <Link href={'/'}>
                        <a className="m-2 xl:mx-4 2xl:mx-7 hover:text-purple-400">Case Studies</a>
                    </Link>

                    <Link href={'/'}>
                        <a className="m-2 xl:mx-4 2xl:mx-7 hover:text-purple-400 uppercase">Faq</a>
                    </Link>

                    <Link href={'/contact-us'}>
                        <a
                            className={`m-2 xl:mx-4 2xl:mx-7 ${
                                router.pathname == '/contact-us'
                                    ? 'text-purple-400'
                                    : 'hover:text-purple-400'
                            }`}>
                            Contact Us
                        </a>
                    </Link>
                </div>
                <div className="font-bold text-sm flex flex-wrap flex-none space-x-4 justify-end">
                    {!session?.user ? (
                        <>
                            <Link href={'/auth/signup'}>
                                <button className="gradient-btn max-h-[40px] pt-[7px]">
                                    <a>{t('Try for free')}</a>
                                </button>
                            </Link>
                            <Link href={'/auth/signin'}>
                                <button className="disabled-btn max-h-[40px]">
                                    <a className="">Login</a>
                                </button>
                            </Link>
                        </>
                    ) : (
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6 md:mt-3">
                                {/* Profile dropdown */}
                                <Menu as="div" className="ml-5 relative -mt-2">
                                    <div>
                                        <Menu.Button
                                            className="max-w-xs bg-gray-800 rounded-full flex
                                            items-center text-sm focus:outline-none focus:ring-2
                                            focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                            <span className="sr-only">Open user menu</span>
                                            <Image
                                                src={userProfileImg}
                                                width={35}
                                                height={35}
                                                className="rounded-full"
                                                alt=""
                                            />
                                        </Menu.Button>
                                    </div>
                                </Menu>
                            </div>
                        </div>
                    )}

                    <LangSwitcher />
                </div>
            </nav>
        </header>
    );
};

export default Header;
