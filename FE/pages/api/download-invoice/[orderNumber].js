import { getSession } from 'next-auth/client';
import { authHeader } from '../../../lib/functions';
import axios from 'axios';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;

export default async function handler(req, res) {
    // const router = useRouter();
    const session = await getSession({ req });
    const headers = authHeader(session.user.email);
    // console.log(router);
    console.log('QUERY params', req.query.locale);
    try {
        const response = await axios.get(
            `${baseUrl}/payments/download-invoice/${req.query.orderNumber}?locale=fr`,
            {
                headers,
                responseType: 'stream',
                validateStatus: () => true
            }
        );
        res.writeHead(response.status, response.headers);
        response.data.pipe(res);
        return null;
    } catch (error) {
        console.error(error);
    }
}

// export async function getServerSideProps(context: any) {
//     const { req, locale } = context;
//     const session = await getSession({ req });
//
//     if (session) {
//         return {
//             redirect: { destination: '/' }
//         };
//     }
//
//     return {
//         props: {
//             locale: locale
//         }
//     };
// }
