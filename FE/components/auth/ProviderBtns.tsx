import { signIn } from 'next-auth/client';
import Image from 'next/image';

export default function ProviderBtns({ Providers, locale }: { Providers: any; locale: string }) {
    return (
        <>
            {Object.values(Providers).map((provider: any) => {
                const onClick = () =>
                    signIn(provider.id, {
                        callbackUrl: `${window.location.origin}${
                            locale === 'fr' ? '' : `/${locale}`
                        }/dashboard`
                    });

                if (provider.id === 'facebook') {
                    return (
                        <button
                            key={provider.id}
                            onClick={onClick}
                            className="image-btn bg-social-facebook text-white">
                            <Image
                                width={24}
                                height={24}
                                src="/images/social/facebook-solid.svg"
                                layout="fixed"
                                alt=""
                            />
                            <div className="text-sm ml-2.5">Continue with Facebook</div>
                        </button>
                    );
                }

                return;
            })}
        </>
    );
}
