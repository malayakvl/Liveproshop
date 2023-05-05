import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations();

    return (
        <footer className="w-full bg-blue-550 pt-[50px]">
            <div className="container mx-auto">
                <div className="px-4 pb-4 tracking-wide text-sm text-blue-350 flex h-full justify-between flex-col">
                    <div className="flex flex-col md:flex-row justify-between md:pb-4">
                        <div className="cursor-pointer mt-3 md:mt-0">
                            <Link href={'/'}>
                                <a>
                                    <Image
                                        src="/images/logo.svg"
                                        width="250"
                                        height="40"
                                        layout="fixed"
                                    />
                                </a>
                            </Link>
                        </div>
                        <div className="mb-4 justify-end flex flex-com md:justify-self-stretch md:flex-row md:mb-0">
                            <div className="mr-9">
                                <div className="mb-2 font-bold text-white">{t('Get started')}</div>
                                <div className="mb-0.5">
                                    <Link href={'/pricing'}>{t('Pricing')}</Link>
                                </div>
                                <div>
                                    <Link href={'/'}>{t('Start your free trial')}</Link>
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 font-bold text-white">{t('Resources')}</div>
                                <div className="mb-0.5">
                                    <Link href={'/testimonials'}>{t('Customer stories')}</Link>
                                </div>
                                <div className="uppercase mb-0.5">
                                    <Link href={'/faq'}>{t('Faq')}</Link>
                                </div>
                                <div className="mb-0.5">
                                    <Link href={'/'}>{t('Support Center')}</Link>
                                </div>
                                <div>
                                    <Link href={'/contact-us'}>{t('Contact Us')}</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex-col md:flex-row justify-between border-t border-blue-450">
                        <div className="flex justify-end">
                            <div className="mr-10">
                                <Image
                                    src="/images/social/facebook.svg"
                                    width={15}
                                    height={15}
                                    layout="fixed"
                                    alt=""
                                />
                            </div>

                            <div className="mr-10">
                                <Image
                                    src="/images/social/instagram.svg"
                                    width={15}
                                    height={15}
                                    layout="fixed"
                                    alt=""
                                />
                            </div>

                            <div>
                                <Image
                                    className=""
                                    src="/images/social/linkedin.svg"
                                    width={15}
                                    height={15}
                                    layout="fixed"
                                    alt=""
                                />
                            </div>
                        </div>

                        <div className="flex flex-col float-right md:flex-row md:justify-end">
                            <div className="mr-0 text-right md:mr-5">
                                <Link href={'/'}>About Liveproshop</Link>
                            </div>
                            <div className="mr-0 text-right md:mr-5">
                                <Link href={'/'}>Cookies</Link>
                            </div>
                            <div className="mr-0 text-right md:mr-5">
                                <Link href={'/pages/privacy'}>Privacy</Link>
                            </div>
                            <div className="mr-0 text-right md:mr-5">
                                <a
                                    href="https://www.liveproshop.com/terms-and-conditions"
                                    target="_blank"
                                    rel="noreferrer">
                                    Terms
                                </a>
                            </div>
                            <div className="text-white">
                                @ {moment().format('YYYY')} Liveproshop
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
