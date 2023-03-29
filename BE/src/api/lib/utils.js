import { logger } from '../../common/logger.js';

export const deleteCookie = (cookieName, req, res) => {
    const expiredDate = new Date(Date.now() - 9000000000);
    const domain = getDomain(req);
    const path = '/';
    const cookieToDelete = req.cookies[cookieName];
    const cookieParams = { domain: domain, path: path, expires: expiredDate, httpOnly: true };
    res.cookie(cookieName, cookieToDelete, cookieParams);
};

export const setCookie = (cookieName, cookieValue, lifeTime, req, res) => {
    const expiredDate = new Date(Date.now() + lifeTime * 2);
    const domain = getDomain(req);
    const path = '/';
    const cookieParams = { domain: domain, path: path, expires: expiredDate, httpOnly: true };
    res.cookie(cookieName, cookieValue, cookieParams);
    if (process.env.NODE_ENV === 'development') {
        logger.log(
            'info',
            'Setup cookies:',
            { message: { domain: domain, path: path, expires: expiredDate, httpOnly: true } }
        );
    }
};

export const getDomain = () => {
    return `.${process.env.APPLICATION_URL}`;
};
