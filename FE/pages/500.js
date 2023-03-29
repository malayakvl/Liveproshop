import Link from 'next/link';
import FullLayout from '../components/layout/FullLayout';

export default function Custom500() {
    return (
        <div className="container bg-white rounded-lg pt-4 pb-10 m-auto mt-6 md:mt-15 lg:px-12 xl:px-16">
            <div className="text-center pt-8">
                <h1 className="text-8xl text-center block">500</h1>
                <h1 className="text-6xl font-medium py-8 text-center block">oops! Error 500</h1>
                <Link href="/">
                    <a
                        className="block bg-gradient-to-r from-green-300 to-blue-300 mb-10 mt-10
                            hover:from-pink-500 hover:to-orange-500 text-white px-4 py-2 rounded">
                        Home
                    </a>
                </Link>
            </div>
        </div>
    );
}

Custom500.Layout = FullLayout;

export const getStaticProps = ({ locale = 'fr' }) => {
    return {
        props: {
            messages: {
                ...require(`../messages/${locale}.json`)
            }
        }
    };
};
