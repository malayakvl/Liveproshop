import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Multisafe: React.FC = () => {
    const t = useTranslations();
    const { locale }: any = useRouter();

    return (
        <div className="mt-10 block-white-8 block-white-8-multi white-shadow-big">
            <div className="block-white-8 mr-10 white-shadow-medium mt-10 text-xl max-w-4xl text-gray-350">
                <div className="flex border border-l-0 border-r-0 border-t-0 pb-2.5 mb-10 ">
                    <h2 className="text-[16px] dark-blue-header dark-logged">
                        {t('Guide - Multisafepay - rules for sellers')}
                    </h2>
                </div>
                <div className="text-[16px] leading-[24px] md:text-[20px] md:leading-[30px]">
                    {t('mguide_1')}
                </div>
                <div className="block">
                    <Link href="https://merchant.multisafepay.com/signup?partnerid=10736441">
                        <a
                            target="_blank"
                            className="font-bold text-[16px] md:text-[20px] font-blue-550">
                            https://merchant.multisafepay.com/signup?partnerid=10736441
                        </a>
                    </Link>
                </div>
                <div className="text-[16px] leading-[24px] md:text-[20px] md:leading-[30px] mt-4 block">
                    {t('mtext_1')}
                </div>
                <div className="text-[16px] leading-[24px] md:text-[20px] md:leading-[30px] mt-4 block">
                    {t('mguide_2')}
                </div>
                <div className="my-12 mb-24 text-center">
                    <Image src="/images/multisafe/ms-1.png" width={994} height={425} />
                </div>
                <div className="p-4 my-12 font-medium bg-gray-75 rounded-lg text-[14px] md:text-base text-gray-550">
                    <h2 className="dark-blue-header mb-4 text-[18px]">{t('Remarque!')}</h2>
                    {locale == 'en' && (
                        <div className="text-base font-medium text-gray-550">
                            <span className="block mb-3.5">
                                Minimum value: Smallest expected amount
                            </span>
                            <span className="block mb-3.5">Average value: Your average basket</span>
                            <span className="block mb-3.5">
                                Maximum amount: Highest amount with some margin;{' '}
                                <b>
                                    Otherwise transactions above this threshold will be blocked by
                                    VISA or Mastercard Annual volume with VISA and with VISA and
                                    Mastercard
                                </b>
                            </span>
                            <span className="block">Annual volume with VISA and Mastercard</span>
                        </div>
                    )}
                    {locale == 'fr' && (
                        <div className="text-base font-medium text-gray-550">
                            <span className="block mb-3.5">
                                Valeur minimale: Plus petit montant attendu
                            </span>
                            <span className="block mb-3.5">
                                Valour moyenne: Votre panier moyen)
                            </span>
                            <span className="block mb-3.5">
                                Montant maximum : Le montant le plus élevé avec une marge
                                supplémentaire ;{' '}
                                <b>
                                    sinon les montants plus élevés avec VISA ou Mastercard seront
                                    Mastercard seront bloqués
                                </b>
                            </span>
                            <span className="block">Volume annuel avec VISA et Mastercard</span>
                        </div>
                    )}
                </div>
                <div className="my-12 mb-12 text-center">
                    <Image src="/images/multisafe/msp-1.png" width={994} height={425} />
                </div>
                {locale == 'en' && (
                    <div className="text-[16px] leading-[24px] md:text-[20px] md:leading-[30px]">
                        <span className="block mb-3">
                            1.2. The most common company will be divided into shares.
                        </span>
                        <span className="block mb-3">
                            Any individual holding more than 25% of the company`s shares is a UBO
                            MUST be registered.
                        </span>
                        <span className="block mb-3">
                            The % interest means the percentage of shares you hold in the company or
                            voting rights.
                        </span>
                        <span className="block mb-3">
                            If you have any questions / doubts, please contact your account manager:
                        </span>
                    </div>
                )}
                {locale == 'fr' && (
                    <div className="text-[16px] leading-[24px] md:text-[20px] md:leading-[30px]">
                        <span className="block mb-3">
                            1.2. La société la plus courante sera divisée en actions.
                        </span>
                        <span className="block mb-3">
                            Toute personne physique détenant plus de 25 % des parts de la société
                            est une UBO* et doit être enregistrée.
                        </span>
                        <span className="block mb-3">
                            Le % d`intérêt signifie le pourcentage d`actions que vous détenez dans
                            la société ou le droit de vote
                        </span>
                        <span className="block mb-3">
                            Si vous avez des questions / doutes, contactez votre gestionnaire de
                            compte:
                        </span>
                    </div>
                )}
                <div className="text-[16px] leading-[24px] md:text-[20px] md:leading-[30px]">
                    <span className="block mb-3">
                        <a
                            href=" mailto:Jesse.Lingier@multisafepay.com"
                            className="font-bold text-[16px] md:text-[20px]">
                            Jesse.Lingier@multisafepay.com
                        </a>
                    </span>
                    <span className="block mb-1">
                        Mobile: <a href="tel:+32468564734">+32 468 56 47 34</a>
                    </span>
                    <span className="block mb-1">
                        Office BE: <a href="tel:+3238081241">+32 3 808 12 41</a>
                    </span>
                    <span className="block mb-1">
                        Office FR: <a href="tel:+33182884860">+33 182 884 860</a>
                    </span>
                    <span className="block mt-2">*UBO = Bénéficiaire Effectif Ultime (BEU)</span>
                </div>
                <div className="my-12 mb-12 text-center">
                    <Image src="/images/multisafe/msp-2.png" width={994} height={425} />
                </div>
                <span className="text-[16px] leading-[24px] md:text-[20px] md:leading-[30px]">
                    {t('mtext_2')}
                </span>
                <div className="my-12 mb-12 text-center">
                    <Image src="/images/multisafe/msp-3.png" width={994} height={425} />
                </div>
                <div className="p-4 my-12 font-medium bg-gray-75 rounded-lg text-[14px] md:text-base text-gray-550">
                    <h2 className="dark-blue-header mb-4 text-[18px]">{t('Remarque!')}</h2>
                    {locale == 'en' && (
                        <div className="text-base font-medium text-gray-550">
                            PayPal is not activated immediately. You must send an e-mail to your
                            account manager to activate it. Once activated, you can configure your
                            Paypal in your payment method settings (
                            <a
                                href="https://merchant.multisafepay.com/payment-methods"
                                target="_blank"
                                rel="noreferrer">
                                https://merchant.multisafepay.com/payment-methods
                            </a>
                            )
                        </div>
                    )}
                    {locale == 'fr' && (
                        <div className="text-base font-medium text-gray-550">
                            PayPal n`est pas activé immédiatement. Vous devez envoyer un e-mail à
                            votre responsable de compte pour l`activer Une fois activé, dans vos
                            paramètres de mode de payments (
                            <a
                                href="https://merchant.multisafepay.com/payment-methods"
                                target="_blank"
                                rel="noreferrer">
                                https://merchant.multisafepay.com/payment-methods
                            </a>
                            ) vous popover configurer votre Paypal.
                        </div>
                    )}
                </div>
                <span className="text-[16px] leading-[24px] md:text-[20px] md:leading-[30px]">
                    {t('mtext_3')}
                </span>
                <div className="my-12 mb-12 text-center">
                    <Image src="/images/multisafe/msp-4.png" width={994} height={425} />
                </div>
                <span className="block mb-1 text-[16px] leading-[24px] md:text-[20px] md:leading-[30px]">
                    {t('mtext_4')}
                </span>
                <span className="block mb-1 text-[16px] leading-[24px] md:text-[20px] md:leading-[30px]">
                    {t('mtext_5')}
                </span>
                <span className="block mb-1 text-[16px] leading-[24px] md:text-[20px] md:leading-[30px]">
                    {t('mtext_6')} <b>https://liveproshop.com</b>
                </span>
                <span className="block mt-8 mb-2 text-[16px] leading-[24px] md:text-[20px] md:leading-[30px]">
                    {t('mtext_7')}
                </span>
                <div className="my-12 mb-12 text-center">
                    <Image src="/images/multisafe/msp-5.png" width={994} height={218} />
                </div>
                {locale == 'en' && (
                    <div className="text-[16px] leading-[24px] md:text-[20px] md:leading-[30px]">
                        5. After that, go here{' '}
                        <a
                            className="font-bold"
                            href="https://liveproshop.com/en/payment-setting"
                            target="_blank"
                            rel="noreferrer">
                            https://liveproshop.com/en/payment-setting
                        </a>
                        &nbsp;copied key into the field and click the “Save” button.
                    </div>
                )}
                {locale == 'fr' && (
                    <div>
                        5. Ensuite, rendez-vous sur votre interface LiveProShop{' '}
                        <a
                            className="font-bold"
                            href="https://liveproshop.com/en/payment-setting"
                            target="_blank"
                            rel="noreferrer">
                            https://liveproshop.com/en/payment-setting
                        </a>
                        . &nbsp;Insérez la clé copiée dans le champ et cliquez sur le bouton
                        “Enregistrer”.
                    </div>
                )}
            </div>
        </div>
    );
};
export default Multisafe;
