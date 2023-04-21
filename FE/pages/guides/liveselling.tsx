import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from 'next-auth/client';
// import { useTranslations } from 'next-intl';

export default function Index() {
    // const t = useTranslations();

    return (
        <>
            <Head>
                <title>LiveProshop - Guide pour commerçant - Section Vente en Live</title>
            </Head>

            <div className="block-white-8 mr-10 white-shadow-medium mt-10 text-xl max-w-4xl text-gray-350">
                <div className="flex border border-l-0 border-r-0 border-t-0 pb-2.5 mb-10">
                    <h2 className="dark-blue-header">
                        Guide pour commerçant - Section Vente en Live
                    </h2>
                </div>
                La section consacrée à la vente en Live vous permet de programmer et de gérer vos
                diffusions en direct.
                <div className="p-4 my-12 bg-gray-100 rounded-lg text-base text-gray-500">
                    <h2 className="dark-blue-header mb-4">Remarque !</h2>
                    {`Avant de créer une nouvelle session de Live, vous devez aller dans "Paramètres".
                    Vous y trouverez deux onglets, "Paramètres" et "Livraison", qui vous permettront
                    de sélectionner les méthodes d'expédition qui seront disponibles pour vos
                    spectateurs, de définir la durée du panier, de fixer le seuil de livraison
                    gratuite et de définir la fenêtre de livraison gratuite. Il est essentiel de
                    vérifier et de régler ces paramètres avant de lancer un flux afin d'éviter tout
                    malentendu. Vous pouvez lire plus d'informations sur chaque paramètre ici:`}
                    <Link href={'/settings'}>Settings</Link>.
                </div>
                <h1 className="text-gray-350 font-bold text-3xl mb-2">
                    Comment programmer une nouvelle session
                </h1>
                1. Afin de programmer une nouvelle session de Live, vous devez connecter votre
                compte LiveProshop à votre compte Facebook en utilisant ce bouton.
                <div className="my-12 mb-24 text-center">
                    <Image src="/images/guides/liveselling1.png" width={994} height={425} />
                </div>
                2. Afin de programmer une nouvelle session de Live, vous devez connecter votre
                compte LiveProshop à votre compte Facebook en utilisant ce bouton.
                <div className="my-12 mb-24 text-center">
                    <Image src="/images/guides/liveselling2.png" width={992} height={432} />
                </div>
                {`3. Dans la fenêtre ouverte, vous devez sélectionner la date et l'heure de votre Live`}
                <div className="my-12 mb-24 text-center">
                    <Image src="/images/guides/liveselling3.png" width={374} height={327} />
                </div>
                4. Vous pouvez maintenant voir votre live programmé dans la liste des lives
                ci-dessous.
                <div className="my-12 mb-24 text-center">
                    <Image src="/images/guides/liveselling4.png" width={795} height={400} />
                </div>
                <h1 className="text-gray-350 font-bold text-3xl mb-2">Comment arrêter le live?</h1>
                {`Pour arrêter votre session Live, vous devez le faire manuellement dans la liste de
                vos live en cliquant sur le bouton "Arrêter le Live".`}
                <div className="my-12 mb-24 text-center">
                    <Image src="/images/guides/liveselling5.png" width={795} height={517} />
                </div>
                <div className="p-4 my-12 bg-gray-100 rounded-lg text-base text-gray-500">
                    <h2 className="dark-blue-header mb-4">Note!:</h2>
                    The session will not stop by itself. You need to do it manually. If you don’t
                    stop the session the system will continue to parse viewers comment even if the
                    session is over! If you leave a record of your session and enable commenting,
                    viewers will be able to comment and the system will parse their comments and
                    create orders. So make sure you stoped the session
                </div>
                <h1 className="text-gray-350 font-bold text-3xl mb-2">Remarque!</h1>
                {`Le live ne s'arrêtera pas automatiquement. Vous devez le faire manuellement. Si vous
                n'arrêtez pas le live, le système continuera à analyser les commentaires des
                internautes même si votre live est terminé ! Si vous laissez votre live “en replay”
                et que vous activez les commentaires, les internautes pourront commenter et le
                système analysera leurs commentaires et créera des commandes. Assurez-vous donc
                d'avoir arrêté la session si vous ne souhaitez plus recevoir de commandes.`}
            </div>
        </>
    );
}

export async function getServerSideProps(context: any) {
    const { locale } = context;
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: { destination: `/${locale === 'fr' ? '' : `${locale}/`}auth/signin` }
        };
    }

    return {
        props: {
            session,
            locale,
            messages: {
                ...require(`../../messages/${locale}.json`)
            }
        }
    };
}
