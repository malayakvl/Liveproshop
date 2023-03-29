import { BehaviorSubject } from 'rxjs';
import axios from 'axios';
import store from '../app/store';
import { syncFbAction } from '../redux/user/actions';
import { setErrorToastAction } from '../redux/layouts';
import { signIn } from 'next-auth/client';
import { showLoaderAction } from '../redux/layouts/actions';

// import { history } from '_helpers';

// const baseUrl = `${process.env.REACT_APP_API_URL}/accounts`;
const accountSubject = new BehaviorSubject(null);

export const accountService = {
    loginFB,
    logout,
    syncFB,
    registerFB
};

async function syncFB() {
    // login with facebook then authenticate with the API to get a JWT auth token
    const { authResponse } = await new Promise(window.FB.login);
    // const authResponse = {
    //     accessToken:
    //         'EAArS9KI0vagBAILslZArSEh0l8gLYZAQTbjg8DOzkC7A17ZC3445oUb16yWQPJq4GJ65nJi7H1gZCWUDFduDf8WuaowacJjU9QWoxapQc3ZCEZAwHPZBUukMPXOR8JkZCSzZAugLZCmk3hhcLQZCoW6IW5uILLrO6YZBSEHUPXzrWkgp39ptKgGI86dsRvjJjqUDM6F2yfIlZC3viKZAZC0ZB0EA0SzT',
    //     userID: '2763630843946760',
    //     expiresIn: 5541,
    //     signedRequest:
    //         'UVLZg3i-hV26oubUREkooPPLh97OGsyOubTKhBpOQPE.eyJ1c2VyX2lkIjoiMjc2MzYzMDg0Mzk0Njc2MCIsImNvZGUiOiJBUURUa0F3TVpuNjRtQlNzdXV6XzFsdmEtVlNKVGtwblVQNEcyTE5wNEhocGNNMUJidDR0ci1pZUNjVUpydWNwREZhWndDTnBEdFhjeHA0dnhUaGtjbEZjSkZZTGxwSG1QUF95TW9GQ2pHRThac0U1NlRlc0t6bnlwbDZxR0dmUW1STVF6U1hMVWRDZ0tMcTBlZmI5enRCVDNVWERYeXVCcFNFSnkzX3YxcXNyZnAwR2JLOUhMM0J0LVBFUl9ock1oQkRCUFRkNHZfUmFZcmZ3ZjlnbTdQNU5BamxhalRsajViTHVDY3Z0UWlpWU94QThyaFRyUkhaXzZPVkt4ZlFZeG15WENRVk5SMUNIczNuVEQydDZKRm0zRDZrSi1PczU5UEwzLUZCaFZ2WklsaFlOa0FRREd4LWpxMFBqUDdaTER0Rk5VWFd4MmQ4ZF8yWm81Q09EOUVpbCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjQzMjAzNjU5fQ',
    //     graphDomain: 'facebook',
    //     data_access_expiration_time: 1650992801
    // };
    store.dispatch(syncFbAction(authResponse));
}

async function registerFB(roleId) {
    // login with facebook then authenticate with the API to get a JWT auth token
    const { authResponse } = await new Promise(window.FB.login);
    // const authResponse = {
    //     accessToken:
    //         'EAArS9KI0vagBAHQBZACSnqonUDbwBFg0ssXFWuKnSZBZAWRiGGapIjMFipjD4P7pHnNOWXZAT0DWxk72D1fjFzy29TWuxO4SbHdz6mYKEoj0psziiZC15nq7rwaxdavwOqfeyeM2KwF8ApwmKV5610IGBzFSRLWc6HVT5eSag8m9o4w9f31e55N1F7NevZATS1wejBtkGUmQkZAKo7XPl5A',
    //     userID: '2763630843946760',
    //     expiresIn: 5541,
    //     signedRequest:
    //         'UVLZg3i-hV26oubUREkooPPLh97OGsyOubTKhBpOQPE.eyJ1c2VyX2lkIjoiMjc2MzYzMDg0Mzk0Njc2MCIsImNvZGUiOiJBUURUa0F3TVpuNjRtQlNzdXV6XzFsdmEtVlNKVGtwblVQNEcyTE5wNEhocGNNMUJidDR0ci1pZUNjVUpydWNwREZhWndDTnBEdFhjeHA0dnhUaGtjbEZjSkZZTGxwSG1QUF95TW9GQ2pHRThac0U1NlRlc0t6bnlwbDZxR0dmUW1STVF6U1hMVWRDZ0tMcTBlZmI5enRCVDNVWERYeXVCcFNFSnkzX3YxcXNyZnAwR2JLOUhMM0J0LVBFUl9ock1oQkRCUFRkNHZfUmFZcmZ3ZjlnbTdQNU5BamxhalRsajViTHVDY3Z0UWlpWU94QThyaFRyUkhaXzZPVkt4ZlFZeG15WENRVk5SMUNIczNuVEQydDZKRm0zRDZrSi1PczU5UEwzLUZCaFZ2WklsaFlOa0FRREd4LWpxMFBqUDdaTER0Rk5VWFd4MmQ4ZF8yWm81Q09EOUVpbCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjQzMjAzNjU5fQ',
    //     graphDomain: 'facebook',
    //     data_access_expiration_time: 1651002797
    // };
    authResponse.roleId = roleId;
    if (authResponse) {
        await getAccountData(authResponse);
    } else {
        store.dispatch(setErrorToastAction('Could no autherntificate'));
    }
}

