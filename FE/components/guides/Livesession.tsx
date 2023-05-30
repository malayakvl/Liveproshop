import Image from 'next/image';
import React from 'react';
import { useTranslations } from 'next-intl';

// interface PropsContent {
//     locale: string;
// }
const Livesession: React.FC = () => {
    const t = useTranslations();

    return (
        <>
            <h2 className="dark-blue-header block mb-[20px]">
                {t('Guide pour commerçant - Section Vente en Live')}
            </h2>
            <span className="text-gray-350 text-[20px] leading-[30px]">
                {t(`La section consacrée à la vente en Live vous permet de programmer et de
                gérer vos vos diffusions en direct.`)}
            </span>
            <div className="rounded-gray-block">
                <h2 className="dark-blue-header mb-4 text-[18px]">Remarque</h2>
                <div className="text-base text-gray-550">
                    {`Avant de créer une nouvelle session de Live, vous devez aller dans "Paramètres".
                    Vous y trouverez deux onglets, "Paramètres" et "Livraison", qui vous permettront
                    de sélectionner les méthodes d'expédition qui seront disponibles pour vos
                    spectateurs, de définir la durée du panier, de fixer le seuil de livraison
                    gratuite et de définir la fenêtre de livraison gratuite. Il est essentiel de
                    vérifier et de régler ces paramètres avant de lancer un flux afin d'éviter tout
                    malentendu. Vous pouvez lire plus d'informations sur chaque paramètre ici:`}
                </div>
            </div>
            <h2 className="dark-blue-header block mb-[20px] mt-[30px]">
                {t('Comment programmer une nouvelle session')}
            </h2>
            {/*How to Facebook and Livesession*/}
            <span className="text-gray-350 text-[20px] leading-[30px]">
                {t(`1. Afin de programmer une nouvelle session de Live, vous devez connecter
                votre compte LiveProshop à votre compte Facebook en utilisant ce bouton.`)}
            </span>
            <div className="my-12 mb-24 text-center">
                <Image src="/images/guides/liveselling1.png" width={994} height={425} />
            </div>
            <span className="text-gray-350 text-[20px] leading-[30px]">
                {t(`2. Afin de programmer une nouvelle session de Live, vous devez connecter
                votre compte LiveProshop à votre compte Facebook en utilisant ce bouton.`)}
            </span>
            <div className="my-12 mb-24 text-center">
                <Image src="/images/guides/liveselling2.png" width={992} height={432} />
            </div>
            <span className="ext-gray-350 text-[20px] leading-[30px]">
                {`3. Dans la fenêtre ouverte, vous devez sélectionner la date et l'heure de votre Live`}
            </span>
            <div className="my-12 mb-24 text-center">
                <Image src="/images/guides/liveselling3.png" width={374} height={327} />
            </div>
            <span className="ext-gray-350 text-[20px] leading-[30px]">
                {`4. Vous pouvez maintenant voir votre live programmé dans la liste des
                livesci-dessous.`}
            </span>
            <div className="my-12 mb-24 text-center">
                <Image src="/images/guides/liveselling4.png" width={795} height={400} />
            </div>
            <h2 className="dark-blue-header block mb-[20px] mt-[30px]">
                {t('Comment arrêter le live?')}
            </h2>
            <span className="text-gray-350 text-[20px] leading-[30px]">
                {`Pour arrêter votre session Live, vous devez le faire manuellement dans la liste de
                vos live en cliquant sur le bouton "Arrêter le Live".`}
            </span>
            <div className="my-12 mb-24 text-center">
                <Image src="/images/guides/liveselling5.png" width={795} height={517} />
            </div>

            <div className="rounded-gray-block">
                <h2 className="dark-blue-header mb-4 text-[18px]">Note!:</h2>
                <div className="text-base text-gray-550">
                    {t(`The session will not stop by itself. You need to do it manually. If you
                            don’t stop the session the system will continue to parse viewers comment
                            session is over! If you leave a record of your session and enable
                            commenting, viewers will be able to comment and the system will parse
                            their create orders. So make sure you stoped the session`)}
                </div>
            </div>
        </>
    );
};
export default Livesession;
