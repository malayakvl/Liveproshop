import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';

export default function Footer() {
    return (
        <footer className="w-full">
            <div className="px-4 pb-4 tracking-wide text-sm text-blue-350 bg-blue-550 flex h-full justify-between flex-col md:py-16 md:px-32">
                <div className="flex flex-col md:flex-row justify-between">
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
                    <div className="mb-4 flex flex-com md:flex-row md:mb-0">
                        <div className="mr-9">
                            <div className="mb-2 font-bold text-white">Get started</div>
                            <div className="mb-2">
                                <Link href={'/pricing'}>Pricing</Link>
                            </div>
                            <div>
                                <Link href={'/'}>Start your free trial</Link>
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 font-bold text-white">Resources</div>
                            <div className="mb-2">
                                <Link href={'/'}>Customer Stories</Link>
                            </div>
                            <div className="uppercase mb-2">
                                <Link href={'/'}>Faq</Link>
                            </div>
                            <div className="mb-2">
                                <Link href={'/'}>Support Center</Link>
                            </div>
                            <div>
                                <Link href={'/'}>Contact us</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex-col md:flex-row justify-between border-t border-blue-450">
                    <div className="flex">
                        <div className="md:mr-10">
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

                    <div className="flex flex-col">
                        <div className="mr-5">
                            <Link href={'/'}>About Liveproshop</Link>
                        </div>
                        <div className="mr-5">
                            <Link href={'/'}>Cookies</Link>
                        </div>
                        <div className="mr-5">
                            <Link href={'/pages/privacy'}>Privacy</Link>
                        </div>
                        <div className="mr-5">
                            <a
                                href="https://www.liveproshop.com/terms-and-conditions"
                                target="_blank"
                                rel="noreferrer">
                                Terms
                            </a>
                        </div>
                        <div className="text-white">@ {moment().format('YYYY')} Liveproshop</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
