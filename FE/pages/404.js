import Link from 'next/link';
// import Image from 'next/image';
// import FullLayout from '../components/layout/FullLayout';
import Full404Layout from '../components/layout/404Layout';

export default function Custom404() {
    return (
        <div className="container main-bg bg-white rounded-lg pt-4 pb-10 m-auto mt-6 md:mt-15 lg:px-12 xl:px-16">
            <div className="text-center pt-8">
                <div className="cat-bg w-full">
                    <h1 className="page-heading font-[90px] text-center block">404</h1>
                    <h1 className="page-heading text-6xl font-medium py-8 text-center block">
                        {/*Oops! Page not found :(*/}
                        Oops! Page non trouvée
                    </h1>
                    <p className="text-2xl pb-5 px-12 font-medium">
                        {/*The page you are looking for does not exist.*/}
                        La page que vous recherchez n`existe pas.
                        <br />
                        Il a peut-être été déplacé ou supprimé.
                        {/*It might have been moved or deleted.*/}
                    </p>
                </div>
                <Link href="/">
                    <a
                        className="block gradient-btn mb-10 mt-10
                            ">
                        Home
                    </a>
                </Link>
                {/*<Image src="/images/cat.svg" width={100} height={300} layout="fill" />*/}
            </div>
        </div>
    );
}

Custom404.Layout = Full404Layout;

export const getStaticProps = ({ locale }) => {
    return {
        props: {
            messages: {
                ...require(`../messages/${locale}.json`)
            }
        }
    };
};