async function loginFB() {
    // login with facebook then authenticate with the API to get a JWT auth token
    const { authResponse } = await new Promise(window.FB.login);
    // const authResponse = {
    //     accessToken:
    //         'EAArS9KI0vagBAGRrb0gSuSgMOfsuEZBM8InZCyVf0JcKCE2RVmRc5NZCfGs3zNR5zIrxMdzc7baTo2Gra9LLYKcZAZB40ZBpmWU1xpZB3kWJtBgRA7Ge1ZAqJx8wvZAGMidWimhyzHrtsz0pyNAjUxXhtOXLUJaFv7MGYyPf9QskObO5TCsBjbP6yxkJGHFbOxSXRwyoiSH3nCC8MZCEZB7tSzm',
    //     userID: '2763630843946760',
    //     expiresIn: 5541,
    //     signedRequest:
    //         'UVLZg3i-hV26oubUREkooPPLh97OGsyOubTKhBpOQPE.eyJ1c2VyX2lkIjoiMjc2MzYzMDg0Mzk0Njc2MCIsImNvZGUiOiJBUURUa0F3TVpuNjRtQlNzdXV6XzFsdmEtVlNKVGtwblVQNEcyTE5wNEhocGNNMUJidDR0ci1pZUNjVUpydWNwREZhWndDTnBEdFhjeHA0dnhUaGtjbEZjSkZZTGxwSG1QUF95TW9GQ2pHRThac0U1NlRlc0t6bnlwbDZxR0dmUW1STVF6U1hMVWRDZ0tMcTBlZmI5enRCVDNVWERYeXVCcFNFSnkzX3YxcXNyZnAwR2JLOUhMM0J0LVBFUl9ock1oQkRCUFRkNHZfUmFZcmZ3ZjlnbTdQNU5BamxhalRsajViTHVDY3Z0UWlpWU94QThyaFRyUkhaXzZPVkt4ZlFZeG15WENRVk5SMUNIczNuVEQydDZKRm0zRDZrSi1PczU5UEwzLUZCaFZ2WklsaFlOa0FRREd4LWpxMFBqUDdaTER0Rk5VWFd4MmQ4ZF8yWm81Q09EOUVpbCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjQzMjAzNjU5fQ',
    //     graphDomain: 'facebook',
    //     data_access_expiration_time: 1651004629
    // };
    if (authResponse) {
        store.dispatch(showLoaderAction(true));
        signIn('credentials_sdkfacebook_login', authResponse);
    } else {
        store.dispatch(setErrorToastAction('Could no autherntificate'));
    }
}

async function getAccountData(authResponse) {
    axios
        .get(
            `https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=${authResponse.accessToken}`
        )
        .then((response) => {
            const { data } = response;
            if (data.error) {
                store.dispatch(setErrorToastAction('Could no autherntificate'));
            }
            data.accessToken = authResponse.accessToken;
            // data.providerId = authResponse.userID,
            data.expirationTime = authResponse.data_access_expiration_time;
            data.callbackUrl = `${window.location.origin}/dashboard`;
            data.roleId = authResponse.roleId;
            store.dispatch(showLoaderAction(true));
            signIn('credentials_sdkfacebook', data);
        });
}

// async function apiAuthenticate(authResponse) {
//     // authenticate with the api using a facebook access token,
//     // on success the api returns an account object with a JWT auth token
//     const response = await axios.post(
//         `${baseUrl}/fb-authenticate`,
//         { accessToken },
//         {
//             headers: {
//                 ...authHeader(state.user.user.email)
//             }
//         }
//     );
//     const account = response.data;
//     accountSubject.next(account);
//     startAuthenticateTimer();
//     return account;
// }

function logout() {
    // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
    window.FB.api('/me/permissions', 'delete', null, () => window.FB.logout());
    stopAuthenticateTimer();
    accountSubject.next(null);
    history.push('/login');
}

// helper methods

let authenticateTimeout;

// function startAuthenticateTimer() {
//     // parse json object from base64 encoded jwt token
//     const jwtToken = JSON.parse(atob(accountSubject.value.token.split('.')[1]));
//     // set a timeout to re-authenticate with the api one minute before the token expires
//     const expires = new Date(jwtToken.exp * 1000);
//     const timeout = expires.getTime() - Date.now() - 60 * 1000;
//     const { accessToken } = window.FB.getAuthResponse();
//     authenticateTimeout = setTimeout(() => apiAuthenticate(accessToken), timeout);
// }

function stopAuthenticateTimer() {
    // cancel timer for re-authenticating with the api
    clearTimeout(authenticateTimeout);
}
