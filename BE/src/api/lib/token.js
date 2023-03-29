import userModel from '../models/User.js';
import { setCookie } from './utils.js';

// TODO redis and check if user has refresh token
export function getTokensAndSetCookies (req, res, userId, userEmail) {
    const token = userModel.generateJWT(userEmail, userId);
    const refreshToken = userModel.generateRefreshToken(userId);
    const refreshTokenLifeTime = Number(process.env.LOGIN_TOKEN_LIFE_REFRESH) * 1000; // in ms
    const tokenLifeTime = Number(process.env.LOGIN_TOKEN_LIFE) * 1000; // in ms
    setCookie('rt', refreshToken, refreshTokenLifeTime, req, res);
    setCookie('jwt', token, tokenLifeTime, req, res);

    return { token, refreshToken };
}
