import { getSession } from 'next-auth/client';
import { authHeader } from '../../../lib/functions';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;

export default async function handler(req, res) {
    const session = await getSession({ req });
    const headers = authHeader(session.user.email);

    try {
        const response = await axios.get(
            `${baseUrl}/payments/download-invoice/${req.query.orderNumber}`,
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
